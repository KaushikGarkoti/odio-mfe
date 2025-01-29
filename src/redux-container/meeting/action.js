export const setDateList = (data)=>{
    return((dispatch)=>{
        dispatch({type: 'SET_DATE_LIST',payload:data})
    })
}

export const applyFilterData = (data)=>{
    return((dispatch)=>{
        dispatch({type: 'SET_FILTER_DATA', payload:data})
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

export const clearMeetingState = ()=>{
    return((dispatch)=>{
        dispatch({type:'CLEAR_MEETING_STATE'})
    })
}