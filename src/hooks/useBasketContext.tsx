import {useContext} from 'react';
import {BasketContext} from '../components/BasketContext';

export const useBasketContext = () => {
    const context = useContext(BasketContext);
    if (!context) {
        throw new Error('useBasketContext must be used within a BasketContext');
    }
    return context;
};
