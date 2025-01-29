const initialState = {
    moments: [],
    userOptions : [],
    dateList : [],
    momentList : [],
    momentGroupList : [],
    filterData : [],
    chipsData:[],
    reset: false
}

const insightsReducer = (state=initialState, action)=>{
    switch(action.type){
        case 'SET_MOMENTS' : {
            const transformedData = action.payload.map(moment => ({
                displayName: moment?.momentName,
                value: moment?.momentId
            }))
            return({
                ...state,
                moments : transformedData
            })
        }
        case 'SET_USER_OPTIONS' : {
            return({
                ...state,
                userOptions : action.payload
            })
        }
        case 'SET_DATE_LIST' : {
            return({
                ...state,
                dateList: action.payload
            })
        }
        case 'SET_MOMENT_DATA':{
            return{
                ...state,
                momentList : action.payload
            }
        }
        case 'SET_MOMENT_GROUP_DATA':{
            return{
                ...state,
                momentGroupList : action.payload
            }
        }
        case 'SET_FILTER_DATA' : {
            return({
                ...state,
                filterData: action.payload
            })
        }
        case 'SET_CHIPS':{
            return{
                ...state,
                chipsData: action.payload
            }
        }
        case 'ON_RESET_FILTER':{
            return{
                ...state,
                filterData: action.payload,
               
            }
        }
        case 'SET_RESET_STATE':{
            return{
                ...state,
                reset: action.payload
            }
        }
        case 'CLEAR_PERSISTED_STORE':{
            return{
                ...state,
                userOptions : [],
                dateList : [],
                momentList : [],
                momentGroupList : [],
                filterData : [],
                reset: false

            }
        }
        case 'persist/REHYDRATE': {
            return {
                ...state,
                ...action?.payload?.insights,
            };
        }
        default : {
            return({
                ...state
            })
        }
    }
}

export default insightsReducer