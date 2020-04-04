import React from 'react';
import Navigation from '../components/Navigation';
import {colors} from '../constants';

function HomeView(props) {
    return (
        <div>
            <Navigation/>
            <h1 className='mt-5 pt-5'>Home</h1>
        </div>
    )
}

export default HomeView