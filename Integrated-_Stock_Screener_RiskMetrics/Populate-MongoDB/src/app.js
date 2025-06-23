const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const request = require("request");
const { type } = require("os");
const { json } = require("body-parser");
const { response } = require("express");
var axios = require("axios");
const { url } = require("inspector");
let apiKey = "5f05dbbf1f59a5.46485507";
const path = require("path");

require("dotenv").config();
// var companyName; const array1 = [ "HPQ.US", "NLSN.US", "PFE.US", "DOW.US", "SRE.US", "REGN.US", "STX.US", "TTWO.US", "ABC.US", "WU.US", "NOW.US", "NVR.US", "STT.US", "TFX.US", "ABMD.US", "ABBV.US", "BR.US", "NEE.US", "MCHP.US", "TYL.US",
//     "PYPL.US",
//     "BF-B.US",
//     "SYF.US",
//     "ANET.US",
//     "ANTM.US",
//     "MAA.US",
//     "KEYS.US",
//     "BRK-B.US",
//     "CFG.US",
//     "KHC.US",
//     "HPE.US",
//     "WBA.US",
//     "ES.US",
//     "ZBH.US",
//     "QRVO.US",
//     "WRK.US",
//     "WLTW.US",
//     "SPGI.US",
//     "FTV.US",
//     "LW.US",
//     "UAA.US",
//     "DXC.US",
//     "HD.US",
//     "EXC.US",
//     "LH.US",
//     "MTD.US",
//     "SLB.US",
//     "CBRE.US",
//     "TPR.US",
//     "IQV.US",
//     "APTV.US",
//     "BKNG.US",
//     "WELL.US",
//     "EVRG.US",
//     "LIN.US",
//     "BKR.US",
//     "GL.US",
//     "HWM.US",
//     "PEAK.US",
//     "TT.US",
//     "VIAC.US",
//     "TFC.US",
//     "CTVA.US",
//     "AMCR.US",
//     "LHX.US",
//     "NLOK.US",
//     "J.US",
//     "CARR.US",
//     "OTIS.US",
//     "RTX.US",
// ];

// const array2 = [
//     "AIZ.US",
//     "MNST.US",
//     "GPS.US",
//     "UNM.US",
//     "PGR.US",
//     "FISV.US",
//     "CSX.US",
//     "ADP.US",
//     "ANSS.US",
//     "AFL.US",
//     "SO.US",
//     "REG.US",
//     "LMT.US",
//     "BMY.US",
//     "EIX.US",
//     "GWW.US",
//     "VAR.US",
//     "FAST.US",
//     "PHM.US",
//     "WHR.US",
//     "INTC.US",
//     "NEM.US",
//     "CTAS.US",
//     "ALL.US",
//     "CBOE.US",
//     "NDAQ.US",
//     "NRG.US",
//     "GIS.US",
//     "SIVB.US",
//     "CNC.US",
//     "MLM.US",
//     "NBL.US",
//     "QCOM.US",
//     "ACN.US",
//     "VMC.US",
//     "MRO.US",
//     "AVGO.US",
//     "AMT.US",
//     "PKG.US",
//     "CPB.US",
//     "LB.US",
//     "FMC.US",
//     "RCL.US",
//     "WAT.US",
//     "PPL.US",
//     "FITB.US",
//     "DXCM.US",
//     "DISH.US",
//     "SNPS.US",
//     "HON.US",
//     "EW.US",
//     "APD.US",
//     "MCD.US",
//     "MYL.US",
//     "HRB.US",
//     "TDY.US",
//     "NTAP.US",
//     "CERN.US",
//     "KO.US",
//     "GS.US",
//     "AJG.US",
//     "NKE.US",
//     "KMB.US",
//     "ROL.US",
//     "HES.US",
//     "IT.US",
//     "INFO.US",
//     "CTSH.US",
//     "WEC.US",
//     "FTI.US",
//     "PG.US",
//     "SNA.US",
//     "CMA.US",
// ];

