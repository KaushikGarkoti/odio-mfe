import { Card, Col, Popover, OverlayTrigger } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import Loading from "../../Loading"
import AnyChart from "anychart-react"
import { apiCall } from "@utils";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { USER_DETAIL } from "@constants";
import { useDataDispatch, useDataState } from "./WordCloudApiState";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function WordCloudd(props) {
  const chartRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false)
  const [pageNumber, setPage] = useState(1)
  const dispatch = useDataDispatch();
  const wordData = useDataState()
  const [words, setWords] = useState([]);

  let wordCloudData = props.data.data || [];
  let scroll = props.scroll;
  const history = useHistory()
  const localData = JSON.parse(localStorage.getItem("AGENT"))

  useEffect(() => {
    if (wordCloudData && wordCloudData.length > 0) {
    let newTotalCount = 0;
    const newWords = wordCloudData.map(m => {
        newTotalCount += m.result;
        return {
            Word: m.wordcloud,
            Frequency: m.result,
            'Percent of Total (%)': 0
        };
    });
    const firstValues = [];
    const secondValues = newWords.map(word => {
        firstValues.push({ x: word.Word, value: word.Frequency });
        return { ...word, 'Percent of Total (%)': ((word.Frequency / newTotalCount) * 100).toFixed(1) };
    });

    setWords({
        first: firstValues,
        second: secondValues
    });
  }
}, [wordCloudData]);


  useEffect(() => {
    if (chartRef.current && JSON.parse(localStorage.getItem(USER_DETAIL))?.clientConfig?.data?.conversationCallDetail?.wordCloud == 'true') {
      chartRef.current.addEventListener('click', handleChartClick);
    }

    return () => {
      if (chartRef.current && localStorage.getItem(USER_DETAIL)?.clientConfig?.data?.conversationCallDetail?.wordCloud == 'true') {
        chartRef.current.removeEventListener('click', handleChartClick);
      }
    };
  }, []);
  const popoverr = () => (
    <Popover id="popover-trigger-hover-focus" title="right">
      <h3 className="popover-header" style={{ fontSize: "14px", textAlign: "center" }}>{props.wgt_data.wgt_des}</h3>
    </Popover>  
  )

  const popover = () => (
    <Popover id="popover-trigger-hover-focus" title="right">
      <h3 className="popover-header" style={{ fontSize: "14px", textAlign: "center" }}> Export Excel</h3>
    </Popover>
  )

  useEffect(() => {
    if (wordData.groupIds.length <= 100 && wordData.groupIds.length !== 0) {
      history.push(`/sales_conversations`);
    }
  }, [wordData.groupIds.length]);

  const wordApi = async (e, pageNumber) => {
    return apiCall.post("/odio/api/wordCloud/search", {
      "fromD": JSON.parse(localStorage.getItem("AGENT"))?.fromD,
      "toD": JSON.parse(localStorage.getItem("AGENT"))?.toD,
      "coeExternalIds": localData?.coe,
      "input": e.target.textContent,
      "page": pageNumber,
      "size": 100
    });
  };

  const handleChartClick = async (e) => {
    setIsClicked(true);

    const callWordApi = async (pageNumber) => {
      let flag = localStorage.getItem("Recursive");
      if(flag === "true"){
      try {
        const response = await wordApi(e, pageNumber);

        if (response.status === 200) {
          const groupIds = response.data.data.trans.map(item => item.groupId);
          // setTransLength(response.data.data.trans.length);
          localStorage.getItem("Recursive") === "true" ? dispatch({ type: "ADD_GROUP_IDS", payload: groupIds }) : dispatch({ type: "ADD_GROUP_IDS", payload: [] })
          
          // setGroupIdList(prevGroupIds => [...prevGroupIds, ...groupIds]);
    
          if (response.data.data.trans.length === 100) {
            setPage(pageNumber + 100);
            // fetch flag from localstorage and check if true,then only run again            
              await callWordApi(pageNumber + 100);
           
          } else {
            setIsClicked(false);
          }
        }
      } catch (error) {
        console.error(error);
        setIsClicked(false);
      }
    }
    }
    localStorage.setItem("Recursive",true)
    await callWordApi(pageNumber);
  };

  const exportHandler = () => {
    const worksheet = XLSX.utils.json_to_sheet(words.second);

    // Customize worksheet properties (e.g., column widths)
    worksheet['!cols'] = [
        { wch: 20 }, // Width of the first column (characters)
        { wch: 10 }, // Width of the second column (characters)
        { wch: 15 }  // Width of the third column (characters)
    ];
    
    // Add header row with custom styles
    // XLSX.utils.sheet_add_aoa(worksheet, [["Word", "Frequency", "Percentage"]], { origin: -1 });
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
    // Convert workbook to Excel buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Convert Excel buffer to Blob
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
    // Save the Blob as an Excel file
    saveAs(blob, `WordCloudData (COE - ${localData.selectedCOE})(${localData.fromD} - ${localData.toD}).xlsx`);
}


  return (
    <>
      <Col xs={props ? props.width : '150px'}>
        <Card className="radius-10 w-100 call-duration-chart-box">
          <Card.Body><>
          <div className='d-flex align-items-center justify-content-between'>
            <div  className='d-flex align-items-center'>
              <h6 className="font-weight-bold mb-0">
                {props?.wgt_data ? props.wgt_data.wgt_name ? props.wgt_data.wgt_name : "_" : ''}
              </h6>
              <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverr()} rootClose>
                  <button className="mb-0" style={{ border: "none", backgroundColor: "white", padding: 0 }}>
                    <i className="fadeIn animated bx bx-info-circle text-primary-blue" style={{ verticalAlign: 'middle', marginLeft: '8px', cursor: 'pointer' }}></i>
                  </button>
                </OverlayTrigger>
            </div>
            {wordCloudData && wordCloudData.length > 0 ? <div className=" font-22 ms-auto">
                <p className="mb-0 ms-auto view-all-agents-btn">
                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover()} rootClose>
                <button onClick={exportHandler} target="_blank" className="exportExcel">
                <i className='bx bx-download'></i>
                </button>
                </OverlayTrigger></p>
              </div>: ""}
            </div>
            <div id={'wordcloud-' + props.wgt_data.wgt_name} ref={chartRef}>
              {
                !scroll ? (wordCloudData && wordCloudData.length > 0 ?
                  !isClicked ?
                    <AnyChart
                      height={300}
                      type="tagCloud"
                      data={words.first}
                      id={'wordcloud-' + props.wgt_data.wgt_name}
                    />
                    : <div className="loader-container dashboard-loder sellers-loader"><Loading /></div> : '') : <div className="loader-container dashboard-loder sellers-loader"><Loading /></div>
              }
            </div></>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
