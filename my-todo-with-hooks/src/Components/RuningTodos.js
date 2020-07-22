import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import RenderTodoItems from "./RenderTodoItems";
import { loadItem, setItemToAdd } from "../action/itemActions";
import Grid from "@material-ui/core/Grid";

import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import axios from "axios";
import { tokenConfig } from "../action/authAction";
import moment from 'moment'

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

const todoDateObj = {
  Yesterday: moment().subtract(1, "days"),
  Today: moment(),
  Blocker: moment()
};

const reOrder = (result, columns, dispatch, token) => {
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
            id: item.id,
            index: index
          }, token)
      }
    }
  });
};

const move = (result, sTodo, dTodo, dispatch, token) => {

  const { source, destination } = result;
  const copiedItems = [...sTodo];
  const [pickedUp] = copiedItems.splice(source.index, 1);

  dispatch(() => setItemToAdd(dispatch, copiedItems, source.droppableId));
  copiedItems.forEach((item, index) => {
    //maintain the order
    for (const prop in item) {
      if (prop === "index") {
        item[prop] = index;
        axios.patch("/api/items/" + item.id, {
          id: item.id,
          name: source.droppableId,
          index: index,
        }, token);
      }
    }
  });
  // problem witht the date being formated here 
  pickedUp.createdAt = todoDateObj[destination.droppableId].format()
  pickedUp.endAt = todoDateObj[destination.droppableId].format()
  console.log(pickedUp.createdAt)
  const dCopyItems = [...dTodo];
  dCopyItems.splice(destination.index, 0, pickedUp);
  // update the date for the item
  axios.patch("/api/items/" + pickedUp.id, {
    id: pickedUp.id,
    createdAt: pickedUp.createdAt,
    endAt: pickedUp.endAt
  }, token).then((res, req) => {
    console.log('pathch call has been made', pickedUp)
  });

  // when i pick up the item and move it it updates the DB
  //but what about the front end??????
  // maybe i could edit the picked up item and used that 

  //////////////
  dispatch(() => setItemToAdd(dispatch, dCopyItems, destination.droppableId));
  // maintain the order
  dCopyItems.forEach((item, index) => {
    for (const prop in item) {
      if (prop === "index") {
        item[prop] = index;
        axios.patch("/api/items/" + item.id, {
          id: item.id,
          name: destination.droppableId,
          index: index
        }, token);
      }
    }
  });
};

function RuningTodos({ state }) {
  const dispatch = useDispatch();
  const token = tokenConfig(state);

  const onDragEnd = result => {
    const { source, destination } = result;
    if (!result.destination) return;
    console.log(result)
    if (source.droppableId === destination.droppableId) {
      reOrder(result, todoObj[source.droppableId], dispatch, token);
    } else {
      move(result, todoObj[source.droppableId], todoObj[destination.droppableId], dispatch, token
      );
    }
  };

  const { Yesterday, Today, Blocker, BeyoundYesturday, BeyoundToday } = state.item;

  useEffect(() => {
    dispatch(() => loadItem(dispatch, state.auth.user.id));
  }, []);

  const todoObj = {
    Yesterday: Yesterday,
    Today: Today,
    Blocker: Blocker,
    BeyoundYesturday: BeyoundYesturday,
    BeyoundToday: BeyoundToday
  }

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
            <RenderTodoItems key={"y"} id={"Yesterday"} todos={Yesterday} state={state} ></RenderTodoItems>
          </Grid>
          <Grid item xs={3} style={gridStyle.child}>
            <RenderTodoItems key={"t"} id={"Today"} todos={Today} state={state} ></RenderTodoItems>
          </Grid>
          <Grid item xs={3} style={gridStyle.child}>
            <RenderTodoItems key={"b"} id={"Blocker"} todos={Blocker} state={state}></RenderTodoItems>
          </Grid>

        </Grid>
      </div>
    </DragDropContext>
  );
}

export default RuningTodos;
