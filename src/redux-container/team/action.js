import {
  GET_ALL_TEAM,
  FILTER_TEAM_TAB,
  RESET_TEAM_FILTER,
  SET_LOADER,
  TEAM_NOT_FOUND,
  SHORT_TEAM_TAB,
} from "./type";
import profileService from "../../Components/Services/profile.service";
import history from "../../redux-container/store";
import toaster from "../../Components/Toast/toaster";


export const getTeam = (date) => async (dispatch) => {
  dispatch({ type: SET_LOADER });
  await profileService
    .getMyTeam(date)
    .then((res) => {
      dispatch({ type: GET_ALL_TEAM, payload: res.data.data.team });
    })
    .catch((error) => {
      dispatch({ type: TEAM_NOT_FOUND });
      if (error.response && error.response.status === 400) {
        history.push("./login");
        
      } else if (error.response && error.response.status === 500) {
        toaster.error(error.response.error);
        dispatch({ type: TEAM_NOT_FOUND });
      } else {
        dispatch({ type: TEAM_NOT_FOUND });
        // toaster.error("Oops somethings went wrong, Network Error.")
      }
    });
};

export const getTeamCaller = (date) => async (dispatch) => {
  dispatch({ type: SET_LOADER });
  await profileService
    .getMyTeamCaller(date)
    .then((res) => {
      dispatch({ type: GET_ALL_TEAM, payload: res.data.data.team });
    })
    .catch((error) => {
      dispatch({ type: TEAM_NOT_FOUND });
      if (error.response && error.response.status === 400) {
        history.push("./login");
        
      } else if (error.response && error.response.status === 500) {
        toaster.error(error.response.error);
        dispatch({ type: TEAM_NOT_FOUND });
      } else {
        dispatch({ type: TEAM_NOT_FOUND });
        // toaster.error("Oops somethings went wrong, Network Error.")
      }
    });
};

export const shortTeam = (data) => async (dispatch) => {
  dispatch({ type: SHORT_TEAM_TAB, payload: data });
};
export const filterTeam = (data) => async (dispatch) => {
  dispatch({ type: FILTER_TEAM_TAB, payload: data });
};

export const resetTeamFilter = () => async (dispatch) => {
  dispatch({ type: RESET_TEAM_FILTER });
};
