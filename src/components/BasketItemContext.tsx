import React from 'react';
import {BasketItemType, ItemType} from '../types';

export const BasketItemContext = React.createContext({
    basketItems: [] as BasketItemType[],
    setBasketItems: (value: BasketItemType[]) => {
    },
    setBasketItemsAndStore: (value: BasketItemType[]) => {
    },
    setBasketItemAndStore: ((value: BasketItemType) => {
    }),
    addToBasket: (item: ItemType) => {
    },
    removeFromBasket: (item: ItemType) => {
    },
    isInBasket: (item: ItemType): boolean => {
        return false;
    },
});