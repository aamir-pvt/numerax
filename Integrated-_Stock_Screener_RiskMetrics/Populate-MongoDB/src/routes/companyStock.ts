import express, { Request, Response } from "express";
import path from "path";
import { companyList6 } from "../utils/constants/companyList.js";
import { getCompanyStocksDetails } from "../utils/requests/getCompanyStockDetails";
import { CompanyStockModel } from "../models/companyStocks";

const router = express.Router();

router.get("/", (_, res) => {
  res.sendFile(path.resolve(process.cwd(), "./index.html"));
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const promises = companyList6.map(async (companyName) => {
      try {
        const { val1, val2 } = await getCompanyStocksDetails(companyName);
        const lastEodData = val1.length - 1;
        const companyCodeFilter = { Name: val2.General.Code };
        const foundStock = await CompanyStockModel.findOne(companyCodeFilter);

        if (foundStock === null) {
          const stock = new CompanyStockModel({
            Name: val2.General.Code,
            CompanyName: val2.General.Name,
            Description: val2.General.Description,
            CorporateExecutive: "",
            open: val1[lastEodData].open,
            close: val1[lastEodData].close,
            volume: val1[lastEodData].volume,
            ProfitMargin: val2.Highlights.ProfitMargin,
            EBITDA: val2.Highlights.EBITDA,
            PERatio: val2.Highlights.PERatio,
            PriceSalesTTM: val2.Valuation.PriceSalesTTM,
            DividendShare: val2.Highlights.DividendShare,
            ReturnOnEquityTTM: val2.Highlights.ReturnOnEquityTTM,
            ReturnOnAssetsTTM: val2.Highlights.ReturnOnAssetsTTM,
            EPSEstimateCurrentYear: val2.Highlights.EPSEstimateCurrentYear,
            MarketCapitalizationMln: val2.Highlights.MarketCapitalizationMln,
            PriceBookMRQ: val2.Valuation.PriceBookMRQ,
            PriceSales: val2.Valuation.PriceSalesTTM,
            DivdendYield: val2.Highlights.DividendYield,
            Exchange: val2.General.Exchange,
            Sector: val2.General.Sector,
            Industry: val2.General.Industry,
            // Technicals
            FiftyTwoWeekHigh: val2.Technicals["52WeekHigh"],
            FiftyTwoWeekLow: val2.Technicals["52WeekLow"],
            Beta: val2.Technicals["Beta"],
            FiftyDayMA: val2.Technicals["50DayMA"],
            TwoHundredDayMA: val2.Technicals["200DayMA"],
            SharesShort: val2.Technicals["SharesShort"],
            SharesShortPriorMonth: val2.Technicals["SharesShortPriorMonth"],
            ShortRatio: val2.Technicals["ShortRatio"],
            ShortPercent: val2.Technicals["ShortPercent"],
          });
          await stock.save();
        } else {
          await CompanyStockModel.updateOne(companyCodeFilter, {
            CompanyName: val2.General.Name,
            Description: val2.General.Description,
            CorporateExecutive: val2.General.Officers[0].Name,
            open: val1[lastEodData].open,
            close: val1[lastEodData].close,
            volume: val1[lastEodData].volume,
            ProfitMargin: val2.Highlights.ProfitMargin,
            EBITDA: val2.Highlights.EBITDA,
            PERatio: val2.Highlights.PERatio,
            PriceSalesTTM: val2.Valuation.PriceSalesTTM,
            DividendShare: val2.Highlights.DividendShare,
            ReturnOnEquityTTM: val2.Highlights.ReturnOnEquityTTM,
            ReturnOnAssetsTTM: val2.Highlights.ReturnOnAssetsTTM,
            EPSEstimateCurrentYear: val2.Highlights.EPSEstimateCurrentYear,
            MarketCapitalizationMln: val2.Highlights.MarketCapitalizationMln,
            PriceBookMRQ: val2.Valuation.PriceBookMRQ,
            PriceSales: val2.Valuation.PriceSalesTTM,
            DivdendYield: val2.Highlights.DividendYield,
            Exchange: val2.General.Exchange,
            Sector: val2.General.Sector,
            Industry: val2.General.Industry,
            // Technicals
            FiftyTwoWeekHigh: val2.Technicals["52WeekHigh"],
            FiftyTwoWeekLow: val2.Technicals["52WeekLow"],
            Beta: val2.Technicals["Beta"],
            FiftyDayMA: val2.Technicals["50DayMA"],
            TwoHundredDayMA: val2.Technicals["200DayMA"],
            SharesShort: val2.Technicals["SharesShort"],
            SharesShortPriorMonth: val2.Technicals["SharesShortPriorMonth"],
            ShortRatio: val2.Technicals["ShortRatio"],
            ShortPercent: val2.Technicals["ShortPercent"],
          });

          await foundStock.save();
        }
      } catch (err: any) {
        if (err.response) {
          console.log(err.response);
        } else {
          console.log(err);
        }
      }
    });

    await Promise.all(promises);

    res.send("Companies data updated successfully");
  } catch (error) {
    console.error("Error processing companies:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetch", async (req, res) => {
  let Min = req.body.min;
  let Max = req.body.max;
  let company = "";

  CompanyStockModel.find({
    MarketCapitalizationMln: {
      $gte: Min,
      $lte: Max,
    },
  })
    .exec()
    .then((data) => {
      data.forEach((datas) => {
        console.log(datas.Name);

        company += datas.Name + "\n";
      });
      console.log(company);
      res.send(company);
    });
});

module.exports = router;
