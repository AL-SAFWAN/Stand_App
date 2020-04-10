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
import OnLog from './OnLog'
function App() {


  const dispatch = useDispatch();
  const state = useSelector(state => state);

  console.log(state);

  useEffect(() => dispatch(() => loadUser(dispatch, state))
  , [dispatch]);



  // const [step ,setStep] = useState(1);

  // useEffect(() => {
  //   console.log("is auth UPDATED to switch page")

  //   if(state.auth.isAuthenticated){
  //     setStep(2)
  //   }},[state.auth.isAuthenticated] )
    
  // const OnLog= ({step}) => {
  //   switch(step){
  //     case 1 : 
  //     return(<FrontPage></FrontPage>)
  //     case 2: 
  //     return(<Todos></Todos>)
  //   }
  // } 

 

  

  const { msg, id } = state.error;
  return (
    <div style={{ height: "100%" }}>
      <Logout></Logout>


       <OnLog /> 

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={id !== null}
        autoHideDuration={3000}
        onClose={() => dispatch(clearErrors())}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => dispatch(clearErrors())}
          severity="error"
          children={msg.toString()}
          style={{ opacity: 1, transform: "none", visibility: undefined }}
          direction="up"
        />
      </Snackbar>
    </div>
  );
}

export default App;
