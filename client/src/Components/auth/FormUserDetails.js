import React, { useState } from "react";
import {
  Paper,
  TextField,
  Typography,
  Button,
  Avatar,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios'

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
    marginTop: 15
  }
}));



export default function FormUserDetails({
  setStep,
  nextStep,
  values,
  setValue,
  uploadedFile,
  setUploadedFile,
  selectedName,
  setSelectedName
}) {



  const goBackToSignIn = () => {
    setStep(1);
  };

  const classes = useStyles();

  const [file, setFile] = useState('')

  const style = {
    margin: 10, width: 350, textAlign: "center"
  }


  const onSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData();
    formData.append(`file`, file)

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      const { fileName, filePath } = res.data
      setUploadedFile({ fileName, filePath })
      console.log("file uploaded")
    }
    catch (err) {
      console.log(err.response.data.msg)
    }
  }
  const onChange = (e) => {
    setFile(e.target.files[0])
  }


  return (

    <Paper
      style={{
        margin: "auto",
        height: 480,
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
        style={{ paddingTop: 30 }}
      >
        Hello Create Your Account
      </Typography>

      <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-around', margin: "auto", width: 350, }}>

        <Avatar style={{ width: 65, height: 65, fontSize: 14, margin: 5 }} src={uploadedFile.filePath} alt={values.name} > {values.name}</Avatar>


        <input
          accept="image/*"
          style={{ display: "none" }}
          id="contained-button-file"
          multiple
          type="file"
          onChange={onChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span" >
            Upload Image
        </Button>

          <Button style={{ marginLeft: 5 }} variant="contained" onClick={onSubmit}>
            set
      </Button>

        </label>
      </div>

      <TextField
        id={"firstName"}
        label={"Enter your username"}
        style={{ margin: 7, width: 350, textAlign: "center" }}
        value={values.name}
        onChange={e => setValue.setName(e.target.value)}
      ></TextField>

      <TextField
        id={"email"}
        label={"Enter your email"}
        style={style}
        value={values.email}
        onChange={e => setValue.setEmail(e.target.value)}
      ></TextField>

      <TextField
        id={"password"}
        type="password"
        autoComplete="current-password"
        label={"Enter your password"}
        style={style}
        value={values.password}
        onChange={e => setValue.setPassword(e.target.value)}
      ></TextField>
        <Select
        fullWidth
        style ={style}
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
        >
          <MenuItem key={"user"} value={"user"}>{"User"}</MenuItem>
          <MenuItem key={"admin"} value={"admin"}>{"Admin"}</MenuItem>
        </Select>

    
      <Button className={classes.button} variant="contained" onClick={goBackToSignIn}>
        back
      </Button>

      <Button key={"nextBtn"}  className={classes.button} variant="contained" onClick={nextStep}>
        next
      </Button>

    </Paper>
  );
}
