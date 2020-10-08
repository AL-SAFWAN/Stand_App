import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { useSpring, animated, config } from 'react-spring'
import TextField from '@material-ui/core/TextField';
import { loadSupportUser } from '../../action/supportDateAction';
import { Avatar } from '@material-ui/core';

const compareForToday = (array) => {


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

    useEffect(() => {
        dispatch(() => { loadSupportUser(dispatch) })

    }, [])



    const standUp = compareForToday([...state.support["Stand Up"]])

    console.log(standUp)

    const [openTable, setOpenTable] = useState(false)
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

                    <Badge openTable={openTable} array={standUp} name="Stand Up Today" className="marginTop" />

                </div>
            </div>
        </>
    )
}




const Badge = ({ array, name, openTable }) => {

    const { ...rest } = useSpring({
        // ref: springRef,
        config: config.slow,
        opacity: openTable ? 1 : 0,
        // Add the new height 
        height: openTable ? (85 * array.length) + 20 : 0,
        from: { opacity: 0, height: 0 },
        overflow: "hidden"
    })

    if (array.length === 0) return <>
        <div className="user-card" >
            {/* <div className="user-icon"></div> */}

            <div className="text-container">

                <div className="support-type"> {name}</div>

                <div className="username"> NotAssign</div>

            </div> </div>

    </>



    return (<>
        <div className="user-card">
            {/* user the avatar her
                check if the file name is passes into this page
            */}
          
                <Avatar src={array[0].filePath} style= {{ width: "5vh",
    height: "5vh"}} className="user-icon"> {array[0].name}</Avatar>
           

            <div className="text-container">

                <div className="support-type"> {name}</div>
                {array.length > 0 &&
                    <div className="username"> {array[0].name} </div>}

            </div> </div>

        <animated.div className="div-outer-container" style={{ ...rest }}>

            <div style={{
                margin: "auto",
                width: " 80%",
                paddingBottom: 18
            }} key={name} >

                {/* here i'll map the slice array  */}
                {array.map((user, i) => {
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




