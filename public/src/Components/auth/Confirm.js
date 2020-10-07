import React from "react";
import { useDispatch } from "react-redux";
import {
  List,
  Paper,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Button
} from "@material-ui/core";

import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { register } from "../../action/authAction";
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
  },
  list:{
    marginLeft: 30,
    marginTop: 15
  },
  password:{
    position: "absolute",
    marginTop:21 
  }
}));

export default function Confirm({
  setStep,
  nextStep,
  preStep,
  values,
  setValue,
  handleChange
}) {
  const dispatch = useDispatch();
  const [val, setValues] = React.useState({
    password: values.password,
    showPassword: false
  });

  const handleClickShowPassword = () => {
    setValues({ ...val, showPassword: !val.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  // const renderPasswordSection = () => {
  //   return (
     
  //   );
  // };


  const goBack = () => {
    const { name, email, password } = values;
    const newUser = {
      name,
      email,
      password
    };
    register(newUser)(dispatch)

    // console.log(setStep);
    // setStep(1);
  };

  const classes = useStyles();

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
        Confirm your details
      </Typography>

      <List>
        <ListItem className={classes.list}> 
          <ListItemText primary={"User Name"} secondary={values.name} />
        </ListItem>

        <ListItem className={classes.list} style = {{marginTop: -13}}> 
          <ListItemText
            primary={"password"}
            // secondary={renderPasswordSection}
          />
          <Input  className={classes.password}
        id="standard-adornment-password"
        type={val.showPassword ? "text" : "password"}
        value={val.password}
        disabled = {true}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {val.showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
        </ListItem>

        <ListItem className={classes.list}> 
          <ListItemText primary={"Email"} secondary={values.email} />
        </ListItem>
      </List>

      <Button className={classes.button} variant="contained" onClick={preStep}>
        back
      </Button>

      <Button className={classes.button} variant="contained" onClick={goBack}>
        confirm
      </Button>
    </Paper>
  );
}
