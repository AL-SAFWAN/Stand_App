import React, { useState, useEffect } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import Button from '@material-ui/core/Button';
import moment from 'moment'

export default function Graph({ state }) {

    const [data, setData] = useState({})

    const returnCompletionObj = (array) => {
        let done = 0
        let notDone = 0
        array.forEach(val => val ? done++ : notDone++)
        return { done, notDone }
    }

    const objToArr = (state) => {
        let arr = []
        const itemsObj = Object.values(state.item)
        itemsObj.forEach(type => {
            if (typeof (type) !== "object") return
            const items = [...type]
            items.forEach(item => {
                const itemObj = {
                    day: moment(item.createdAt).format('DD/MM/YYYY'),
                    done: item.isCompleted
                }
                arr.push(itemObj)
            })
        })
        return arr.sort((a, b) => new moment(a.day, 'DD/MM/YYYY').format('YYYYMMDD') - new moment(b.day, 'DD/MM/YYYY').format('YYYYMMDD'))
    }

    const groupBy = (OurArray, property) => {
        return OurArray.reduce(function (accumulator, object) {
            const key = object[property];
            if (!accumulator[key]) {
                accumulator[key] = [];
            }
            accumulator[key].push(object.done);
            return accumulator;
        }, {});
    }

    const chart = (dates, done, notDone) => {

        setData({
            labels: [...dates],
            datasets:
                [
                    {
                        label: 'Done',
                        data: [...done],
                        backgroundColor: 'rgba(68, 249, 68, 0.57)',
                        borderWidth: 4,
                        // order: 0
                    },
                    {
                        label: 'Not Done',
                        data: [...notDone],
                        backgroundColor: " rgba(75,192,192,0.6)",
                        borderWidth: 1,
                        // order: 0
                    }
                ],
        })
    }



    useEffect(() => {
        const itemArray = objToArr(state)

        const date = Object.keys(groupBy(itemArray, "day"))
        const groupedByDay = Object.values(groupBy(itemArray, "day"))
        groupedByDay.forEach((day, index) => groupedByDay[index] = returnCompletionObj(day))

        chart(date, groupedByDay.map(val => val.done), groupedByDay.map(val => val.notDone))

    }, [state.item])

    return (

        <Bar
            data={data}
            width={20}
            height={10}
            options={{
                legend: {
                    // display: false
                },
                maintainAspectRatio: false,

                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }} />
    )
}
