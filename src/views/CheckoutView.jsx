import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import CheckoutForm from '../components/CheckoutForm';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import Checkmark from '../components/Checkmark';
import { Link } from 'react-router-dom';
import {updateUserInfo} from '../services/user';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function CheckoutView(props) {

    const [item, setItem] = useState({
        _id: '1',
        name: "Pizzetos",
        description: "PizzaBlock's main currency",
        longDesc: "This is PizzaBlock's main currency. In order to enter a game to win a pizza, you must pay with pizzetos.",
        price: 10,
        currency: "USD",
        image: "https://cdn.discordapp.com/attachments/363727070683201538/704883158021177404/icon_pizza_v1.png"
    })

    const [amount, setAmount] = useState(1)
    const [currency, setCurrency] = useState("USD");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [timeout, setTimeout] = useState(false);

    const {user} = useContext(AuthContext)

    useEffect(() => {
        getItemInfo()
    }, [])

    const getItemInfo = () => {
        let id = props.match.params.id
        let params = new URLSearchParams(props.location.search)
        let amount = params.get('amount')

        setAmount(amount)
        setCurrency(item.currency)
        setLoading(false)
    }

    const onSuccess = () => {
        let newBalance = user.balance + amount;

        updateUserInfo(user.id, {balance: newBalance})
            .then(response => {
                user.balance = newBalance;
                setSuccess(true);
                setInterval(() => {
                    setTimeout(true);
                }, 700)
            })
            .catch(err => {
                console.log("Error updating balance");
            })        
    }

    return (
        <div style={styles.container}>
            <h1 className="text-center mb-5">Purchase Summary</h1>
            {!success ?
            <div>
                <Table className={'text-center mb-5'}>
                    <thead>
                        <tr>
                            <th style={styles.cell}>Product</th>
                            <th style={styles.cell}>Quantity</th>
                            <th style={styles.cell}>Unit Price</th>
                            <th style={styles.cell}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={styles.cell}><Image src={item.image} style={styles.image}/>{item.name}</td>
                            <td style={styles.cell}>{amount}</td>
                            <td style={styles.cell}>{item.price}</td>
                            <td style={styles.cell}>{item.price*amount}</td>
                        </tr>
                    </tbody>
                </Table>
                <h3 className='text-center my-4'>Total amount: ${item.price*amount}</h3>
                {!loading ?
                    <CheckoutForm amount={amount*item.price*100} currency={currency} success={onSuccess}/>
                    : null}
            </div>
            :
            <div style={styles.success}>
                <div style={styles.checkmark}>
                    <Checkmark finish={timeout}/>
                </div>
                <h3 style={styles.message} className='mt-1'>Payment successful</h3>
                <p className='pt-3'>You can now go back to <Link to="/">Home</Link></p>
            </div>
            }
        </div>
    )
}

const styles = {
    container: {
        width: '700px',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    image: {
        width: '32x',
        height: '32px',
        marginLeft: '9px',
        marginRight: '5px',
    },
    cell: {
        padding: '20px'
    },
    success: {
        textAlign: 'center'
    },
    checkmark: {
        marginTop: '60px'
    },
    message: {
        color: '#5cb85c'
    }
}

export default CheckoutView