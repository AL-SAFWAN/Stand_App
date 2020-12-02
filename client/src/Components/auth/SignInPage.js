import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import "./front.css";
import UserForm from "./UserForm";
import Login from './Login'
import { login } from '../../action/authAction'
import { useDispatch } from "react-redux";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: green
  },
  boxRoot: {
    flexGrow: 1
  },
  paper: {
    height: "100%",
    backgroundColor: green,
    textAlign: "center",
    color: theme.palette.text.primary
  },
  button: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10
  }
}));

const gridStyle = {
  parent: {
    margin: "autp",
    width: "99%",
    height: "100%",
    boxSizing: "border-box",
    borderRadius: 5,
    justifySelf: "auto",
    position: "absolute",
    top: "-30vh",
    bottom: "-50vh"
  },
  child: {
    height: "100%"
  }
};

export default function SignInPage({state}) {

  const dispatch = useDispatch()

  const [Step, setStep] = useState(1);

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const vals = { Email, Password }
  const setVals = { setPassword, setEmail }


  const openUserForms = () => {
    setStep(2);
  };

  const handleSubmit = e => {
    e.preventDefault();
    e.persist();
    const User = { email: Email, password: Password };
    console.log('debug: login', Password)
    console.log(User)
    login(User)(dispatch, state)
  };

  const classes = useStyles();

  switch (Step) {
    case 1:
      return (
        <Grid
          container
          spacing={3}
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
          style={gridStyle.parent}
        >
          <Grid style={gridStyle.child}>
            <Login classes={classes} vals={vals} setVals={setVals} openUserForms={openUserForms} handleSubmit={handleSubmit} ></Login>
          </Grid>
        </Grid>

      );

    case 2:
      return (
        <Grid
          container
          spacing={3}
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
          style={gridStyle.parent}
        >
          <Grid style={gridStyle.child}>
            <UserForm setStep={setStep}></UserForm>
          </Grid>
        </Grid>
      );
      
  default:
    return<></>
  }
}
