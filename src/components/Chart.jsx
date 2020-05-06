import React, {useState, useEffect} from 'react';
import {HorizontalBar, Bar} from 'react-chartjs-2';
import {
  gamesLastMonth,
  shopEntriesLastMonth,
  usersLastMonth,
  shopEntriesRevenueLastMonth,
  shopEntriesPizzetosLastMonth,
} from '../services/admin';
import LoadingSpinner from './LoadingSpinner';

function Chart(props) {
  const [loading, setLoading] = useState(true);
  const [isRevenue, setIsRevenue] = useState(false);
  const [id, setId] = useState(props.id);
  const [description, setDescription] = useState({});
  const [options, setOptions] = useState({
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            min: 0,
            callback: function (label, index, labels) {
              return label;
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    loadChart();
  }, []);

  const [data, setData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  });

  const [myRef, setMyRef] = useState(React.createRef());

  const updateDataset = (records, title) => {
    var dates = [];
    var info = [];
    records.map((record, i) => {
      dates = [...dates, record._id];
      info = [...info, record.count];
    });
    data.labels = dates;
    data.datasets[0].data = info;
    data.datasets[0].label = title;
    console.log(records);
  };

  const loadChart = () => {
    switch (parseInt(id)) {
      case 1:
        gamesLastMonth()
          .then((response) => {
            updateDataset(response, 'Games From Last Month');
            setLoading(false);
            setIsRevenue(false);
          })
          .catch((e) => {
            console.log(e);
          });
        break;
      case 2:
        shopEntriesLastMonth()
          .then((response) => {
            updateDataset(response, 'Shopped Items From Last Month');
            setLoading(false);
            setIsRevenue(false);
          })
          .catch((e) => {
            console.log(e);
          });
        break;
      case 3:
        usersLastMonth()
          .then((response) => {
            updateDataset(response, 'New Users From Last Month');
            setLoading(false);
            setIsRevenue(false);
          })
          .catch((e) => {
            console.log(e);
          });
        break;
      case 4:
        shopEntriesRevenueLastMonth()
          .then((response) => {
            updateDataset(response, 'Total Revenue(MXN) From Last Month');
            setLoading(false);
            setIsRevenue(true);
          })
          .catch((e) => {
            console.log(e);
          });
        break;
      case 5:
        shopEntriesPizzetosLastMonth()
          .then((response) => {
            updateDataset(response, 'Pizzetos Spent From Last Month');
            setLoading(false);
            setIsRevenue(true);
          })
          .catch((e) => {
            console.log(e);
          });
        break;
      default:
        break;
    }
  };
  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : isRevenue ? (
        <Bar ref={myRef} data={data} options={options} />
      ) : (
        <HorizontalBar ref={myRef} data={data} options={options} />
      )}
    </div>
  );
}

export default Chart;
