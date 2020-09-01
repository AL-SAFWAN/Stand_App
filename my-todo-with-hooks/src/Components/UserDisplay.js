import React,{ useEffect} from 'react'
import "./Activity.css"
import { useDispatch } from "react-redux";
import {loadUsersActivity} from "../action/userActivityAction"
import Img from '../img/support.png'
export default function ActivityGraph({state}) {
    const dispatch = useDispatch();

    // // user redux for this 
const userActivity = state.userAcitvity

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
            border: "2px solid " + borderColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"

        }
        const imgStyle = {
            width: "29px",
            position: "fixed",
            marginTop: "30px",
            marginLeft: "30px",
            background: color,
            borderRadius: "50%",
            border: "2px solid " + borderColor,
        }

        const produceItems = () => {
            var items = [];
            for (var i = 0; i < users.length; i++) {
                // produce the support logo here by doing 
                // user[i].isSupport then push into the array with the img 
                // else normal push 

                items.push(<div style={style} key={i}> {users[i].name}<img src={Img} style={imgStyle} /></div>)
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