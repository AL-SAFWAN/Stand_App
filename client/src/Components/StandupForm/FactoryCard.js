import React, { useState, useRef } from "react";
import "./index.css"
import { Avatar, TextField } from '@material-ui/core'
import { KeyboardArrowLeft } from '@material-ui/icons';
import { IconButton, } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { animated, useTransition, config, useSpring, useSprings, useChain, interpolate } from 'react-spring'
import moment from 'moment'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { tokenConfig } from '../../action/authAction'
let idKey = 0

export default function FactoryCard({ name, userId, filePath }) {
    return (
        <React.Fragment>

            <div className="outer-container">
                <div className="parent-container">
                    <div className="flex-container">
                        <Avatar className="imgBg" src={filePath} style={{
                            width: "85px",
                            height: "85px"
                        }} src={filePath}>{name}</Avatar>

                        <h1 className="userName"> {name}</h1></div>
                    <div></div>
                </div>
                <br></br>
                <FactoryInputField name={name} userId={userId} id={"Yesterday"} />
                <FactoryInputField name={name} userId={userId} id={"Today"} />
                <FactoryInputField name={name} userId={userId} id={"Blocker"} />
            </div>

        </React.Fragment>
    )
}



const Todos = ({ config = { mass: 5, tension: 650, friction: 55 }, todos, onDeleteTodo, trRef }) => {
    const transitions = useTransition(todos, item => item.id, {
        ref: trRef,
        from: { opacity: 0, transform: "translateY(-10px)" },
        enter: { opacity: 1, transform: "translateY(0)" },
        leave: { opacity: 0, transform: "translateY(20px)" },
        immediate: true,
        // config: (item, state) => (state === 'leave' ? { duration: 10 } : config),
    })
    return transitions.map(({ item, key, props }, index) =>
        (
            <animated.div style={props} key={key}>{
                <div className="listItem">

                    <div className="todo">{item.text}</div>
                    <IconButton onClick={() => onDeleteTodo(item.id)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            }</animated.div>
        )
    )
}

// maybe have an axios call 
const FactoryInputField = ({ name, id, userId }) => {

    const todoDateObj = {
        Yesterday: moment().subtract(1, "days").toDate(),
        Today: moment().toDate(),
        Blocker: moment().toDate()
    };

    const [todos, setTodos] = useState([]);

    const [openTable, setOpenTable] = useState(false)
    const [value, setValue] = useState("");
    const springRef = useRef()

    const { size, opacity, x, ...rest } = useSpring({
        ref: springRef,
        config: config.gentle,
        // opacity: openTable ? 1 : 0,
        x: openTable ? 90 : 0,
        height: openTable ? (55 * todos.length) + 10 : 0,
        from: { opacity: 0, x: 0, height: 0 },
        // reverse: !openTable,
        overflow: "hidden"
    })
    const trRef = useRef()

    const state = useSelector(state => state)
    const token = tokenConfig(state)
    const handleSubmit = e => {


        e.preventDefault();
        if (!value) return;
        // todos.push({})

        const itemObj = {
            createdAt: todoDateObj[id],
            name: id,
            text: value,
            isCompleted: false,
            index: -todos.length,
            userId,
            endAt: moment(todoDateObj[id]).add(2, "hours").toDate()
        };

        axios.post("/api/items", itemObj, token)
            .then((req, res) => {
                console.log(req.data)
                setTodos([req.data, ...todos,])
            })
        console.log(todos)
        setValue("");
    };

    const deleteTodo = (id) => {

        axios.delete("/api/items/" + id, token).then(() => {
            setTodos(todos.filter((todo) => todo.id !== id))
        })
    }
    useChain(openTable ? [springRef, trRef] : [trRef, springRef])

    return (
        <div className="textGrid" //
            onFocus={() => setOpenTable(true)
                // we want to open the table down here and rotate the arrow 
            }
            onBlur={() => {
                setOpenTable(false)
            }
                // we want to close the table down here and rotate the arrow 
            }>
            <div>
                <form
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        fullWidth={true}
                        className="textfield"
                        id={name + id}
                        label={id}
                        variant="outlined"

                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                </form>
            </div>
            <animated.div className="arrow" style={{ transform: x.interpolate(x => `rotate(-${x}deg)`) }}> <KeyboardArrowLeft fontSize="large" /></animated.div>
            <animated.div className="list" style={{ ...rest }}>
                <Todos todos={todos} onDeleteTodo={deleteTodo} trRef={trRef} />
            </animated.div>
            <div></div>
        </div>
    )
}



