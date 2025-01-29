import { SET_CALL_LISTS, SET_AVAILABLE_PAGES, FETCH_CALL_LISTS_SUCCESS, FETCH_CALL_LISTS_FAILURE, SET_CURRENT_PAGE, SET_CURRENT_INDEX, SET_ACTUAL_INDEX, CLEAR_CALL_LIST, SET_CALL_SCORE, CLEAR_CALL_SCORE } from './types';

const initialState = {
  groupCallList: [],
  currentPage: 0,
  currentIndex: 0,
  actualIndex: 0,
  availablePages: 0,
  callScore: 0,
  error: null,
};

const callListReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CALL_LISTS:
      return {
        ...state,
        groupCallList: [
          ...(Array.isArray(state?.groupCallList) ? state.groupCallList : []),
          ...(action?.payload ? action.payload : []),
      ],
      };
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action?.payload,
      };
    case SET_AVAILABLE_PAGES:
      return {
        ...state,
        availablePages: action?.payload,
      };
    case  SET_CALL_SCORE:
      return {
        ...state,
        callScore: action?.payload,
      }
    
    case CLEAR_CALL_SCORE:{
      return {
        ...state,
        callScore: 0
      }
    }

    case SET_CURRENT_INDEX:
      return {
        ...state,
        currentIndex: action?.payload,
      };
    case SET_ACTUAL_INDEX:
      return {
        ...state,
        actualIndex: action?.payload,
      };
    case FETCH_CALL_LISTS_SUCCESS:
      return {
        ...state,
        callList: action?.payload,
      };
    case FETCH_CALL_LISTS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
      case CLEAR_CALL_LIST:
        return initialState;
    default:
      return state;
  }
};

export default callListReducer;
