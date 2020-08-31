import React, { useState, useEffect } from "react"
import axios from 'axios'

import "draft-js/dist/Draft.css"
import "draftail/dist/draftail.css"

import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE } from "draftail"
import { EditorState } from "draft-js"
import { createEditorStateFromRaw, serialiseEditorStateToRaw } from "draftail"
import { setOpenNote} from "../action/noteAction";
import { useDispatch } from 'react-redux'

export default function MyEditor({ state }) {
  const dispatch = useDispatch()
  const [editorState, setEditorState] = useState(EditorState.createEmpty())


  useEffect(() => {
    console.log("the note state", state.note)
    const note = state.note
    if (note.todo === note.preTodo) {
      dispatch(() => setOpenNote(dispatch, (!(note.openNote))))
    } else {
      const id = state.note.todo.id

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
    if (content != null) {
      axios.patch("/api/notes/" + state.note.todo.id, {
        itemId: state.note.todo.id,
        text: JSON.stringify(content)
      })
    }
  }

  return (
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
  )

}
