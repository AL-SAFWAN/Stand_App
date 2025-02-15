import React, { useState } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { setItemToDelete, loading } from "../../action/itemActions";
import { returnErrorsOfItem, returnErrors } from "../../action/errorAction";
import {loadNote, setOpenNote} from '../../action/noteAction'
import axios from "axios";
import { useDispatch } from "react-redux";
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment'

function Item({ id, todos, todo, index, classes, token }) {


  // local stores
  const dispatch = useDispatch();
  const labelId = `checkbox-list-label-${index}`;
  const [check, setCheck] = useState(todo.isCompleted);
  const [clicked, setClicked] = useState(false);
  //functionailty of the item
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

  const handelToggle = () => {
    dispatch(() => { loading(dispatch) })
    
    var checking = check ? false : true;
    var date = checking? moment().toDate(): moment(todos[index].createdAt).add(2,"hours").toDate()
    console.log(checking)
    axios.patch("/api/items/" + todos[index].id, {
      id: todo.id,
      isCompleted: checking,
      endAt: date,
    }, token).catch(err => dispatch(returnErrors(err.response.data.msg, err.response.status)));

    setCheck(checking);
    
    todos[index].isCompleted = checking;
    todos[index].endAt = date
  };
  const deleteTodo = () => {
    
    setOpenNote(dispatch, false) 

    setClicked(true);
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    // also need to delete the notes, then remove it from the front end 
    
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

  const openNotes =()=>{
    dispatch(()=>{loadNote(dispatch,todo,todos,token)})
  }

  return (
    <ListItem
      className={classes.root}
      key={index}
      role={undefined}
      dense
      button
      disableRipple
    >
      <ListItemIcon>
        <Checkbox
          onClick={handelToggle}
          edge="start"
          checked={check}
          tabIndex={-1}

          inputProps={{ "aria-labelledby": labelId }}
        />
      </ListItemIcon>

      <ListItemText
        id={labelId}
        primary={<Todo key={index} index={index} todo={todo} />}
        style={checkStyle(check)}
      />
      {/* Change the note icon to show More */}
      <IconButton
      edge="end"
      aria-label="comments"
      onClick={openNotes}>
      <EditIcon />
      </IconButton>

      <IconButton
        edge="end"
        aria-label="comments"
        onClick={deleteTodo}
        disabled={clicked}
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}

export default Item