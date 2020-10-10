import React, { useEffect, useState } from 'react'
import "./Activity.css"
import io from 'socket.io-client'
import { animated, config, interpolate, useSpring, useSprings, useTransition } from 'react-spring'
import Avatar from '@material-ui/core/Avatar';


const Item = ({ user, i, set }) => {
    console.log(user)
    const [above, setAbove] = useState(false)
    const { o, x } = useSpring({
        o: above ? 1 : 0,
        x: above ? -120 : -85
    }
    )

    let done = user.result.done == null ? 0 : user.result.done
    let notDone = user.result.notDone == null ? 0 : user.result.notDone
    var diff = done - notDone
    const color = diff > 0 ? "rgb(149, 252, 149)" : "#93d9d9 "

    return (
        <div
            className="badge-div" key={i}
            onMouseEnter={() => { setAbove(true) }}
            onMouseLeave={() => { setAbove(false) }}
        >
            <animated.div
                style={{
                    opacity: o,
                    transform: x.interpolate((x) => `translateX(${x}px)`),
                }}
                className="hover-info" >
                <div className="div-arrow"></div>
                <div style ={{alignSelf: "center", textDecoration: "underline"}}>{user.name}</div>
                <div> Done = <strong>{done}</strong></div>
                <div> Not Done = <strong>{notDone}</strong></div>
            </animated.div>
        
            <div className="badge"
                style={{ border: `2px solid ${color}` }}
                onClick={() => { setAbove(!above) }}
            >
                {/* I need to set the img here */}
                <Avatar style ={{width: 65, height: 65, fontSize: 14}} src ={user.filePath} > {user.name}</Avatar>
            </div>


        </div>)
}


const MakeUsers = ({ props, userItems, set, clicked, onClicked }) => {

    console.log("in make users", clicked)


    const transitions = useTransition(clicked, p => p, {

        from: { opacity: 0, fontSize: 0 },
        enter: { opacity: 1, fontSize: 40, marginTop:15 },
        leave: { opacity: 0, fontSize: 0 },
        config: config.stiff,

    })

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            flexFlow: "wrap-reverse",

        }}>
            <div>
                {props.map(({ x, y, scale, display, height, opacity }, i) => {
                    return <animated.div key={i} style={{ opacity, height, display, transform: interpolate([x, y], (x, y) => `translate3d(${x}vw,${y}vh,0px)`), margin: "auto" }}>
                        <Item key={userItems[i].name + i} user={userItems[i]} i={i} set={set} />
                    </animated.div>
                })
                }
                <div
                    style={{ textAlign: "center", zIndex: 20 }}
                    // {...bind()} 
                    onClick={() => {
                        onClicked(!clicked)

                    }}
                >
                    {transitions.map(({ item, props, key }) => {

                        return<animated.div key={key} style={{ ...props }}><div className="movingButtons">
                            {item? "+" :"-" }
                        
                        </div></animated.div>
                    })}

                </div>

            </div>



        </div>


    )
}

// ({ config: config.wobbly, x: -1, opacity: 0, y: (20), delay: 10, height: 0 })

export default function ActivityGraph({ state }) {


    const [allActiveUser, setAllActiveUser] = useState([]);
    const [users, setUsers] = useState([]);

    const nonActiveUserIndex = []
 

    let socket;

    useEffect(() => {
        socket = io("localhost:5000");
        socket.emit("getAllUser", users => {
            setUsers(users)
        })
        socket.emit("getAllActiveUser", users => {
            setAllActiveUser(users)
        })






    }, [])

    if (allActiveUser.length > 0) {
        users.forEach((user, i) => {
            const found = allActiveUser.some(
                activeUser => {
                    return user.name === activeUser.name
                })
            if (!found) {
                nonActiveUserIndex.push(i)
            }
        })
    }



    const [clicked, setClicked] = useState(false)

    const spring = useSpring({
        // opacity: bg ? 0 : 0,
        backgroundColor: clicked ? "rgba(123, 151, 234, 0.05)" : " rgba(123, 151, 234, 0.19)",
        // config: { mass: 5, tension: 500, friction: 80 }
    })

    const to = i => ({ x: 0, y: (0), scale: 1, delay: i * 50, display: "block", height: 85, opacity: 1 })
    const from = i => ({ x: 0, y: -5, scale: 1, display: "none", height: 0, opacity: 0 })
    const remove = i => ({ x:0 , opacity: 0, y: (-4), delay: 50 * i, height: 0 })

    const [props, set] = useSprings(users.length, i => ({ config: config.stiff, ...to(i), from: from(i) }))

    const onClicked = (val) => {


        setClicked(val)

        console.log(val)
        if (val) {
            set(i => {
                console.log(i, nonActiveUserIndex.includes(i))
                if (!nonActiveUserIndex.includes(i)) return
                return remove(users.length-i)
            })
        } else {
            set(i => {
                return to(i)
            })
        }

    }

    return (
        <animated.div
            style={spring}
            className="aqua">
            <MakeUsers onClicked={onClicked} props={props} clicked={clicked} userItems={users.sort((a, b) => b.result.done - a.result.done)} set={set} />
        </animated.div>
    )
}

//  sort the users based on activity 

//                <div style={neutral} >
//                 <MakeUsers users={neutralUsers} color={"#abbcf2"} borderColor={} />
//             </div>
//             <div style={blocker} >  <MakeUsers users={blockedUsers} color={"rgb(255, 136, 136)"} borderColor={"#f50057"} /></div>