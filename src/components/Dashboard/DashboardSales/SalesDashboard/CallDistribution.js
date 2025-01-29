import { Button, colors } from "@mui/material";
import { Card, Tabs, Col, Tab } from "react-bootstrap";
import React,{ useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import dashboardService from "@services";

export default function CallDistribution(props) {
  
  const [key, setKey] = useState("Group");
  const [type, setType] = useState("bar");
  const [graphData, setGraphData] = useState([]);
  const localData = JSON.parse(localStorage.getItem("AGENT"))
  let momentData = JSON.parse(localStorage.getItem("MOMENT_ID"))

  let values = {
    "callType":props.name,
    "fromD": props.widgetData?.from==undefined?props.defaultFilteredData?.from:props.widgetData?.from,
    "toD": props.widgetData?.to==undefined?props.defaultFilteredData?.to:props.widgetData?.to,
    "coeExternalIds": props.widgetData?.externalIds?.length>0&&props.widgetData?.externalIds[0]==undefined?props.defaultFilteredData.externalIds:props.widgetData?.externalIds,
    "dashboardWidget": props.wgt_data.wgt_type,
    "dashboardWidgetScore": props.wgt_data.wgt_code,
    "momentBucketId":momentData
  }
  useEffect( () => { 
    async function fetchData() {
      try {
          const res = await dashboardService.getWidgetData(values)
          setGraphData(res.data.data.data);
      } catch (err) {
      }
    }
    if(props.widgetData!=undefined){
      fetchData();}
  }, [props.widgetData]);


  let valuesDef = {
    "callType":props.name,
    "fromD": props.defaultFilteredData.from,
    "toD": props.defaultFilteredData.to,
    "coeExternalIds": props.defaultFilteredData.externalIds,
    "dashboardWidget": props.wgt_data.wgt_type,
    "dashboardWidgetScore": props.wgt_data.wgt_code,
    "momentBucketId":momentData
  }
  useEffect( () => { 
    async function fetchData() {
      try {
          const res = await dashboardService.getWidgetData(valuesDef)
          setGraphData(res.data.data.data);
      } catch (err) {
      }
    }
    if(props.widgetData==undefined)
      fetchData();
  }, [localData?.fromD,localData?.toD]);


  const seriesVal = []
  const colors = []
  let barColor = ''
  graphData.map((data)=>{
    seriesVal.push(data.result)
    colors.push(data.colour)
    barColor = data.colour
    
    // if(data.colour!=null && data.colour==='green'){
    //   colorVal.push("#29cc39")
    // }
    // if(data.colour!=null && data.colour==='amber'){
    //   colorVal.push("#ffc107")
    // }
    // if(data.colour!=null && data.colour==='red'){
    //   colorVal.push("#e62e2e")  
    // }
  })

  const series = [
    {
      name: "",
      data: seriesVal?seriesVal:"",
    },
  ];
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      events: {
        click: function (chart, w, e) {
        },
      },
    },
    // colors: ["#29cc39", "#ffc107", "#e62e2e"],
    colors:barColor != null?["#29cc39", "#ffc107", "#e62e2e"] : ["#0077B6"],
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    yaxis:{
      title: {
        text: "No. of Calls",
        style:{
          color:"#666666",
          fontSize:"11px",
          textAlign:"right"
        }
      }
    },
    xaxis: {
      categories: graphData?["Good Call", "Average Call", "Poor Call"]:"",
      labels: {
        style: {
          colors: "#000000",
          fontSize: "12px",
        },
      },
      group:{
        style: {
          fontSize: '10px',
          fontWeight: 700,
          align: 'center',
          textAlign:"right"
        },
        groups:[
          {title:"Pitch Score(%)",cols:3}
        ]
      }
    },
  };

  return (
    <>
      <Col xs={props.width}>
        <Card className="radius-10 w-100 call-duration-chart-box">
          <Card.Body>
            <div className="pb-3 d-flex align-items-center">
              <h6 className="font-weight-bold">{props.wgt_data.wgt_name}</h6>
            </div>

            <div >
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-2 m-auto h_effect"
                >
                  <Tab eventKey="Group" title="Group">
                  <div style={{width: '100%', height: "235px" }}>
                    <ReactApexChart
                      height='100%' 
                      type={"bar"}
                      options={options}
                      series={series}
                    />
                  </div>
                  </Tab>
                  <Tab eventKey="Individual" title="Individual">
                  <div style={{width: '100%', height: "235px" }}>
                    <ReactApexChart
                      height='100%' 
                      type={"bar"}
                      options={options}
                      series={series}
                    />
                  </div>
                  </Tab>
                </Tabs>
              </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
