import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, Checkbox } from '@material-ui/core'
import { animated } from 'react-spring'
import { useTransition,config } from 'react-spring'



const Todos = ({ array}) => {
 
 const transitions = useTransition(array, item => item.id, {

    from: { opacity: 0, transform: "translateX(5px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateX(-20px)" },
    // immediate: true,
    config: config.stiff,
  })

  return transitions.map(({ item, key, props }, index) =>
        <animated.div style={props} key={key}>{
          <ListItem key={item.id} role={undefined} disableRipple dense button >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.isCompleted}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText
              id={index} primary={item.text} />

          </ListItem>
        }</animated.div>

      )
  
}




export default function FactorySideCard({ name, style, array }) {

 
  console.log(array)
  return (<animated.div style={style} className="outer-container-side-left">
    <h1 className="text">{name}</h1>
    <div className="line"></div>
    <List className="list">

  <Todos array ={array}></Todos>
      


    </List></animated.div>
  )
}
