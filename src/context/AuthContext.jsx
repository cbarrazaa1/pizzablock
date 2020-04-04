import React, { useState, useEffect } from 'react'
import { checkIsAuthenticated, authSignUp, authLogin, authLogout } from '../services/auth'

export const AuthContext = React.createContext({})

export default function Auth({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = () => checkIsAuthenticated()
        .then((result) => setIsAuthenticated(result))
        .catch(() => setIsAuthenticated(false))
        .then(() => setIsLoading(false))
        

    const login = credentials => {
        setIsLoading(true);
        authLogin(credentials)
            .then((result) => {
                setIsAuthenticated(result);
                setIsLoading(false);
            })
            .catch(error => {
                alert(error)
                setIsAuthenticated(false)
                setIsLoading(false);
            })
    }

    const logout = () => {
        authLogout()
        setIsAuthenticated(false);
    }

    const signUp = credentials => {
        setIsLoading(true);    
        authSignUp(credentials)
            .then((result) => {
                setIsAuthenticated(result)
                setIsLoading(false);
            })
            .catch(error => {
                alert(error)
                setIsAuthenticated(false)
                setIsLoading(false);
            })
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}