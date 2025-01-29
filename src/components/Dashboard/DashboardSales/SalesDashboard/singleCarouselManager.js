import React, { useEffect, useState } from "react";
import SingalCarousel from "./SingalCarousel";
import dashboardService from "@services";
import Carousel, { consts } from "react-elastic-carousel";

const SingleCarouselManager = (props) => {
    let { data, name, showDetailModal, widgetData, defaultFilteredData } = props;
    let initData = (data?.list || []).map((x) => x.wgt_code).reduce((a, v) => ({ ...a, [v]: '' }), {});
    const [carusalData, setCarusalData] = useState(initData || {});
    const [apilist, setApiList] = useState({});
    const [loading, setLoading] = useState(false);
    let localData = JSON.parse(localStorage.getItem("AGENT"));
    let momentData = JSON.parse(localStorage.getItem("MOMENT_ID"));

    useEffect(() => {
        setApiList([...new Array(5)].map((x, i) => { return [data.list[i]?.wgt_code, data.list[i]?.wgt_name] })
            .reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {}));
    }, []);

    useEffect(() => {
        let values = {
            "callType": name,
            "fromD": localData?.fromD,
            "toD": localData?.toD,
            "coeExternalIds": localData?.coe,
            "dashboardWidget": data?.list[0]?.wgt_type,
            "dashboardWidgetScore": Object.keys(apilist || {}),
            "drillDown": Object.keys(apilist).map(key => `${key}_DRILLDOWN`),
            "momentBucketId": parseInt(momentData)
        }
        async function fetchData() {
            try {
                if (Object.keys(apilist).length) {
                    const res = await dashboardService.getWidgetData(values);
                    let respFormat = {};
                    let listEntities = Object.entries(apilist);
                    (res && res.data?.data || []).forEach(x => {
                        let item = listEntities.find(y => y[1] === x.header);
                        x.header && item && (respFormat[item[0]] = { data: x.widgetsDataResponses, url: x.url })
                    });
                    setCarusalData({ ...initData, ...respFormat });
                    setLoading(false);
                }
            } catch (err) {
                setLoading(false);
            }
        }
        if (values.callType != "" && widgetData != undefined) {
            setCarusalData(initData);
            setLoading(true);
            fetchData();
        }
    }, [widgetData]);

    useEffect(() => {
        let valuesDef = {
            "callType": name,
            "fromD": localData && localData.fromD ? localData.fromD : defaultFilteredData.from,
            "toD": localData && localData.toD ? localData.toD : defaultFilteredData.to,
            "coeExternalIds": localData && localData.coe ? localData.coe : defaultFilteredData.externalIds,
            "dashboardWidget": data?.list[0]?.wgt_type,
            "dashboardWidgetScore": Object.keys(apilist || {}),
            "drillDown": Object.keys(apilist).map(key => `${key}_DRILLDOWN`),
            "momentBucketId": parseInt(momentData)
        }
        async function fetchData() {
            try {
                if (Object.keys(apilist).length) {
                    const res = await dashboardService.getWidgetData(valuesDef)
                    let respFormat = {};
                    let listEntities = Object.entries(apilist);
                    await (res?.data?.data || []).map(x => {
                        let item = listEntities.find(y => (y[1] === x.header));
                        x.header && item && (respFormat[item[0]] = { data: x.widgetsDataResponses, url: x.url })
                    });

                    setCarusalData({ ...initData, ...respFormat });
                    setLoading(false);
                }
            } catch (err) {
                setLoading(false);
            }
        }
        if (valuesDef.callType != "" && props.widgetData == undefined) {
            setCarusalData(initData);
            setLoading(true);
            fetchData();
        }
    }, [localData.fromD, localData.toD]);

    useEffect(() => {
        let listKeys = Object.keys(apilist);
        let isDataNotAvailable = listKeys.filter(key => !carusalData[key]);
        let graphVal = listKeys.map(key => `${key}_DRILLDOWN`)
        async function fetchData() {
            try {
                let valuesDef = {
                    "callType": name,
                    "fromD": localData && localData.fromD ? localData.fromD : defaultFilteredData.from,
                    "toD": localData && localData.toD ? localData.toD : defaultFilteredData.to,
                    "coeExternalIds": localData && localData.coe ? localData.coe : defaultFilteredData.externalIds,
                    "dashboardWidget": data?.list[0]?.wgt_type,
                    "dashboardWidgetScore": isDataNotAvailable,
                    "drillDown": graphVal,
                    "momentBucketId": parseInt(momentData)
                }
                const res = await dashboardService.getWidgetData(valuesDef)
                let respFormat = {};
                let listEntities = Object.entries(apilist);
                await (res?.data?.data || []).map(x => {
                    let item = listEntities.find(y => (y[1] === x.header));
                    x.header && item && (respFormat[item[0]] = { data: x.widgetsDataResponses, url: x.url })
                });
                await setCarusalData({ ...carusalData, ...respFormat });
                await setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        }
        if (isDataNotAvailable.length > 0) {
            setLoading(true);
            fetchData();
        }
    }, [apilist]);

    const handleSingleCarl = (currentItem) => {
        let result = [];
        (data?.list || []).forEach((x, i) => { ((i >= currentItem.index) && (i < (currentItem.index + 5))) && (result.push([x.wgt_code, x.wgt_name])) });
        setApiList({ ...result.reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {}) });
    };

    const myArrow = ({ type, onClick }) => {
        const pointer = type === consts.PREV ? '❮' : '❯'
        return (
            <button onClick={onClick} disabled={loading} className="carousel-arrows">
                {pointer}
            </button>
        )
    }

    return (
        <Carousel onChange={handleSingleCarl} pagination={false} itemsToShow={5} itemsToScroll={5} className="ps-0"
            {...loading ? { renderArrow: myArrow } : {}}
        >
            {name ? data.list.map((mapData, index) => {
                return (
                    <SingalCarousel carusalData={carusalData[mapData.wgt_code]} loader={loading && !carusalData[mapData.wgt_code]} wgt_data={mapData}
                        key={index} showDetailModal={showDetailModal} />
                );
            })
                : ""}
        </Carousel>
    )
};
export default React.memo(SingleCarouselManager);
