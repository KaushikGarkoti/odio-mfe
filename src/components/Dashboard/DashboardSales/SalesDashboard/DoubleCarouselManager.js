import React, { useEffect, useState } from "react";
import DoubleCarousel from "./DoubleCarousal";
import dashboardService from "../../../Services/dashboard.service";
import Carousel, { consts } from "react-elastic-carousel";

const DoubleCarouselManager = (props) => {
    let { doubleCarouselData, name, showDetailModal, widgetData, defaultFilteredData } = props;
    let initData = (doubleCarouselData || []).flatMap((x) => x.map((v) => (v.wgt_code))).reduce((a, v) => ({ ...a, [v]: '' }), {});
    const [carusalData, setCarusalData] = useState(initData || {});
    const [apilist, setApiList] = useState({});
    const [loading, setLoading] = useState(false);
    let localData = JSON.parse(localStorage.getItem("AGENT"))
    let momentData = JSON.parse(localStorage.getItem("MOMENT_ID"))

    let values = {
        "callType": name,
        "fromD": localData?.fromD,
        "toD": localData?.toD,
        "coeExternalIds": localData?.coe,
        "dashboardWidget": doubleCarouselData[0][0].wgt_type,
        "dashboardWidgetScore": Object.keys(apilist || {}),
        "momentBucketId": parseInt(momentData)
    }

    useEffect(() => {
        const listItems = doubleCarouselData.flat().slice(0, 8)
            .map((item) => [item.wgt_code, item.wgt_name]);
        const apiList = Object.fromEntries(listItems);
        setApiList(apiList);
    }, []);


    useEffect(() => {
        async function fetchData() {
            try {
                if (Object.keys(apilist).length) {
                    const res = await dashboardService.getWidgetData(values);
                    let respFormat = {};
                    let listEntities = Object.entries(apilist);
                    await (res?.data.data || []).map(x => {
                        let item = listEntities.find(y => (y[1] === x.header));
                        x.header && item && (respFormat[item[0]] = { data: x.widgetsDataResponses, url: x.url })
                    });
                    await setCarusalData({ ...initData, ...respFormat });
                    setLoading(false);                    
                }
            } catch (err) {
                setLoading(false);
            }
        }
        if (widgetData != undefined) {
            setLoading(true);
            setCarusalData(initData);
            fetchData();
        }
    }, [widgetData]);


    let valuesDef = {
        "callType": name,
        "fromD": localData && localData.fromD ? localData.fromD : defaultFilteredData.from,
        "toD": localData && localData.toD ? localData.toD : defaultFilteredData.to,
        "coeExternalIds": localData && localData.coe ? localData.coe : defaultFilteredData.externalIds,
        "dashboardWidget": doubleCarouselData[0][0].wgt_type,
        "dashboardWidgetScore": Object.keys(apilist || {}),
        "momentBucketId": momentData
    }

    useEffect(() => {
        async function fetchData() {
            try {
                if (Object.keys(apilist).length) {
                    const res = await dashboardService.getWidgetData(valuesDef)
                    let respFormat = {};
                    let listEntities = Object.entries(apilist);
                    await (res?.data.data || []).map(x => {
                        let item = listEntities.find(y => (y[1] === x.header));
                        x.header && item && (respFormat[item[0]] = { data: x.widgetsDataResponses, url: x.url })
                    });
                    await setCarusalData({ ...initData, ...respFormat });
                    setLoading(false);                   
                }
            } catch (err) {
                setLoading(false);
            }
        }
        if (props.widgetData == undefined) {
            setCarusalData(initData);
            setLoading(true);
            fetchData();
        }
    }, [localData.fromD, localData.toD]);

    useEffect(() => {
        let listKeys = Object.keys(apilist);
        let isDataNotAvailable = listKeys.filter(key => !carusalData[key]);
        async function fetchData() {
            try {
                let valuesDef = {
                    "callType": name,
                    "fromD": localData && localData.fromD ? localData.fromD : defaultFilteredData.from,
                    "toD": localData && localData.toD ? localData.toD : defaultFilteredData.to,
                    "coeExternalIds": localData && localData.coe ? localData.coe : defaultFilteredData.externalIds,
                    "dashboardWidget": doubleCarouselData[0][0].wgt_type,
                    "dashboardWidgetScore": isDataNotAvailable,
                    "momentBucketId": momentData
                }
                const res = await dashboardService.getWidgetData(valuesDef)
                let respFormat = {};
                let listEntities = Object.entries(apilist);
                await (res?.data.data || []).map(x => {
                    let item = listEntities.find(y => (y[1] === x.header));
                    x.header && item && (respFormat[item[0]] = { data: x.widgetsDataResponses, url: x.url })
                });
                await setCarusalData({ ...carusalData, ...respFormat });
                setLoading(false);                
            } catch (err) {
                setLoading(false);
            }
        }
        if (isDataNotAvailable.length) {
            setLoading(true);
            fetchData();
        }
    }, [apilist]);

    const handleDoubleCarl = (currentItem) => {
        let result = [];
        let wgtCodeList = doubleCarouselData.flatMap((x) => x);

        (wgtCodeList || []).forEach((x, i) => {
            let wigStartAt = (currentItem.index) * 2;
            if (i >= wigStartAt && i < wigStartAt + 8) {
                result.push([x.wgt_code, x.wgt_name]);
            }
        });

        setApiList(result.reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {}));
    };

    const myArrow = ({ type, onClick }) => {
        const pointer = type === consts.PREV ? '❮' : '❯'
        return (
            <button onClick={onClick} disabled={loading} className="doubleCarousel-arrows" >
                {pointer}
            </button>
        )
    }

    return (
        <Carousel onChange={handleDoubleCarl} pagination={false} itemsToShow={4} itemsToScroll={4} width={100} className="ps-0"
            {...loading ? { renderArrow: myArrow } : {}}
        >
            {doubleCarouselData
                ? doubleCarouselData.map((row, index) => {
                    return (
                        <DoubleCarousel
                            row={row}
                            key={index}
                            carusalData={carusalData}
                            showDetailModal={showDetailModal}
                            widgetData={widgetData}
                            defaultFilteredData={defaultFilteredData}
                            name={name}
                            loading={loading}
                        />
                    );
                })
                : ""}
        </Carousel>
    );
};
export default React.memo(DoubleCarouselManager);
