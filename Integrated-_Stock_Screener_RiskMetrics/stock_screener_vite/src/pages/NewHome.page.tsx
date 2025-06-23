import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { useCompanyStockFilter } from "../hooks/useCompanyStockFilter";
import { downloadCompanyStocksCSV } from "../services/requests/companyStock";

import HomepageButtonSection from "../components/pages/NewHome/HomepageButtonSection";
import HomepageSearchSection from "../components/pages/NewHome/HomepageSearchSection";
import HomepageFilterSection from "../components/pages/NewHome/HomepageFilterSection";
import HomepageTableSection from "../components/pages/NewHome/HomepageTableSection";
import {
    FilterRange,
    StockMetricsRanges,
    StockMetricsSelections,
} from "@/utils/defaults/queries/types.d";
import { useAppSelector } from "@/app/hooks";
import { BasketCompany, selectBasket } from "@/features/basket/basketSlice";

function NewHomePage() {
    // console.log("[NewHomePage] rendering ....")

    const [loadingInfo, setLoadingInfo] = useState<boolean>(true);
    // const dispatch = useAppDispatch();
    const basket = useAppSelector(selectBasket);

    // company stock filter hook
    const {
        queryOptions,
        queryPropArray,
        setFilterRequest,
        filterRequest,
        companySearch,
        setCompanySearch,
        companies,
    } = useCompanyStockFilter();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setLoadingInfo(companies.length === 0));

    // manage filter state with search params
    const { search, pathname } = useLocation();

    const searchParams = useMemo(() => {
        return new URLSearchParams(search);
    }, [search]);

    // onMount actions
    useEffect(() => {
        const queryParamFilters: Partial<
            Record<StockMetricsRanges, FilterRange>
        > = {};
        let rangeFilter: StockMetricsRanges;
        for (rangeFilter in queryOptions.filter) {
            const searchOption = queryOptions.filter[rangeFilter].options.find(
                (option) => option.optionName === searchParams.get(rangeFilter)
            );

            if (searchOption) {
                queryParamFilters[rangeFilter] = searchOption.optionValue;
            }
        }

        const queryParamSelections: Partial<
            Record<StockMetricsSelections, string>
        > = {};
        let selectionFilter: StockMetricsSelections;
        for (selectionFilter in queryOptions.selections) {
            const searchOption = queryOptions.selections[
                selectionFilter
            ].options.find(
                (option) =>
                    option.optionName === searchParams.get(selectionFilter)
            );

            if (searchOption) {
                queryParamSelections[selectionFilter] =
                    searchOption.optionValue;
            }
        }

        const querySearch = searchParams.get("search");
        if (querySearch) {
            setCompanySearch(querySearch);
        }

        setFilterRequest((prev) => {
            return {
                ...prev,
                filter: { ...prev.filter, ...queryParamFilters },
                selections: { ...prev.selections, ...queryParamSelections },
            };
        });
    }, []);

    const downloadCsv = () => {
        downloadCompanyStocksCSV({
            searchQuery: filterRequest.companySearch,
            filters: filterRequest.filter,
            timeout: 20000,
            selections: filterRequest.selections,
        })
            .then((res) => {
                const url = window.URL.createObjectURL(res.data);
                const a = document.createElement("a");
                a.href = url;
                a.download = "untitled.csv";
                a.click();
            })
            .catch((err) => console.error(err.response));
    };

    const [displayFilter, setDisplayFilter] = React.useState(true);
    const [showOverview, setShowOverview] = React.useState(true);
    const [showProfitability, setShowProfitability] = React.useState(false);
    const [showGrowth, setShowGrowth] = React.useState(false);

    const itemsPerPage = 20; // Adjust as needed
    // const totalPages = Math.ceil(companies.length / itemsPerPage);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentPage, setCurrentPage] = useState(1);

    // const handlePageChange = (pageNumber: number) => {
    //     setCurrentPage(pageNumber);
    // };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, companies.length);

    // const [stockInfo, setStockInfo] = useState<any[]>([]);
    const [stockPrices, setStockPrices] = useState<number[]>([]);
    const [peRatios, setPeRatios] = useState<number[]>([]);
    const [pbRatios, setPbRatios] = useState<number[]>([]);
    const [psRatios, setPsRatios] = useState<number[]>([]);
    const [profitMargins, setProfitMargins] = useState<number[]>([]);
    const [roes, setRoes] = useState<number[]>([]);
    const [roas, setRoas] = useState<number[]>([]);
    const [eps, setEps] = useState<number[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [revenueGrowths, setRevenueGrowths] = useState<number[]>([]);
    const [divYieldGrowths, setDivYieldGrowths] = useState<number[]>([]);
    const [marketCaps, setMarketCaps] = useState<number[]>([]);

    useEffect(() => {
        const fetchedStockPrices: number[] = [];
        const fetchedPeRatios: number[] = [];
        const fetchedPbRatios: number[] = [];
        const fetchedPsRatios: number[] = [];
        const fetchedProfitMargins: number[] = [];
        const fetchedRoes: number[] = [];
        const fetchedRoas: number[] = [];
        const fetchedEps: number[] = [];
        // const fetchedRevenueGrowths: number[] = []
        const fetchedDivYieldGrowths: number[] = [];
        const fetchedMarketCaps: number[] = [];

        companies.forEach((company) => {
            fetchedStockPrices.push(company.close);
            fetchedPeRatios.push(company.PERatio);
            fetchedPbRatios.push(company.PriceBookMRQ);
            fetchedPsRatios.push(company.PriceSalesTTM);
            fetchedProfitMargins.push(company.ProfitMargin);
            fetchedRoes.push(company.ReturnOnEquityTTM);
            fetchedRoas.push(company.ReturnOnAssetsTTM);
            fetchedEps.push(company.EPSEstimateCurrentYear);
            // fetchedRevenueGrowths.push();
            fetchedDivYieldGrowths.push(company.DivdendYield);
            fetchedMarketCaps.push(company.MarketCapitalizationMln);
        });

        setStockPrices(fetchedStockPrices);
        setPeRatios(fetchedPeRatios);
        setPbRatios(fetchedPbRatios);
        setPsRatios(fetchedPsRatios);
        setProfitMargins(fetchedProfitMargins);
        setRoes(fetchedRoes);
        setRoas(fetchedRoas);
        setEps(fetchedEps);
        // setRevenueGrowths(fetchedRevenueGrowths);
        setDivYieldGrowths(fetchedDivYieldGrowths);
        setMarketCaps(fetchedMarketCaps);

        setLoadingInfo(false);
    }, [companies, itemsPerPage]);

    const isCompanyInBasket = (companyCode: string) => {
        return basket.companies.some(
            (basketCompany: BasketCompany) => basketCompany.code === companyCode
        );
    };

    return (
        <main className="w-full pt-4">
            <div className="max-w-7xl mx-auto">
                <div className="absolute pt-4 ml-[36%]">
                    <HomepageButtonSection
                        setShowGrowth={setShowGrowth}
                        setShowOverview={setShowOverview}
                        setShowProfitability={setShowProfitability}
                    />
                </div>
                <div className="flex flex-col space-y-5 py-4">
                    {/* Search Section */}
                    <HomepageSearchSection
                        setCompanySearch={setCompanySearch}
                        companySearch={companySearch}
                        setDisplayFilter={setDisplayFilter}
                        displayFilter={displayFilter}
                        pathname={pathname}
                        searchParams={searchParams}
                    />
                    {/* Filter Section*/}
                    <div
                        className={`w-full overflow-hidden ${
                            displayFilter ? "max-h-[10000px]" : "max-h-0"
                        } transition-[max-height] duration-200 ease-in-out`}
                    >
                        <HomepageFilterSection
                            queryPropArray={queryPropArray}
                            setFilterRequest={setFilterRequest}
                            queryOptions={queryOptions}
                            searchParams={searchParams}
                            pathname={pathname}
                            displayFilter={displayFilter}
                        />
                    </div>
                </div>
                {/* Company Table Section */}
                <div className="w-full space-y-2 ">
                    <HomepageTableSection
                        companies={companies}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        loadingInfo={loadingInfo}
                        marketCaps={marketCaps}
                        stockPrices={stockPrices}
                        peRatios={peRatios}
                        pbRatios={pbRatios}
                        psRatios={psRatios}
                        profitMargins={profitMargins}
                        roes={roes}
                        roas={roas}
                        eps={eps}
                        revenueGrowths={revenueGrowths}
                        divYieldGrowths={divYieldGrowths}
                        showOverview={showOverview}
                        showProfitability={showProfitability}
                        showGrowth={showGrowth}
                        isCompanyInBasket={isCompanyInBasket}
                    />
                </div>

                {/* Pagination */}
                {/* <div className="w-full flex justify-center my-4">
                    <ul className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li
                                key={index}
                                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </li>
                        ))}
                    </ul>
                </div> */}

                {loadingInfo ? (
                    ""
                ) : (
                    <div className="w-full flex justify-end">
                        {/* Export CSV */}
                        <button
                            className="px-4 py-1 bg-gray-700 text-white rounded-lg outline-none"
                            onClick={downloadCsv}
                        >
                            Export
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

export default NewHomePage;
