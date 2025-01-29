import React, { Component } from "react";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { Form } from "react-bootstrap";
import "./filter.css";
import { connect } from "react-redux";
import Loading from "../Dashboard/Loading";
import {
  resetFilter,
} from "../../redux-container/accounts/action";
import toaster from "../Toast/toaster";
import DashboardFilters from "./DashboardFilters";
import dashboardService from "@services";
import { setCOE } from "../../redux-container/commons/action";

class Filter extends Component {
  constructor(props) {
    super(props);
    this.clintType = "BOTH";
    this.type = "Push";
    this.setOpen = false;
    this.Lists = {
      Roles: ["Software Engineer", "Developer", "Manager"],
      COE: ["Ceo1", "Ceo2", "Ceo3"],
      Bucket: ["Bucket1", "Bucket2", "Bucket3"],
      Datelist: [
        "Yesterday",
        "Last 7 Days",
        "Last 15 Days",
        "Last 30 Days",
        "This Month",
        "Last Month",
        "Custom Date",
      ],
    };
    this.firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.queryString = window.location.search;
    this.urlParams = new URLSearchParams(this.queryString);

    this.localFrom = JSON.parse(localStorage.getItem("AGENT"))?.fromD
    this.localTo = JSON.parse(localStorage.getItem("AGENT"))?.toD


    this.storedData = JSON.parse(localStorage.getItem("AGENT"))
    this.dateFormat = JSON.parse(localStorage.getItem("TIME_FORMAT"))?.value
    this.fromDate =  this.urlParams.get("fromDate")
    this.moment_bucket_id = JSON.parse(localStorage.getItem("MOMENT_ID"))
    this.userRole = JSON.parse(localStorage.getItem("USER_DETAIL"))?.userRole
    const {redirectedData} = this.props;


    this.state = {
      momentBucket : this.storedData && this.storedData.momentBucketId ? this.storedData.momentBucketId : this.moment_bucket_id,
      callScore: [0, 100],
      pitchScore: [0, 100],
      ahtScore: [0, 120],
      data: {
        selectedDate: this.storedData?.selectedDate ? this.storedData?.selectedDate : "",
        selectedRange: this.storedData?.selectedRange ? this.storedData?.selectedRange : "",
        employee: "",
        employeeId: redirectedData?.employeeId !== null ? redirectedData?.employeeId : this.storedData?.empId ? this.storedData?.empId : "",
        accountEmployeeId: "",
        userEmployeeId: "",
        manager: "",
        managerId: "",
        coe: "",
        teamUser: redirectedData?.employeeName !== null ? {value : redirectedData?.employeeName} : "",
        user: "",
        userCoeId: "",
        teamCOE: this.storedData && this.storedData.selectedCOE ? this.storedData.selectedCOE.length == 1 ? this.storedData?.selectedCOE[0] : [this.storedData?.selectedCOE] : "",
        coeId: this.storedData && this.storedData.selectedCoeRange ? this.storedData.selectedCoeRange : "",
        role: this.storedData && this.storedData.role ? this.storedData?.role : "",
        designation: this.storedData && this.storedData.designation ? this.storedData?.designation : "",
        caller: this.storedData && this.storedData.type ? this.storedData.type : "",
        call: redirectedData?.agentCallScore !== undefined ? redirectedData?.agentCallScore : this.storedData && this.storedData.callScore ? this.storedData?.callScore : [0, 100],
        pitch: this.storedData && this.storedData.pitchScore ? this.storedData?.pitchScore : [0, 100],
        users: [],
        aht: redirectedData?.aht !== undefined ? redirectedData.aht : this.storedData && this.storedData.aht ? this.storedData?.aht : [0, 1000],
        callsFrom: this.storedData && this.storedData.callsFrom ? this.storedData?.callsFrom : "",
        callsTo: this.storedData && this.storedData.callsTo ? this.storedData?.callsTo : "",
        team_fromD:
          this.localFrom ? this.localFrom :
            `${this.firstDay.getDate()}-${this.firstDay.getMonth() + 1}-${this.firstDay.getFullYear()}`,
        team_toD:
          this.localTo ? this.localTo :
            `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
      },
      userId: this.props.userId,
      columns: this.props.columns,
      coeOptions: '',
      loader: false,
      errorMessage: "",
      value: "",
      suggestions: [],
      dashboard_fromD: "",
      dashboard_toD: "",
      momentBucketId: "",
      opendp: false,
      opendp1: false,
      fromD: this.storedData?.fromD ? new Date(`${this.storedData?.fromD.split("-")[1]}-${this.storedData?.fromD.split("-")[0]}-${this.storedData?.fromD.split("-")[2]}`) : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      toD: this.storedData?.toD ? new Date(`${this.storedData?.toD.split("-")[1]}-${this.storedData?.toD.split("-")[0]}-${this.storedData?.toD.split("-")[2]}`) : new Date(),
      coeExternalId: [],
      filteredList: {},
      Cname: [],
      mobile: "",
      file: "",
      Sname: [],
      selectedS: "",
      agentExId: "",
      Sros: [],
      Cscore: [],
      health: "",
      CallDur: [],
      words: [],
      from: "",
      to: "",
      moment: [],
      momentId: [],
      coe: [],
      pitch: [],
      prob: [],
      opp: [],
      urgency: [],
      resetField: false,
      coeId: [],
      resetButton: false,
      defCoe: "",
      defFrom: "",
      defTo: "",
      selectedCOE: "",
      selectedCoeRange: "",
      selectedDate: "",
      selectedRange: "",
      // momentBucket: "",
      selectedCustomer: "",
      selectedMobile: "",
      defaultAgentCoe: "",
      frequency: "",
      reportType: "",
      disableApply: false,
      email:"",
      emailAgentName: "",
      agentSubmit: false
    };

    this.startDate = new Date();
    this.myRef = React.createRef();
    this.formRef = React.createRef();
    this.toggleClick = this.toggleClick.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.displayFilter = this.displayFilter.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.setInputs = this.setInputs.bind(this);

    this.sidebarWrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);


    this.marks = [
      {
        value: 0,
        label: "0%",
      },
      {
        value: 100,
        label: "100%",
      },
    ];
    this.score = [
      {
        value: 0,
        label: "0 min.",
      },
      {
        value: 100,
        label: "120 min.",
      },
    ];
    this.ahTScore = [
      {
        value: 0,
        scaledValue: 0,
        label: "0 sec.",
      },
      {
        value: 1000,
        scaledValue: 1000,
        label: "1000+ sec.",
      },
    ];
  }


  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);

    if (JSON.parse(localStorage.getItem("AGENT")) && (this.props.componentType == 'FILTER TEAM_TAB')) {
      this.props.filterTeam(this.state.data,this.state.userId,this.state.columns)
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    // Check if the click is outside the sidebar
    if (
      this.sidebarWrapperRef.current &&
      !this.sidebarWrapperRef.current.contains(event.target)
    ) {
      // Close the sidebar if it is open
      if (this.sidebarObj.isOpen) {
        this.sidebarObj.hide();
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.userId !== prevState.userId) {
      return { userId: nextProps.userId };
    }
    return null;
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.userId !== prevState.userId) {
      this.localFrom = JSON.parse(localStorage.getItem("AGENT"))?.fromD
      this.localTo = JSON.parse(localStorage.getItem("AGENT"))?.toD
      this.storedData = JSON.parse(localStorage.getItem("AGENT"))
        this.setState({
            data: {
                selectedDate: this.storedData?.selectedDate ? this.storedData?.selectedDate : "",
                selectedRange: this.storedData?.selectedRange ? this.storedData?.selectedRange : "",
                employee: "",
                employeeId: this.storedData?.empId ? this.storedData?.empId : "",
                accountEmployeeId: "",
                userEmployeeId: "",
                manager: "",
                managerId: "",
                coe: "",
                teamUser: "",
                user: "",
                userCoeId: "",
                teamCOE: this.storedData?.selectedCOE && this.storedData.selectedCOE.length === 1 ? this.storedData.selectedCOE[0] : "",
                coeId: this.storedData.selectedCoeRange ? this.storedData.selectedCoeRange:"",
                role: this.storedData?.role ? this.storedData.role : "",
                designation: this.storedData?.designation ? this.storedData.designation : "",
                caller: this.storedData?.type ? this.storedData.type : "",
                call: this.storedData?.callScore ? this.storedData.callScore : [0, 100],
                pitch: this.storedData?.pitchScore ? this.storedData.pitchScore : [0, 100],
                users: [],
                aht: this.storedData?.aht ? this.storedData.aht : [0, 1000],
                callsFrom: this.storedData?.callsFrom ? this.storedData.callsFrom : "",
                callsTo: this.storedData?.callsTo ? this.storedData.callsTo : "",
                team_fromD: this.localFrom ? this.localFrom : `${this.firstDay.getDate()}-${this.firstDay.getMonth() + 1}-${this.firstDay.getFullYear()}`,
                team_toD: this.localTo ? this.localTo : `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
            }
        }, () => {
            if (JSON.parse(localStorage.getItem("AGENT")) && (this.props.componentType === "FILTER TEAM_TAB" || this.props.componentType === "FILTER TEAM")) {
                this.props.filterTeam(this.state.data, this.state.userId);
            }
        });
    }
}

  disableDashBoardApply = (val) => {
    this.setState({disableApply: val})
  }
  resetForm = () => {
    this.setState({ resetField: true })
  }
  resetFormState = () => {
    this.setState({ resetField: false })
  }
  handleSubmit(e) {
    this.sidebarObj.toggle();
    this.setState({ loader: true });

    e.preventDefault();

    if (Object.keys(this.state).length !== 0) {
      if (this.props.componentType == 'Dashboard-Sales' || this.props.componentType == 'Dashboard-Support') {
        this.props.filterData({ from: this.state.dashboard_fromD, to: this.state.dashboard_toD, externalIds: this.state?.coeExternalId?.length > 1 || typeof (this.state.coeExternalId) == 'object' ? this.state.coeExternalId : [this.state.coeExternalId], loader: true, selectedCOE: this.state.selectedCOE, selectedDate: this.state.selectedDate, momentBucket: this.state.momentBucket, momentBucketId: this.state.momentBucketId })
        let from = JSON.parse(localStorage.getItem("AGENT"))
        if(this.state.momentBucketId){
        localStorage.setItem("MOMENT_ID",this.state.momentBucketId)
        localStorage.setItem("MOMENT_BUCKETS",this.state.momentBucket)
        }
        localStorage.setItem("selectedPage",1)
        localStorage.setItem("AGENT", JSON.stringify({
          "pageSelected": from?.pageSelected,
          "analysis": from?.analysis,
          "productivity": from?.productivity,
          "fromD": this.state.dashboard_fromD ? this.state.dashboard_fromD : from.fromD,
          "toD": this.state.dashboard_toD ? this.state.dashboard_toD : from.toD,
          "coe": this.state.coeExternalId && (this.state?.coeExternalId?.length > 1 || typeof (this.state.coeExternalId) == 'object') ? this.state.coeExternalId : this.state.coeExternalId && (!this.state?.coeExternalId?.length > 1 || typeof (this.state.coeExternalId) != 'object') ? [this.state.coeExternalId] : from?.coe,
          "agentDetailCOE": from?.agentDetailCOE,
          "selectedCOE": this.state.selectedCOE ? this.state.selectedCOE : from.selectedCOE,
          "selectedCoeRange": this.state.selectedCoeRange ? this.state.selectedCoeRange : from.selectedCoeRange,
          "userIds": from?.userIds,
          "userNames": from?.userNames,
          "empId": from?.employeeId,
          "empName": from?.user,
          "role": from?.role,
          "designation": from?.designation,
          "type": from?.type,
          "teamCOE": this.state.selectedCOE ? this.state?.selectedCOE : from?.teamCOE,
          "callsFrom": from?.callsFrom,
          "callsTo": from?.callsTo,
          "aht": from?.aht,
          "callScore": from?.callScore,
          "pitchScore": from?.pitchScore,
          "customerName": from?.customerName,
          "customerMobile": from?.customerMobile,
          "fileName": from?.fileName,
          "sellerROS": from?.sellerROS,
          "sellerName": from?.sellerName,
          "selectedSeller": from?.selectedSeller,
          "cScore": from?.cScore,
          "callHealth": from?.callHealth,
          "callDuration": from?.callDuration,
          "words": from?.words,
          "moment": from?.moment,
          "momentId": from?.momentId,
          // "coeName":this.state.coe,
          "pitch": from?.pitch,
          "prob": from?.prob,
          "opportunity": from?.opp,
          "urgency": from?.urgency,
          "selectedDate": this.state.selectedDate ? this.state.selectedDate : from.selectedDate,
          "selectedRange": this.state.selectedRange ? this.state.selectedRange : from.selectedRange,
          "momentBucket": this.state.momentBucket ? this.state.momentBucket : from.momentBucket,
          "momentBucketId": this.state.momentBucketId ? this.state.momentBucketId : from.momentBucketId,
          "frequency": from?.frequency,
          "reportType": from?.reportType
        }))
      }
    } else {
      toaster.error("select property to filter table");
    }
    setTimeout(() => {
      this.setState({ loader: false });
    }, 2000);
  }
  
  onResetClick() {
    this.loader = false;
    this.sidebarObj.toggle();
    this.coeId = this.props?.coes?.map(item => item.coeId);

    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const today = new Date();

    const fromD = `${firstDay.getDate() < 10 ? '0' + firstDay.getDate() : firstDay.getDate()}-${(firstDay.getMonth() + 1) < 10 ? '0' + (firstDay.getMonth() + 1) : (firstDay.getMonth() + 1)}-${firstDay.getFullYear()}`;
    const toD = `${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}-${(today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getFullYear()}`;
  
    this.setState(prevState => {
      const userId = JSON.parse(localStorage.getItem('USER_DETAIL'))?.userId;
      return {
        data: {
          ...prevState.data,
          userEmployeeId: "",
          accountEmployeeId: "",
          employeeId: "",
          manager: "",
          employee:"",
          user: "",
          coe: "",
          teamCOE: "Select All",
          coeId: this.coeId ? this.coeId : JSON.parse(localStorage.getItem("AGENT")).selectedCOERange,
          role: "",
          designation: "",
          caller: "",
          call: [0, 100],
          pitch: [0, 100],
          aht: [0, 1000],
          callsFrom: "",
          callsTo: "",
          team_fromD: fromD,
          team_toD: toD,
          teamUser: ""
        },
        fromD: firstDay,
        toD: today,
        userId: userId,
        callScore: [0, 100],
        pitchScore: [0, 100],
        ahtScore: [0, 120]
      };
    }, () => {
  
      if (this.props.componentType == 'Dashboard-Sales' || this.props.componentType == 'Dashboard-Support') {
        this.resetForm()
        this.props.filterData({})
        localStorage.setItem("AGENT", JSON.stringify({ "fromD": fromD, "toD": toD, "momentBucket": localStorage.getItem("MOMENT_BUCKETS"), "momentBucketId": localStorage.getItem("MOMENT_ID") , "coe" : this?.storedData?.coe }))
      }
    });
  } 


  onCreate() {
    this.sidebarObj.element.style.visibility = "";
  }

  toggleClick() {
    this.sidebarObj.toggle();
  }

  setInputs(d) {
    this.setState({ employeeName: d });
  }


  handleTeamUserChange = (e, val) => {
    this.setState(({ data }) => ({
      data: { ...data, teamUser: val },
    })); 
  }
  handleAutocompleteKeyDown = (event) => {
    if (event.keyCode === 8) {
      // Backspace key code
      this.setState(({ data }) => ({
        data: { ...data, teamUser: null },
      }));
    }
    if (event.keyCode === 46) {
      // Delete key code
      this.setState(({ data }) => ({
        data: { ...data, teamUser: null },
      }));
    }
  }


  handleUserChange = (e, val) => {
    this.setState(({ data }) => ({
      data: { ...data, user: val.label === "None" ? "" : val },
    }));
  }


  handleSelect(e) {
    if (e.target.name == "selectDate") {
      if (e.target.value == "Custom Date") {
        this.myRef.current.style.display = "block";
      } else {
        this.myRef.current.style.display = "none";
      }
    } else {
      this.setState(({ data }) => ({
        data: { ...data, [e.target.name]: e.target.value },
      }));
    }
  }



  handleMomentSelect = (e) => {
    this.setState({momentBucket: e.target.value});
    this.getCoeList(e.target.value)
  }

  getCoeList = (val) => {
    this.disableDashBoardApply(true)
    dashboardService.getMomentCOEList(val).then(res => {
      this.disableDashBoardApply(false)
      this.props.setCoes(res ? res.data.data ? res.data.data : '' : '')
      this.setState(({ data }) => ({
        data: { ...data, coeId: res.data.data.map(item=> item.coeId) },
      }));
      this.props.filterTeam(this.state.data,this.state.userId,this.state.columns);
    })
  }

  callBack = (e) => {
    this.setState({ dashboard_fromD: e.fromDate })
    this.setState({ dashboard_toD: e.toDate })
    this.setState({ coeExternalId: e.externalId })
    this.setState({ selectedCOE: e.selectedCOE })
    this.setState({ selectedCoeRange: e.selectedCoeRange })
    this.setState({ selectedDate: e.selectedDate })
    this.setState({ selectedRange: e.selectedRange })
    this.setState({ momentBucket: e.momentBucket })
    this.setState({ momentBucketId: e.momentBucketId })
  }


  callBackFunc = (e) => {
    this.setState({ Cname: e.customerName })
    this.setState({ mobile: e.customerMobile })
    this.setState({ file: e.fileName })
    this.setState({ Sname: e.agentName })
    this.setState({ agentExId: e.agentExId })
    this.setState({ selectedS: e.selectedSeller })
    this.setState({ Sros: e.sellerROS })
    this.setState({ Cscore: e.callScoreRange })
    this.setState({ health: e.callHealth })
    this.setState({ CallDur: e.callDurationRange })
    this.setState({ from: e.from })
    this.setState({ to: e.to })
    this.setState({ words: e.words })
    this.setState({ moment: e.moment })
    this.setState({ momentId: e.momentId })
    this.setState({ coe: e.coeName })
    this.setState({ selectedCoeRange: e.selectedCoeRange })
    this.setState({ coeExternalId: e.externalId })
    this.setState({ pitch: e.pitch })
    this.setState({ prob: e.prob })
    this.setState({ opp: e.opp })
    this.setState({ urgency: e.urgency })
    this.setState({ selectedDate: e.selectedDate })
    this.setState({ selectedRange: e.selectedRange })
    this.setState({ email: e.email })
    this.setState({emailAgentName: e.emailAgentName})
    this.setState({ momentBucket: e.momentBucket })
    this.setState({ momentBucketId: e.momentBucketId })
  }

  defaultData = (e) => {
    this.setState({ defaultAgentCoe: e.externalId })
    localStorage.setItem("AGENT", JSON.stringify(
      {
        "pageSelected": this.storedData?.pageSelected,
        "analysis": this.storedData?.analysis,
        "productivity": this.storedData?.productivity,
        "fromD": this.storedData?.fromD ? this.storedData?.fromD : e.fromDate,
        "toD": this.storedData?.toD ? this.storedData?.toD : e.toDate,
        "agentDetailCOE": this.storedData?.agentDetailCOE ? this.storedData.agentDetailCOE : e.externalId,
        "coe": this.storedData?.coe,
        "selectedCOE": this.storedData?.selectedCOE,
        "selectedCoeRange": this.storedData?.selectedCoeRange,
        "userIds": this.storedData?.userIds,
        "userNames": this.storedData?.userNames,
        "empId": this.storedData?.employeeId,
        "empName": this.storedData?.user,
        "role": this.storedData?.role,
        "designation": this.storedData?.designation,
        "type": this.storedData?.type,
        "teamCOE": this.storedData?.teamCOE,
        "callsFrom": this.storedData?.callsFrom,
        "callsTo": this.storedData?.callsTo,
        "aht": this.storedData?.aht,
        "callScore": this.storedData?.callScore,
        "pitchScore": this.storedData?.pitchScore,
        "customerName": this.storedData?.customerName,
        "customerMobile": this.storedData?.customerMobile,
        "fileName": this.storedData?.fileName,
        "sellerROS": this.storedData?.sellerROS,
        "sellerName": this.storedData?.sellerName,
        "selectedSeller": this.storedData?.selectedSeller,
        "cScore": this.storedData?.cScore,
        "callHealth": this.storedData?.callHealth,
        "callDuration": this.storedData?.callDuration,
        "words": this.storedData?.words,
        "moment": this.storedData?.moment,
        "momentId": this.storedData?.momentId,
        "pitch": this.storedData?.pitch,
        "prob": this.storedData?.prob,
        "opportunity": this.storedData?.opp,
        "urgency": this.storedData?.urgency,
        "selectedDate": this.storedData?.selectedDate,
        "selectedRange": this.storedData?.selectedRange,
        "momentBucket": this.storedData?.momentBucket,
        "momentBucketId": this.storedData?.momentBucketId,
        "frequency": this.storedData?.frequency,
        "reportType": this.storedData?.reportType
      }))
    this.props.defaultFilter({ coeIds: e.externalId, from: e.fromDate, to: e.toDate })
  }

  defaultDashboardData = (e) => {
    this.props?.setCoe(e?.selectedCoeRange)
    localStorage.setItem("AGENT", JSON.stringify(
      {
        "pageSelected": this.storedData?.pageSelected,
        "analysis": this.storedData?.analysis,
        "productivity": this.storedData?.productivity,
        "fromD": e.fromDate,
        "toD": e.toDate,
        "agentDetailCOE": this.storedData?.agentDetailCOE,
        "coe": e.externalId,
        "selectedCOE": e.selectedCOE,
        "selectedCoeRange": e.selectedCoeRange ? e.selectedCoeRange : this.storedData.selectedCoeRange,
        "userIds": this.storedData?.userIds,
        "userNames": this.storedData?.userNames,
        "empId": this.storedData?.employeeId,
        "empName": this.storedData?.user,
        "role": this.storedData?.role,
        "designation": this.storedData?.designation,
        "type": this.storedData?.type,
        "teamCOE": this.storedData?.teamCOE,
        "callsFrom": this.storedData?.callsFrom,
        "callsTo": this.storedData?.callsTo,
        "aht": this.storedData?.aht,
        "callScore": this.storedData?.callScore,
        "pitchScore": this.storedData?.pitchScore,
        "customerName": this.storedData?.customerName,
        "customerMobile": this.storedData?.customerMobile,
        "fileName": this.storedData?.fileName,
        "sellerROS": this.storedData?.sellerROS,
        "sellerName": this.storedData?.sellerName,
        "selectedSeller": this.storedData?.selectedSeller,
        "cScore": this.storedData?.cScore,
        "callHealth": this.storedData?.callHealth,
        "callDuration": this.storedData?.callDuration,
        "words": this.storedData?.words,
        "moment": this.storedData?.moment,
        "momentId": this.storedData?.momentId,
        "pitch": this.storedData?.pitch,
        "prob": this.storedData?.prob,
        "opportunity": this.storedData?.opp,
        "urgency": this.storedData?.urgency,
        "selectedDate": e.selectedDate,
        "selectedRange": e.selectedRange,
        "momentBucket": e.momentBucket,
        "momentBucketId": e.momentBucketId,
        "frequency": this.storedData?.frequency,
        "reportType": this.storedData?.reportType
      }))
    // if(e.fromDate!=undefined&&e.toDate!=undefined){
    this.props.beforeFilter({ from: e.fromDate, to: e.toDate, externalIds: e.externalId, momentBucket: e.momentBucket, selectedCOE: e.selectedCOE, selectedDate: e.selectedDate, loader: true })
    // }

  }

  displayFilter() {
    switch (this.props.componentType) {
      case "Dashboard-Sales": {
        return (
          <DashboardFilters filterInput={this.props.filterInput} callBack={this.callBack} name={this.props.name} reset={this.state.resetField} resetFormState={this.resetFormState} defaultDashboardData={this.defaultDashboardData} disableApply={this.disableDashBoardApply}/>
        );
      }

      case "Dashboard-Support": { 
        return (
          <DashboardFilters filterInput={this.props.filterInput} callBack={this.callBack} name={this.props.name} reset={this.state.resetField} resetFormState={this.resetFormState} defaultDashboardData={this.defaultDashboardData} />
        );
      }
    }
  }

  render() {
    return (
      <div className="" ref={this.sidebarWrapperRef}>
        <div>
          <SidebarComponent
            enableGestures={false}
            id="default1"
            ref={(Sidebar) => (this.sidebarObj = Sidebar)}
            created={this.onCreate}
            width="280px"
            type={this.type}
            position="Right"
            style={{ visibility: "hidden" }}
          ></SidebarComponent>
          <div className="switcher-wrapper call-filters side-fillters-scroler">
            <div className="switcher-btn" onClick={this.toggleClick}>
              {" "}
              <i className="bx bx-filter-alt"></i>
            </div>
            <div className="switcher-body">
              <Form ref={this.formRef}>
                <div className="d-flex top-heading align-items-center">
                  <div>
                    <h5 className="mb-0 text-uppercase font-14">
                      {this.props.componentType === "FILTER TEAM_TAB"
                        ? "FILTER TEAM"
                        : this.props.componentType}{" "}
                      {""}
                    </h5>
                  </div>
                  <button
                    type="button"
                    onClick={this.toggleClick}
                    className="btn-close ms-auto close-switcher"
                    aria-label="Close"
                  ></button>
                </div>

                <hr className="my-2" />

                <div className="filter_scroll px-1">{this.displayFilter()}</div>
                <div className="filters_btn bg-white py-2">
                  <button
                    type="button"
                    className="btn px-4 btn-light me-2 lh-base cancel-btn"
                    onClick={this.onResetClick}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn px-4 lh-base update-btn"
                    onClick={this.handleSubmit}
                    disabled={this.state.disableApply || this.state.agentSubmit}
                  >
                    {" "}
                    {this.state.loader ? (
                      <Loading variant="light" />
                    ) : (
                      <>Apply</>
                    )}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    team: state.manage_teams.team,
    users: state.manage_users?.users?.userResponses || [],
    Team: state.manage_team.Team,
    COE: state.manage_coe.coe
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetFilter: () => {
      dispatch(resetFilter());
    },

    setCoe: (data) => {
      dispatch(setCOE(data))
    },

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
