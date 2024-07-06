// GoogleLoginComponent.tsx
import React, {useContext} from 'react';
import {GoogleLogin} from '@react-oauth/google';
import {fetchData} from '../utils';
import {UserContext} from './UserContext';
import {UserType} from '../types';
import {LoginPopupContext} from './LoginPopupContext';
import {BasketContext} from './BasketContext';
import {BasketItemContext} from './BasketItemContext';

const GoogleLoginComponent: React.FC = () => {
    const {setUserAndStore} = useContext(UserContext);
    const {showLoginPopup, setShowLoginPopup} = useContext(LoginPopupContext);
    const {basket, setBasket, setBasketAndStore} = useContext(BasketContext);
    const {basketItems, setBasketItemsAndStore} = useContext(BasketItemContext);

    return (
        <GoogleLogin
            useOneTap={showLoginPopup}
            onSuccess={async (credentialResponse: any) => {
                if (!credentialResponse.credential) {
                    console.log('Credential is undefined');
                    return;
                }
                const credential = credentialResponse.credential as string;
                const _user: UserType = await fetchData('', 'auth/google_login', 'POST', setShowLoginPopup, {credentials: credential});
                setShowLoginPopup(false);
                setUserAndStore(_user);
                localStorage.setItem('auth', credential);

                const responseBasketGet = await fetchData('', `basket?user_id=${_user.id}&in_use=true`, 'GET', setShowLoginPopup);
                let _basket;
                if (responseBasketGet.data.length === 0) {
                    _basket = await fetchData('', 'basket', 'POST', setShowLoginPopup, {user_id: _user.id});
                } else {
                    _basket = responseBasketGet.data[0];
                    const responseBasketItems = await fetchData('', `basketitem?basket_id=${_basket.id}`, 'GET', setShowLoginPopup);
                    setBasketItemsAndStore(responseBasketItems.data);
                }
                setBasketAndStore(_basket);
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    );
};

export default GoogleLoginComponent;
