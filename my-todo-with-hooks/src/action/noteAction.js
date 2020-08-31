import {SET_NOTE_ID, LOAD_NOTE, LOADED_NOTE } from "../action/type";


export const loadNote =( dispatch, todo ) =>{
    dispatch({ 
        type : LOAD_NOTE,
        todo,
        openNote: true
    })
} 

export const setOpenNote = (dispatch,openNote) =>{
    dispatch({type: LOADED_NOTE,
        openNote
    })
}




export const setNoteID = ( dispatch, id) => {
    dispatch({ 
        type :SET_NOTE_ID,
        id: id
    })
}


