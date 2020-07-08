import React,{useState, useEffect} from 'react'
import "./Activity.css"
import color from '@material-ui/core/colors/amber';
import { green } from '@material-ui/core/colors';
import axios from "axios"
import { useDispatch, useSelector } from "react-redux";
import {loadUsersActivity, updateUsers} from "../action/userActivityAction"
export default function ActivityGraph() {
    const dispatch = useDispatch();

    const state = useSelector(state => state)
    // // user redux for this 
const userActivity = useSelector(state => state.userAcitvity)
   const {activeUsers,blockedUsers,neutralUsers} = userActivity
   

   useEffect( ()=> {
    dispatch(()=>{loadUsersActivity(dispatch)})  
    
},[])





    const MakeUsers = ({ users, color, borderColor }) => {

        const style = {
            width: "85px",
            height: "85px",
            background: color,
            borderRadius: "50px",
            margin: "auto",
            border: "1px solid " + borderColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"

        }
        const testStyle = {
            // paddingTop: "30px",
            // paddingLeft: "30px"
        }

        const produceItems = () => {
            var items = [];
            for (var i = 0; i < users.length; i++) {
                items.push(<div style={style} key={i}> <div style={testStyle}>{users[i].name}</div></div>)
            }
            return items
        }


        return (<React.Fragment > {produceItems()} </React.Fragment >)

    }


    const calcWdith = (numberOfUsers) => {
        var width;

        if (numberOfUsers <= 2) {
            width = 100 + "px"

        }
        else {
            if (numberOfUsers < 4) {
                width = numberOfUsers * 150 / 2 + "px"

            } else {


                if (numberOfUsers % 2 == 0) {
                    width = numberOfUsers * 100 / 2 + "px"
                } else {
                    width = numberOfUsers * 120 / 2 + "px"
                }
            }
        }

        return width
    }


    const active = {
        display: "flex",
        flexWrap: "wrap",
        border: " 1px dotted rgb(219, 221, 217)",
        borderRadius: " 30px",
        flexGrow: "1",
        margin: "15px",
        maxWidth: calcWdith(activeUsers.length),
        padding: "5px"


    }
    const neutral = {
        display: "flex",
        flexWrap: "wrap",
        border: " 1px dotted rgb(219, 221, 217)",
        borderRadius: " 30px",
        flexGrow: "1",
        margin: "15px",
        maxWidth: calcWdith(neutralUsers.length),
        padding: "5px"

    }
    const blocker = {
        display: "flex",
        flexWrap: "wrap",
        border: " 1px dotted rgb(219, 221, 217)",
        borderRadius: " 30px",
        flexGrow: "",
        margin: "15px",
        maxWidth: calcWdith(blockedUsers.length),
        padding: "5px"
    }

    const textOut = {
        posiston: "absolute"
    }

    return (
        <div className="aqua">


            <div style={active} >
                <MakeUsers users={activeUsers} color={"#44f94491"} borderColor={"rgb(0, 200, 83)"} />
            </div>
            <div style={neutral} >
                <MakeUsers users={ neutralUsers} color={"#abbcf2"} borderColor={"rgba(40, 171, 191, 0.57"} />
            </div>
            <div style={blocker} >  <MakeUsers users={blockedUsers} color={"rgb(255, 136, 136)"} borderColor={"#f50057"} /></div>




        </div>
    )
}

//  sort the users based on activity  