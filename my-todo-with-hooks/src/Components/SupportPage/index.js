import React, { useState, useEffect } from "react";
import "./index.css"
import Support from '../Support'
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import SupportTodayCard from './SupportTodayCard'
var request = require('request');


// objective 

// 1. have a notice bar for the upcomoing support/ history for you          -NEED TO DO 
// 2. have a table to show whos on support and how long                     -NOT DONE 
// 5. when i clicked a clander ticket i want to open up a table             -NOT DONE
//to show all the information about it to open the ticket in another window   ^
// to add it to my doing today list of todo's                                 ^  

// 3. have a table which shows the list of urgent ticket                    -DONE
// 4.then have a clanders of the tickets                                    -DONE




var headers = {
    'Content-Type': 'application/json'
};

var options = {
    url: 'https://acrosshealth.freshdesk.com/api/v2/tickets?per_page=100',
    headers: headers,
    auth: {
        'user': 'kQXIq7tf8krxBCtan8WM',
        'pass': 'X'
    }
};

const fetchData = (setData) => {


    request(options, (error, response, body) => {

        if (!error && response.statusCode == 200) {
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

        }
    })

}

const CheckboxOption = ({ one, two, three, four, setOne, setTwo, setThree, setFour }) => {

    return (
        <div className="checkbox-container" >
            <div className="checkbox checkbox1"
                onClick={() => setOne(!one)}>
                <Checkbox
                    style={{ color: "green" }}
                    checked={one} />
                <p className ="p">Low</p>
            </div>
            <div className="checkbox checkbox2"
                onClick={() => setTwo(!two)}
            >
                <Checkbox checked={two}
                    style={{ color: "royalblue" }} />
                <p className ="p">Medium</p>
            </div>
            <div className="checkbox checkbox3"
                onClick={() => setThree(!three)}>
                <Checkbox checked={three}
                    style={{ color: "gold" }} />
                <p  className ="p">High</p>
            </div>
            <div className="checkbox checkbox4"
                onClick={() => setFour(!four)}>

                <Checkbox checked={four}
                    style={{ color: "red" }} />
                <p className ="p" >Urgent</p>
            </div>

        </div>
    )
}

const SearchTable = ({ data }) => {
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
        }
    }
    const [text, setText] = useState(false)

    console.log(text)
    return (
        <>
            <div className="table-container" >
                <TextField id="outlined-basic" label="Search Ticket" variant="outlined"
                    onChange={(e) => { setText(e.target.value) }}
                />

                <div style={{ overflowY: "scroll", marginTop: "10px" }}>
                    {data.filter(item => {
                        if (text === false) return true
                        return item.text.toLowerCase().includes(text.toLowerCase())
                    }).map((item, i) => {
                        return <div className="item" key={i} style={setColor(item.priority)}> {item.text}</div>
                    })}
                </div>
            </div>
        </>
    )

}

export default function Index() {


    // NOTE -----------------------
    // have a setting for this in the setting option
    // , which is then loaded bellow 

    // NOTE -----------------------
    const [one, setOne] = useState(false)
    const [two, setTwo] = useState(true)
    const [three, setThree] = useState(true)
    const [four, setFour] = useState(true)



    const [data, setData] = useState([])
    const [filterData, setFilteredData] = useState([])

    useEffect(() => {
        fetchData(setData)

    }, [])

    useEffect(() => {
        const arr = data.filter(item => {
            return ((one ? 1 : 0) == item.priority) || ((two ? 2 : 0) == item.priority) || ((three ? 3 : 0) == item.priority) || ((four ? 4 : 0) == item.priority)
        })
        console.log("arr", arr)
        if (arr !== undefined) {
            setFilteredData(
                arr
            )
        }
    }, [one, two, three, four, data])

   


    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <CheckboxOption one={one} two={two} three={three} four={four} setOne={setOne} setTwo={setTwo} setThree={setThree} setFour={setFour} />
                <SearchTable data={filterData}></SearchTable>
<SupportTodayCard/>
                
            </div>

            <div className="calender"> <Support style={{ margin: "auto" }} data={filterData}></Support></div>
        </div>
    )
}
