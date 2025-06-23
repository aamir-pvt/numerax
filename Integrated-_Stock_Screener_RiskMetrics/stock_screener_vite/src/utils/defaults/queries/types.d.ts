
/**
 * Type for any Filter option requiring a range
 */
export type FilterRange = {
    Min?: number;
    Max?: number;
};

// type OptionValue = string | FilterRange;
export type FilterOption<T> = {
    optionName: string;
    optionValue: T;
};

/**
 * Category of the StockMetric
 */
export enum FilterType {
    Descriptive = "Descriptive",
    Fundamental = "Fundamental",
    Technical = "Technical"
}

/**
 * Stock information that can be filtered using a FilterRange i.e filters
 * that have a min and max
*/
export type StockMetricsRanges = "PERatio"
    | "ReturnOnEquityTTM"
    | "MarketCapitalizationMln"
    | "DividendYield"
    | "FiftyTwoWeekLow"
    | "FiftyTwoWeekHigh"
    | "ReturnOnAssetsTTM"
    | "Beta"
    | "FiftyTwoWeekHigh"
    | "FiftyTwoWeekLow"
    | "FiftyDayMA"
    | "TwoHundredDayMA"
    | "SharesShort"
    | "SharesShortPriorMonth"
    | "ShortRatio"
    | "ShortPercent"

/**
 * Stock information that can be filtered using a Selection i.e just a single string value
 */
export type StockMetricsSelections = "Exchange" | "Sector" | "Industry"

export type RangeQueryOptions = { displayName: string; options: FilterOption<FilterRange>[]; type: FilterType }

export type SelectionQueryOptions = { displayName: string; options: FilterOption<string>[], type: FilterType }

/**
 * Contains options related to querying Stocks
 */
export type StockDataQueryOptions = {
    selections: Record<StockMetricsSelections, SelectionQueryOptions>
    filter: Record<
        StockMetricsRanges,
        RangeQueryOptions
    >;
}
