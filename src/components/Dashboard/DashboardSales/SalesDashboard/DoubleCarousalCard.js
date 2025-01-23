import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap"
import Loading from "../../../Commons/Loading";


export default function DoubleCarouselCard(props) {
    let { carusalData, loader } = props;
    const icon = carusalData.url;

    const popoverr = (name) => (
        <Popover id="popover-trigger-click-root-close" title="right" style={{ "marginLeft": "13px" }}>
            <h3 className="popover-header" >{name}</h3>
        </Popover>
    )

    return (
        <div className="d-flex my-2 align-items-center dasboard-card-widgets radius-10" onClick={() => props.showDetailModal(props.data)} style={{ cursor: 'pointer', marginLeft: '1px' }}>
           <div className="w-75" >
                <p className="mb-0" style={{color:'black'}}>{props.data.wgt_name}</p>
                <h5 className="mb-0" id="dash-double-widget-value">{
                (carusalData && !loader) && (carusalData.data[0] ? (`${carusalData.data[0].result ? carusalData.data[0].result.toFixed(2) : '0'}${carusalData.data[0].type ? carusalData.data[0].type : '0'}`) : '0')}
                    {loader && <div className="dashboard-loder" style={{ width: '1.5rem', height: '1.5rem' }} ><Loading /></div>}{!carusalData && !loader && "0"}</h5>
                    
            </div>
            {/* <div className="w-75" >
                <p className="mb-0">{props.data.wgt_name}</p>
                <h5 className="mb-0">
                    {(carusalData && !loader ?
                 carusalData.data[0] ?
                 `${carusalData.data[0].result ? carusalData.data[0].result.toFixed(2) : '0'}
                 ${carusalData.data[0].type ? carusalData.data[0].type : '0'}` : '0' :
                  <div className="dashboard-loder" style={{ width: '1.5rem', height: '1.5rem' }} >
                    <Loading />
                    </div>)}
                    </h5>
            </div> */}

            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverr(props.data.wgt_des)} rootClose>
                <i className="mb-0 ms-0 fadeIn animated bx bx-info-circle text-primary-blue" style={{ marginTop: '-3.5em',marginLeft: '10px' }}></i>
            </OverlayTrigger>
            <div className="widgets-icons ms-auto">
                <img src={icon} alt=""></img>
            </div>
        </div>
    )
}