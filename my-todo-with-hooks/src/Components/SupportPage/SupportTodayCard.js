import React, { useState } from 'react'
import moment from 'moment'
import {useSelector} from 'react-redux'
import { useSpring, animated, config } from 'react-spring'
import TextField from '@material-ui/core/TextField';
const compareForToday = (array) => {


    const today = new moment().local().format("YYYY-MM-DD")
    const todayInLine = []
    array.forEach(user => {
        if ((user.start <= today) && (user.end >= today)) {
            todayInLine.push(user)
        }
    })
    return todayInLine
}

export default function SupportTodayCard() {
 const state = useSelector(state => state);


    const firstLine = compareForToday([...state.support["1st line"]])
    const secondLine = compareForToday([...state.support["2nd line"]])
    const thirdLine = compareForToday([...state.support["3rd line"]])


    console.log(firstLine, "\n", secondLine, "\n", thirdLine)


    return (
        <>
            <div className="support-table-card">
                <div>

                    <Badge array={firstLine} name="1st Line" className="marginTop" />
                    <div className="line" />
                    <Badge array={secondLine} name="2nd Line" />
                    <div className="line" />
                    <Badge array={thirdLine} name="3rd Line" className="marginBottom" />


                </div>
            </div>
        </>
    )
}









const Badge = ({ array, name }) => {
 const [openTable, setOpenTable] = useState(false)
    const { ...rest } = useSpring({
        // ref: springRef,
        config: config.slow,
        opacity: openTable ? 1 : 0,
        // Add the new height 
        height: openTable ? (85 * array.length) + 10 : 0,
        from: { opacity: 0, height: 0 },
        overflow: "hidden"
    })

    if (array.length == 0 ) return <> 
     <div className="user-card" >
    {/* <div className="user-icon"></div> */}

            <div className="text-container">

                <div className="support-type"> {name}</div>
               
                    <div className="username"> NotAssign</div>

            </div> </div>
    
    </>

   

    return (<>
        <div className="user-card" 
        onMouseEnter={() => {
                setOpenTable(true)
            }
            }
            onMouseLeave={() => {
                setOpenTable(false)
            }}>

            <div className="user-icon"></div>

            <div className="text-container">

                <div className="support-type"> {name}</div>
                {array.length > 0 &&
                    <div className="username"> {array[0].name} </div>}

            </div> </div>
            
        <animated.div className="div-outer-container" style={{ ...rest }}>

            <div style = {{marginLeft: 20,marginRight:20}} key={name} >

                {/* here i'll map the slice array  */}
                {array.map((user, i) => {
                    return (


                        <div className="div-container1" key={i + user.name}>

                      <div className="textField-display">
                                    <TextField fullWidth id="standard-basic" label="" value={user.name} />
                                </div>

                     <div className="date-item">
                                    <TextField
                                        fullWidth
                                        id="datetime-local"
                                        label="start"
                                        type="date"
                                        value={user.start}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                                

                     <div className="date-item">

                                    <TextField
                                        fullWidth
                                        id="datetime-local"
                                        label="end"
                                        type="date"
                                        value={user.end}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                       

                     
                        </div>)
                }
                )}

            </div>

        </animated.div >



    </>
    )

}







// const ExpandingForm = ({ name, state }) => {

//     const [users, setUsers] = useState([])
//     const dispatch = useDispatch();









//     return (
//         <div className="container"
//             key={name}
            
//         >



//         </div>
//     )

// }



// use this to when i am making the standup page 
//    const standUp = compareForToday([...state.support["Stand Up"]])