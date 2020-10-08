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
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';



export default function index({ state, dispatch }) {


 
  const authenticated  = state.auth;

// When 
// const handelToggle = () => {
//   dispatch(() => { loading(dispatch) })
  
//   var checking = check ? false : true;
//   var date = checking? moment().toDate(): moment(todos[index].createdAt).add(2,"hours").toDate()
//   console.log(checking)
//   axios.patch("/api/items/" + todos[index].id, {
//     id: todo.id,
//     isCompleted: checking,
//     endAt: date,
//   }, token).catch(err => dispatch(returnErrors(err.response.data.msg, err.response.status)));

//   setCheck(checking);
  
//   todos[index].isCompleted = checking;
//   todos[index].endAt = date
// };

  return (

    <React.Fragment>

      <NavBar>
        <div className="logo">
          <AccessibilityNewIcon fontSize={"large"} />
          <Typography variant="h6" className="title">
            | Stand App
      </Typography>
        </div>
        <WhenLogin  dispatch={dispatch} authenticated={authenticated} />
      </NavBar>
    </React.Fragment>
  )
}

  const WhenLogin = ({authenticated,dispatch}) => {
     const logOut = () => {
    logout(dispatch)
  };
  
    if (authenticated.isAuthenticated) {
      return (
        <React.Fragment>
          
          <div className= "link-items"> 

        <Avatar style ={{width: 50 , height: 50, fontSize: 14}} src={authenticated.user.filePath} > {authenticated.user.name}</Avatar>
        <h1 style= {{color: "white", marginRight: "18vw", marginLeft: "1vw" }}>Welcome {authenticated.user.name}</h1>

          <Link to='/'>
          <div className= "menu">Dashboard</div>
          </Link>

          <Link to='/support'>
          <div className= "menu">Support</div>
          </Link>

          <Link to='/standup'>
          <div className= "menu">Stand Up</div>
          </Link>

          <Link to='/admin'>
          <div className= "menu">Admin</div>
          </Link>

          <Link to='/Setting'>
          <div className= "menu">Setting</div>
          </Link>

          </div>
          <NavItem icon={<EjectIcon onClick={() => logOut()} />} />
  
        </React.Fragment>
      )
    } else return <React.Fragment />
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