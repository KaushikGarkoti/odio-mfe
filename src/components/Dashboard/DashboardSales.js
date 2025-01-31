import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import dashboardService from "@services";
import Dashboards from "./DashboardSales/SalesDashboard/Dashboards"
import { USER_DETAIL } from "@constants";
//import NodataFound from "../Commons/NoDataFound";
import Loading from "./Loading"

export default function DashboardSales() {

	const [loader, setLoader] = useState()
	const [dasboardStructure, setDasboardStructure] = useState([])

	//var dasboardStructure
	function getDashboardSt() {
		var p = localStorage.getItem(USER_DETAIL)
		let data = JSON.parse(p);
		let val = { "clientExternalId": data.externalId, "entityType": "SALES" }
		if (p?.userRole != 'AGENT') {
			dashboardService.getDashboard(val).then(res => {
				setDasboardStructure(res ? res.data.data : '');
				setLoader(false)
			})
			.catch(err => console.log(err))
		}
	}
	useEffect(() => {
		setLoader(true)
		document.title = "Dashboard";
		getDashboardSt()
	}, [])

	return (
		<>
			{loader ? (
				<div className="loader-container">
					<Loading variant="light" />
				</div>
			) :
				dasboardStructure.length > 0 ? <Dashboards dasboardStructure={dasboardStructure} name={"SALES"} /> : <h2>No Data found</h2>
			}
		</>
	);
}
