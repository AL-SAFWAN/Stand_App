import React from "react";
import { useDispatch } from "react-redux";
import {
  List,
  Paper,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Button,
  Avatar
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
    marginLeft: 35,

    marginRight: 25,
    marginTop: 45
  },
  list: {
    marginLeft: 35,
    marginTop: -15,
    marginBottom: 10
  },
  password: {
    position: "absolute",
    top: 32
  }
}));

export default function Confirm({
  preStep,
  values,
  uploadedFile
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
      password, 
      filePath: uploadedFile.filePath
    };
    register(newUser)(dispatch)


  };

  const classes = useStyles();

  return (
    <Paper
      style={{
        margin: "auto",
        height: 450,
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

          <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-around', margin: "13px", }}>

              <Avatar  style={{ width: 65, height: 65, fontSize: 14, margin: 5,marginRight: 10 }} src={uploadedFile.filePath} alt={values.name} > {values.name}</Avatar>
              
            <ListItemText primary={"User Name"} secondary={values.name} />

          </div>
        </ListItem>

        <ListItem className={classes.list} style={{ marginLeft: 53}}>
          <ListItemText primary={"Email"} secondary={values.email} />
        </ListItem>

        <ListItem className={classes.list} style={{  marginLeft: 53}}>
          <ListItemText
            primary={"password"}
          // secondary={renderPasswordSection}
          />

          <Input className={classes.password}
            id="standard-adornment-password"
            type={val.showPassword ? "text" : "password"}
            value={val.password}
            disabled={true}
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
