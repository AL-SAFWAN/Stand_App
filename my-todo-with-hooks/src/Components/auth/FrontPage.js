import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  List,
  Paper,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Card,
  CardActions,
  CardContent,
  Typography,
  Button
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import "./front.css";
import UserForm from "./UserForm";
import Login from './Login'
import {login} from '../../action/authAction'
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
    //  padding: 30,
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
    // backgroundColor: "rgba(123, 151, 234, 0.19)",
    justifySelf: "auto",
    position: "absolute",
    top: "-30vh",
    bottom: "-50vh"
  },
  child: {
    height: "100%"
    // backgroundColor: "rgb(194, 197, 219)",
    // margin: 10,
    // borderRadius: 5
  }
};

export default function FrontPage() { 
  const dispatch = useDispatch()
  const [Step, setStep] = useState(1);

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const vals = {Email,Password}
  const setVals = {setPassword,setEmail}
  

  const openUserForms = () => {
    setStep(2);
  };

  const handleSubmit = e => {
    e.preventDefault();
    e.persist();
    const User = {email: Email, password:Password};

    console.log(User)
    login(User)(dispatch)
  };

  

  const classes = useStyles();

  switch (Step) {
    case 1:
      return (
        // <div className={"toFull"} style={{ height: "100%" }}>

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

        // </div>
      );

    case 2:
      return (
        // <div className={"toFull"} style={{ height: "100%" }}>

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

        // </div>
      );
  }
}
