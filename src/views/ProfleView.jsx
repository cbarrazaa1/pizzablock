import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image'

function ProfileView(props) {

    const [userInfo, setUserInfo] = useState({
        name: 'Eriq',
        lastName: 'Frank',
        
        image: 'https://scontent.fntr8-1.fna.fbcdn.net/v/t1.0-9/17991265_1334293769940498_1530451888206001469_n.jpg?_nc_cat=103&_nc_sid=a4a2d7&_nc_ohc=NkEfskebyOMAX_1C7Fq&_nc_ht=scontent.fntr8-1.fna&oh=678645b1482a33d81312be1fb01e1449&oe=5EBDF921'
    })

    return (
        <div>
            <Row>
                <Col sm={4} style={styles.profileContainer}>
                    <Image style={styles.profilePic} thumbnail src=""/>
                </Col>
                <Col sm={8}>
                    <h1>Eriq Frank</h1>
                </Col>
            </Row>
        </div>
    )
}

const styles = {
    profileContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    profilePic: {
        width: '200px',
        height: '200px',
        objectFit: 'cover'
    }
}

export default ProfileView