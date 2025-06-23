import React, { useRef, useState, useEffect } from "react";
import CSChart from "./CSChart";
import PropTypes from 'prop-types';


const API_KEY = import.meta.env.VITE_EOD_API_KEY
const EOD_API = import.meta.env.VITE_EOD_URL

const ChartWrapperCS = ({ ticker, mode }) => {
    const chartArea = useRef(null);
    const [chart, setChart] = useState(null);
    const [data, setData] = useState(null);
    const [dailyData, setDaily] = useState(null);
    const [weekSelectData, setWeekSelectData] = useState(null);
    const [yearSelectData, setYearSelectData] = useState(null);

    const FilterDateData = (data, mode) => {
        var dateData = [];

        switch (mode) {
            case 0:
                // console.log("To be implemented...");
                break;
            case 1:
                dateData = data;
                break;
            case 2:
                if (data.length < 30) {
                    dateData = data;
                } else {
                    dateData = data.slice(data.length - 20, data.length);
                }
                break;
            case 3:
                if (data.length < 126) {
                    dateData = data;
                } else {
                    dateData = data.slice(data.length - 126, data.length);
                }
                break;
            case 4:
                if (data.length < 252) {
                    dateData = data;
                } else {
                    dateData = data.slice(data.length - 252, data.length);
                }
                break;
            case 5:
                if (data.length < 756) {
                    dateData = data;
                } else {
                    dateData = data.slice(data.length - 756, data.length);
                }
                break;
            case 6:
                // if(data.length < 756){
                dateData = data;
                // console.log(data);
                // console.log(mode);
                // }
                // else {
                // 	dateData = data.slice(data.length - 756, data.length)
                // }
                break;
            default:
                if (data.length < 756) {
                    dateData = data;
                } else {
                    dateData = data.slice(data.length - 756, data.length);
                }
                break;
        }
        return dateData;
    };

    const fetchHistoricalData = async () => {
        const tick = ticker.companyName;
        var today = new Date();
        var priorDate = new Date();
        // https://cors-anywhere.herokuapp.com/
        // const EOD_API = "https://eodhistoricaldata.com/api";
        // const API_KEY = "5f05df8fcc7b27.737025968237";
        var url =
            EOD_API +
            "/intraday/" +
            tick +
            "?from=" +
            Math.floor(new Date(new Date().setHours(0, 0, 0, 0)) / 1000) +
            "&to=" +
            Math.floor(new Date() / 1000) +
            "&api_token=" +
            API_KEY +
            "&interval=5m&fmt=json";
        if (mode === 0) {
            url =
                EOD_API +
                "/intraday/" +
                tick +
                "?from=" +
                Math.floor(new Date(new Date().setHours(0, 0, 0, 0)) / 1000) +
                "&to=" +
                Math.floor(new Date() / 1000) +
                "&api_token=" +
                API_KEY +
                "&interval=5m&fmt=json";
        } else if (mode === 1) {
            url =
                EOD_API +
                "/intraday/" +
                tick +
                "?from=" +
                Math.floor(
                    new Date(priorDate.setDate(today.getDate() - 7)) / 1000
                ) +
                "&to=" +
                Math.floor(new Date() / 1000) +
                "&api_token=" +
                API_KEY +
                "&interval=5m&fmt=json";
        }
        //   else if(mode === 2){

        // 	url = "https://cors-anywhere.herokuapp.com/https://eodhistoricaldata.com/api/eod/" +
        //       tick +
        //       "?from="+new Date(priorDate.setDate(today.getDate()-30)).toISOString().split("T")[0]+'&to='+today.toISOString().split("T")[0]+"&api_token=5f05dbbf1f59a5.46485507"+"&order=a&fmt=json";
        //   }
        //   else if(mode === 3){
        // 	url = "https://cors-anywhere.herokuapp.com/https://eodhistoricaldata.com/api/eod/" +
        //       tick +
        //       "?from="+new Date(priorDate.setDate(today.getDate()-186)).toISOString().split("T")[0]+'&to='+today.toISOString().split("T")[0]+"&api_token=5f05dbbf1f59a5.46485507"+"&order=a&fmt=json";
        //   }
        //   else if(mode === 4){
        // 	url = "https://cors-anywhere.herokuapp.com/https://eodhistoricaldata.com/api/eod/" +
        //       tick +
        //       "?from="+new Date(priorDate.setDate(today.getDate()-365)).toISOString().split("T")[0]+'&to='+today.toISOString().split("T")[0]+"&api_token=5f05dbbf1f59a5.46485507"+"&order=a&fmt=json&period=d";
        //   }
        else if (mode > 1 && mode < 6) {
            url =
                EOD_API +
                "/eod/" +
                tick +
                "?from=" +
                new Date(priorDate.setDate(today.getDate() - 1825))
                    .toISOString()
                    .split("T")[0] +
                "&to=" +
                today.toISOString().split("T")[0] +
                "&api_token=" +
                API_KEY +
                "&order=a&fmt=json&period=d";
        } else if (mode === 6) {
            url =
                EOD_API +
                "/eod/" +
                tick +
                "?from=" +
                new Date(priorDate.setDate(today.getDate() - 1825))
                    .toISOString()
                    .split("T")[0] +
                "&to=" +
                today.toISOString().split("T")[0] +
                "&api_token=" +
                API_KEY +
                "&order=a&fmt=json&period=w";
        }


        await fetch(url)
            .then((response) => {
                // console.log(response);
                return response.json();
            })
            .then((fetchedData) => {
                //  console.log(data[0].timestamp);
                //   let slicedData = fecthedData.slice(1658, 1716);
                // console.log(fetchedData);
                let data = fetchedData;

                if (mode === 0 || mode === 1) {
                    data = restructureIntraData(fetchedData);
                    setWeekSelectData(data);
                } else if (mode > 1 && mode < 6) {
                    data = restructureDailyData(fetchedData);
                    setDaily(data);
                } else if (mode === 6) {
                    data = restructureWeeklyData(fetchedData);
                    setYearSelectData(data);
                }
                // console.log(mode);
                setData(FilterDateData(data, mode));
                // console.log(data);
            });
    };

    useEffect(() => {
        if (mode > 1 && mode < 6) {
            if (dailyData == null) {
                fetchHistoricalData();
            } else {
                setData(FilterDateData(dailyData, mode));
            }
        } else if (mode < 2) {
            if (weekSelectData == null) {
                fetchHistoricalData();
            } else {
                setData(FilterDateData(weekSelectData, mode));
            }
        } else if (mode > 5) {
            if (yearSelectData == null) {
                fetchHistoricalData();
            } else {
                setData(FilterDateData(yearSelectData, mode));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    // Restructuring Intra Day Data for D3.js chart.
    const restructureIntraData = (Chartdata) => {
        let lastIndex = 0;
        const builtData = [];
        Chartdata.map((value, index) => {
            if (lastIndex + 12 === index) {
                // let time = new Date(value.timestamp * 1000);

                let newDataPoint = {
                    Date: new Date(value.timestamp * 1000),
                    Adjusted_Open: value.open || 0,
                    Adjusted_Close: value.close || 0,
                    Adjusted_High: value.high || 0,
                    Adjusted_Low: value.low || 0,
                    Volume: value.volume || 0,
                };
                builtData.push(newDataPoint);
                lastIndex = index;
            }
        });
        return builtData;
    };

    // Restructuring Daily Data for D3.js chart.
    const restructureDailyData = (Chartdata) => {
        const builtData = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Chartdata.map((value, index) => {
            let newDataPoint = {
                Date: value.date,
                Open: value.open || 0,
                Close: value.close || 0,
                High: value.high || 0,
                Low: value.low || 0,
                Volume: value.volume || 0,
                Adjusted_Close: value.adjusted_close || 0,
                Adjusted_High:
                    (value.adjusted_close / value.close) * value.high || 0,
                Adjusted_Low:
                    (value.adjusted_close / value.close) * value.low || 0,
                Adjusted_Open:
                    (value.adjusted_close / value.close) * value.open || 0,
            };
            builtData.push(newDataPoint);
        });
        return builtData;
    };

    // Restructuring Weekly Data for D3.js chart.
    const restructureWeeklyData = (Chartdata) => {
        const builtData = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Chartdata.map((value, index) => {
            let newDataPoint = {
                Date: value.date,
                Open: value.open || 0,
                Close: value.close || 0,
                High: value.high || 0,
                Low: value.low || 0,
                Volume: value.volume || 0,
                Adjusted_Close: value.adjusted_close || 0,
                Adjusted_High:
                    (value.adjusted_close / value.close) * value.high || 0,
                Adjusted_Low:
                    (value.adjusted_close / value.close) * value.low || 0,
                Adjusted_Open:
                    (value.adjusted_close / value.close) * value.open || 0,
            };
            builtData.push(newDataPoint);
        });
        return builtData;
    };

    useEffect(() => {
        if (!chart) {
            if (data == null) {
                fetchHistoricalData();
            } else {
                setChart(
                    new CSChart(
                        chartArea.current,
                        data,
                        ticker.companyName,
                        mode
                    )
                );
            }
        } else {
            chart.update(chartArea.current, data, ticker.companyName, mode);
            chart.update(chartArea.current, data, ticker.companyName, mode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chart, data]);

    return (
        <>
            <div className="chart-area pl-8" ref={chartArea}></div>
            {/* <ChartButton handleLine={} handleCandlestick={} /> */}
        </>
    );
};



ChartWrapperCS.propTypes = {
    ticker: PropTypes.object.isRequired,
    mode: PropTypes.number.isRequired
}

export default ChartWrapperCS;
