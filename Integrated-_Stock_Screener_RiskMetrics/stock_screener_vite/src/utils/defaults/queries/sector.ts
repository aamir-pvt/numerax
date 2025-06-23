import { FilterType, SelectionQueryOptions } from "./types.d";

export const Sector: SelectionQueryOptions =  {
            displayName: "Sector",
            type: FilterType.Descriptive,
            options: [
                { optionName: "Any", optionValue: "" },
                { optionName: "Healthcare", optionValue: "Healthcare" },
                { optionName: "Technology", optionValue: "Technology" },
                {
                    optionName: "Consumer Cyclical",
                    optionValue: "Consumer Cyclical",
                },
                {
                    optionName: "Communication Services",
                    optionValue: "Communciation Services",
                },
                { optionName: "Energy", optionValue: "Energy" },
                { optionName: "Financial", optionValue: "Energy" },
                { optionName: "Industrials", optionValue: "Industrials" },
            ],
        }
