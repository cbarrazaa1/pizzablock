import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner';

function NonAuthRoute ({ component: Component, ...otherProps }) {

    const { isAuthenticated, isLoading } = useContext(AuthContext)

    return (
        <Route
            {...otherProps}
            render={props => (
                !isLoading
                    ?
                    (
                        !isAuthenticated
                            ?
                            <Component {...props} />
                            :
                            <Redirect to={'/'} />
                    )
                    :
                    <LoadingSpinner/>
            )}
        />
    )
}

export default NonAuthRoute;