import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { logout } from "../../action/authAction";
import { useDispatch, useSelector } from "react-redux";
import Chip from "@material-ui/core/Chip";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
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

export default function Logout() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const logOut = () => {
    logout(dispatch);
  };
  const authed = useSelector(state => state.auth);
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

          <LogIcon></LogIcon>
        </Toolbar>
      </AppBar>
    </div>
  );
}