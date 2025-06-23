import React from "react";
import { FilterRange, StockMetricsRanges, StockMetricsSelections, } from "../utils/defaults/queries/types.d";
import { defaultCompanyQueryOptions } from "../utils/defaults/companyQueryDefaults"
import axios from "axios";

export type Company = {
    _id: string;
    Name: string;
    CompanyName: string;
    MarketCapitalizationMln: number;
    ProfitMargin: number;
    PERatio: number;
    ReturnOnEquityTTM: number;
    ReturnOnAssetsTTM: number;
    EPSEstimateCurrentYear: number;
    DividendShare: number;
    DivdendYield: number;
    PriceBookMRQ: number;
    PriceSales: number;
    FiftyTwoWeekHigh: number;
    FiftyTwoWeekLow: number;
    open: number;
    close: number;
    volume: number;
    Description: string;
    EBITDA: number;
    PriceSalesTTM: number;
    CorporateExecutive: string;
    Exchange: string;
    Industry: string;
    Sector: string;
}

export type FilterRequest = {
    companySearch: string
    selections: Partial<Record<StockMetricsSelections, string>>,
    filter: Partial<Record<StockMetricsRanges, FilterRange>>
}

const defaultFilterRequest: FilterRequest = {
    companySearch: "",
    selections: {
    },
    filter: {
        MarketCapitalizationMln: {},
    },
};

const API_URL = import.meta.env.VITE_LOCAL_API


export const useCompanyStockFilter = () => {
    const queryOptions = defaultCompanyQueryOptions;

    const [companies, setCompanies] = React.useState<Company[]>([]);

    const [totalCount, setTotalCount] = React.useState();
    const [totalPages, setTotalPages] = React.useState();
    const [companySearch, setCompanySearch] = React.useState("");

    React.useEffect(() => {
        const searchTimeout = setTimeout(() => {
            setFilterRequest((prevState) => {
                return { ...prevState, companySearch: companySearch };
            });
        }, 500);
        return () => {
            clearTimeout(searchTimeout);
        };
    }, [companySearch]);

    const queryPropArray = Object.keys(queryOptions.filter).concat(
        Object.keys(queryOptions.selections)
    );

    const [filterRequest, setFilterRequest] =
        React.useState(defaultFilterRequest);

    React.useEffect(() => {
        const controller = new AbortController();


        const timeoutHandler = setTimeout(() => {
            // console.log("[useCompanyStockFilter -> This is the FilterRequest -> \n", filterRequest);
            console.log(API_URL)
            axios
                .post(
                    `${API_URL}/companies`,
                    {
                        page: 1,
                        companySearch: filterRequest.companySearch,
                        filters: filterRequest.filter,
                        selections: filterRequest.selections,
                    },
                    { signal: controller.signal }
                )
                .then((data) => {
                    setCompanies(data.data.data);
                    setTotalCount(data.data.totalCount);
                    setTotalPages(data.data.totalPages)
                })
                .catch((err): void => {
                    console.log("Error from API:", err)
                    console.error(err.response)
                });
        }, 500);
        return () => {
            clearTimeout(timeoutHandler);
            controller.abort();
        };
    }, [filterRequest]);

    return {
        queryOptions,
        setFilterRequest,
        filterRequest,
        queryPropArray,
        companySearch,
        setCompanySearch,
        totalCount,
        totalPages,
        companies,
    };
};