// const array3 = [
//     "BIO.US",
//     "COTY.US",
//     "IRM.US",
//     "EOG.US",
//     "FCX.US",
//     "TXN.US",
//     "AON.US",
//     "CHRW.US",
//     "GPN.US",
//     "CMG.US",
//     "TEL.US",
//     "CXO.US",
//     "MSCI.US",
//     "DRE.US",
//     "KSS.US",
//     "CTXS.US",
//     "CF.US",
//     "TJX.US",
//     "WRB.US",
//     "DLTR.US",
//     "DRI.US",
//     "JPM.US",
//     "XLNX.US",
//     "CB.US",
//     "KEY.US",
//     "GD.US",
//     "TGT.US",
//     "EQR.US",
//     "RJF.US",
//     "SWKS.US",
//     "HBI.US",
//     "MS.US",
//     "AAL.US",
//     "RF.US",
//     "FBHS.US",
//     "AEP.US",
//     "CE.US",
//     "AMAT.US",
//     "CCI.US",
//     "VTR.US",
//     "PPG.US",
//     "INTU.US",
//     "IPG.US",
//     "A.US",
//     "IFF.US",
//     "LNC.US",
//     "EL.US",
//     "CNP.US",
//     "AVY.US",
//     "UNP.US",
//     "CTL.US",
//     "MAS.US",
//     "PSX.US",
//     "GLW.US",
//     "CME.US",
//     "NCLH.US",
//     "SBUX.US",
//     "STE.US",
//     "CAG.US",
//     "NWL.US",
//     "CLX.US",
//     "UHS.US",
//     "ILMN.US",
//     "ODFL.US",
//     "LUV.US",
//     "ZBRA.US",
// ];

// const array4 = [
//     "ROST.US",
//     "FFIV.US",
//     "HRL.US",
//     "TSCO.US",
//     "COP.US",
//     "CSCO.US",
//     "AEE.US",
//     "CL.US",
//     "ALXN.US",
//     "DGX.US",
//     "AME.US",
//     "AOS.US",
//     "BIIB.US",
//     "MXIM.US",
//     "MSI.US",
//     "ESS.US",
//     "HIG.US",
//     "HFC.US",
//     "CDNS.US",
//     "EQIX.US",
//     "EXR.US",
//     "CVX.US",
//     "HUM.US",
//     "BBY.US",
//     "PLD.US",
//     "OXY.US",
//     "T.US",
//     "KLAC.US",
//     "LLY.US",
//     "APH.US",
//     "PRU.US",
//     "ATVI.US",
//     "VFC.US",
//     "EMN.US",
//     "IP.US",
//     "SPG.US",
//     "COF.US",
//     "CHD.US",
//     "BLL.US",
//     "AIV.US",
//     "PCAR.US",
//     "UA.US",
//     "ORCL.US",
//     "FRT.US",
//     "PNW.US",
//     "RL.US",
//     "HCA.US",
//     "FIS.US",
//     "ZTS.US",
//     "CDW.US",
//     "URI.US",
//     "COST.US",
//     "AAPL.US",
//     "BA.US",
//     "DUK.US",
//     "BDX.US",
//     "SLG.US",
//     "PNR.US",
//     "K.US",
//     "PAYX.US",
//     "CAH.US",
//     "MKC.US",
//     "FLIR.US",
//     "PEG.US",
//     "ALK.US",
//     "UDR.US",
//     "VNO.US",
//     "MA.US",
//     "GOOGL.US",
//     "HOLX.US",
//     "LVS.US",
//     "BAC.US",
//     "MO.US",
//     "KMI.US",
//     "FE.US",
//     "HII.US",
//     "IPGP.US",
//     "NSC.US",
//     "LEN.US",
//     "ABT.US",
//     "WMB.US",
//     "TRV.US",
//     "VLO.US",
//     "CRM.US",
//     "SHW.US",
//     "WMT.US",
//     "ETFC.US",
//     "MMM.US",
//     "NWS.US",
//     "KMX.US",
//     "AWK.US",
//     "DFS.US",
//     "ALGN.US",
//     "NVDA.US",
//     "LYB.US",
//     "EBAY.US",
//     "COO.US",
//     "XOM.US",
//     "FOX.US",
// ];

