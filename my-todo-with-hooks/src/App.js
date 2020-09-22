import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./action/authAction";
import { clearErrors } from "./action/errorAction";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Bar from './Components/Bar'

import MenuBar from "../src/Components/auth/Bar";

import OnLog from './OnLog'

import StandupForm from './Components/StandupForm'
import SupportPage from './Components/SupportPage'
import AdminPage from './Components/AdminPage'

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

function App() {

  const dispatch = useDispatch();

  const state = useSelector(state => state);
  console.log(state)

  useEffect(() =>
    dispatch(() => loadUser(dispatch, state)), []);

  const [msg,setMsg]= useState({}) 
  const [id,setId]= useState(null) 

  
 
  useEffect(() =>{
    const { msg, id } = state.error;
    setMsg(msg)
      setId(id)

      console.log("from the error up front App.js", msg,id )
  }
  
    , [state.error]);

  return (
    <React.Fragment>
      {/* This is the top bar menu  */}
      <Router>

        {/* <Bar style={{ position: "sticky" }} state={state} dispatch={dispatch}></Bar> */}
        <MenuBar state={state}></MenuBar>
        <Switch>

          {/* This handels the logging in  */}

          {/* <Route path ='/' component = {OnLog} /> */}

          <Route exact path='/' component={OnLog} />

          <Route exact path='/support' component={SupportPage} />

          <Route exact path='/standup' component={StandupForm} />

          <Route exact path='/admin' component={AdminPage} />
        </Switch>
      </Router>

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

//  <OnLog state = {state}/> 
//  <AdminPage state ={state}/>
//  <StandupForm state ={state}></StandupForm>
//done  <SupportPage/>