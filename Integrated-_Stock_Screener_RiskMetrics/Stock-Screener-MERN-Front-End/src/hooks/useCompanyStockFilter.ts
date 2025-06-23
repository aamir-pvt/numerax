import React from "react";
import { defaultCompanyQueryOptions } from "../utils/defaults/companyQueryDefaults";
import axios from "axios";

const defaultFilterRequest = {
    companySearch: "",
    selections: {},
    filter: {
        ProfitMargin: {},
        MarketCapitalizationMln: {},
    },
};
export const useCompanyStockFilter = () => {
    const queryOptions = defaultCompanyQueryOptions;

    const [companies, setCompanies] = React.useState<
        {
            _id: string;
            Name: string;
            CompanyName: string;
            MarketCapitalizationMln: number;
        }[]
    >([]);

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
            console.log(filterRequest);
            axios
                .post(
                    "http://localhost:8080/companies",
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
                })
                .catch((err) => console.error(err.response));
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
        companies,
    };
};
