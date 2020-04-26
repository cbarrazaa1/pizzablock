import React from 'react';
import {useContext} from 'react';
import Navigation from '../components/Navigation';
import GameContainer from '../game/GameContainer';
import { GameState } from '../game/states/State';
import { AuthContext } from '../context/AuthContext';

function GameView(props) {
    const {user} = useContext(AuthContext);

    return (
        <div>
            <Navigation/>
            <GameContainer state={GameState.SINGLEPLAYER} user={user} />
        </div>
    )
}

export default GameView