export function checkIsAuthenticated() {
    let token = localStorage.getItem('token');
    var authenticated = false;

    // Validar token con backend

    if (token != null) {
        authenticated = true;
    }

    return new Promise((resolve, reject) => (resolve(authenticated)))
} 

export function authSignUp(credentials) {
    // Enviar credentials al backend
    return new Promise((resolve, reject) => (resolve(true)))
}

export function authLogin(credentials) {
    // Enviar login al backend
    localStorage.setItem('token', 'holas');
    return new Promise((resolve, reject) => (resolve(true)))
}

export function authLogout() {
    localStorage.removeItem('token');
    return new Promise((resolve, reject) => (resolve(true)))
}