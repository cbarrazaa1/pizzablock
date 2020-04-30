import React, { useState } from 'react'
import { Line } from "react-chartjs-2";

function Chart(props) {
    
    const [id, setId] = useState(props.id)
    const [data, setData] = useState([
        {
            labels: ["1", "2"],
            datasets: [
                {
                    label: "",
                    fill: false,
                    lineTension: 0.2,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [1, 2]
                }
            ]
        }
    ])

    const [myRef, setMyRef] = useState(React.createRef())

    const loadChart = () => {

        switch (parseInt(id)) {
            case 1:
                data.labels = ["Hola","Como", "Estas"]
                break;
            case 2:
                data.labels = ["Hola","Como", "Estas"]
                break;
            case 3:
                data.labels = ["Hola","Como", "Estas"]
                break;
            case 4:
                data.labels = ["Hola","Como", "Estas"]
                break;
            default:
                break;
        }
    }
    return (<div>
        <Line ref={myRef} data={data} />
    </div>)
}

export default Chart