import React, { useState, useEffect, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import { useHistory } from "react-router-dom";

function BarGraph(props) {
  const { widgetData, widgetName, comparedData, isCompare } = props;
  const history = useHistory();
  let rdata = JSON.parse(localStorage.getItem("ROUTING_PERMISSIONS"));
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  const sendTocalls = useCallback((data, index) => {
    let key = widgetName;
    history.push(rdata && rdata.Conversations && Array.isArray(rdata.Conversations) && rdata.Conversations.length > 1 ? `/voice?${key}&fromDate=${data[index]}&toDate=${data[index]}&redirected=true` : `/sales_conversations?${key}&fromDate=${data[index]}&toDate=${data[index]}&redirected=true`);
  }, [history, rdata, widgetName]);

  const convertDateFormat = (dateString) => {
    // Check if the string starts with a two-digit year or month
    if (/^\d{2}\/\d{2}\/\d{2}$/.test(dateString)) {
      const [part1, part2, part3] = dateString.split("/");
  
      if (parseInt(part1, 10) > 12) {
        // YY/MM/DD format
        return `${part3.padStart(2, "0")}/${part2.padStart(2, "0")}/${part1}`;
      } else {
        // MM/DD/YY format
        return `${part2.padStart(2, "0")}/${part1.padStart(2, "0")}/${part3}`;
      }
    }
  
    return dateString; 
  };

  useEffect(() => {
    if (widgetData?.length > 0 || comparedData?.length > 0) {
      const values = widgetData?.map(item => item.result) || [];
      const dates = widgetData?.map(item => convertDateFormat(item.dateString)) || [];

      const comparedValues = comparedData?.map(item => item.result) || [];
      const comparedDates = comparedData?.map(item => convertDateFormat(item.dateString)) || [];

      const type = widgetData?.[0]?.type || "";

      const series = [{
        name: widgetName,
        data: values,
        colors: '#0077B6'
      }];

      const seriesVal = [
        {
          name: widgetName,
          data: values,
        },
        {
          name: "Compared",
          data: comparedValues,
        }
      ];

      const options = {
        chart: {
          type: 'bar',
          toolbar: {
            show: false
          },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              sendTocalls(config.w.config.xaxis.categories, config.dataPointIndex);
            }
          }
        },
        stroke: {
          show: true,
          width: 5,
          colors: ['transparent']
        },
        plotOptions: {
          bar: {
            columnWidth: '40%',
            horizontal: false,
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: true
        },
        xaxis: {
          title: {
            text: "Dates",
            style: {
              color: "#666666",
              fontSize: "11px",
              textAlign: "right",
            }
          },
          type: 'day',
          categories: dates,
          labels: {
            rotate: -30,
            rotateAlways: true,
            formatter: (value) => value,
          },
        },
        yaxis: {
          title: {
            text: type !== '' ? `${widgetName}(${type})` : widgetName,
            style: {
              color: "#666666",
              fontSize: "11px",
              textAlign: "right"
            }
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          shared: false,
          intersect: true,
          x: {
            formatter: (val, { seriesIndex, dataPointIndex, w }) => {
              const { comparedDates } = w.config;
              if (seriesIndex === 0) {
                return dates[dataPointIndex] || 'N/A';
              } else {
                return comparedDates[dataPointIndex] || 'N/A';
              }
            },
          },
          y: {
            formatter: (val, { seriesIndex, dataPointIndex, w }) => {
              const { comparedValues } = w.config;
              if (seriesIndex === 0 ) {
                return `${values[dataPointIndex] !== undefined ? values[dataPointIndex] : 'N/A'}`;
              } else {
                return `${comparedValues[dataPointIndex] !== undefined ? comparedValues[dataPointIndex] : 'N/A'}`;
              }
            }
          }
        },
        grid: {
          padding: {
            bottom: 20
          }
        },
        comparedDates,
        comparedValues,
      };

      setChartOptions(options);
      setChartSeries(isCompare === true && comparedValues.length > 0 ? seriesVal : series);
    }
  }, [comparedData, isCompare, widgetData, widgetName]);

  return (
    <>
      <ReactApexChart id="chart mt-3" options={chartOptions} series={chartSeries} type="bar" height="350" />
    </>
  );
}

export default BarGraph;
