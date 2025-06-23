const mongoose = require("mongoose");

const schema = mongoose.Schema;

const companySchema = new schema(
    {
        Name: {
            type: String,
        },
        ProfitMargin: Number,
        PERatio: Number,
        ReturnOnEquityTTM: Number,
        ReturnOnAssetsTTM: Number,
        EPSEstimateCurrentYear: Number,
        DivdendYield: Number,
        DividendShare: Number,
        PriceBookMRQ: Number,
        PriceSales: Number,
        MarketCapitalizationMln: Number,
        open: Number,
        close: Number,
        volume: Number,
        Description: String,
        CompanyName: String,
        EBITDA: Number,
        PriceSalesTTM: Number,
        CorporateExecutive: String,
        Exchange: String,
        Industry: String,
        Sector: String,
        // Technicals
        FiftyTwoWeekHigh: Number,
        FiftyTwoWeekLow: Number,
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

const Company = mongoose.model("companystock", companySchema);

module.exports = Company;
