import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import "../../Dashboard.css";
import Filter from "../../../Filter";
import SalesDashBoardModel from "./SalesDashBoardModel";
import { USER_DETAIL } from "@constants";
import SingleCarouselManager from "./singleCarouselManager";
import DoubleCarouselManager from "./DoubleCarouselManager";
import DashboardComponentsManager from "./DashboardComponentsManager";
import { themeButtonPrimary, themePrimary } from "@assets/css";
import { positionFormat } from "@utils";
import dashboardService from "../../../../services/dashboard.service";
import Loading from "../../Loading";

export default function Dashboards(props) {
 const [show, setShow] = useState(false);
 const [widgetName, setWidgetName] = useState();
 const [widgetData, setWidgetData] = useState();
 const [viewItems, setViewItems] = useState({});
 const [defaultFilteredData, setDefaultFilteredData] = useState();
 const[dasboardStructure, setDasboardStructure] =useState([])
 const [loader, setLoader] = useState()

 let p = localStorage.getItem(USER_DETAIL);
 let data = p ?JSON.parse(p): {};

 const closeButton = () => setShow(false);

 const filterData = (value) => {
  setWidgetData(value);
 };

 const carouselStructure = () => {
  if (dasboardStructure?.[1]?.list) {
   const rawData = dasboardStructure?.[1]?.list;
   const arrayList = [];
   for (let i = 0; i < rawData?.length; i += 2) {
    const chunk = rawData.slice(i, i + 2);
    arrayList.push(chunk);
   }
   return arrayList;
  }
 };

 const beforeFilter = (val) => {
  setDefaultFilteredData(val);
 };

 const handleScroll = () => {
  console.log('hereeeeee', dasboardStructure)
  let ids = (dasboardStructure || []).map((x, i) => (x?.type === "FIXED_ROW" ? `FIXED_ROW-${i}` : ""))?.filter((x) => x);
  console.log(ids);
  (ids || [])?.forEach((x, index) => {
   let desiredElementPosition = document
    .getElementById(x)
    ?.getBoundingClientRect()?.bottom;
    console.log('desiredElement', desiredElementPosition);
   if (desiredElementPosition < window?.innerHeight) {
    // Only update state if necessary
    setViewItems((state) => {
     if (!state[x]) {
      const nextId = ids[index + 1];
      let newState = { ...state, [x]: true };
      if (nextId) {
       newState[nextId] = true;
      }
      return newState;
     }
     return state; // Return the current state if no update is needed
    });
   } else {
    setViewItems((state) => {
     if (state[x]) {
      return { ...state, [x]: false };
     }
     return state;
    });
   }
  });
 };
 function getDashboardSt() {
  let val = { "clientExternalId": data.externalId, "entityType": "SALES" }
  if (data?.userRole != 'AGENT') {
    setLoader(true)
    dashboardService.getDashboard(val).then(res => {
      setDasboardStructure(res ? res.data.data : '');
      setLoader(false)

    })
  }
}
useEffect(() => {
  document.title = "Dashboard - Odio";
  setLoader(false);
  getDashboardSt()
}, [])

 useEffect(() => {
  window.addEventListener("scroll", handleScroll);
  return () => {
   window.removeEventListener("scroll", handleScroll);
  };
 }, [dasboardStructure]);

 const localData = JSON.parse(localStorage.getItem("AGENT"));

 const showDetailModal = (val) => {
  setWidgetName(val);
  setShow(true);
 };

 const name = "SALES"
 return loader ? ( <div className="loader-container">
          <Loading variant="light" />
        </div>):  <div className="page-wrapper">
   <div className="page-content dashboard-filter">
    <Filter
     componentType="Dashboard-Sales"
     filterData={filterData}
     beforeFilter={beforeFilter}
     name={name}
    />
    <div
     className="dash-wrapper dashboard_filter_class"
     style={{ backgroundColor: themePrimary }}
    >
     <div className="row row-cols-1 row-cols-md-2 row-cols-xl-5 row-cols-xxl-5">
      <div className="col-12 mb-4">
       <div className="row">
        <div className="col-md-12">
         <div className="d-inline">
          <h2 className="dashboard-headings d-inline text-dark">
           {`${name} DASHBOARD`}
          </h2>
          {data?.userRole != "AGENT" ||
           data?.userRole != "MANAGER" ||
           data?.userRole != "QUALITY_MANAGER" ||
           data?.userRole != "QUALITY_ASSOCIATE" ||
           data?.userRole != "QUALITY_TRAINER" ||
           data?.userRole != "SUPERVISOR" ||
           (data?.userRole != "TEAM_LEAD" && (
            <span className="badge rounded-pill bg-success text-dark active-filter-on-table">
             {localData?.momentBucket}
             <a href="javascript:;"></a>
            </span>
           ))}
          {localData?.selectedCOE != "" &&
          localData?.selectedCOE?.length > 1 ? (
           localData?.selectedCOE?.map((item, i) => {
            return (
             <span
              key={i}
              className="badge rounded-pill bg-gradient text-dark active-filter-on-table"
              style={{ backgroundColor: themeButtonPrimary }}
             >
              {item}
              <a href="javascript:;"></a>
             </span>
            );
           })
          ) : (
           <span className="badge rounded-pill bg-info bg-gradient text-dark active-filter-on-table">
            {localData?.selectedCOE ? localData?.selectedCOE[0] : ""}
            <a href="javascript:;"></a>
           </span>
          )}
          <span className="badge rounded-pill bg-warning bg-gradient text-dark active-filter-on-table">
           {localData?.selectedDate == "Custom Date"
            ? `From:(${positionFormat(localData?.fromD)}) To:(${positionFormat(
               localData?.toD
              )})`
            : localData?.selectedDate
            ? localData?.selectedDate
            : defaultFilteredData?.selectedDate}
           <a href="javascript:;"></a>
          </span>
         </div>
        </div>
       </div>
      </div>
      {defaultFilteredData?.externalIds ? (
       dasboardStructure?.length != 0 ? (
        dasboardStructure?.map((data, ind) => {
         if (data.type === "SINGLE_CAROUSEL") {
          return (
           <SingleCarouselManager
            key={ind}
            data={data}
            name={name}
            showDetailModal={showDetailModal}
            widgetData={widgetData}
            defaultFilteredData={defaultFilteredData}
           />
          );
         }
        })
       ) : (
        <div></div>
       )
      ) : (
       <div></div>
      )}
     </div>
    </div>

    {defaultFilteredData?.externalIds
     ? dasboardStructure
       ? dasboardStructure.msg
         ? ""
         : dasboardStructure?.map((data, ind) => {
            if (data.type === "DOUBLE_CAROUSEL") {
             let doubleCarouselData = carouselStructure();
             return (
               <div className="row dash-wrapper-two" key={ind}>
                <div className="col-12">
                 <DoubleCarouselManager
                  doubleCarouselData={doubleCarouselData}
                  showDetailModal={showDetailModal}
                  widgetData={widgetData}
                  defaultFilteredData={defaultFilteredData}
                  name={name}
                 />
                </div>
               </div>
             );
            }
            if (data.type === "FIXED_ROW") {
             return (
              <Row
               className="row-cols-1 row-cols-lg-3"
               id={`FIXED_ROW-${ind}`}
               key={ind}
              >
               <DashboardComponentsManager
                data={data.list}
                widgetData={widgetData}
                callApi={viewItems[`FIXED_ROW-${ind}`]}
                defaultFilteredData={defaultFilteredData}
                name={name}
               />
              </Row>
             );
            }
           })
       : ""
     : ""}
   </div>
   {widgetName != undefined && setShow ? (
    <SalesDashBoardModel
     setShow={setShow}
     show={show}
     closeButton={closeButton}
     widgetName={widgetName}
     widgetData={widgetData}
     name={name}
    />
   ) : (
    ""
   )}
  </div>
}
