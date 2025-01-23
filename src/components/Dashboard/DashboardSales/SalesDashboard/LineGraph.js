
import React from "react";
import ReactApexChart from "react-apexcharts";
import { useHistory } from "react-router-dom";

function LineGraph(props) {
  const history = useHistory()
  let rdata = JSON.parse(localStorage.getItem("ROUTING_PERMISSIONS"))
  const values = props?.widgetData?.map(item=>{
    return item.result
  })
  const dates = props?.widgetData?.map(item=>{
    return item.dateString
  })
  const value = props.comparedData!=''?props?.comparedData?.map(item=>{
    return item.result
  }):""

  const comparedDates = props?.comparedData !=''?props?.comparedData?.map(item => {
    return item.dateString;
  }):''

  const type = props?.widgetData?props?.widgetData[0]?.type?props?.widgetData[0]?.type:"":""

  const sendTocalls = (data, index) => {
    let key = props.widgetName
    history.push(rdata && rdata.Conversations && Array.isArray(rdata.Conversations) && rdata.Conversations.length > 1 ? `/voice?${key}&fromDate=${data[index]}&toDate=${data[index]}&redirected=${true}` : `/sales_conversations?${key}&fromDate=${data[index]}&toDate=${data[index]}&redirected=${true}`)
  }

    const series =  [{
        name: props.widgetName,
        data: values}
    ]
    const seriesVal = [{
      name: props.widgetName,
      data: values
      },
      {
      name:"Compared",
      data:value
    }]
   
    const options = {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        },
        events:{
          //eslint-disable-next-line no-unused-vars
          dataPointSelection: (event, chartContext, config) => {
            sendTocalls(config.w.globals.categoryLabels, config.dataPointIndex)
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 5,
        curve: 'smooth',
        show:true

      },
      grid: {
        row: {
          colors: [ 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
        padding: {
          bottom: 20 // Increase this value if labels are still cut off
      }
      },
      markers: {
        size: 4,
        colors: ["#0077B6"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
      colors: ["#0077B6","#77B6EA"],
      xaxis: {
        title: {
          text: "Dates",
          style:{
            color:"#666666",
            fontSize:"11px",
            textAlign:"right",
          }
        },
        type: 'day',
        categories: dates,
        labels: {
          rotate:-30,
          rotateAlways:true,
          formatter: (value ) => {
            return value;
          },
        },
      },
      yaxis:{
        title: {
          text: type!=''?`${props.widgetName}(${type})`:props.widgetName, 
          style:{
            color:"#666666",
            fontSize:"11px",
            textAlign:"right"
          }
        }
      },
      tooltip: {
        shared: false,
        intersect: true,
        x: {
          formatter: (val, {  seriesIndex, dataPointIndex, w }) => {
            return w.globals.seriesNames[seriesIndex] == props.widgetName ? dates[dataPointIndex] : comparedDates[dataPointIndex]
          },
        },
      },
    }

    return (
      <div id="chart">
        <ReactApexChart options={options} series={props.isCompare == true && value !=''?seriesVal:props.isCompare == false || value ==''?series:series} type="line" height={350} />
      </div>
    );
}
export default LineGraph;


