import React, { useEffect, useState } from 'react'
import "./setting.css"
import PersonIcon from '@material-ui/icons/Person';
import KeyImg from '@material-ui/icons/VpnKey';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import TextField from '@material-ui/core/TextField';
import { Avatar, Button } from '@material-ui/core';
import { useSprings, animated, useSpring, config } from 'react-spring'
import { useDispatch } from 'react-redux'
import { login, passwordCheck, updateDetails, updatePassword } from '../../action/authAction';
import axios from 'axios';
import { returnErrors } from '../../action/errorAction';

var request = require('request');



// on click event that renders based on the icon i clicked 
// so have different step and render them below 




export default function Index({ state }) {


    const [step, setStep] = useState(1)


    const [boxProps, setBoxProps, stop] = useSpring(() => ({
        config: config.molasses,
        to: { opacity: 1, width: 60, background: `linear-gradient(463deg, #96fbc4, #3f51b5)` },
        from: { opacity: 0, width: 0, },
        reset: false,

    }))

    const to = i => ({ opacity: 0.5, transform: "scale(1)" })
    const from = i => ({ opacity: 0, transform: "scale(1)" })




    const [props, set] = useSprings(3, i => ({ config: config.wobbly, ...to(i), from: from(i) }))

    const transform = {
        opacity: 1, transform: " scale(1.1)"
    }
    const returnTransform = {
        opacity: 0.5, transform: " scale(1)"
    }
    const menuList = [
        <li className="list-item">
            <PersonIcon
                style={{ fontSize: 130 }}
                onClick={() => {
                    setBoxProps({ reset: true })
                    set(
                        i => {
                            if (i !== 0) return (returnTransform)
                            return (transform)
                        })
                    setStep(1)
                }
                }
            ></PersonIcon>
        </li>,

        <li className="list-item">
            <LockOpenIcon style={{ fontSize: 130 }}
                onClick={() => {
                    setBoxProps({ reset: true })
                    set(
                        i => {

                            if (i !== 1) return (returnTransform)
                            return (transform)
                        })
                    setStep(2)
                }
                }
            ></LockOpenIcon>
        </li>
        ,
        <li className="list-item">
            <KeyImg style={{ fontSize: 130 }}
                onClick={() => {
                    setBoxProps({ reset: true })
                    set(
                        i => {
                            if (i !== 2) return (returnTransform)
                            return (transform)
                        })
                    setStep(3)
                }
                }
            ></KeyImg>
        </li>
    ]
    useEffect(() => {
        set(i => {
            if (i !== 0) return (returnTransform)
            return (transform)
        })
    }, [])

    return (
        <div className="box">
            <animated.div className="back-box"
                style={{ ...boxProps, width: boxProps.width.interpolate(width => `${width}vw`) }}
            />

            <nav className="nav">
                <ul className="ul">

                    {props.map((style, i) => {

                        return (
                            <animated.div
                                style={style}
                                children={menuList[i]}
                                key={i}
                            >

                            </animated.div>)
                    })}

                </ul>

            </nav>

            <div className="content">
                <RenderContent step={step} state={state} />
            </div>

        </div>
    )
}

const RenderContent = ({ step, state }) => {
    if (state.auth.user === null) return <></>
    switch (step) {
        case 1:
            return <Person user={state.auth.user} />
        case 2:
            return <Password user={state.auth.user} />
        case 3:
            return <Key user={state.auth.user} />
        default:
            return <Person user={state.auth.user} />
    }
}


const Person = ({ user }) => {

    const dispatch = useDispatch()
    const [file, setFile] = useState('')





    const [filePath, setFilePath] = useState(user.filePath)
    const [username, setUsername] = useState(user.name)
    const [email, setEmail] = useState(user.email)

    const onSubmit = async (e) => {

        e.preventDefault()
        const formData = new FormData();
        formData.append(`file`, file)

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            })
            const { fileName, filePath } = res.data
            setFilePath(filePath)
            console.log("file uploaded")
        }


        catch (err) {
            console.log(err.response.data.msg)
        }
    }


    const onChange = (e) => {

        setFile(e.target.files[0])
    }

    const onCancel = () => {
        setEmail('')
        setUsername('')

    }

    const onChangeDetails = () => {

        console.log("Change details here on db")
        const userObj = {
            name: username,
            email,
            filePath,
            id: user.id

        }
        dispatch(() => updateDetails(userObj)(dispatch))
        onCancel()
    }

    return (
        <div className="person">

            <div className="text-item-img">
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Avatar style={{ width: 65, height: 65, fontSize: 14, margin: 5, marginRight: 10 }} src={user.filePath} > {user.name}</Avatar>
                    <h1 style={{ marginLeft: 10 }}>{user.name}</h1>
                </div>

                <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={onChange}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span" >
                        Upload Image
        </Button>

                    <Button style={{ marginLeft: 5 }} variant="contained" onClick={onSubmit} >
                        set
             </Button></label>


            </div>

            <div className="text-item">
                <TextField value={username} onChange={(e) => setUsername(e.target.value)} fullWidth={true} id="outlined-basic1" label="Username" variant="outlined" />
            </div>

            <div className="text-item">
                <TextField value={email} onChange={(e) => setEmail(e.target.value)} fullWidth={true} id="outlined-basic1" label="Email" variant="outlined" />
            </div>
            <div className="text-item-button-person">
                <Button variant="contained" color="primary" component="span" onClick={onCancel} >
                    cancel
        </Button>

                <Button style={{ marginLeft: 5 }} variant="contained" onClick={onChangeDetails}>
                    Change Details
      </Button>
            </div>
        </div >
    )
}

