import React, {useState, useEffect, useContext} from 'react';
import {Link, Redirect, useHistory} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CustomAlert from '../components/CustomAlert';
import {AuthContext} from '../context/AuthContext';
import colors from '../constants/colors';
import globalStyles from '../constants/styles';

function LoginView(props) {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

  	const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
	const [showAlert, setShowAlert] = useState(false);

	const { login } = useContext(AuthContext);
	const history = useHistory();
	
	const onCloseAlert = () => {
        setShowAlert(false);
    }

    const onEmailChange = event => {
        setEmail(event.target.value);
    }

    const onPasswordChange = event => {
        setPassword(event.target.value);
	}
	
	const postLogin = (e) => {
		e.preventDefault();
		login({email, password})
			.then(result => {
				if (result) {
					history.push('/');
				} else {
					throw Error
				}
			})
			.catch(error => {
				setAlertVariant('danger');
				setAlertMessage('Login error');
				setShowAlert(true);
			})
	}

  	return (
		<Container style={styles.loginContainer}>
			<CustomAlert
				variant={alertVariant}
				message={alertMessage} 
				show={showAlert} 
				onClose={onCloseAlert}
			/>
			<h1 style={styles.loginTitle}>Login</h1>
			<div style={styles.loginCard}>
				<Form onSubmit={postLogin}>
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
					<Button
						className="mt-3 mb-2" 
						variant="flat" 
						bg='flat' 
						type="submit"
						style={globalStyles.primaryButton}
					>
						Submit
					</Button>
				</Form>
			</div>
			<p>Or register <Link to="/signup">here</Link></p>
		</Container>
	)
}

const styles = {
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
		color: colors.dark,
		fontSize: '65px',
	}
}

export default LoginView;