import React from 'react';
import Navigation from '../components/Navigation';
import GameContainer from '../game/GameContainer';

function GameView(props) {
    return (
        <div>
            <Navigation/>
            <GameContainer/>
        </div>
    )
}

export default GameView