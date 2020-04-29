import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import globalStyles from '../constants/styles';

function ShopView(props) {
    const [items, setItems] = useState([
        {
            name: "Pizzetos",
            description: "PizzaBlock's main currency",
            image: "https://cdn.discordapp.com/attachments/363727070683201538/704883158021177404/icon_pizza_v1.png"
        },
        {
            name: "Skins",
            description: "Play against a 4 opponents opponents to win a pizza",
            image: "https://www.minecraftskins.com/uploads/preview-skins/2020/04/11/coronavirus-proof-tetris-skin-14102563.png?v186"
        },
    ])

    const history = useHistory();

    const onClickBuy = (e) => {
        history.push('/play');
    }

    return (
        <div>
            <h1 className='text-center mb-5'>Shop</h1>
            <div style={styles.groupContainer}>
                {items.map((game, i) => {
                    return (
                        <Card style={styles.groupCard} className={"hvr-grow-shadow"}>
                            <Card.Img style={styles.thumbnail} variant="top" src={game.image} />
                            <Card.Body>
                                <Card.Title>{game.name}</Card.Title>
                                <Card.Text>
                                    {game.description}
                                </Card.Text>
                                <Button
                                    variant="flat"
                                    bg="flat"
                                    style={globalStyles.primaryButton}
                                    onClick={onClickBuy}
                                >
                                    Buy
                                </Button>
                            </Card.Body>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

const styles = {
    groupContainer: {
        display: 'block',
        float: 'left',
        textAlign: 'center'
    },
    groupCard: {
        height: '400px',
        margin: '30px',
        display: 'block;',
        float: 'left',
        width: '18rem'
    },
    thumbnail: {
        width: '18rem',
        height: '50%',
        objectFit: 'cover'
    }
}

export default ShopView