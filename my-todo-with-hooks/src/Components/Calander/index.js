import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "./style.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

 const ItemToEvent = (item) => {
    const event = {
      id: item.id,
      start: moment(item.createdAt).local().toDate(),
      end: moment(item.endAt).local().toDate(),
      title: item.text
    }
     return event
  }

export default function App({state}) {
  const [events, setEvents] = useState([])
  console.log("events :calander -> ", events)
  const items = state.item
  const { Yesterday, Today, Blocker, BeyoundYesturday } = items
  var cominedItems = [Yesterday, Today, Blocker, BeyoundYesturday]


  
  const loadItems= (cominedItems)=> {
    var array = []
    cominedItems.forEach(day => {
    day.forEach(item => {
     const event = ItemToEvent(item)
    array.push(event)
    })
  });
    setEvents(array)
  }

  useEffect(()=> loadItems(cominedItems), [state])

  const onEventResize = (data) => {
    console.log(data)
    const { start, end } = data;
  };

  const onEventDrop = (data) => {
    console.log(data);
  };


  return (
    <div className="App">
      <DnDCalendar
        defaultDate={moment().toDate()}
        defaultView="day"
        events={events}
        localizer={localizer}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        style={{ height: "56vh" }}
      />
    </div>
  );


}

