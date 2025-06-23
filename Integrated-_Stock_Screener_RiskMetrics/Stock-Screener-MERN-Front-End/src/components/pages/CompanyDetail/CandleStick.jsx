import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";

class CandleStick extends React.Component {
  constructor(props) {
    super(props);

    let count = 20;
    this.state = {
      series: [
        {
          name: "candle",
        },
      ],
      options: {
        chart: {
          type: "category",
          zoom: {
            enabled: true,
            type: "xy",
            autoScaleYaxis: true,
            autoScaleXaxis: true,
          },
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: false,
              zoomout: false,
              pan: true,
              reset: true | '<img src="/static/icons/reset.png" width="20">',
              customIcons: [],
            },
          },
        },
        tooltip: {
          custom: function (opts) {
            const desc =
              opts.ctx.w.config.series[opts.seriesIndex].data[
                opts.dataPointIndex
              ].description;
            // candlestick standard
            const open = opts.series[opts.seriesIndex][opts.dataPointIndex];
            const high = opts.series[opts.seriesIndex][opts.dataPointIndex + 1];
            const low = opts.series[opts.seriesIndex][opts.dataPointIndex + 2];
            const close =
              opts.series[opts.seriesIndex][opts.dataPointIndex + 3];
            // Extra tooltip data
            const call_ask1 = desc.date;
            let text = call_ask1 + "<br>";
            text += "Open : " + open + "<br>";
            text += "High : " + high + "<br>";
            text += "Low : " + low + "<br>";
            text += "Close : " + close + "<br>";
            text += "<br>";

            return text;
          },
          fillSeriesColor: false,
          theme: "dark",
          x: {
            show: true,
            format: "dd MMM yyyy",
          },
        },

        theme: {
          mode: "dark",
          palette: "palette10",
          monochrome: {
            enabled: false,
            color: "#255aee",

            shadeIntensity: 0.65,
          },
        },

        title: {
          text: this.props.ticker.companyName,
          align: "left",
        },

        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        xaxis: {
          type: "category",
          // tickPlacement: "on",
          labels: {
            formatter: function (val) {
              if (count % 15 === 0) {
                count++;
                return dayjs(val).format("MMM DD");
              }
              count++;
            },
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
        },
      },
    };
  }

  componentDidMount() {
    const fetchHistoricalData = async () => {
      const ticker = this.props.ticker.companyName;
      await fetch(
        "https://cors-anywhere.herokuapp.com/https://eodhistoricaldata.com/api/intraday/" +
          ticker +
          "?api_token=5f05dbbf1f59a5.46485507&interval=5m&fmt=json"
      )
        .then((response) => {
          console.log(response)
          return response.json();
        })
        .then((fecthedData) => {
          //  console.log(data[0].timestamp);
          //   let slicedData = fecthedData.slice(1658, 1716);
          console.log(fecthedData)
          let data = buildChartData(fecthedData);
          this.setState({
            series: [{ data }],
          });
          console.log(data)
        });
    };
    fetchHistoricalData();
  }
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="candlestick"
          height="750"
          width="100%"
        />
      </div>
    );
  }
}

const buildChartData = (Chartdata) => {
  let lastIndex = 0;
  const builtData = [];
  Chartdata.map((value, index) => {
    if (lastIndex + 12 === index) {
      let time = new Date(value.timestamp * 1000);
      let newDataPoint = {
        x: new Date(value.timestamp * 1000),
        y: [value.open, value.high, value.low, value.close],
        description: {
          date: dayjs(time).format("MMM DD HH:mm"),
        },
      };
      builtData.push(newDataPoint);
      lastIndex = index;
    }
  });
  return builtData;
};


// Restructuring Intra Day Data for D3.js chart.
const restructureIntraData = (Chartdata) => {
  let lastIndex = 0;
  const builtData = [];
  Chartdata.map((value, index) => {
    if (lastIndex + 12 === index) {
      let time = new Date(value.timestamp * 1000);
      let newDataPoint = {
        Date: new Date(value.timestamp * 1000),
        Open: value.open,
        Close: value.close,
        High: value.high,
        Low: value.low
      };
      builtData.push(newDataPoint);
      lastIndex = index;
    }
  });
  return builtData;
};





export default CandleStick;
