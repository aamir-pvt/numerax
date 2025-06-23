import { FilterType, SelectionQueryOptions } from "./types.d";

export const Industry:  SelectionQueryOptions= {
            displayName: "Industry",
            type: FilterType.Descriptive,
            options: [
                { optionName: "Any", optionValue: "" },
                {
                    optionName: "Aerospace & Defence",
                    optionValue: "Aerosapce & Defence",
                },
                { optionName: "Airlines", optionValue: "Airlines" },
                {
                    optionName: "Insurance-Diversified",
                    optionValue: "Insurance-Diversified",
                },
                { optionName: "Insurance-Life", optionValue: "Insurance-Life" },
                {
                    optionName: "Security & Protection Services",
                    optionValue: "Security & Protection Services",
                },
            ],
        }