const Password = ({ user }) => {

    const dispatch = useDispatch()


    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [samePass, setSamePass] = useState('')

    const onCancel = () => {
        setOldPass('')
        setNewPass('')
        setSamePass('')
    }

    const matchingPassword = () => {
        let pass = false

        if (newPass !== samePass) {
            console.log("password is not the same ")
            dispatch(() => returnErrors("Password does not match", "error", dispatch))
            setNewPass('')
            setSamePass('')
            pass = false
        } else {
            pass = true
        }

        return pass

    }

    const onSubmit = () => {

        const setMatched = (result) => {
            if (result && matchingPassword()) {
                const userObj = {
                    password: newPass,
                    id: user.id
        
                }
                    console.log("send the new password")
                    updatePassword(userObj)(dispatch)
                    setNewPass('')
                    setSamePass('')
                    setOldPass('')
            } else {
                console.log('the password did not match so set to null')
                setOldPass('')
            }
        }

        const User = { email: user.email, password: oldPass, dispatch, setMatched };
        passwordCheck(User)





    }
    return (
        <div className="person">

            <div className="text-item-img">

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Avatar style={{ width: 65, height: 65, fontSize: 14, margin: 5, marginRight: 10 }} src={user.filePath} > {user.name}</Avatar>
                    <h1 style={{ marginLeft: 10 }}>{user.name}</h1>
                </div>

            </div>

            <div className="text-item">
                <TextField value={oldPass} onChange={e => setOldPass(e.target.value)} fullWidth={true} id="outlined-basic5" label="Old Password" variant="outlined" type="password" />
            </div>

            <div className="text-item">
                <TextField value={newPass} fullWidth={true} onChange={e => setNewPass(e.target.value)} id="outlined-basic2" label="New Password" variant="outlined" type="password" />
            </div>

            <div className="text-item">
                <TextField value={samePass} onChange={e => setSamePass(e.target.value)} fullWidth={true} id="outlined-basic3" label="Confirm New Password" variant="outlined" type="password" />
            </div>

            <div className="text-item-button">
                <Button variant="contained" color="primary" component="span" onClick={onCancel} >
                    cancel
                </Button>

                <Button style={{ marginLeft: 5 }} variant="contained" onClick={onSubmit}>
                    Change Password
                 </Button>
            </div>
        </div >
    )
}


const Key = ({ user }) => {

    const dispatch = useDispatch()
    const [apiKey, setApiKey] = useState("")

    useEffect(() => {
        if (user === null) return
        axios.get("/api/auth/key/" + user.id).then(res => {
            if(res.data.apiKey ===null){
                
            setApiKey("")
            }else{
                
            setApiKey(res.data.apiKey)
            }
        })

    }, [user])

    const onSubmit = () => {
        if (apiKey === "") {
            dispatch(() => returnErrors("please enter the Api field", "error", dispatch))
            return
        }

        if (user === null) return
        var headers = {
            'Content-Type': 'application/json'
        };

        var options = {
            url: 'https://acrosshealth.freshdesk.com/api/v2/tickets?per_page=100',
            headers: headers,
            auth: {
                'user': `${apiKey}`,
                'pass': 'X'
            }
        };

        request(options, (error, response, body) => {

            if (response.statusCode === 401) {
                if (apiKey !== null) {
                    dispatch(() => returnErrors("invalid Api key found", "error", dispatch))
                } else {
                    dispatch(() => returnErrors("You have to be logged in Freshdesh to use this page ", "info", dispatch))
                }
                setApiKey("")
            }

            if (!error && response.statusCode === 200) {
                dispatch(() => returnErrors("Valid Api key", "success", dispatch))
                axios.patch("/api/auth/update/" + user.id, {
                    apiKey: apiKey
                }).then(() => {
                    setApiKey('')
                })
            }
        })

    }

    const onCancel = () => {
        setApiKey('')
    }

    return (
        <div className="person">
            <div className="text-item-img">
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Avatar style={{ width: 65, height: 65, fontSize: 14, margin: 5, marginRight: 10 }} src={user.filePath} > {user.name}</Avatar>
                    <h1 style={{ marginLeft: 10 }}>{user.name}</h1>
                </div>
            </div>
            <div className="text-item">
                <TextField value={apiKey} onChange={e => setApiKey(e.target.value)} fullWidth={true} id="outlined-basic1" label="Freshdesk api key" variant="outlined" />
            </div>
            <div className="text-item-button-key">
                <Button variant="contained" color="primary" component="span" onCancel={onCancel} >
                    cancel
        </Button>

                <Button style={{ marginLeft: 5 }} variant="contained" onClick={onSubmit}>

                    Change Key
      </Button>
            </div>
        </div >
    )
}
