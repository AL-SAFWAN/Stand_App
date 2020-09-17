import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import "./index.css"
import AddCircleIcon from '@material-ui/icons/AddCircle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { loadUsersActivity } from "../../action/userActivityAction";
import Chart from 'react-google-charts'
import { IconButton, } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";


export default function Index({ state }) {

    const [users, setUsers] = useState([])

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(() => { loadUsersActivity(dispatch) })

    }, [])

    useEffect(() => {
        const userData = []
        Object.values(state.userAcitvity).map(arr => {
            return Object.values(arr)
        }).forEach(arr => arr.forEach(user => userData.push({ id: user.id, name: user.name })
        ))
        setUsers(userData)

    }, [state.userAcitvity])


    var [addedUser, setAddedUser] = useState([])

    const clicked = (selectedName, startValue, endValue, index) => {
        console.log(...users)
        if (typeof (selectedName) === "string" || typeof (selectedName) === "undefined") {
            console.log("fill everything up -ERROR-")
            return
        }
        console.log(addedUser)
        setAddedUser([...addedUser, { ...selectedName, startValue, endValue }])
        const setArr = [...users]
        setArr.splice(index, 1)
        setUsers(setArr)

    }
    
    const onDelete = (user,index) => {
        // update the set users in the option list 
        // remove it from the added users 
        console.log(user)

        // if (typeof (selectedName) === "string" || typeof (selectedName) === "undefined") {
        //     console.log("fill everything up -ERROR-")
        //     return
        // }

        console.log(addedUser, users)

        // setAddedUser([...addedUser, { ...selectedName, startValue, endValue }])
        
        const setArr = [...addedUser]

        const [removed] = setArr.splice(index, 1)
        setUsers([...users,removed] )
        setAddedUser(setArr)

    }


    return (
        <div className="container"  >

            <div  >
                <ExpandingFormHeader userData={users} clicked={clicked} name={"1st line"} />
            </div>
            <div className="div-outer-container">

                <div className="div-item-container">

                    {addedUser.map((user, i) =>
                        <>
                            <div className="div-container1" key={i}>
                                <div className="textField-display">
                                    <TextField fullWidth id="standard-basic" label="" value={user.name} />
                                </div>
                                <div className="date-item">
                                    <TextField
                                        fullWidth
                                        id="datetime-local"
                                        label="start"
                                        type="date"
                                        value={user.startValue}
                                        onChange= {(e)=> {
                                            const newArr= [...addedUser]
                                            newArr[i].startValue =e.target.value 
                                        setAddedUser(newArr)
                                        } }
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
                                        value={user.endValue}    
                                         onChange= {(e)=> {
                                            const newArr= [...addedUser]
                                            newArr[i].endValue =e.target.value 
                                        setAddedUser(newArr)
                                        } }
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                                <div>
                                <IconButton onClick={() => {onDelete(user,i)}
                                    // onDeleteTodo(item.key)
                                    }>
                                    <DeleteIcon />
                                </IconButton>
                                </div>
                            </div>

                        </>

                    )}
                </div>

                <div className="div-item-container2">
                    <GanttChart todos={addedUser} />
                </div></div>
        </div>
    )
}



// to add the option i need to load the users, then create a option user name, which is mapped  

const ExpandingFormHeader = ({ name, userData, clicked }) => {
    console.log(userData)
    const [selectedName, setSelectedName] = useState('');
    const [startValue, setStartValue] = useState(moment().local().format("YYYY-MM-DD"));
    const [endValue, setEndValue] = useState(moment().add(1,"days").local().format("YYYY-MM-DD"));

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
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {userData.map((user, index) => {
                            return <MenuItem key={index} value={index}>{user.name}</MenuItem>
                        })}

                    </Select>
                </FormControl>

            </div>

            <div className="date">
                <TextField
                    id="datetime-local"
                    label="start"
                    type="date"
                    value={startValue}
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
                    value={endValue}
                    onChange={e => setUpdatedValue(e.target.value, "endAt")}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>

            <div className="icon">
                <AddCircleIcon onClick={() => clicked(userData[selectedName], startValue, endValue, selectedName)} fontSize="large" />
            </div>
        </div>
        </>
    )
}




function GanttChart({ todos }) {
    if (todos.length == 0) {
        return <></>
    }

    const createEventsFromTodo = (todo) => {

        const { startValue, endValue, id, name } = todo
        // const {} = selectedName
        const event =
            [
                id,
                name,
                null,
                moment(startValue).toDate(),
                moment(endValue).toDate(),
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
                gantt: {
                    trackHeight: 80,
                },
            }}
            rootProps={{ 'data-testid': '2' }}
        />

    )
}

