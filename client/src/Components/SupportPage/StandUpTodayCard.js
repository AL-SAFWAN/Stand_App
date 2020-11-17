import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { useSpring, animated, config } from 'react-spring'
import TextField from '@material-ui/core/TextField';
import { loadSupportUser } from '../../action/supportDateAction';
import { Avatar } from '@material-ui/core';


const checkPresentersToday = (array) => {
    const today = new moment().local().format("YYYY-MM-DD")
    const todayInLine = []
    array.forEach(user => {
        if ((user.start <= today) && (user.end >= today)) {
            todayInLine.push(user)
        }
    })
    return todayInLine
}


export default function StandUpTodayCard({ state }) {

    const dispatch = useDispatch();
    const [isTableOpen, setOpenTable] = useState(false)

    useEffect(() => {
        dispatch(() => { loadSupportUser(dispatch) })
    }, [])

    const standUpUsers = checkPresentersToday([...state.support["Stand Up"]])

    return (
        <>
            <div className="support-table-card"
                onMouseEnter={() => {
                    setOpenTable(true)
                }
                }
                onMouseLeave={() => {
                    setOpenTable(false)
                }}
            >
                <div>
                    <StandUpUserTable isTableOpen={isTableOpen} userArray={standUpUsers} name="Stand Up Today" className="marginTop" />
                </div>
            </div>
        </>
    )
}


const StandUpUserTable = ({ userArray, name, isTableOpen }) => {

    const { ...rest } = useSpring({
        config: config.slow,
        opacity: isTableOpen ? 1 : 0,
        height: isTableOpen ? (85 * userArray.length) + 20 : 0,
        from: { opacity: 0, height: 0 },
        overflow: "hidden"
    })

    if (userArray.length === 0) return <>
        <div className="user-card" >
            <div className="text-container">
                <div className="support-type"> {name}</div>
                <div className="username"> NotAssign</div>
            </div> </div>
    </>

    return (<>

        <div className="user-card">
            <Avatar src={userArray[0].filePath} style={{ width: 65, height: 65, fontSize: 14 }} className="user-icon"> {userArray[0].name}</Avatar>
            <div className="text-container">

                <div className="support-type"> {name}</div>
                {userArray.length > 0 &&
                    <div className="username"> {userArray[0].name} </div>}
            </div>
        </div>

        <animated.div className="div-outer-container" style={{ ...rest }}>

            <div style={{
                margin: "auto",
                width: " 80%",
                paddingBottom: 18
            }} key={name} >

                {userArray.map((user, i) => {

                    return (
                        <div className="allItems" key={i + user.name}>

                            <div className="textField-display">
                                <TextField fullWidth id={`standard-basic +${i}`} label="" value={user.name} />
                            </div>
                            <div className="date-item">
                                <TextField
                                    fullWidth
                                    id="datetime-local"
                                    label="start"
                                    type="date"
                                    value={user.start}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                            <div className="date-item">
                                <TextField
                                    fullWidth
                                    id="datetime-local"
                                    label="end"
                                    type="date"
                                    value={user.end}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>

                        </div>)

                }
                )}
            </div>
        </animated.div >
    </>
    )

}




