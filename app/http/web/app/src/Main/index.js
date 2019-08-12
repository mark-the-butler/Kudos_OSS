import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react';

import Login from '../Login';
import Home from '../Home';

const Main = () => {
    return (
        <Router>
            <Security
                issuer={''}
                client_id={''}
                redirect_uri={'http://localhost:8080/implicit/callback'}
                scope={['openid', 'profile', 'email']}>

                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/implicit/callback" component={ImplicitCallback} />
                    <SecureRoute path="/home" component={Home} />
                </Switch>
                </Security>
        </Router>
    );
};

export default Main;