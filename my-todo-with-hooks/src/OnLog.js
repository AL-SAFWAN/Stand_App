import React, { useEffect, useState } from "react";
import {useSelector } from "react-redux";
import Todos from "./Components/RuningTodos";
import FrontPage from "./Components/auth/FrontPage";


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