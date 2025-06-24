import json
import math
import datetime
import re
import os
from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
import replicate
import pandas as pd
from prophet import Prophet
from fastapi import HTTPException


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["financial_dashboard"]
collection = db["company_financials"]

replicate_client = replicate.Client(api_token=os.getenv("REPLICATE_API_TOKEN"))

class ChartRequest(BaseModel):
    query: str
    chartType: str

def sanitize_for_json(obj):
    if isinstance(obj, dict):
        return {k: sanitize_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_for_json(v) for v in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    else:
        return obj

def json_safe(obj):
    if isinstance(obj, (datetime.datetime, datetime.date)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

@app.post("/generate-chart")
async def generate_chart(req: ChartRequest):
    sample_data = list(collection.find({}, {"_id": 0}).limit(5))
    
    sample_data.append({"Country": "Test", "Year": 2014, "Profit": float('nan')})

    prompt = f"""
You are a highly reliable data assistant that generates **MongoDB aggregation pipelines** for visualization purposes.

The user requested a chart of type "{req.chartType}" and asked: "{req.query}"

--- Sample Data Format ---
These documents are **only a sample** to infer structure. The actual dataset is larger and more diverse.
{json.dumps(sample_data, indent=2, default=json_safe)}

--- Strict Requirements ---
1. ⚠️ All output must be a **valid MongoDB aggregation pipeline** as a **JSON array**, parsable by `json.loads()`.
2. ⚠️ All field names and string values must be enclosed in **double quotes**.
3. ✅ Always apply filters exactly as described by the user (e.g., `Year = 2014`) even if not shown in sample.
- Always use `$match` to exclude invalid numbers:
    - `"$ne": null` removes nulls.
    - `"$gt": -Infinity` ensures NaN is excluded.
    - Combine both like: `{{ "$ne": null, "$gt": -Infinity }}`
4. ✅ When using numeric fields (e.g., "Profit", "Sales"), you **must always** exclude invalid values:
   - ❗ Always use a `$match` stage to exclude `null` values explicitly:
     `{{ "Profit": {{ "$ne": null }} }}`
   - ✅ You may use `$toDouble` to safely cast numeric strings, but **do not** cast inside `$sum`.
   - ❌ Do NOT use `$cond`, `$isNumber`, `$type`, or `$eq: "number"` — they do NOT safely filter.
   - If you forget to exclude nulls, your result will be `NaN` or fail silently.
5. ✅ If a field contains strings representing numbers (e.g., `"Profit": "1234.5"`), cast it using `$toDouble` or `$convert`.
6. ✅ If the user's query references a field **not found** in the sample, still generate a syntactically valid query using that field.
7. ✅ If the user's query is unanswerable due to missing fields or structure, return a **valid pipeline that produces empty results**, e.g.:

[
  {{
    "$match": {{
      "_nonexistentField": "unavailable"
    }}
  }}
]

--- Output Format Rules ---
- ❌ DO NOT include explanations, markdown, comments, or extra text.
- ✅ DO ONLY return a single JSON array of MongoDB stages.
"""

    output = replicate_client.run(
        "meta/meta-llama-3-8b-instruct",
        input={
            "prompt": prompt,
            "system_prompt": "You are a helpful MongoDB assistant. Output ONLY a valid aggregation array.",
            "temperature": 0.2,
            "top_p": 0.95,
            "max_tokens": 500,
            "stop_sequences": "<|end_of_text|>,<|eot_id|>",
            "prompt_template": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n"
        }
    )

    result_str = "".join(str(t) for t in output).strip()
    print("\n--- LLM RAW RESPONSE ---\n")
    print(result_str)
    print("\n--- END RAW RESPONSE ---\n")

    try:
        match = re.search(r"\[\s*{[\s\S]+?}\s*\]", result_str)
        if not match:
            return {"error": "LLM did not return valid aggregation JSON", "raw": result_str}
        mongo_query = json.loads(match.group(0))
        print("\n--- Parsed MongoDB Query ---\n")
        print(json.dumps(mongo_query, indent=2, default=json_safe))
        print("\n--- END Parsed Query ---\n")
    except Exception as e:
        return {"error": "Failed to parse MongoDB query from LLM", "raw": result_str, "exception": str(e)}

    try:
        raw_data = list(collection.aggregate(mongo_query))
        data = sanitize_for_json(raw_data)

        if not data:
            return {"error": "Aggregation returned no results", "query": mongo_query}
        
        print("\n--- Aggregation Results ---\n")
        print(json.dumps(data, indent=2, default=json_safe))    

        sample_row = data[0]
        xField = next((key for key in sample_row if key.lower() in ["product", "category", "region", "x", "year", "month"]), list(sample_row.keys())[0])
        yFields = [k for k in sample_row if k != xField]
        formatted_data = [{"name": row.get(xField, "N/A"), **{key: row[key] for key in yFields}} for row in data]

        return sanitize_for_json({
            "data": formatted_data,
            "xField": xField,
            "yFields": yFields,
            "query": mongo_query
        })

    except Exception as e:
        return {"error": "MongoDB aggregation failed", "exception": str(e), "query": mongo_query}


class ForecastRequest(BaseModel):
    product: str
    duration: str
    target_metric: str = "Profit"

def parse_duration(duration: str) -> int:
    duration = duration.lower().strip()
    if "month" in duration:
        return int(duration.split()[0])
    if "quarter" in duration:
        return int(duration.split()[0]) * 3
    if "year" in duration:
        return int(duration.split()[0]) * 12
    raise ValueError("Invalid duration format.")


@app.post("/predict/performance")
async def predict_performance(req: ForecastRequest):
    try:
        months_to_forecast = parse_duration(req.duration)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    distinct_products = collection.distinct("Product")
    print(distinct_products)

    # Get historical data
    query = {
        "$expr": {
            "$eq": [
                {"$toLower": {"$trim": {"input": "$Product"}}},
                req.product.strip().lower()
            ]
        },
        req.target_metric: {"$ne": None}
    }
    print(f"Querying MongoDB with: {json.dumps(query, indent=2)}")
    records = list(collection.find(query))

    print(f"Found {len(records)} records for product '{req.product}' with target metric '{req.target_metric}'.")
    if not records:
        raise HTTPException(status_code=404, detail="No data found for this product.")

    df = pd.DataFrame(records)

    if "Month" not in df.columns:
        df["Month"] = 1  # assume Jan if missing

    df["ds"] = pd.to_datetime(df["Year"].astype(str) + "-" + df["Month"].astype(str) + "-01")
    df["y"] = df[req.target_metric].astype(float)

    df = df[["ds", "y"]].sort_values("ds")

    model = Prophet()
    model.fit(df)

    future = model.make_future_dataframe(periods=months_to_forecast, freq="M")
    forecast = model.predict(future)

    predicted = forecast[["ds", "yhat"]].tail(months_to_forecast)

    # Use LLaMA to generate narrative insight
    prompt = f"""
    You are a financial analytics assistant. You are given historical and forecasted performance data of a product.

    🔢 Product: {req.product}
    📈 Target Metric: {req.target_metric}
    🗓️ Forecast Duration: {req.duration}

    📊 Historical Data (Monthly):
    {json.dumps(df.tail(6).to_dict(orient="records"), indent=2, default=str)}

    📉 Forecasted Values:
    {json.dumps(predicted.to_dict(orient="records"), indent=2, default=str)}

    Give a one-line business insight based on the historical and forecasted performance of the product, focusing on trends in sales or profit and actionable recommendations. Just one line simeple and clear, no more than 20 words.
    Give only one short sentence summarizing the business insight based on the product's historical and forecasted performance. Do not add any explanations or follow-ups. Return only one sentence. Do not include anything else, such as greetings, context, or endings.
    """

    narrative_output = replicate_client.run(
        "meta/meta-llama-3-8b-instruct",
        input={
            "prompt": prompt,
            "system_prompt": "You are a helpful financial assistant. Provide professional insights based on the data provided.",
            "temperature": 0.2,
            "top_p": 0.9,
            "max_tokens": 200,
            "stop": ["\n", ".", "!", "?", "assistant"],
            "stop_sequences": "assistant",
            "prompt_template": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n"
        }
    )

    narrative_text = "".join(str(t) for t in narrative_output).strip()

    return {
        "product": req.product,
        "target_metric": req.target_metric,
        "duration": req.duration,
        "forecast": [
            {"month": row["ds"].strftime("%Y-%m"), "predicted_value": round(row["yhat"], 2)}
            for _, row in predicted.iterrows()
        ],
        "insight": narrative_text
    }
