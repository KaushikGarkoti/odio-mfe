import conversationService from "../../Components/Services/conversation.service"
import { GET_CALL_LISTING, SET_LOADER, LIST_NOT_FOUND } from "./type"
import history from "../../redux-container/store";

export const getCallList = ()=>async(dispatch)=>{
    dispatch({type:SET_LOADER})
    await conversationService
    .getCallListing()
    .then((res)=>{
        dispatch({type:GET_CALL_LISTING,payload:res.data.response})
    })

}