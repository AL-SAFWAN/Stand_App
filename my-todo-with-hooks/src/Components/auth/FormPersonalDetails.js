import React from "react";
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


export default function FormPersonalDetails({
  nextStep,
  preStep,
  setValue,
  values
}) {

    console.log("in personal details")
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
        Nearly done
      </Typography>

      <TextField
        id={"password"}
        type="password"
        autoComplete="current-password"
        label={"Enter your password"}
        style={{ margin: 30, width: 350, textAlign: "center" }}
        value = {values.password}
        onChange={e => setValue.setPassword(e.target.value)}
      ></TextField>

      <TextField
        id={"confirmPassword"}
        type="password"
        autoComplete="current-password"
        label={"Enter your password again"}
        style={{ margin: 30, width: 350, textAlign: "center" }}
        value={values.confirmPassword}
        onChange={e => setValue.setConfirmPassword(e.target.value)}
      ></TextField>

      <Button className={classes.button} variant="contained" onClick={preStep}>
        back
      </Button>

      <Button className={classes.button} variant="contained" onClick={nextStep}>
        next
      </Button>
    </Paper>
  );
}
