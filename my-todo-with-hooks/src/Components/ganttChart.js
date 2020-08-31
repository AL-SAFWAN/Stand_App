import React from 'react'
import Chart from 'react-google-charts'
import moment from 'moment'

export default function ganttChart({todo, todos}) {


  const  createEventsFromTodo= (todo)=>{
    const {id , createdAt, endAt, isCompleted, text} = todo
    const event = 
    [
      id,
      text,
      null, 
      moment(createdAt).toDate(), 
      moment(endAt).toDate(), 
      null, 
      isCompleted === true ? 100: 0, 
      null
    ]
    return event
  } 
  const createEventsFromTodos = (todos)=> {
    const events =[  [
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'string', label: 'Resource' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ] ]
    todos.forEach(todo => {
      const event =createEventsFromTodo(todo)
       events.push(event)
     })
     return  events
  }
 var data = createEventsFromTodos(todos) 

    return (
<Chart
  width={'100%'}
  height={'400px'}
  chartType="Gantt"
  loader={<div>Loading Chart</div>}
  data={data}
  options={{
    height: 400,
    gantt: {
      trackHeight: 30,
    },
  }}
  rootProps={{ 'data-testid': '2' }}
/>
       
    )
}


