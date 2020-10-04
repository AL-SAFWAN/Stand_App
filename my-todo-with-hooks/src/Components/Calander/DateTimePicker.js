import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'

import { setItemToAdd } from "../../action/itemActions";
import GanttChart from '../ganttChart'
import Grid from '@material-ui/core/Grid';
import {
  TextField,

} from "@material-ui/core";
import axios from "axios";
import "../Activity.css"
export default function DateTimePicker({ todo, todos, token }) {
  

  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  // console.log(moment(todo.createdAt).local().format("YYYY-MM-DDTHH:mm"))
  const [value, setValue] = useState(moment(todo.createdAt).local().format("YYYY-MM-DDTHH:mm"));
  const [valueEnd, setValueEnd] = useState(moment(todo.endAt).local().format("YYYY-MM-DDTHH:mm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const setUpdatedValue = (value, at) => {
    if (at === "createdAt") {
      todo.createdAt = value
      setValue(value)
    } else {
      todo.endAt = value
      setValueEnd(value)
    }
  }

  const handleDone = () => {
    // array manipulation for 
    const copiedTodo = todo;
    var index = todos.indexOf(todo)
    copiedTodo.createdAt = moment(value.substring(0, 16)).format()
    copiedTodo.endAt = moment(valueEnd.substring(0, 16)).format()
    const copiedItems = [...todos]
    copiedItems.splice(index, 1, copiedTodo)
    // update the backend then re-render
    dispatch(() => setItemToAdd(dispatch, copiedItems, todo.name));
    axios.patch("/api/items/" + copiedTodo.id, {
      id: copiedTodo.id,
      createdAt: copiedTodo.createdAt,
      endAt: copiedTodo.endAt
    }, token)
  }

  return (
    <React.Fragment>



      <form noValidate>


        <div>
          <div className="date-container">
            <TextField
              id="datetime-local"
              label="start"
              type="datetime-local"
              value={value}
              onChange={e => setUpdatedValue(e.target.value, "createdAt")}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="datetime-local"
              label="end"
              type="datetime-local"
              value={valueEnd}
              onChange={e => setUpdatedValue(e.target.value, "endAt")}
              InputLabelProps={{
                shrink: true,
              }}
            /></div>

        

        </div>
      </form>

      {/* 
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>

          <Button onClick={handleDone} color="primary">
            Done
          </Button> */}

    </React.Fragment>
  )
}
