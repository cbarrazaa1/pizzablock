import React, {useState, useEffect, useContext} from 'react';
import Image from 'react-bootstrap/Image';
import colors from '../constants/colors';
import background from '../img/profileback.jpg';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {getUserInfo} from '../services/user';
import { AuthContext } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageUploader from 'react-images-upload';
import globalStyles from '../constants/styles';
import {uploadPofilePicture} from '../services/user';

function ProfileView(props) {

    const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);

    const [pictures, setPictures] = useState([])

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
            Date: "Hawaiiana"
        },
        {
            status: "Lost",
            mode: "1v4",
            moneyPool: "150",
            Date: "Pepperoni"
        },
        {
            status: "Won",
            mode: "1v25",
            moneyPool: "1500",
            Date: "Supreme"
        }
    ])

    useEffect(() => {
        loadUser();
    }, [])

    

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const loadUser = () => {
        getUserInfo(user.id)
            .then(user => {
                setUserInfo(user);
                setLoading(false);
                user.games.forEach(g => {
                    let date = new Date(g.createdAt)
                    g.createdAt = date.toLocaleTimeString() + " on " + date.toDateString()
                })
                console.log(user.games)
                setGames(user.games)
            })
            .catch(err => {
                setAlertVariant('danger');
				setAlertMessage('Error getting user info');
                setShowAlert(true);
                setLoading(false);
            })
    }

    const onDrop = (picture) => {
        setPictures(picture);
    }

    const updateProfilePicture = () => {
        if (pictures.length < 1) {
            return;
        }

        setShow(false);
        setLoading(true);

        uploadPofilePicture(user.id, pictures)
            .then(result => {
                if (result) {
                    loadUser(user.id)
                } else {
                    setAlertVariant('danger');
                    setAlertMessage('Error updating profile picture');
                    setShowAlert(true);
                    setLoading(false);
                }
            })
            .catch(err => {
                setAlertVariant('danger');
                setAlertMessage('Error updating profile picture');
                setShowAlert(true);
                setLoading(false);
            })
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose a new profile picture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <ImageUploader
                    withIcon={true}
                    buttonText='Choose picture'
                    onChange={onDrop}
                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                    maxFileSize={5242880}
                    singleImage={true}
                    withPreview={true}
                />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="flat" bg={'flat'} style={globalStyles.primaryButton} onClick={updateProfilePicture}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
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
                        <div style={styles.imagecontainer}>
                            <Image
                                style={styles.profilePic} 
                                roundedCircle 
                                src={userInfo.profilePicUrl}
                                onClick={handleShow}
                            />
                        </div>
                        <h1 style={styles.username}>{userInfo.user_name}</h1>
                        <p style={styles.level}>Level {userInfo.level}</p>
                    </div>
                </div>
                <h1 className="my-5 pt-3 text-center">Match History</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Mode</th>
                            <th>Pizzetos Pool</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((g, i) => {
                            return (
                                <tr>
                                    <td 
                                        style={g.winner === user.id ? styles.won : styles.lost}
                                    >
                                        {g.winner === user.id ? "Won": "Lost"}
                                    </td>
                                    <td>{g.mode.name}</td>
                                    <td>{g.money_pool} pizzetos</td>
                                    <td>{g.createdAt}</td>
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
        cursor: 'pointer'
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
    },
    imagecontainer: {
    }
}

export default ProfileView