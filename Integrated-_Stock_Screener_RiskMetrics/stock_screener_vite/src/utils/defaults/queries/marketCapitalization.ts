import { FilterType, RangeQueryOptions } from './types.d';

export const MarketCapitalizationMln:RangeQueryOptions = {
            displayName: "MarketCap",
            type: FilterType.Descriptive,
            options: [
                {
                    optionName: "Any",
                    optionValue: {},
                },
                {
                    optionName: "Mega (200bln and more)",
                    optionValue: { Min: 200000 },
                },
                {
                    optionName: "Large (10bln to 200bln)",
                    optionValue: { Min: 10000, Max: 200000 },
                },
                {
                    optionName: "Mid (2bln to $10bln)",
                    optionValue: { Min: 2000, Max: 10000 },
                },
                {
                    optionName: "Micro (over $50mln)",
                    optionValue: { Min: 50 },
                },
                {
                    optionName: "-Micro (under $300mln)",
                    optionValue: { Max: 300 },
                },
            ],
        }
