import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import { useHistory, useLocation } from "react-router";
import Filter from "../components/pages/NewHome/Filter";
import { useCompanyStockFilter } from "../hooks/useCompanyStockFilter";
import { downloadCompanyStocksCSV } from "../services/requests/companyStock";
import FetchStockInfo from "../components/FetchStockInfo";
import Paginate from "../components/Paginate";

function NewHomePage() {
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

    // manage filter state with search params
    const { search, pathname } = useLocation();
    const history = useHistory();
    const searchParams = useMemo(() => {
        return new URLSearchParams(search);
    }, [search]);

    // onMount actions
    React.useEffect(() => {
        const queryParamFilters: Record<string, any> = {};
        for (let filter in queryOptions.filter) {
            const searchOption = queryOptions.filter[filter].options.find(
                (option) => option.optionName === searchParams.get(filter)
            );

            if (searchOption) {
                queryParamFilters[filter] = searchOption.optionValue;
            }
        }

        const queryParamSelections: Record<string, any> = {};
        for (let filter in queryOptions.selections) {
            const searchOption = queryOptions.selections[filter].options.find(
                (option) => option.optionName === searchParams.get(filter)
            );

            if (searchOption) {
                queryParamSelections[filter] = searchOption.optionValue;
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
                let url = window.URL.createObjectURL(res.data);
                let a = document.createElement("a");
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
const totalPages = Math.ceil(companies.length / itemsPerPage);
const [currentPage, setCurrentPage] = useState(1);

const handlePageChange = (pageNumber: number) => {
  setCurrentPage(pageNumber);
};

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = Math.min(startIndex + itemsPerPage, companies.length);

// Function to pull in the stock information
// View FetchStockInfo in components for more details

// Improvements for efficiency are on way, looking to use a similar strategy
// as we did for company details page but had errors during first implementaion try
// It seems like the api request just isnt as fast as we would want. Could try reducing page size 
// and to reduce the number of api requests

const [stockInfo, setStockInfo] = useState<any[]>([]);
const [stockPrices, setStockPrices] = useState<number[]>([]);
const [peRatios, setPeRatios] = useState<number[]>([]);
const [pbRatios, setPbRatios] = useState<number[]>([]);
const [psRatios, setPsRatios] = useState<number[]>([]);
const [profitMargins, setProfitMargins] = useState<number[]>([]);
const [roes, setRoes] = useState<number[]>([]);
const [roas, setRoas] = useState<number[]>([]);
const [eps, setEps] = useState<number[]>([]);
const [revenueGrowths, setRevenueGrowths] = useState<number[]>([]);
const [divYieldGrowths, setDivYieldGrowths] = useState<number[]>([]);
const [marketCaps, setMarketCaps] = useState<number[]>([]);
const [loadingInfo, setLoadingInfo] = useState<boolean>(false);

useEffect(() => {
  async function fetchStockInfoForCompanies() {

    setLoadingInfo(true);
    
    const fetchedStockInfos = await Promise.all(
      companies.map(async (company) => {
        return await FetchStockInfo(company.Name);
      })
    );

    const pages = [];
    for (let i = 0; i < fetchedStockInfos.length; i += itemsPerPage) {
      pages.push(fetchedStockInfos.slice(i, i + itemsPerPage));
    }
    setStockInfo(pages);

    const fetchedStockPrices = fetchedStockInfos.map((info) => info[0]);
    setStockPrices(fetchedStockPrices);

    const fetchedPeRatios = fetchedStockInfos.map((info) => info[1]);
    setPeRatios(fetchedPeRatios);

    const fetchedPbRatios = fetchedStockInfos.map((info) => info[2]);
    setPbRatios(fetchedPbRatios);

    const fetchedPsRatios = fetchedStockInfos.map((info) => info[3]);
    setPsRatios(fetchedPsRatios);

    const fetchedProfitMargins = fetchedStockInfos.map((info) => info[4]);
    setProfitMargins(fetchedProfitMargins);

    const fetchedRoes = fetchedStockInfos.map((info) => info[5]);
    setRoes(fetchedRoes);

    const fetchedRoas = fetchedStockInfos.map((info) => info[6]);
    setRoas(fetchedRoas);

    const fetchedEps = fetchedStockInfos.map((info) => info[7]);
    setEps(fetchedEps);

    const fetchedRevenueGrowths = fetchedStockInfos.map((info) => info[8]);
    setRevenueGrowths(fetchedRevenueGrowths);

    const fetchedDivYieldGrowths = fetchedStockInfos.map((info) => info[9]);
    setDivYieldGrowths(fetchedDivYieldGrowths);

    const fetchedMarketCaps = fetchedStockInfos.map((info) => info[10]);
    setMarketCaps(fetchedMarketCaps);

    setLoadingInfo(false);
  }

  fetchStockInfoForCompanies();
}, [companies, itemsPerPage]);


    return (
        <main className="w-full">
            <div className="max-w-7xl mx-auto">
            
            {/* Button Section */}
            <div style={{ position: "absolute", top: "8.7%", left: "49%" }}>
            <div className="flex space-x-1">
                <button 
                    className="bg-gray-600 btn-info text-white py-2 md:px-10 rounded overview-button"
                    onClick={() => {
                        setShowOverview(true)
                        setShowProfitability(false)
                        setShowGrowth(false)}
                        }>
                    Overview
                </button>
                <button 
                    className="bg-gray-600 btn-info text-white py-2 md:px-10 rounded"
                    onClick={() => {
                        setShowOverview(false)
                        setShowProfitability(true)
                        setShowGrowth(false)}
                        }>

                    Profitability
                </button>
                <button 
                    className="bg-gray-600 btn-info text-white py-2 md:px-10 rounded"
                    onClick={() => {
                        setShowOverview(false)
                        setShowProfitability(false)
                        setShowGrowth(true)}
                        }>

                    Growth
                </button>
                <button
                    className="bg-gray-600 btn-info text-white py-2 md:px-10 rounded"
                    onClick={() => {
                        window.location.href = "./crypto";
                    }}>
                
                    Crypto
                </button>
                </div>
            </div>
            

            
                <div className="flex flex-col space-y-5 py-4">
                    {/* Search Section */}
                    <div className="w-full flex">
                        {/* Company name and ticker search bar  */}
                        <form className="bg-gray-700 w-2/5 px-3 py-2 rounded-lg text-white flex space-x-2 items-center">
                            <button type="submit">
                                <AiOutlineSearch className="text-xl" />
                            </button>
                            <input
                                type="text"
                                className="rounded-none w-full bg-transparent outline-none "
                                placeholder="Search for a ticker, company name"
                                onChange={(e) => {
                                    if (e.target.value === "") {
                                        searchParams.delete("search");
                                    } else {
                                        searchParams.set(
                                            "search",
                                            e.target.value
                                        );
                                                history.replace({
                                                    pathname: pathname,
                                                    search: searchParams.toString(),
                                                });
                                    }
                                    setCompanySearch(e.target.value);
                                }}
                                value={companySearch}
                            />
                        </form>
                        {/* Filter Section Toggle */}
                        <button
                            className="foucs:outline-none text-xl ml-3"
                            onClick={() => setDisplayFilter((prev) => !prev)}
                        >
                            {displayFilter ? (
                                <MdFilterAltOff />
                            ) : (
                                <MdFilterAlt />
                            )}
                        </button>
                    </div>
                    {/* Filter Section*/}
                    <div
                        className={`w-full overflow-hidden ${
                            displayFilter ? "max-h-[10000px]" : "max-h-0"
                        } transition-[max-height] duration-200 ease-in-out`}
                    >
                        <div
                            className={`w-full space-y-4 transform ${
                                displayFilter
                                    ? "translate-x-0"
                                    : "-translate-y-full"
                            }  duration-200 ease-in-out`}
                        >
                            {/* Filter Title */}
                            <h1 className="text-2xl">Filters:</h1>
                            {/* All Filter Options */}
                            <div className="w-full rounded-sm border-[1px] border-black p-3 grid gap-y-3 grid-cols-5">
                                {queryPropArray.map((filterName, index) => {
                                    const queryProp =
                                        queryOptions.filter[filterName] ||
                                        queryOptions.selections[filterName];
                                    return queryProp.options.length ===
                                        0 ? null : (
                                        <Filter
                                            displayName={queryProp.displayName}
                                            key={index}
                                            filterName={filterName}
                                            onChange={(
                                                filterName,
                                                selectedFilterOption
                                            ) => {
                                                setFilterRequest(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        ...(queryOptions.filter[
                                                            filterName
                                                        ]
                                                            ? {
                                                                  filter: {
                                                                      ...prevState.filter,
                                                                      [filterName]:
                                                                          selectedFilterOption.optionValue,
                                                                  },
                                                              }
                                                            : queryOptions
                                                                  .selections[
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
                                                    })
                                                );

                                                searchParams.set(
                                                    filterName,
                                                    selectedFilterOption.optionName
                                                );
                                                history.replace({
                                                    pathname: pathname,
                                                    search: searchParams.toString(),
                                                });
                                            }}
                                            defaultSelected={
                                                queryProp.options.find(
                                                    (option) =>
                                                        option.optionName ===
                                                        searchParams.get(
                                                            filterName
                                                        )
                                                ) || queryProp.options[0]
                                            }
                                            options={queryProp.options}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Company Table Section */}
                <div className="w-full space-y-2 ">
                    <div className="grid grid-cols-7 w-full bg-gray-700 text-white rounded-t-lg py-3 px-3">
                        <h1>Ticker</h1>
                        <h1>Name</h1>
                        <h1>MarketCap</h1>
                        <h1>Price</h1>
                        {showOverview && (
                            <>
                                <h1>P/E</h1>
                                <h1>P/B</h1>
                                <h1>P/S</h1>
                            </>
                        )}
                        {showProfitability && (
                            <>
                                <h1>Profit Margin</h1>
                                <h1>ROE</h1>
                                <h1>ROA</h1>
                            </>
                        )}
                        {showGrowth && (
                            <>
                                <h1>EPS</h1>
                                <h1>Revenue Growth</h1>
                                <h1>Div Yield Growth</h1>
                            </>
                        )}
                    </div>
                    {companies.slice(startIndex, endIndex).map((company, index) => (
                        <div className="w-full" key={index}>
                            <div className="grid grid-cols-7 px-3">
                            <h3 className="text-blue-900"> {/* Link to CompanyDetails page */}
                                <a
                                    href={`/companyDetails?code=${company.Name}`}
                                    onClick={(e) => {
                                    e.preventDefault();
                                    history.push(`/companyDetails?code=${company.Name}`);
                                    }}
                                >
                                    {company.Name}
                                </a>
                                </h3>
                                <h3>{company.CompanyName}</h3>

                                <h3>
                                    {loadingInfo ? (
                                        "Loading"
                                    ) : (
                                        <span>
                                            {new Intl.NumberFormat("en", {
                                                notation: "compact",
                                                compactDisplay: "short",
                                            }).format(marketCaps[index])}
                                        </span>
                                    )}
                                </h3>
                                <h3>
                                    {loadingInfo ? (
                                        "Loading"
                                    ) : (
                                        <span>${stockPrices[index]}</span>
                                    )}
                                </h3>
                                {showOverview && (
                                    <>
                                        <h3>{loadingInfo ? "Loading" : peRatios[index]}</h3>
                                        <h3>{loadingInfo ? "Loading" : pbRatios[index]}</h3>
                                        <h3>{loadingInfo ? "Loading" : psRatios[index]}</h3>
                                    </>
                                )}
                                {showProfitability && (
                                    <>
                                        <h3>{loadingInfo ? "Loading" : profitMargins[index]}</h3>
                                        <h3>{loadingInfo ? "Loading" : roes[index]}</h3>
                                        <h3>{loadingInfo ? "Loading" : roas[index]}</h3>
                                    </>
                                )}
                                {showGrowth && (
                                    <>
                                        <h3>{loadingInfo ? "Loading" : eps[index]}</h3>
                                        <h3>{loadingInfo ? "Loading" : revenueGrowths[index]}</h3>
                                        <h3>{loadingInfo ? "Loading" : divYieldGrowths[index]}</h3>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

               {/* Pagination */}
    <div className="w-full flex justify-center my-4">
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
    </div>
                
                <div className="w-full flex justify-end">
                    {/* Export CSV */}
                    <button
                        className="px-4 py-1 bg-gray-700 text-white rounded-lg outline-none"
                        onClick={downloadCsv}
                    >
                        Export
                    </button>
                </div>
            </div>


            
        </main>
    );
}

export default NewHomePage;
