import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  Paper,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  ListItemSecondaryAction,
  IconButton,
  TextField
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Droppable, Draggable } from "react-beautiful-dnd";

import axios from "axios";
import { useDispatch } from "react-redux";
import { setItemToDelete, setItemToAdd } from "../action/itemActions";
import uuid from "uuid/v4";
import { returnErrorsOfItem,returnErrors } from "../action/errorAction";


import {tokenConfig} from '../action/authAction'
import {useSelector} from 'react-redux'



//layouy styling
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  },
  boxRoot: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

//styling based on dragging
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  background: isDragging ? "red" : "lightgrey",
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  minHeight: 40
});

function RenderTodos({ id, todos, setTodos }) {
  
const state = useSelector(state => state)
const token = tokenConfig(state)

  const dispatch = useDispatch();
  function TodoForm() {
    // used in haddle submit
    const addTodo = text => {
      const itemObj = {
        name: id,
        text,
        isCompleted: false,
        index: -todos.length,
        ID: uuid()
      };
      const newTodos = [itemObj, ...todos];
      axios.post("/api/items", itemObj,token ).catch(err => dispatch(returnErrors(err.response.data.msg, err.response.status)));;
      dispatch(() => setItemToAdd(dispatch, newTodos, id));
    };
    //handling the submit
    const [value, setValue] = useState("");
    const handleSubmit = e => {
      e.preventDefault();
      if (!value) return;
      addTodo(value);
      setValue("");
    };
    
    const classes = useStyles();
    return (
      <form
        className={classes.root}
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

  //create the items for the draggable to use
  function Item({ todo, index }) {
    // local stores
    const classes = useStyles();
    const labelId = `checkbox-list-label-${index}`;
    const [check, setCheck] = useState(todo.isCompleted);
    const [clicked, setClicked] = useState(false);

    //functionailty of the item
    const handelToggle = () => {
      var checking = check ? false : true;
      axios.patch("/api/items/" + todos[index].ID, {
        ID: todo.ID,
        isCompleted: checking
      },token).catch(err => dispatch(returnErrors(err.response.data.msg, err.response.status)));
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
      axios.delete("/api/items/" + todo.ID,token).catch(err => {
        dispatch(() =>
          returnErrorsOfItem(
            dispatch,
            (todo.text+": "+err.response.data.msg),
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

  function itemsArray() {
    var array = [];
    todos.map((todo, index) => {
      var itemObj = {
        id: uuid(),
        item: <Item key={index} todo={todo} index={index} />
      };
      return array.push(itemObj);
    });

    return array;
  }
  //use to render below
  const items = {
    [id]: {
      items: itemsArray()
    }
  };

  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paper} elevation={3} square>
        <TodoForm />
      </Paper>

      <Paper
        className={classes.paper}
        style={{ maxHeight: 250, overflow: "auto" }}
        square
      >
        <List className={classes.root}>
          {Object.entries(items).map(([id, column]) => {
            return (
              <Droppable key={id} droppableId={id}>
                {(provided, snapshot) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {column.items.map((todo, index) => {
                        return (
                          <Draggable
                            key={todo.id}
                            draggableId={todo.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                {todo.item}
                              </div>
                            )}

                            {}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </List>
      </Paper>
    </div>
  );
}

export default RenderTodos;
