import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { AuthContext } from '../context/AuthContext';
import colors from '../constants/colors';
import Pizzeto from '../img/pizzeto.png';
import Image from 'react-bootstrap/Image';

export default function Navigation(props) {

    let history = useHistory();
    let {user} = useContext(AuthContext);
    const { logout } = useContext(AuthContext);

    const onLogout = () => {
        logout();
        history.push('/login');
    }

    return (
        <>
            <Navbar bg="flat" variant="dark" style={styles.mainNavbar} expand="lg" fixed='top'>
                <Navbar.Brand style={styles.brand} onClick={() => history.push('/')}>PizzaBlock</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="justify-content-end mr-auto" >
                        <Nav.Link
                            className='ml-4'
                            onClick={() => history.push('/')}
                        >
                            Play
                        </Nav.Link>
                        <Nav.Link
                            className='ml-4'
                            onClick={() => history.push('/shop')}
                        >
                            Shop
                        </Nav.Link>
                        <Nav.Link
                            className='ml-4'
                            onClick={() => history.push('/profile')}
                        >
                            Profile
                        </Nav.Link>
                        {user.role !== 'administrator' ? null :
                        <Nav.Link
                            className='ml-4'
                            onClick={() => history.push('/admin')}
                        >
                            Admin
                        </Nav.Link>
                        }
                    </Nav>
                    <Nav className="justify-content-end ml-auto" >
                        <Navbar.Text>
                        <div style={styles.balance}>
                            Balance:
                            <Image src={Pizzeto} style={styles.pizzeto}/>
                            {user.balance}
                        </div>
                        </Navbar.Text>
                        <Nav.Link
                            className='ml-4'
                            onClick={() => onLogout()}
                        >
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}

const styles = {
    mainNavbar: {
        backgroundColor: colors.dark,
        color: colors.white
    },
    pizzeto: {
        position: 'relative',
        width: '32x',
        height: '32px',
        bottom: '5px',
        marginLeft: '9px',
        marginRight: '5px',
    },
    balance: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
    },
    brand: {
        cursor: 'pointer'
    }
}