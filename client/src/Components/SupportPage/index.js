import React, { useState, useEffect } from "react";
import "./index.css"
import Support from '../Support'
import AddBoxIcon from '@material-ui/icons/AddBox';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import SupportTodayCard from './SupportTodayCard'
import axios from "axios";
import { setItemToAdd } from "../../action/itemActions";
import { useDispatch } from "react-redux";
import moment from 'moment'
import { returnErrors } from "../../action/errorAction";
import { tokenConfig } from '../../action/authAction'

import { animated, useSpring } from "react-spring";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from "react-router-dom";

var request = require('request');

// objective 

// 1. have a notice bar for the upcomoing support/ history for you          -NEED TO DO 
// 2. have a table to show whos on support and how long                     - DONE 
// 5. when i clicked a clander ticket i want to open up a table             -NOT DONE
//to show all the information about it to open the ticket in another window   ^
// to add it to my doing today list of todo's                                 ^  

// 3. have a table which shows the list of urgent ticket                    -DONE
// 4.then have a clanders of the tickets                                    -DONE





const CheckboxOption = ({ one, two, three, four, setOne, setTwo, setThree, setFour }) => {

    return (
        <div className="checkbox-container" >
            <div className="checkbox checkbox1"
                onClick={() => setOne(!one)}>
                <Checkbox
                    style={{ color: "green" }}
                    checked={one} />
                <p className="p">Low</p>
            </div>
            <div className="checkbox checkbox2"
                onClick={() => setTwo(!two)}
            >
                <Checkbox checked={two}
                    style={{ color: "royalblue" }} />
                <p className="p">Medium</p>
            </div>
            <div className="checkbox checkbox3"
                onClick={() => setThree(!three)}>
                <Checkbox checked={three}
                    style={{ color: "gold" }} />
                <p className="p">High</p>
            </div>
            <div className="checkbox checkbox4"
                onClick={() => setFour(!four)}>

                <Checkbox checked={four}
                    style={{ color: "red" }} />
                <p className="p" >Urgent</p>
            </div>

        </div>
    )
}

const SearchTable = ({ data, addTodo, text, setText }) => {
    const setColor = (i) => {
        switch (i) {
            case 1:
                return { color: "green" }
            case 2:
                return { color: "royalblue" }
            case 3:
                return { color: "gold" }
            case 4:
                return { color: "red" }
            default:
                return{color: "white"}
        }
    }

    const filteredData = data.filter(item => {
        if (text === false) return true
        return item.text.toLowerCase().includes(text.toLowerCase())
    }).map((item, i) => {
        return <div className="item" key={i} style={setColor(item.priority)}> {item.text}  <AddBoxIcon onClick={() => { addTodo(item.text) }} /></div>
    })



    return (
        <>
            <div className="table-container" >
                <TextField id="outlined-basic" label="Search Ticket" variant="outlined"
                    onChange={(e) => { setText(e.target.value) }}
                />

                <div style={{ overflowY: "scroll", marginTop: "10px" }}>
                    {filteredData
                    }
                </div>
            </div>
        </>
    )

}

