import toast from "../components/Toast/toaster";
import { apiCall } from '@utils';
import {
    GET_MOMENT_BUCKETS,
    CREATE_MOMENT_GROUP,
    CREATE_MOMENT_BUCKET,
    UPDATE_MOMENT_GROUP,
    CREATE_MOMENT,
    UPDATE_MOMENT,
    CREATE_MENTION
} from '@constants'


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

export default{
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
      deleteMoment
}

