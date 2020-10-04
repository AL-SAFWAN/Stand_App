import {SET_NOTE_ID, LOAD_NOTE, LOADED_NOTE } from "../action/type";


export const loadNote =( dispatch, todo,todos,token ) =>{
    dispatch({ 
        type : LOAD_NOTE,
        todo,
        todos,
        token,
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


