import React from 'react';
import { Card, Col } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import { Popover, OverlayTrigger } from "react-bootstrap";
import Loading from "../../Loading";
import ComplianceView from "./ComplianceView";
import { useMemo, useState } from "react";

export default function AhtAndCompliance(props) {
  const [show, setShow] = useState()
  let grapData = props.data.data || [];
  let scroll = props.scroll;

  const dataArr = useMemo(() => {
    const allMonthNumbers = Array.from(new Set(grapData?.flatMap(item => item?.months?.map(month => month.monthNumber))));
    const sortedMonthNumbers = allMonthNumbers.sort((a, b) => a - b);

    // Find the index of the minimum month number
    const minMonthIndex = sortedMonthNumbers.indexOf(Math.min(...allMonthNumbers));

    // Create the new array
    const computedArray = grapData?.map(item => {
      const countsArray = Array.from({ length: sortedMonthNumbers.length }, (_, index) => {
        const circularIndex = (index + minMonthIndex) % sortedMonthNumbers.length;
        const monthNumber = sortedMonthNumbers[circularIndex];
        const monthData = item?.months?.find(month => month.monthNumber === monthNumber);
        return monthData ? monthData.count : 0;
      });
      return countsArray;
    });

    return computedArray;
    
  }, [grapData]);

  const transposedData = dataArr[0]?.map((_, i) => dataArr?.map(row => row[i]));

  const series1 = [];
  const categories1 = [];
  const categories2 = [];
  const countSeries = [];
  const monthNameSeries = [];

  const seriesVal = [];
  const categoriesVal_months = [];
  const categoriesVal_moments = [];
  const countVal = [];
  const monthData = [];

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  grapData &&
    grapData.forEach((data) => {
      seriesVal.push(data.result);
      categoriesVal_months.push(data.month);
      categoriesVal_moments.push(data.moment);
      countVal.push(data.count);
      monthData.push(data?.months);
    });

  for (let i = 0; i < 5; i++) {
    series1.push(seriesVal[i] ? seriesVal[i] : '');
    const monthIndex = categoriesVal_months[i];
    categories1.push(
      monthNames[monthIndex - 1] ? monthNames[monthIndex - 1] : ''
    );
    categories2.push(categoriesVal_moments[i] ? categoriesVal_moments[i] : '');
    countSeries.push(countVal[i] ? countVal[i] : '');
    monthNameSeries.push(monthData[i] ? monthData[i] : []);
  }

  const monthNameResults = monthNameSeries?.map((data) => {
    if (data?.length > 0) {
      return {
        mon1Name: data?.[0]?.monthNumber !== undefined ? monthNames[data[0]?.monthNumber - 1] : '',
        mon2Name: data?.[1]?.monthNumber !== undefined ? monthNames[data[1]?.monthNumber - 1] : '',
        mon3Name: data?.[2]?.monthNumber !== undefined ? monthNames[data[2]?.monthNumber - 1] : '',
        mon4Name: data?.[3]?.monthNumber !== undefined ? monthNames[data[3]?.monthNumber - 1] : ''
      };
    } else {
      return {};
    }
  });

  // Month-to-number mapping
  const monthOrder = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
  };

  // Flatten, filter, get unique months, and sort by their numeric value
  const uniqueSortedMonths = [...new Set(
    monthNameResults.flatMap(obj => Object.values(obj).filter(month => month))
  )].sort((a, b) => monthOrder[a] - monthOrder[b]);

  let series;
  let options;

  // Modify the series and options generation for AHT chart
  if (props.wgt_data.wgt_name === 'AHT') {
    series = [
      {
        name: 'Time',
        data: series1 && series1.length > 0 ? series1.map(val => val || 0) : [0],
      },
      {
        name: 'Count',
        data: countSeries && countSeries.length > 0 ? countSeries.map(val => val || 0) : [0],
      },
    ];
  
    options = {
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        color: '#0077B6',
        opacity: 1,
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
          horizontal: false,
          opacity: '1',
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      colors: ['#0077B6', '#ffc107'], // Blue for first series, Yellow for second series
      xaxis: {
        categories: categories1 && categories1.length > 0 ? categories1 : [''],
        labels: {
          show: true,
        },
        group: {
          style: {
            fontSize: '11px',
            fontWeight: 800,
            align: 'center',
            textAlign: 'right',
          },
          groups: [
            {
              title: 'Months',
              cols: series1 ? series1.length : '',
            },
          ],
        },
      },
      yaxis: [
        {
          title: {
            text: 'Time (Sec)',
          },
          labels: {
            formatter: (value) => {
              return value ? value.toFixed(0) : '0';
            },
            show: true,
          },
        },
        {
          opposite: true,
          title: {
            text: 'Count',
          },
          labels: {
            formatter: (value) => {
              return value ? value.toFixed(0) : '0';
            },
            show: true,
          },
        },
      ],
    };
  } else if (props.wgt_data.wgt_name === 'Compliance') {
    // Dynamically create the series based on the number of months
    series = uniqueSortedMonths && uniqueSortedMonths?.map((monthName, index) => ({
      name: monthName,
      data: transposedData[index] ? transposedData[index].concat(Array(Math.max(0, 5 - transposedData[index].length)).fill(0)) : []
    }));

    // Ensure each data series has a length of 5
    series?.forEach((s) => {
      s.data.length = 5;
    });

    options = {
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      annotations: {
        yaxis: [
          {
            x: 500,
            borderColor: '#0077B6 ',
            label: {
              borderColor: '#0077B6',
              style: {
                color: '#0077B6',
                backgroundColor: '#0077B6',
              },
            },
          },
        ],
      },
      fill: {
        color: '#0077B6',
        opacity: 1,
      },
      plotOptions: {
        bar: {
          rowWidth: '15%',
          horizontal: true,
          opacity: '1',
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          // reversed: true,
          lines: {
            show: true,
          },
        },
      },
      colors: ['#0077B6', '#ffc107', '#29cc39', '#5ED1D0'],
      xaxis: {
        categories: categories2,
        title: {
          text: 'Count',
          style: {
            color: '#666666',
            fontSize: '11px',
            textAlign: 'right',
          },
        },
      },
    };
  }

  const clickHandler = () => setShow(true)

  const closeButton = () => setShow(false)
  
  const popoverr = () => (
    <Popover
      id='popover-trigger-click-root-close'
      title='right'
      style={{ marginLeft: '13px' }}
    >
      <h3 className='popover-header'>{props.wgt_data.wgt_des}</h3>
    </Popover>
  );

  return (
    <>
      <Col xs={props.width}>
        <Card className='radius-10 w-100 aht-chart-box'>
          <Card.Body>
            <div className='d-flex align-items-center'>
              <div>
                <h6 className='font-weight-bold'>{props.wgt_data.wgt_name}</h6>
              </div>
              <div style={{ marginBottom: '5px', marginLeft: '6px' }}>
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement='bottom'
                  overlay={popoverr()}
                  rootClose
                >
                  <i className='fadeIn animated bx bx-info-circle text-primary-blue'  style={{ verticalAlign: 'middle', textWrap:'wrap',display:'flex', marginLeft: '3px' ,cursor: 'pointer'}}></i>
                </OverlayTrigger>
              </div>
              {props.wgt_data.wgt_name === "Compliance" ? <div className=" font-22 ms-auto">
                <p className="mb-0 ms-auto view-all-agents-btn" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <i
                    onClick={clickHandler}
                    className="bx bx-link-external ms-1 me-0 my-0"
                    title="View All"
                    style={{cursor: 'pointer', color: '#0077b6', fontSize: '1rem'}}
                  ></i>
                </p>
              </div> : ''}
            </div>
            <div id='chart' style={{ width: '100%', height: '260px' }}>
            {!scroll ? (
  grapData && grapData.length > 0 && series && series.length > 0 ? (
    <ReactApexChart
      height='290px'
      type='bar' // Specify type explicitly
      options={options}
      series={series}
    />
  ) : (
    <div>No data available</div> // Provide a fallback
  )
) : (
  <div className='loader-container dashboard-loder sellers-loader'>
    <Loading />
  </div>
)}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <ComplianceView show={show} closeButton={closeButton} name={props?.wgt_data?.wgt_name} data={props?.data?.data} values={dataArr} mon1={uniqueSortedMonths?.[0]} mon2={uniqueSortedMonths?.[1]} mon3={uniqueSortedMonths?.[2]} mon4={uniqueSortedMonths?.[3]}/>
    </>
  );
}
