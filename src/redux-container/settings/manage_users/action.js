import {
  UPDATE_USER,
  DELETE_USER,
  ADD_USER,
  GET_USERS,
  FILTER_USER,
  SET_USER_LOADER,
  RESET_FILTER,
} from "../type";
import userService from "../../../Components/Services/user.service";
import { history } from "../../store";
import coeService from "../../../Components/Services/coe.service";

export const getUserList = (props) => async (dispatch) => {
  dispatch({ type: SET_USER_LOADER });
  await userService
  .getUsers(props)
    .then((res) => {
      dispatch({ type: GET_USERS, payload: res.data.data });
    })
    .catch((error) => {
      dispatch({ type: SET_USER_LOADER })
      if (error.response && error.response.status === 403) {
        history.push("./login");
      } else if (error.response && error.response.status === 500) {
        console.log("User doesn’t exist.");
      } else {
        console.log("Oops somethings went wrong, Network Error.");
      }
    });
};

export const setUser = (e) => async (dispatch) => {
  dispatch({ type: SET_USER_LOADER });
  await coeService
    .getCoeUsersList(e.coeId)
    .then((res) => {
      var str = JSON.stringify(e);
      str = str.replace('coeId', 'id');
      str = str.replace('coeName', 'name');

      e = JSON.parse(str);
      var clientCoes = [];
      clientCoes.push(e)
      let newList = res.data.data.map(v => ({...v, clientCoes: clientCoes}))
      
      dispatch({ type: GET_USERS, payload: newList});
    })
    .catch((error) => {
      dispatch({ type: SET_USER_LOADER });
      if (error.response.status === 400) {
        //toast.error(error.response.data.message);
        console.log(error.response.data.message);
      } else {
        //toast.error(error.response.data.message);
        console.log(error.response.data.message);
      }
    });
  
};

export const updateUser = (data) => async (dispatch) => {
  dispatch({ type: UPDATE_USER, payload: data });
};

export const deleteUser = (data) => async (dispatch) => {
  dispatch({ type: DELETE_USER, payload: data });
};

export const addUser = (dispatch) => {
  dispatch({ type: ADD_USER });
};

export const filterUserList = (data) => async (dispatch) => {
  dispatch({ type: FILTER_USER, payload: data });
};

export const resetUserFilter = () => async (dispatch) => {
  dispatch({ type: RESET_FILTER });
};
