import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";


const useStyles = makeStyles(theme => ({
  root: {
    Width: 360,
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

 
function Item({ todo, index }) {
  const classes = useStyles();
  const labelId = `checkbox-list-label-${index}`;
  const [check, setCheck] = useState(todo.isCompleted);

  const handelToggle = () => {
    var checking = check ? false : true;

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
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const Todo = ({ todo, index }) => {
    return <div className="todo">{todo.text}</div>;
  };
  return (
    //write down on click to set to true or false
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
        <IconButton edge="end" aria-label="comments" onClick={deleteTodo}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}




export default Item

