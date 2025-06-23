import { FilterType, SelectionQueryOptions } from "./types.d";

export const Exchange: SelectionQueryOptions = {
            displayName: "Exchange",
            type: FilterType.Descriptive,
            options: [
                { optionName: "Any", optionValue: "" },
                { optionName: "AMEX", optionValue: "AMEX" },
                { optionName: "NASDAQ", optionValue: "NASDAQ" },
                { optionName: "NYSE", optionValue: "NYSE" },
            ],
        }
