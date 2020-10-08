import React, { useState} from "react";
import "./index.css"
import FactoryCard from './FactoryCard'
import { animated, useSprings, interpolate, useSpring, config } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import FactorySideCard from './FactorySideCard'
import { Link } from "react-router-dom";




// introduction to explain what is going here ]
//1. users are created from the state 



export default function Index({ userData }) {


    return (
        <Users userData={userData} />

    )
}

const Users = ({ userData }) => {

    // using the totol length here 
    const to = i => ({ x: ((((i * (1.1)) / userData.length) * 80) - 40), y: 0, zIndex: 0, scale: 0.5, r: -10 + Math.random() * 20, delay: i * 100, width: 30 })
    const from = i => ({ x: -200, r: 0, scale: 1, y: 0, width: 30, zIndex: 0 })
    // This is being used down there in the view, it interpolates rotation and scale into a css transform
    const transformFn = (r, s) => ` rotateX(10deg) rotateY(${r}deg) rotateZ(${r / 15}deg) scale(${s})`



    let topArr = userData.map((_, i) => i)
    let centerArr = []
    let lowArr = []

    // --side card sprint --
    const [{ opacityL, yL, xL }, setLeftSide] = useSpring(() => ({ opacityL: 0, yL: 0, xL: -40, config: config.wobbly }))
    const [{ opacityR, yR, xR }, setRightSide] = useSpring(() => ({ opacityR: 0, yR: -60, xR: +140, config: config.wobbly }))
    //----

    const User = () => {
        const [yesterday, setYesterday] = useState([])
        const [blocker, setBlocker] = useState([])
        const [submit, setSubmit] = useState(false)
        const [start, setStart] = useState(true)

        const [drag, setDrag] = React.useState(false)

        // maybe optimise the backend using sockets 
        const users = userData.map((user, i) => <FactoryCard name={user.name} userId={user.id} filePath ={user.filePath}/>) 


        const [props, set] = useSprings(users.length, i => ({ ...to(i), from: from(i) }))
        const submitProps = useSpring({ opacity: submit ? 1 : 0, scale: submit ? 1 : 0, config: config.wobbly })
        const startProps = useSpring({ opacity: start ? 1 : 0, scale: start ? 1 : 0, config: { ...config.wobbly } })

        // applying motion
        const setCenter = (index) => {
            setSubmit(false)
            setStart(false)

            console.log(

            )

            if (userData[index].Yesterday.length === 0) {
                setYesterday([])
                setLeftSide({ opacityL: 1, yL: -3, xL: -40 })
            } else {

                setYesterday(userData[index].Yesterday)
                setLeftSide({ opacityL: 1, yL: 29, xL: 1 })
            }
            if (userData[index].Blocker.length === 0){
                setBlocker([])
                setRightSide({ opacityR: 1, yR: -66, xR: 140 })
            }else{
                
            setBlocker(userData[index].Blocker)
            setRightSide({ opacityR: 1, yR: -64, xR: 78 })
            }

            set(i => {
                if (index !== i) return
                return ({
                    x: 0, y: 28, scale: 1, zIndex: userData.length - i, width: 50, r: 0, config: config.slow
                })
            })
        }

        const setLow = (index) => {
            if (lowArr.length === userData.length) {
                console.log("hide the side card")
                setSubmit(true)

                setLeftSide({ opacityL: 1, yL: -3, xL: -40 })
                setRightSide({ opacityR: 1, yR: -66, xR: 140 })
            }

            set(i => {
                if (index !== i) return
                return ({
                    x: -((((i * (1.1)) / userData.length) * 80) - 40), y: 73, zIndex: userData.length - i, scale: 0.5, width: 30, r: -10 + Math.random() * 20, config: config.slow
                })
            })
        }
        const setTop = (index) => {

            set(i => {
                if (index !== i) return
                return ({ x: ((((i * (1.1)) / userData.length) * 80) - 40), y: 0, zIndex: 0, scale: 0.5, r: -10 + Math.random() * 20, delay: i * 100, width: 30, config: config.slow })
            })

            if (topArr.length === userData.length) {
                setTimeout(function () {

                    setStart(true)
                    setLeftSide({ opacityL: 1, yL: -3, xL: -40 })
                    setRightSide({ opacityR: 1, yR: -66, xR: 140 })

                }, 1050);
            }

        }
        // updating the array
        const moveCenterToLow = () => {
            let removed = centerArr.pop()
            if (removed !== undefined) {
                lowArr.unshift(removed)
                setLow(removed)
            }
        }
        const moveToptoCenter = () => {
            let removed = topArr.pop()
            if (removed !== undefined) {
                centerArr.unshift(removed)
                setCenter(removed)

            }
        }
        const moveLowToCenter = () => {
            let removed = lowArr.pop()
            if (removed !== undefined) {
                centerArr.unshift(removed)
                setCenter(removed)
            }
        }
        const moveCenterToTop = () => {
            let removed = centerArr.pop()
            if (removed !== undefined) {
                topArr.unshift(removed)
                setTop(removed)
            }
        }

        const bind = useGesture(
            {
                onDragStart: () => setDrag(true),
                onDrag: ({ args: [index], down, xy: [x, y], direction: [dx, dy], movement: [mx, my] }) => {

                    if (dy < 0) {
                        if (centerArr.length === 0 || centerArr.length === 1) {
                            // moveLowToCenter()
                            const pos = lowArr.indexOf(index)               // find the posistion of the card you are holding in the topArr
                            if (pos !== -1) {
                                // slice the array of the top
                                let [removed] = lowArr.splice(pos, 1)       // remove it from the array 
                                //move it to the center 
                                centerArr.unshift(removed)                  // add  to the centerArr
                                setCenter(index)                            // set to center posistion 
                            }
                        }
                        if (centerArr.length === 2) {                      // if the center has 2 cars 
                            moveCenterToTop()
                        }
                    }

                    if (dy > 0) {
                        // if the center part doesn't have a card or has one the preform this 
                        if (centerArr.length === 0 || centerArr.length === 1) {

                            const pos = topArr.indexOf(index)               // find the posistion of the card you are holding in the topArr
                            if (pos !== -1) {
                                // slice the array of the top
                                let [removed] = topArr.splice(pos, 1)       // remove it from the array 
                                //move it to the center 
                                centerArr.unshift(removed)                  // add  to the centerArr
                                setCenter(index)                            // set to center posistion 
                            }
                        }
                        if (centerArr.length === 2) {                      // if the center has 2 cars 
                            moveCenterToLow()
                        }
                    }
                    if (my > 250) {                                        // check if the card is pulled 
                        if (centerArr.length === 1) {                      // check if there is a card at the middle
                            moveCenterToLow()
                        }
                        if (!down && centerArr.length === 0) {             // is there any card in the center and is it click off 
                            moveToptoCenter()
                        }
                    }
                },
                onDragEnd: () => setDrag(false),
                // onDrag: ({ args: [index] }) => {
            }
        )

        const bindWheel = useGesture(
            {

                onWheel: ({ args: [index], down, xy: [x, y], movement: [mx, my], direction: [dx, dy], first }) => {
                    if (my >= 100 && first) {
                        // if the center part doesn't have a card or has one the preform this 
                        if (centerArr.length === 0 || centerArr.length === 1) {
                            moveToptoCenter()
                        }
                        if (centerArr.length === 2 || topArr.length === 0) {                      // if the center has 2 cars 
                            moveCenterToLow()
                        }
                    }
                    if (my <= -100 && first) {
                        if (centerArr.length === 0 || centerArr.length === 1) {
                            moveLowToCenter()
                        }
                        if (centerArr.length === 2 || lowArr.length === 0) {                      // if the center has 2 cars 
                            moveCenterToTop()
                        }
                    }
                }
            }, { domTarget: window }
        )

        return (<>
            <FactorySideCard style={{ opacityL, transform: interpolate([xL, yL], (x, y) => `translate3d(${x}vw,${y}vh,0px)`) }} setArray={setYesterday} array={yesterday} name={"Yesterday"} />

            <animated.div
                style={{
                    ...submitProps,
                    opacity: submitProps.opacity,
                    transform: submitProps.scale.interpolate(s => `translate3d(40vw, 30vh, 0px) scale(${s})`),
                    position: "absolute",
                    // transform: "",
                    width: "13vh",
                    height: "14vh",
                    borderRadius: "50%",
                    margin: "1vh",
                    backgroundColor: "#3f51b5",
                    color: "white",
                    textAlign: "center",
                    fontSize: "3.7vh",
                    marginLeft: "3vw",
                    padding: "5vh"
                }}
            > <Link to='/'>
                <div style={{marginTop : "4vh"}}></div>
                    <p>Finished</p>
                    </Link>
            </animated.div>

            <animated.div
                style={{
                    opacity: startProps.opacity,
                    transform: startProps.scale.interpolate(s => `translate3d(70vw, 30vh, 0px) scale(${s})`),
                    position: "absolute",
                    // transform: "",
                    width: "30vh",
                    height: "30vh",
                    borderRadius: "50%",
                    margin: "1vh",
                    backgroundColor: "#3f51b5",
                    color: "white",
                    textAlign: "left",
                    fontSize: "5.5vh",
                    marginLeft: "3vw",
                    padding: "21vh"
                }}
            >
                <p>Drag Or Scroll A Card To Start  </p>

            </animated.div>

            <div className="formDiv">

                <div>{props.map(({ x, y, r, scale, zIndex, width }, i) => (
                    <animated.div {...bindWheel()} className={`${drag ? 'dragging' : ''}`} key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}vw,${y}vh,0px)`), position: "relative", zIndex, margin: "auto" }}>
                        <animated.div {...bind(i)} style={{ transform: interpolate([r, scale], transformFn), width: width.interpolate((w) => `${w}vw`), margin: "auto" }} >{users[i]} </animated.div>
                    </animated.div>
                ))} </div>
            </div>
            <FactorySideCard style={{ opacityR, transform: interpolate([xR, yR], (x, y) => `translate3d(${x}vw,${y}vh,0px)`) }} setArray={setBlocker} array={blocker} name={"blocker"} />

        </>

        )
    }
    return (

        <User />

    )
}

// first we need to make the card
// the card will take in the user information to be displayed 
// the card will take in information via a text field and will be sored in an expanable table which can be edited if needed ]

