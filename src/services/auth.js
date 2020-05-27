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
                return {
                    success: true,
                    id: responseJSON.id, 
                    name: responseJSON.user_name, 
                    balance: responseJSON.balance,
                    role: responseJSON.role
                };
            } else {
                return {success: false};
            }
        })
} 

export function authSignUp(credentials) {
    let url = `${SERVER_URL}/create/user`;
    let settings = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }

    console.log(credentials);

    return fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            return {success: true, id: responseJSON._id}
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
            console.log(responseJSON);
            return {
                success: true, 
                id: responseJSON.id, 
                name: responseJSON.user_name, 
                balance: responseJSON.balance,
                role: responseJSON.role
            }
        })
}

export async function authLogout(id) {
    await fetch(`${SERVER_URL}/logout/${id}`, {
        method: 'POST',
    });
    localStorage.removeItem('token');
    return new Promise((resolve, reject) => (resolve(true)))
}