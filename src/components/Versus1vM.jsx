import React, {useState} from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import background from '../img/profileback.jpg';
import Table from 'react-bootstrap/Table';

function Versus1v1(props) {

    const [userInfo, setUserInfo] = useState(props.userInfo)
    const [opponents, setOpponents] = useState(props.opponents)

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
                    {opponents.map((o, i) => {
                        return (
                            <div style={styles.opp}>
                                <div>
                                    <Image
                                        style={styles.profilePicOp} 
                                        roundedCircle 
                                        src={o.profilePicUrl}
                                        className={'ml-4'}
                                    />
                                </div>
                                <div>
                                    <h4>{o.user_name}</h4>
                                </div>
                            </div>
                        )
                    })}
                </Col>
            </Row>
        </div>
    )
}

const styles = {
    back: {
        backgroundImage: `url("${background}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        color: "#eee",
        marginTop: '40px',
        marginBottom: '40px',
        height: '400px',
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    profilePic: {
        width: '130px',
        height: '130px',
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
    opp: {
        margin: '20px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center'
    },
    profilePicOp: {
        width: '50px',
        height: '50px',
        objectFit: 'cover',
        marginLeft: 'auto',
        marginRight:'20px',
        display: 'block',
        boxShadow: '0px 0px 66px -19px rgba(0,0,0,0.75)',
    }
}

export default Versus1v1