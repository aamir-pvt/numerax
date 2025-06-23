import mongoose from "mongoose";
const CompanyStockSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
        },
        ProfitMargin: Number,
        PERatio: Number,
        ReturnOnEquityTTM: Number,
        ReturnOnAssetsTTM: Number,
        EPSEstimateCurrentYear: Number,
        DividendShare: Number,
        DivdendYield: Number,
        PriceBookMRQ: Number,
        PriceSales: Number,
        FiftyTwoWeekHigh: Number,
        FiftyTwoWeekLow: Number,
        MarketCapitalizationMln: Number,
        open: Number,
        close: Number,
        volume: Number,
        Description: String,
        CompanyName: String,
        EBITDA: Number,
        PriceSalesTTM: Number,
        CorporateExecutive: String,
        Index:String,
        Exchange: String,
        Industry: String,
        Sector: String,
        Beta: Number,
        FiftyDayMA: Number,
        TwoHundredDayMA: Number,
        SharesShort: Number,
        SharesShortPriorMonth: Number,
        ShortRatio: Number,
        ShortPercent: Number,
    },
    { timestamps: true }
);

export const CompanyStockModel = mongoose.model(
    "companystock",
    CompanyStockSchema
);
