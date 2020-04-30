import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import globalStyles from '../constants/styles';

function ShopItem(props) {

    const [item, setItem] = useState(props.item);
    const [amount, setAmount] = useState(1);

    const onAmountChange = (e) => {
        setAmount(e.target.value);
    }

    const onClickBuy = (e) => {

    }

    return (
        <div>
            <Row>
                <Col>
                    <Image style={styles.image} thumbnail src={item.image}/>
                </Col>
                <Col>
                    <div style={styles.desc}>
                        <h1 style={styles.name}>{item.name}</h1>
                        <h3>${item.price}</h3>
                        <p style={styles.longDesc}>{item.longDesc}</p>
                        <Form.Group as={Row}>
                            <Form.Label column sm={4}>Enter amount</Form.Label>
                            <Col sm={8}>
                                <Form.Control type="number" value={amount} onChange={onAmountChange}/>
                            </Col>
                        </Form.Group>
                        <Button
                            className={"mt-3"}
                            variant="flat"
                            bg="flat"
                            style={globalStyles.primaryButton}
                            onClick={onClickBuy}
                        >
                            Buy
                        </Button>
                    </div>
                </Col>
            </Row>
            <Button
                variant="flat"
                bg="flat"
                style={globalStyles.secondaryButton}
                onClick={props.back}
                className={'mt-5'}
            >
                Back to Shop
            </Button>
        </div>
    )
}

const styles = {
    image: {
        width: '350px',
        height: '350px'
    },
    desc: {
        textAlign: 'left'
    },
    name: {
        fontSize: '60px',
        marginBottom: '20px'
    },
    longDesc: {
        marginTop: '20px'
    }
}

export default ShopItem