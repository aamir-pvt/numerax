import { FilterType, RangeQueryOptions } from "./types.d";

export const Beta: RangeQueryOptions = {
            displayName: "beta",
            type: FilterType.Technical,
            options: [
                {
                    optionName: "Any",
                    optionValue: {

                    }
                },
                {
                    optionName: "Under 0",
                    optionValue: { Max: 0 }
                },
                {
                    optionName: "Under 0.5",
                    optionValue: { Max: 0.5 }
                },
                {
                    optionName: "Under 1",
                    optionValue: { Max: 1 }
                },
                {
                    optionName: "Under 1.5",
                    optionValue: { Max: 1.5 },
                },
                {
                    optionName: "Under 2",
                    optionValue: { Max: 2 }
                },
                {
                    optionName: "Over 0",
                    optionValue: { Min: 0 }
                },
                {
                    optionName: "Over 0.5",
                    optionValue: { Min: 0.5 }
                },
                {
                    optionName: "Over 1",
                    optionValue: { Min: 1 }
                },
                {
                    optionName: "Over 1.5",
                    optionValue: { Min: 1.5 },
                },
                {
                    optionName: "Over 2",
                    optionValue: { Min: 2 }
                },
                {
                    optionName: "Over 3",
                    optionValue: { Min: 3 }
                },
                {
                    optionName: "Over 4",
                    optionValue: { Min: 4 }
                },
                {
                    optionName: "0 to 0.5",
                    optionValue: { Min: 0, Max: 0.5 }
                },
                {
                    optionName: "0 to 1",
                    optionValue: { Min: 0, Max: 1 }
                },
                {
                    optionName: "0.5 to 1",
                    optionValue: { Min: 0.5, Max: 1}
                },
                {
                    optionName: "0.5 to 1.5",
                    optionValue: { Min: 0.5, Max: 1.5 }
                },
                {
                    optionName: "1 to 1.5",
                    optionValue: {Min: 1, Max: 1.5}
                },
                {
                    optionName: "1 to 2",
                    optionValue: {Min: 1, Max: 2}
                }
            ]
        }
