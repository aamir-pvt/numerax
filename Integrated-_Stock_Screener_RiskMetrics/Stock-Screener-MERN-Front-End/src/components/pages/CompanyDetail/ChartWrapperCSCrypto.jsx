// import React, { useRef, useState, useEffect } from "react";
// import CSChart from "./CSChart";
// import Papa from 'papaparse';
// import axios from 'axios';

// const ChartWrapperCSCrypto = ({ stock, ticker, mode, eodData }) => {
//     const chartArea = useRef(null);
//     const [chart, setChart] = useState(null);
//     const [data, setData] = useState(null);
//     const [dailyData, setDaily] = useState(null);
//     const [weekSelectData, setWeekSelectData] = useState(null);
//     const [yearSelectData, setYearSelectData] = useState(null);

//     // console.log("here's eod data", eodData);

//     const FilterDateData = (data, mode) => {
//         var dateData = [];

//          // Log the input data
//          console.log("Input data to FilterDateData", data);

//         switch (mode) {
//             case 0:
//                 console.log("To be implemented...");

//                 break;
//             case 1:
//                 dateData = data;
//                 break;
//             case 2:
//                 if (data.length < 30) {
//                     dateData = data;
//                 } else {
//                     dateData = data.slice(data.length - 20, data.length);
//                 }
//                 break;
//             case 3:
//                 if (data.length < 126) {
//                     dateData = data;
//                 } else {
//                     dateData = data.slice(data.length - 126, data.length);
//                 }
//                 break;
//             case 4:
//                 if (data.length < 252) {
//                     dateData = data;
//                 } else {
//                     dateData = data.slice(data.length - 252, data.length);
//                 }
//                 break;
//             case 5:
//                 if (data.length < 756) {
//                     dateData = data;
//                 } else {
//                     dateData = data.slice(data.length - 756, data.length);
//                 }
//                 break;
//             case 6:
//                 // if(data.length < 756){
//                 dateData = data;
//                 console.log(data);
//                 console.log(mode);
//                 // }
//                 // else {
//                 // 	dateData = data.slice(data.length - 756, data.length)
//                 // }
//                 break;
//             default:
//                 if (data.length < 756) {
//                     dateData = data;
//                 } else {
//                     dateData = data.slice(data.length - 756, data.length);
//                 }
//                 break;
//         }
//         // Log the output
//         console.log("Output from FilterDateData", dateData);
//         return dateData;
//     };

//     // const fetchHistoricalData = async () => {
//     //     const tick = ticker.companyName;
//     //     const baseUrl = "https://eodhistoricaldata.com/api";
//     //     const apiToken = "5f05df8fcc7b27.737025968237";
//     //     var today = new Date();
//     //     var priorDate = new Date();
//     //     var url = "";
    
//     //     if (mode === 0 || mode === 1) {
//     //         url = `${baseUrl}/intraday/${tick}?from=${Math.floor(
//     //             new Date(new Date().setHours(0, 0, 0, 0)) / 1000
//     //         )}&to=${Math.floor(new Date() / 1000)}&api_token=${apiToken}&interval=5m&fmt=json`;
//     //     } else if (mode > 1 && mode < 6) {
//     //         url = `${baseUrl}/eod/${tick}?from=${new Date(
//     //             priorDate.setDate(today.getDate() - 1825)
//     //         )
//     //             .toISOString()
//     //             .split("T")[0]}&to=${today.toISOString().split("T")[0]}&api_token=${apiToken}&order=a&fmt=csv&period=d`;
//     //     } else if (mode === 6) {
//     //         url = `${baseUrl}/eod/${tick}?from=${new Date(
//     //             priorDate.setDate(today.getDate() - 1825)
//     //         )
//     //             .toISOString()
//     //             .split("T")[0]}&to=${today.toISOString().split("T")[0]}&api_token=${apiToken}&order=a&fmt=csv&period=w`;
//     //     }
    
//     //     try {
//     //         const response = await fetch(url);
//     //         const text = await response.text();
//     //         const parsedData = Papa.parse(text, { header: true }).data;
    
