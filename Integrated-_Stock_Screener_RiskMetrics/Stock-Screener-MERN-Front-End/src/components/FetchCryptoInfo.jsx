import axios from 'axios';
import Papa from 'papaparse'; // Import the CSV parsing library

const apiKey = "5f05df8fcc7b27.737025968237";

const FetchCryptoInfo = async (ticker) => {
  try {
    const fundamentalResponse = await axios.get(
      `https://eodhistoricaldata.com/api/fundamentals/${ticker}-USD.CC?api_token=${apiKey}`
    );
  
    const fundamentalData = fundamentalResponse.data;

  // Extract required statistics
  const marketCap = fundamentalData.Statistics.MarketCapitalization.toLocaleString();
  const circulatingSupply = fundamentalData.Statistics.CirculatingSupply.toLocaleString();
  const marketDominance = fundamentalData.Statistics.MarketCapDominance;

  
    const eodResponse = await axios.get(
      `https://eodhistoricaldata.com/api/eod/${ticker}-USD.CC?api_token=${apiKey}`
    );
  
    const parsedData = Papa.parse(eodResponse.data, { header: true }).data;
    const latestEntry = parsedData[parsedData.length - 2];
  
    const closingPrice = parseFloat(latestEntry.Close).toFixed(2);
    const formattedPrice = closingPrice ? parseFloat(closingPrice).toLocaleString() : "";
  
  
    const stockInfoArray = [
      formattedPrice,
      marketCap,
      circulatingSupply,
      marketDominance
    ];
    
    console.log("ran fetch info")
    console.log("ran fetch crypto info. other info ", JSON.stringify(fundamentalData, null, 2));
    return stockInfoArray;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return []; // Return an empty array in case of an error
  }
};

export default FetchCryptoInfo;
