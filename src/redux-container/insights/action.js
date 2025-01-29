import conversationService from "../../Components/Services/conversation.service"

export const setMoments = (momentId) => async(dispatch) => {
    conversationService.getCallListingMoments("SALES",momentId)
    .then((res) => {
        dispatch({type: 'SET_MOMENTS', payload: res?.data?.data})
    })
}

export const setUserOptions = (data) => {
    return((dispatch)=>{
        dispatch({type: 'SET_USER_OPTIONS', payload: data})
    })
}

export const setDateList = (data)=>{
    return((dispatch)=>{
        dispatch({type: 'SET_DATE_LIST',payload:data})
    })
}

export const dataMoment = (data)=>{
    return((dispatch)=>{
        dispatch({type: 'SET_MOMENT_DATA', payload:data})
    })
}

export const dataMomentGroup = (data)=>{
    return((dispatch)=>{
        dispatch({type: 'SET_MOMENT_GROUP_DATA', payload:data})
    })
}

export const applyFilterData = (data)=>{
    return((dispatch)=>{
        dispatch({type: 'SET_FILTER_DATA', payload:data})
    })
}

export const setChips = (data)=>{
    return((dispatch)=>{
        dispatch({type: 'SET_CHIPS', payload:data})
    })
}

export const onResetFilter = (data)=>{
    return((dispatch)=>{
        dispatch({type: 'ON_RESET_FILTER', payload:data})
    })
}

export const setResetState = (data)=>{
    return((dispatch)=>{
        dispatch({type: 'SET_RESET_STATE', payload:data})
    })
}

export const clearPeristedStore = (dispatch)=>{
    dispatch({type: 'CLEAR_PERSISTED_STORE'})
}