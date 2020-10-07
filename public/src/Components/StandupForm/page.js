
import React, { useEffect, useRef, useState } from 'react'
import StandUpTodayCard from '../SupportPage/StandUpTodayCard'
import { useSpring, animated, useTransition } from 'react-spring'
import { useDrag, useGesture } from 'react-use-gesture'
import StandupForm from './Form'


import { useDispatch } from 'react-redux'
import { loadUsersActivity } from '../../action/userActivityAction'




export default function Page({ state }) {

    const [toggle, setToggle] = useState(true)
    const dispatch = useDispatch();
    const isMountedRef = useIsMountedRef();

    function useIsMountedRef() {
        const isMountedRef = useRef(null);
        useEffect(() => {
            isMountedRef.current = true;
            return () => isMountedRef.current = false;
        });
        return isMountedRef;
    }

    useEffect(() => {
        if (isMountedRef.current) {
            dispatch(() => { loadUsersActivity(dispatch) })
        }
    }, [isMountedRef])


    return (
        <AnimationTransition toggle={toggle} setToggle={setToggle} state={state} />
    )

}





const AnimationTransition = ({ toggle, setToggle, state }) => {

    console.log("userDAte-index-func")

    const [userData, setUserData] = useState([])



    useEffect(() => {

        const userData = []
        Object.values(state.userAcitvity).map(arr => {
            return Object.values(arr)
        }).forEach(arr => arr.forEach(user => userData.push({ ...user })))
        setUserData(userData)

    }, [toggle])




    const transition = useTransition(
        toggle, null, {
        from: { opacity: 0, transform: 'translate3d(0,100%,0)', s: 0 },
        enter: item => async (next, cancel) => {
            await next({ opacity: 1 })
            await next({ transform: 'translate3d(0%,0,0)' })
            await next({ s: 1 })
        },

        leave: { display: "none" },

    }
    )



    // the way transition works it need to take in an array of the item which you want to apply
    // the animation, then you would call that and run the animation, based on the array  
    return (transition.map(({ item, key, props: { s, ...props } }, i) => {
        return item
            ? <SupportPage key={"start-pageIn"} setToggle={setToggle} props={props} state={state} i={i} s={s} />
            : <animated.div style={{ ...props, overflow: "hidden" }} key={"animation-page"}>  <StandupForm userData={userData} /></animated.div>

    })
    )
}

const SupportPage = ({ setToggle, props, state, i, s }) => {
    const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

    const bind = useDrag(({ down, movement, velocity }) => {

        set({ xy: down ? movement : [0, 0] })
        const [x, y] = movement

        if (y > 300 || y < -300) {

            setToggle(false)
        }
        // have an if statement to trigger the the page transition
        // based on the xy values 


    }, {
        bounds: { left: -100, right: 100, top: -350, bottom: 350 },
        rubberband: true
    })

    return (
        <animated.div style={{
            display: "flex",
            flexDirection: "row",
            height: "50vh",
            padding: "10vw",
            ...props
        }} key={"start-page"}>
            <StandUpTodayCard state={state} />


            <animated.div
                {...bind()}

                style={{
                    transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`),
                    margin: "auto"
                }}

            >
                <animated.div
                    style={{
                        transform: s.interpolate(s => `scale(${s})`),
                        width: "13vh",
                        height: "14vh",
                        borderRadius: "50%",
                        margin: "1vh",
                        backgroundColor: "#3f51b5",
                        alignSelf: "center",
                        color: "white",
                        textAlign: "center",
                        fontSize: "4.2vh",
                        marginLeft: "3vw",
                        padding: "5vh"
                    }}
                >
                    <p>Pull To</p>
                    <p>Start</p>
                </animated.div>

            </animated.div>
        </animated.div>
    )

}
