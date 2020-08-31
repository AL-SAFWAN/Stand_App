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
          <NavItem icon={<UnfoldMoreIcon />} >
            <DropdownMenu />
          </NavItem>
        </React.Fragment>
      )
    } else return <React.Fragment />
  }


  return (
     
    <React.Fragment>
       
      <NavBar>
        <div className= "logo">
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
  const [open, setOpen] = useState(false)
  return (
    <li className="nav-item">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>
      {open && props.children}
    </li>
  )
}

function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);

  const calcHeight = (el) => {
    const height = el.offsetHeight;
    setMenuHeight(height)
  }
  const DropdownItem = (props) => {
    return (
      <a href="#" className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
        <span className="icon-button"> {props.leftIcon}</span>
        {props.children}
        <span className="icon-right"> {props.rightIcon}</span>
      </a>
    )
  }

  return (<div className="dropdown" style={{height: menuHeight}}>
    <CSSTransition
      in={activeMenu === "main"}
      unmountOnExit timeout={500}
      classNames="menu-primary"
      onEnter={calcHeight}
      >
      <div className="menu">
        <DropdownItem goToMenu={"more"}> My Profile</DropdownItem>
        <DropdownItem leftIcon="🗿"> My Profile</DropdownItem>
      </div>
    </CSSTransition>

    <CSSTransition
      in={activeMenu === "more"}
      unmountOnExit
       timeout={500}
      classNames="menu-secondary"
      onEnter={calcHeight}>
      <div className="menu">
        <DropdownItem goToMenu={"main"} > My Profile</DropdownItem>
        <DropdownItem leftIcon="🗿" > My Profile</DropdownItem>
        <DropdownItem leftIcon="🗿" > My Profile</DropdownItem>
        <DropdownItem leftIcon="🗿" > My Profile</DropdownItem>
        <DropdownItem leftIcon="🗿" > My Profile</DropdownItem>
        <DropdownItem leftIcon="🗿" > My Profile</DropdownItem>
      </div>
    </CSSTransition>

  </div>)
}