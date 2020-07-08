import React, { useState } from "react";
import FormUserDetails from "./FormUserDetails";
import FormPersonalDetails from "./FormPersonalDetails";
import Confirm from "./Confirm";

export default function UserForm({ setStep }) {
  const [state, setState] = useState({
    step: 1
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const setStep = ()=>{
  //     setStep(1)
  // }
  console.log("copy");

  const nextStep = () => {
    setState({ step: step + 1 });
  };

  const preStep = () => {
    setState({ step: step - 1 });
  };

  const handleChange = e => {
    console.log(e.target.name);
    console.log(e.target.value);
    // setState( state[e.target.name] = e.target.value)
  };

  const { step } = state;
  const setValue = { setName, setEmail, setPassword, setConfirmPassword };
  const values = { name, email, password, confirmPassword };

  console.log(state);
  switch (step) {
    case 1:
      return (
        <FormUserDetails
          setStep={setStep}
          nextStep={nextStep}
          preStep={preStep}
          setValue={setValue}
          values={values}
          handleChange={handleChange}
        />
      );
    // case 2:
    //   return (
    //     <FormPersonalDetails
    //       nextStep={nextStep}
    //       preStep={preStep}
    //       values={values}
    //       setValue={setValue}
    //       handleChange={handleChange}
    //     />
    //   );
    case 2:
      return (
        <Confirm
          setStep={setStep}
          nextStep={nextStep}
          preStep={preStep}
          values={values}
          setValue={setValue}
          handleChange={handleChange}
        />
      );
  }
}
