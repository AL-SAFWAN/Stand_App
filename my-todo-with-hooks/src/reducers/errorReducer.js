import { GET_ERRORS, CLEAR_ERRORS } from "../action/type";

const initialState = {
  msg: {},
  status: null,
  id: null,
  type: "error"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        msg: action.payload.msg,
        state: action.payload.status,
        id: action.payload.id,
        type: action.payload.type
      };
    case CLEAR_ERRORS:
      return {
        msg:  " ",
        status: null,
        id: null, 
        type: "info"
      };
    default:
      return state;
  }
}
