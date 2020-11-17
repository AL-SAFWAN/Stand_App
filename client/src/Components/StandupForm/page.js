
import React, { useEffect, useRef, useState } from 'react'
import StandUpTodayCard from '../SupportPage/StandUpTodayCard'
import { useSpring, animated, useTransition } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import StandupForm from './FormAnimation'


import { useDispatch } from 'react-redux'
import { loadUsersActivity } from '../../action/userActivityAction'




export default function Page({ state }) {

    const [triggerPageSwitch, setTriggerPageSwitch] = useState(true)
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
        <PageAnimationTransition triggerPageSwitch={triggerPageSwitch} setTriggerPageSwitch={setTriggerPageSwitch} state={state} />
    )

}





const PageAnimationTransition = ({ triggerPageSwitch, setTriggerPageSwitch, state }) => {

    const [usersArr, setUserData] = useState([])

    useEffect(() => {
        const userData = []
        Object.values(state.userAcitvity).map(arr => {
            return Object.values(arr)
        }).forEach(arr => arr.forEach(user => userData.push({ ...user })))
        setUserData(userData)

    }, [triggerPageSwitch])

    const transition = useTransition(
        triggerPageSwitch, null, {
        from: { opacity: 0, transform: 'translate3d(0,100%,0)', s: 0 },
        enter: item => async (next, cancel) => {
            await next({ opacity: 1 })
            await next({ transform: 'translate3d(0%,0,0)' })
            await next({ s: 1 })
        },
        leave: { display: "none" },

    }
    )
    return (transition.map(({ item, key, props: { s, ...props } }, i) => {
        return item
            ? <SupportPage key={"start-pageIn"} setTriggerPageSwitch={setTriggerPageSwitch} props={props} state={state}  s={s} />
            : <animated.div style={{ ...props, overflow: "hidden" }} key={"animation-page"}>  <StandupForm usersData={usersArr} /></animated.div>
    })
    )
}

const SupportPage = ({ setTriggerPageSwitch, props, state,  s }) => {
    const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

    const bind = useDrag(({ down, movement }) => {
        set({ xy: down ? movement : [0, 0] })
        const [_, y] = movement
        if (y > 300 || y < -300) {
            setTriggerPageSwitch(false)
        }
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
