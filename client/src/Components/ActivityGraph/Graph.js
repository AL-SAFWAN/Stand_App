import React, { useState, useEffect } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import Button from '@material-ui/core/Button';

export default function Graph({state}) {

    const [data, setData] = useState({})
    const [step, setStep] = useState(2)

    
    const notDone = () => {
        var notDone = 0;
        state.item.Today.forEach(element => {
            if (element.isCompleted === false) {
                notDone++
            }
        })
        return notDone
    }

    const chart = () => {
        var notFinsihed = notDone()
        var done = state.item.Today.length - notFinsihed
        setData({
            labels: ["Done", "Not Done"],
            datasets: [{
                data: [done, notFinsihed],
                backgroundColor: ['rgba(68, 249, 68, 0.57)', " rgba(75,192,192,0.6)"],
                borderWidth: 4,
                order: 0
            }]
        })
    }

    useEffect(() => {
        chart()
    }, [state.item])

    const style = {
        chart: {
            height: '350px',
            width: '30%'
        },
        button: {
            margin: '20px'
        },
        container: {
            display: 'flex'
        },
        BtnContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }
    }


    const WhichGraph = ({ step }) => {
        switch (step) {
            case 1:
                return (<Bar data={data}
                    options={{
                        responsive: true,
                        scales: {
                            xAxes: [{
                                stacked: true
                            }],
                            yAxes: [{
                                stacked: true
                            }]
                        }
                    }} />)
            case 2:
                return (<Pie data={data}
                    options={{
                        responsive: true,
                    }} />)

        }

    }

    const setLine = () => { setStep(2) }
    const setBar = () => { setStep(1) }

    return (
        <React.Fragment><div style={style.container}>
            <div style={style.BtnContainer} >
                <div style={style.button}>
                    <Button size='small' variant="outlined" color="primary" onClick={setLine}>Pie</Button>
                </div>
                <div style={style.button}>
                    <Button size='small' variant="outlined" color="primary" onClick={setBar} >Bar</Button></div></div>
        </div>
            <WhichGraph step={step}></WhichGraph>


        </React.Fragment>
    )
}
