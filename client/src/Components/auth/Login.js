import React from 'react'
import {
  Paper,
  TextField,
  Typography,
  Button, FormControl
} from "@material-ui/core";

export default function Login({ classes, vals, setVals, handleSubmit, openUserForms }) {
  const { Email, Password } = vals
  const { setEmail, setPassword } = setVals

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
        style={{ paddingTop: 50 }}
      >
        Sign In
            </Typography>
      <FormControl>
        <TextField
          name={"email"}
          key={"Email"}
          label={"Enter your email"}
          style={{ margin: 30, width: 350, textAlign: "center" }}
          value={Email}
          onChange={e => {
            setEmail(e.target.value);
          }}
        ></TextField>

        <TextField
          name={"current-password"}
          key={"current-password"}
          id={"current-password"}
          label={"Enter your password"}
          type="password"
          autoComplete={"current-password"}
          style={{ margin: 30, marginTop: 5, marginBottom: 50, width: 350, textAlign: "center" }}
          value={Password}
          onChange={e => setPassword(e.target.value)}
        ></TextField>

      </FormControl>
      <Button
        className={classes.button}
        variant="contained"
        onClick={handleSubmit}
        value="Sign In!"
      >
        Login
            </Button>

      <Button
        className={classes.button}
        variant="contained"
        onClick={openUserForms}
      >
        Create account
            </Button>
    </Paper>

  );

}
