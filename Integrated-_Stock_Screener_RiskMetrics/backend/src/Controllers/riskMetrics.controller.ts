"use strict";
import express from "express";
import { getHistoricalDataFromEOD } from "../services/historicalDataServices";
import { ITimeIntervalHistoricalData } from "../models/day_historical_data.model";
export const bindings: Bindings = require("../../build/ReportAnalysisNumeraxial.node");

const router = express.Router();

interface Bindings {
    HelloWorld(word: string): string;
    factorial(num: number): number;
    RiskMetrics: RiskMetrics;
}

interface RiskMetrics {
    Stocks<T extends string[]>(tickers: T, prices: number[][]): Portfolio<T>;
}

type Portfolio<T extends string[]> = {
    [key in T[number]]: {
        mean: number;
        sample_std: number;
        skew: number;
        kurt: number;
        annualized_return: number;
        m_squared: number;
        beta: number;
        t_stats: number;
        minrisk_weights: number;
    };
};


router.route("/").put(async (req, res) => {

    const data = req.body

    const tickersList = data.tickerList

    const historicalDataList = await getHistoricalDataFromEOD(data)

    const tickerInfo: string | any[] = []

    historicalDataList.tickersData.forEach((tickerData: ITimeIntervalHistoricalData) => {
        const tickerValues: Number[] = tickerData.data.map((item) => item.adjusted_close)
        // console.log(tickerValues)
        tickerInfo.push(tickerValues)
    })

    console.log(tickerInfo)

    const valueMatrix = arraysToMatrix(tickerInfo)
    const riskMetricsResults = bindings.RiskMetrics.Stocks(tickersList, valueMatrix)

    return res.json(riskMetricsResults)
});


router.route("/historicaldataeod").put(async (req, res) => {

    const data = req.body

    const tickersList = data.tickerList

    const historicalDataList = await getHistoricalDataFromEOD(data)

    return res.json(historicalDataList.toJSON())


});


function arraysToMatrix(arrays: string | any[]) {
    const numRows = arrays.length;
    const numCols = arrays.length > 0 ? arrays[0].length : 0;
    const matrix = [];

    for (let col = 0; col < numCols; col++) {
        const column = [];
        for (let row = 0; row < numRows; row++) {
            column.push(arrays[row][col]);
        }
        matrix.push(column);
    }

    return matrix;
}




module.exports = router;
