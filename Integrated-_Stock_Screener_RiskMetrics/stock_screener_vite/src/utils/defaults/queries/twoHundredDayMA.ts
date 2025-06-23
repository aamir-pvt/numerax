import { FilterType, RangeQueryOptions } from "./types.d";

export const TwoHundredDayMA: RangeQueryOptions = {
    displayName: "MA(200)",
    type: FilterType.Technical,
    options: [
        {
            optionName: "Any",
            optionValue: {}
        }
    ]
}