// const array5 = [
//     "UAL.US",
//     "DG.US",
//     "ETN.US",
//     "ULTA.US",
//     "DISCK.US",
//     "LOW.US",
//     "PAYC.US",
//     "ADM.US",
//     "NTRS.US",
//     "EMR.US",
//     "AMZN.US",
//     "ADSK.US",
//     "KIM.US",
//     "CAT.US",
//     "PM.US",
//     "PNC.US",
//     "JNJ.US",
//     "EXPD.US",
//     "C.US",
//     "MDLZ.US",
//     "KSU.US",
//     "TAP.US",
//     "AXP.US",
//     "ALB.US",
//     "MDT.US",
//     "AAP.US",
//     "MHK.US",
//     "EA.US",
//     "EFX.US",
//     "ADBE.US",
//     "SCHW.US",
//     "RSG.US",
//     "PWR.US",
//     "MRK.US",
//     "DISCA.US",
//     "VRSK.US",
//     "NWSA.US",
//     "MSFT.US",
//     "TSN.US",
//     "BSX.US",
//     "LKQ.US",
//     "IEX.US",
//     "DE.US",
//     "ROK.US",
//     "NOC.US",
//     "PFG.US",
//     "PXD.US",
//     "WDC.US",
//     "IDXX.US",
//     "AKAM.US",
//     "WFC.US",
//     "JNPR.US",
//     "CCL.US",
//     "AZO.US",
//     "HLT.US",
//     "LEG.US",
//     "SBAC.US",
//     "GOOG.US",
//     "FOXA.US",
//     "ECL.US",
//     "HST.US",
//     "IBM.US",
//     "ISRG.US",
//     "CPRT.US",
//     "NOV.US",
//     "DLR.US",
//     "TDG.US",
//     "AES.US",
//     "ED.US",
//     "ETR.US",
//     "L.US",
//     "HAL.US",
//     "MCK.US",
//     "BAX.US",
//     "GRMN.US",
//     "XRAY.US",
//     "PVH.US",
//     "TROW.US",
//     "HSY.US",
//     "DHI.US",
//     "BLK.US",
//     "F.US",
//     "DAL.US",
//     "WST.US",
//     "LRCX.US",
//     "HSIC.US",
//     "WYNN.US",
//     "ADI.US",
//     "LNT.US",
//     "INCY.US",
//     "HBAN.US",
//     "FB.US",
//     "AMGN.US",
//     "AIG.US",
//     "NI.US",
//     "DVN.US",
//     "PEP.US",
//     "OMC.US",
//     "LDOS.US",
//     "TMO.US",
//     "COG.US",
//     "MOS.US",
// ];

// const array6 = [
//     "MPC.US",
//     "DIS.US",
//     "ATO.US",
//     "CMS.US",
//     "DD.US",
//     "ORLY.US",
//     "CMCSA.US",
//     "STZ.US",
//     "NFLX.US",
//     "FANG.US",
//     "FTNT.US",
//     "GM.US",
//     "V.US",
//     "SWK.US",
//     "GE.US",
//     "JBHT.US",
//     "MET.US",
//     "GPC.US",
//     "MAR.US",
//     "O.US",
//     "UPS.US",
//     "BK.US",
//     "OKE.US",
//     "SEE.US",
//     "MKTX.US",
//     "VRTX.US",
//     "CHTR.US",
//     "MU.US",
//     "PBCT.US",
//     "DVA.US",
//     "PKI.US",
//     "XEL.US",
//     "LYV.US",
//     "DTE.US",
//     "IVZ.US",
//     "DPZ.US",
//     "PH.US",
//     "VRSN.US",
//     "GILD.US",
//     "APA.US",
//     "PSA.US",
//     "JCI.US",
//     "EXPE.US",
//     "SJM.US",
//     "MTB.US",
//     "CVS.US",
//     "D.US",
//     "XRX.US",
//     "XYL.US",
//     "BEN.US",
//     "TIF.US",
//     "ROP.US",
//     "SYK.US",
//     "DHR.US",
//     "TXT.US",
//     "RHI.US",
//     "ITW.US",
//     "JKHY.US",
//     "NUE.US",
//     "BWA.US",
//     "VZ.US",
//     "AMP.US",
//     "TWTR.US",
//     "MCO.US",
//     "YUM.US",
//     "HAS.US",
//     "RMD.US",
//     "UNH.US",
//     "FLT.US",
//     "PRGO.US",
//     "FRC.US",
//     "CI.US",
//     "WY.US",
//     "MMC.US",
//     "IR.US",
//     "AMD.US",
//     "ALLE.US",
//     "ARE.US",
//     "KR.US",
//     "MGM.US",
//     "CINF.US",
//     "CMI.US",
//     "DOV.US",
//     "SYY.US",
//     "FLS.US",
//     "BXP.US",
//     "RE.US",
//     "WAB.US",
//     "TMUS.US",
//     "USB.US",
//     "ZION.US",
//     "WM.US",
//     "ICE.US",
//     "FDX.US",
// ];

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// //Add the url string from mongodb
// // mongoose.connect("mongodb+srv://Numeraxial:123456!@tradesecuritydb.jcf2n.mongodb.net/StockMarket?retryWrites=true&w=majority", {
// mongoose.connect(
//     "mongodb+srv://anjolaoluwa:daniel23@cluster0.govojw4.mongodb.net/?retryWrites=true&w=majority",
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     }
// );

