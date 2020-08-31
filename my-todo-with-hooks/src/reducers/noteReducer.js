import { LOAD_NOTE, LOADED_NOTE, CLEAR_NOTE} from "../action/type";

const initialState = {
  preTodo : null,
  todo:null, 
  openNote : false
};


export default function (state = initialState, action) {

  switch (action.type) {
    // I can do the manpulations here 
    //1. did I clicked on a new todo or an the same todo 
    //2. if it is the same todo then close 
    //3. if it is a new todo then update the content of the editor 
    case LOAD_NOTE: 
    return{
      ...state,
      preTodo: state.todo,
      todo: action.todo,
      openNote: action.openNote,
       
    }
    case LOADED_NOTE:
      return{
        ...state,
        todo: null,
        openNote: action.openNote
      }
    case CLEAR_NOTE:
      // do manpulation here 
      return{
        ...state,
        preTodo: null,
        todo: null,
        openNote: false
      }
    default:
      return state;
  }
}
