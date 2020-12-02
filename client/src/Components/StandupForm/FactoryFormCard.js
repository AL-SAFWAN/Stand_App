import React, { useState, useRef } from "react";
import "./index.css"
import { Avatar, TextField } from '@material-ui/core'
import { KeyboardArrowLeft } from '@material-ui/icons';
import { IconButton, } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { animated, useTransition, config, useSpring, useChain } from 'react-spring'
import moment from 'moment'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { tokenConfig } from '../../action/authAction'


export default function FactoryCard({ name, userId, filePath }) {
    return (
        <React.Fragment>

            <div className="outer-container">
                <div className="parent-container">
                    <div className="flex-container">
                        <Avatar className="imgBg" src={filePath} style={{
                            width: "85px",
                            height: "85px"
                        }} >{name}</Avatar>

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



const Todos = ({ todos, onDeleteTodo, trRef }) => {
    const transitions = useTransition(todos, item => item.id, {
        ref: trRef,
        from: { opacity: 0, transform: "translateY(-10px)" },
        enter: { opacity: 1, transform: "translateY(0)" },
        leave: { opacity: 0, transform: "translateY(20px)" },
        immediate: true,
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

    const todoDateSelectionObj = {
        Yesterday: moment().subtract(1, "days").toDate(),
        Today: moment().toDate(),
        Blocker: moment().toDate()
    };
    
    const [todos, setTodos] = useState([]);
    const [openTodoList, setOpenTodoList] = useState(false)
    const [todoTextValue, setTodoTextValue] = useState("");
    const springRef = useRef()

    const { size, opacity, x, ...rest } = useSpring({
        ref: springRef,
        config: config.gentle,
        // opacity: openTable ? 1 : 0,
        x: openTodoList ? 90 : 0,
        height: openTodoList ? (55 * todos.length) + 10 : 0,
        from: { opacity: 0, x: 0, height: 0 },
        // reverse: !openTable,
        overflow: "hidden"
    })

    const trRef = useRef()
    const state = useSelector(state => state)
    const token = tokenConfig(state)

    const addTodo = e => {
        e.preventDefault();
        if (!todoTextValue) return;
        // todos.push({})

        const newTodoObj = {
            createdAt: todoDateSelectionObj[id],
            name: id,
            text: todoTextValue,
            isCompleted: false,
            index: -todos.length,
            userId,
            endAt: moment(todoDateSelectionObj[id]).add(2, "hours").toDate()
        };

        axios.post("/api/items", newTodoObj, token)
            .then((req) => {
                setTodos([req.data, ...todos,])
            })
        console.log(todos)
        setTodoTextValue("");
    };

    const deleteTodo = (id) => {
        axios.delete("/api/items/" + id, token).then(() => {
            setTodos(todos.filter((todo) => todo.id !== id))
        })
    }

    useChain(openTodoList ? [springRef, trRef] : [trRef, springRef])

    return (
        <div className="textGrid" //
            onFocus={() => setOpenTodoList(true)
            }
            onBlur={() => {
                setOpenTodoList(false)
            }
            }>
            <div>
                <form
                    noValidate
                    autoComplete="off"
                    onSubmit={addTodo}
                >
                    <TextField
                        fullWidth={true}
                        className="textfield"
                        id={name + id}
                        label={id}
                        variant="outlined"
                        value={todoTextValue}
                        onChange={e => setTodoTextValue(e.target.value)}
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



