import React, { useState, useRef } from "react";
import "./index.css"
import { TextField } from '@material-ui/core'
import { KeyboardArrowLeft } from '@material-ui/icons';
import { IconButton, } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTrail, animated, useTransition, config, useSpring,useSprings, useChain,interpolate } from 'react-spring'


let idKey = 0



const Todos = ({ config = { mass: 5, tension: 650, friction: 55 }, todos, onDeleteTodo, trRef }) => {
    const transitions = useTransition(todos, item => item.key, {
        ref: trRef,
        from: { opacity: 0, transform: "translateY(-10px)" },
        enter: { opacity: 1, transform: "translateY(0)" },
        leave: { opacity: 0, transform: "translateY(20px)" },
        immediate: true,
        // config: (item, state) => (state === 'leave' ? { duration: 10 } : config),
    })
    return transitions.map(({ item, key, props }, index) =>
        (
            <animated.div style={props} key={key}>{
                <div className="listItem">
                    <div className="todo">{item.todo}</div>
                    <IconButton onClick={() => onDeleteTodo(item.key)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            }</animated.div>
        )
    )
}


const FactoryInputField = ({ id }) => {

    const [todos, setTodos] = useState([]);
    const [openTable, setOpenTable] = useState(false)
    const [value, setValue] = useState("");
    const springRef = useRef()
    const { size, opacity, x, ...rest } = useSpring({
        ref: springRef,
        config: config.gentle,
        // opacity: openTable ? 1 : 0,
        x: openTable ? 90 : 0,
        height: openTable ? 47 * todos.length : 0,
        from: { opacity: 0, x: 0, height: 0 },
        // reverse: !openTable,
        overflow: "hidden"
    })
    const trRef = useRef()
    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        todos.push({ todo: value, key: idKey++ })
        // setTodos([...todos,{ todo: value, key: id++ } ])
        setValue("");
    };
    const deleteTodo = (index) => {
        setTodos(todos.filter((todo) => todo.key !== index))
    }
    console.log("open table is?", openTable)
    useChain(openTable ? [springRef, trRef] : [trRef, springRef])
    return (


        <div className="textGrid" //
            onFocus={() => setOpenTable(true)
                // we want to open the table down here and rotate the arrow 
            }
            onBlur={() => {
                setOpenTable(false)

            }
                // we want to close the table down here and rotate the arrow 
            }>
            <div>
                <form
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        fullWidth={true}
                        className="textfield"
                        id={id}
                        label={id}
                        variant="outlined"

                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                </form>
            </div>
            <animated.div className="arrow" style={{ transform: x.interpolate(x => `rotate(-${x}deg)`) }}> <KeyboardArrowLeft fontSize="large" /></animated.div>
            <animated.div className="list" style={{ ...rest }}>
                <Todos todos={todos} onDeleteTodo={deleteTodo} trRef={trRef} />
            </animated.div>
            <div></div>
        </div>



    )
}

const MakeCard = ({ name, index }) => {
    const userRef = useRef()
    console.log(userRef,index)
    return (<React.Fragment>
 
        <div ref={userRef} className="outer-container">
            <div className="parent-container">
                <div className="flex-container">
                    <img className="imgBg" />
                    <h1 className="userName"> {name}</h1></div>
                <div></div>
            </div>
            <br></br>
            <FactoryInputField id={"Yesterday"} />
            <FactoryInputField id={"Today"} />
            <FactoryInputField id={"Blocker"} />
        </div>

    </React.Fragment>)
}

const userData = [
    { name: "Safwan" }, { name: "Luke" }, { name: "Paul" }, { name: "Justin" },
    { name: "Hari" }, { name: "Jones" }

]


const to = i => ({ x: 0, y: i * -4, scale:1, rot: -10 + Math.random() * 20, delay: i * 100})

const from = i => ({ x: 0, rot: 0, scale: 1.6, y: 0 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const transformFn = (r, s) => `perspective(1500px) rotateX(3deg) rotateY(${r / 5}deg) rotateZ(0deg) scale(${s})`


const Users = () => {
   
    // this array will be used to animate the sprint to move 
    const users = userData.map((user,i) => <MakeCard  name={user.name} index={i}/>)

    const [props, set] = useSprings(users.length, i => ({ ...to(i), from: from(i) }))

    return props.map(({ x, y, rot, scale, ...rest }, i) => (
    <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${0}px,${0}px,0)`), }}>
     
      <animated.div style={{ transform: interpolate([rot, scale], transformFn)}} >{users[i]} </animated.div>
    </animated.div>
  ))

}
// style ={{transform:  `translateX(${(window.innerWidth/2)-350}px)`}}
export default function Index() {
    return (<div className="formDiv" >
        <Users />
    </div>)
}

// first we need to make the card
// the card will take in the user information to be displayed 
// the card will take in information via a text field and will be sored in an expanable table which can be edited if needed ]
// 