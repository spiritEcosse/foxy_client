// GoogleLoginComponent.tsx
import React from 'react';
import LoginIcon from '@mui/icons-material/Login';
import IconButton from '@mui/material/IconButton';
import { Modal, Typography } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { UserType } from '../types';
import { fetchData } from '../utils';
import Box from '@mui/material/Box';
import { useBasketContext } from '../hooks/useBasketContext';
import { useBasketItemContext } from '../hooks/useBasketItemContext';
import { useErrorContext } from '../hooks/useErrorContext';
import { useUserContext } from '../hooks/useUserContext';
import { useLoginPopupContext } from '../hooks/useLoginPopupContext';
import { useAuthContext } from '../hooks/useAuthContext';

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
    const { setUserAndStore } = useUserContext();
    const { showLoginPopup, setShowLoginPopupAndStore } =
        useLoginPopupContext();
    const { setBasketAndStore } = useBasketContext();
    const { setBasketItemsAndStore } = useBasketItemContext();
    const { setErrorMessage } = useErrorContext();
    const { setAuthAndStore } = useAuthContext();

    const login = () => {
        setShowLoginPopupAndStore(true);
    };

    const googleLoginButton = (
        <GoogleLogin
            onSuccess={async (credentialResponse: CredentialResponse) => {
                if (!credentialResponse.credential) {
                    setErrorMessage('Login Failed');
                    return;
                }
                try {
                    const credential = credentialResponse.credential as string;
                    const _user: UserType = await fetchData(
                        '',
                        'auth/google_login',
                        'POST',
                        { credentials: credential },
                        true
                    );
                    setUserAndStore(_user);
                    setAuthAndStore(credential);

                    const responseBasketGet = await fetchData(
                        '',
                        `basket?user_id=${_user.id}&in_use=true`,
                        'GET',
                        {},
                        true
                    );
                    let _basket;
                    if (responseBasketGet.data.length === 0) {
                        _basket = await fetchData(
                            '',
                            'basket',
                            'POST',
                            { user_id: _user.id },
                            true
                        );
                    } else {
                        _basket = responseBasketGet.data[0];
                        const responseBasketItems = await fetchData(
                            '',
                            `basketitem?basket_id=${_basket.id}`,
                            'GET',
                            {},
                            true
                        );
                        setBasketItemsAndStore(responseBasketItems.data);
                    }
                    setBasketAndStore(_basket);
                    setShowLoginPopupAndStore(false);
                } catch (error) {
                    setErrorMessage(`Error fetching data: ${error}`);
                }
            }}
            onError={() => {
                setErrorMessage('Login Failed');
            }}
        />
    );

    // Example modal component (simplified for demonstration)
    const renderModal = (
        <Modal
            open={showLoginPopup}
            onClose={() => setShowLoginPopupAndStore(false)}
            aria-labelledby="login-modal-title"
            aria-describedby="login-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Login with Google
                </Typography>
                <Box id="modal-modal-description" sx={{ mt: 2 }}>
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
                <LoginIcon />
            </IconButton>
            {renderModal}
        </>
    );
};

export default GoogleLoginComponent;
