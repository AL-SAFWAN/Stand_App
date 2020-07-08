import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {useSelector} from 'react-redux'
import "./style.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);


export default function App() {
    const items = useSelector(state => state.items)

    const [events, setEvents]= useState(
       [
        {
            start: moment().toDate(),
            end: moment().add(1, "days").toDate(),
            title: "Some title",
          },  {
            start: moment('08 07 2020 12:15:00', "DD MM YYYY hh:mm:ss").toDate(),
            end: moment('08 07 2020 22:15:00', "DD MM YYYY hh:mm:ss").toDate(),
            title: "Some title 2",
          }
    ] 
    )
  
    const onEventResize = (data) => {
        const { start, end } = data;
    
         events[0].start = start;
            events[0].end = end;
          setEvents ({ events: events });
        
      };
    
     const  onEventDrop = (data) => {
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
              style={{ height: "40vh" }}
            />
          </div>
        );
  
    
}

