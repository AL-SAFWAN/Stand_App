import {
  LOAD_ITEMS,
  LOAD,
  DELETE_ITEM_T,
  DELETE_ITEM_B,
  DELETE_ITEM_Y,
  SET_ITEM_Y,
  SET_ITEM_T,
  SET_ITEM_B
} from "./type";
import axios from "axios";
import {tokenConfig} from './authAction'
import { returnErrors } from "./errorAction";


//this is only prerformed once
export const loadItem = dispatch => {
  dispatch(() => loading(dispatch));

  axios.get("/api/items").then(res => {
    dispatch({
      type: LOAD_ITEMS,
      Yesterday: res.data.Items.Yesterday,
      Today: res.data.Items.Today,
      Blocker: res.data.Items.Blocker
    })
  }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));;
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
    }
  };
  console.log(name)
  dispatch(names[name]);
};

//TOOGLE FOR LOAD
export const loading = dispatch => {
  dispatch({
    type: LOAD
  });
};
