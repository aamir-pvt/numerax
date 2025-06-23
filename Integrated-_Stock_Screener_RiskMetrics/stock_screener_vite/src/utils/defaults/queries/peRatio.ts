import { FilterType, RangeQueryOptions } from "./types.d";

export const PERatio: RangeQueryOptions = {
            displayName: "P/E",
            type: FilterType.Fundamental,
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
        }
