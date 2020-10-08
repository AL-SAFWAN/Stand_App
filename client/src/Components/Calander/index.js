import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useDispatch } from 'react-redux'
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "./style.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { setItemToAdd } from "../../action/itemActions";
import { tokenConfig } from '../../action/authAction'
import {loadNote} from '../../action/noteAction'


const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const ItemToEvent = (item) => {
  const event = {
    id: item.id,
    name: item.name,
    start: moment(item.createdAt).local().toDate(),
    end: moment(item.endAt).local().toDate(),
    title: <p style={item.isCompleted ? { color: "lightgreen" } : {}}>{item.text}</p>,
    style: item.isCompleted ? { background: "lightgreen" } : {},
    ...item
  }
  return event
}

export default function App({ state }) {

  const objToArr = (state) => {
    let arr = []
    const itemsObj = Object.values(state.item)
    itemsObj.forEach(type => {
      if (typeof (type) !== "object") return
      const items = [...type]
      items.forEach(item => {
        const itemObj = {
          day: moment(item.createdAt).format('DD/MM/YYYY'),
          done: item.isCompleted,
          ...item
        }
        arr.push(itemObj)
      })
    })
    return arr.sort((a, b) => new moment(a.day, 'DD/MM/YYYY').format('YYYYMMDD') - new moment(b.day, 'DD/MM/YYYY').format('YYYYMMDD'))
  }

  const groupBy = (OurArray, property) => {

    return OurArray.reduce(function (accumulator, object) {
      const key = object[property];

      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(  {
        createdAt: object.createdAt,
        endAt: object.endAt,
        id: object.id,
        index: object.index,
        isCompleted: object.isCompleted,
        name: object.name,
        text: object.text
      });
      return accumulator;

    }, {});
  }

  const dispatch = useDispatch()
  const token = tokenConfig(state)
  const [events, setEvents] = useState([])

  // bind the items together 
  const items = state.item
  const { Yesterday, Today, Blocker, BeyoundYesturday, BeyoundToday } = items
  var combinedItems = [Yesterday, Today, Blocker, BeyoundYesturday, BeyoundToday]


  // loading the evented items 
  const loadItems = (cominedItems) => {
    var array = []
    cominedItems.forEach(day => {
      day.forEach(item => {
        const event = ItemToEvent(item)
        array.push(event)
      })
    });
    setEvents(array)
  }

  useEffect(() => loadItems(combinedItems), [state])

  const date = (date) => {
    const ndate = new Date()
    const now = moment(ndate.toDateString(), "ddd MMM DD YYYY")

    const start = moment(date, "MM/DD/YYYY")

    const diff = now.diff(start, "days")


    if (diff >= 2) {
      return "BeyoundYesturday"
    } else if (diff === 1) {

      return "Yesterday"
    } else if (diff === 0) {
      return "Today"
    } else {
      return "BeyoundToday"
    }
  }



  const update = (copiedItems, copiedTodo) => {
    dispatch(() => setItemToAdd(dispatch, copiedItems, copiedTodo.name));

    axios.patch("/api/items/" + copiedTodo.id, {
      id: copiedTodo.id,
      createdAt: copiedTodo.createdAt,
      endAt: copiedTodo.endAt,
      name: copiedTodo.name
    }, token)
  }

  const onEventResize = (data) => {
    const { start, end, event } = data;
    // finding the todo that was picked up, based from then event name passed in orginally 
    const [copiedTodo] = items[event.name].filter((todo) => todo.id === event.id)


    // index picked up based from the event 
    const index = items[event.name].indexOf(copiedTodo)


    copiedTodo.createdAt = start
    copiedTodo.endAt = end

    const copiedItems = [...items[event.name]]

    copiedItems.splice(index, 1, copiedTodo)

    update(copiedItems, copiedTodo)

  };

  const onEventDrop = (data) => {

    // need to handle the change in array of the weeks and months 
    const { start, end, event } = data;

    // this is based on the desination 
    var name = date(moment(start).format("MM/DD/YYYY"))


    // finding the todo that was picked up, based from then event name passed in orginally 
    const copyS = [...items[event.name]]
    // problem could happen because of this ^
    const [theCopiedTodo] = copyS.filter((todo, index) => {
      if (todo.id === event.id) {
        copyS.splice(index, 1)
        return true
      }
      return false
    })
    if (name === theCopiedTodo.name) {
      onEventResize(data)
    }
    else {

      update(copyS, theCopiedTodo)
      console.log(theCopiedTodo)
      theCopiedTodo.createdAt = moment(start).format()
      theCopiedTodo.endAt = moment(end).format()

      theCopiedTodo.name = name



      const copyD = items[theCopiedTodo.name]
      copyD.splice(0, 0, theCopiedTodo)

      update(copyD, theCopiedTodo)

    }
  };

  // this is used to open the notes 
  // it was used for Y-T-B, but what about beyond Y and T 



  const onClick = (e) => {
    const itemArray = objToArr(state)

    const date = moment(e.createdAt).format('DD/MM/YYYY')
    const dates = groupBy(itemArray, "day")
    const todos = dates[date]
    const todo = {
      createdAt: e.createdAt,
      endAt: e.endAt,
      id: e.id,
      index: e.index,
      isCompleted: e.isCompleted,
      name: e.name,
      text: e.text
    }
    
    dispatch(() => { loadNote(dispatch, todo, todos, token) })
    
    console.log(e,  todos)
  }

  return (
    <div className="App">
      <DnDCalendar
        className="Calendar"
        defaultDate={moment().toDate()}
        defaultView="week"
        events={events}
        localizer={localizer}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        onSelectEvent={onClick}
        resizable
        style={{ height: "48vh", width: "90vw", margin: "auto" }}
      />
    </div>
  );


}

