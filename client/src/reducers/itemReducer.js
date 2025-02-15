import {
  LOAD_ITEMS,
  LOAD,
  DELETE_ITEM_Y,
  DELETE_ITEM_T,
  DELETE_ITEM_B,
  SET_ITEM_Y,
  SET_ITEM_T,
  SET_ITEM_B,
  SET_ITEM_BY,
  DELETE_ITEM_BY,
  SET_ITEM_BT,
  DELETE_ITEM_BT
} from "../action/type";

const initialState = {
  Yesterday: [],
  Today: [],
  Blocker: [],
  BeyoundYesturday: [],
  BeyoundToday: [],
  onLoad: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_ITEMS:
      return {
        ...state,
        Yesterday: action.Yesterday,
        Today: action.Today,
        Blocker: action.Blocker,
        BeyoundYesturday: action.BeyoundYesturday,
        BeyoundToday: action.BeyoundToday,
        onLoad: false
      };
    case LOAD:
      return {
        ...state,
        onLoad: true
      };

    case DELETE_ITEM_Y:
      return {
        ...state,
        Yesterday: state.Yesterday.filter(
          (item, index) => index !== action.index
        )
      };

    case DELETE_ITEM_T:
      return {
        ...state,
        Today: state.Today.filter((item, index) => index !== action.index)
      };

    case DELETE_ITEM_B:
      return {
        ...state,
        Blocker: state.Blocker.filter((item, index) => index !== action.index)
      };

    case DELETE_ITEM_BY:
      return {
        ...state,
        BeyoundYesturday: state.BeyoundYesturday.filter((item, index) => index !== action.index)
      };
    case DELETE_ITEM_BT:
      return {
        ...state,
        BeyoundToday: state.BeyoundToday.filter((item, index) => index !== action.index)
      };

    case SET_ITEM_Y:
      return {
        ...state,
        Yesterday: action.newTodos
      };
    case SET_ITEM_T:
      return {
        ...state,
        Today: action.newTodos
      };
    case SET_ITEM_B:
      return {
        ...state,
        Blocker: action.newTodos
      };
    case SET_ITEM_BY:
      return {
        ...state,
        BeyoundYesturday: action.newTodos
      };
    case SET_ITEM_BT:
      return {
        ...state,
        BeyoundToday: action.newTodos
      };

    default:
      return state;
  }
}
