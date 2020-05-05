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
import { getShopItem } from '../services/shop';
import LoadingSpinner from '../components/LoadingSpinner';
import pizzeto from '../img/pizzeto.png'
import Button from 'react-bootstrap/Button';
import globalStyles from '../constants/styles';
import CustomAlert from '../components/CustomAlert'

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

    const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const [amount, setAmount] = useState(1)
    const [currency, setCurrency] = useState("USD");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [timeout, setTimeout] = useState(false);

    const [realCurrency, setRealCurrency] = useState(true);

    const {user} = useContext(AuthContext)

    useEffect(() => {
        getItemInfo()
    }, [])

    const getItemInfo = () => {
        let id = props.match.params.id
        let params = new URLSearchParams(props.location.search)
        let amount = params.get('amount')

        getShopItem(id)
            .then(item => {
                setItem(item);
                setAmount(amount)
                setCurrency(item.currency)
                setLoading(false);

                setRealCurrency(item.currency !== "PZT");
            })
            .catch(e => {
                console.log(e);
            })

    }

    const onSuccess = () => {
        let newBalance = parseInt(user.balance) + parseInt(amount);

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

    const onBuyNow = () => {
        let newBalance = parseInt(user.balance) - parseInt(amount*item.price);

        if (newBalance < 0) {
            setAlertVariant('danger');
            setAlertMessage('You do not have enough pizzetos for this!');
            setShowAlert(true);
            return;
        }

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
             <CustomAlert
				variant={alertVariant}
				message={alertMessage} 
				show={showAlert} 
				onClose={() => {setShowAlert(false)}}
			/>
            <h1 className="text-center mb-5">Purchase Summary</h1>
            {!success ?
            <div>
                {loading ? <LoadingSpinner/> :
                <div className="text-center">
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
                <h3 className='text-center my-4'>
                    Total amount: 
                    {realCurrency ? <span>$</span> : <Image src={pizzeto} style={styles.pizzeto}/>}
                    {item.price*amount}
                </h3>
                    {realCurrency ?
                        <CheckoutForm amount={amount*item.price*100} currency={currency} success={onSuccess}/>
                        : 
                        <Button
                        className={"btn-lg"}
                            variant="flat"
                            bg="flat"
                            style={globalStyles.primaryButton}
                            className={'mt-5'}
                            onClick={onBuyNow}
                        >
                            Buy Now
                        </Button>
                        }
                </div>
                }
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
    },
    pizzeto: {
        position: 'relative',
        width: '40x',
        height: '40px',
        bottom: '5px',
        marginLeft: '9px',
        marginRight: '5px',
    },
}

export default CheckoutView