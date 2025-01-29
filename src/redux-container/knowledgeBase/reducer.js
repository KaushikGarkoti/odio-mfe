import {DOC_EDIT_DATA, CLEAR_DOC_EDIT_DATA,MOMENTS_DATA,CLEAR_MOMENT_DATA} from './type'

const initialState = {
    editDocData:{},
    momentData:[]
}

const knowledgeBaseReducer = (state=initialState, action)=>{
    switch(action.type){
        case DOC_EDIT_DATA : {
            return{
                ...state,
                editDocData : action.payload
            }
        }
        case CLEAR_DOC_EDIT_DATA: {
            return {
                ...state, 
                editDocData : action.payload
            };
        }
        case MOMENTS_DATA:{
            return {
                ...state, 
                momentData : action.payload
            };
        }
        case CLEAR_MOMENT_DATA:{
            return {
                ...state, 
                momentData : action.payload
            };
        }
        default: {
            return state;
        }
    }
}

export default knowledgeBaseReducer