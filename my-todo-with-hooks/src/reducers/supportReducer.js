import {
   
    DELETE_USER,
    ADD_USER,
    EDIT_USERS,
    GET_STANDUP_USERS,
    GET_SUPPORT_USERS,
    LOAD_SUPPORT_USERS,
    
} from '../action/type'


const initialState = {
    "1st line": [],
    "2nd line": [],
    "3rd line": [],
    "Stand Up": []
}

export default function (state = initialState, action) {
    switch (action.type) {

        case LOAD_SUPPORT_USERS:
            return {
                ...state,
                "1st line": action["1st line"],
                "2nd line": action["2nd line"],
                "3rd line": action["3rd line"],
            }

        case GET_STANDUP_USERS:

            return {
                ...state,
                "Stand Up": action["Stand Up"],
            }
        case ADD_USER:
            return {
                ...state,
                [action.name]: [...state[action.name], action.user],
            }
 

        case DELETE_USER:
            return {
                ...state,
                [action.name]: state[action.name].filter(item => item.id !== action.id),
            }

        case EDIT_USERS:
            return {
                ...state,
                [action.name]: action.array,
            }
        


        default:

            return state
    }

}