import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import "./index.css"
import AddCircleIcon from '@material-ui/icons/AddCircle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { loadUsersActivity } from "../../action/userActivityAction";
import Chart from 'react-google-charts'
import { IconButton, } from "@material-ui/core";
import { animated, config, useSpring, interpolate } from 'react-spring'
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from 'axios';
import { deleteSupportUser, editSupportUser, loadSupportUser } from '../../action/supportDateAction';
import { addSupportUser } from '../../action/supportDateAction'
import { returnErrors } from '../../action/errorAction';
import { GET_ERRORS } from '../../action/type';

export default function Index() {
    const state = useSelector(state => state);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(() => { loadSupportUser(dispatch) })

    }, [])
    console.log(state.support)

    const [allUsers, setAllUsers] = useState({
        "1st line": [],
        "2nd line": [],
        "3rd line": [],
        "Stand Up": []
    })

    return (<>
        <div style={{ display: "flex", marginRight: "1vw", marginLeft: "1vw" }}>
            <div style={{ marginRight: "1vw", marginTop: "3vh" }} >
                <ExpandingForm state={state} name={"1st line"} allUsers={allUsers} setAllUsers={setAllUsers} />
                <ExpandingForm state={state} name={"2nd line"} allUsers={allUsers} setAllUsers={setAllUsers} />
                <ExpandingForm state={state} name={"3rd line"} allUsers={allUsers} setAllUsers={setAllUsers} />
                <ExpandingForm state={state} name={"Stand Up"} allUsers={allUsers} setAllUsers={setAllUsers} />
            </div>
            <div className="calender"><Cal allUsers={state.support}></Cal></div>
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


const ExpandingForm = ({ name, state, allUsers, setAllUsers }) => {

    const [openTable, setOpenTable] = useState(false)
    const [users, setUsers] = useState([])
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(() => { loadUsersActivity(dispatch) })
    }, [])

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
                if (displayedUser.userId == userMenu.id) {

                    isUser = false
                }
            })
            return isUser
        })
        setUsers(arr)
        console.log(arr, userData, displayArr)

    }, [state.userAcitvity])



    const { ...rest } = useSpring({
        // ref: springRef,
        config: config.slow,
        opacity: openTable ? 1 : 0,
        height: openTable ? (100 * state.support[name].length) + 35 : 0,
        from: { opacity: 0, height: 0 },
        overflow: "hidden"
    })

    const clicked = (selectedName, start, end, index) => {
        if (typeof (selectedName) === "string" || typeof (selectedName) === "undefined") {
            console.log(" -ERROR-")
            dispatch({
                type: GET_ERRORS,
                payload: {
                    msg: `please enter the field: ${name}`, id: index
                }
            })
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
                <ExpandingFormHeader userData={users} clicked={clicked} name={name} />
            </div>

            <animated.div className="div-outer-container" style={{ ...rest }}>
                <div className="div-item-container" key={name} >
                    {state.support[name].map((user, i) => {
                        return (
                            <div className="div-container1" key={i + user.name}>
                                <div className="textField-display">
                                    <TextField fullWidth id="standard-basic" label="" value={user.name} />
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
                                            dispatch(() => editSupportUser(name, newArr, dispatch))

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
                                            dispatch(() => editSupportUser(name, newArr, dispatch))
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


const ExpandingFormHeader = ({ name, userData, clicked }) => {
    const [selectedName, setSelectedName] = useState('');
    const [start, setStartValue] = useState(moment().local().format("YYYY-MM-DD"));
    const [end, setEndValue] = useState(moment().add(1, "days").local().format("YYYY-MM-DD"));
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
    console.log("from gannt Chart \n", todos, "\n")
    if (todos.length == 0) {
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
    console.log(data)
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
        switch (item.priority) {
            case 1:
                return { color: "lightgreen" }
            case 2:
                return { color: "lightBlue" }
            case 3:
                return { color: "gold" }
            case 4:
                return { color: "red" }
        }
    }

    const event = {
        //   id: item.id,
        //   name: item.name,
        start: moment(item.start).local().toDate(),
        end: moment(item.end).local().toDate(),

        title: <p style={setColor()}>{item.name}</p>
    }
    return event
}

function Cal({ allUsers }) {

    const [events, setEvents] = useState([])
    const [data, setData] = useState([])

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
            style={{ height: "86vh" }}
            onSelectEvent={onClick}
        />
    );
}


