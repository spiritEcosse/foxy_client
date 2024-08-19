import {useContext} from 'react';
import {ErrorContext} from '../components/ErrorContext';

export const useErrorContext = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useErrorContext must be used within a ErrorContext');
    }
    return context;
};
