import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import "../../Dashboard.css";
import Filter from "../../../Filter/Filter";
import SalesDashBoardModel from "./SalesDashBoardModel";
import { USER_DETAIL } from "../../../../Constants/constant";
import SingleCarouselManager from "./singleCarouselManager";
import DoubleCarouselManager from "./DoubleCarouselManager";
import DashboardComponentsManager from "./DashboardComponentsManager";
import { themeButtonPrimary, themePrimary } from "../../../../assets/styles";
import { positionFormat } from "../../../Commons/DateFormatter";

export default function Dashboards(props) {
 const [show, setShow] = useState(false);
 const [widgetName, setWidgetName] = useState();
 const [widgetData, setWidgetData] = useState();
 const [viewItems, setViewItems] = useState({});
 const [defaultFilteredData, setDefaultFilteredData] = useState();
 let p = localStorage.getItem(USER_DETAIL);
 let data = JSON.parse(p);

 const closeButton = () => setShow(false);

 const filterData = (value) => {
  setWidgetData(value);
 };

 const carouselStructure = () => {
  if (props?.dasboardStructure?.[1]?.list) {
   const rawData = props?.dasboardStructure?.[1]?.list;
   const arrayList = [];
   for (let i = 0; i < rawData.length; i += 2) {
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
  let ids = (props?.dasboardStructure || [])
   .map((x, i) => (x?.type === "FIXED_ROW" ? `FIXED_ROW-${i}` : ""))
   ?.filter((x) => x);
  (ids || [])?.forEach((x, index) => {
   let desiredElementPosition = document
    .getElementById(x)
    ?.getBoundingClientRect()?.bottom;
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
 useEffect(() => {
  window.addEventListener("scroll", handleScroll);
  return () => {
   window.removeEventListener("scroll", handleScroll);
  };
 }, []);

 const localData = JSON.parse(localStorage.getItem("AGENT"));

 const showDetailModal = (val) => {
  setWidgetName(val);
  setShow(true);
 };

 return (
  <div className="page-wrapper">
   <div className="page-content dashboard-filter">
    <Filter
     componentType="Dashboard-Sales"
     filterData={filterData}
     beforeFilter={beforeFilter}
     name={props.name}
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
           {`${props.name} DASHBOARD`}
          </h2>
          {data.userRole != "AGENT" ||
           data.userRole != "MANAGER" ||
           data.userRole != "QUALITY_MANAGER" ||
           data.userRole != "QUALITY_ASSOCIATE" ||
           data.userRole != "QUALITY_TRAINER" ||
           data.userRole != "SUPERVISOR" ||
           (data.userRole != "TEAM_LEAD" && (
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
       props.dasboardStructure.length != 0 ? (
        props.dasboardStructure.map((data, ind) => {
         if (data.type === "SINGLE_CAROUSEL") {
          return (
           <SingleCarouselManager
            key={ind}
            data={data}
            name={props.name}
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
     ? props.dasboardStructure
       ? props.dasboardStructure.msg
         ? ""
         : props.dasboardStructure.map((data, ind) => {
            if (data.type === "DOUBLE_CAROUSEL") {
             let doubleCarouselData = carouselStructure();
             return (
              <div className="dash-wrapper-two" key={ind}>
               <div className="row">
                <div className="col-12 custom-rc-slider">
                 <DoubleCarouselManager
                  doubleCarouselData={doubleCarouselData}
                  showDetailModal={showDetailModal}
                  widgetData={widgetData}
                  defaultFilteredData={defaultFilteredData}
                  name={props.name}
                 />
                </div>
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
                name={props.name}
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
     name={props.name}
    />
   ) : (
    ""
   )}
  </div>
 );
}
