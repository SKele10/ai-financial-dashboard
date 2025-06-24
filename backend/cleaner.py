import pandas as pd

df = pd.read_csv("Financials.csv")

df.columns = df.columns.str.strip()

currency_columns = [
    "Units Sold", "Manufacturing Price", "Sale Price",
    "Gross Sales", "Discounts", "Sales", "COGS", "Profit"
]

for col in currency_columns:
    df[col] = (
        df[col]
        .str.replace(r"[\$,]", "", regex=True)
        .str.strip()
        .replace({"-": None, "": None})
    )
    df[col] = pd.to_numeric(df[col], errors="coerce")


df["Date"] = pd.to_datetime(df["Date"], errors='coerce')

df.to_csv("Cleaned_Financials.csv", index=False)

print("✅ Cleaned and saved as Cleaned_Financials.csv")
