import { Card, Col } from "react-bootstrap";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import dashboardService from "../../../Services/dashboard.service"
import * as React from 'react'
import PerformanceModal from "./PerformanceModal";
import { Popover, OverlayTrigger } from "react-bootstrap";
import Loading from "../../../Commons/Loading";

export default function MomentAndSignalsPerformance(props) {
  const [show, setShow] = useState(false)
  const [moments, setMoments] = useState([])
  const [signals, setSignals] = useState([])
  let grapData = props.data.data || [];
  let scroll = props.scroll;
  const [loader, setLoader] = useState(false)
  let storedData = JSON.parse(localStorage.getItem("AGENT"))
  let momentData = JSON.parse(localStorage.getItem("MOMENT_ID"))

  let drillDown_values = {
    "fromD": props.widgetData?.from == undefined ? props.defaultFilteredData?.from : props.widgetData?.from,
    "toD": props.widgetData?.to == undefined ? props.defaultFilteredData?.to : props.widgetData?.to,
    "coeExternalIds": storedData ? storedData.coe : props.widgetData?.externalIds?.length > 0 && props.widgetData?.externalIds[0] == undefined ? props.defaultFilteredData.externalIds : props.widgetData?.externalIds,
    "dashboardWidget": props.wgt_data.wgt_type,
    "dashboardWidgetScore": [props?.wgt_data.wgt_name === 'Moments Performance' ? "MOMENTS_PERFORMANCE_DRILLDOWN" : props?.wgt_data?.wgt_name === 'Stats Performance' ? "STATS_PERFORMANCE_DRILLDOWN" : ""],
    "callType": props?.name,
    "momentBucketId": momentData
  }

  const series1 = []
  const categories1 = []
  const categories2 = []

  const seriesVal = [];
  const categoriesVal_moments = [];
  const categoriesVal_signals = []

  grapData && grapData.map((data) => {
    seriesVal.push(data.result);
    categoriesVal_moments.push(data.moment);
    categoriesVal_signals.push(data.signal)
  })

  for (let i = 0; i < 5; i++) {
    series1.push(seriesVal[i] ? seriesVal[i] : 0)
  }
  for (let i = 0; i < 5; i++) {
    categories1.push(categoriesVal_moments[i] ? categoriesVal_moments[i] : '')
    categories2.push(categoriesVal_signals[i] ? categoriesVal_signals[i] : '')
  }

  const series = [
    {
      name: "Performance",
      data: series1 ? series1 : [],
    },
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      type: 'bar',
    },
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return val + '%';
      },
      style: {
        colors: ['#000'],
        fontSize: '10px',
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        distributed: false,
        dataLabels: {
          position: 'center'
        }
      },
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true  // Show y-axis grid lines
        }
      }
    },
    xaxis: {
      categories: props?.wgt_data?.wgt_name === 'Moments Performance' ? categories1 : props?.wgt_data?.wgt_name === 'Stats Performance' ? categories2 : '',
      max: 100,
      title: {
        text: "Performance (%)",
        style: {
          color: "#000000",
          fontSize: "14px",
          fontWeight: 600
        }
      },
      labels: {
        show: true,
        style: {
          colors: "#000000",
          fontSize: "12px"
        },
        formatter: function (val) {
          return val + '%';
        }
      }
    },
    yaxis: {
      title: {
          // text: props?.wgt_data?.wgt_name || 'Performance',
        style: {
          color: "#000000",
          fontSize: "14px",
          fontWeight: 600
        }
      },
      labels: {
        show: true,
        style: {
          colors: "#000000",
          fontSize: "12px"
        }
      }
    },
    colors: ['#0077B6'],
    tooltip: {
      theme: 'light',
      y: {
        formatter: function (val) {
          return val + '%';
        }
      }
    }
  };    

  const clickHandler = () => {
    setShow(true)
    setLoader(true)
    dashboardService.getWidgetSignal(drillDown_values).then(res => {
      if (res && props?.wgt_data.wgt_name === 'Moments Performance') {
        let momData = res.data.data[0]["Moments Performance"]
        let result = momData.reduce((result, current) => {
          if (!result[current.momentGroup]) {
            result[current.momentGroup] = [current];
          } else
            result[current.momentGroup].push(current)

          return result;
        }, {})
        setLoader(false)
        setMoments(result)
      }
      if (res && props?.wgt_data.wgt_name === 'Stats Performance') {
        setSignals(res.data.data[0]["Stats Performance"])
        setLoader(false)
      }
    })
  }
  const closeButton = () => setShow(false)

  const popoverr = () => (
    <Popover id="popover-trigger-click-root-close" title="right" style={{ "marginLeft": "13px" }}>
      <h3 className="popover-header" >{props.wgt_data.wgt_des}</h3>
    </Popover>
  )

  return (
    <>
      <Col xs={props.width}>
        <Card className="radius-10 w-100 moment-chart-box">
          <Card.Body>
            <div className="d-flex align-items-center">
              <div>
                <h6 className="font-weight-bold">{props.wgt_data.wgt_name}</h6>
              </div>
              <div style={{ marginBottom: "5px", marginLeft: "6px" }}>
                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverr()} rootClose>
                  <i className="fadeIn animated bx bx-info-circle text-primary-blue"  style={{ verticalAlign: 'middle', marginLeft: '3px', cursor: 'pointer'}} ></i>
                </OverlayTrigger>
              </div>
              <div className=" font-22 ms-auto">
                <p className="mb-0 ms-auto view-all-agents-btn" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <i onClick={clickHandler} className="bx bx-link-external ms-1 me-0 my-0" title="View All" style={{cursor: 'pointer', color: '#0077b6', fontSize: '1rem'}}></i>
                </p>
              </div>
            </div>
            <div id="chart" style={{ width: '100%', height: '240px' }}>
              {!scroll ? (grapData && grapData.length >= 0 ?
                <ReactApexChart
                  height="240px"
                  type="bar"
                  options={options}
                  series={series}
                /> : '') : <div className="loader-container dashboard-loder sellers-loader"><Loading /></div>}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <PerformanceModal show={show} loader={loader} closeButton={closeButton} signals={signals} moments={moments} name={props?.wgt_data?.wgt_name} from={storedData && storedData.fromD ? storedData.from : props.defaultFilteredData?.from} to={storedData && storedData.toD ? storedData.toD : props.defaultFilteredData?.to} />
    </>
  );
}