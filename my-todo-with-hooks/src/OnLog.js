import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Todos from "./Components/RuningTodos";
import { loadUser } from "./action/authAction";
import { clearErrors } from "./action/errorAction";
import FrontPage from "./Components/auth/FrontPage";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Logout from "../src/Components/auth/Logout";
import {
  loadItem,
  setItemToAdd
} from "./action/itemActions";


export default function OnLog() {
const [step ,setStep] = useState(1);
const state = useSelector(state => state);
useEffect(() => {
  console.log("is auth UPDATED to switch page")
  
  if(state.auth.isAuthenticated){
    setStep(2)
  }else setStep(1) },[state.auth.isAuthenticated] )
  

  switch(step){
    case 1 : 
    return(<FrontPage></FrontPage>)
    case 2: 
    return(<Todos></Todos>)
  
} 

}