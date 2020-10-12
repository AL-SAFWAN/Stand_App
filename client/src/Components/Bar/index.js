import React from 'react'
import './bar.css';
import EjectIcon from '@material-ui/icons/Eject';
import Typography from "@material-ui/core/Typography";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import { logout } from '../../action/authAction'
import { Link } from 'react-router-dom';
import { Avatar, Chip } from '@material-ui/core';



export default function index({ state, dispatch }) {



  const authenticated = state.auth;

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
          <Typography style={{
            borderRadius: "20px",
            background: "#4053b5",
            padding: '5px',
            paddingLeft: '10px',
            paddingRight: '10px'
          }} variant="h6" className="title">
            Stand App
      </Typography>
        </div>
        <WhenLogin dispatch={dispatch} authenticated={authenticated} />
      </NavBar>
    </React.Fragment>
  )
}

const WhenLogin = ({ authenticated, dispatch }) => {
  const logOut = () => {
    logout(dispatch)
  };

  if (authenticated.isAuthenticated) {
    return (
      <React.Fragment>

        <div className="link-items">


          <Link to='/'>
            <div className="menu">Home</div>
          </Link>

          <Link to='/support'>
            <div className="menu">Support</div>
          </Link>

          <Link to='/standup'>
            <div className="menu">Stand Up</div>
          </Link>
        {authenticated.user.accountType ==="admin" &&
          <Link to='/admin'>
            <div className="menu">Admin</div>
          </Link>}

          <Link to='/Setting'>
            <div className="menu">Setting</div>
          </Link>

        </div>

        <Chip avatar={<Avatar style={{ width: 50, height: 50, fontSize: 14 }} src={authenticated.user.filePath} > {authenticated.user.name}</Avatar>
        } label={
          <div style={{ display: "flex" }}>
            <h1 style={{ color: "white", marginRight: "0vw", marginLeft: "0vw" }}>Welcome {authenticated.user.name}</h1>
              <NavItem icon={<EjectIcon onClick={() => logOut()} />} />
          </div>
        } variant="outlined" />




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
  <Link to='/' style ={{alignSelf : "center"}}>
    <li className="nav-item">
      <div className="icon-button">
        {props.icon}
      </div>

      {props.text}
    </li> 
    </Link>

  )
}