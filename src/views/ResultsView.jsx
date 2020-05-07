import React, { useState, useEffect, useContext } from 'react'
import LoadingSpinner from '../components/LoadingSpinner';
import { Row, Col, Image } from 'react-bootstrap';
import { getUserInfoShort } from '../services/user';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import colors from '../constants/colors';
import pizzeto from '../img/pizzeto.png'
import background from '../img/profileback.jpg';
import Versus1v1 from '../components/Versus1v1';
import Versus1vM from '../components/Versus1vM';
import {getGameInfo} from '../services/game';

function ResultsView(props) {
    
    const [loading, setLoading] = useState(true);

    const [game, setGame] = useState({
        winner: '5ea8e26acb137200176d158a',
        users: [
            "5ea8e26acb137200176d158a",
            "5eab9515f3a6a800171a40b9"
        ], 
        mode: '12345', 
        money_pool: '20'
    })

    const {user} = useContext(AuthContext);

    const [opponents, setOpponents] = useState([{
        user_name: "Lokoboy",
        profilePicUrl: "https://scontent.fntr8-1.fna.fbcdn.net/v/t1.0-9/15337567_1187455724624304_5780697547058050808_n.jpg?_nc_cat=104&_nc_sid=a4a2d7&_nc_eui2=AeGznYFkbq4t-UWzEzgHwfJ3czwrotVhyZdzPCui1WHJl6soUMZ_SCMrmI1eTQsZEMAJTHUP9xFu1o6EyRbQTluV&_nc_ohc=ExkcnUpOUPgAX9BlBKm&_nc_ht=scontent.fntr8-1.fna&oh=0507d35c42daa489256cf23ac00b12a4&oe=5ED97D40",
    }])

    const [userInfo, setUserInfo] = useState({})
    const [winner, setWinner] = useState(false)

    useEffect(() => {
        getGame();
    }, [])

    const getGame = () => {
        let id = props.match.params.id

        getGameInfo(id)
            .then(g => {
                setGame(g.foundGame)
                getPlayers(g.foundGame)
            })
            .catch(e => {
                console.log(e)
            })
    }

    const getPlayers = (g) => {

        let ops = []

        g.users.forEach(u => {
            if (u !== user.id) {
                ops.push(u);
            }
        })

        console.log("opponents found ", ops)

        getUserInfoShort(user.id)
            .then(useri => {
                setUserInfo(useri)
                setWinner(user.id === g.winner)
                getOpponents(ops)
            })
            .catch(e => {
                console.log(e)
            })
    }

    const getOpponents = (ops) => {
        let calls = ops.map((o, i) => {
            return getUserInfoShort(o)
        })

        console.log("Calling for opponents")

        Promise.all(calls)
            .then(ops => {
                setOpponents(ops)
                console.log(ops)
                setLoading(false)
            })
            .catch(e => {
                console.log(e)
            })
    }
    
    return (
        <div>
            <h1 className="text-center">Game Results</h1>
            {loading ? <LoadingSpinner/> :
            <div style={styles.versus}>
                {opponents.length === 1 ?
                <Versus1v1 userInfo={userInfo} opponent={opponents[0]} />
                : <Versus1vM userInfo={userInfo} opponents={opponents} />
                }
                <div style={styles.message}>
                    {winner ? 
                    <div>
                        <h1 style={styles.winner}>You Won!</h1>
                        <h5 className={"mt-4"}>By defeating you opponents you won a total of <strong style={{color: colors.dark}}>{game.money_pool}</strong> pizzetos which are redeemable for a pizza at the shop!</h5>
                    </div>
                    :
                    <div >
                        <h1 style={styles.loser}>You Lost!</h1>
                        <p className={'mt-3'}>Try again by going back to <Link to="/">Home</Link></p>
                    </div>
                    }
                </div>
                {winner ? 
                <div className={'mt-5 pt-3'}>
                    <span style={{fontSize: '40px'}}>+ </span>
                    <Image src={pizzeto} style={styles.pizzeto}/>
                    <span style={{fontSize: '40px'}}>{game.money_pool}</span>
                </div>
                : null}
            </div>
            }
        </div>
    )
}

const styles = {
    versus: {
        textAlign: 'center',
        marginTop: '70px'
    },
    back: {
        backgroundImage: `url("${background}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        color: "#eee",
        marginTop: '40px',
        marginBottom: '40px',
        height: '300px',
        borderRadius: '15px'
    },
    columnI: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center',
    },
    columnD: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        alignItems: 'center',
    },
    profilePic: {
        width: '150px',
        height: '150px',
        objectFit: 'cover',
        marginLeft: 'auto',
        marginRight:'auto',
        display: 'block',
        boxShadow: '0px 0px 66px -19px rgba(0,0,0,0.75)',
    },
    player: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        alignItems: 'center',
    },
    vscont: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    opponent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center'
    },
    hr: {
        height: '10px',
        border: '0',
        boxShadow: '0 10px 10px -10px #8c8b8b inset'
    },
    message: {
        marginTop: '50px',
        padding:'50px',
        height: '200px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        borderRadius: '30px',
    },
    winner: {
        color: '#46c268'
    },
    loser: {
        color: '#d44c4c'
    },
    pizzeto: {
        position: 'relative',
        width: '100x',
        height: '100px',
        bottom: '5px',
    },
}

export default ResultsView