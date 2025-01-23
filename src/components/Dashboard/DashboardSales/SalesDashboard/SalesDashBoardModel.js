import {
  Modal,
  Form,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import AggregatedGraph from "./AggregatedGraph";
import LineGraph from "./LineGraph";
import BarGraph from "./BarGraph";
import dashboardService from "../../../Services/dashboard.service";
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Loading from "../../../Commons/Loading";
import toaster from "../../../Toast/toaster";

export default function SalesDashBoardModel(props) {
  let selectedDate = JSON.parse(localStorage?.getItem("AGENT"))?.selectedRange
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateList, setDateList] = useState();
  const [graphList, setGraphList] = useState();
  const [isCompare, setIsCompare] = useState(false);
  const [customeDate, setCustomeDate] = useState(false);
  const [customeDateGraph, setCustomeDateGraph] = useState(false);
  const crrDate = new Date()
  const [startDate, setStartDate] = useState(crrDate)
  const [endDate, setEndDate] = useState(crrDate)
  const [startDateGraph, setStartDateGraph] = useState(crrDate)
  const [endDateGraph, setEndDateGraph] = useState(crrDate)
  const [graphView, setGraphView] = useState()
  const [graphType, setGraphType] = useState('PIE_GRAPH')
  const [graphTypeset, setGraphTypeSet] = useState('PIE_GRAPH')
  const [widgetData, setWidgetData] = useState()
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState(JSON.parse(localStorage.getItem("AGENT"))?.toD ? JSON.parse(localStorage.getItem("AGENT"))?.toD : `${crrDate.getDate()}-${crrDate.getMonth() + 1}-${crrDate.getFullYear()}`)
  const [comparedData, setComparedData] = useState([])
  const [selectedValue, setSelectedValue] = useState(null);


  const storedData = JSON.parse(localStorage.getItem("AGENT"))
  let dateFormat = JSON.parse(localStorage.getItem("TIME_FORMAT")).value

  Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('-');
  };

  function getDateList() {
    dashboardService.getDateAcronym().then(res => {
      let dateList = res ? res.data ? res.data.data.filter((e) => {
        return e.type == "RELATIVE" || e.type == "GLOBAL"
      }) : '' : ''
      setDateList(dateList);
      let dateGraph = res ? res.data ? res.data.data.filter((e) => {
        return e.type == "CURRENT" || e.type == "GLOBAL"
      }) : '' : ''
      setGraphList(dateGraph);
      setLoading(false)
    })
  }

  function getData() {
    let val = {
      "fromD": fromDate == '' ? JSON.parse(localStorage.getItem("AGENT"))?.fromD : fromDate,
      "toD": toDate,
      "coeExternalIds": storedData?.coe,
      "dashboardWidget": props.widgetName.wgt_type,
      "dashboardWidgetScore": [`${props.widgetName.wgt_code}_DRILLDOWN`],
      "callType": props?.name
    }
    dashboardService.getWidgetData(val).then(res => {
      setWidgetData(res.data ? res?.data.data[0]?.widgetsDataResponses : '');
    })
  }

  function getDatePriorDays(dateStr, daysPrior) {
    const [day, month, year] = dateStr.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    date.setDate(date.getDate() - daysPrior);

    const newDay = String(date.getDate()).padStart(2, '0');
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newYear = date.getFullYear();

    return `${newDay}-${newMonth}-${newYear}`;
  }

  function getDatePriorMonth(dateStr) {
    const [day, month, year] = dateStr.split('-');
    const date = new Date(`${year}-${month}-${day}`);

    date.setMonth(date.getMonth() - 1);

    if (day > 28 && date.getMonth() !== parseInt(month) - 1) {
      date.setDate(0);
    }

    const newDay = String(date.getDate()).padStart(2, '0');
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newYear = date.getFullYear();

    return `${newDay}-${newMonth}-${newYear}`;
  }

  function getDatePriorYear(dateStr) {
    const [day, month, year] = dateStr.split('-');
    const date = new Date(`${year}-${month}-${day}`);

    date.setFullYear(date.getFullYear() - 1);

    const newDay = String(date.getDate()).padStart(2, '0');
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newYear = date.getFullYear();

    return `${newDay}-${newMonth}-${newYear}`;
  }

  function getCompareData() {
    const reAssignedStartDate = fromDate == '' ? JSON.parse(localStorage.getItem("AGENT"))?.fromD : fromDate
    const startDate = selectedValue === '10' ? getDatePriorDays(reAssignedStartDate, 1) :
      selectedValue === '11' ? getDatePriorDays(reAssignedStartDate, 7) :
        selectedValue === '12' ? getDatePriorDays(reAssignedStartDate, 30) :
          selectedValue === '13' ? getDatePriorMonth(reAssignedStartDate) :
            selectedValue === '14' ? getDatePriorYear(reAssignedStartDate) :
              getDatePriorDays(reAssignedStartDate, 1);

    const endDate = selectedValue === '10' ? getDatePriorDays(toDate, 1) :
      selectedValue === '11' ? getDatePriorDays(toDate, 7) :
        selectedValue === '12' ? getDatePriorDays(toDate, 30) :
          selectedValue === '13' ? getDatePriorMonth(toDate) :
            selectedValue === '14' ? getDatePriorYear(toDate) :
              getDatePriorDays(toDate, 1);
    let val1 = {
      "fromD": startDate,
      "toD": endDate,
      "coeExternalIds": storedData?.coe,
      "dashboardWidget": props.widgetName.wgt_type,
      "dashboardWidgetScore": [`${props.widgetName.wgt_code}_DRILLDOWN`],
      "callType": props?.name
    }
    dashboardService.getWidgetData(val1).then(res => {
      setComparedData(res?.data ? res?.data?.data[0]?.widgetsDataResponses : []);
    })
  }

  useEffect(() => {
    getDateList()
    if (graphView == '9') {
      setCustomeDateGraph(true)
    }
  }, [])

  const filterGraphList = (val) => {
    var arr = graphList.filter((e) => {
      return e.id == val;
    })
    return arr
  }


  function switchChange() {
    setCustomeDate(false);
    setIsCompare(!isCompare)
    if (isCompare === false) {
      setComparedData([])
    }

  }


  const handleSelectDate = (e) => {
    setSelectedValue(e.target.value);

    if (e.target.value == 9) {
      setCustomeDate(true);
    }
    else {
      setCustomeDate(false);
    }
  }

  const handleStartDateGraph = (e) => {
    let currentDate = new Date();
    let selectedDate = new Date(e);

    if (selectedDate > currentDate) {
      selectedDate = currentDate;
      toaster.error("Please select valid date range.")
    }

    if (endDateGraph && selectedDate > new Date(endDateGraph)) {
      selectedDate = new Date(endDateGraph);
      toaster.error("Please select valid date range.")
    }

    setStartDateGraph(selectedDate)
    let date = `${(new Date(selectedDate)).getDate()}-${(new Date(selectedDate)).getMonth() + 1}-${(new Date(selectedDate)).getFullYear()}`;
    setFromDate(date)
  }
  const handleStartDate = (e) => {
    let currentDate = new Date();
    let selectedDate = new Date(e);
    const daysDifference = Math.ceil((endDateGraph - startDateGraph) / (1000 * 60 * 60 * 24));

    if (selectedDate > currentDate) {
      selectedDate = currentDate;
      toaster.error("Please select valid date range.")
    }

    if (endDate && selectedDate > new Date(endDate)) {
      selectedDate = new Date(endDate);
      toaster.error("Please select valid date range.")
    }

    setStartDate(selectedDate)
    let newEndDate = new Date(selectedDate);
    newEndDate.setDate(newEndDate.getDate() + daysDifference);
    setEndDate(newEndDate);
  }
  const handleEndDateGraph = (e) => {
    let currentDate = new Date();
    let selectedDate = new Date(e);

    if (selectedDate > currentDate) {
      selectedDate = currentDate;
      toaster.error("Please select valid date range.")
    }

    if (startDateGraph && selectedDate < new Date(startDateGraph)) {
      selectedDate = new Date(startDateGraph);
      toaster.error("Please select valid date range.")
    }

    setEndDateGraph(selectedDate)
    let date = `${(new Date(selectedDate)).getDate()}-${(new Date(selectedDate)).getMonth() + 1}-${(new Date(selectedDate)).getFullYear()}`;
    setToDate(date)
  }
  const handleGraphView = (e) => {
    setGraphType(e.target.value)
  }

  const handleGraphDate = (e) => {
    if (e.target.value == 9) {
      setCustomeDateGraph(true);
    } else {
      setCustomeDateGraph(false);
    }
    setGraphView(e.target.value)
    let graph = filterGraphList(e.target.value)
    if (graph[0].fromDate == null && graph[0].toDate == null) {
      setFromDate(`${crrDate.getDate()}-${crrDate.getMonth() + 1}-${crrDate.getFullYear()}`)
      setToDate(`${crrDate.getDate()}-${crrDate.getMonth() + 1}-${crrDate.getFullYear()}`)
    }
    else {
      let dd = graph[0].fromDate.split("-")[2]
      let mm = graph[0].fromDate.split("-")[1]
      let yyyy = graph[0].fromDate.split("-")[0]

      let dd_1 = graph[0].toDate.split("-")[2]
      let mm_1 = graph[0].toDate.split("-")[1]
      let yyyy_1 = graph[0].toDate.split("-")[0]

      let dateF = `${dd}-${mm}-${yyyy}`
      let dateT = `${dd_1}-${mm_1}-${yyyy_1}`
      setFromDate(dateT)
      setToDate(dateF)
    }
  }

  const setCompareFalse = () => {
    setIsCompare(false)
  }

  const handleSubmit = () => {
    setLoader(true)
    setGraphTypeSet(graphType)
    setTimeout(() => {
      setLoader(false)
    }, 2000)

    if (isCompare) {
      getCompareData()
    }
    else {
      getData()
    }
  }

  return (
    <>
      <Modal show={props.show} fullscreen={true} onHide={() => { props.closeButton(); setGraphView(); setCompareFalse(); setComparedData([]); setGraphType("PIE_GRAPH"); setGraphTypeSet("PIE_GRAPH"); setCustomeDate(false); setStartDate(crrDate); setEndDate(crrDate) }}>
        <Modal.Header closeButton>
          <div className="d-flex justify-content-between w-100">
            <h5>{props.widgetName?.wgt_name}</h5>
            <div className="filter modal-header-filter">
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="dashboard-modal">
          {!loading && (<><div className="d-flex">
            <div className="mx-2">
              <label style={{ marginRight: "5px" }}>Graph View</label>
              <select
                className="form-select form-select-sm d-inline-block w-auto"
                aria-label="form-select-sm example"
                value={graphType}
                onChange={handleGraphView}
                disabled={isCompare ? "disabled" : ''}
              >
                <option value="PIE_GRAPH">PIE GRAPH</option>
                <option value="BAR_GRAPH">BAR GRAPH</option>
                <option value="LINE_GRAPH">LINE GRAPH</option>
              </select>
            </div>
            <div className="mx-2">
              <select
                className="form-select form-select-sm d-inline-block w-auto"
                aria-label="form-select-sm example"
                value={graphView ? graphView : selectedDate}
                onChange={handleGraphDate}
                disabled={isCompare ? "disabled" : ''}
              >

                {graphList ? graphList.map((d) => { return (<option value={d.id} key={d.id}> {d.name} </option>) }) : ''}
              </select>
            </div>
            {customeDateGraph ? <div className="call-fillter-date dasbard-comp-setting-modal d-flex align-items-center">
              <div className="input-box form-group align-items-center">
                <label className="col-form-label mx-1">From</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    openTo="day"
                    views={['year', 'month', 'day']}
                    inputFormat={dateFormat}
                    value={startDateGraph}
                    name="startDateGraph"
                    onChange={handleStartDateGraph}
                    disableOpenPicker
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    disabled={isCompare ? "disabled" : ''}
                    renderInput={(params) => (
                      <TextField {...params} onClick={() => isCompare ? '' : setOpen(true)} />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <div className="input-box form-group align-items-center">
                <label className="col-form-label mx-1">To</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    openTo="day"
                    views={['year', 'month', 'day']}
                    inputFormat={dateFormat}
                    value={endDateGraph}
                    name="endDateGraph"
                    disableOpenPicker
                    onChange={handleEndDateGraph}
                    open={open1}
                    onOpen={() => setOpen1(true)}
                    onClose={() => setOpen1(false)}
                    disabled={isCompare ? "disabled" : ''}
                    renderInput={(params) => (
                      <TextField {...params} onClick={() => isCompare ? '' : setOpen1(true)} />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div> : ''}
            <div className="mx-2 d-flex align-items-center">
              <label className="col-form-label">Compare</label>
              <div className="form-check form-switch font-18 ms-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  onChange={switchChange}
                />
              </div>
              {isCompare ? <Form.Select
                className="form-select form-select-sm w-auto"
                aria-label="form-select-sm example"
                defaultValue={10}
                onChange={handleSelectDate}
              >
                {dateList ? dateList.map((d) => { return (<option value={d.id} key={d.id}> {d.name} </option>) }) : ''}

              </Form.Select> : ''}
            </div>
            {customeDate ? <div className="call-fillter-date dasbard-comp-setting-modal d-flex align-items-center">
              <div className="input-box form-group align-items-center">
                <label className="col-form-label mx-1">From</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    openTo="day"
                    views={['year', 'month', 'day']}
                    inputFormat={dateFormat}
                    value={startDate}
                    name="startDate"
                    onChange={handleStartDate}
                    disableOpenPicker
                    open={open2}
                    onOpen={() => setOpen2(true)}
                    onClose={() => setOpen2(false)}
                    renderInput={(params) => (
                      <TextField {...params} onClick={() => setOpen2(true)} />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <div className="input-box form-group align-items-center">
                <label className="col-form-label mx-1">To</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    openTo="day"
                    views={['year', 'month', 'day']}
                    inputFormat={dateFormat}
                    value={endDate}
                    name="endDate"
                    disableOpenPicker
                    onChange={() => {}}
                    open={false}
                    disabled
                    renderInput={(params) => (
                        <TextField {...params} disabled />
                    )}
                  />
                </LocalizationProvider>

              </div>
            </div> : ''}
            <div className="mx-2">
              <button
                type="submit"
                className="btn px-4 lh-base update-btn"
                onClick={handleSubmit}
              >
                {" "}
                {loader ? (
                  <Loading variant="light" />
                ) : (
                  <>Apply</>
                )}
              </button>
            </div>
          </div>
            <div className="row mt-5">
              <div className="col-12 avg-call-score-Modalmain-graph">
                {graphTypeset == 'PIE_GRAPH' ? <AggregatedGraph height={580} widgetData={widgetData} widgetName={props.widgetName?.wgt_name} comparedData={comparedData != '' ? comparedData : undefined} isCompare={isCompare} /> :
                  graphTypeset == 'BAR_GRAPH' ? <BarGraph widgetData={widgetData} widgetName={props.widgetName?.wgt_name} comparedData={comparedData} isCompare={isCompare} />
                    : <LineGraph widgetData={widgetData} selectedValue={selectedValue} dateList={dateList} comparedData={comparedData} widgetName={props.widgetName?.wgt_name} isCompare={isCompare} />}
              </div>
            </div>
          </>)}
          {loading && (<div className="loader-container"><Loading variant="dark" /></div>)}
        </Modal.Body>
      </Modal>
    </>
  );
}
