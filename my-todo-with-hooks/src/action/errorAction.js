import { GET_ERRORS, CLEAR_ERRORS } from "../action/type";
import { setItemToAdd } from "./itemActions";
export const returnErrors = (msg, status, id = null) => {
  return {
    type: GET_ERRORS,
    payload: { msg, status, id }
  };
};

export const returnErrorsOfItem = (dispatch, msg, status, todos, id,text) => {
  // adding back the item
  dispatch(() => setItemToAdd(dispatch, todos, id));
  console.log(msg);
  //chnage the state
  dispatch({
    type: GET_ERRORS,
    payload: { msg, status, id }
  });
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
