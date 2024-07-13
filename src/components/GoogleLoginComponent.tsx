// GoogleLoginComponent.tsx
import React, {useContext, useState} from 'react';
import {UserContext} from './UserContext';
import {LoginPopupContext} from './LoginPopupContext';
import {BasketContext} from './BasketContext';
import {BasketItemContext} from './BasketItemContext';
import LoginIcon from '@mui/icons-material/Login';
import IconButton from '@mui/material/IconButton';
import {Modal, Typography} from '@mui/material';
import {GoogleLogin} from '@react-oauth/google';
import {UserType} from '../types';
import {fetchData} from '../utils';
import Box from '@mui/material/Box';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400, // Adjust width as needed
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex', // Ensures content inside modal is flex
    flexDirection: 'column', // Stack children vertically
    alignItems: 'center', // Center children horizontally
    justifyContent: 'center', // Center children vertically
};

const GoogleLoginComponent: React.FC = () => {
    const {setUserAndStore} = useContext(UserContext);
    const {showLoginPopup, setShowLoginPopup} = useContext(LoginPopupContext);
    const {basket, setBasket, setBasketAndStore} = useContext(BasketContext);
    const {basketItems, setBasketItemsAndStore} = useContext(BasketItemContext);
    const [openModal, setOpenModal] = useState(false);

    // Define the login function to open the modal
    const login = () => {
        setOpenModal(true);
    };

    const googleLoginButton = (
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

    // Example modal component (simplified for demonstration)
    const renderModal = (
        <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="login-modal-title"
            aria-describedby="login-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Login with Google
                </Typography>
                <Box id="modal-modal-description" sx={{mt: 2}}>
                    {googleLoginButton}
                </Box>
            </Box>
        </Modal>
    );

    return (
        <>
            <IconButton
                size="small"
                edge="end"
                aria-label="login"
                aria-haspopup="true"
                onClick={login}
                color="inherit"
            >
                <LoginIcon/>
            </IconButton>
            {renderModal}
        </>
    );
};

export default GoogleLoginComponent;
