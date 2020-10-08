import React, { useState } from 'react'
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, IconButton } from '@material-ui/core'
import {useSelector} from 'react-redux'
import {tokenConfig} from '../../action/authAction'
import DeleteIcon from "@material-ui/icons/Delete";
import { animated } from 'react-spring'
import { useTransition, config } from 'react-spring'
import axios from 'axios'


const checkStyle = done => {
  var colorStyle = {};
  if (done) {
    colorStyle = {
      color: "#00c853"
    };
  } else {
    colorStyle = {
      color: "#00b8d4"
    };
  }
  return colorStyle;
};

const Todos = ({ array ,setArray }) => {



  const transitions = useTransition(array, item => item.id, {

    from: { opacity: 0, transform: "translateY(-50px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { display: "none" },

    config: config.wobbly,
  })


  return transitions.map(({ item, key, props }, index) => <Item setArray ={setArray} array={array} item={item} key={key}  props={props} index={index} />

  )

}

const Item = ({ item, props, index,array,setArray }) => {

 const state = useSelector(state=>state)
  const [check, setCheck] = useState(item.isCompleted)
  const [clicked, setClicked] = useState(false);
const token = tokenConfig(state)

  const deleteTodo = () => {

    setArray(array.filter( i => i.id!==item.id ) )
    setClicked(true);
    axios.delete("/api/items/" + item.id, token)
    

  } 
  
  const handelCheck= () => {
    
    var checking = !check 
       
    axios.patch("/api/items/" + item.id, {
      id: item.id,
      isCompleted: checking
    }, token)
    setCheck(checking);
 

  };

  return (<animated.div style={props} >

    <ListItem key={item.id} role={undefined} disableRipple dense button >
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={check}
          disableRipple
          onClick={handelCheck}
        />
      </ListItemIcon>
      <ListItemText
        style={checkStyle(check)}
        id={index} primary={item.text} />

      <IconButton
        edge="end"
        aria-label="comments"
        onClick={deleteTodo}
        disabled={clicked}
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>



  </animated.div>)

}




export default function FactorySideCard({ name, style, array, setArray }) {
   

  return (<animated.div style={style} className="outer-container-side-left">
    <h1 className="text">{name}</h1>
    <div className="line"></div>
    <List className="list" style={{ margin: 10 }}>

      <Todos array={array} setArray ={setArray}> </Todos>



    </List></animated.div>
  )
}
