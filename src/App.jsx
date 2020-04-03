import React, {useState} from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import MainRouter from './MainRouter';
import { AuthContext } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

	const existingTokens = JSON.parse(localStorage.getItem("tokens"));
	const [authTokens, setAuthTokens] = useState(existingTokens);

	const setTokens = data => {
		localStorage.setItem("tokens", JSON.stringify(data));
		setAuthTokens(data);
	}

	return (
		<div className="App" style={styles.root}>
			<BrowserRouter>
				<AuthContext.Provider value={{authTokens, setAuthTokens: setTokens}}>
					<MainRouter/>
				</AuthContext.Provider>
			</BrowserRouter>
		</div>
	);
}

const styles = {
	root: {
		display: 'flex',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
	},
};

export default App;
