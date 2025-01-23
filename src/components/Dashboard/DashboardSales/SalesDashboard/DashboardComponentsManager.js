import React, { useEffect, useState} from "react";
import Seller from "./Seller";
import SellerDistribution from "./SellerDistribution";
import WordCloudd from "./WordCloud";
import MomentAndSignalsPerformance from "./MomentAndSignalsPerformance";
import { SALES_DASHBOARD_COMPONENT_NAME } from '../../../../Constants/Enum'
import dashboardService from "../../../Services/dashboard.service";
import AhtAndCompliance from "./AhtAndCompliance";

const DashboardComponentsManager = (props) => {
  let { data, widgetData, defaultFilteredData, name, callApi } = props;
  let initData = (data || []).map((x) => x.wgt_code).reduce((a, v) => ({ ...a, [v]: '' }), {});
  let wgtCodelist = (data || []).map((x) => [x?.wgt_name, x?.wgt_code, x?.wgt_type]);
  const [dashboardState, setDashboardState] = useState(initData);
  const [loader, setLoader] = useState(false);

  const localData = JSON.parse(localStorage.getItem("AGENT"))
  let momentData = JSON.parse(localStorage.getItem("MOMENT_ID"))

  useEffect(() => {
    function fetchData() {
      try {
        handleDashBoardDataRequest(initData, (wgt_type, data) => ({
          "callType": name,
          "fromD": widgetData?.from == undefined ? defaultFilteredData?.from : widgetData?.from,
          "toD": widgetData?.to == undefined ? defaultFilteredData?.to : widgetData?.to,
          "coeExternalIds":localData && localData.coe ? localData.coe : defaultFilteredData.externalIds,
          // "coeExternalIds": widgetData?.externalIds?.length > 0 && widgetData?.externalIds[0] == undefined ? defaultFilteredData.externalIds : widgetData?.externalIds,
          "dashboardWidget": wgt_type,
          "dashboardWidgetScore": data[wgt_type],
          "momentBucketId": momentData
        }))
      } catch (err) {
        setLoader(false);
      }
    }
    setDashboardState(initData);
    if (widgetData !== undefined && callApi) {
      setLoader(true);
      fetchData();
    }
  }, [widgetData]);

  useEffect(() => {
    function fetchData() {
      try {
        handleDashBoardDataRequest(initData, (wgt_type, data) => {
          return {
            "callType": name,
            "fromD": defaultFilteredData.from,
            "toD": defaultFilteredData.to,
            "coeExternalIds": defaultFilteredData.externalIds,
            "dashboardWidget": wgt_type,
            "dashboardWidgetScore": data[wgt_type],
            "momentBucketId": momentData
          }
        })
      } catch (err) {
        setLoader(false);
      }
    }
    setDashboardState(initData);
    if (props.widgetData == undefined && callApi) {
      setLoader(true);
      fetchData();
    }
  }, [localData?.fromD, localData?.toD]);

  useEffect(() => {
    function fetchData() {
      try {
        handleDashBoardDataRequest(dashboardState, (wgt_type, data) => ({
          "callType": name,
          "fromD": widgetData?.from == undefined ? defaultFilteredData?.from : widgetData?.from,
          "toD": widgetData?.to == undefined ? defaultFilteredData?.to : widgetData?.to,
          // "coeExternalIds": widgetData?.externalIds?.length > 0 && widgetData?.externalIds[0] == undefined ? defaultFilteredData.externalIds : widgetData?.externalIds,
          "coeExternalIds":localData && localData.coe ? localData.coe : defaultFilteredData.externalIds,
          "dashboardWidget": wgt_type,
          "dashboardWidgetScore": data[wgt_type],
          "momentBucketId": momentData
        }))
      } catch (err) {
        setLoader(false);
      }
    }
    if (callApi) {
      setLoader(true);
      fetchData();
    }
  }, [callApi]);

  const handleDashBoardDataRequest = (state, reqData) => {
    let unique_wgt_types = [];
    let namesOfWgtTypes = {}
    try {
      // getting unique wgt_types for diff api calls
      (wgtCodelist || []).forEach(item => {
        if (!unique_wgt_types.includes(item[2])) {
          // wgt_name ,wgt_code, wgt_type
          unique_wgt_types.push(item[2]);
          if (!state[item[1]]) {
            namesOfWgtTypes[item[2]] = [item[1]];
          }
        } else {
          if (!state[item[1]])
            namesOfWgtTypes[item[2]] = [...namesOfWgtTypes[item[2]], item[1]];
        }
      });
      unique_wgt_types.map(async (wgtType, i) => {
        try {
          let reqData1 = (reqData && namesOfWgtTypes[wgtType]) ? reqData(wgtType, namesOfWgtTypes) : false
          if (reqData1) {
            const res = await dashboardService.getWidgetData(reqData1);
            let respFormat = {};
            await (res?.data.data || []).map(x => {
              let updated_wgt_code = (wgtCodelist || []).find(item => item[0] === x.header)?.[1];
              x.header && updated_wgt_code && (respFormat[updated_wgt_code] = { data: x.widgetsDataResponses, url: x.url })
            });
            await setDashboardState((pre) => ({ ...pre, ...respFormat }))
          }
        } catch (err) {
          console.log("ERROR____", err)
        }
        (unique_wgt_types.length === i + 1) && setLoader(false);
      })
    } catch (e) {
      console.log("ERROR____1", e)
    }
  }

  return (
    <>
      {data.map((item, index) => {
        switch (item.wgt_type) {
          case SALES_DASHBOARD_COMPONENT_NAME.VERTICAL_BAR_GRAPH:
            return (
              <SellerDistribution
                wgt_data={item}
                key={index}
                width={item.width_ratio}
                widgetData={widgetData}
                defaultFilteredData={defaultFilteredData}
                name={name}
                data={dashboardState[item.wgt_code] || {}}
                scroll={loader}
              />
            );
          case SALES_DASHBOARD_COMPONENT_NAME.USER_DATA_LIST:
            return (
              <Seller
                wgt_data={item}
                key={index}
                width={item.width_ratio}
                widgetData={widgetData}
                defaultFilteredData={defaultFilteredData}
                name={name}
                data={dashboardState[item.wgt_code] || {}}
                scroll={loader}
              />
            );
          case SALES_DASHBOARD_COMPONENT_NAME.HORIZONTAL_BAR_GRAPH:
            return (
              <MomentAndSignalsPerformance
                wgt_data={item}
                key={index}
                width={item.width_ratio}
                widgetData={widgetData}
                defaultFilteredData={defaultFilteredData}
                name={name}
                data={dashboardState[item.wgt_code] || {}}
                scroll={loader}
              />
            );
          case SALES_DASHBOARD_COMPONENT_NAME.VERTICAL_BAR_GRAPH_2:
            return (
              <AhtAndCompliance
                wgt_data={item}
                key={index}
                width={item.width_ratio}
                widgetData={widgetData}
                defaultFilteredData={defaultFilteredData}
                name={name}
                data={dashboardState[item.wgt_code] || {}}
                scroll={loader}
              />
            )
          case SALES_DASHBOARD_COMPONENT_NAME.WORD_CLOUD:
            return (
              <WordCloudd
                wgt_data={item}
                key={index}
                width={item.width_ratio}
                widgetData={widgetData}
                defaultFilteredData={defaultFilteredData}
                name={props.name}
                data={dashboardState[item.wgt_code] || {}}
                scroll={loader}
              />
            );
          //   case SALES_DASHBOARD_COMPONENT_NAME.VERTICAL_BAR_GRAPH_TAB:
          //   	return (  <CallDistribution wgt_data={item} key={index} width={item.width_ratio} widgetData={widgetData} defaultFilteredData={defaultFilteredData} name={props.name}/> );
          default:
            return null;
        }
      })}
    </>
  );
};

export default React.memo(DashboardComponentsManager);
