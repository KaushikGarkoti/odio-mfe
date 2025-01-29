import { ADD_COE, DELETE_COE, ADD_COE_USER, GET_COE_LIST, UPDATE_COE,GET_COE_USERS_LIST,DELETE_COE_USER, SET_LOADER} from '../type';

const initialCOEState = {
     loader: false,
     success: false,
     coeList:[
          {
               callScore: 0,
               coeId: null,
               coeName: "",
               createdOn: "",
               numberOfUsers: 0,
               pitchScore: 0
          }
     ],

     coeUsersList:[
          {
               firstName: "",
               lastName: "",
               userRole: "",
               email: "",
               employeeId: "",
               caller: "",
               managerId: "",
               status: ""
          }

     
     ]
 }

const manageCOEReducer = (state=initialCOEState, action) => {
    if(action.type){
        switch (action.type) {
            case SET_LOADER:
                 {
                      return {
                           ...state,
                          loader: state.loader == true? false: true
                    }
                 }
            case ADD_COE:                
                 return {
                      ...state,
                      coeList: [...state.coeList, action.payload],
                      success : true
                 }
            case DELETE_COE:{
                const delIndex = state.coeList.findIndex(element => element.coeId == action.payload.coeId );
                let newArray = [...state.coeList];
                newArray.splice(delIndex,1)
                 return {...state,
                   coeList: newArray}
                 }
            case ADD_COE_USER:
                 {
                 const index = state.coeList.findIndex(element => element.coeId == action.payload.coeId );
                 let newcoeArray = [...state.coeList];
                 newcoeArray[index] = {...newcoeArray[index], numberOfUsers: state.coeList[index]['numberOfUsers']+1}
                 return {...state,
                        coeList: newcoeArray
                         }
                 }
            case GET_COE_LIST:
                 return{
                       ...state,
                       coeList : action.payload,
                       loader: false
                 }
           case GET_COE_USERS_LIST:{
                state.coeUsersList = action.payload[0];
               let newList = state.coeUsersList.map(v => ({...v, coeId: action.payload[1]}))
                    return{
                          ...state,
                          coeUsersList : newList,
                          loader: false
                    }
               }
            case UPDATE_COE:{
               const index = state.coeList.findIndex(element => element.coeId == action.payload.coeId );
               let newArray = [...state.coeList];
               if(action.payload.coeName)
                    newArray[index] = {...newArray[index], coeName: action.payload.coeName }
               if(action.payload.externalId)
                   newArray[index] = {...newArray[index], externalId: action.payload.externalId }
               if(action.payload.momBucketId)
                  newArray[index] = {...newArray[index], momentBucketId: action.payload.momentBucketId }
                 return{
                    ...state,
                    coeList: newArray,
                    success: true
                 }
               }
           case DELETE_COE_USER:{
                    const coeIndex = state.coeList.findIndex(element => element.id === action.payload.coeId );
                    const delIndex = state.coeUsersList.findIndex(element => element.id === action.payload.userId );
                    let newArray = [...state.coeUsersList];
                    let newCoeArray = [...state.coeList];
                    newArray.splice(delIndex,1)
                    if(state.coeList[coeIndex]['numberOfUsers'] > 0)
                          newCoeArray[coeIndex] = {...newCoeArray[coeIndex], numberOfUsers: state.coeList[coeIndex]['numberOfUsers']-1}
                     return {...state,
                       coeeUsersList: newArray,
                       coeId : newCoeArray}
                     }
            default:
                 return state;
                
            }
        }
    }

export default manageCOEReducer;