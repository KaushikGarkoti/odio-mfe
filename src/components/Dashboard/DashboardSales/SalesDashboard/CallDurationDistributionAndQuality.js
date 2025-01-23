import { Button } from "@mui/material";
import { Card, Col } from "react-bootstrap";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import * as React from 'react'

export default function CallDurationDistributionAndQuality(props) {
  const [type, setTpye] = useState("bar");
  const options = {
    series: [
      {
        name: "Data",
        data: [300, 500, 1000, 2000, 5000, 6000, 7000],
      },
    ],
    chart: {
      toolbar: {
        show: false,
      },
      events: {
        click: function (chart, w, e) {
        },
      },
    },
    colors: ["#0077B6"],
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
    xaxis: {
      categories: [
        "0 Sec",
        "90 Sec",
        "150 Sec",
        "300 Sec",
        "500 Sec",
        "1000 Sec",
        "2000 Sec",
      ],
      labels: {
        style: {
          colors: "#000000",
          fontSize: "12px",
        },
      },
    },
  };
  const dataOfGraph = {
    series: [
      {
        name: "Data",
        data: [50, 90, 40, 60, 70],
      },
    ],
    chart: {
      toolbar: {
        show: false,
      },
      events: {
        click: function (chart, w, e) {
        },
      },
    },
    colors: ["#0077B6"],
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
    xaxis: {
      categories: [
        "Avg. Call Score",
        "Avg. Pitch Score",
        "Conv. Probability",
        "Opportunity",
        "Urgency",
      ],
      labels: {
        style: {
          colors: "#000000",
          fontSize: "12px",
        },
      },
    },
  };

  return (
    <>
      <Col xs={props.width}>
        <Card className="radius-10 w-100 call-duration-chart-box">
          <Card.Body>
            <div>
              <h6 className="font-weight-bold">{props.title}</h6>
            </div>
            <div style={{width:"100%", height:"300px"}}>
                {props.title === "Call Duration Distribution" && (
                  <ReactApexChart
                    height='100%'
                    type={"bar"}
                    options={options}
                    series={options.series}
                  />
                )}
                {props.title === "Call Quality" && (
                  <ReactApexChart
                    height='100%'
                    type={"bar"}
                    options={dataOfGraph}
                    series={dataOfGraph.series}
                  />
                )}
              </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
