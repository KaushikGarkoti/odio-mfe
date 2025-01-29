import { GET_LIVE_DATA, SET_FILTERED_PROMPT, SET_INTIAL_STATE } from "./type"

const initialState = {
    callData:{},
    liveCallData:{},
    prompts:[],
    prompts_webView:[]
}

const mergeData = (existingData, newData) => {
    const updatedData = { ...existingData };
    Object.keys(newData).forEach(key => {
        if (Array.isArray(newData[key])) {
            updatedData[key] = mergeArray(existingData[key] || [], newData[key]);
        } else {
            updatedData[key] = newData[key];
        }
    });
    return updatedData;
    
};

// Helper function to merge arrays based on a unique key (e.g., `moment`)
const mergeArray = (oldArray = [], newArray = []) => {
    const map = new Map();
    oldArray.concat(newArray).forEach(item => map.set(item.moment, item));
    return Array.from(map.values());
};

const liveAssistReducer = (state=initialState, action)=>{
    switch(action.type){
        case GET_LIVE_DATA : {
            const newLiveData = action.payload;
            return {
                ...state,
                liveCallData: mergeData(state.liveCallData, newLiveData),
            };
        }
        case SET_FILTERED_PROMPT : {
            return{
                ...state,
                prompts: [...(state.prompts || []), action.payload],
                prompts_webView: action.payload
            }
        }
        case SET_INTIAL_STATE : {
            return {
                callData:{},
                liveCallData:{},
                prompts:[],
                prompts_webView:[]
            }
        }
        default:{
            return state
        }
    }
}

export default liveAssistReducer