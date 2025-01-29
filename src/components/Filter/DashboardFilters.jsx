import { Form } from "react-bootstrap"
import React, { useState, useEffect } from "react"
import { USER_DETAIL } from "@constants"
import dashboardService from "@services";
import momentService from "@services";
import { usePreviousValue } from "../../hooks";
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import toaster from "../Toast/toaster";



export default function DashboardFilters(props) {
  let userRole = JSON.parse(localStorage.getItem(USER_DETAIL))?.userRole
  let moment_bucket_id = JSON.parse(localStorage.getItem("MOMENT_ID"))
  let localData = JSON.parse(localStorage.getItem("AGENT"))
  let dateFormat = JSON.parse(localStorage.getItem("TIME_FORMAT"))?.value
  const [opendp, setOpendp] = useState(false);
  const [opendp1, setOpendp1] = useState(false);
  const [dateList, setDateList] = useState("")
  const [coeList, setCoeList] = useState()
  const [momentBucketList, setMomentBucketList] = useState()
  const [callMoment, setCallMoment] = useState(false)
  const [momentBucket, setMomentBucket] = useState(localData && localData.momentBucketId ? localData.momentBucketId : moment_bucket_id)
  const [customeDate, setCustomeDate] = useState(localData && localData.selectedRange == 9 ? true : localData && localData.selectedRange == '' ? true : false)
  const [selectedCOE, setSelectedCOE] = useState(localData && localData.selectedCoeRange ? localData.selectedCoeRange.length == 1 ? localData.selectedCoeRange[0] : "Select All" : "")
  const [dateRange, setDateRange] = useState(localData && localData.selectedRange ? localData.selectedRange : localData && localData.selectedRange == '' ? 9 : 5)
  const [startDate, setStartDate] = useState(localData?.fromD ? new Date(`${localData.fromD.split("-")[1]}-${localData.fromD.split("-")[0]}-${localData.fromD.split("-")[2]}`) : new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [endDate, setEndDate] = useState(localData?.toD ? new Date(`${localData?.toD.split("-")[1]}-${localData?.toD.split("-")[0]}-${localData?.toD.split("-")[2]}`) : new Date())
  const [initialRender, setInitialRender] = useState(true);
  const [filteredData, setFilteredData] = useState([])

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
      let date = res ? res.data ? res.data.data.filter((e) => {
        return e.type == "CURRENT" || e.type == "GLOBAL"
      }) : '' : ''
      setDateList(date);
      setCallMoment(true)
    })
  }

  function getCoeList(val) {
    props.disableApply(true)
    dashboardService.getMomentCOEList(val).then(res => {
      props.disableApply(false)
      setCoeList(res ? res.data.data ? res.data.data : '' : '');
      let userCoe = res ? res.data.data ? res.data.data.map((item) => {
        return item.coeName
      }) : '' : ''
      let coeExternalId = res ? res.data.data ? res.data.data.map((item) => {
        return item.externalId
      }) : '' : ''
      let coeId = res ? res.data.data ? res.data.data.map(item => {
        return item.coeId
      }) : "" : ""
      setFilteredData(filteredData => ({ ...filteredData, selectedCOE: userCoe, externalId: coeExternalId, selectedCoeRange: coeId }))
    })
  }

  function getMomentBuckets() {
    momentService.getMomentBuckets(props?.name).then(res => {
      setMomentBucketList(res ? res : '');
      localStorage.setItem("MOMENT_BUCKETS", localStorage.getItem("MOMENT_BUCKETS") ? localStorage.getItem("MOMENT_BUCKETS") : res[0].momentBucketName)
      localStorage.setItem("MOMENT_ID", JSON.parse(localStorage.getItem("MOMENT_ID")) ? JSON.parse(localStorage.getItem("MOMENT_ID")) : res[0].momentBucketId)
      dashboardService.getMomentCOEList(momentBucket ? momentBucket : res[0].momentBucketId).then(res => {
        setCoeList(res ? res.data.data ? res.data.data : '' : '');
        localStorage.setItem("COE_DATA",JSON.stringify(res?.data?.data))
        let userCoe = res ? res.data.data ? res.data.data.map((item) => {
          return item.externalId
        }) : '' : ''
        let coeId = res ? res.data.data ? res.data.data.map((item) => {
          return item.coeId
        }) : '' : ''
        let coeName = res ? res.data.data ? res.data.data.map(item => {
          return item.coeName
        }) : "" : ""

        // setFilteredData(filteredData=>({...filteredData,externalId:userCoe}))
        let dateF = '';
        let dateT = '';

        let dates = localData?.selectedRange ? dateList.filter(function (el) {
          return el.id == localData?.selectedRange;
        }) : [dateList[4]];
        let dd = (dates[0].fromDate || '').split("-")[2]
        let mm = (dates[0].fromDate || '').split("-")[1]
        let yyyy = (dates[0].fromDate || '').split("-")[0]
        let dd_1 = (dates[0].toDate || '').split("-")[2]
        let mm_1 = (dates[0].toDate || '').split("-")[1]
        let yyyy_1 = (dates[0].toDate || '').split("-")[0]
        if (localData?.selectedRange) {
          dateF = `${dd < 10 && !dd.includes('0') ? '0' + dd : dd}-${mm < 10 && !mm.includes('0') ? '0' + mm : mm}-${yyyy}`
          dateT = `${dd_1 < 10 && !dd_1.includes('0') ? '0' + dd_1 : dd_1}-${mm_1 < 10 && !mm_1.includes('0') ? '0' + mm_1 : mm_1}-${yyyy_1}`
        } else {
          dateF = `${dd}-${mm}-${yyyy}`
          dateT = `${dd_1}-${mm_1}-${yyyy_1}`
        }

        if (dateList != '') {
          props.defaultDashboardData({
            fromDate: localData && localData.selectedRange == 9 && localData.fromD || dateT,
            toDate: localData && localData.selectedRange == 9 && localData.toD || dateF,
            externalId: localData && localData.coe ? localData.coe : userCoe,
            momentBucket: localData?.momentBucket ? localData?.momentBucket : localStorage.getItem("MOMENT_BUCKETS"),
            momentBucketId: localData && localData.momentBucketId ? localData?.momentBucketId : localStorage.getItem("MOMENT_ID"),
            selectedCOE: localData && localData.selectedCOE ? localData.selectedCOE : coeName,
            selectedCoeRange: localData && localData.selectedCoeRange ? localData.selectedCoeRange : coeId,
            selectedDate: localData && localData.selectedDate ? localData.selectedDate : dateList[4].name,
            selectedRange: localData && localData.selectedRange ? localData.selectedRange : 5,
          })
        }
      })
    })
  }

  function getUserCoeList() {
    dashboardService.getUserCOEList().then(res => {
      setCoeList(res ? res.data.data ? res.data.data : '' : '');
      let userCoe = res ? res.data.data ? res.data.data.map((item) => {
        return item.externalId
      }) : '' : ''
      let dd = dateList[4]?.fromDate.split("-")[2]
      let mm = dateList[4]?.fromDate.split("-")[1]
      let yyyy = dateList[4]?.fromDate.split("-")[0]
      let dateF = `${dd}-${mm}-${yyyy}`
      let dd_1 = dateList[4]?.toDate.split("-")[2]
      let mm_1 = dateList[4]?.toDate.split("-")[1]
      let yyyy_1 = dateList?.[4]?.toDate.split("-")[0]
      let dateT = `${dd_1}-${mm_1}-${yyyy_1}`
      let coeId = res ? res.data.data ? res.data.data.map((item) => {
        return item.coeId
      }) : '' : ''
      let coeName = res ? res.data.data ? res.data.data.map(item => {
        return item.coeName
      }) : "" : ""
      if (dateList != '') {
        props.defaultDashboardData({
          fromDate: localData && localData.fromD ? localData.fromD : dateT,
          toDate: localData && localData.toD ? localData.toD : dateF,
          externalId: localData && localData.coe ? localData.coe : userCoe,
          selectedCOE: localData && localData.selectedCOE ? localData.selectedCOE : coeName,
          selectedCoeRange: localData && localData.selectedCoeRange ? localData.selectedCoeRange : coeId,
          selectedDate: localData && localData.selectedDate ? localData.selectedDate : dateList[4].name,
          selectedRange: localData && localData.selectedRange ? localData.selectedRange : 5,
        })
      }
    })
  }

  useEffect(() => {
    if (initialRender) {
      getDateList();
      setInitialRender(false);
    }
  }, [props.reset])

  useEffect(() => {

    if (callMoment) {
      if (userRole == 'AGENT') {
        getUserCoeList()
      }
      if ((userRole == 'ADMIN' || userRole==='MANAGER'||userRole==='QUALITY_MANAGER'||userRole==='QUALITY_MANAGER_HEAD' || userRole=== 'QUALITY_ASSOCIATE' || userRole === 'QUALITY_TRAINER' || userRole==='SUPERVISOR' || userRole==='TEAM_LEAD') && !props.reset) {
        getMomentBuckets()
      }
    }
  }, [callMoment, dateList, props.reset])

  const prevValOfFilteredData = usePreviousValue(filteredData)

  useEffect(() => {
    if (prevValOfFilteredData != filteredData) {
      props.callBack(filteredData)
    }
  }, [filteredData])

  useEffect(() => {
    if (props.reset) {
      let momentBucketData = JSON.parse(localStorage.getItem("MOMENT_ID"))
      setSelectedCOE("Select All")
      setCustomeDate(false)
      setDateRange(5)
      setMomentBucket(momentBucketData)
      setFilteredData([])
      let firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      setStartDate(firstDay)
      setEndDate(new Date())
    }

    props.resetFormState()

  }, [props.reset])

  const handleMomentSelect = (e) => {
    setMomentBucket(e.target.value)
    getCoeList(e.target.value)
    let selectedBucket = momentBucketList.filter(item => {
      return item.momentBucketId == e.target.value
    })
    setFilteredData(filteredData => ({ ...filteredData, momentBucket: selectedBucket[0].momentBucketName, momentBucketId: e.target.value }))
  }


  const handleSelectCoe = (e) => {
    setSelectedCOE(e.target.value)
    let coes = e.target.value == 'Select All' ? coeList : coeList?.filter(function (el) {
      return el.coeId == e.target.value
    })
    setFilteredData({ ...filteredData, externalId: e.target.value == 'Select All' ? coes.map(item => { return item.externalId }) : coes[0].externalId, selectedCOE: e.target.value == 'Select All' ? coes.map(item => { return item.coeName }) : [coes[0].coeName], selectedCoeRange: e.target.value == 'Select All' ? coes.map(item => { return item.coeId }) : [e.target.value] })
  }

  const handleSelectDate = (e) => {
    setDateRange(e.target.value)
    if (e.target.value == 9) {
      setCustomeDate(true);

      let startDateObj = new Date(startDate); // Create a Date object from the startDate string
      let endDateObj = new Date(endDate); // Create a Date object from the endDate string

      let dd = String(startDateObj.getDate()).padStart(2, '0'); // Get the day for startDate
      let mm = String(startDateObj.getMonth() + 1).padStart(2, '0'); // Get the month for startDate (January is 0)
      let yyyy = startDateObj.getFullYear(); // Get the year for startDate

      let dd_1 = String(endDateObj.getDate()).padStart(2, '0'); // Get the day for endDate
      let mm_1 = String(endDateObj.getMonth() + 1).padStart(2, '0'); // Get the month for endDate (January is 0)
      let yyyy_1 = endDateObj.getFullYear(); // Get the year for endDate

      let dateF = `${dd < 10 && !dd.includes('0') ? '0' + dd : dd}-${mm < 10 && !mm.includes('0') ? '0' + mm : mm}-${yyyy}`
      let dateT = `${dd_1 < 10 && !dd_1.includes('0') ? '0' + dd_1 : dd_1}-${mm_1 < 10 && !mm_1.includes('0') ? '0' + mm_1 : mm_1}-${yyyy_1}`

      setFilteredData({ ...filteredData, fromDate: dateF, toDate: dateT, selectedDate: dateList[e.target.value - 1].name, selectedRange: e.target.value })
    }
    else {
      setCustomeDate(false);
      let dates = dateList.filter(function (el) {
        return el.id == e.target.value;
      })
      let dd = dates[0].fromDate.split("-")[2]
      let mm = dates[0].fromDate.split("-")[1]
      let yyyy = dates[0].fromDate.split("-")[0]

      let dd_1 = dates[0].toDate.split("-")[2]
      let mm_1 = dates[0].toDate.split("-")[1]
      let yyyy_1 = dates[0].toDate.split("-")[0]

      let dateF = `${dd < 10 && !dd.includes('0') ? '0' + dd : dd}-${mm < 10 && !mm.includes('0') ? '0' + mm : mm}-${yyyy}`
      let dateT = `${dd_1 < 10 && !dd_1.includes('0') ? '0' + dd_1 : dd_1}-${mm_1 < 10 && !mm_1.includes('0') ? '0' + mm_1 : mm_1}-${yyyy_1}`
      setFilteredData({ ...filteredData, fromDate: dateT, toDate: dateF, selectedDate: dateList[e.target.value - 1].name, selectedRange: e.target.value })
    }
  }

  const handleStartDate = (e) => {
    const currentDate = new Date();
    let selectedDate = new Date(e);

    // Check if the selected date is in the future
    if (selectedDate > currentDate) {
      selectedDate = currentDate;
      toaster.error("Please select valid date range.")
    }

    // Check if the selected start date is after the end date
    if (endDate && selectedDate > new Date(endDate)) {
      selectedDate = new Date(endDate);
      toaster.error("Please select valid date range.")
    }

    setStartDate(selectedDate);
    let date = `${((new Date(e)).getDate()) < 10 ? '0' + (new Date(e)).getDate() : (new Date(e)).getDate()}-${((new Date(e)).getMonth() + 1) < 10 ? '0' + ((new Date(e)).getMonth() + 1) : ((new Date(e)).getMonth() + 1)}-${(new Date(e)).getFullYear()}`;
    setFilteredData(filteredData => ({ ...filteredData, fromDate: date }))
  }

  const handleEndDate = (e) => {
    const currentDate = new Date();
    let selectedDate = new Date(e);

    // Check if the selected date is in the future
    if (selectedDate > currentDate) {
      selectedDate = currentDate;
      toaster.error("Please select valid date range.")
    }

    // Check if the selected end date is before the start date
    if (startDate && selectedDate < new Date(startDate)) {
      selectedDate = new Date(startDate);
      toaster.error("Please select valid date range.")
    }

    setEndDate(selectedDate);

    let date = `${((new Date(e)).getDate()) < 10 ? '0' + (new Date(e)).getDate() : (new Date(e)).getDate()}-${((new Date(e)).getMonth() + 1) < 10 ? '0' + ((new Date(e)).getMonth() + 1) : ((new Date(e)).getMonth() + 1)}-${(new Date(e)).getFullYear()}`;
    setFilteredData(filteredData => ({ ...filteredData, toDate: date }))
  }

  // let filterChange = JSON.parse(localStorage.getItem('USER_PERMISSIONS')).some(item => item.name === "Questions");

  return (<>
    <div className="dashboard-filter-group">
      {userRole != 'AGENT' && momentBucketList?.length > 1 ?<div className="lh-1 mb-3">
        <p className="mb-0 call-fillter-heading">Moment Bucket</p>
        {props.component != 'widgetModal' && <hr className="filter-Hr"></hr>}
        <Form.Select
          as="select"
          custom
          name="role"
          aria-label="Default select example"
          onChange={handleMomentSelect}
          value={momentBucket}
          className="form-control-sm py-1"
        >
          {momentBucketList ? momentBucketList.map((bucket) => {
            return <option value={bucket.momentBucketId} key={bucket.momentBucketId}>{bucket.momentBucketName}</option>;
          }) : ''}
        </Form.Select>
      </div> : ''}
      <div className="lh-1 mb-3">
        <p className="mb-0 call-fillter-heading">COE</p>
        {props.component != 'widgetModal' && <hr className="filter-Hr"></hr>}

        <Form.Select as="select" custom
          style={{ textTransform: "capitalize" }}
          name="role" aria-label="Default select example"
          //ref={coeRef}
          onChange={handleSelectCoe}
          className="form-control-sm py-1"
          placeholder="Select COE"
          value={selectedCOE}
        >
          <option value={'Select All'}>Select All</option>
          {coeList ? coeList.map((coe) => {
            return <option value={coe.coeId} key={coe.coeId}>{coe.coeName}</option>;
          }) : ''}
        </Form.Select>
      </div>
      <div className="lh-1 mb-3">
        <div className="filter-Date-div">
          <div className="filter-Date-selected">
            <p className="mb-0 call-fillter-heading">Select Date</p>
            {props.component != 'widgetModal' && <hr className="filter-Hr"></hr>}
            <Form.Select
              as="select"
              custom
              name="selectDate"
              aria-label="Default select example"
              className="form-control-sm py-1"
              // defaultValue={dateRange}
              value={dateRange}
              onChange={handleSelectDate}
            >
              {dateList ? dateList.map((d) => { return (<option value={d.id} key={d.id}> {d.name} </option>) }) : ''}
            </Form.Select>
          </div>
          {customeDate ? <div className="call-fillter-date dasbard-comp-setting mt-2 mx-1 align-items-center">
            <p className="mb-0 call-fillter-heading">From:</p>
            <hr className="filter-Hr"></hr>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div onMouseDown={(e) => e.stopPropagation()}>
              <DatePicker
                openTo="day"
                views={['year', 'month', 'day']}
                inputFormat={dateFormat}
                value={startDate}
                name="startDate"
                onChange={handleStartDate}
                disableOpenPicker
                open={opendp}
                onOpen={() => setOpendp(true)}
                onClose={() => setOpendp(false)}
                maxDate={endDate}
                renderInput={(params) => (
                  <TextField {...params} onClick={() => setOpendp(true)} />
                )}
              />
            </div>
            </LocalizationProvider>

            <p className="mb-0 call-fillter-heading">To:</p>
            <hr className="filter-Hr"></hr>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div onMouseDown={(e) => e.stopPropagation()}>
              <DatePicker
                openTo="day"
                views={['year', 'month', 'day']}
                inputFormat={dateFormat}
                value={endDate}
                name="endDate"
                onChange={handleEndDate}
                disableOpenPicker
                open={opendp1}
                onOpen={() => setOpendp1(true)}
                onClose={() => setOpendp1(false)}
                minDate={startDate}
                maxDate={new Date()}
                renderInput={(params) => (
                  <TextField {...params} onClick={() => setOpendp1(true)} />
                )}
              />
            </div>
            </LocalizationProvider>
          </div> : ''}
        </div>
      </div>
    </div>

  </>
  )
}