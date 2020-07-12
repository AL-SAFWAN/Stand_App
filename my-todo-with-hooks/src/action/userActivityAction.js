import { GET_USER_ACTIVITY, LOAD_USERS } from '../action/type'
import axios from 'axios'

export const loadUsersActivity = (dispatch) => {

    // dispatch(() => { loadUsers(dispatch) })

    const activeUsers = []
    const neutralUsers = []
    const blockedUsers = []
    axios.get("/api/auth/users").then((req, res) => {   
       
        const users = req.data.users
        var userCnt = 0;
        users.forEach(user => {
          
            axios.get("/api/items/user/" + user.id).then((res) => {
                  userCnt++
                const { Today, Blocker } = res.data.Items
                var done = 0;
                var notDone = 0;
                Today.forEach(val => {
                    if (val.isCompleted === true) {
                        done++
                    } else {
                        notDone++
                    }
                })
                var diff = done - notDone
                if (Blocker.length > 0) {
                    blockedUsers.push({ name: user.name, amount: Blocker.length })
                } else {
                    if (diff > 0) {
                        activeUsers.push({ name: user.name, done, notDone })
                    } else { neutralUsers.push({ name: user.name, done, notDone }) }
                }
                
                if(users.length == userCnt){
                    dispatch({
            type: GET_USER_ACTIVITY,
            activeUsers,
            neutralUsers,
            blockedUsers
        })
                }
                        
            })
        })
        

        
        

    })

}

export const updateUsers = dispatch => {
    dispatch({ type: LOAD_USERS })
}


export const loadUsers = dispatch => {
    dispatch({ type: LOAD_USERS })
}