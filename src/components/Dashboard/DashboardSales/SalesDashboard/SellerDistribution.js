import React from 'react';
import { Card, Col, OverlayTrigger, Popover } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import "./Seller.css";
import Loading from "../../../Commons/Loading"
import { useHistory } from "react-router-dom";


export default function SellerDistribution(props) {
  let grapData = props.data.data || [];
  let scroll = props.scroll;

  const history = useHistory()

  const seriesVal = [];
  const categoriesVal = [];
  let barColor = [];
  let rdata = JSON.parse(localStorage.getItem("ROUTING_PERMISSIONS"))

  const callDistributionColor = (val) => {
    if (val?.split('-')[0] == 0) {
      barColor.push("#e62e2e")
    }
    else if (val?.split('-')[0] == 90.01) {
      barColor.push("#29cc39")
    }
    else {
      barColor.push("#ffc107")
    }
  }
  grapData && grapData.map((data) => {
    seriesVal.push(data.result);
    categoriesVal.push(data.xvalue);
    props.wgt_data.wgt_code === 'CALLER_DISTRIBUTION' && callDistributionColor(data.xvalue)
    props.wgt_data.wgt_code === 'CALL_DURATION_DISTRIBUTION' && barColor.push("#0077B6")
  })

  const sendTocalls = (data, index) => {
    let storedData = JSON.parse(localStorage.getItem("AGENT"))
    let key = props.wgt_data.wgt_code === 'CALL_DURATION_DISTRIBUTION' ? 'callDuration' : props.wgt_data.wgt_code === 'CALLER_DISTRIBUTION' ? 'callScore' : props.wgt_data.wgt_code === "COMPETITOR_TRACKER" ? 'competitorWords' : data[index]
    localStorage.setItem("AGENT", JSON.stringify(
      {
        "pageSelected": 1,
        "fromD": props.widgetData?.from == undefined ? props.defaultFilteredData?.from : props.widgetData?.from,
        "toD": props.widgetData?.to == undefined ? props.defaultFilteredData?.to : props.widgetData?.to,
        "selectedDate": props.widgetData?.selectedDate == undefined ? props.defaultFilteredData?.selectedDate : props.widgetData?.selectedDate,
        "selectedRange": storedData?.selectedRange,
        "selectedCoeRange": storedData?.selectedCoeRange,
        "selectedCOE":storedData?.selectedCOE,
        "coe":storedData?.coe
      }))
    history.push(rdata && rdata.Conversations && Array.isArray(rdata.Conversations) && rdata.Conversations.length > 1 ? `/voice?${key}=${data[index]}&fromD=${props.widgetData?.from == undefined ? props.defaultFilteredData?.from : props.widgetData?.from}&toD=${props.widgetData?.to == undefined ? props.defaultFilteredData?.to : props.widgetData?.to}` : `/sales_conversations?${key}=${data[index]}&fromD=${props.widgetData?.from == undefined ? props.defaultFilteredData?.from : props.widgetData?.from}&toD=${props.widgetData?.to == undefined ? props.defaultFilteredData?.to : props.widgetData?.to}`)
  }

  

  const series = [
    {
      name: props?.wgt_data?.wgt_name === "Call Duration Distribution" ? "No. of Calls" : "Word Occurrences",
      data: seriesVal ? seriesVal : '',
      color: 'rgb(0, 119, 182)'
    },
  ];
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      events: {
        //eslint-disable-next-line no-unused-vars
        dataPointSelection: (event, chartContext, config) => {
          sendTocalls(config.w.config.xaxis.categories, config.dataPointIndex)
        },
          click: function(event, chartContext, config) {

            // Get the clicked element from the event object
            const clickedElement = event.target;
            // Check if the clicked element is a <rect>
            if (clickedElement.tagName === 'rect') {
              // Get the parent element, assuming it's the SVG or a containing <g> element
              const parentElement = clickedElement.parentElement;

              if (parentElement) {
                // Find the next sibling <text> element
                let sibling = clickedElement.nextElementSibling;
                while (sibling) {
                  if (sibling.tagName === 'text' && sibling.hasAttribute('rel')) {
                    // Get the 'rel' attribute value
                    const relValue = sibling.getAttribute('rel');
                    sendTocalls(config?.config?.xaxis?.categories, relValue)
                    break;
                  }
                  sibling = sibling.nextElementSibling;
                }
              } 
            } 
          }
      },
    },
    colors: barColor,
    plotOptions: {
      bar: props?.wgt_data.wgt_name === "Competitor Tracker" ? {
        rowWidth: "15%",
        horizontal: true,
        opacity: '1',
      } : {
        columnWidth: "45px",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    xaxis: {
      categories:
        props.wgt_data.wgt_name == "Call Duration Distribution" ? categoriesVal :
          props.wgt_data.wgt_name == "Caller Distribution" ? categoriesVal :
            props.wgt_data.wgt_name == "Call Quality" ? categoriesVal :
              props.wgt_data.wgt_name == "Competitor Tracker" ? categoriesVal : "",
      // position:"bottom",
      title: props.wgt_data.wgt_name == "Competitor Tracker" && {
        text: "Word Occurrences",
        style: {
          fontSize: '10px',
          fontWeight: 700,
        }
      },
      labels: {
        formatter: function (value) {
          if(props.wgt_data.wgt_name == "Competitor Tracker"){
            return value.toFixed(1);
          }
          return value;
        },
        style: {
          colors: "#000000",
          fontSize: "12px",
        },
      },
      group: {
        style: {
          fontSize: '10px',
          fontWeight: 700,
          align: 'center',
          textAlign: "right"
        },
        groups: props.wgt_data.wgt_name != "Competitor Tracker" && [
          {
            title: props.wgt_data.wgt_name == "Caller Distribution" ? "Call Score(%)" :
              props.wgt_data.wgt_name == "Call Duration Distribution" ? "Call Duration(sec)" :
                "", cols: seriesVal ? seriesVal.length : ''
          }
        ],
      }
    },
   

    yaxis: {
      title: {
        text: props.wgt_data.wgt_name == "Caller Distribution" ? "No. of Calls" :
          props.wgt_data.wgt_name == "Call Duration Distribution" ? "No. of Calls" :
            props.wgt_data.wgt_name == "Call Quality" ? "Call Percentage(%)" : "",
        style: {
          color: "#666666",
          fontSize: "11px",
          textAlign: "right"
        }
      }
    },

    annotations: props.wgt_data.wgt_name !== "Competitor Tracker" ? {
      points: seriesVal.map((value, index) => {
        if (value !== 0) {
          return {
            x: categoriesVal[index],
            y: value,
            marker: {
              size: 0
            },
            label: {
              borderColor: 'none',
              offsetY: -7,
              style: {
                // color: '#fff',
                // background: 'rgba(0, 119, 182, 0.85)',
              },
              text: value,
              className: `apexcharts-annotation-label-${index}`,
            }
          };
        } else {
          return {
            marker:{
              size:0
            }};
        }
      })
    } : {},

  };

  const popoverr = () => (
    <Popover id="popover-trigger-click-root-close" title="right">
      <h3 className="popover-header" style={{ fontSize: "14px", textAlign: "center" }}>{props.wgt_data.wgt_des}</h3>
    </Popover>
  )

  return (
    <>
      <Col xs={props.width}>
        <Card className="radius-10 h93 w-100 call-duration-chart-box">
          <Card.Body>
            <div className="d-flex align-items-center">
              <h6 className="mb-0">{props.wgt_data.wgt_name}</h6>
              <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverr()} rootClose>
                <button className="mb-0" style={{ border: "none", backgroundColor: "white", marginTop: "1px" }}>
                  <i className="fadeIn animated bx bx-info-circle text-primary-blue"style={{ verticalAlign: 'middle', marginLeft: '6px',marginTop: '4px' , cursor: 'pointer'}}></i>
                </button>
              </OverlayTrigger>
            </div>
            <div style={{ width: '100%', height: "300px" }} >
              {!scroll  ? ((grapData || []).length > 0 ?
                <ReactApexChart
                  height='100%'
                  type={"bar"}
                  options={options}
                  series={series}
                /> : "") : <div className="loader-container dashboard-loder sellers-loader"><Loading /></div>}
            </div>
            {/* <div style={{ width: '100%', height: "300px" }} >
              {!scroll && (grapData || []).length > 0 ?
                <ReactApexChart
                  height='100%'
                  type={"bar"}
                  options={options}
                  series={series}
                /> : (grapData || []).length === 0 ? "" : <div className="loader-container dashboard-loder sellers-loader"><Loading /></div>}
            </div> */}
          </Card.Body>
        </Card>
      </Col>
      {/* {props.callBackScroll()} */}
    </>
  );
}
