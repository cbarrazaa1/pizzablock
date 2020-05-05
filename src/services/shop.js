import {SERVER_URL} from '../config';

export function buyItem(item, user) {

}

export function getShopItems() {
    let url = `${SERVER_URL}/get/shop/all`
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

export function getShopItem(id) {
    let url = `${SERVER_URL}/get/shop/${id}`
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