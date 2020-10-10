import React, { useState, useEffect } from "react"
import axios from 'axios'

import "draft-js/dist/Draft.css"
import "draftail/dist/draftail.css"

import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE } from "draftail"
import { EditorState } from "draft-js"
import { createEditorStateFromRaw, serialiseEditorStateToRaw } from "draftail"
import { setOpenNote } from "../action/noteAction";
import { useDispatch } from 'react-redux'
import DeleteIcon from "@material-ui/icons/Delete";
import GanttChart from './ganttChart'
import "./Activity.css"
import moment from 'moment'

import { loading, setItemToAdd, setItemToDelete } from "../action/itemActions";

import {
  TextField,
  Button, IconButton, Checkbox
} from "@material-ui/core";
import { returnErrors, returnErrorsOfItem } from "../action/errorAction"


export default function MyEditor({ state }) {
  const { preTodo, todo, todos, token, openNote } = state.note


  const [editorState, setEditorState] = useState(EditorState.createEmpty())


  useEffect(() => {
    console.log("the note state", state.note)

    if (todo === preTodo) {
      dispatch(() => setOpenNote(dispatch, (!(openNote))))
    } else {
      const id = todo.id

      axios.get("/api/notes/" + id)
        .then(res => {
          if (res.data === null) {
            // no-note then make one
            axios.post("/api/notes/", { itemId: id, text: null })
          } else {
            // found the note then set one
            const newEditorState = createEditorStateFromRaw(JSON.parse(res.data.text))
            console.log("here the set state is being called")
            setEditorState(newEditorState)



          }
        })
    }

  }, [])


  const onSave = (con) => {
    //updating and saving the note 
    setEditorState(con)

    const content = serialiseEditorStateToRaw(editorState)
    console.log(content)
    if (content != null) {
      axios.patch("/api/notes/" + state.note.todo.id, {
        itemId: state.note.todo.id,
        text: JSON.stringify(content)
      })
    }
  }


  const dispatch = useDispatch()



  const [value, setValue] = useState(moment(todo.createdAt).local().format("YYYY-MM-DDTHH:mm"));
  const [valueEnd, setValueEnd] = useState(moment(todo.endAt).local().format("YYYY-MM-DDTHH:mm"));
  const [itemText, setItemText] = useState(todo.text)

  const [check, setCheck] = useState(todo.isCompleted);
  const [clicked, setClicked] = useState(false);

  const handleClose = () => {
    dispatch(() => setOpenNote(dispatch, false))
  };

  const setUpdatedValue = (value, at) => {
    if (at === "createdAt") {
      todo.createdAt = value
      setValue(value)
    } else if ((at === 'text')) {
      todo.text = value
      setItemText(value)
    }
    else {
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
    copiedTodo.text = itemText
    const copiedItems = [...todos]
    copiedItems.splice(index, 1, copiedTodo)
    // update the backend then re-render
    dispatch(() => setItemToAdd(dispatch, copiedItems, todo.name));
    axios.patch("/api/items/" + copiedTodo.id, {
      id: copiedTodo.id,
      text: itemText,
      createdAt: copiedTodo.createdAt,
      endAt: copiedTodo.endAt
    }, token)
    dispatch(() => setOpenNote(dispatch, false))
  }



  const deleteTodo = () => {
    setOpenNote(dispatch, false)
    setClicked(true);
    todos.forEach((t, i) => {
      if (t.id === todo.id) {
        dispatch(() => setItemToDelete(dispatch, i, todo.name));
      }
    });
    axios.delete("/api/items/" + todo.id, token).catch(err => {
      dispatch(() =>
        returnErrorsOfItem(
          dispatch,
          (todo.text + ": " + err.response.data.msg),
          err.response.status,
          todos,
          todo.name,
        )
      );
      console.log(" responce", err.response.data);
    });

  };

 


  return (
    <div className="item-container">


      <div className="item-dates">



        <div>
          <div className="date-container">

            <div className="date">
              <TextField
                style={{ width: 'fit-content' }}
                id="datetime-local"
                label={todo.name}
                type="outline"
                value={itemText}
                onChange={e => setUpdatedValue(e.target.value, 'text')}
                InputLabelProps={{
                  shrink: true,
                }}
              /></div>

            <div className="date">
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
            </div>

            <div className="date">
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

            <IconButton

              // aria-label="comments"
              onClick={deleteTodo}
            // disabled={clicked}
            >

              <DeleteIcon
              // onClick={deleteTodo}
              // disabled={clicked}
              />
            </IconButton>


          </div>
        </div>

      </div>

      <div className="edit-group">
        <div className="item-editor">

          <DraftailEditor
            editorState={editorState}
            onChange={onSave}
            blockTypes={[
              { type: BLOCK_TYPE.HEADER_THREE }, {
                type: BLOCK_TYPE.BLOCKQUOTE,
              },
              { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
            ]}
            inlineStyles={[{ type: INLINE_STYLE.BOLD }, { type: INLINE_STYLE.ITALIC }]}
          />
        </div>

        <GanttChart todos={todos} />
      </div>

      <div className="buttons">

        <div className="button" >
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button></div>

        <div className="button" >
          <Button onClick={handleDone} color="primary">
            Done
          </Button></div></div>

    </div>
  )

}
