import axios from 'axios';

const baseUrl = "https://eodhistoricaldata.com/api";
const apiToken = "5f05df8fcc7b27.737025968237";

const FetchStockInfo = async (ticker) => {
  const apiKey = apiToken;

  // Fetch fundamental stock info
  const fundamentalResponse = await axios.get(
    `${baseUrl}/fundamentals/${ticker}.US?api_token=${apiKey}`
  );

  const fundamentalData = fundamentalResponse.data;

  // Fetch end-of-day stock info
  const eodResponse = await axios.get(
    `${baseUrl}/eod/${ticker}.US?api_token=${apiKey}&fmt=json`
  );

  const eodData = eodResponse.data;
  const latestEntry = eodData[eodData.length - 1]; // Get the latest entry from the response array

  // Construct the array of values
  // Each value will be asisgned to a number in the returned array
  const stockInfoArray = [
    latestEntry.close, // 0 is assigned to price
    fundamentalData.Highlights.PERatio, // 1 is assigned to P/E
    fundamentalData.Valuation.PriceBookMRQ, // 2 is assigned to P/B
    fundamentalData.Valuation.PriceSalesTTM, // 3 is assigned to P/S
    fundamentalData.Highlights.ProfitMargin, // 4 is assigned to profit margin
    fundamentalData.Highlights.ReturnOnEquityTTM, // 5 is assigned to ROE
    fundamentalData.Highlights.ReturnOnAssetsTTM, // 6 is assigned to ROA
    fundamentalData.Highlights.EPSEstimateCurrentYear, // 7 is assigned to eps
    fundamentalData.Highlights.QuarterlyRevenueGrowthYOY, // 8 is assigned to rev growth
    fundamentalData.Highlights.DividendYield, // 9 is assigned to yield growth
    fundamentalData.Highlights.MarketCapitalization // 10 is assigned to market Cap 
  ];


  console.log("ran fetch info")
  return stockInfoArray;
};

export default FetchStockInfo;
