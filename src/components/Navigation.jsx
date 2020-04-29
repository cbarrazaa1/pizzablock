import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { AuthContext } from '../context/AuthContext';
import colors from '../constants/colors';

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
                <Navbar.Brand onClick={() => history.push('/')}>PizzaBlock</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="justify-content-end mr-auto" >
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
                    </Nav>
                    <Nav className="justify-content-end ml-auto" >
                        <Navbar.Text>Logged in as {user.name}</Navbar.Text>
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
    }
}