import React, { useState } from "react";
import {
    TextField
} from "@material-ui/core";
import axios from "axios";
import { setItemToAdd } from "../action/itemActions";
import { returnErrors } from "../action/errorAction";
import { useDispatch } from "react-redux";
import moment from 'moment'


const todoDateObj = {
    Yesterday: moment().subtract(1, "days").toDate(),
    Today:  moment().toDate()
};
console.log("here___________" ,  moment().local().format().substring(0,16) )
function TodoForm({ id, todos, state, token }) {
    const dispatch = useDispatch();
    // used in submit
    const addTodo = text => {
        
        const itemObj = {
            createdAt: todoDateObj[id],
            name: id,
            text,
            isCompleted: false,
            index: -todos.length,
            userId: state.auth.user.id,
            endAt: moment(todoDateObj[id]).add(2, "hours").toDate()
        };
       console.log("itemOBj-> ", itemObj )
        //use the res to add the todo with the id
        axios.post("/api/items", itemObj, token)
            .then((req, res) => {
                console.log("req data: form ", req.data)
                const newTodos = [req.data, ...todos];
                dispatch(() => setItemToAdd(dispatch, newTodos, id));
            }).catch(err => dispatch(returnErrors(err.response.data.msg, err.response.status)));;
    };
    //handling the submit
    const [value, setValue] = useState("");
    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        addTodo(value);
        setValue("");
    };
    return (
        <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <TextField
                id={id}
                label={id}
                variant="outlined"
                style={{ width: 245, textAlign: "center" }}
                value={value}
                onChange={e => setValue(e.target.value)}
            />
        </form>
    );
}
export default TodoForm