import React, { useState, useEffect, useRef } from 'react'
import TextField from '@material-ui/core/TextField';
import "./index.css"
import AddCircleIcon from '@material-ui/icons/AddCircle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment'
import { useDispatch } from 'react-redux'
import Chart from 'react-google-charts'
import { IconButton, } from "@material-ui/core";
import { animated, config, useSpring } from 'react-spring'
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import DeleteIcon from "@material-ui/icons/Delete";
import { deleteSupportUser, editSupportUser } from '../../action/supportDateAction';
import { addSupportUser } from '../../action/supportDateAction'
import SupportTodayCard from '../SupportPage/SupportTodayCard'
import StandUpTodayCard from '../SupportPage/StandUpTodayCard'
import { returnErrors } from '../../action/errorAction';
import {  loadUsersActivity } from '../../action/userActivityAction';


export default function Index({ state }) {

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

    // animation here 
    const spring2 = useSpring({
        from: { opacity: 0, transform: `translate3d(50%,0,0) scale(${0})` },
        to: async (next, cancel) => {
            await next({ opacity: 1, transform: `translate3d(0%,0,0) scale(${1})` })
        }

    }
    )

    const spring3 = useSpring({
        from: { opacity: 0, transform: `translate3d(-50%,0,0) scale(${0})` },
        to: async (next, cancel) => {
            await next({ opacity: 1, transform: `translate3d(0%,0,0) scale(${1})` })
        }

    }
    )


    return (<>

        <div style={{ display: "flex", justifyContent: "center", marginRight: "1vw", marginLeft: "1vw" }}>
            <animated.div style={{ ...spring3, display: "flex", flexDirection: "column", marginRight: "1vw", marginLeft: "1vw" }}>

                <div style={{ marginTop: "3vh" }} >
                    <ExpandingForm state={state} name={"1st line"} />
                    <ExpandingForm state={state} name={"2nd line"} />
                    <ExpandingForm state={state} name={"3rd line"} />
                    <ExpandingForm state={state} name={"Stand Up"} />
                </div>

                {/* 

            What data will i need to enter 
            who is on support today and who is doing the stand up 
            -we have 2 information the start and the end 
            |
            `-> this information is sorted by the ascending from the start date 
            - if the start<= today and end>= today -> means that the user is within the today date 
                    -- add them to an array 
            -- sort the array 
            The one with the greatest distance of today to the start date will be displayed, 
            since its already sorted this will be ok 

            */}


                <div style={{ marginTop: "3vh" }}><SupportTodayCard state={state} /></div>
                <div style={{ marginTop: "3vh" }}> <StandUpTodayCard state={state} /></div>
            </animated.div>

            <animated.div style={spring2} className="calenderAdmin"><Cal allUsers={state.support}></Cal></animated.div>
        </div>

    </>)
}
const getSupportType = (supportName) => {
    switch (supportName) {
        case "1st line":
            return 1

        case "2nd line":
            return 2

        case "3rd line":
            return 3

        default:
            return 0
    }
}

const getSupportTypeFromInt = (supportName) => {
    switch (supportName) {
        case 1:
            return "1st Line"

        case 2:
            return "2nd Line"

        case 3:
            return "3rd Line"

        default:
            return "Stand Up"
    }
}



