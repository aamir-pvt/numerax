import React from "react";
import Filter from "./Filter";

import { useNavigate } from "react-router";
import {
    FilterOption,
    FilterRange,
    FilterType,
} from "../../../utils/defaults/queries/types.d";
import { FilterRequest } from "@/hooks/useCompanyStockFilter";
import { Fundamentals } from "../../../../../Populate-MongoDB/src/utils/requests/getCompanyStockDetails";

interface Props {
    queryPropArray: string[];
    queryOptions: {
        selections: Record<
            string,
            {
                displayName: string;
                type: FilterType;
                options: FilterOption<string>[];
            }
        >;
        filter: Record<
            string,
            {
                displayName: string;
                type: FilterType;
                options: FilterOption<FilterRange>[];
            }
        >;
    };
    setFilterRequest: (value: React.SetStateAction<FilterRequest>) => void;
    searchParams: URLSearchParams;
    pathname: string;
    displayFilter: boolean;
}

export default function HomepageFilterSection({
    queryPropArray,
    queryOptions,
    setFilterRequest,
    searchParams,
    pathname,
    displayFilter,
}: Props) {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = React.useState<FilterType>(
        FilterType.Descriptive
    );
    const handleCurrentTab = (type: FilterType) => {
        setCurrentTab(type);
    };
    console.log();
    return (
        <div
            className={`w-full space-y-4 transform ${
                displayFilter ? "translate-x-0" : "-translate-y-full"
            }  duration-200 ease-in-out`}
        >
            {/* Filter Title */}
            <h1 className="text-2xl">Filters:</h1>
            {/* All Filter Options */}
            <div>
                {/* Tabs */}
                <div className="flex">
                    {Object.values(FilterType).map((key, index) => (
                        <h1
                            className={`px-5 py-2 ${
                                key === currentTab
                                    ? "border-l-[1px] border-r-[1px] border-t-[1px] border-black border-b-[1px] bg-gray-100"
                                    : ""
                            } border-b-white cursor-pointer`}
                            key={index}
                            onClick={() => handleCurrentTab(key)}
                        >
                            {key}
                        </h1>
                    ))}
                </div>
                <div className="w-full rounded-lg border-[1px] border-black p-3 grid gap-y-3 grid-cols-5 bg-gray-200 ">
                    {queryPropArray.map((filterName, index) => {
                        const queryProp: {
                            displayName: string;
                            type: FilterType;
                            options:
                                | FilterOption<FilterRange>[]
                                | FilterOption<string>[];
                        } =
                            queryOptions.filter[filterName] ||
                            queryOptions.selections[filterName];
                        return queryProp.options.length === 0 ||
                            currentTab !== queryProp.type ? null : (
                            <Filter
                                displayName={queryProp.displayName}
                                key={index}
                                filterName={filterName}
                                onChange={(
                                    filterName,
                                    selectedFilterOption
                                ) => {
                                    setFilterRequest((prevState) => ({
                                        ...prevState,
                                        ...(queryOptions.filter[filterName]
                                            ? {
                                                  filter: {
                                                      ...prevState.filter,
                                                      [filterName]:
                                                          selectedFilterOption.optionValue,
                                                  },
                                              }
                                            : queryOptions.selections[
                                                  filterName
                                              ]
                                            ? {
                                                  selections: {
                                                      ...prevState.selections,
                                                      [filterName]:
                                                          selectedFilterOption.optionValue,
                                                  },
                                              }
                                            : {}),
                                    }));

                                    searchParams.set(
                                        filterName,
                                        selectedFilterOption.optionName
                                    );
                                    navigate(
                                        `${pathname}?${searchParams.toString()}`
                                    );
                                }}
                                defaultSelected={
                                    queryProp.options.find(
                                        (option) =>
                                            option.optionName ===
                                            searchParams.get(filterName)
                                    ) || queryProp.options[0]
                                }
                                options={queryProp.options}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
