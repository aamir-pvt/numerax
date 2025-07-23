import yfinance as yf

df = yf.download("^GSPC", start="2023-01-01", end="2023-12-31")
print(df)