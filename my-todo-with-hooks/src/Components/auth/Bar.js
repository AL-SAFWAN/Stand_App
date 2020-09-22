import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { logout } from "../../action/authAction";
import { useDispatch } from "react-redux";
import Chip from "@material-ui/core/Chip";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import {Link,Router} from 'react-router-dom'
import "./bar.css"


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    justifyItems: "center"
  }
}));

export default function Logout({state}) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const logOut = () => {
    logout(dispatch);
  };
  
  const authed =state.auth;

  const LogIcon = () => {
    if (authed.isAuthenticated) {
      return (
        <React.Fragment>
        <Typography variant="body2" align={"right"} className={classes.title}>
           <strong style = {{padding: 10}}>  Welcome {authed.user.name  }</strong>
          </Typography>
        <Chip
          variant="outlined"
          size="small"
          label="Logout"
          style={{ color: "white" }}
          onClick={logOut}
        /></React.Fragment>
      );
    } else return "";
  };

  return (
    <div className={classes.root}>
     
      <AppBar position="static">
        <Toolbar>
          <AccessibilityNewIcon fontSize={"large"} />

          <Typography variant="h6" className={classes.title}>
            | Stand App
          </Typography>

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
          <LogIcon></LogIcon>

        </Toolbar>
      </AppBar>

    </div>
  );
}
