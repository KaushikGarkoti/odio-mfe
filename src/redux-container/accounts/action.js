import {
  GET_TEAM,
  FILTER_TEAM,
  RESET_FILTER,
  SET_LOADER,
  TEAM_NOT_FOUND,
} from "./type";
import profileService from "@services";
import history from "../../redux-container/store";

export const getTeamList = () => async (dispatch) => {
  dispatch({ type: SET_LOADER, payload:true}); 
  await profileService
    .myTeam()
    .then((res) => {
      dispatch({ type: GET_TEAM, payload: res.data.data.team });
    })
    .catch((error) => {
      if (error.response && error.response.status === 400) {
        history.push("./login");
        dispatch({ type: TEAM_NOT_FOUND });
      } else if (error.response && error.response.status === 500) {
        dispatch({ type: TEAM_NOT_FOUND });
      } else {
        dispatch({ type: TEAM_NOT_FOUND });
      }
    });
};

export const filterTeamList = (data) => async (dispatch) => {
  dispatch({ type: FILTER_TEAM, payload: data });
};

export const resetFilter = () => async (dispatch) => {
  dispatch({ type: RESET_FILTER });
};
