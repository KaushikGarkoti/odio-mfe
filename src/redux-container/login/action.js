import { conversionFormat, USER_PERMISSIONS } from '../../Constants/constant';
import { SET_USER_DETAILS, SIGN_IN, REQUEST_SUCCESS, SET_LOADER, SIGN_OUT, SET_USER_PERMISSION,REQUEST_FAILURE} from './types'
import { history } from "../store";
import {
    AUTHENTICATED,
    ACCESS_TOKEN, 
    USER_DETAIL
  } from "../../Constants/constant";
import { apiCall } from '../../Components/Services/Interceptor';
import userServices from '../../Components/Services/user.service';
import toaster from '../../Components/Toast/toaster';
import { clearPeristedStore } from '../insights/action';

export const getPermissions = (data) => async(dispatch) =>{
   
    let promise =   userServices.getUserPermissions() 
    promise.then((res) =>{
            localStorage.setItem(USER_PERMISSIONS, JSON.stringify(res.data.data));
            dispatch({type: SET_USER_PERMISSION, payload: res.data.data})
            localStorage.setItem(AUTHENTICATED, JSON.stringify(true));
            dispatch({type: SIGN_IN, payload: data});
            history.push('./home');
            dispatch({ type: REQUEST_SUCCESS, payload: true });
    })
}

export const signIn = (data) => async (dispatch) => {
    dispatch({ type: SET_LOADER, payload: true });
    await apiCall.post('/odio/api/authenticate', data)  
    .then(async (response) => {
               if(response && response.data.status === 0){
               const user = response.data.data;
               localStorage.setItem(ACCESS_TOKEN, response.data.data.jwtToken);
             
               var routings = await apiCall.get('/odio/api/permissions/user-module-permissions/permission').then((res)=>{return res.data.data})
               var timeFormat = await apiCall.get('odio/api/client/get-calendar-config').then((res)=>{ return res.data.data.filter((val)=>val.key == "DATE_FORMAT")[0].value})
               let promise =   userServices.getUserPermissions()
               promise.then(async (res) =>{
                    dispatch({type: SET_USER_PERMISSION, payload: res.data.data})
                    dispatch({type: SIGN_IN, payload: response.data.data});
                     if(user.userRole != 'AGENT'){
                        history.push(user.accountType=='SUPPORT'?'./support_dashboard':'./sales_dashboard');
                        localStorage.setItem(USER_PERMISSIONS, JSON.stringify(res.data.data));
                        localStorage.setItem(USER_DETAIL, JSON.stringify(user));
                        localStorage.setItem(AUTHENTICATED, JSON.stringify(true));
                        localStorage.setItem(ACCESS_TOKEN, response.data.data.jwtToken);
                        localStorage.setItem("ROUTING_PERMISSIONS",JSON.stringify(routings))
                        localStorage.setItem("TIME_FORMAT", JSON.stringify(timeFormat && conversionFormat[timeFormat] || { format: 'dd/MM/yy', value: "DD-MM-YYYY" }))
                        window.location.reload();
                     }
                    else{
                        var coeID = await apiCall.get("/odio/api/coe/get/coes/").then((res)=>{return res?.data?.data[0]?.coeId})
                        localStorage.setItem("coeId", JSON.stringify(coeID));
                        let routingPermission = JSON.parse(localStorage.getItem("ROUTING_PERMISSIONS"))
                        history.push(user.accountType=='SALES'? !routingPermission?.Conversations ? './coaching_user_stats' : (routingPermission?.Conversations.length > 1 ? './voice' : './sales_conversations') :'./support_conversations');
                        localStorage.setItem(USER_PERMISSIONS, JSON.stringify(res.data.data));
                        localStorage.setItem(USER_DETAIL, JSON.stringify(user));
                        localStorage.setItem(AUTHENTICATED, JSON.stringify(true));
                        localStorage.setItem(ACCESS_TOKEN, response.data.data.jwtToken);
                        localStorage.setItem("ROUTING_PERMISSIONS",JSON.stringify(routings));
                        localStorage.setItem("TIME_FORMAT", JSON.stringify(timeFormat && conversionFormat[timeFormat] || { format: 'dd/MM/yy', value: "DD-MM-YYYY" }))
                        window.location.reload();
                     }
                    dispatch({ type: REQUEST_SUCCESS, payload: true });
               })
            }
        }).catch((error)=>{
            toaster.error(error?.response?.data?.message);
        }).finally(()=>{
            dispatch({ type: REQUEST_FAILURE, payload: false });
        })
}

export const setUserDetails = (data) => (dispatch) =>{
   dispatch({ type: SET_USER_DETAILS, payload:data});
}

export const setUserPermissions = (data) => (dispatch) =>{
    dispatch({ type: SET_USER_PERMISSION, payload:data});
 }

export const logout = (auth) => {
    return async (dispatch) => {
        if (auth) {
            try {
                await apiCall.post('/odio/api/logout');
                localStorage.clear();
                sessionStorage.clear();
                dispatch({ type: SIGN_OUT, payload: false });
                clearPeristedStore(dispatch)
                document.title = "Login - Odio";
                history.push("./login");
            } catch (error) {
                console.error("Logout failed:", error);
                localStorage.clear();
                sessionStorage.clear();
                dispatch({ type: SIGN_OUT, payload: false });
                document.title = "Login - Odio";
                history.push("./login");
            }
        }
    };
};

// export const header = (data)=>(dispatch)=>{
//     dispatch({type: HEADER, payload:data})
// }
