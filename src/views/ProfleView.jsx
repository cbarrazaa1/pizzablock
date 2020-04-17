import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Table from 'react-bootstrap/Table';
import colors from '../constants/colors';

function ProfileView(props) {

    const [userInfo, setUserInfo] = useState({
        username: 'ericklokillo',
        name: 'Eriq',
        lastName: 'Frank',
        streetAddress: "Cumbres de los nacos",
        zipCode: '12343',
        image: 'https://scontent.fntr8-1.fna.fbcdn.net/v/t1.0-9/17991265_1334293769940498_1530451888206001469_n.jpg?_nc_cat=103&_nc_sid=a4a2d7&_nc_ohc=NkEfskebyOMAX_1C7Fq&_nc_ht=scontent.fntr8-1.fna&oh=678645b1482a33d81312be1fb01e1449&oe=5EBDF921'
    })

    return (
        <div>
            <div style={styles.header}>
                <Row>
                    <Col sm={4} style={styles.profileContainer}>
                        <Image style={styles.profilePic} thumbnail src={userInfo.image}/>
                    </Col>
                    <Col sm={8}>
                        <h1 style={styles.username} className="my-3 py-1">{userInfo.username}</h1>
                        <Table style={styles.table} hover>
                            <tbody>
                                <tr>
                                    <td>Nombre</td>
                                    <td>{userInfo.name} {userInfo.lastName}</td>
                                </tr>
                                <tr>
                                    <td>Level</td>
                                    <td>3</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
            <Row>
                <h1 className="my-4 pt-3">Historial de Partidas</h1>
            </Row>
        </div>
    )
}

const styles = {
    username: {
        fontSize: '60px',
        color: colors.dark
    },
    header: {
        borderRadius: '15px',
        backgroundColor: '#f2fbff',
        padding: '30px'
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    profilePic: {
        width: '200px',
        height: '200px',
        objectFit: 'cover'
    },
    table: {
        width: '450px',
        fontSize: '21px'
    }
}

export default ProfileView