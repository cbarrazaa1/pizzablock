import {SERVER_URL} from '../config';

export function getUserInfo(userId) {
    let url = `${SERVER_URL}/get/user/${userId}`
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

export function updateUserInfo(userId, updatedUser) {
    let url = `${SERVER_URL}/update/user/${userId}`
    let settings = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    }

    return fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response);
            })
            .then(responseJSON => {
                return responseJSON
            })
}

export function uploadPofilePicture(userId, filesraw) {
    const files = Array.from(filesraw)

    const formData = new FormData()

    files.forEach((file, i) => {
      formData.append(i, file)
    })

    console.log(formData)

    return fetch(`${SERVER_URL}/update/user/${userId}/profilepic`, {
        method: 'PUT',
        body: formData,
    })
    .then(res => res.json())
    .then(response => {
        return response.success
    })
}

