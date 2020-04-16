import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import globalStyles from '../constants/styles';

function HomeView(props) {

    const [games, setGames] = useState([
        {
            name: "1v1",
            description: "Play against a single opponent to win a pizza",
            image: "https://cdn.pomu.com/files/game/img_mobile/15644/Tetris-Cube_.webp"
        },
        {
            name: "1v4",
            description: "Play against a 4 opponents opponents to win a pizza",
            image: "https://www.lifewire.com/thmb/lOcp49hO-GvkFM7JgrwZjRpZC_8=/1920x1080/filters:fill(auto,1)/how-to-play-tetris-99-on-nintendo-switch-featured-7af5d3957deb44f4a8d4c812d88946ce.jpg"
        },
        {
            name: "One4All",
            description: "Play against a 4 opponents opponent to win a pizza",
            image: "https://cdn.pomu.com/files/game/img_mobile/15644/Tetris-Cube_.webp"
        }
    ])

    return (
        <div>
            <Navigation />
            <h1 className='text-center my-5 pt-5'>Game modes</h1>
            <div style={styles.groupContainer}>
                {games.map((game, i) => {
                    return (
                        <Card style={styles.groupCard}>
                            <Card.Img style={styles.thumbnail} variant="top" src={game.image} />
                            <Card.Body>
                                <Card.Title>{game.name}</Card.Title>
                                <Card.Text>
                                    {game.description}
                                </Card.Text>
                                <Button variant="flat" bg="flat" style={globalStyles.primaryButton}>Play</Button>
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

export default HomeView