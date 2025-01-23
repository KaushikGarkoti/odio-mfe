import React from 'react'
import { Modal, Table } from 'react-bootstrap'

export default function ComplianceView(props) {
    let data = props?.data
    let values = props?.values

  return (
    <Modal id="moment-performance-modal" show={props.show}>
        <Modal.Header>
            <h5>{props.name}</h5>
            <button type="button" className="btn-close" onClick={props.closeButton}></button>
        </Modal.Header>
        <Modal.Body>
            <div className="table-responsive moment-list-group-scroll moment-group-table">
                <Table className="mb-0">
                    <thead className="fixed-header-table">
                        <tr>
                            <th style={{paddingLeft:'30px'}}>Moment</th>
                            <th className="text-center" colSpan={3} style={{paddingLeft:'5%'}}>Moments Count</th>
                        </tr>
                        <tr>
                            <th style={{width:"55%"}}></th>
                            <th className="text-center">{props?.mon1}</th>
                            <th className="text-center">{props?.mon2}</th>
                            <th className="text-center">{props?.mon3}</th>
                            <th className="text-center">{props?.mon4}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((mom,index)=> 
                        <tr key={index}>
                            <td style={{paddingLeft:"13px"}}>{mom?.moment}</td>
                            {values && values[index]?.map((count,monthIndex)=>
                                <td key={monthIndex} className="text-center">
                                        <span className={`badge rounded-pill btn btn-outline-${count !== 0 ?'success' : 'danger'} font-normal`}>{count}</span>
                                </td>)
                            }
                        </tr>)}
                    </tbody>
                </Table>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <button className="btn modal-close-button-btn" type="button" onClick={props.closeButton}>Close</button>
        </Modal.Footer>
    </Modal>
  )
}
