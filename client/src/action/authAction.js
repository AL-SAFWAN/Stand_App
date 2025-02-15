import {
  USER_LOADED,
  AUTH_ERROR,
  lOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_USER
} from "./type";
import axios from "axios";
import { returnErrors, returnLogErrors } from "./errorAction";

// this only get the user information such as the name and email 

// when im trying to log out this gets called again, hence the logging out problem
export const loadUser = (dispatch, getState) => {
  // dispatch({ type: USER_LOADING });
  axios.get("/api/auth/user", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      console.log("error", err.response)
      dispatch(returnLogErrors(err.response.data.msg, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};
// setting everything to null... what about the todos?
export const logout = (dispatch) => {
  dispatch(
    {
      type: LOGOUT_SUCCESS
    }
  )
}


export const register = ({ name, email, password, filePath,accountType }) => dispatch => {

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }
  const body = JSON.stringify({ name, email, password, filePath,accountType })

  axios.post('/api/users', body, config)
    .then(res => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      })
    }).catch(err => {
      dispatch(
        returnLogErrors(err.response.data.msg, err.response.status, REGISTER_FAIL));
      dispatch({
        type: REGISTER_FAIL,
      })
    })
}

export const updateDetails = ({ name, email, id, filePath }) => dispatch => {

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }
  const body = JSON.stringify({ name, email, id, filePath })

  axios.patch('/api/users/userDetails', body, config)
    .then(res => {
      console.log(res)
      dispatch({
        type: UPDATE_USER,
        payload: res.data
      })
    }).catch(err => {
      console.log(err)
      dispatch(
        () => returnErrors(err.response.data.msg, "error", dispatch));

    })
}
export const updatePassword = ({ password, id }) => dispatch => {

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }
  const body = JSON.stringify({ password, id })

  axios.patch('/api/users/userPassword', body, config).catch(err => {
    console.log(err)
    dispatch(
      () => returnErrors(err.response.data.msg, "error", dispatch));

  })
}

export const login = ({ email, password }) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }
  const body = JSON.stringify({ email, password })

  // this should recieve the token 

  //we get the invalid crdential error when loading in 
  axios.post('/api/auth', body, config)
    .then(res => dispatch({
      type: lOGIN_SUCCESS,
      payload: res.data
    })).catch(err => {
      dispatch(
        returnLogErrors(err.response.data.msg, err.response.status, LOGIN_FAIL));
      dispatch({
        type: LOGIN_FAIL,
      })
    })
}


export const passwordCheck = ({ email, password, dispatch, setMatched }) => {


  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }
  const body = JSON.stringify({ email, password })
  // this should recieve the token 
  //we get the invalid crdential error when loading in 

  axios.post('/api/auth', body, config)

    .then(res => { setMatched(true) })

    .catch(err => {

      dispatch(() => returnErrors(err.response.data.msg, "error", dispatch))
      setMatched(false)
    })


}

// used to auth the changed on the todo 
export const tokenConfig = state => {
  const token = state.auth.token;
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config
}  