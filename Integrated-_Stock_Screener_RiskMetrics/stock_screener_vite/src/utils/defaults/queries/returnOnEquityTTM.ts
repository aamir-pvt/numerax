import { FilterType, RangeQueryOptions } from "./types.d";

export const ReturnOnEquityTTM: RangeQueryOptions = {

            displayName: "ROA",
            type: FilterType.Fundamental,
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
        }
