import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useHistory, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import FetchCryptoInfo from "../components/FetchCryptoInfo";
import "./CompanyList.page.css";


const ENDPOINT = "http://127.0.0.1:8000";


function CryptoListPage() {
  

  const initialCryptoList = [
    { name: "Bitcoin", ticker: "BTC", price: "loading"},
    { name: "Ethereum", ticker: "ETH", price: "loading"},
    { name: "Binance Coin", ticker: "BNB", price: "loading"},
    { name: "Cardano", ticker: "ADA",price: "loading"},
    { name: "Solana", ticker: "SOL", price: "loading"},
    { name: "XRP", ticker: "XRP", price: "loading"},
    { name: "Polkadot", ticker: "DOT", price: "loading"},
    { name: "Dogecoin", ticker: "DOGE", price: "loading"},
    { name: "Avalanche", ticker: "AVAX", price: "loading"},
    { name: "Chainlink", ticker: "LINK", price: "loading"},
    { name: "Litecoin", ticker: "LTC",price: "loading"},
    { name: "Bitcoin Cash", ticker: "BCH", price: "loading"},
    { name: "Polygon", ticker: "MATIC", price: "loading"},
    { name: "Algorand", ticker: "ALGO", price: "loading"},
    { name: "Stellar", ticker: "XLM", price: "loading"},
    { name: "VeChain", ticker: "VET", price: "loading"},
    { name: "Terra", ticker: "LUNA", price: "loading"},
    { name: "Tezos", ticker: "XTZ", price: "loading"},
    { name: "Cosmos", ticker: "ATOM", price: "loading"},
    { name: "EOS", ticker: "EOS", price: "loading"}
  ];

  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
 

  const backButton = (e) => {
    history.push("/");
  };

  const [cryptoList, setCryptoList] = useState(initialCryptoList);


  useEffect(() => {
    async function fetchCryptoData() {
      try {
        const updatedCryptoList = await Promise.all(
          cryptoList.map(async (crypto) => {
            const cryptoData = await FetchCryptoInfo(crypto.ticker);
            const [price, marketCap, circulatingSupply, marketDominance] = cryptoData;

            return {
              ...crypto,
              price,
              marketCap,
              circulatingSupply,
              marketDominance
            };
          })
        );

        setCryptoList(updatedCryptoList);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    }

    fetchCryptoData();
  }, []);

  useEffect(() => {
    // Update the search query in URL when searchQuery changes
    searchParams.set("search", searchQuery);
    history.replace({
      pathname: location.pathname,
      search: searchParams.toString(),
    });

  }, [searchQuery]);

  // filtering for search bar logic
  const filteredCryptoList = cryptoList.filter((crypto) => {
    const searchString = searchQuery.toLowerCase();
    return (
      crypto.name.toLowerCase().includes(searchString) ||
      crypto.ticker.toLowerCase().includes(searchString)
    );
  });


  return (
    <main className="w-full">
       <div className="max-w-7xl mx-auto">
        {/* Back Button and Search Bar */}
        <div className="flex items-center space-x-4">
          <button
            className="btn btn-info bg-gray-700"
            onClick={backButton}
            style={{ marginTop: "10px" }}
          >
            Back
          </button>
          <form
            className="bg-gray-700 w-2/5 px-3 py-2 rounded-lg text-white flex space-x-2 items-center"
            style={{ marginTop: "10px" }}
            onSubmit={(e) => {
              e.preventDefault(); // Prevent form submission
              // Update the URL with the search query as a query parameter
              history.push(`/cryptoList?search=${searchQuery}`);
            }}
          >
            <button type="submit">
              <AiOutlineSearch className="text-xl" />
            </button>
            <input
              type="text"
              className="rounded-none w-full bg-transparent outline-none"
              placeholder="Search by ticker or crypto name"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </form>
        </div>
      {/* Table section */}
      <div className="flex flex-col space-y-5 py-4">
        <div className="w-full space-y-2">
        <div className="grid grid-cols-6 w-full bg-gray-700 text-white rounded-t-lg py-3 px-3">
            <h1>Ticker</h1>
            <h1>Name</h1>
            <h1>Price</h1>
            <h1>Market Cap</h1>
            <h1>Circulating Supply</h1>
            <h1>Market Dominance</h1>

          </div>
          <div className="w-full">
            {filteredCryptoList.map((crypto, index) => (
              <div className="w-full crypto-row" key={index}>
                <div className="grid grid-cols-6 px-3">
              <h3 className="text-blue-900"> {/* Link to CompanyDetails page */}
                <a
                 href={`/cryptoDetails?code=${crypto.ticker}`}
                 onClick={(e) => {
                    e.preventDefault();
                    history.push(`/cryptoDetails?code=${crypto.ticker}`);
                    }}
                >
               {crypto.ticker}
                </a>
              </h3>
                <h3>{crypto.name}</h3>
                <h3>${crypto.price || "loading"}</h3>
                <h3>${crypto.marketCap || "loading"}</h3>
                <h3>{crypto.circulatingSupply || "loading"}</h3>
                <h3>{crypto.marketDominance || "loading"}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

export default CryptoListPage;
