import {
  ADD_COE,
  DELETE_COE,
  ADD_COE_USER,
  GET_COE_LIST,
  UPDATE_COE,
  GET_COE_USERS_LIST,
  DELETE_COE_USER,
  SET_LOADER,
} from "../type";
import coeService from "../../../Components/Services/coe.service";
import { COE_LIST } from "../../../Constants/constant";
import toast from "../../../Components/Toast/toaster";

export const addCOEAction = (inputs) => async (dispatch) => {
  let promise = coeService.createCOE(inputs);
  promise
    .then((res) => {
      toast.success(res.data.message);
    })
    .catch((error) => {
      if (error.response.status === 400)
        toast.error(error.response.data.message);
      else {
        toast.error(error.response.data.message);
      }
    });
  dispatch({ type: ADD_COE, payload: inputs });
};

export const deleteCOE = (id) => async (dispatch) => {
  let promise = coeService.deleteCOE(id);
  promise
    .then((res) => {
      toast.success(res.data.message);
      getclientcoeList();
    })
    .catch((error) => {
      if (error.response.status === 400) {
        // toast.error(error.response.data.message);
      } else {
        toast.error(error.response.data.message);
      }
    });
  dispatch({ type: DELETE_COE, payload: id });
};

export const removeCoeUser = (data) => async (dispatch) => {
  let promise = coeService.removeCoeUser(data);
  promise
    .then((res) => {
      toast.success(res.data.message);
    })
    .catch((error) => {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.response.data.message);
      }
    });
  dispatch({ type: DELETE_COE_USER, payload: data });
};

export const addUser = (user) => async (dispatch) => {
  let promise = coeService.addUserToCOE(user);
  promise
    .then((res) => {
      toast.success(res.data.message);
    })
    .catch((error) => {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.response.data.message);
      }
    });
  dispatch({ type: ADD_COE_USER, payload: user });
};

export const getclientcoeList = () => async (dispatch) => {
  dispatch({ type: SET_LOADER });
  await coeService
    .getAllCOEList()
    .then((res) => {
      sessionStorage.setItem(COE_LIST, JSON.stringify(res.data.data));
      dispatch({ type: GET_COE_LIST, payload: res.data.data });
    })
    .catch(() => {
      dispatch({ type: SET_LOADER });
    });
};

export const setCoeList = (coe) => async (dispatch) => {
  var p =[]
  dispatch({ type: SET_LOADER });
  await coeService
    .getCOEList()
    .then((res) => {
      sessionStorage.setItem(COE_LIST, JSON.stringify(res.data.data));
       p = res.data.data.filter(e => e.coeId === coe.id)
      dispatch({ type: GET_COE_LIST, payload: res.data.data });
    })
    .catch(() => {
      dispatch({ type: SET_LOADER });
    });
  dispatch({ type: GET_COE_LIST, payload: p });
}

export const updateCOEAction = (inputs) => async (dispatch) => {
  let promise = coeService.updateCOE(inputs);
  promise
    .then((res) => {
      dispatch({ type: UPDATE_COE, payload: inputs });
      toast.success(res.data.message);
      return res.data.status;
    })
    .catch((error) => {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.response.data.message);
      }
    });
};

export const getCoeUsersList = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADER });
  await coeService
    .getCoeUsersList(id)
    .then((res) => {
      dispatch({
        type: GET_COE_USERS_LIST,
        payload: [res.data.data, id],
      });
      
    })
    .catch((error) => {
      dispatch({ type: SET_LOADER });
      if (error.response.status === 400) {
        //toast.error(error.response.data.message);
        console.log(error.response.data.message);
      } else {
        //toast.error(error.response.data.message);
        console.log(error.response.data.message);
      }
    });
};
