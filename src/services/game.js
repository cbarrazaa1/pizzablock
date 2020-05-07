import {SERVER_URL} from '../config';

export function getGameInfo(game) {
    let url = `${SERVER_URL}/get/game/${game}`
    let settings = {
        method: "GET"
    }

    return fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json()
            }

            throw new Error(response.statusText)
        })
        .then(responseJSON => {
            return responseJSON;
        })
}


