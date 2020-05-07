import React from 'react';
import {useContext} from 'react';
import CustomAlert from '../components/CustomAlert'
import GameContainer from '../game/GameContainer';
import { GameState } from '../game/states/State';
import { AuthContext } from '../context/AuthContext';
import { useEffect , useState } from 'react';
import colors from '../constants/colors';

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

        if (stateString === 'Singleplayer') {
            console.log('single');
            setState(GameState.SINGLEPLAYER)
        } else if (stateString === '1v1') {
            console.log('multi');
            setState(GameState.MULTIPLAYER_1v1)
        } else if (stateString === '1v4') {
            console.log('1v4');
            setState(GameState.MULTIPLAYER_1v4)
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
            <div style={styles.border}>
                <GameContainer state={state} user={user} />
            </div>
        </div>
    )
}

const styles = {
    border: {
        backgroundColor: colors.primary,
        padding: '20px 80px 20px 20px',
        width: '1127px',
        borderRadius: '30px',
        boxShadow: '0px -1px 47px -6px rgba(0,0,0,0.75)'
    }
}

export default GameView