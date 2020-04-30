import React from "react";
import {
  Paper,
  TextField,
  Typography,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {},
  boxRoot: {
    flexGrow: 1
  },
  paper: {
    height: "100%",

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

export default function FormUserDetails({
  setStep,
  nextStep,
  values,
  setValue,
  handleChange
}) {

  

  console.log(values);
  console.log(setValue);

  const goBack = () => {
   
    setStep(1);
  };

  const classes = useStyles();
  console.log("In user form etailes");
  return (
    <Paper
      style={{
        margin: "auto",
        height: 400,
        width: 450,
        textAlign: "center",
        position: "relative",
        top: "50%"
      }}
    >
      <Typography
        gutterBottom
        variant="h5"
        component="h2"
        style={{ paddingTop: 40 }}
      >
        Hello Create your account
      </Typography>

      <TextField
        id={"firstName"}
        label={"Enter your username"}
        style={{ margin: 18, width: 350, textAlign: "center" }}
        value={values.name}
        onChange={e => setValue.setName(e.target.value)}
      ></TextField>
    
      <TextField
        id={"email"}
        label={"Enter your email"}
        style={{ margin: 16, width: 350, textAlign: "center" }}
        value={values.email}
        onChange={e => setValue.setEmail(e.target.value)}
      ></TextField>

      <Button className={classes.button} variant="contained" onClick={goBack}>
        back
      </Button>

      <Button className={classes.button} variant="contained" onClick={nextStep}>
        next
      </Button>
    </Paper>
  );
}
