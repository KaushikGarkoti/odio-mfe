const initialState = {
    dateList : [],
    filterData : [],
    reset: false
}

const meetingsReducer = (state=initialState, action)=>{
    switch(action.type){
        case 'SET_DATE_LIST' : {
            return({
                ...state,
                dateList: action.payload
            })
        }
        case 'SET_FILTER_DATA' : {
            return({
                ...state,
                filterData: action.payload
            })
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
        case 'CLEAR_MEETING_STATE':{
            return{
                dateList : [],
                filterData : [],
                reset: false
            }
        }
        case 'persist/REHYDRATE': {
            return {
                ...state,
                ...action?.payload?.meetings,
            };
        }
        default : {
            return({
                ...state
            })
        }
    }
}

export default meetingsReducer
