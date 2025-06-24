import pandas as pd
from pymongo import MongoClient

df = pd.read_csv("Cleaned_Financials.csv")

df["Date"] = pd.to_datetime(df["Date"], errors="coerce")

client = MongoClient("mongodb://localhost:27017/")
db = client["financial_dashboard"]
collection = db["company_financials"]

collection.drop()

collection.insert_many(df.to_dict("records"))
print("✅ Uploaded to MongoDB successfully")
