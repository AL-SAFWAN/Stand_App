import React, { useState } from "react";
import {
    TextField
} from "@material-ui/core";
import axios from "axios";
import { setItemToAdd } from "../action/itemActions";
import { returnErrors } from "../action/errorAction";
import { useDispatch } from "react-redux";

function TodoForm({id ,todos, state,token}) {

    const dispatch = useDispatch();
    // used in haddle submit
    const addTodo = text => {
        const itemObj = {
            name: id,
            text,
            isCompleted: false,
            index: -todos.length,
            userId: state.auth.user.id
        };
        //use the res to add the todo with the id
        axios.post("/api/items", itemObj, token)
            .then((req, res) => {
                const newTodos = [req.data, ...todos];
                dispatch(() => setItemToAdd(dispatch, newTodos, id));
            })

            .catch(err => dispatch(returnErrors(err.response.data.msg, err.response.status)));;
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