import React, { useEffect, useState } from 'react'
import "./setting.css"
import PersonIcon from '@material-ui/icons/Person';
import KeyImg from '@material-ui/icons/VpnKey';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import TextField from '@material-ui/core/TextField';
import { Avatar, Button } from '@material-ui/core';
import { useSprings, animated, useSpring,config } from 'react-spring'





// on click event that renders based on the icon i clicked 
// so have different step and render them below 




export default function Index() {


    const [step, setStep] = useState(1)
    

    const [boxProps, setBoxProps , stop] = useSpring(() => ({
        config: config.molasses,
        to: {opacity: 1, width: 45, background: `linear-gradient(463deg, #96fbc4, #3f51b5)`},
      from: {opacity: 0, width:0, },
    reset: false,

    }))

    const to = i => ({ opacity: 0.5, transform: "scale(1)" })
    const from = i => ({ opacity: 0,  transform: "scale(1)"})




    const [props, set] = useSprings(3, i => ({ config: config.wobbly,...to(i), from: from(i) }))

    const transform ={
        opacity:1, transform:" scale(1.1)"
    }
    const returnTransform ={
        opacity:0.5, transform:" scale(1)"
    }
    const menuList = [
        <li className="list-item">
            <PersonIcon
                style={{ fontSize: 130 }}
                onClick={() => {
                    setBoxProps({reset:true})
                    set(
                        i=> {
                        if(i!==0 ) return (returnTransform)
                        return(transform)
                    })
                    setStep(1)}
                }
            ></PersonIcon>
        </li>,

        <li className="list-item">
            <LockOpenIcon style={{ fontSize: 130 }}
                onClick={() => {
                    setBoxProps({reset:true})
                    set(
                        i=> {
                            
                        if(i!==1 ) return (returnTransform)
                        return(transform)
                    })
                    setStep(2)}
                }
            ></LockOpenIcon>
        </li>
        ,
        <li className="list-item">
            <KeyImg style={{ fontSize: 130 }}
                onClick={() => {
                    setBoxProps({reset:true})
                    set(
                        i=> {
                        if(i!==2 ) return (returnTransform)
                        return(transform)
                    })
                    setStep(3)}
                }
            ></KeyImg>
        </li>
    ]
    useEffect(()=>{  set(
        i=> {
        if(i!==0 ) return (returnTransform)
        return(transform)
    })},[])

    return (
        <div className="box">
            <animated.div className="back-box" 
            style={{...boxProps, width: boxProps.width.interpolate(width=>`${width}vw`) } }
            />

            <nav className="nav">
                <ul className="ul">

                    {props.map((style, i) => {

                        return (
                        <animated.div
                            style={style}
                            children={menuList[i]} >

                        </animated.div>)
                    })}

                </ul>

            </nav>

            <div className="content">
                <RenderContent step={step} />
            </div>

        </div>
    )
}
const RenderContent = ({ step }) => {
    switch (step) {
        case 1:
            return <Person />
        case 2:
            return <Password />
        case 3:
            return <Key />
        default:
            return <Person />

    }
}

const Person = () => {

    return (
        <div className="person">

            <div className="text-item-img">
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Avatar style={{ width: 65, height: 65, fontSize: 14, margin: 5, marginRight: 10 }} src > {"safwan"}</Avatar>
                    <h1 style={{ marginLeft: 10 }}>safwan</h1>
                </div>

                <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="contained-button-file"
                    multiple
                    type="file"
                // onChange={onChange}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span" >
                        Upload Image
        </Button>

                    <Button style={{ marginLeft: 5 }} variant="contained" >
                        set
             </Button></label>


            </div>

            <div className="text-item">
                <TextField fullWidth={true} id="outlined-basic1" label="Username" variant="outlined" />
            </div>

            <div className="text-item">
                <TextField fullWidth={true} id="outlined-basic1" label="Email" variant="outlined" />
            </div>
            <div className="text-item-button-person">
                <Button variant="contained" color="primary" component="span" >
                    cancel
        </Button>

                <Button style={{ marginLeft: 5 }} variant="contained" >
                    Change Details
      </Button>
            </div>
        </div >
    )
}

const Password = () => {

    return (
        <div className="person">

            <div className="text-item-img">

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Avatar style={{ width: 65, height: 65, fontSize: 14, margin: 5, marginRight: 10 }} src > {"safwan"}</Avatar>
                    <h1 style={{ marginLeft: 10 }}>safwan</h1>
                </div>

            </div>

            <div className="text-item">
                <TextField fullWidth={true} id="outlined-basic1" label="Old Password" variant="outlined" />
            </div>

            <div className="text-item">
                <TextField fullWidth={true} id="outlined-basic1" label="New Password" variant="outlined" />
            </div>

            <div className="text-item">
                <TextField fullWidth={true} id="outlined-basic1" label="Confirm New Password" variant="outlined" />
            </div>

            <div className="text-item-button">
                <Button variant="contained" color="primary" component="span" >
                    cancel
        </Button>

                <Button style={{ marginLeft: 5 }} variant="contained" >
                    Change Password
      </Button>
            </div>
        </div >
    )
}


const Key = () => {

    return (
        <div className="person">

            <div className="text-item-img">

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Avatar style={{ width: 65, height: 65, fontSize: 14, margin: 5, marginRight: 10 }} src > {"safwan"}</Avatar>
                    <h1 style={{ marginLeft: 10 }}>safwan</h1>
                </div>

            </div>



            <div className="text-item">
                <TextField fullWidth={true} id="outlined-basic1" label="Freshdesk api key" variant="outlined" />
            </div>


            <div className="text-item-button-key">
                <Button variant="contained" color="primary" component="span" >
                    cancel
        </Button>

                <Button style={{ marginLeft: 5 }} variant="contained" >
                    Change Password
      </Button>
            </div>
        </div >
    )
}
