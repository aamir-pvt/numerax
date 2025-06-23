import { Beta, DividendYield, Exchange, FiftyDayMA, FiftyTwoWeekHigh, FiftyTwoWeekLow, Industry, MarketCapitalizationMln, PERatio, ReturnOnAssetsTTM, ReturnOnEquityTTM, Sector, SharesShort, SharesShortPriorMonth, ShortPercent, ShortRatio, TwoHundredDayMA } from "./queries";
import { StockDataQueryOptions } from "./queries/types";

/**
 * Inialized object containing necessary information about stock metrics and options that can be used to
 * query information from the backend
 */
export const defaultCompanyQueryOptions: StockDataQueryOptions = {
    selections: {
        Exchange,
        Sector,
        Industry
    },
    filter: {
        // ProfitMargin:
        PERatio, ReturnOnEquityTTM,
        ReturnOnAssetsTTM,
        // ReturnOnAssetsTTM: Number,
        // EPSEstimateCurrentYear: Number,
        // DividendShare: Number,
        // PriceBookMRQ: Number,
        // PriceSales: Number,
        DividendYield,
        FiftyTwoWeekHigh,
        FiftyTwoWeekLow,
        MarketCapitalizationMln,
        Beta,
        FiftyDayMA,
        TwoHundredDayMA,
        SharesShort,
        SharesShortPriorMonth,
        ShortPercent,
        ShortRatio
        // open: Number,
        // close: Number,
        // volume: Number,
        // Description: String,
        // CompanyName: String,
        // EBITDA: Number,
        // PriceSalesTTM: Number,
        // CorporateExecutive: String,
    },
};
