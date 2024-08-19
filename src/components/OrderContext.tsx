import React, { useState } from 'react';
import { OrderType } from '../types';
import { useLogoutListener } from '../hooks/useLogoutListener';

export const OrderContext = React.createContext<{
    order: OrderType | null;
    setOrder: (value: OrderType | null) => void;
}>({
    order: null,
    setOrder: () => {},
});

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [order, setOrder] = useState<OrderType | null>(null);

    useLogoutListener(() => setOrder(null));

    return (
        <OrderContext.Provider value={{ order, setOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
