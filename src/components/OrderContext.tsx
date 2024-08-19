import React, { useMemo, useState } from 'react';
import { OrderType } from '../types';
import { useLogoutListener } from '../hooks/useLogoutListener';

export const OrderContext = React.createContext<{
    order: OrderType | null;
    setOrder: (value: OrderType | null) => void;
        }>({
            order: null,
            setOrder: () => {
            },
        });

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [order, setOrder] = useState<OrderType | null>(null);

    useLogoutListener(() => setOrder(null));
    const contextValue = useMemo(() => ({
        order,
        setOrder,
    }), [order]);

    return (
        <OrderContext.Provider value={contextValue}>
            {children}
        </OrderContext.Provider>
    );
};
