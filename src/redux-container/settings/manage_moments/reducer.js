import {ADD_MOMENT, DELETE_MOMENT} from '../type';

const manageMomentReducer = (state={}, action) => {
    if(action.type){
        switch (action.type) {
            case ADD_MOMENT:
                 return {
                     ...state,
                      users : action.payload}
            case DELETE_MOMENT:
                 return {...state}
            default:
                 return state;
                
            }
        }
    }

export default manageMomentReducer;