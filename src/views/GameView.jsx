import React from 'react';
import {useContext} from 'react';
import CustomAlert from '../components/CustomAlert'
import GameContainer from '../game/GameContainer';
import { GameState } from '../game/states/State';
import { AuthContext } from '../context/AuthContext';
import { useEffect , useState } from 'react';

function GameView(props) {
    const {user} = useContext(AuthContext);

    const [state, setState] = useState(GameState.SINGLEPLAYER);

    const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        getState();
    }, []);

    const getState = () => {
        let stateString = props.match.params.mode;

        if (stateString == 'Singleplayer') {
            console.log('single');
            setState(GameState.SINGLEPLAYER)
        } else if (stateString == '1v1') {
            console.log('multi');
            setState(GameState.MULTIPLAYER_1v1)
        } else {
            setAlertVariant('danger');
            setAlertMessage('Could not get game mode');
            setShowAlert(true);
        }
    }

    return (
        <div>
            <CustomAlert
				variant={alertVariant}
				message={alertMessage} 
				show={showAlert} 
				onClose={() => {setShowAlert(false)}}
			/>
            <GameContainer state={state} user={user} />
        </div>
    )
}

export default GameView