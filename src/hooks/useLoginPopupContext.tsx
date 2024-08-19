import { useContext } from 'react';
import { LoginPopupContext } from '../components/LoginPopupContext';

export const useLoginPopupContext = () => {
    const context = useContext(LoginPopupContext);
    if (!context) {
        throw new Error(
            'useLoginPopupContext must be used within a LoginPopupContext'
        );
    }
    return context;
};
