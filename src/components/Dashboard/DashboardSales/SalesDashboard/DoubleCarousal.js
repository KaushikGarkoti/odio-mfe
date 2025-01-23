import React from "react";
import { Card} from "react-bootstrap"
import DoubleCarouselCard from "./DoubleCarousalCard";

export default function DoubleCarousel(props) {

    const widgetDataType = (val) => {
        props.showDetailModal(val)
    }
    
    return (
        <>
            <Card className="w-100 mx-1 bg-transparent card-remover my-1" >
                <Card.Body className="p-0">
                    <div>
                        {props.row?.map((data, index) => {
                            return (
                                <DoubleCarouselCard carusalData={props.carusalData[data.wgt_code]} loader={props.loading && !props.carusalData[data.wgt_code]} key={index} data={data} showDetailModal={widgetDataType} widgetData={props.widgetData} defaultFilteredData={props.defaultFilteredData} name={props.name} />
                            );
                        })}
                    </div>
                </Card.Body>
            </Card>

        </>
    )
}