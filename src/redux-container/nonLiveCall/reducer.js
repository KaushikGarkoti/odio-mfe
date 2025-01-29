import {GET_SINGLE_CALL_DATA, SET_NON_LIVE_DATA} from './type'

const initialState = {
    singleCallData:[],
    nonLiveAssist:{}
}

const nonLiveReducer = (state=initialState, action)=>{
    switch(action.type){
        case GET_SINGLE_CALL_DATA : {
            return{
                ...state,
                singleCallData : action.payload  //data required to get socket_id, phnNumber, streamid is being stored here
            }
        }
        case SET_NON_LIVE_DATA: {
            const nonLiveData = action.payload?.nudges;
            return {
                ...state, 
                nonLiveAssist: nonLiveData,
                assistedUserDetail: action?.payload?.userDetail
            };
        }
        default: {
            return state;
        }
    }
}

export default nonLiveReducer