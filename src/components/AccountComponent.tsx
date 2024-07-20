import React, {useContext, useState} from 'react';
import {CircularProgress, Paper} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import {fetchData} from '../utils';
import {useError} from './ErrorContext';
import {UserContext} from './UserContext';

const AccountComponent = () => {
    const {setErrorMessage} = useError();
    const navigate = useNavigate();
    const {user, setUserAndStore} = useContext(UserContext);
    const [isDeleting, setIsDeleting] = useState(false); // State to track deletion process

    const deleteAccount = async () => {
        if (!user) {
            setErrorMessage('Login required');
            navigate('/');
            return;
        }
        setIsDeleting(true); // Start deletion process
        try {
            await fetchData('', `user/${user.id}`, 'DELETE');
            localStorage.removeItem('auth');
            localStorage.setItem('showLoginPopup', 'false');
            window.dispatchEvent(new Event('storage'));
            setErrorMessage('Account deleted');
            navigate('/');
        } catch (error) {
            setErrorMessage('Couldn\'t delete account');
        } finally {
            setIsDeleting(false); // End deletion process
        }
    };

    return (
        <div style={{padding: '20px', maxWidth: '100%'}}>
            <h1>Account</h1>
            <Paper style={{padding: '20px'}}>
                <Button variant="contained" color="primary" component={Link} to="/account/order">
                    Orders
                </Button>
                <div style={{minHeight: '40vh'}}></div>
                <Button variant={'contained'} color={'warning'} onClick={() => deleteAccount()} disabled={isDeleting}>
                    {isDeleting ? <CircularProgress size={24}/> : 'Delete Account'}
                </Button>
            </Paper>
        </div>
    );
};

export default AccountComponent;
