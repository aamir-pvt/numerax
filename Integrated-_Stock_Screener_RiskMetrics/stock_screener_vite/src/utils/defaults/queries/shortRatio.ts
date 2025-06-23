import { FilterType, RangeQueryOptions } from "./types.d";

export const ShortRatio: RangeQueryOptions = {
    displayName: "Short Ratio",
    type: FilterType.Technical,
    options: [
        {
            optionName: "Any",
            optionValue: {}
        }
    ]
}
