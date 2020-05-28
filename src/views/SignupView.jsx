import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CustomAlert from '../components/CustomAlert';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import ImageUploader from 'react-images-upload';
import colors from '../constants/colors';
import globalStyles from '../constants/styles';
import {authSignUp} from '../services/auth';
import {uploadPofilePicture} from '../services/user';
import LoadingSpinner from '../components/LoadingSpinner';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

function SignupView() {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [country, setCountry] = useState("Mexico");
    const [state, setState] = useState("Nuevo Leon");
    const [streetAddr, setStreetAddr] = useState("");
    const [zipCode, setZipCode] = useState("");

  	const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const [pictures, setPictures] = useState([])
    const [loading, setLoading] = useState(false);

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
    
    const onConfirmPasswordChange = event => {
        setConfirmPassword(event.target.value);
    }

    const onUsernameChange = event => {
        setUsername(event.target.value);
    }

    const onFirstNameChange = event => {
        setFirstName(event.target.value);
    }

    const onLastNameChange = event => {
        setLastName(event.target.value);
    }

    const onCountryChange = value => {
        setCountry(value);
    }

    const onStateChange = value => {
        setState(value);
    }

    const onStreetAddrChange = event => {
        setStreetAddr(event.target.value);
    }

    const onZipCodeChange = event => {
        setZipCode(event.target.value);
    }

    const onDrop = (picture) => {
        console.log(picture)
        setPictures(picture);
        console.log(pictures);
    }

	const postSignup= (e) => {
        e.preventDefault();

        if (confirmPassword !== password) {
            setAlertVariant('danger');
            setAlertMessage('Passwords do not match!');
            setShowAlert(true);
            return;
        }

        setLoading(true);

        if (pictures.length < 1) {
            setAlertVariant('danger');
            setAlertMessage('Please select a profile picture');
            setShowAlert(true);
            return;
        }
        
        authSignUp({
            name: firstName,
            last_name: lastName,
            user_name: username,
            email: email,
            street_addr: streetAddr,
            zip_code: zipCode,
            country: country,
            state: state,
            password: password,

        })
        .then(result => {
            if (result.success) {
                return uploadPofilePicture(result.id, pictures)
            } else {
                setAlertVariant('danger');
                setAlertMessage('Error signing up');
                setShowAlert(true);
                setLoading(false);
            }
        })
        .then(result => {
            setLoading(false);
            if (result) {
                history.push('/login')
            } else {
                setAlertVariant('danger');
                setAlertMessage('Error Uploading profile picture. Please try again');
                setShowAlert(true);
            }
        })
        .catch(e => {
            setAlertVariant('danger');
            setAlertMessage('Error signing up');
            setShowAlert(true);
            setLoading(false);
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
            <h1 style={styles.loginTitle}>Signup</h1>
            {loading ? <LoadingSpinner/> :
            <div>

                <div style={styles.loginCard}>
                    <Form onSubmit={postSignup}>
                        <h3>Basic Information</h3>
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
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        placeholder="First Name" 
                                        onChange={onFirstNameChange} 
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        placeholder="Last Name" 
                                        onChange={onLastNameChange} 
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
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
                        <h3 className='mt-3'>Location</h3>
                        <Form.Group>
                            <Form.Label>Select your country</Form.Label>
                            <CountryDropdown
                                value={country}
                                onChange={onCountryChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Select your state</Form.Label>
                            <div>
                                <RegionDropdown
                                    country={country}
                                    value={state}
                                    onChange={onStateChange}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Street address" 
                                onChange={onStreetAddrChange} 
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                type="number"
                                placeholder="Zip code" 
                                onChange={onZipCodeChange} 
                                required
                            />
                        </Form.Group>
                        <h3 className={'py-3'}>Choose your profile picture</h3>
                        <ImageUploader
                            withIcon={true}
                            buttonText='Choose picture'
                            onChange={onDrop}
                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                            maxFileSize={5242880}
                            singleImage={true}
                            withPreview={true}
                        />
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
                <p>Or login <Link to="/login">here</Link></p>
            </div>
            }
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

export default SignupView;