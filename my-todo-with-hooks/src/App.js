import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./action/authAction";
import { clearErrors } from "./action/errorAction";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import MenuBar from "../src/Components/auth/Bar";

import OnLog from './OnLog'
import Bar from './Components/Bar'
import StandupForm from './Components/StandupForm'

import AdminPage from './Components/AdminPage'
// import {ReactComponent as ReactLogo} from './img/undraw_speech_to_text_9uir 1.svg'
function App() {

  const dispatch = useDispatch();

  const state = useSelector(state => state);
  console.log(state)
  useEffect(() =>
    dispatch(() => loadUser(dispatch, state)), []);

  const { msg, id } = state.error;
  return (
    <React.Fragment>
      {/* This is the top bar menu  */}

      {/* <MenuBar state = {state}></MenuBar> */}
      <Bar style={{ position: "sticky" }} state={state} dispatch={dispatch}></Bar>

      {/* This handels the logging in  */}

      {/* <OnLog state = {state}/>  */}

    <AdminPage state ={state}/>

      {/* <StandupForm state ={state}></StandupForm> */}


      {/* <ReactLogo/> */}
      {/* This displays all the errors */}
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
    </React.Fragment>
  );
}

export default App;
