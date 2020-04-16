import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './routing/MainRouter';
import Auth from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

	return (
		<div className="App" style={styles.root}>
			<BrowserRouter>
				<Auth>
					<MainRouter />
				</Auth>
			</BrowserRouter>
		</div>
	);
}

const styles = {
	root: {
		width: '100%',
		height: '100%',
	},
};

export default App;
