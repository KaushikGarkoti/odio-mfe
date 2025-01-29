import React from "react"
import { Card, Col, Popover, OverlayTrigger } from "react-bootstrap"
import "./Seller.css"
import Loading from "../../Loading"
import { useHistory } from "react-router-dom"


export default function Seller(props) {
  let sellerData = props.data.data;
  let scroll = props.scroll;
  const history = useHistory()
  const viewAllHandler = () => {
    history.push(`/team?from=${props.widgetData?.from == undefined ? props.defaultFilteredData?.from : props.widgetData?.from}&to=${props.widgetData?.to == undefined ? props.defaultFilteredData?.to : props.widgetData?.to}&column=callScore&order=${props.wgt_data.wgt_code == 'TOP_CALLERS' ? "DESC" : "ASCE"}`)
  }

  const viewHandler = (userId, agentExternalId, phone) => {
    history.push(`/team_member_detail?id=${userId}&agentExternalId=${agentExternalId}&phone=${phone}&from=${props.widgetData?.from == undefined ? props.defaultFilteredData?.from : props.widgetData?.from}&to=${props.widgetData?.to == undefined ? props.defaultFilteredData?.to : props.widgetData?.to}`)
  }

  const popoverr = () => (
    <Popover id="popover-trigger-hover-focus" title="right">
      <h3 className="popover-header" style={{ fontSize: "14px", textAlign: "center" }}>{props.wgt_data.wgt_des}</h3>
    </Popover>
  )


  return (
    <>
      <Col xs={props.width} className="d-flex">
        <Card className="radius-10 w-100 call-duration-chart-box">
          <Card.Body className="px-0">
            <div className="d-flex align-items-center px-3 pb-2">
              <h6 className="font-weight-bold mb-0">{props.wgt_data.wgt_name ? props.wgt_data.wgt_name : ''}</h6>
              <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverr()} rootClose>
                <button className="mb-0 ms-3" style={{ border: "none", backgroundColor: "white", marginTop: "1px" }}>
                  <i className="fadeIn animated bx bx-info-circle text-primary-blue"></i>
                </button>
              </OverlayTrigger>
              <p className="mb-0 ms-auto view-all-agents-btn" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <i onClick={viewAllHandler} className="bx bx-link-external ms-1 me-0 my-0" title="View All" style={{cursor: 'pointer', color: '#0077b6', fontSize: '1rem'}}></i>
              </p>
            </div>
            <div className="dashboard-top-sellers px-3">
              {!scroll ? ((sellerData || []).length > 0 ? sellerData.map((data) => {
                var shortName = data.agentName.split(' ')
                shortName = shortName.length > 1 ? shortName.shift().charAt(0) + shortName.pop().charAt(0) : shortName.pop().charAt(0);
                shortName = shortName.toUpperCase();
                return (
                  <>
                    <div className="d-flex align-items-center dashboard-top-seller-card mt-3" key={data.agent}>
                      <p className="seller-avatat">{
                        shortName ? shortName : '_'}</p>
                      <div className="flex-grow-1 ms-3 user-name-email">
                        <p className="font-weight-bold top-seller-name mb-0">{data.agentName ? data.agentName : '_'}</p>
                        <p className="text-secondary mb-0 user-email">{data.agentEmail}</p>
                      </div>
                      <a
                        onClick={() => { viewHandler(data.userId, data.agent, data.phone) }}
                        target="_blank"
                        className="btn btn-sm btn-outline-primary radius-10"
                      >
                        View
                        <i className="ms-1 me-0 my-0 bx bx-link-external f12"></i></a>
                    </div>
                    <hr></hr>
                  </>
                );
              }) : '') : <div className="loader-container dashboard-loder sellers-loader"><Loading /></div>}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
