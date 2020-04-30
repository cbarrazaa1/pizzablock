import React, {useState, useEffect, useContext} from 'react';
import Image from 'react-bootstrap/Image';
import colors from '../constants/colors';
import background from '../img/profileback.jpg';
import Table from 'react-bootstrap/Table';
import {getUserInfo} from '../services/user';
import { AuthContext } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';
import LoadingSpinner from '../components/LoadingSpinner';

function ProfileView(props) {

    const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    
    const [loading, setLoading] = useState(true);

    const [userInfo, setUserInfo] = useState({
        user_name: 'ericklokillo',
        name: 'Eriq',
        lastName: 'Frank',
        streetAddress: "Cumbres de los nacos",
        zipCode: '12343',
        level: 0
    })

    const {user} = useContext(AuthContext);

    const [games, setGames] = useState([
        {
            status: "Won",
            mode: "1v1",
            moneyPool: "100",
            prize: "Hawaiiana"
        },
        {
            status: "Lost",
            mode: "1v4",
            moneyPool: "150",
            prize: "Pepperoni"
        },
        {
            status: "Won",
            mode: "1v25",
            moneyPool: "1500",
            prize: "Supreme"
        }
    ])

    useEffect(() => {
        loadUser();
    }, [])

    const loadUser = () => {
        getUserInfo(user.id)
            .then(user => {
                console.log(user);
                setUserInfo(user);
                setLoading(false);
            })
            .catch(err => {
                setAlertVariant('danger');
				setAlertMessage('Error getting user info');
                setShowAlert(true);
                setLoading(false);
            })
    }

    return (
        <div>
            <CustomAlert
				variant={alertVariant}
				message={alertMessage} 
				show={showAlert} 
				onClose={() => {setShowAlert(false)}}
			/>
            {loading ? <LoadingSpinner/> :        
            <div>
                <div style={styles.header}>
                    <div style={styles.stats}>
                        <Image style={styles.profilePic} roundedCircle src={'https://scontent.fntr8-1.fna.fbcdn.net/v/t1.0-9/17991265_1334293769940498_1530451888206001469_n.jpg?_nc_cat=103&_nc_sid=a4a2d7&_nc_ohc=NkEfskebyOMAX_1C7Fq&_nc_ht=scontent.fntr8-1.fna&oh=678645b1482a33d81312be1fb01e1449&oe=5EBDF921'}/>
                        <h1 style={styles.username}>{userInfo.user_name}</h1>
                        <p style={styles.level}>Level {userInfo.level}</p>
                    </div>
                </div>
                <h1 className="my-5 pt-3 text-center">Historial de Partidas</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Mode</th>
                            <th>Money Pool</th>
                            <th>Prize</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((g, i) => {
                            return (
                                <tr>
                                    <td style={g.status == "Won" ? styles.won : styles.lost}>{g.status}</td>
                                    <td>{g.mode}</td>
                                    <td>{g.moneyPool} pizzetos</td>
                                    <td>{g.prize}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
            }
        </div>
    )
}

const styles = {
    username: {
        fontSize: '60px',
        color: colors.light,
        textShadow: '-1px -1px 0 #555, 1px -1px 0 #555, -1px 1px 0 #555, 1px 1px 0 #555',
        marginTop: '30px'
    },
    header: {
        borderRadius: '15px',
        backgroundImage: `url("${background}")`,
        padding: '30px',
        textAlign: 'center',
        height: '300px',
        marginTop: '100px',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        boxShadow: '0px 25px 66px -19px rgba(0,0,0,0.75',
    },
    profilePic: {
        width: '200px',
        height: '200px',
        objectFit: 'cover',
        marginLeft: 'auto',
        marginRight:'auto',
        display: 'block',
        boxShadow: '0px -30px 66px -19px rgba(0,0,0,0.75)',

    },
    stats: {
        position: 'relative',
        bottom: '130px'
    },
    level: {
        fontSize: '15px',
        letterSpacing: '4px',
        color: colors.light
    },
    won: {
        color: 'green'
    },
    lost: {
        color: 'red'
    }
}

export default ProfileView