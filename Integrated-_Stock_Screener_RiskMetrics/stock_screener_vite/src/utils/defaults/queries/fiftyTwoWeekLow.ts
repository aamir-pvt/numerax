import { FilterType, RangeQueryOptions } from "./types.d";

export const FiftyTwoWeekLow: RangeQueryOptions = {
    displayName: "52-Week High",
    type: FilterType.Technical,
    options: [
        {
            optionName: "Any",
            optionValue: {},
        },
        {
            optionName: "5 and above",
            optionValue: { Min: 5 }
        },
        {
            optionName: "10 and Low",
            optionValue: { Min: 10 }
        },
        {
            optionName: "15 and above",
            optionValue: { Min: 15 },
        },
        {
            optionName: "20 and above",
            optionValue: { Min: 20 }
        },
        {
            optionName: "30 and above",
            optionValue: { Min: 30 }
        },
        {
            optionName: "40 and above",
            optionValue: { Min: 40 }
        },
        {
            optionName: "50 and above",
            optionValue: { Min: 50 }
        },
        {
            optionName: "60 and above",
            optionValue: { Min: 60 }
        },
        {
            optionName: "70 and above",
            optionValue: { Min: 70 }
        },
        {
            optionName: "80 and above",
            optionValue: { Min: 80 }
        },
        {
            optionName: "90 and above",
            optionValue: { Min: 90 }
        },
        {
            optionName: "100 and above",
            optionValue: { Min: 100 }
        },
        {
            optionName: "120 and above",
            optionValue: { Min: 120 }
        },
        {
            optionName: "150 and above",
            optionValue: { Min: 150 }
        },
        {
            optionName: "200 and above",
            optionValue: { Min: 200 }
        },
        {
            optionName: "300 and above",
            optionValue: { Min: 300 }
        },
        {
            optionName: "500 and above",
            optionValue: { Min: 500 }
        },
        {
            optionName: "0 to 3",
            optionValue: { Min: 0, Max: 3 }
        },
        {
            optionName: "0 to 5",
            optionValue: { Min: 0, Max: 5 }
        },
        {
            optionName: "0 to 10",
            optionValue: { Min: 0, Max: 10 }
        },
    ]
}