//     //         let data = parsedData;
//     //         if (mode === 0 || mode === 1) {
//     //             data = restructureIntraData(parsedData);
//     //             setWeekSelectData(data);
//     //         } else if (mode > 1 && mode < 6) {
//     //             data = restructureDailyData(parsedData);
//     //             setDaily(data);
//     //         } else if (mode === 6) {
//     //             data = restructureWeeklyData(parsedData);
//     //             setYearSelectData(data);
//     //         }
    
//     //         setData(FilterDateData(data, mode));
//     //     } catch (error) {
//     //         console.error("Error fetching historical data:", error);
//     //     }
//     // };
    

//     // useEffect(() => {
//     //     if (mode > 1 && mode < 6) {
//     //         if (dailyData == null) {
//     //             fetchHistoricalData();
//     //         } else {
//     //             setData(FilterDateData(dailyData, mode));
//     //         }
//     //     } else if (mode < 2) {
//     //         if (weekSelectData == null) {
//     //             fetchHistoricalData();
//     //         } else {
//     //             setData(FilterDateData(weekSelectData, mode));
//     //         }
//     //     } else if (mode > 5) {
//     //         if (yearSelectData == null) {
//     //             fetchHistoricalData();
//     //         } else {
//     //             setData(FilterDateData(yearSelectData, mode));
//     //         }
//     //     }
//     // }, [mode]);

//     // useEffect(() => {
//     //     if (eodData) {
//     //         const validData = eodData.filter(entry => entry && entry.Date);
            
//     //         const chartData = {
//     //             labels: validData.map(entry => entry.Date),
//     //             datasets: [
//     //                 {
//     //                     label: 'Open',
//     //                     backgroundColor: 'rgba(75,192,192,0.4)',
//     //                     borderColor: 'rgba(75,192,192,1)',
//     //                     data: validData.map(entry => entry.Open),
//     //                     fill: false,
//     //                 },
//     //                 {
//     //                     label: 'Close',
//     //                     backgroundColor: 'rgba(255,99,132,0.2)',
//     //                     borderColor: 'rgba(255,99,132,1)',
//     //                     data: validData.map(entry => entry.Close),
//     //                     fill: false,
//     //                 }
//     //             ]
//     //         };
//     //         setData(chartData);
//     //     }
//     // }, [eodData]);
    

//     useEffect(() => {
//         if (eodData) {
//             const validData = eodData.filter(entry => entry && entry.Date);
//             console.log("Valid data", validData);
        
//             let newData;
//             if (mode === 0 || mode === 1) {
//                 newData = restructureIntraData(validData);
//             } else if (mode > 1 && mode < 6) {
//                 newData = restructureIntraData(validData);
//             } else if (mode === 6) {
//                 newData = restructureIntraData(validData);
//             }
//             console.log("New data", newData);

//             const filteredData = FilterDateData(newData, mode);
//             console.log("Filtered data", filteredData);
            

//             setData(filteredData);
//             //  console.log("Date",dateData);

//             //  if (data) {
//             //     // const filteredData = FilterDateData(data, mode);
//             //     // setData(filteredData);
//             //     // console.log("FilteredData", filteredData);
//             //  }
//         }
//     }, [eodData, mode]);

//     // Restructuring Intra Day Data for D3.js chart.
//     const restructureIntraData = (Chartdata) => {
//         let lastIndex = 0;
//         const builtData = [];
//         Chartdata.map((value, index) => {
//             if (lastIndex + 12 === index) {
//                 let time = new Date(value.timestamp * 1000);

//                 let newDataPoint = {
//                     Date: new Date(value.Date),
//                     Adjusted_Open: value.Open || 0,
//                     Adjusted_Close: value.Close || 0,
//                     Adjusted_High: value.High || 0,
//                     Adjusted_Low: value.Low || 0,
//                     Volume: value.Volume || 0,
//                 };
//                 builtData.push(newDataPoint);
//                 lastIndex = index;
//             }
//         });
//         return builtData;
//     };

