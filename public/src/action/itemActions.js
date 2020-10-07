import {
  LOAD_ITEMS,
  LOAD,
  DELETE_ITEM_T,
  DELETE_ITEM_B,
  DELETE_ITEM_Y,
  SET_ITEM_Y,
  SET_ITEM_T,
  SET_ITEM_B,
  DELETE_ITEM_BY,
  SET_ITEM_BY,
  DELETE_ITEM_BT,
  SET_ITEM_BT
} from "./type";
import axios from "axios";
import { returnLogErrors } from "./errorAction";


//this is only prerformed once
export const loadItem = (dispatch,id) => {
  // dispatch(() => loading(dispatch));
  
  axios.get("/api/items/user/"+ id
    ).then(res => {
    dispatch({
      type: LOAD_ITEMS,
      Yesterday: res.data.Items.Yesterday,
      Today: res.data.Items.Today,
      Blocker: res.data.Items.Blocker,
      BeyoundYesturday :res.data.Items.BeyoundYesturday,
      BeyoundToday :res.data.Items.BeyoundToday,
    })
  }).catch(err => dispatch(returnLogErrors(err.response.data, err.response.status)));;
};

export const setItemToDelete = (dispatch, index, name) => {
  const names = {
    Yesterday: {
      type: DELETE_ITEM_Y,
      index
    },
    Today: {
      type: DELETE_ITEM_T,
      index
    },
    Blocker: {
      type: DELETE_ITEM_B,
      index
    }, 
    BeyoundYesturday:{
      type: DELETE_ITEM_BY,
      index
    },
    BeyoundToday:{
      type: DELETE_ITEM_BT,
      index
    }
  };
  dispatch(names[name]);
};

export const setItemToAdd = (dispatch, newTodos, name) => {
  const names = {
    Yesterday: {
      type: SET_ITEM_Y,
      newTodos
    },
    Today: {
      type: SET_ITEM_T,
      newTodos
    },
    Blocker: {
      type: SET_ITEM_B,
      newTodos
    },  
     BeyoundYesturday:{
      type: SET_ITEM_BY,
      newTodos
    },
    BeyoundToday:{
      type: SET_ITEM_BT,
      newTodos
    }

  };
  dispatch(names[name]);
};
//What I want to do is edit the todo createdAt and endAt


//TOOGLE FOR LOAD
export const loading = dispatch => {
  dispatch({
    type: LOAD
  });
};
