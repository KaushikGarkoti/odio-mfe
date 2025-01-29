import { ADD_CLIENT, ADD_CONTACTS } from "../type";

const companySettingsReducer = (state={}, action) => {
    if(action.type){
        switch (action.type) {
            case ADD_CLIENT:
                    return {...state}
            case ADD_CONTACTS:
                    return {...state}
            default:
                  return state;
                
            }
        }
    }

export default companySettingsReducer;