import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);


const ItemToEvent = (item) => {
  
  const setColor = () => {
    switch (item.priority) {
      case 1:
        return { color: "lightgreen" }
      case 2:
        return { color: "lightBlue" }
      case 3:
        return { color: "gold" }
      case 4:
        return { color: "red" }
    }
  }




  const url = "https://support.abehrdigital.com/a/tickets/" + item.id
  const event = {
    //   id: item.id,
    //   name: item.name,
    start: moment(item.createdAt).local().toDate(),
    end: moment(item.createdAt).local().add(3, "hour").toDate(),
    title: <a href={url} target="_blank" style={setColor()}>{item.text}</a>
  }
  return event
}





export default function App({ data }) {

  const [events, setEvents] = useState([])

  const fetchData = () => {
    console.log(data)
    setEvents(
      data.map(ticket => {
        const event = ItemToEvent(ticket)
        return event
      })
    )

  }



  const onClick = (data) => {
    console.log(data)
    // I can use this to open to view more at the bottom 

  }


  // need to use clean up function for these type of useEffect, oe
  useEffect(() => fetchData(), [data])

  return (
    <Calendar
      defaultDate={moment().toDate()}
      defaultView="day"
      events={events}
      localizer={localizer}
      style={{ height: "48vh", width: "90vw" ,margin : "auto"}}
      onSelectEvent={onClick}
    />
  );


}




