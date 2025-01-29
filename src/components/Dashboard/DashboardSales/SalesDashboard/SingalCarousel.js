import React from "react";
import { Card, Col, OverlayTrigger, Popover } from "react-bootstrap"
import Loading from "../../Loading";
import ApexChart from "../../../Graphs/ApexChart";
import { useHistory } from "react-router-dom";

const SingalCarousel = (props) => {
    let { carusalData, loader, showDetailModal, wgt_data } = props;
    const history = useHistory()

    function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        

        var hDisplay = h > 0 ? h : "";
        var mDisplay = m > 0 ? m : "";
        var sDisplay = s > 0 ? s : "";
        
        return (
            <>
            {hDisplay !== "" ? <span>{hDisplay}<span style={{ fontSize: "12px" }}>{h == 1 ? " hr " : " hrs "}</span></span> : "" }
            {mDisplay !== "" ? <span>{mDisplay}<span style={{ fontSize: "12px" }}>{m == 1 ? " min " : " mins "}</span></span> : ""}    
            {sDisplay !== "" ? <span>{sDisplay}<span style={{ fontSize: "12px" }}>{s == 1 ? " sec" : " secs"}</span></span> : ""}
            </>
        )
    }

    const sendToCalls = () =>{
        const permission = JSON.parse(localStorage.getItem("USER_PERMISSIONS"))
        permission.some(item => item.api === '/voice_detail') ? history.push('/voice') : history.push(`/sales_conversations`)
    }

    const popoverr = (des) => (
        <Popover id="popover-trigger-click-root-close" title="right" style={{ "marginLeft": "13px" }}>
            <h3 className="popover-header" style={{ background: 'white', color: 'black' }}>
                {des}
            </h3>
        </Popover>
    )

    return (
        <>
            <Col className="w-100" style={{ borderRight: '1px dashed #cccccc' }}>
                <Card className="bg-transparent shadow-none mb-0" >
                    <Card.Body className="text-center px-1">
                        <Card.Title style={{ display: "flex" }}>
                            <p className="mb-1 text-dark font-14 carusal-data" style={{cursor:'pointer', color: 'white'}} onClick={()=>sendToCalls()}>{wgt_data.wgt_name}&nbsp;
                            </p>
                            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverr(wgt_data.wgt_des)} rootClose>
                                <i className="fadeIn animated bx bx-info-circle text-primary-blue" style={{ fontSize: "0.9rem" }}></i>
                            </OverlayTrigger>
                        </Card.Title>
                        <Card.Text className="carusal-data" style={{ width: "85%" }}>
                            <Card.Link id="dash-single-widget-value" className="font-22 text-dark lh-1" style={{cursor:'pointer'}} onClick={() => showDetailModal(wgt_data)}>
                                {(carusalData && !loader) &&
                                    (((wgt_data || {}).wgt_code == 'TOTAL_DURATION' && ((carusalData || {}).data[0] || {}).result) ?
                                        secondsToHms(carusalData.data[0].result) :
                                        (carusalData?.data[0]?.result ?
                                            ((carusalData?.data[0]?.result % 1) !== 0 ?
                                                carusalData.data[0]?.result?.toFixed(2) :
                                                carusalData?.data[0]?.result) :
                                            '0'))}
                                {loader && <div className="dashboard-loder"><Loading /></div>}
                                {!carusalData && !loader && "0"}
                                <span className="font-12">{carusalData && !loader ? wgt_data?.wgt_code == 'TOTAL_DURATION' ? '' : carusalData?.data[0]?.type ? carusalData.data[0].type : ' ' : ''}</span>
                            </Card.Link>
                            {(carusalData && carusalData.data && carusalData.data[0]) ?
                                 <ApexChart graphKey={wgt_data.wgt_code} carusalData={carusalData.data[0].colour ? carusalData?.data[0].colour === 'amber' ? '#ffc107' : carusalData.data[0].colour === 'default' ? '#D3D3D3' : carusalData.data[0].colour : '#D3D3D3'} graphVal={carusalData.data[0].drillDown}/> : ''}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}

export default SingalCarousel;