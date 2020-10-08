import React, { useState } from "react";
import {
  Paper,
  TextField,
  Typography,
  Button,
  Avatar,
  FormControl
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
    marginTop: 40
  }
}));



export default function FormUserDetails({
  setStep,
  nextStep,
  values,
  setValue,
  handleChang,
  uploadedFile,
  setUploadedFile
}) {



  const goBack = () => {

    setStep(1);
  };

  const classes = useStyles();
  console.log("In user form etailes");



  const [file, setFile] = useState('')
  const [fileName, setFileName] = useState('')

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
    setFileName(e.target.files[0].name)
  
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
          style={{ paddingTop: 40 }}
        >
          Hello Create your account
      </Typography>

        <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-around', margin: "auto", width: 350, }}>

          {uploadedFile ?

            <Avatar src style={{ width: 65, height: 65, fontSize: 14, margin: 5 }} src={uploadedFile.filePath} alt={values.name} > {values.name}</Avatar>
            :
            <Avatar style={{ width: 65, height: 65, fontSize: 14, margin: 5 }} > {values.name}</Avatar>
          }


          <input
            accept="image/*"
            style={{ display: "none" }}
            id="contained-button-file"
            multiple
            type="file"
            onChange={onChange}
          />
          <label htmlFor="contained-button-file">

            {/* <TextField
        id={"confirmPassword"}
        type="password"
        autoComplete="current-password"
        label={"file name"}
        style={{marginBottom: 3}}
        value={values.confirmPassword}
        onChange={e => setValue.setConfirmPassword(e.target.value)}
      /> */}

            <Button variant="contained" color="primary" component="span" >
              Upload Image
        </Button>

        <Button style ={{marginLeft: 5}} variant="contained" onClick={onSubmit}>
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




      
      <Button className={classes.button} variant="contained" onClick={goBack}>
        back
      </Button>

      <Button className={classes.button} variant="contained" onClick={nextStep}>
        next
      </Button>
      
    </Paper>
  );
}
