import React from "react";
import TodoForm from './TodoForm'
import { tokenConfig } from '../action/authAction'
import Item from './Item'
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  Paper,
} from "@material-ui/core";
import { Droppable, Draggable } from "react-beautiful-dnd";
import uuid from "uuid/v4";;

//layout styling
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

function RenderTodos({ id, todos, setTodos, state }) {
  
  const token = tokenConfig(state)
  const classes = useStyles();

  function itemsArray() {
    var array = [];
    todos.map((todo, index) => {
      var itemObj = {
        id: uuid(),
        item: <Item key={index} id={id} classes={classes} todos={todos} todo={todo} index={index} token={token} />
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
  return (
    <div>
      <Paper className={classes.paper} elevation={3} square>
        <TodoForm id={id} todos={todos} state={state} token={token} />
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
