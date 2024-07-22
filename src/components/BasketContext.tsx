import React from 'react';
import {BasketType} from '../types';

export const BasketContext = React.createContext({
    basket: {} as BasketType | null,
    setBasket: (value: BasketType | null) => {
    },
    setBasketAndStore: ((value: BasketType | null) => {
    })
});