//     // Restructuring Daily Data for D3.js chart.
//     const restructureDailyData = (Chartdata) => {
//         const builtData = [];
//         Chartdata.map((value, index) => {
//             let newDataPoint = {
//                 Date: new Date(value.Date),
//                 Open: value.Open || 0,
//                 Close: value.Close || 0,
//                 High: value.High || 0,
//                 Low: value.Low || 0,
//                 Volume: value.Volume || 0,
//                 Adjusted_Close: value.Adjusted_Close || 0,
//                 Adjusted_High:
//                     (value.Adjusted_Close / value.Close) * value.High || 0,
//                 Adjusted_Low:
//                     (value.Adjusted_Close / value.Close) * value.Low || 0,
//                 Adjusted_Open:
//                     (value.Adjusted_Close / value.Close) * value.Open || 0,
//             };
//             builtData.push(newDataPoint);
//         });
//         return builtData;
//     };

//     // Restructuring Weekly Data for D3.js chart.
//     const restructureWeeklyData = (Chartdata) => {
//         const builtData = [];
//         Chartdata.map((value, index) => {
//             let newDataPoint = {
//                 Date: new Date(value.Date),
//                 Open: value.Open || 0,
//                 Close: value.Close || 0,
//                 High: value.High || 0,
//                 Low: value.Low || 0,
//                 Volume: value.Volume || 0,
//                 Adjusted_Close: value.Adjusted_Close || 0,
//                 Adjusted_High:
//                     (value.Adjusted_close / value.Close) * value.High || 0,
//                 Adjusted_Low:
//                     (value.Adjusted_close / value.Close) * value.Low || 0,
//                 Adjusted_Open:
//                     (value.Adjusted_close / value.Close) * value.Open || 0,
//             };
//             builtData.push(newDataPoint);
//         });
//         return builtData;
//     };

//     useEffect(() => {
//         if (!chart && data) {
//             // console.log('Data passed to CSChart', data);
//             // console.log("chart area" , chartArea.current);
//             // console.log("chart data" , data);
//             // console.log("chart ticker" , ticker.companyName);
//             // console.log("chart mode" , mode);
//             setChart(
//                 new CSChart(
//                     chartArea.current,
//                     data,
//                     ticker.companyName,
//                     mode
//                 )
//             );
//         } else if (chart && data) {
//             chart.update(chartArea.current, data, ticker.companyName, mode);
//         }
//     }, [chart, data]);

//     return (
//         <>
//             <div className="chart-area" ref={chartArea}></div>
//             {/* <ChartButton handleLine={} handleCandlestick={} /> */}
//         </>
//     );
// };

// export default ChartWrapperCSCrypto;









import React, { useState } from 'react';
import { Line, Chart } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-chart-financial';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { ChartCanvas, CandlestickSeries, XAxis, YAxis } from 'react-financial-charts';
import { scaleTime } from 'd3-scale';
import ApexCharts from 'react-apexcharts';

// Register the candlestick controller and element
// Register chart.js components
ChartJS.register(...registerables, zoomPlugin);