// const finalSchema = new mongoose.Schema(
//     {
//         Name: {
//             type: String,
//         },
//         ProfitMargin: Number,
//         PERatio: Number,
//         ReturnOnEquityTTM: Number,
//         ReturnOnAssetsTTM: Number,
//         EPSEstimateCurrentYear: Number,
//         DividendShare: Number,
//         PriceBookMRQ: Number,
//         PriceSales: Number,
//         FiftyTwoWeekHigh: Number,
//         FiftyTwoWeekLow: Number,
//         MarketCapitalizationMln: Number,
//         open: Number,
//         close: Number,
//         volume: Number,
//         Description: String,
//         CompanyName: String,
//         EBITDA: Number,
//         PriceSalesTTM: Number,
//         CorporateExecutive: String,
//     },
//     { timestamps: true }
// );

// const upload = async (url_1, url_2) => {
//     await axios
//         .all([axios.get(url_1), axios.get(url_2)])
//         .then(
//             axios.spread((value1, value2) => {
//                 const val1 = value1.data;
//                 const val2 = value2.data;

//                 var StockFinal = new Stock({
//                     Name: val2.General.Code,
//                     CompanyName: val2.General.Name,
//                     Description: val2.General.Description,
//                     CorporateExecutive: val2.General.Officers[0].Name,
//                     open: val1[0].open,
//                     close: val1[0].close,
//                     volume: val1[0].volume,
//                     ProfitMargin: val2.Highlights.ProfitMargin,
//                     EBITDA: val2.Highlights.EBITDA,
//                     PERatio: val2.Highlights.PERatio,
//                     PriceSalesTTM: val2.Valuation.PriceSalesTTM,
//                     DividendShare: val2.Highlights.DividendShare,
//                     ReturnOnEquityTTM: val2.Highlights.ReturnOnEquityTTM,
//                     ReturnOnAssetsTTM: val2.Highlights.ReturnOnAssetsTTM,
//                     EPSEstimateCurrentYear:
//                         val2.Highlights.EPSEstimateCurrentYear,
//                     MarketCapitalizationMln:
//                         val2.Highlights.MarketCapitalizationMln,
//                     PriceBookMRQ: val2.Valuation.PriceBookMRQ,
//                     PriceSales: val2.Valuation.PriceSales,
//                     FiftyTwoWeekHigh: val2.Technicals["52WeekHigh"],
//                     FiftyTwoWeekLow: val2.Technicals["52WeekLow"],
//                 });
//                 StockFinal.save();
//             })
//         )
//         .catch((error) => {
//             console.log(error);
//         });
// };

// //const StockPrice = mongoose.model("StockPrice", PriceSchema);
// //const StockFundamentals = mongoose.model("StockFundamental", fundaMentalsSchema);
// const Stock = mongoose.model("trade", finalSchema);

// app.get("/", function (req, res) {
//     res.sendFile(path.resolve(__dirname, "../index.html"));
// });

// app.post("/", function (req, res) {
//     const query = req.body.cityName;

//     for (var i = 0; i < array1.length; i++) {
//         companyName = array1[i];

//         let url_1 =
//             "https://eodhistoricaldata.com/api/eod/" +
//             companyName +
//             "?from=2020-08-19&to=2020-08-19&api_token=" +
//             apiKey;
//         let url_2 =
//             "https://eodhistoricaldata.com/api/fundamentals/" +
//             companyName +
//             "?api_token=" +
//             apiKey;

//         upload(url_1, url_2);
//     }

//     res.redirect("/");
// });

// app.post("/fetch", async (req, res) => {
//     let Min = req.body.min;
//     let Max = req.body.max;
//     let company = "";

//     Stock.find({
//         MarketCapitalizationMln: {
//             $gte: Min,
//             $lte: Max,
//         },
//     })
//         .exec()
//         .then((data) => {
//             data.forEach((datas) => {
//                 console.log(datas.Name);

//                 company += datas.Name + "\n";
//             });
//             console.log(company);
//             res.send(company);
//         });

//     //res.send(companies);
// });

const server = require("./server");
const mongodbconnection = require("./db");

function main() {
  mongodbconnection()
    .then(() => {
      server.listen(3001, () => {
        console.log("Server is up and running on port 3001");
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

main();
