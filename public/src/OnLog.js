import React, { useEffect, useRef, useState } from "react";

import UserDisplay from './Components/UserDisplay';
import FrontPage from "./Components/auth/FrontPage";
import RunningTodos from "./Components/todo/RuningTodos";
import Graph from "./Components/ActivityGraph"
import Calander from './Components/Calander'
import MyEditor from './Components/MyEditor'
import io from 'socket.io-client'
import { animated, useChain, useSpring } from "react-spring";



//i will get the information of the users who are online here 

// from the state when im locked in, set my data 
export default function OnLog({ state }) {


  const [step, setStep] = useState(0);
  // const [users, setUser] = useState([]);
  const { auth, note } = state


  useEffect(() => {
    if (auth.isAuthenticated) {
      let socket = io("localhost:5000");
      socket.emit('join', { userId: auth.user.id, name: auth.user.name })
      setStep(2)
    } else setStep(1)

  }, [auth.isAuthenticated])



  const noteProps = useSpring({
    to: { transform: note.openNote ? `translate3d(0%,0,0) scale(1)` : `translate3d(-50%,0,0) scale(0)`, opacity: 1, display: "block" },
    delay: 200
  })

  const spring1 = useSpring({
    from: { opacity: 0 },
    to: async (next, cancel) => {
      await next({ opacity: 1 })
    }

  }

  )
  const spring2 = useSpring({
    from: { opacity: 0, transform: `translate3d(0,50%,0) scale(${0})` },
    to: async (next, cancel) => {
      await next({ opacity: 1, transform: `translate3d(0%,0,0) scale(${1})` })
    }

  }
  )

  const spring3 = useSpring({
    from: { opacity: 0, transform: `translate3d(0,-50%,0) `, display: "none" },
    to: { transform: `translate3d(0%,0,0)`, opacity: 1, display: "block" },
    delay: 100
  }
  )

  const style = {
    container: {
      display: 'flex', overflowX: "hidden"

    },
    item: {
      margin: "auto", alignSelf: "center"

    },
    itemTwo: {
      width: '10vw',
      margin: "auto",
      display: 'flex'
    }
  }

  const OpenEditor = () => {

    if (note.openNote) {
      return (
        <animated.div style={noteProps} ><MyEditor state={state} /></animated.div>)
    }
    else {
      return (<React.Fragment />)
    }
  }

  // the active page should be added about the todos
  const width = "92vw"

  switch (step) {
    case 0:
      return (<></>)
    case 1:
      return (<FrontPage state={state}></FrontPage>)
    case 2:
      return (
        <React.Fragment>
          <div style={style.container}>

            <div style={{ margin: "auto" }}>

              <animated.div style={spring3}>
                <div style={{ height: "15vh", width: width, margin: "auto" }}>
                  < Graph state={state} /></div>
              </animated.div>

              <animated.div style={spring1} >
                <RunningTodos width={width} state={state}></RunningTodos>
              </animated.div>

              <OpenEditor />



              <animated.div style={spring2} className="calender">
                <Calander state={state} />
              </animated.div>
            </div>
 
            <animated.div style={{ ...style.item }}>
              <UserDisplay state={state} />
            </animated.div>

          </div>
        </React.Fragment>
      )

  }

}



  // move this to items 
  // happens when the item is changed 

  // useEffect(() => {
  //   const items = [...state.item.Today]

  //   if (auth.isAuthenticated) {


  //     let done = 0, notDone = 0

  //     const isCompleted = items.reduce((a, c) => {
  //       c.isCompleted ? a.done++ : a.notDone++
  //       return a
  //     }, { done, notDone })
  //     console.log('sending this item ',auth.user.id, isCompleted )
  //     socket.emit('item', { userId: auth.user.id, isCompleted })


  //   }

  // }, [state.item ])

  // socket.on("users", users => { setUser(users) })

  // console.log("socket =?>", socket)

  // console.log(users)