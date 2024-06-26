// GoogleLoginComponent.tsx
import React, {useContext} from 'react';
import {GoogleLogin} from '@react-oauth/google';
import {fetchData} from '../utils';
import {UserContext} from './UserContext';
import {UserType} from '../types';
import {LoginPopupContext} from './LoginPopupContext';

const GoogleLoginComponent: React.FC = () => {
    const {setUserAndStore} = useContext(UserContext);
    const {showLoginPopup, setShowLoginPopup} = useContext(LoginPopupContext);

    return (
        <GoogleLogin
            useOneTap={showLoginPopup}
            onSuccess={(credentialResponse: any) => {
                if (!credentialResponse.credential) {
                    console.log('Credential is undefined');
                    return;
                }
                const credential = credentialResponse.credential as string;
                fetchData('', 'auth/google_login', 'POST', {credentials: credential})
                    .then((data: UserType) => {
                        setUserAndStore(data);
                        localStorage.setItem('auth', credential);
                    })
                    .catch(({code, message}: { code: string, message: string }) => {
                        console.log(code, message);
                    });
                setShowLoginPopup(false);
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    );
};

export default GoogleLoginComponent;
