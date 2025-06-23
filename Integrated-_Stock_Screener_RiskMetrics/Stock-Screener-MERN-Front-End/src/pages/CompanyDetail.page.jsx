import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../dashboard.css";
import CandleStick from "../components/pages/CompanyDetail/CandleStick";
import Cards from "../components/pages/CompanyDetail/CardBox.jsx";
import ChartWrapperCS from "../components/pages/CompanyDetail/ChartWrapperCS";
import { Card, CardContent, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ToggleButton from "react-bootstrap/ToggleButton";
import { ButtonGroup, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";


function CompanyDetailsPage() {
    
    const location = useLocation();
    const KEY = "5f05df8fcc7b27.737025968237"
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const companyName = searchParams.get("code");
    const history = useHistory();
    const value = {
        companyName: companyName
    };


    // Info we are getting from eod historical api
    // Visit https://eodhistoricaldata.com/financial-academy/financial-faq/fundamentals-glossary-common-stock/
    // for glossary on fundamental stock values

    // Corporate Info Values
    const [name, setName] = useState(null);
    const [companyDescription, setCompanyDescription] = useState(null);
    const [corporateExecutive, setCorporateExecutive] = useState(null);
    const [marketCap, setMarketCap] = useState(null);
    // Company Profile Values
    const [price, setPrice] = useState("");
    const [peRatio, setPeRatio] = useState(null);
    const [pbRatio, setPbRatio] = useState(null);
    const [psRatio, setPsRatio] = useState(null);
    // Profitability Values
    const [ebitda, setEbitda] = useState(null);
    const [profitMargin, setProfitMargin] = useState(null);
    const [roe, setRoe] = useState(null);
    const [roa, setRoa] = useState(null);
    // Growth Values
    const [eps, setEps] = useState(null);
    const [revenueGrowth, setRevenueGrowth] = useState(null);
    const [dividendYield, setDividendYield] = useState(null);


  useEffect(() => {
    // Fetch stock information
    getFundamentalStockInfo();
    getEODStockInfo();
  }, []);

  // For fundamental stock info
  function getFundamentalStockInfo() {
    const url = "https://eodhistoricaldata.com/api/fundamentals/" + code + ".US?api_token=" + KEY;
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = fundamentalCallback;
    request.send(null);
  }

  // For end of day stock info like price/close
  function getEODStockInfo(){
    const url = "https://eodhistoricaldata.com/api/eod/" + code + ".US?api_token=" + KEY +
    "&fmt=json";;
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = EODCallback;
    request.send(null);

  }

  // End of day info callback
  function EODCallback(request) {
    const data = JSON.parse(request.target.response);
    const latestEntry = data[data.length - 1]; // Get the latest entry from the response array
    const latestPrice = latestEntry?.close;
    setPrice(latestPrice);
  }
  
  // fundamental stock info callback
  function fundamentalCallback(request) {
    const data = JSON.parse(request.target.response);

    // Corporate Info Values
    setName(getGeneral(data, "Name"));
    setCompanyDescription(getGeneral(data, "Description"));
    const officers = getGeneral(data, "Officers");
    setCorporateExecutive(officers[0].Name); // That is where corp exec name is always located
    setMarketCap(getHighlights(data, "MarketCapitalization"));

    // Company Profile Values
    //setPrice(getTechnicalAnalysis(data, "close"));
    setPeRatio(getHighlights(data, "PERatio"));
    setPbRatio(getValuation(data, "PriceBookMRQ"));
    setPsRatio(getValuation(data, "PriceSalesTTM"));
    
    // Profitability Values
    setEbitda(getHighlights(data, "EBITDA"));
    setProfitMargin(getHighlights(data, "ProfitMargin"));
    setRoe(getHighlights(data, "ReturnOnEquityTTM"));
    setRoa(getHighlights(data, "ReturnOnAssetsTTM"));

    // Growth Values
    setEps(getHighlights(data, "EPSEstimateCurrentYear"));
    setRevenueGrowth(getHighlights(data, "QuarterlyRevenueGrowthYOY"));
    setDividendYield(getHighlights(data, "DividendYield"));

  }

    // Helper function
	// parses the full json data first to get the General section
	// then parses the General section to get the inputted feature from the data
	function getGeneral(data, feature) {

		const general = data["General"];
		const val = general[feature];
		return val;

	}

    // Helper function
	// parses the full json data first to get the Highlights section
	// then parses the Higlights section to get the inputted feature from the data
	function getHighlights(data, feature) {

		const highlights = data["Highlights"];
		const val = highlights[feature];
		return val;

	}

    // Helper function
	// parses the full json data first to get the Valuation section
	// then parses the Valuation section to get the inputted feature from the data
	function getValuation(data, feature) {

		const valuation = data["Valuation"];
		const val = valuation[feature];
		return val;

	}

    const [mode, setMode] = useState(1);
    //const [companyName, setCompanyName] = useState('');
    

    const [titleType, setTitle] = useState([
        "Corporate Info",
        "Company Profile",
        "Profitablity",
        "Growth",
    ]);

    const [activeCard, setActiveCard] = useState("Corporate Info");

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

    function Corporate() {

        const formattedMarketCap = marketCap ? marketCap.toLocaleString() : ""; // Adds commas when number gets big
      
        return (
          <div>
            <h6 className="mb-2"><span className="font-bold">Company Description:</span> {companyDescription} </h6>
            <h6 className="mb-2"><span className="font-bold">Corporate Executive:</span> {corporateExecutive} </h6>
            <h6><span className="font-bold">Market Cap:</span> {marketCap ? `$${formattedMarketCap}` : ""}</h6>
          </div>
        );
      }

        function CompanyProfile() {
            return (
              <div>
                <h6 className="mb-2"><span className="font-bold">Price:</span> ${price}</h6>
                <h6 className="mb-2"><span className="font-bold">P/E:</span> {peRatio}</h6>
                <h6 className="mb-2"><span className="font-bold">P/B:</span> {pbRatio}</h6>
                <h6><span className="font-bold">P/S:</span> {psRatio}</h6>
              </div>
            );
          }

        function Profitablity() {
            const formattedEBITDA = ebitda ? ebitda.toLocaleString() : "";
            
            return (
              <div>
                <h6 className="mb-2"><span className="font-bold">EBITDA:</span> ${formattedEBITDA}</h6>
                <h6 className="mb-2"><span className="font-bold">Profit Margin:</span> {profitMargin}</h6>
                <h6 className="mb-2"><span className="font-bold">ROE:</span> {roe}</h6>
                <h6><span className="font-bold">ROA:</span> {roa}</h6>
              </div>
            );
          }
          

        function Growth() {
            return (
              <div>
                <h6 className="mb-2"><span className="font-bold">EPS Growth:</span> {eps}</h6>
                <h6 className="mb-2"><span className="font-bold">Revenue Growth:</span> {revenueGrowth}</h6>
                <h6><span className="font-bold">Div Yield Growth:</span> {dividendYield}</h6>
              </div>
            );
          }

    

   

    const backButton = (e) => {
        history.push("/");
    };

   const formattedEBITDA = ebitda ? ebitda.toLocaleString() : ''; // adds commas
  

    return (
        <div className="Screener_Dashboard">
            <h1 className="Dashboard-Stock bg-gray-700 text-white">Dashboard Stock</h1>
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
                                        ? "EBITDA: $" + formattedEBITDA  
                                        : "EPS: " + eps
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
                                {activeCard === "Corporate Info" ? (
                                    <Corporate value={name} />
                                ) : activeCard === "Company Profile" ? (
                                    <CompanyProfile value={price} />
                                ) : activeCard === "Profitablity" ? (
                                    <Profitablity value={formattedEBITDA} />
                                ) : (
                                    <Growth value={eps} />
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

                {/* JUST PLACEHOLDERS  */}
  <button
    className="btn btn-info bg-gray-700"
    style={{ position: "absolute", top: "100px", left: "1250px" }}
  >
    Company News
  </button>

  <button
    className="btn btn-info bg-gray-700"
    style={{ position: "absolute", top: "150px", left: "1250px" }}
  >
    Market News
  </button>

  <button
    className="btn btn-info bg-gray-700"
    style={{ position: "absolute", top: "200px", left: "1250px" }}
  >
    Similar Companies
  </button>
</div>


            <div className="dashboard_bottom">
                <div className="dashboard_bottom_left">
                </div>
                
                <div className="dashboard_bottom_right" >
                                    
                    <ButtonGroup className="radio-selection d-flex" style={{ marginRight: '1900px' }}>
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
                    </ButtonGroup>
                    {/* Chart */}
                    <div 
                        style={{ marginRight: '1900px', marginTop: '2rem' }}>
                        <ChartWrapperCS
                            stock={name}
                            ticker={value}
                            mode={mode}
                        />

                        
                    </div>
                </div>
            </div>

        </div>
        
    );
}

export default CompanyDetailsPage;
