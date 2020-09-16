import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { green, lightBlue, yellow, red } from "@material-ui/core/colors";



const localizer = momentLocalizer(moment);

var request = require('request');


const ItemToEvent = (item) => {

  const setColor = () =>{
    
    switch(item.priority){
      case 1 :
        return {color:"lightgreen"}
      case 2 :
        return{color: "lightBlue"}
      case 3 :
         return {color: "gold"} 
      case 4:
        return {color: "red"}
    }
  }
  
  const style = {
    color: setColor
  }
  const url = "https://support.abehrdigital.com/a/tickets/"+ item.id
  const event = {
  //   id: item.id,
  //   name: item.name,
    start: moment(item.createdAt).local().toDate(),
    end: moment(item.createdAt).local().add(3,"hour").toDate(),
    title: <a href={url} target="_blank" style = {setColor()}>{item.text}</a>
  }
  return event
}





export default function App({className}) {
  
  const [events, setEvents] = useState([])

  const [data, setData] = useState([])


  // loading the evented items 
 
    var headers = {
    'Content-Type': 'application/json'
};

var options = {
    url: 'https://acrosshealth.freshdesk.com/api/v2/tickets',
    headers: headers,
    auth: {
        'user': 'kQXIq7tf8krxBCtan8WM',
        'pass': 'X'
    }
};

   const fetchData=()=>{ 
     var array = []
    
    request(options, (error, response, body) =>{
      if (!error && response.statusCode == 200) { 

          var obj = JSON.parse(body)

          obj.forEach(ticket =>{
            const {created_at, subject,priority,id} = ticket
            const item ={createdAt: created_at,
            text: subject,
            priority,
            id
          }
            const event = ItemToEvent(item)
            array.push(event)

            console.log(created_at, subject
               ) })
               setEvents(array)
               setData(obj)
               console.log(obj)
      }
  })
  }


  
   const onClick=(data)=>{
    console.log(data)
    // I can use this to open to view more at the bottom 

   }
  


useEffect( ()=>fetchData(),[])


  
  return (
<Calendar
          className= {className}
         defaultDate={moment().toDate()}
         defaultView="week"
         events={events}
         localizer={localizer}
         style={{ height: "48vh" , width:"48vw"}}
         onSelectEvent={onClick}
  />
  );


}




