import { combineReducers } from 'redux'
import itemReducer from './itemReducer'
import errorReducer from './errorReducer'
import authReducer from './authReducer'
import userActivityReducer from "./userActivityReducer"
import noteReducer from "./noteReducer"
export default combineReducers({
    item: itemReducer,
    error: errorReducer,
    auth: authReducer,
    userAcitvity: userActivityReducer, 
    note: noteReducer
})