export default function Index({ state }) {
    const dispatch = useDispatch()

    const token = tokenConfig(state)
    const addTodo = text => {

        const itemObj = {
            createdAt: moment().toDate(),
            name: "Today",
            text,
            isCompleted: false,
            index: 0,
            userId: state.auth.user.id,
            endAt: moment().add(2, "hours").toDate()
        };


        axios.post("/api/items", itemObj, token)
            .then((req, res) => {
                const todos = state.item.Today
                const newTodos = [req.data, ...todos];
                dispatch(() => setItemToAdd(dispatch, newTodos, "Today"));
                dispatch(() => returnErrors(`Added to Today's todo: ${text}`, "success", dispatch)
                )
            })
    };


    const spring2 = useSpring({
        from: { opacity: 0, transform: `translate3d(0,50%,0) scale(${0})` },
        to: async (next, cancel) => {
            await next({ opacity: 1, transform: `translate3d(0%,0,0) scale(${1})` })
        }

    }
    )

    const spring3 = useSpring({
        from: { opacity: 0, transform: `translate3d(0,-50%,0) scale(${0})` },
        to: async (next, cancel) => {
            await next({ opacity: 1, transform: `translate3d(0%,0,0) scale(${1})` })
        }
    }
    )

    const [one, setOne] = useState(true)
    const [two, setTwo] = useState(true)
    const [three, setThree] = useState(true)
    const [four, setFour] = useState(true)
    const [data, setData] = useState([])
    const [filterData, setFilteredData] = useState([])
    const [key, setKey] = useState(null)
    const [keyVal, setKeyVal] = useState([])


    useEffect(() => {
        if (state.auth.user === null) return
        axios.get("/api/auth/key/" + state.auth.user.id).then(res => {
            setKey(res.data.apiKey)
        })

    }, [state.auth.user])

    useEffect(() => {
        if (state.auth.user === null) return
        var headers = {
            'Content-Type': 'application/json'
        };

        var options = {
            url: 'https://acrosshealth.freshdesk.com/api/v2/tickets?per_page=100',
            headers: headers,
            auth: {
                'user': `${key}`,
                'pass': 'X'
            }
        };


        request(options, (error, response, body) => {
                console.log( response)

            if (response.statusCode === 401) {

                if (key !== null) {
                    dispatch(() => returnErrors("Invalid Api key", "error", dispatch))
                } else{
                    
                    dispatch(() => returnErrors("You have to be logged in Freshdesh to use this page ", "info", dispatch))
                }
                setKey(null)
            }

            if (!error && response.statusCode === 200) {

                dispatch(() => returnErrors("Valid Api key", "success", dispatch))
                axios.patch("/api/auth/update/" + state.auth.user.id, {
                    apiKey: key
                }).then(() => {
                    var obj = JSON.parse(body)
                    setData(
                        obj.map(ticket => {
                            const { created_at, subject, priority, id } = ticket
                            const item = {
                                createdAt: created_at,
                                text: subject,
                                priority,
                                id
                            }
                            return item
                        })
                    )
                })
            }
        })
    }, [key])

    useEffect(() => {
        const arr = data.filter(item => {
            return ((one ? 1 : 0) === item.priority) || ((two ? 2 : 0) === item.priority) || ((three ? 3 : 0) === item.priority) || ((four ? 4 : 0) === item.priority)
        })
        if (arr !== undefined) {
            setFilteredData(
                arr
            )
        }
    }, [one, two, three, four, data])

    const [text, setText] = useState(false)

    const handleClose = () => {
        setKey(keyVal)
    };


    return (
        <div>
            <Dialog open={key === null} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Freshdesk API key</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please provide your Freshdesk API
          </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="API KEY"
                        type="text"
                        fullWidth
                        onChange={e => setKeyVal(e.target.value)}
                    />

                </DialogContent>
                <DialogActions>

                    <Link to='/'> <Button color="primary">

                        Back
          </Button></Link>
                    <Button onClick={handleClose} color="primary">
                        Done
          </Button>

                </DialogActions>
            </Dialog>

            <animated.div style={{ ...spring3, display: "flex", justifyContent: "space-evenly" }}>
                <CheckboxOption one={one} two={two} three={three} four={four} setOne={setOne} setTwo={setTwo} setThree={setThree} setFour={setFour} />
                <SearchTable text={text} setText={setText} data={filterData} addTodo={addTodo} ></SearchTable>
                <div style={{ width: "23.5vw", marginTop: "2em" }}> <SupportTodayCard state={state} />
                </div>
            </animated.div>

            <animated.div className="calender" style={spring2}> <Support style={{ margin: "auto" }} data={filterData.filter(item => {
                if (text === false) return true
                return item.text.toLowerCase().includes(text.toLowerCase())
            })}></Support>

            </animated.div>

        </div>
    )
}
