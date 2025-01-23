
import React, { useRef } from "react";
import ReactECharts from 'echarts-for-react';
import { useHistory } from "react-router-dom";

function AggregatedGraph(props) {
  const history = useHistory()
  let rdata = JSON.parse(localStorage.getItem("ROUTING_PERMISSIONS"))
  const colorSet1 = ['#0A369D','#4472CA','#5E7CE2','#92B4F4','#CFDEE7','#A4BEF3','#F08700','#F49F0A','#EFCA08','#00A6A6','#BBDEF0']
  const colorSet2 = ['#BD2D87','#D664BE','#DF99F0','#B191FF','#77FF94','#A1E44D','#FFC15E','#FF9F1C']

  const formattedData = props?.widgetData && props?.widgetData.map(item => ({
      value: item.result,
      name: item.dateString,
      agentName: item.agentName
  }));

  const formattedComparedData = props?.comparedData && props?.comparedData.map(item => ({
    value: item.result,
    name: item.dateString,
    agentName: item.agentName
  }));

  const chartRef = useRef(null);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['60%', '80%'],
          color: colorSet1,
          labelLine: {
            length: 40
          },
          emphasis: {
            scale: true,
            scaleSize: 10,
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: formattedData
        },
        props?.isCompare && props?.comparedData && {
          name: '',
          type: 'pie',
          radius: ['25%', '40%'],
          color: colorSet2,
          labelLine: {
            length: -10
          },
          label:{
            fontSize: 10
          },
          emphasis: {
            scale: true,
            scaleSize: 10,
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: formattedComparedData
        }
      ]
    };
  
    const onChartClick = (params) => {
      let key = props.widgetName
      history.push(rdata && rdata.Conversations && Array.isArray(rdata.Conversations) && rdata.Conversations.length > 1 ? `/voice?${key}&fromDate=${params.data.name}&toDate=${params.data.name}&redirected=${true}` : `/sales_conversations?${key}&fromDate=${params.data.name}&toDate=${params.data.name}&redirected=${true}`)
    };
  
    const onEvents = {
      'click': onChartClick
    };
  
    return (
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: `${props?.isCompare && props?.comparedData ? '450px' : '350px'}`, width: '100%' }}
        onEvents={onEvents}
      />
    );
}


export default AggregatedGraph;