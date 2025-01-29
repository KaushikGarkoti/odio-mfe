import { FETCH_CALL_LISTS_SUCCESS, FETCH_CALL_LISTS_FAILURE, CLEAR_CALL_LIST, SET_CALL_SCORE, CLEAR_CALL_SCORE } from './types'
import callsService from "../../Components/Services/calls.service";

export const clearCallList = () => ({
  type: CLEAR_CALL_LIST,
});

export const setCallScore = (data)=>({
  type: SET_CALL_SCORE,
  payload: data,
})

export const clearCallScore = ()=>({
  type: CLEAR_CALL_SCORE
})

export const fetchCallLists = (id, coeIds, type) => async (dispatch) => {
  try {
    const response = await callsService.getCallDetailStats(id, coeIds, type);

    dispatch({
      type: FETCH_CALL_LISTS_SUCCESS,
      payload: response?.data?.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_CALL_LISTS_FAILURE,
      payload: error.message,
    });
  }
};
