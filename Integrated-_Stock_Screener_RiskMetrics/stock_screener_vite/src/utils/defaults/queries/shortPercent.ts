import { FilterType, RangeQueryOptions } from "./types.d";

export const ShortPercent: RangeQueryOptions = {
    displayName: "Short Percent",
    type: FilterType.Technical,
    options: [
        {
            optionName: "Any",
            optionValue: {}
        }
    ]
}
