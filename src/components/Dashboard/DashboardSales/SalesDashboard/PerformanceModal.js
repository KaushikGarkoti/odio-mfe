import React from 'react';
import {Accordion, Modal, Table } from "react-bootstrap";
import './Seller.css'
import Loading from "../../Loading";

export default function PerformanceModal(props){
    return(
        <Modal id="moment-performance-modal" show={props.show} >
                <Modal.Header>
                    <h5>{props?.name}</h5>
                    <button type="button" className="btn-close" onClick={props.closeButton}></button>
                </Modal.Header>
                <Modal.Body>
                {props.loader ? (
                    <div className="loader-container">
                    <Loading variant="dark" />
                    </div>):
                    <div className="table-responsive moment-list-group-scroll moment-group-table">
                        <Table className="mb-0">
                            <thead className="fixed-header-table">
                                <tr>
                                    <th style={{paddingLeft:'30px'}}>Name</th>
                                    <th className="text-center" style={{paddingLeft:'20px'}}>Averages</th>
                                </tr>
                            </thead>
                            <tbody>
                            {props.name==='Moments Performance'?Object.keys(props.moments).map((item,i)=>{
                                return( 
                                <tr key={i}>
                                    <td colSpan="2" className="moment1">
                                    <Accordion defaultActiveKey='1'>
                                        <Accordion.Item eventKey={item}>
                                            <Accordion.Header className="parent-icon bg-light-blue">
                                                {item}
                                            </Accordion.Header>
                                            <Accordion.Body>
                                            <Table className="mb-0">
                                            <tbody>
                                            {
                                                props.moments[item].map((mom,momIndex) => {
                                                    return(
                                                    <tr key={momIndex}>
                                                        <td style={{width:'50%'}}>
                                                            <a className="font-weight-bold mb-0" type="button">{mom.moment}</a>
                                                        </td>
                                                        <td className="text-center" >
                                                            <span className="badge rounded-pill btn btn-outline-danger font-normal" style={{width:'17%'}}>{mom.result?`${mom.result}%`:"0%"}</span>
                                                        </td>
                                                    </tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                            </Table>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                    </td>
                                </tr>
                            )
                            })
                            :props.name==='Stats Performance'?props?.signals.map((item,i)=>{
                                return(<>
                                        <tr key={i}>
                                            <td>
                                                <a className="font-weight-bold mb-0" type="button">{item.signal}</a>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge rounded-pill btn btn-outline-danger font-normal">{item.result?`${item.result}%`:"0%"}</span>
                                            </td>
                                        </tr>
                                        </>
                                )
                            }):""}
                            </tbody>
                        </Table>
                    </div>}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn modal-close-button-btn" type="button" onClick={props.closeButton}>Close</button>
                </Modal.Footer>
            {/* </Modal.Dialog> */}
        </Modal>
    )
}