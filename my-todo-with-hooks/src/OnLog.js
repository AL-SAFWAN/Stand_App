import React, { useEffect, useState } from "react";

import UserDisplay from './Components/UserDisplay';
import FrontPage from "./Components/auth/FrontPage";
import RunningTodos from "./Components/RuningTodos";
import Graph from "./Components/ActivityGraph/Graph"
import Calander from './Components/Calander'

export default function OnLog({state}) {
  const [step, setStep] = useState(1);
  useEffect(() => {
    console.log("is auth UPDATED to switch page")

    if (state.auth.isAuthenticated) {
      setStep(2)
    } else setStep(1)
    
  }, [state.auth.isAuthenticated])

  const style = {
    Calander: {height: "400px"},
    container: {
      display: 'flex'
    },
    item: { width: '68%' },
    itemTwo: {
      width: '21%',
      display: 'flex'
    }
  }

  // the activy page should be added about the todos
  switch (step) {
    case 1:
      return (<FrontPage state = {state}></FrontPage>)
    case 2:
      return (
        <React.Fragment>

          <div style={style.container}>
            <div style={style.item}>
              <UserDisplay state = {state}/>
            </div><div style={style.itemTwo}>
              < Graph state = {state}/>
            </div>
          </div>
          <RunningTodos state = {state}></RunningTodos>
    {/* add a calander here  */}
    <div style={style.Calander}>
        <Calander state = {state}/></div>
        </React.Fragment>
      )

  }

}