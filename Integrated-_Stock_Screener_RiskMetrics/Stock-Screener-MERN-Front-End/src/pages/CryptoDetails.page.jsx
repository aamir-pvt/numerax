import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../dashboard.css";
import CandleStick from "../components/pages/CompanyDetail/CandleStick";
import Cards from "../components/pages/CompanyDetail/CardBox.jsx";
import ChartWrapperCSCrypto from "../components/pages/CompanyDetail/ChartWrapperCSCrypto"; // Change to crypto chart when component is completed
import { Card, CardContent, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ToggleButton from "react-bootstrap/ToggleButton";
import { ButtonGroup, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Papa from 'papaparse';


function CryptoDetailsPage() {
    
    const location = useLocation();
    const KEY = "5f05df8fcc7b27.737025968237"
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const cryptoName = searchParams.get("code");
    const history = useHistory();
    const value = {
        companyName: cryptoName // Currently hardcoded for Apple (AAPL) as a placeholder until the crypto chart is done
    };

    // General Values
    const [name, setName] = useState(null);
    const [type, setType] = useState(null);
    const [catergory, setCategory] = useState(null);
    const [marketCap, setMarketCap] = useState(null);
    const [marketCapDom, setMarketCapDom] = useState(null);
    // Crypto Profile Values
    const [price, setPrice] = useState("");
    const [low, setLow] = useState(null);
    const [high, setHigh] = useState(null);
    // Supply Values
    const [totalSupply, setTotalSupply] = useState(null);
    const [maxSupply, setMaxSupply] = useState(null);
    const [circulatingSupply, setCirculatingSupply] = useState(null);
    // Infomation Values
    const [website, setWebsite] = useState(null);
    const [techDoc, setTechDoc] = useState(null);
    const [explorer, setExplorer] = useState(null);

    const [parsedData, setParsedData] = useState(null);

    useEffect(() => {
        async function fetchCryptoData() {
          try {
            const apiKey = "5f05df8fcc7b27.737025968237"; 
            const response = await axios.get(`https://eodhistoricaldata.com/api/fundamentals/${code}-USD.CC?api_token=${apiKey}`);
            const cryptoData = response.data;

            const eodResponse = await axios.get(`https://eodhistoricaldata.com/api/eod/${code}-USD.CC?api_token=${apiKey}`);
            const eodCryptoData = eodResponse.data;
            
            // eod info is sent in a cvs file so it needs to be parsed
            const parsedData = Papa.parse(eodResponse.data, { header: true }).data;
            setParsedData(parsedData);
            console.log("Here's the first entry of fetched crypto data:", parsedData[0]);
console.log("Here's the second entry of fetched crypto data:", parsedData[1]);
// Log the whole array if it's not too large or just log the length if it is
console.log("Total entries fetched:", parsedData.length);
if (parsedData.length <= 10) {
  console.log("All fetched crypto data:", parsedData);
} else {
  console.log("First 10 entries of fetched crypto data:", parsedData.slice(0, 10));
}

            // <ChartWrapperCSCrypto eodData={parsedData} />
            const latestEntry = parsedData[parsedData.length - 2];
            const closingPrice = parseFloat(latestEntry.Close).toFixed(2);
            const formattedPrice = closingPrice ? parseFloat(closingPrice).toLocaleString() : "";
    

            // Populate state variables with fetched data
            setName(cryptoData.General.Name);
            setType(cryptoData.General.Type);
            setCategory(cryptoData.General.Category);
            setMarketCap(cryptoData.Statistics.MarketCapitalization);
            setMarketCapDom(cryptoData.Statistics.MarketCapDominance);
            setPrice(formattedPrice);
            setLow(cryptoData.Statistics.LowAllTime);
            setHigh(cryptoData.Statistics.HighAllTime);
            setTotalSupply(cryptoData.Statistics.TotalSupply);
            setMaxSupply(cryptoData.Statistics.MaxSupply);
            setCirculatingSupply(cryptoData.Statistics.CirculatingSupply);
            setWebsite(cryptoData.General.WebURL);
            setTechDoc(cryptoData.Statistics.TechnicalDoc);
            setExplorer(cryptoData.Statistics.Explorer);
          } catch (error) {
            console.error('Error fetching crypto data:', error);
          }
        }
    
        fetchCryptoData();
      }, [code]);


    const [mode, setMode] = useState(1);
    //const [companyName, setCompanyName] = useState('');
    

    const [titleType, setTitle] = useState([
        "General",
        "Crypto Profile",
        "Supply",
        "Infomation",
    ]);

    const [activeCard, setActiveCard] = useState("General");

    const updateOption = (e) => {
        const option = parseInt(e.target.value);
        switch (option) {
            case 0:
                setMode(0);
                break;
            case 1:
                setMode(1);
                break;
            case 2:
                setMode(2);
                break;
            case 3:
                setMode(3);
                break;
            case 4:
                setMode(4);
                break;
            case 5:
                setMode(5);
                break;
            case 6:
                setMode(6);
                break;
            default:
                setMode(1);
                break;
        }
    };

    function General() {

        const formattedMarketCap = marketCap ? marketCap.toLocaleString() : ""; // Adds commas when number gets big
      
        return (
          <div>
            <h6 className="mb-2"><span className="font-bold">Type:</span> {type} </h6>
            <h6 className="mb-2"><span className="font-bold">Catergory:</span> {catergory} </h6>
            <h6 className="mb-2"><span className="font-bold">Market Cap: </span> {marketCap ? `$${formattedMarketCap}` : ""}</h6>
            <h6 className="mb-2"><span className="font-bold">Market Cap Dominance:</span> {marketCapDom} </h6>
          </div>
        );
      }

        function CryptoProfile() {
            return (
              <div>
                <h6 className="mb-2"><span className="font-bold">Price:</span> ${price}</h6>
                <h6 className="mb-2"><span className="font-bold">All Time Low </span> {low}</h6>
                <h6 className="mb-2"><span className="font-bold">All Time High:</span> {high}</h6>
              </div>
            );
          }

        function Supply() {
            
            return (
              <div>
                <h6 className="mb-2"><span className="font-bold">Total Supply</span> ${totalSupply}</h6>
                <h6 className="mb-2"><span className="font-bold">Max Supply:</span> {maxSupply}</h6>
                <h6 className="mb-2"><span className="font-bold">Circulating Supply:</span> {circulatingSupply}</h6>
              </div>
            );
          }
          

        function Infomation() {
            return (
              <div>
                <h6 className="mb-2"><span className="font-bold">Website:</span> {website}</h6>
                <h6 className="mb-2"><span className="font-bold">Technical Document:</span> {techDoc}</h6>
                <h6><span className="font-bold">Explorer:</span> {explorer}</h6>
              </div>
            );
          }

    

   

    const backButton = (e) => {
        history.push("/crypto");
    };

  

    return (
        <div className="Screener_Dashboard">
            <h1 className="Dashboard-Stock bg-gray-700 text-white">Dashboard Crypto</h1>
            <button 
            className="btn btn-info bg-gray-700" 
            onClick={backButton}
            style={{ marginTop: "10px",  marginLeft: "4px" }}>
                Back
            </button>
            <div className="dashBoard">
                <div className="dashboard_left">
                    <div className="app_stats">
                        {titleType.map((value, index) => (
                            <Cards
                                title={value}
                                desc={
                                    index === 0
                                        ? name
                                        : index === 1
                                        ? "Price: $" + price
                                        : index === 2
                                        ? "Total Supply: " + totalSupply  
                                        : "Website: " + website
                                }
                                onClick={(e) => {
                                    setActiveCard(value);
                                }}
                                active={activeCard}
                            />
                        ))}
                    </div>
                    <div className="description">
                        <Card>
                            <CardContent>
                                {activeCard === "General" ? (
                                    <General value={name} />
                                ) : activeCard === "Crypto Profile" ? (
                                    <CryptoProfile value={price} />
                                ) : activeCard === "Supply" ? (
                                    <Supply value={totalSupply} />
                                ) : (
                                    <Infomation value={website} />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="dashboard_right" style={{ marginLeft: '350px' }}>
                        <h2 style={{ fontWeight: "bold", margin: "1em 0", fontSize: "24px" }}>{code} Price History</h2>
                    </div>
                </div>
            </div>

            <div style={{ position: "relative" }}>
    </div>


            <div className="dashboard_bottom">
                <div className="dashboard_bottom_left">
                </div>
                
                <div className="dashboard_bottom_right" >
                                    
                    {/* <ButtonGroup className="radio-selection d-flex" style={{ marginRight: '1900px' }}>
                        <ToggleButton
                            id="toggle-radio-1"
                            type="radio"
                            variant="secondary"
                            name="radio"
                            checked={mode === 0}
                            value="0"
                            disabled
                            onChange={updateOption}
                        >
                            1 Day
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-radio-2"
                            type="radio"
                            variant="secondary"
                            name="radio"
                            checked={mode === 1}
                            value="1"
                            onChange={updateOption}
                        >
                            1 Week
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-radio-3"
                            type="radio"
                            variant="secondary"
                            name="radio"
                            checked={mode === 2}
                            value="2"
                            onChange={updateOption}
                        >
                            1 Month
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-radio-4"
                            type="radio"
                            variant="secondary"
                            name="radio"
                            checked={mode === 3}
                            value="3"
                            onChange={updateOption}
                        >
                            6 Months
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-radio-5"
                            type="radio"
                            variant="secondary"
                            name="radio"
                            checked={mode === 4}
                            value="4"
                            onChange={updateOption}
                        >
                            1 Year
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-radio-6"
                            type="radio"
                            variant="secondary"
                            name="radio"
                            checked={mode === 5}
                            value="5"
                            onChange={updateOption}
                        >
                            3 Years
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-radio-6"
                            type="radio"
                            variant="secondary"
                            name="radio"
                            checked={mode === 6}
                            value="6"
                            onChange={updateOption}
                        >
                            5 Years
                        </ToggleButton>
                    </ButtonGroup> */}
                    {/* Chart */}
                    <div 
                        style={{ marginRight: '1900px', marginTop: '2rem' }}>
                        <ChartWrapperCSCrypto // Change To crypto chart when componenet is completed
                            stock={name}
                            ticker={value}
                            mode={mode}
                            eodData={parsedData}
                        />

                        
                    </div>
                </div>
            </div>

        </div>
        
    );
}

export default CryptoDetailsPage;
