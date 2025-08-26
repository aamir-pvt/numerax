from sqlalchemy.orm import Session
from sqlalchemy.sql import text

def search_tickers(db: Session, query: str | None = None) -> list[str]:
    if query:
        sql = text("""
            SELECT DISTINCT ticker FROM (
                SELECT ticker FROM eod_prices
                UNION
                SELECT ticker FROM etf_levels
            ) AS combined
            WHERE ticker ILIKE :prefix
            ORDER BY ticker
        """)
        result = db.execute(sql, {"prefix": f"{query}%"})
    else:
        sql = text("""
            SELECT DISTINCT ticker FROM (
                SELECT ticker FROM eod_prices
                UNION
                SELECT ticker FROM etf_levels
            ) AS combined
            ORDER BY ticker
        """)
        result = db.execute(sql)

    return [row[0] for row in result.fetchall()]
