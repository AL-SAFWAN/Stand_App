import React, { useEffect, useState } from "react";

import UserDisplay from './Components/UserDisplay';
import FrontPage from "./Components/auth/FrontPage";
import RunningTodos from "./Components/todo/RuningTodos";
import Graph from "./Components/ActivityGraph/Graph"
import Calander from './Components/Calander'
import MyEditor from './Components/MyEditor'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

export default function OnLog() {
  const state = useSelector(state => state);
  const [step, setStep] = useState(1);
  useEffect(() => {
    if (state.auth.isAuthenticated) {
      setStep(2)
    } else setStep(1)

  }, [state.auth.isAuthenticated])

  const style = {
    container: {
      display: 'flex',
      padding: " 10px 0px 10px 38px"
    },
    item: { width: '60vw' },
    itemTwo: {
      width: '19vw',
      margin: "auto",
      display: 'flex'
    }
  }

  const OpenEditor = () => {

    if (state.note.openNote) {
      return (<MyEditor state={state} />)
    }
    else {
      return (<React.Fragment />)
    }
  }

  // the activy page should be added about the todos
  switch (step) {
    case 1:
      return (<FrontPage state={state}></FrontPage>)
    case 2:
      return (
        <React.Fragment>

          <div style={style.container}>
            <div style={style.item}><UserDisplay state={state} /></div>
            <div style={style.itemTwo}>< Graph state={state} /> </div>

          </div>
          <RunningTodos state={state}></RunningTodos>
          {/* add a calander here  */}
          <OpenEditor />
          <div className="calender">
            <Calander state={state} /></div>
        </React.Fragment>
      )

  }

}