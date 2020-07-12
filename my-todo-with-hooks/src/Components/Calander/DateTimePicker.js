import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import GanttChart from '../ganttChart'
import { setItemToAdd } from "../../action/itemActions";
import Grid from '@material-ui/core/Grid';
import {
  IconButton,
  TextField,
  Button,
} from "@material-ui/core";
import axios from "axios";
export default function DateTimePicker({ todo, todos,token }) {
  

  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  console.log(moment(todo.createdAt).local().format("YYYY-MM-DDThh:mm"))
  const [value, setValue] = useState(moment(todo.createdAt).local().format("YYYY-MM-DDThh:mm") );
  const [valueEnd, setValueEnd] = useState(moment(todo.endAt).local().format("YYYY-MM-DDThh:mm"));


  console.log("d/t picker =>", todo, value)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDone = () => {
    const copiedTodo = todo;
    var index = todos.indexOf(todo)
    copiedTodo.createdAt = moment(value.substring(0, 16)).format()
    console.log(copiedTodo.createdAt)
    copiedTodo.endAt = moment(valueEnd.substring(0, 16)).format()
    const copiedItems = [...todos]
    copiedItems.splice(index, 1, copiedTodo)
    dispatch(() => setItemToAdd(dispatch, copiedItems, todo.name));
    console.log( copiedTodo)
    axios.patch("/api/items/" + copiedTodo.id, {
      id: copiedTodo.id,
      createdAt: copiedTodo.createdAt,
      endAt: copiedTodo.endAt
    }, token)
  }

  

  return (
    <React.Fragment>
      <IconButton
        edge="end"
        aria-label="comments"
        onClick={handleClickOpen}>
        <CalendarTodayIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Date/Time edit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please end the time related content here
          </DialogContentText>

          <form noValidate>
            <Grid container justify="space-around">
              <TextField
                id="datetime-local"
                label="start"
                type="datetime-local"
                value={value}
                onChange={e => setValue(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="datetime-local"
                label="end"
                type="datetime-local"
                value={valueEnd}
                onChange={e => setValueEnd(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <GanttChart todo={todo} todos={todos} />
            </Grid>
          </form>

        </DialogContent>
        <DialogActions>

          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>

          <Button onClick={handleDone} color="primary">
            Done
          </Button>

        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
