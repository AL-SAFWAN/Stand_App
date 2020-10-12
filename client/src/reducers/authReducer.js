import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  lOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_USER
} from "../action/type";

const initailState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  user: null
};

export default function(state = initailState, action) {
  console.log(action)
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload
      };
    case lOGIN_SUCCESS:
    case REGISTER_SUCCESS:
        localStorage.setItem("token", action.payload.token)
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: null,
        isLoading: null,
        user: null
      }

    case UPDATE_USER:
      return{
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false
      }
    default:
      return state;
  }
}
