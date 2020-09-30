import React, { useState } from 'react'
import './bar.css';
import SettingsIcon from '@material-ui/icons/Settings';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import EjectIcon from '@material-ui/icons/Eject';
import Typography from "@material-ui/core/Typography";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import { useDispatch } from "react-redux";
import { logout } from '../../action/authAction'
import { CSSTransition } from 'react-transition-group'


export default function index({ state, dispatch }) {


  const logOut = () => {
    logout(dispatch)
  };
  const authed = state.auth;

  const WhenLogin = () => {
    if (authed.isAuthenticated) {
      return (
        <React.Fragment>
          <NavItem icon={<EjectIcon onClick={() => logOut()} />} />
          <NavItem icon={<SettingsIcon />} />
          <NavItem icon={<SettingsIcon />} text ="Support"/>


        </React.Fragment>
      )
    } else return <React.Fragment />
  }


  return (

    <React.Fragment>

      <NavBar>
        <div className="logo">
          <AccessibilityNewIcon fontSize={"large"} />
          <Typography variant="h6" className="title">
            | Stand App
      </Typography>
        </div>
        <WhenLogin />
      </NavBar>
    </React.Fragment>
  )
}



function NavBar(props) {
  return (
    <nav className="navbar">
      <ul className="navbar-nav" > {props.children}</ul>
    </nav>
  )
}

function NavItem(props) {

  return (
    <li className="nav-item">
      <a href="#" className="icon-button">
        {props.icon}
      </a>
      
       {props.text}
    </li>
  )
}