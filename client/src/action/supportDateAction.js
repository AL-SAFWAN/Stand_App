import {
    DELETE_USER,
    ADD_USER,
    ADD_1ST_LINE_USERS,
    ADD_2ND_LINE_USERS,
    ADD_3RD_LINE_USERS,
    GET_SUPPORT_USERS, LOAD_SUPPORT_USERS, EDIT_USERS, EDIT_2ND_LINE_USERS, EDIT_3RD_LINE_USERS
} from "./type";
import axios from "axios";
import { returnErrors } from "./errorAction";


export const loadSupportUser = (dispatch) => {
    // dispatch({ type: USER_LOADING });
    axios.get("/api/supportDates")
        .then(res => {
            let result = [...res.data]
            console.log("result BackEnd ", result)
            dispatch({
                type: LOAD_SUPPORT_USERS,
                "1st line": result.filter(item => item.supportType === 1),
                "2nd line": result.filter(item => item.supportType === 2),
                "3rd line": result.filter(item => item.supportType === 3),
                "Stand Up": result.filter(item => item.supportType === 0)
            });
        })
};

export const addSupportUser = (name, user, dispatch) => {

    axios.post("/api/supportDates",
        user
    ).then((req, res) => {
        dispatch({
            type: ADD_USER,
            name,
            user: req.data
        });
    })



};
export const deleteSupportUser = (name, id, dispatch) => {


    axios.delete("/api/supportDates/"
        + id
    )
    dispatch(
        {
            type: DELETE_USER,
            id, name
        }
    );
};

export const editSupportUser = (name, array, dispatch, todo) => {
    console.log(todo)

    axios.patch("/api/supportDates/" + todo.id, {
        start: todo.start,
        end: todo.end
      })

    dispatch({
        type: EDIT_USERS,
        name,
        array
    });


}

  // setting everything to null... what about the todos?


