import {SERVER_URL} from '../config';

export function checkIsAuthenticated() {
    let token = localStorage.getItem('token');
    var authenticated = false;

    let url = `${SERVER_URL}/validate/${token}`
    let settings = {
        method: "GET"
    }

    return fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error();
        })
        .then(responseJSON => {
            console.log(responseJSON);
            if (responseJSON.message === "success") {
                return {success: true, id: responseJSON.id, name: responseJSON.name};
            } else {
                return {success: false};
            }
        })
} 

export function authSignUp(credentials) {
    let url = `${SERVER_URL}/users/create`;
    let settings = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            name: credentials.name
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
            return {success: true}
        })
}

export function authLogin(credentials) {
    let url = `${SERVER_URL}/login`
    let settings = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
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

export function authLogout() {
    localStorage.removeItem('token');
    return new Promise((resolve, reject) => (resolve(true)))
}