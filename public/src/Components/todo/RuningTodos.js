import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import RenderTodoItems from "./RenderTodoItems";
import { loadItem, setItemToAdd } from "../../action/itemActions";
import Grid from "@material-ui/core/Grid";

import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import axios from "axios";
import { tokenConfig } from "../../action/authAction";
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

  child: {
    backgroundColor: "rgb(194, 197, 219)",
    margin: 10,
    borderRadius: 5
  }
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


  const adjustTimingAtStart = (result, todo) => {
    const { createdAt } = todo
    const cameFrom = result.source.droppableId
    const goingTo = result.destination.droppableId
    var time = moment(createdAt).format()
    if (cameFrom === "Yesterday" && (goingTo === "Today" || goingTo === "Blocker")) {
      time = moment(createdAt).add(1, "days").format()
    }
    if (goingTo === "Yesterday" && (cameFrom === "Today" || cameFrom === "Blocker")) {
      time = moment(createdAt).subtract(1, "days").format()
    }
    return time
  }
  const adjustTimingAtEnd = (result, todo) => {
    const { endAt } = todo
    const cameFrom = result.source.droppableId
    const goingTo = result.destination.droppableId
    var time = moment(endAt).format()

    if (cameFrom === "Yesterday" && (goingTo === "Today" || goingTo === "Blocker")) {
      time = moment(endAt).add(1, "days").format()
    }
    if (goingTo === "Yesterday" && (cameFrom === "Today" || cameFrom === "Blocker")) {
      time = moment(endAt).subtract(1, "days").format()
    }
    return time
  }

  // Error of the time chaning is here
  pickedUp.createdAt = adjustTimingAtStart(result, pickedUp)
  pickedUp.endAt = adjustTimingAtEnd(result, pickedUp)
  pickedUp.name = destination.droppableId

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

function RuningTodos({ state, width }) {
  const dispatch = useDispatch();
  const token = tokenConfig(state);

  const onDragEnd = result => {
    const { source, destination } = result;
    if (!result.destination) return;
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
    Yesterday: Yesterday.sort(function (x, y) {
      return (x.isCompleted === y.isCompleted) ? 0 : x.isCompleted ? 1 : -1;
    }),
    Today: Today.sort(function (x, y) {
      return (x.isCompleted === y.isCompleted) ? 0 : x.isCompleted ? 1 : -1;
    }),
    Blocker: Blocker.sort(function (x, y) {
      return (x.isCompleted === y.isCompleted) ? 0 : x.isCompleted ? 1 : -1;
    }),
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
          style={{
            margin: "auto",
            width: width,
            boxSizing: "border-box",
            borderRadius: 5,
            backgroundColor: "rgba(123, 151, 234, 0.19)",
            justifySelf: "auto"
          }}
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
