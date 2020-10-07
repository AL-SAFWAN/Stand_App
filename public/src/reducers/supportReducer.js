import {
    DELETE_USER,
    ADD_USER,
    EDIT_USERS,
    LOAD_SUPPORT_USERS,
} from '../action/type'

import Moment from 'moment'

const initialState = {
    "1st line": [],
    "2nd line": [],
    "3rd line": [],
    "Stand Up": []
}

// const array = [{date:"2018-05-11"},{date:"2018-05-12"},{date:"2018-05-10"}]
// const sortedArray  = array.sort((a,b) => new Moment(a.start).format('YYYYMMDD') - new Moment(b.start).format('YYYYMMDD'))
// console.log(sortedArray)

export default function (state = initialState, action) {
    switch (action.type) {

        case LOAD_SUPPORT_USERS:
            return {
                ...state,
                "1st line": action["1st line"].sort((a,b) => new Moment(a.start).format('YYYYMMDD') - new Moment(b.start).format('YYYYMMDD')),
                "2nd line": action["2nd line"].sort((a,b) => new Moment(a.start).format('YYYYMMDD') - new Moment(b.start).format('YYYYMMDD')),
                "3rd line": action["3rd line"].sort((a,b) => new Moment(a.start).format('YYYYMMDD') - new Moment(b.start).format('YYYYMMDD')),
                "Stand Up": action["Stand Up"].sort((a,b) => new Moment(a.start).format('YYYYMMDD') - new Moment(b.start).format('YYYYMMDD'))
            }

        case ADD_USER:
            return {
                ...state,
                [action.name]: [...state[action.name], action.user].sort((a,b) => new Moment(a.start).format('YYYYMMDD') - new Moment(b.start).format('YYYYMMDD')),
            }
 

        case DELETE_USER:
            return {
                ...state,
                [action.name]: state[action.name].filter(item => item.id !== action.id).sort((a,b) => new Moment(a.start).format('YYYYMMDD') - new Moment(b.start).format('YYYYMMDD')),
            }

        case EDIT_USERS:
            return {
                ...state,
                [action.name]: action.array.sort((a,b) => new Moment(a.start).format('YYYYMMDD') - new Moment(b.start).format('YYYYMMDD')),
            }
        


        default:

            return state
    }

}