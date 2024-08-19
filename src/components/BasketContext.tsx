import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { BasketType } from '../types';
import { useLogoutListener } from '../hooks/useLogoutListener';

export const BasketContext = React.createContext<{
    basket: BasketType | null;
    setBasket: Dispatch<SetStateAction<BasketType | null>>;
    setBasketAndStore: (value: BasketType | null) => void;
}>({
    basket: null,
    setBasket: () => {},
    setBasketAndStore: () => {},
});

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [basket, setBasket] = useState<BasketType | null>(
        JSON.parse(localStorage.getItem('basket') || 'null')
    );

    const setBasketAndStore = useCallback((value: BasketType | null) => {
        setBasket(value);
        if (value) {
            localStorage.setItem('basket', JSON.stringify(value));
        } else {
            localStorage.removeItem('basket');
        }
    }, []);

    useLogoutListener(() => setBasketAndStore(null));

    return (
        <BasketContext.Provider
            value={{ basket, setBasket, setBasketAndStore }}
        >
            {children}
        </BasketContext.Provider>
    );
};
