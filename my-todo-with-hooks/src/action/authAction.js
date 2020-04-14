import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  lOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from "./type";
import axios from "axios";
import { returnErrors } from "./errorAction";

export const loadUser = (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
  

  axios.get("/api/auth/user", tokenConfig(getState))
    .then(res => {
       
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    })
    .catch(err => {console.log("error",err.response)
      dispatch( returnErrors(err.response.data.msg, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

export const logout= (dispatch)=>{
  console.log("logout")
  dispatch(
 {
    type: LOGOUT_SUCCESS
  }

  )
 
}
export const register = ({name,email,password})=> dispatch=>{
  
  const config = {
    headers:{
      "Content-Type": "application/json"
    }
  }
  const body = JSON.stringify({name,email,password})

  axios.post('/api/users', body, config)
  .then(res => {
    console.log(res.data)
    dispatch({
    type: REGISTER_SUCCESS, 
    payload: res.data
  })} ).catch(err =>{
    console.log(err.response)
    dispatch(
      returnErrors(err.response.data.msg, err.response.status,REGISTER_FAIL));
    dispatch({
      type: REGISTER_FAIL, 
  } )
})}

export const login = ({email,password})=> dispatch=>{
  console.log("INFO =>",email,password)
  const config = {
    headers:{
      "Content-Type": "application/json"
    }
  }

  const body = JSON.stringify({email,password})

console.log("in Login method",body)

  axios.post('/api/auth', body, config)
  .then(res => dispatch({
    type: lOGIN_SUCCESS, 
    payload: res.data
  }) ).catch(err =>{
    console.log(err.response)
    dispatch(
      returnErrors(err.response.data.msg, err.response.status,LOGIN_FAIL));
    dispatch({
      type: LOGIN_FAIL, 
  } )
})}

// used to auth the changed on the todo 
export const tokenConfig= getState=>{

    const token = getState.auth.token;
      console.log("THE_TOKEN_", token)
    const config = {

      headers: {
        "Content-type": "application/json"
      }
      
    };
    if (token) {
      config.headers["x-auth-token"] = token;
    }
console.log("config",config)
    return config
}  