const ChartWrapperCSCrypto = ({ stock, ticker, mode, eodData }) => {
    console.log("here is data",eodData);
    const [chartType, setChartType] = useState('line');
    const [timeRange, setTimeRange] = useState('1d');
    const chartOptions = {
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x',
            },
          },
        },
        // ... other options
      };
      
      const chartContainerStyle = {
        width: '800px',
        height: '500px',
    };
    
    // Function to filter data based on selected time range
    const filterDataByTimeRange = (rawData, range) => {
        const now = new Date();
        return rawData.filter(item => {
            const itemDate = new Date(item.Date);
            switch (range) {
                case '1d':
                    return now - itemDate <= 1 * 24 * 60 * 60 * 1000; // Last 24 hours
                case '1w':
                    return now - itemDate <= 7 * 24 * 60 * 60 * 1000; // Last week
                case '1m':
                    return now - itemDate <= 30 * 24 * 60 * 60 * 1000; // Last month
                case '6m':
                    return now - itemDate <= 6 * 30 * 24 * 60 * 60 * 1000; // Last 6 months
                case '1y':
                    return now - itemDate <= 12 * 30 * 24 * 60 * 60 * 1000; // Last year
                case '3y':
                    return now - itemDate <= 3 * 12 * 30 * 24 * 60 * 60 * 1000; // Last 3 years
                case '5y':
                    return now - itemDate <= 5 * 12 * 30 * 24 * 60 * 60 * 1000; // Last 5 years
                default:
                    return true;
                }
            });
        };
    
        // Function to prepare chart data
        const getChartData = () => {
            const filteredData = filterDataByTimeRange(eodData, timeRange);
        
            let chartData;
            if (chartType === 'line') {
                chartData = {
                    labels: filteredData.map(item => item.Date),
                    datasets: [{
                        label: ticker.companyName,
                        data: filteredData.map(item => parseFloat(item.Close)),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        borderColor: 'rgba(53, 162, 235, 1)',
                        borderWidth: 1
                    }]
                };
            } else { // For candlestick chart
                chartData = {
                    labels: filteredData.map(item => item.Date),
                    datasets: [{
                        label: ticker.companyName,
                        data: filteredData.map(item => ({
                            date: new Date(item.Date), // Directly using 'date'
                            open: parseFloat(item.Open).toFixed(2),
                            high: parseFloat(item.High).toFixed(2),
                            low: parseFloat(item.Low).toFixed(2),
                            close: parseFloat(item.Close).toFixed(2)
                        })),
                        // Candlestick specific styling goes here
                    }]
                };
            }
            
        
            return chartData;
        };
    
        // Render the chart based on the selected type
        const renderChart = () => {
            if (!eodData || eodData.length === 0) {
                return <p>No data available to display the chart.</p>;
            }
        
            const chartData = getChartData();
        
            if (chartType === 'line') {
                return <Line data={chartData} options={chartOptions}/>;
            } else {
                // Candlestick chart rendering using ApexCharts
                const candlestickSeries = [{
                    data: chartData.datasets[0].data.map(item => ({
                        x: item.date,
                        y: [item.open, item.high, item.low, item.close]
                    }))
                }];
        
                const candlestickOptions = {
                    chart: {
                        type: 'candlestick',
                        height: 350
                    },
                    title: {
                        text: 'Candlestick Chart',
                        align: 'left'
                    },
                    xaxis: {
                        type: 'datetime'
                    },
                    yaxis: {
                        tooltip: {
                            enabled: true
                        },
                        labels: {
                            formatter: function (val) {
                                return val.toFixed(2); // Formats the y-axis values to two decimal places
                            }
                        }
                    }
                };
                
        
                return <ApexCharts options={candlestickOptions} series={candlestickSeries} type="candlestick" height={350} />;
            }
        };
    
        return (
            <div>
                {/* Bootstrap styled select dropdown for selecting chart type */}
                <div className="mb-2">
    {/* You can adjust the col-* numbers as needed to make the dropdown match your desired width */}
    <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3">
            <select 
                className="form-select btn btn-outline-secondary" 
                value={chartType} 
                onChange={(e) => setChartType(e.target.value)}
                aria-label="Chart type select"
            >
                <option value="line">Line Chart</option>
                <option value="candle">Candle Chart</option>
            </select>
        </div>
    </div>
</div>

        
                {/* Bootstrap styled button group for time range */}
                <div className="btn-group mb-2" role="group" aria-label="Time range">
                    {['1d', '1w', '1m', '6m', '1y', '3y', '5y'].map(range => (
                        <button 
                            key={range} 
                            type="button" 
                            className={`btn ${timeRange === range ? 'btn-secondary' : 'btn-outline-secondary'}`} 
                            onClick={() => setTimeRange(range)}
                        >
                            {range.toUpperCase()}
                        </button>
                    ))}
                </div>
        
                {/* Chart container */}
                <div style={chartContainerStyle}>
                    {renderChart()}
                </div>
            </div>
        );
        
        
        
        
    };
    
    export default ChartWrapperCSCrypto;
    