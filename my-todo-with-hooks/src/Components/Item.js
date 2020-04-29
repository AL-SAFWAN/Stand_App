import React, { useState } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { setItemToDelete} from "../action/itemActions";
import { returnErrorsOfItem, returnErrors } from "../action/errorAction";
import axios from "axios";
import { useDispatch } from "react-redux";


function Item({ id, todos, todo, index, classes,token }) {
    // local stores
    const dispatch = useDispatch();
    const labelId = `checkbox-list-label-${index}`;
    const [check, setCheck] = useState(todo.isCompleted);
    const [clicked, setClicked] = useState(false);

    //functionailty of the item
    const handelToggle = () => {
      var checking = check ? false : true;
      axios.patch("/api/items/" + todos[index].id, {
        id: todo.id,
        isCompleted: checking
      }, token).catch(err => dispatch(returnErrors(err.response.data.msg, err.response.status)));
      setCheck(checking);
      todos[index].isCompleted = checking;
    };

    const checkStyle = done => {
      var colorStyle = {};
      if (done) {
        colorStyle = {
          color: "#00c853"
        };
      } else {
        colorStyle = {
          color: "#00b8d4"
        };
      }
      return colorStyle;
    };

    const deleteTodo = () => {
      setClicked(true);
      const newTodos = [...todos];
      newTodos.splice(index, 1);

      console.log("The todo", todo)

      axios.delete("/api/items/" + todo.id, token).catch(err => {
        dispatch(() =>
          returnErrorsOfItem(
            dispatch,
            (todo.text + ": " + err.response.data.msg),
            err.response.status,
            todos,
            id,
          )
        );
        console.log(" responce", err.response.data);
      });
      dispatch(() => setItemToDelete(dispatch, index, id));
    };


    const Todo = ({ todo, index }) => {
      return <div className="todo">{todo.text}</div>;
    };
    return (
      <ListItem
        className={classes.root}
        key={index}
        role={undefined}
        dense
        button
        onClick={handelToggle}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={check}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": labelId }}
          />
        </ListItemIcon>

        <ListItemText
          id={labelId}
          primary={<Todo key={index} index={index} todo={todo} />}
          style={checkStyle(check)}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="comments"
            onClick={deleteTodo}
            disabled={clicked}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  export default Item