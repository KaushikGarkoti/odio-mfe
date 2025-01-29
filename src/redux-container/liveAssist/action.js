import { GET_LIVE_DATA, SET_FILTERED_PROMPT, SET_INTIAL_STATE } from "./type"

export const setInitialState = ()=>{
    return((dispatch)=>{
        dispatch({type:SET_INTIAL_STATE})
    })
}
export const setLiveData = (data)=>{
    return((dispatch)=>{
        dispatch({type:GET_LIVE_DATA, payload:data})
    })
}

export const setFilteredPrompts = (data)=>{
    return((dispatch)=>{
        dispatch({type:SET_FILTERED_PROMPT, payload:data})
    })
}