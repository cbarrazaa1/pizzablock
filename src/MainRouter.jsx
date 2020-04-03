import React from 'react';
import {Route, Switch} from 'react-router-dom';
import GameContainer from './game/GameContainer';
import PrivateRoute from './PrivateRoute';
import LoginView from './views/LoginView';
import SignupView from './views/SignupView';
import HomeView from './views/HomeView';

function MainRouter() {
    return (
        <Switch>
            <PrivateRoute exact path="/" component={HomeView}/>
            <PrivateRoute path="/game" component={GameContainer}/>
            <Route path="/login" component={LoginView}/>
            <Route path="/signup" component={SignupView}/>
        </Switch>
    )
}

export default MainRouter