import {SERVER_URL} from '../config';

export function creatGameMode(gameMode) {
    let url = `${SERVER_URL}/create/mode`
    let settings = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: gameMode.name,
            description: gameMode.description,
            imgUrl: gameMode.imgUrl
        })
    }

    return fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            localStorage.setItem('token', responseJSON.token);
            return {success: true, id: responseJSON.id, name: responseJSON.name}
        })
} 