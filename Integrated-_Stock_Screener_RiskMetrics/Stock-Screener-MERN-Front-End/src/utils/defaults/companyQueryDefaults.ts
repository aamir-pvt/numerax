export type FilterRange = {
    Min?: number;
    Max?: number;
};

// type OptionValue = string | FilterRange;
export type FilterOption<T> = {
    optionName: string;
    optionValue: T;
};

export const defaultCompanyQueryOptions: {
    selections: Record<
        string,
        { displayName: string; options: FilterOption<string>[] }
    >;
    filter: Record<
        string,
        { displayName: string; options: FilterOption<FilterRange>[] }
    >;
} = {
    selections: {
        Exchange: {
            displayName: "Exchange",
            options: [
                { optionName: "Any", optionValue: "" },
                { optionName: "AMEX", optionValue: "AMEX" },
                { optionName: "NASDAQ", optionValue: "NASDAQ" },
                { optionName: "NYSE", optionValue: "NYSE" },
            ],
        },
        Sector: {
            displayName: "Sector",
            options: [
                { optionName: "Any", optionValue: "" },
                { optionName: "Healthcare", optionValue: "Healthcare" },
                { optionName: "Technology", optionValue: "Technology" },
                {
                    optionName: "Consumer Cyclical",
                    optionValue: "Consumer Cyclical",
                },
                {
                    optionName: "Communication Services",
                    optionValue: "Communciation Services",
                },
                { optionName: "Energy", optionValue: "Energy" },
                { optionName: "Financial", optionValue: "Energy" },
                { optionName: "Industrials", optionValue: "Industrials" },
            ],
        },
        Industry: {
            displayName: "Industry",
            options: [
                { optionName: "Any", optionValue: "" },
                {
                    optionName: "Aerospace & Defence",
                    optionValue: "Aerosapce & Defence",
                },
                { optionName: "Airlines", optionValue: "Airlines" },
                {
                    optionName: "Insurance-Diversified",
                    optionValue: "Insurance-Diversified",
                },
                { optionName: "Insurance-Life", optionValue: "Insurance-Life" },
                {
                    optionName: "Security & Protection Services",
                    optionValue: "Security & Protection Services",
                },
            ],
        },
    },
    filter: {
        // ProfitMargin:
        PERatio: {
            displayName: "P/E",
            options: [
                {
                    optionName: "Any",
                    optionValue: {},
                },
                {
                    optionName: "Low (<15)",
                    optionValue: { Max: 15 },
                },
                {
                    optionName: "Profitable (>0)",
                    optionValue: {
                        Min: 0,
                    },
                },
                {
                    optionName: "High (>50)",
                    optionValue: {
                        Min: 50,
                    },
                },
                {
                    optionName: "Under 5",
                    optionValue: {
                        Max: 5,
                    },
                },
                {
                    optionName: "Under 10",
                    optionValue: {
                        Max: 10,
                    },
                },
                {
                    optionName: "Under 15",
                    optionValue: {
                        Max: 15,
                    },
                },
                {
                    optionName: "Under 20",
                    optionValue: {
                        Max: 20,
                    },
                },
                {
                    optionName: "Under 25",
                    optionValue: {
                        Max: 25,
                    },
                },
                {
                    optionName: "Under 30",
                    optionValue: {
                        Max: 30,
                    },
                },
                {
                    optionName: "Under 35",
                    optionValue: {
                        Max: 35,
                    },
                },
                {
                    optionName: "Under 40",
                    optionValue: {
                        Max: 40,
                    },
                },
                {
                    optionName: "Under 45",
                    optionValue: {
                        Max: 45,
                    },
                },
                {
                    optionName: "Under 50",
                    optionValue: {
                        Max: 50,
                    },
                },
            ],
        },
        ReturnOnEquityTTM: {
            displayName: "ROE",
            options: [
                {
                    optionName: "Any",
                    optionValue: {},
                },
                {
                    optionName: "Positive (>0%)",
                    optionValue: {
                        Min: 0,
                    },
                },
                {
                    optionName: "Negative (<0%)",
                    optionValue: {
                        Max: 0,
                    },
                },
                {
                    optionName: "Very Positive (>30%)",
                    optionValue: {
                        Min: 0.3,
                    },
                },
                {
                    optionName: "Very Negative (<-15%)",
                    optionValue: {
                        Max: -0.15,
                    },
                },
            ],
        },
        // ReturnOnAssetsTTM: Number,
        // EPSEstimateCurrentYear: Number,
        // DividendShare: Number,
        // PriceBookMRQ: Number,
        // PriceSales: Number,
        DividendYield: {
            displayName: "Dividend Yield",
            options: [
                {
                    optionName: "Any",
                    optionValue: {},
                },
                {
                    optionName: "None",
                    optionValue: {
                        Min: 0,
                        Max: 0,
                    },
                },
                {
                    optionName: "Positive",
                    optionValue: {
                        Min: 0,
                    },
                },
                {
                    optionName: "High >5%",
                    optionValue: {
                        Min: 0.05,
                    },
                },
                {
                    optionName: "Very High (>10%)",
                    optionValue: {
                        Min: 0.1,
                    },
                },
                {
                    optionName: "Over 1%",
                    optionValue: {
                        Min: 0.01,
                    },
                },
                {
                    optionName: "Over 2%",
                    optionValue: {
                        Min: 0.02,
                    },
                },
                {
                    optionName: "Over 3%",
                    optionValue: {
                        Min: 0.03,
                    },
                },
                {
                    optionName: "Over 4%",
                    optionValue: {
                        Min: 0.01,
                    },
                },
                {
                    optionName: "Over 5%",
                    optionValue: {
                        Min: 0.05,
                    },
                },
                {
                    optionName: "Over 6%",
                    optionValue: {
                        Min: 0.06,
                    },
                },
                {
                    optionName: "Over 7%",
                    optionValue: {
                        Min: 0.07,
                    },
                },
                {
                    optionName: "Over 8%",
                    optionValue: {
                        Min: 0.08,
                    },
                },
                {
                    optionName: "Over 9%",
                    optionValue: {
                        Min: 0.09,
                    },
                },
            ],
        },
        // FiftyTwoWeekHigh: {
        //     displayName: "52-Week Low",
        //     options: [
        //     ]
        // },
        // FiftyTwoWeekLow: {
        //     displayName:"52-Week High",
        //     options: [
        //         {
        //             optionName: "Any",
        //             optionValue: {},
        //         },
        //         {
        //             optionName: "Under 50",
        //             optionValue: {Min: 50}
        //         },
        //         {
        //             optionName: "50 to 100",
        //             optionValue: {Min: 50, Max: 100}
        //         },
        //         {
        //             optionName: "Above 200",
        //             optionValue: {Min: 200},
        //         },
        //         {
        //             optionName: "Below 200",
        //             optionValue: {Max: 200}
        //         },
        //         {
        //             optionName: "200 to 500",
        //             optionValue: {Min: 200, Max: 500}
        //         },
        //         {
        //             optionName: "200 to "
        //         }
        //     ]
        // },
        MarketCapitalizationMln: {
            displayName: "MarketCap",
            options: [
                {
                    optionName: "Any",
                    optionValue: {},
                },
                {
                    optionName: "Mega (200bln and more)",
                    optionValue: { Min: 200000 },
                },
                {
                    optionName: "Large (10bln to 200bln)",
                    optionValue: { Min: 10000, Max: 200000 },
                },
                {
                    optionName: "Mid (2bln to $10bln)",
                    optionValue: { Min: 2000, Max: 10000 },
                },
                {
                    optionName: "Micro (over $50mln)",
                    optionValue: { Min: 50 },
                },
                {
                    optionName: "-Micro (under $300mln)",
                    optionValue: { Max: 300 },
                },
            ],
        },
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
