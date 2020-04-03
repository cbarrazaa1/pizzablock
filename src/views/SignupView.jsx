import React, {useState, useEffect} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CustomAlert from '../components/CustomAlert';
import {useAuth} from '../context/AuthContext';

function SignupView({history}) {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")

  	const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    
    const [isLoggedIn, setLoggedIn] = useState(false);
	const [isError, setIsError] = useState(false);
	
	const {setAuthTokens, authTokens} = useAuth();

	useEffect(() => {
		if (authTokens) {
			setLoggedIn(true);
		}
	}, [])
	
	const onCloseAlert = () => {
        setShowAlert(false);
    }

    const onEmailChange = event => {
        setEmail(event.target.value);
    }

    const onPasswordChange = event => {
        setPassword(event.target.value);
    }
    
    const onConfirmPasswordChange = event => {
        setConfirmPassword(event.target.value);
    }

    const onUsernameChange = event => {
        setUsername(event.target.value);
    }
	
	const postSignup= (e) => {
		e.preventDefault();
    }
    
    if (isLoggedIn) {
		return <Redirect to='/game'/>
	}

    return (
        <Container style={styles.loginContainer}>
            <CustomAlert
                variant={alertVariant}
                message={alertMessage} 
                show={showAlert} 
                onClose={onCloseAlert}
            />
            <h1 style={styles.loginTitle}>Signup</h1>
            <div style={styles.loginCard}>
                <Form onSubmit={postSignup}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Username" 
                            onChange={onUsernameChange} 
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="email"
                            placeholder="Email" 
                            onChange={onEmailChange} 
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control 
                            type="password"
                            placeholder="Password" 
                            onChange={onPasswordChange} 
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control 
                            type="password"
                            placeholder="Confirm password" 
                            onChange={onConfirmPasswordChange} 
                            required
                        />
                    </Form.Group>
                    <Button
                        className="mt-3 mb-2" 
                        variant="flat" 
                        bg='flat' 
                        type="submit"
                        style={styles.primaryButton}
                    >
                        Submit
                    </Button>
                </Form>
            </div>
            <p>Or login <Link to="/login">here</Link></p>
        </Container>
    )
}

const styles = {
	primaryButton: {
		backgroundColor: '#29e2ff',
		color: 'white'
	},
	loginCard: {
		margin: 'auto',
		width: '500px'
	},
	loginContainer: {
		textAlign: 'center'
	},
	loginTitle: {
		marginTop: '170px',
		marginBottom: '45px',
		color: '#00a8c9',
		fontSize: '65px',
	}
}

export default SignupView;