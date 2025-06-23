import axios, { AxiosResponse } from "axios";
import {
    SingleDayHistoricalData,
    TimeIntervalHistoricalData,
    HistoricalDataTickersList,
    IHistoricalDataTickersList
} from "../models/day_historical_data.model";

const API_EOD_URL = process.env.EOD_API_URL;
const API_EOD_TOKEN = process.env.EOD_API_KEY;

interface HistoricalDayResponse {
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    adjusted_close: Number,
    volume: Number
}

interface HistoricalDataRequest {
    start: string,
    to: string,
    tickerList: string[],
    country: string
}


function getRiskMetrics() {
    // Get risk metrics

}



export const getHistoricalDataFromEOD = async function (data: HistoricalDataRequest): Promise<IHistoricalDataTickersList> {
    console.log("Hello token", API_EOD_TOKEN)
    console.log("Hello Url", API_EOD_URL)
    const start = data.start
    const to = data.to
    const tickersList = data.tickerList
    const country = data.country


    const startDate = new Date(start)
    const toDate = new Date(to)
    // const ticker = "ADBE.US"

    const params = new URLSearchParams({
        period: 'd',
        api_token: `${API_EOD_TOKEN}`,
        fmt: 'json',
        from: `${start}`,
        to: `${to}`
    });

    const requests = tickersList.map(ticker => {
        let url = `${API_EOD_URL}/api/eod/${ticker}.${country}`
        console.log(url)

        return axios.get(url, { params: params })
    })

    const historicalDataList = new HistoricalDataTickersList();

    await axios.all(requests).then((responses: AxiosResponse[]) => {
        responses.forEach((resp) => {
            if (resp.status !== 200) throw new Error()

            let ticker = resp.config.url?.split('/').pop()
            const tickerHistoricalData = new TimeIntervalHistoricalData()
            tickerHistoricalData.ticker = ticker ? ticker : ''
            tickerHistoricalData.start = startDate
            tickerHistoricalData.to = toDate


            resp.data.forEach((item: HistoricalDayResponse) => {
                tickerHistoricalData.data.push(mapToSingleDayHistoricData(item))
            })

            historicalDataList.tickersData.push(tickerHistoricalData);
        })

        return historicalDataList


    })
        .catch(function (error: any) {
            if (error.response) {
                console.log("Error response");
                console.log(Error)
                console.log(error.response.data)
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log("Error request")
                console.log(error.request);
            } else {
                console.log("Error");
                console.log('Error', error.message);
            }
        })


    return historicalDataList

}

const mapToSingleDayHistoricData = (item: HistoricalDayResponse) => {
    const newDay = new SingleDayHistoricalData()
    newDay.date = item.date
    newDay.open = item.open
    newDay.high = item.high
    newDay.low = item.low
    newDay.close = item.close
    newDay.adjusted_close = item.adjusted_close
    newDay.volume = item.volume
    return newDay
}


module.exports = { getRiskMetrics, getHistoricalDataFromEOD };
