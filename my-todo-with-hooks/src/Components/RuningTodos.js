import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import RenderTodos from "./RenderTodos";
import { loadItem, setItemToAdd } from "../action/itemActions";
import Grid from "@material-ui/core/Grid";

import { DragDropContext } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { tokenConfig } from "../action/authAction";
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

const gridStyle = {
  parent: {
    margin: 5,
    width: "99%",
    boxSizing: "border-box",
    borderRadius: 5,
    backgroundColor: "rgba(123, 151, 234, 0.19)",
    justifySelf: "auto"
  },
  child: {
    backgroundColor: "rgb(194, 197, 219)",
    margin: 10,
    borderRadius: 5
  }
};

const reOrder = (result, columns, dispatch,token) => {
  const { source, destination } = result;

  const copiedItems = [...columns];
  const [removed] = copiedItems.splice(source.index, 1);
  copiedItems.splice(destination.index, 0, removed);

  dispatch(() => setItemToAdd(dispatch, copiedItems, destination.droppableId));
  copiedItems.forEach((item, index) => {
    for (const prop in item) {
      if (prop === "index") {
        item[prop] = index;
        axios
          .patch("/api/items/" + item.ID, {
            ID: item.ID,
            index: index
          },token)
          .then(res => console.log("Axios done for move"));
      }
    }
  });
};

const move = (result, sTodo, dTodo, dispatch, token) => {
  //making and instant array
  const { source, destination } = result;
  const copiedItems = [...sTodo];
  const [pickedUp] = copiedItems.splice(source.index, 1);

  dispatch(() => setItemToAdd(dispatch, copiedItems, source.droppableId));
  copiedItems.forEach((item, index) => {
    for (const prop in item) {
      if (prop === "index") {
        item[prop] = index;
        axios.patch("/api/items/" + item.ID, {
          ID: item.ID,
          name: source.droppableId,
          index: index
        },token);
      }
    }
  });

  const dCopyItems = [...dTodo];
  dCopyItems.splice(destination.index, 0, pickedUp);

  dispatch(() => setItemToAdd(dispatch, dCopyItems, destination.droppableId));
  dCopyItems.forEach((item, index) => {
    for (const prop in item) {
      if (prop === "index") {
        item[prop] = index;
        axios.patch("/api/items/" + item.ID, {
          ID: item.ID,
          name: destination.droppableId,
          index: index
        },token);
      }
    }
  });
};

function RuningTodos() {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const token = tokenConfig(state);

  const onDragEnd = result => {
    const { source, destination } = result;
    if (!result.destination) return;

    if (source.droppableId === destination.droppableId) {
      reOrder(result, todoObj[source.droppableId], dispatch, token);
    } else {
      move(
        result,
        todoObj[source.droppableId],
        todoObj[destination.droppableId],
        dispatch,
        token
      );
    }
  };

  const { Yesterday, Today, Blocker } = state.item;

  useEffect(() => {
    dispatch(() => loadItem(dispatch));
  }, []);

  const todoObj = {
    Yesterday: Yesterday,
    Today: Today,
    Blocker: Blocker
  };

  const classes = useStyles();

  return (
    <DragDropContext onDragEnd={result => onDragEnd(result)}>
      <div className={classes.boxRoot}>
        <Grid
          container
          spacing={3}
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
          style={gridStyle.parent}
        >
          <Grid item xs={3} style={gridStyle.child}>
            <RenderTodos
              key={"y"}
              id={"Yesterday"}
              todos={Yesterday}
            ></RenderTodos>
          </Grid>
          <Grid item xs={3} style={gridStyle.child}>
            <RenderTodos key={"t"} id={"Today"} todos={Today}></RenderTodos>
          </Grid>
          <Grid item xs={3} style={gridStyle.child}>
            <RenderTodos key={"b"} id={"Blocker"} todos={Blocker}></RenderTodos>
          </Grid>
        </Grid>
      </div>
    </DragDropContext>
  );
}

export default RuningTodos;
