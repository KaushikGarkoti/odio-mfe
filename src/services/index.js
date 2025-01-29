import toast from "../components/Toast/toaster";
import { apiCall } from "@utils";
import {CREATE_DASHBOARD, GET_WIDGET_DATA, GET_WIDGET_SIGNAL, GET_DATE_ACRONYM, GET_USER_COE_LIST, GET_GRAPH_ACRONYM,   GET_MOMENT_BUCKETS,
    CREATE_MOMENT_GROUP,
    CREATE_MOMENT_BUCKET,
    UPDATE_MOMENT_GROUP,
    CREATE_MOMENT,
    UPDATE_MOMENT,
    CREATE_MENTION,
    PROFILE_GET, PROFILE_UPDATE, MY_TEAM, GET_MY_TEAM_CALLER, GET_MY_TEAM, GET_COACHING_TEAM
} from '@constants'


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





const createMomentBucket = async(data) =>{
    const response = await apiCall.post(CREATE_MOMENT_BUCKET, data);
    if(response.data.status!=1){
        toast.success(response.data.message)
    }
    else{
        toast.error(response.data.message)
    }
    return response;
}

const create_mentions = async(val) =>{
    const response = await apiCall.post(CREATE_MENTION, val);
    if(response.data.status===0){
        toast.success(response.data.message)
    }
    else{
        toast.error(response.data.message)
    }
    return response;
}

const delete_mentions = async(id) =>{
    const DELETE_MENTION = `/odio/api/mention/delete?mentionaId=${id}`;
    const response = await apiCall.put(DELETE_MENTION);  
    if(response.data.status===0){
        toast.success(response.data.message)
    }
    else{
        toast.error(response.data.message)
    }
    return response;
}

const getMomentBuckets = async (val) => {
    if(val){
        const response = await apiCall.get(`${GET_MOMENT_BUCKETS}?callType=${val}&isDashboard=true`);
        return response.data.data;
    }
    else{
        const response = await apiCall.get(GET_MOMENT_BUCKETS)
        return response.data.data;
    }
    
}

const getMomentData = async (id) => {
    const GET_MOMENT_DATA = `/odio/api/moment-bucket/get-moments?mentions=true&momentBucketId=${id}`
        const response = await apiCall.get(GET_MOMENT_DATA);
        return response.data.data.momentGroups;
}

const createMomentGroup = async(data) =>{
   const response = await apiCall.post(CREATE_MOMENT_GROUP, data);
    if(response.data.status===0){
        toast.success(response.data.message)
    }
    else{
        toast.error(response.data.message)
    }
   return response;
}

const updateMomentGroup = async(data) => {
    const response = await apiCall.put(UPDATE_MOMENT_GROUP, data);
    if(response.data.status===0){
        toast.success(response.data.message)
    }
    else{
        toast.error(response.data.message)
    }
    return response;
}

const deleteMomentGroup = async(id)=>{
    const DELETE_MOMENT_GROUP = `/odio/api/moment-group/delete?momentGroupId=${id}`;
    const response = await apiCall.put(DELETE_MOMENT_GROUP);
    if(response.data.status===0){
        toast.success(response.data.message)
    }
    else{
        toast.error(response.data.message)
    }
    return response;
}

const createMoment = async(data) =>{
    const response = await apiCall.post(CREATE_MOMENT, data);
    if(response.data.status===0){
        toast.success(response.data.message)
    }
    else{
        toast.error(response.data.message)
    }
    return response;
}

const updateMoment = async(data) =>{
    const response = await apiCall.put(UPDATE_MOMENT, data);
    if(response.data.status===0){
        toast.success(response.data.message)
    }
    else{
        toast.error(response.data.message)
    }
    return response;
}

const deleteMoment = async(Id) =>{
    const DELETE_MOMENT = `odio/api/moment/delete?momentId=${Id}`;
    const response = await apiCall.put(DELETE_MOMENT);
    if(response.data.status===0){
        toast.success(response.data.message)
    }
    else{
        toast.error(response.data.message)
    }
    return response;
}


const profile = async () => {
    return await apiCall.get(PROFILE_GET);
  };
  
  const managerProfile = async (id) => {
    return await apiCall.get(PROFILE_GET + "?userId=" + id);
  };
  
  const agentProfile = async(id)=>{
    return await apiCall.get(`${PROFILE_GET}?userId=${id}`)
  }
  
  const updateProfile = async (data) => {
    await apiCall
      .put(PROFILE_UPDATE, data)
      .then((response) => {
        if (response) {
          if (response.data.status === 200) {
            toast.success("Successfull");
          }
        }
        return response;
  })
  }
  
  const myTeam = async () => {
      const localData = JSON.parse(localStorage.getItem("AGENT"))
      const response = await apiCall.get(`${MY_TEAM}?fromD=${localData?.fromD?localData.fromD:null}&"toD"=${localData?.toD?localData.toD:null}&coeIds=${localData?.selectedCoeRange?localData?.selectedCoeRange:null}`);
      return response;
  }
  
  const getMyTeam = async (data) => {
      const response = await apiCall.post(GET_MY_TEAM,{"coeIds":data.coeIds,"fromD":data.fromD,"toD":data.toD, "userId": data.userId, "ahtValue": data.ahtValue});
      return response;
  }
  
  const getCoachingAgents = async (data) => {
    const response = await apiCall.post(GET_COACHING_TEAM,{"coeIds":data.coeIds,"fromD":data.fromD,"toD":data.toD, "userId": data.userId});
    return response;
  }
  
  const getMyTeamCaller = async (data) => {
    const response = await apiCall.post(GET_MY_TEAM_CALLER,{"coeIds":data.coeIds,"fromD":data.fromD,"toD":data.toD});
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
    getMomentBuckets,
    createMomentBucket,
    create_mentions,
    delete_mentions,
    createMomentGroup,
    deleteMomentGroup,
    updateMomentGroup,
    getMomentData,
    createMoment,
    updateMoment,
    deleteMoment,
    profile,
    managerProfile,
    agentProfile,
    updateProfile,
    myTeam,
    getMyTeam,
    getCoachingAgents,
    getMyTeamCaller
};