const ExpandingForm = ({ name, state }) => {

    const dispatch = useDispatch();

    const [openTable, setOpenTable] = useState(false)
    const [users, setUsers] = useState([])



    // maybe problem is here 
    // this is for the admin


    useEffect(() => {
        // im setting the user array of the menu selection 
        // this gives me all the user and array 
        const displayArr = [...state.support[name]]
        const userData = []
        Object.values(state.userAcitvity).map(arr => {
            return Object.values(arr)
        }).forEach(arr => arr.forEach(user => userData.push({ id: user.id, name: user.name })
        ))
        // userData.filter(user=> )
        const arr = userData.filter(userMenu => {
            let isUser = true
            displayArr.forEach(displayedUser => {
                if (displayedUser.userId === userMenu.id) {

                    isUser = false
                }
            })
            return isUser
        })
        setUsers(arr)


    }, [state.userAcitvity])



    const { ...rest } = useSpring({
        // ref: springRef,
        config: config.slow,
        opacity: openTable ? 1 : 0,
        height: openTable ? (100 * state.support[name].length) + 40 : 0,
        from: { opacity: 0, height: 0 },
        overflow: "hidden"
    })

    const clickedAdd = (selectedName, start, end, index) => {
        if (typeof (selectedName) === "string" || typeof (selectedName) === "undefined") {

            dispatch(() => returnErrors(`please enter the field: ${name}`, "error", dispatch))

            return
        }
        const user = {
            name: selectedName.name,
            userId: selectedName.id,
            start: start,
            end: end,
            supportType: getSupportType(name)
        }

        dispatch(() => addSupportUser(name, user, dispatch))
        setOpenTable(true)
        const setArr = [...users]
        setArr.splice(index, 1)
        setUsers(setArr)

    }

    const onDelete = (user, index) => {
        const { id } = user
        dispatch(() => deleteSupportUser(name, id, dispatch))


        // need to fix this up when i come back 
        setUsers([...users, user])
        // setAddedUser(setArr)
        // let newArr = allUsers
        // newArr[name] = setArr
        // setAllUsers(newArr)
    }
    return (
        <div className="container"
            key={name}
            onMouseEnter={() => {
                setOpenTable(true)
            }
            }
            onMouseLeave={() => {
                setOpenTable(false)
            }}
        >
            <div   >
                <ExpandingFormHeader state={state} userData={users} clicked={clickedAdd} name={name} />
            </div>

            <animated.div className="div-outer-container" style={{ ...rest }}>
                <div className="div-item-container" key={name} >
                    {state.support[name].map((user, i) => {
                        return (
                            <div className="div-container1" key={i + user.name}>
                                <div className="textField-display">
                                    <TextField fullWidth id={"standard-basic" + i + user.name + name} label="" value={user.name} />
                                </div>
                                <div className="date-item">
                                    <TextField
                                        fullWidth
                                        id="datetime-local"
                                        label="start"
                                        type="date"
                                        value={user.start}
                                        onChange={(e) => {

                                            // use this to set the redux array
                                            const newArr = [...state.support[name]]
                                            newArr[i].start = e.target.value
                                            console.log(newArr)
                                            // send the backend newArr[i]
                                            
                                            dispatch(() => editSupportUser(name, newArr, dispatch, newArr[i]))

                                            // setAddedUser(newArr)
                                            // call here?
                                        }}
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
                                        onChange={(e) => {

                                            // // use this to set the redux array 
                                            const newArr = [...state.support[name]]
                                            newArr[i].end = e.target.value

                                            dispatch(() => editSupportUser(name, newArr, dispatch,newArr[i]))

                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                                <div>
                                    <IconButton onClick={() => { onDelete(user, i) }

                                    }>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </div>)
                    }
                    )}
                </div>
                <div className="div-item-container2">
                    <GanttChart todos={state.support[name]} />
                </div>
            </animated.div >
        </div>
    )

}

// used to produce the form,will i have the information of the last user? 
const ExpandingFormHeader = ({ state, name, userData, clicked }) => {

    const users = [...state.support[name]]
    const lastUser = users.pop()


    const [selectedName, setSelectedName] = useState('');
    // here we are
    // this is where the date is set up 
    // set a difference for the first user, let it be call U1 
    // then from the next user (U1), let the start date for the U1 be the last value for the U2

    const [start, setStartValue] = useState(moment().local().format("YYYY-MM-DD"));
    const [end, setEndValue] = useState(moment().add(1, "days").local().format("YYYY-MM-DD"));

    useEffect(() => {

        if (lastUser !== undefined) {
            // updating to the latest user for the next user to use 
            setStartValue(moment(lastUser.end).add(1, "days").local().format("YYYY-MM-DD"))
            setEndValue(moment(lastUser.end).add(2, "days").local().format("YYYY-MM-DD"))

        } else {
            // when i delete the array i need to change the date to the latest user 
            setStartValue(moment().add(0, "days").local().format("YYYY-MM-DD"))
            setEndValue(moment().add(1, "days").local().format("YYYY-MM-DD"))
        }

    }, [clicked, state.support])



    const setUpdatedValue = (value, at) => {
        if (at === "createdAt") {
            // todo.createdAt = value
            setStartValue(value)
        } else {
            // todo.endAt = value
            setEndValue(value)
        }
    }
    return (
        <>  <div className="div-container">
            <div className="textField">
                <FormControl fullWidth>
                    <InputLabel shrink >
                        {name}
                    </InputLabel>
                    <Select
                        //   labelId="demo-simple-select-placeholder-label-label"
                        //   id="demo-simple-select-placeholder-label"
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value={''}>
                            <em>None</em>
                        </MenuItem>
                        {userData.map((user, index) => {
                            return <MenuItem key={index + user.supportType + user.name} value={index}>{user.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </div>
            <div className="date">
                <TextField
                    id="datetime-local"
                    label="start"
                    type="date"
                    value={start}
                    onChange={e => setUpdatedValue(e.target.value, "createdAt")}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>
            <div className="date">
                <TextField
                    id="datetime-local"
                    label="end"
                    type="date"
                    value={end}
                    onChange={e => setUpdatedValue(e.target.value, "endAt")}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>
            <div className="icon">
                <AddCircleIcon onClick={() => clicked(userData[selectedName], start, end, selectedName)} fontSize="large" />
            </div>
        </div>
        </>
    )
}

function GanttChart({ todos }) {
    if (todos.length === 0) {
        return <></>
    }
    const createEventsFromTodo = (todo) => {
        const { start, end, id, name } = todo
        // const {} = selectedName
        const event =
            [
                id,
                name,
                null,
                moment(start).toDate(),
                moment(end).toDate(),
                null,
                null,
                null
            ]
        return event
    }
    const createEventsFromTodos = (todos) => {
        const events = [[
            { type: 'string', label: 'Task ID' },
            { type: 'string', label: 'Task Name' },
            { type: 'string', label: 'Resource' },
            { type: 'date', label: 'Start Date' },
            { type: 'date', label: 'End Date' },
            { type: 'number', label: 'Duration' },
            { type: 'number', label: 'Percent Complete' },
            { type: 'string', label: 'Dependencies' },
        ]]
        todos.forEach(todo => {
            const event = createEventsFromTodo(todo)
            events.push(event)
        })
        return events
    }
    var data = createEventsFromTodos(todos)

    return (
        <Chart
            chartType="Gantt"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{
                height: 1200,
                gantt: {
                    trackHeight: 83,
                },
            }}
            rootProps={{ 'data-testid': '2' }}
        />

    )
}




const localizer = momentLocalizer(moment);

const ItemToEvent = (item) => {

    const setColor = () => {
        switch (item.supportType) {
            case 0:
                return { color: "lightgreen" }
            case 1:
                return { color: "lightBlue" }
            case 2:
                return { color: "gold" }
            case 3:
                return { color: "red" }
            default: 
            return{color: "white"}
        }
    }

    const event = {
        //   id: item.id,
        //   name: item.name,
        start: moment(item.start).toDate(),
        end: moment(item.end + "T24:00:00").toDate(),

        title: <p style={setColor()}>{getSupportTypeFromInt(item.supportType) + ": " + item.name}</p>
    }
    return event
}

function Cal({ allUsers }) {

    const [events, setEvents] = useState([])
   

    const fetchData = () => {
        var array = []

        Object.values(allUsers).forEach(type => {

            type.forEach((user => {
                array.push(ItemToEvent(user))
            }))
        })

        setEvents(array)
    }
    const onClick = (data) => {
        console.log(data)
        // I can use this to open to view more at the bottom 
    }
    useEffect(() => {
        fetchData()

    }, [allUsers])

    return (
        <Calendar
            defaultDate={moment().toDate()}
            defaultView="month"
            events={events}
            localizer={localizer}
            style={{ height: "80vh" }}
            onSelectEvent={onClick}
        />
    );
}


