import React from 'react';
import {BasketItemType, ItemType} from '../types';

export const BasketItemContext = React.createContext({
    basketItems: [] as BasketItemType[],
    setBasketItemsAndStore: ((value: BasketItemType) => {
    }),
    addToBasket: (item: ItemType) => {
    },
    removeFromBasket: (item: ItemType) => {
    },
    isInBasket: (item: ItemType): boolean => {
        return false;
    },
});
