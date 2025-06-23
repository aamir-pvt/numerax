import axios from "axios";

export const downloadCompanyStocksCSV = (params: {
    searchQuery: string;
    filters?: Record<string, any>;
    timeout: number;
    selections?: Record<string, string>;
}) => {
    return axios.post(
        "http://localhost:8080/companies/download",
        {
            companySearch: params.searchQuery,
            filters: params.filters || {},
            selections: params.selections || {},
        },
        { timeout: params.timeout, responseType: "blob" }
    );
};
