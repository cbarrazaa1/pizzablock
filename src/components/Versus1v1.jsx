import React, {useState} from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import background from '../img/profileback.jpg';

function Versus1v1(props) {

    const [userInfo, setUserInfo] = useState(props.userInfo)
    const [opponent, setOpponent] = useState(props.opponent)

    return (
        <div>
            <Row style={styles.back}>
                <Col style={styles.columnI}>
                    <div style={styles.player}>
                        <Image
                            style={styles.profilePic} 
                            roundedCircle 
                            src={userInfo.profilePicUrl}
                            className={'mx-4'}
                        />
                        <h2>{userInfo.user_name}</h2>
                    </div>
                </Col>
                <Col style={styles.vscont}>
                    <div >
                        <h2 style={{fontSize: "50px"}}>VS</h2>
                    </div>
                </Col>
                <Col style={styles.columnD}>
                    <div style={styles.opponent}>
                        <h2>{opponent.user_name}</h2>
                        <Image
                            style={styles.profilePic} 
                            roundedCircle 
                            src={opponent.profilePicUrl}
                            className={'ml-4'}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

const styles = {
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
}

export default Versus1v1