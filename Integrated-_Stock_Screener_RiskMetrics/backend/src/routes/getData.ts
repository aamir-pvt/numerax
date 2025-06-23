"use strict";
import express from "express";
import { Parser } from "json2csv";
const router = express.Router();
import Companies from "../models/companies.model";

const body = {
    page: 10,
    filters: {
        MarketCapitalizationMln: {
            Min: 2,
            Max: 300,
        },
    },
};

// "MarketCapitalizationMln": {
//   "Min": 2,
//   "Max": 3
// },

//we check the routes req body to get the filter values
type GetAllCompaniesReq = {
    page: number;
    companySearch: string;
    selections: {
        exchange: string;
        index: string;
        sector: string;
        industry: string;
    };
    filters: {
        [key: string]: { Min?: number; Max?: number };
    };
};

router.route("/download").post((req, res) => {
    const body = req.body as Omit<GetAllCompaniesReq, "page">;
    const filters = body.filters;
    const selections = body.selections;

    const queryFilters: Record<
        string,
        {
            $gte?: number;
            $lte?: number;
        }
    > = {};
    const querySelections: Record<string, string> = {};

    for (let key in filters) {
        if (!filters[key].Min && !filters[key].Max) {
            continue;
        }

        queryFilters[key] = {};
        if (filters[key].Min) {
            queryFilters[key].$gte = filters[key].Min;
        }
        if (filters[key].Max) {
            queryFilters[key].$lte = filters[key].Max;
        }
    }

    // building query for properties with distinct values e.g index, exchange, industry, sector
    for (let key in selections) {
        const selection =
            selections[key as keyof GetAllCompaniesReq["selections"]];
        if (selection) {
            querySelections[key] = selection;
        }
    }

    // building query for searches by similar name or code values e.g AAPL or apple
    const companySearchQuery = {
        $regex: `.*${body.companySearch}.*`,
        $options: "i",
    };

    Companies.find({
        ...queryFilters,
        ...querySelections,
        $or: [
            {
                CompanyName: companySearchQuery,
            },
            {
                Name: companySearchQuery,
            },
        ],
    })
        .sort({ Name: 1 })
        .exec()
        .then((data) => {
            const json2csvParser = new Parser({
                fields: [
                    "CompanyName",
                    "DivdendYield",
                    "DividendShare",
                    "EBITDA",
                    "EPSEstimateCurrentYear",
                    "Exchange",
                    "Industry",
                    "MarketCapitalizationMln",
                    "Name",
                    "ProfitMargin",
                    "PriceBookMRQ",
                    "PriceSalesTTM",
                    "ReturnOnEquityTTM",
                    "ReturnOnAssetsTTM",
                    "Sector",
                    // Technicals
                    "FiftyTwoWeekHigh",
                    "FiftyTwoWeekLow",
                    "Beta",
                    "FiftyDayMA",
                    "TwoHundredDayMA",
                    "SharesShort",
                    "SharesShortPriorMonth",
                    "ShortRatio",
                    "ShortPercent",
                ],
            });
            const csv = json2csvParser.parse(data);
            res.header("Content-Type", "text/csv");
            res.attachment("untitled.csv");
            return res.send(csv);
        });
});

router.route("/").post((req, res) => {
    const body = req.body as GetAllCompaniesReq;
    const filters = body.filters;
    const selections = body.selections;

    const queryFilters: Record<
        string,
        {
            $gte?: number;
            $lte?: number;
        }
    > = {};

    const querySelections: Record<string, string> = {};

    // buidling query for properties with ranged values e.g MarketCap, DividendYield
    for (let key in filters) {
        if (!filters[key].Min && !filters[key].Max) {
            continue;
        }

        queryFilters[key] = {};
        if (filters[key].Min) {
            queryFilters[key].$gte = filters[key].Min;
        }
        if (filters[key].Max) {
            queryFilters[key].$lte = filters[key].Max;
        }
    }

    // building query for properties with distinct values e.g index, exchange, industry, sector
    for (let key in selections) {
        const selection =
            selections[key as keyof GetAllCompaniesReq["selections"]];
        if (selection) {
            querySelections[key] = selection;
        }
    }

    // building query for searches by similar name or code values e.g AAPL or apple
    const companySearchQuery = {
        $regex: `.*${body.companySearch}.*`,
        $options: "i",
    };
    //here we pass in the object
    Companies.find({
        ...queryFilters,
        ...querySelections,
        $or: [
            {
                CompanyName: companySearchQuery,
            },
            {
                Name: companySearchQuery,
            },
        ],
    })
        .sort({ Name: 1 })
        .limit(20)
        .skip(20 * (body.page - 1))
        .exec()
        .then((data) => {
            Companies.countDocuments({
                ...queryFilters,
                ...querySelections,
                $or: [
                    {
                        CompanyName: companySearchQuery,
                    },
                    {
                        Name: companySearchQuery,
                    },
                ],
            })
                .then((count) => {
                    res.json({
                        totalCount: count,
                        page: body.page,
                        pageSize: 20,
                        totalPages: count === 0 ? 0 : Math.ceil(count / 20),
                        data: data,
                    });
                })
                .catch((err) => {
                    res.status(500).json("Internal Server Error");
                    console.log(err);
                });
        })
        .catch((err) => {
            res.status(500).json("Internal Server Error");
            console.log(err);
        });
});
module.exports = router;
