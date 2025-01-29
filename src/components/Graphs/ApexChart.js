import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useHistory } from "react-router-dom";
import { dateFormat, positionFormat } from "@utils";

const ApexChart = (props) => {
    const { carusalData, graphVal, graphKey } = props
    const resultArray = graphVal?.map(item => item.result) || [];
    const datesArray = graphVal?.map(item => item.dateString) || [];
    const history = useHistory();

    const sendToCalls = (index) => {
        const permission = JSON.parse(localStorage.getItem("USER_PERMISSIONS"))
        permission.some(item => item.api === '/voice_detail') ? history.push(`/voice?${graphKey}&fromDate=${positionFormat(dateFormat(datesArray[index]))}&toDate=${positionFormat(dateFormat(datesArray[index]))}&redirected=${true}`,) : history.push(`/sales_conversations?${graphKey}&fromDate=${positionFormat(dateFormat(datesArray[index]))}&toDate=${positionFormat(dateFormat(datesArray[index]))}&redirected=${true}`,)
    }

    const [series, setSeries] = useState([{
        name: 'series1',
        data: resultArray
    }]);

    const options = {
        chart: {
            type: 'area',
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            dropShadow: {
                enabled: false,
                top: 3,
                left: 14,
                blur: 4,
                opacity: 0.12,
                color: '#fff',
            },
            sparkline: {
                enabled: true
            },
            events: {
                click: function (event, chartContext, config) {
                    sendToCalls(config.dataPointIndex)
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%',
                endingShape: 'rounded'
            }
        },
        markers: {
            size: 0,
            colors: [carusalData === "Amber" ? "#FFBF00" : carusalData == null ? "#f2eeee" : carusalData],
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 7
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2.5,
            curve: 'smooth'
        },
        colors: [carusalData === "Amber" ? "#FFBF00" : carusalData == null ? "#f2eeee" : carusalData],
        fill: {
            type: 'solid',
            colors: series[0].data.map(() => carusalData === 'red' ? '#ff0000' : carusalData === 'green' ? '#007f00' : carusalData),
          },
        xaxis: {
            categories: datesArray
        },
        tooltip: {
            theme: 'dark',
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: function (seriesName, { dataPointIndex }) {
                        return `${datesArray[dataPointIndex]}: `
                    }
                }
            },
            marker: {
                show: false
            }
        }
    };

    useEffect(() => {
        setSeries([{
            name: 'series1',
            data: resultArray
        }]);
    }, [graphVal]);

    return (
        <div id="chart">
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={70}
                width={150}
            />
        </div>
    );
};

export default ApexChart;
