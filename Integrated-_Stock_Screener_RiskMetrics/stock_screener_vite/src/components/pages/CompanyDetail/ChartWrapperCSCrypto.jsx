import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-chart-financial';
import zoomPlugin from 'chartjs-plugin-zoom';
import ApexCharts from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import CustomToggleButtonGroup from '../../shared/CustomToggleButtonGroup';
import { CircularProgress, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200,
        },
    },
};

function getStyles(type, theme) {
    return {
        fontWeight:
            type.indexOf(type) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

// Register the candlestick controller and element
// Register chart.js components 
ChartJS.register(...registerables, zoomPlugin);

const ChartWrapperCSCrypto = ({ ticker, eodData }) => {
    console.log("here is data", eodData);
    const [chartType, setChartType] = useState('line');
    const [timeRange, setTimeRange] = useState('1m');
    const filterOptions = ['1d', '1w', '1m', '6m', '1y', '3y', '5y'];
    const [selected, setSelected] = useState(2);
    const chartTypes = ["line", "candle"]
    const theme = useTheme();
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

    const updateOption = (e) => {
        const option = parseInt(e.target.value);
        console.log(`Selected: ${option}`)
        setSelected(option);
        setTimeRange(filterOptions[option])

    };

    const chartContainerStyle = {
        width: '1400px',
        height: '800px',
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
        // if (!eodData || eodData.length === 0) {
        //     return <p>No data available to display the chart.</p>;
        // }


        if (!eodData || eodData.length === 0) {
            return (<>
                <div className="flex pt-20 pb-4 ml-[30%]">
                    <CircularProgress size={80} />
                </div>
            </>);
        }

        const chartData = getChartData();

        if (chartType === 'line') {
            return <Line data={chartData} options={chartOptions} />;
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

    const getChartTypeString = (type) => {
        return `${type[0].toUpperCase()}${type.substring(1)}`;
    }

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    }

    return (
        <>
            <Grid container spacing={2} >
                <Grid item xs={9} >
                    <Grid container spacing={2} direction="column" >
                        <Grid item xs={2} md={1} >
                            <CustomToggleButtonGroup active={selected} filterOptions={filterOptions} disabledButton={0} updateOption={updateOption} />
                        </Grid>
                        <Grid item name="chart-grid-item" xs={8} md={5} >
                            <div style={chartContainerStyle} className="ml-8">
                                {renderChart()}
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3} sx={{ marginTop: '12%' }}>
                    <FormControl sx={{ marginLeft: "15%", width: 200 }}>
                        <InputLabel id="demo-multiple-name-label">Char type</InputLabel>
                        <Select
                            labelId="chart-type-select"
                            id="chart-type-select"
                            value={chartType}
                            onChange={handleChartTypeChange}
                            input={<OutlinedInput label="Chart Type" />}
                            MenuProps={MenuProps}
                        >
                            {
                                chartTypes.map((type, index) => (
                                    <MenuItem
                                        key={index}
                                        value={type}
                                        style={getStyles(type, theme)}
                                    >
                                        {`${getChartTypeString(type)}`}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </>
    );




};

export default ChartWrapperCSCrypto;