import { SET_LOADER} from "./type"
import { GET_CALL_LISTING } from "./type";
import { LIST_NOT_FOUND } from "./type";
import { FILTER_CALL_LIST } from "./type";
const callListing = {
    // loader:false,
    // callList:[
    //     {
    //             id: "5",
    //             group_id: "0001",
    //             ticket: "000000",
    //             seller: "Chiranjit Mishra",
    //             buyer_name: "unknown",
    //             phone: "99202011629",
    //             date: "Sat, 14 Aug 2021 00:00:00 GMT",
    //             talk_duration: "263",
    //             alarms: "4",
    //             call_score: "80",
    //             pitch_score: "77",
    //     }
    // ],
    dataForFilter:[
      {
        SELLER:{
          SellerName:"effffwe",
          Manager:"ewfwef"
        }
      }
    ]
}

const manageSalesCallListReducer = (state=callListing,action)=>{
    if (action.type) {
        switch (action.type) {
          case SET_LOADER: {
            return {
              ...state,
              loader: true,
            };
          }
          case LIST_NOT_FOUND:
            return {
            loader: false,
            };
          case GET_CALL_LISTING:
            return {
                ...state,
                callList:action.payload,
                loader: false,
            };
          case FILTER_CALL_LIST:
            return{
              ...state,
              dataForFilter:action.payload
            };
          default:
            return{
                ...state
            }
        }
    }
}
export default manageSalesCallListReducer
