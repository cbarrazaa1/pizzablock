import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import globalStyles from '../constants/styles';
import Modal from 'react-bootstrap/Modal';
import pizzeto from '../img/pizzeto.png';
import Image from 'react-bootstrap/Image';
import { AuthContext } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import { updateUserInfo } from '../services/user';

function HomeView(props) {

    const [showPay, setShowPay] = useState(false);
    const [gameIdx, setGameIdx] = useState(0);

    const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const [loading, setLoading] = useState(true);

    const [games, setGames] = useState([
        {
            name: "Singleplayer",
            description: "Practice yours skills and aim for a highscore!",
            image: "https://www.lifewire.com/thmb/lOcp49hO-GvkFM7JgrwZjRpZC_8=/1920x1080/filters:fill(auto,1)/how-to-play-tetris-99-on-nintendo-switch-featured-7af5d3957deb44f4a8d4c812d88946ce.jpg"
        },
        {
            name: "1v1",
            description: "Play against a single opponent to win a pizza.",
            image: "https://cdn.pomu.com/files/game/img_mobile/15644/Tetris-Cube_.webp"
        },
        
    ])

    const history = useHistory();
    const {user} = useContext(AuthContext);

    useEffect(() => {
        setLoading(false)
    }, [])

    const onClickPlay = (e) => {
        let i = e.target.value
        setGameIdx(i)

        if (games[i].name === "Singleplayer") {
            history.push(`/play/${games[i].name}`);
            return
        }

        setShowPay(true)
    }
    
    const onGoPlay = (e) => {
        setLoading(true);
        let newBalance = parseInt(user.balance) - 10;
        
        if (newBalance < 0) {
            setAlertVariant('danger');
            setAlertMessage('You do not have enough pizzetos for this. Buy more at the shop');
            setShowAlert(true);
            setLoading(false);
            return;
        }

        updateUserInfo(user.id, {balance: newBalance})
            .then(response => {
                user.balance = newBalance;
                history.push(`/play/${games[gameIdx].name}`);
            })
            .catch(err => {
                console.log("Error updating balance");
                setAlertVariant('danger');
                setAlertMessage('Error updating current balance. Please try again');
                setShowAlert(true);
                setLoading(false);
            }) 

    }

    return (
        <div>
            <Modal 
                show={showPay} 
                onHide={() => setShowPay(false)} 
                animation={true} 
                centered
                size="lg"
                style={styles.modalContainer}
            >
                <Modal.Header closeButton>
                    <Modal.Title style={styles.payTitle}>Play {games[gameIdx].name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <Image src={pizzeto} style={styles.pizzeto}/>
                    <p style={styles.payMsg}>Pay 10 Pizzetos to play for a chance to win a pizza?</p>
                </Modal.Body>
                <Modal.Footer style={styles.modalFooter}>
                    <Button
                        variant="flat"
                        bg="flat"
                        className="btn btn-lg my-4"
                        style={globalStyles.primaryButton}
                        onClick={onGoPlay}
                    >
                        Play
                    </Button>
                </Modal.Footer>
            </Modal>
            <CustomAlert
				variant={alertVariant}
				message={alertMessage} 
				show={showAlert} 
				onClose={() => {setShowAlert(false)}}
			/>
            <h1 className='text-center mb-5'>Game modes</h1>
            {loading ? <LoadingSpinner/> :
            <div>
                <div style={styles.mainContainer}>
                    <div style={styles.groupContainer}>
                        {games.map((game, i) => {
                            return (
                                <Card style={styles.groupCard} className={"hvr-grow-shadow"}>
                                    <Card.Img style={styles.thumbnail} variant="top" src={game.image} />
                                    <Card.Body>
                                        <Card.Title style={styles.cardTitle}>{game.name}</Card.Title>
                                        <Card.Text style={styles.desc}>
                                            {game.description}
                                        </Card.Text>
                                        <Button
                                            variant="flat"
                                            bg="flat"
                                            className={"btn btn-lg"}
                                            style={globalStyles.primaryButton}
                                            onClick={onClickPlay}
                                            value={i}
                                        >
                                            Play
                                        </Button>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

const styles = {
    groupContainer: {
        display: 'block',
        float: 'left',
        textAlign: 'center'
    },
    groupCard: {
        height: '550px',
        margin: '30px',
        display: 'block;',
        float: 'left',
        width: '400px'
    },
    thumbnail: {
        width: '400px',
        height: '50%',
        objectFit: 'cover'
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    cardTitle: {
        marginTop: '12px',
        marginBottom: '22px',
        fontSize: '45px',
    },
    desc: {
        fontSize: '23px'
    },
    pizzeto: {
        width: '300px',
        height: '300px',
    },
    payTitle: {
        fontSize: '40px'
    },
    payMsg: {
        fontSize: '25px'
    },
    modalContainer: {
        fontFamily: "'Montserrat', sans-serif",
        color: '#555'
    },
    modalFooter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    }
}

export default HomeView