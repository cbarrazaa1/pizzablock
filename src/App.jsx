import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import MainRouter from './routing/MainRouter';
import Auth from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const promise = loadStripe("pk_test_N5Xn8b9214GdqkROo3pookJi00d8KiCfnc");

function App() {

	return (
		<div className="App" style={styles.root}>
			<BrowserRouter>
				<Elements stripe={promise}>
					<Auth>
						<MainRouter />
					</Auth>
				</Elements>
			</BrowserRouter>
		</div>
	);
}

const styles = {
	root: {
		width: '100%',
	},
};

export default App;
