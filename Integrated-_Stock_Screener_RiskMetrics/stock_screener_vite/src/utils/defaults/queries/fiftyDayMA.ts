import { FilterType, RangeQueryOptions } from "./types.d";

export const FiftyDayMA: RangeQueryOptions = {
    displayName: "MA(50)",
    type: FilterType.Technical,
    options: [
        {
            optionName: "Any",
            optionValue: {}
        },
        {
            optionName: "Under $1",
            optionValue: { Max: 1 }
        },
        {
            optionName: "Under $2",
            optionValue: { Max: 2 }
        },
        {
            optionName: "Under $3",
            optionValue: { Max: 3 }
        },
        {
            optionName: "Under $4",
            optionValue: { Max: 4 }
        },
        {
            optionName: "Under $5",
            optionValue: { Max: 5 }
        },
        {
            optionName: "Under $6",
            optionValue: { Max: 6 }
        },
        {
            optionName: "Under $7",
            optionValue: { Max: 7 }
        },
        {
            optionName: "Under $10",
            optionValue: { Max: 10 }
        },
        {
            optionName: "Under $20",
            optionValue: { Max: 20 }
        },
        {
            optionName: "Under $30",
            optionValue: { Max: 30 }
        },
        {
            optionName: "Under $40",
            optionValue: { Max: 40 }
        },
        {
            optionName: "Under $40",
            optionValue: { Max: 40 }
        },
    ]
}
