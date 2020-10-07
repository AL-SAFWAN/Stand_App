import {GET_USER_ACTIVITY,LOAD_USERS} from '../action/type'


const initialState = {
    activeUsers:[],
    neutralUsers: [],
    blockedUsers: [],
    loadUsers: false
}

export default function (state = initialState, action){
switch(action.type){
    case GET_USER_ACTIVITY:
        return {
            ...state, 
            activeUsers: action.activeUsers,
            neutralUsers: action.neutralUsers,
            blockedUsers: action.blockedUsers,
            loadUsers: false
        }
    case LOAD_USERS:
        return{
            ...state,
            loadUsers: true
        }
  
    default:
        return state
}

}