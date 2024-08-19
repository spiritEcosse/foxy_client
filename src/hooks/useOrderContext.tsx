import { useContext } from 'react';
import { OrderContext } from '../components/OrderContext';

export const useOrderContext = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrderContext must be used within a OrderContext');
    }
    return context;
};
