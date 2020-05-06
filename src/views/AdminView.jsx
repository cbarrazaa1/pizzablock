import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import ChartDeck from '../components/ChartDeck';

import globalStyles from '../constants/styles';
import {CardDeck} from 'react-bootstrap';

function AdminView(props) {
  return (
    <div>
      <h1 className="text-center mb-5">Administration</h1>
      <div style={styles.mainContainer}>
        <ChartDeck></ChartDeck>
      </div>
    </div>
  );
}
const styles = {
  mainContainer: {
    display: 'float',
    flexDirection: 'row',
    justifyContent: 'center',
  },
};

export default AdminView;
