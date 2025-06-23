import { FilterType, RangeQueryOptions } from "./types.d";

export const SharesShort: RangeQueryOptions = {
    displayName: "Shares Short",
    type: FilterType.Technical,
    options: [
        {
            optionName: "Any",
            optionValue: {}
        }
    ]
}
