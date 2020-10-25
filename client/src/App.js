import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./action/authAction";
import { clearErrors } from "./action/errorAction";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Bar from './Components/Bar'
import Setting from './Components/Setting'

import OnLog from './OnLog'

import StandupForm from './Components/StandupForm/page'
import SupportPage from './Components/SupportPage'
import AdminPage from './Components/AdminPage'

import { Route, Switch, withRouter } from 'react-router-dom'





function App( ) {


  const dispatch = useDispatch();

  const state = useSelector(state => state);
  console.log(state)

  useEffect(() =>
    dispatch(() => loadUser(dispatch, state)), []);

  const { msg, id, type } = state.error;

  const authenticated = state.auth.isAuthenticated
  return (
    <div>
      {/* <MenuBar state={state}></MenuBar> */}
      <Bar style={{ position: "sticky" }} state={state} dispatch={dispatch}></Bar>
      <Switch >
        <Route exact path='/' render={() => <OnLog state={state} />} />
        <Route exact path='/support' render={() =>authenticated ? <SupportPage state={state} /> : <OnLog state={state} />} />
        <Route exact path='/standup' render={() => authenticated ?<StandupForm state={state} /> : <OnLog state={state} />} />   
        <Route exact path='/admin' render={() =>authenticated ?<AdminPage state={state} /> : <OnLog state={state} />} />
        <Route exact path='/Setting' render={() =>authenticated? <Setting state={state} /> : <OnLog state={state} />} />

      </Switch>

      { (type !== false) && <Snackbar
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
          severity={type}
          children={msg.toString()}
          style={{ opacity: 1, transform: "none", visibility: undefined }}
          direction="up"
        />
      </Snackbar>}

    </div>
  );
}

export default withRouter(App);


//  <OnLog state = {state}/> 
//  <AdminPage state ={state}/>
//  <StandupForm state ={state}></StandupForm>
//  done  <SupportPage/>
