import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

const Login = (props) => {
    const [isAuthenticated, setAuthentication] = useState(null);

    let checkAuthentication = async () => {
        const authenticated = await props.auth.isAuthenticated();
        if (authenticated !== isAuthenticated) {
            setAuthentication(authenticated);
        }
    };

    useEffect(() => {
        checkAuthentication();
    });

    let login = async (e) => {
        props.auth.login('/home');
    };

    if(isAuthenticated) {
        return <Redirect to='/home' />
    }
    else {
        return (
            <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Button variant="contained" color="primary" onClick={login}>Login with Okta</Button>
            </div>
        );
    }
}

export default withAuth(Login);