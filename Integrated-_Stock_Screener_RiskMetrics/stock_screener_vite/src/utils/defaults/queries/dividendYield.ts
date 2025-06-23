import { FilterType, RangeQueryOptions } from "./types.d";

export const DividendYield: RangeQueryOptions = {
            displayName: "Dividend Yield",
            type: FilterType.Descriptive,
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
        }
