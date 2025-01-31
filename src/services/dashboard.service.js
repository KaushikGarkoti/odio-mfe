import { apiCall } from "@utils";
import {CREATE_DASHBOARD, GET_WIDGET_DATA, GET_WIDGET_SIGNAL, GET_DATE_ACRONYM, GET_USER_COE_LIST, GET_GRAPH_ACRONYM} from '@constants'


const getDashboard = async (val) => {
    try {
      const response = await apiCall.get(CREATE_DASHBOARD, val);
      return response;
    } catch (error) {
      return null; 
    }
};
  
  const getWidgetData = async (val) => {
    try {
      const response = await apiCall.post(GET_WIDGET_DATA, val);
      return response;
    } catch (error) {
      return null;
    }
};
  
  const getWidgetSignal = async (val) => {
    try {
      const response = await apiCall.post(GET_WIDGET_SIGNAL, val);
      return response;
    } catch (error) {
      return null;
    }
};
  
  const getDateAcronym = async () => {
    try {
      const response = await apiCall.get(GET_DATE_ACRONYM);
      return response;
    } catch (error) {
      return null;
    }
  };
  
  const getGraphAcronym = async (val) => {
    try {
      const response = await apiCall.get(`${GET_GRAPH_ACRONYM}${val}`);
      return response;
    } catch (error) {
      return null;
    }
};
  
  const getMomentCOEList = async (id) => {
    try {
      const GET_MOMENT_COE_LIST = `/odio/api/coe/get/coes/?momentBucketId=${id}`;
      const response = await apiCall.get(GET_MOMENT_COE_LIST);
      return response;
    } catch (error) {
      return null;
    }
};
  
  const getUserCOEList = async () => {
    try {
      const response = await apiCall.get(GET_USER_COE_LIST);
      return response;
    } catch (error) {
      return null;
    }
};
  

export default {
    getDashboard,
    getWidgetData,
    getWidgetSignal,
    getDateAcronym,
    getMomentCOEList,
    getUserCOEList,
    getGraphAcronym,
};
