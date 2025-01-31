import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import dashboardService from "@services";
import Dashboards from "./DashboardSales/SalesDashboard/Dashboards"
import { USER_DETAIL } from "@constants";
import Loading from "./Loading"

export default function DashboardSupport() {
	const [loader, setLoader] = useState()

	function getDashboardSt() {
		var p = localStorage.getItem(USER_DETAIL)
		let data = JSON.parse(p);
		var val = { "clientExternalId": data.externalId, "entityType": "SUPPORT" }
		dashboardService.getDashboard(val).then(res => {
			setDasboardStructure(res ? res?.data?.data : '');
			setLoader(false)
		})
	}


	useEffect(() => {
		setLoader(true)
		document.title = "Dashboard";
		getDashboardSt()
	}, [])

	const [dasboardStructure, setDasboardStructure] = useState([])

	return (<>
		{loader ? (
			<div className="loader-container">
				<Loading variant="light" />
			</div>
		) :
			dasboardStructure ? <Dashboards dasboardStructure={dasboardStructure} name={"SUPPORT"} /> : ''
		}</>
	);
}
