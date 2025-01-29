import { apiCall } from "@utils";
import {CREATE_DASHBOARD, GET_WIDGET_DATA, GET_WIDGET_SIGNAL, GET_DATE_ACRONYM, GET_USER_COE_LIST, GET_GRAPH_ACRONYM} from '@constants'


const getDashboard = async (val) => {
    const response = await apiCall.get(CREATE_DASHBOARD, val);
    return response;
}

const getWidgetData = async (val) => {
    const response = await apiCall.post(GET_WIDGET_DATA, val);
    return response;
}

const getWidgetSignal = async(val)=>{
    const response = await apiCall.post(GET_WIDGET_SIGNAL,val)
    return response
}

const getDateAcronym = async () => {
      const response = await apiCall.get(GET_DATE_ACRONYM);
      return response;
}

const getGraphAcronym = async (val) => {
    const response = await apiCall.get(GET_GRAPH_ACRONYM+val);
    return response;
}

const getMomentCOEList = async (id) => {
    const GET_MOMENT_COE_LIST = `/odio/api/coe/get/coes/?momentBucketId=${id}`;
    const response = await apiCall.get(GET_MOMENT_COE_LIST);
    return response;
}

const getUserCOEList = async () => {
    const response = await apiCall.get(GET_USER_COE_LIST);
    return response;
}


export default {
    getDashboard,
    getWidgetData,
    getWidgetSignal,
    getDateAcronym,
    getMomentCOEList,
    getUserCOEList,
    getGraphAcronym,
};
