import React, { useState } from "react";
import FormUserDetails from "./FormUserDetails";
import Confirm from "./Confirm";

export default function UserForm({ setStep }) {

  const [formStep, setFormStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uploadedFile, setUploadedFile] = useState('')
  const [selectedName,setSelectedName] = useState('user')
  

  const nextStep = () => {
    setFormStep(formStep + 1 );
  };

  const preStep = () => {
    setFormStep(formStep - 1);
  };

  const setValue = { setName, setEmail, setPassword };
  const values = { name, email, password  };


  switch (formStep) {
    case 1:
      return (
        <FormUserDetails
          setStep={setStep}
          nextStep={nextStep}
          preStep={preStep}
          setValue={setValue}
          values={values}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          selectedName={selectedName}
          setSelectedName={setSelectedName}
        />
      );
    case 2:
      return (
        <Confirm
          uploadedFile={uploadedFile}
          setStep={setStep}
          nextStep={nextStep}
          preStep={preStep}
          values={values}
          setValue={setValue}
          selectedName={selectedName}
        />
      );
      default:
        return <></>
  }
}
