import { FilterType, RangeQueryOptions } from "./types.d";

export const SharesShortPriorMonth: RangeQueryOptions = {
    displayName: "Shares Short PM",
    type: FilterType.Technical,
    options: [
        {
            optionName: "Any",
            optionValue: {}
        }
    ]
}
