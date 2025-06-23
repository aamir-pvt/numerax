import axios from "axios";

// const LOCAL_API_URL = "http://localhost:8080/companies/download";
// const LOCAL_API_URL_SSL = "https://localhost:8443/companies";
// const AZURE_API_URL = "http://52.136.117.170:8080/companies/download"; 


const LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL
// const LOCAL_API_URL_SSL = import.meta.env.VITE_LOCAL_API_URL_SSL
// const AZURE_API_URL = import.meta.env.VITE_AZURE_API_URL
const AZURE_API_URL_SSL = import.meta.env.VITE_AZURE_API_URL_SSL



export const downloadCompanyStocksCSV = (params: {
    searchQuery: string;
    filters?: Record<string, any>;
    timeout: number;
    selections?: Record<string, string>;
}) => {
    return axios.post(
        AZURE_API_URL_SSL,
        {
            companySearch: params.searchQuery,
            filters: params.filters || {},
            selections: params.selections || {},
        },
        { timeout: params.timeout, responseType: "blob" }
    );
};
