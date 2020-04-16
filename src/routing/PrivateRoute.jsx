import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import Container from 'react-bootstrap/Container';
import Navigation from '../components/Navigation';

function PrivateRoute({ component: Component, ...otherProps }) {

    const { isAuthenticated, isLoading } = useContext(AuthContext)

    return (
        <div>
            <Navigation />
            <Container className='mt-5 pt-5'>
                <Route
                    {...otherProps}
                    render={props => (
                        !isLoading
                            ?
                            (
                                isAuthenticated
                                    ?
                                    <Component {...props} />
                                    :
                                    <Redirect to={'/login'} />
                            )
                            :
                            <h1>Cargando...</h1>
                    )}
                />
            </Container>
        </div>
    )

}

export default PrivateRoute;