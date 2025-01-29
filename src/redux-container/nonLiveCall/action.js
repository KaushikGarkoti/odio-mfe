import {GET_SINGLE_CALL_DATA, SET_NON_LIVE_DATA} from './type'


export const assistCallDetail = (data)=>{
    return((dispatch)=>{
        dispatch({type:GET_SINGLE_CALL_DATA, payload:data})
    })
}


export const setNonLiveData = (nudges, userDetail)=>{
    return((dispatch)=>{
        dispatch({ type: SET_NON_LIVE_DATA, payload:{nudges:nudges, userDetail:userDetail}})
    })
}