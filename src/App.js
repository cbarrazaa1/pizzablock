import React from 'react';
import './App.css';
import GameContainer from './game/GameContainer';

function App() {
  return (
    <div className="App" style={styles.root}>
      <GameContainer />
    </div>
  );
}

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
};

export default App;
