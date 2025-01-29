import { SET_USER_DETAILS, SIGN_IN, SIGN_OUT, REQUEST_SUCCESS,  REQUEST_FAILURE, SET_LOADER, SET_USER_PERMISSION, SET_USERNAME} from './types';

const initialSignInState = {
    loggedIn: false,
    loader: false,
    abc: true,
    clientLogo: '',
    clientName: '',
    userFirstName: '',
    accountType:'',
    headerShow:true
}

const loginReducer = (state = initialSignInState, action) => {
if(action.type){
    switch (action.type) {
        case SET_LOADER:
              return {
                    loader: true,
                }
        case SIGN_IN:
            return{
                ...state,
                [action.payload]:action.payload,
                clientLogo: action.payload.clientLogo,
                clientName: action.payload.clientName,
                userFirstName: action.payload.userFirstName,
                accountType: action.payload.accountType,
            }
        case SIGN_OUT:
           return {
               ...state,
               authenticated:action.payload,
               filterData : [],
               loggedIn:false,
               loader:false
            }
        case REQUEST_FAILURE:
            return{
                ...state,
                authenticated:action.payload,
                loggedIn:false,   
                loader:false
            }
        case REQUEST_SUCCESS:
            return{
                ...state,
                authenticated:action.payload,
                loader: false,
            }
        case SET_USER_DETAILS:
            return {
                loader: false,
                loggedIn: true,
                userData: action.payload,
            }
        case SET_USER_PERMISSION:
            return{
                ...state,
                userPermission: action.payload,
            }
        case SET_USERNAME:
            return{
                ...state,
                userFirstName: action.payload,
            }
        default:
            {
            return state;
            }
    }
 }
}

export default loginReducer;