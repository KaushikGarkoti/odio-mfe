import {
  DOC_EDIT_DATA,
  CLEAR_DOC_EDIT_DATA,
  MOMENTS_DATA,
  CLEAR_MOMENT_DATA,
} from './type';

export const setDocEditData = (data) => {
  return (dispatch) => {
    dispatch({ type: DOC_EDIT_DATA, payload: data });
  };
};

export const clearDocEditData = () => {
  return (dispatch) => {
    dispatch({ type: CLEAR_DOC_EDIT_DATA, payload: {} });
  };
};

export const setMomemtData = (data) => {
  return (dispatch) => {
    dispatch({ type: MOMENTS_DATA, payload: data });
  };
};
export const clearMomemtData = () => {
  return (dispatch) => {
    dispatch({ type: CLEAR_MOMENT_DATA, payload: [] });
  };
};
