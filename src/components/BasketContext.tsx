import React from 'react';
import {ItemType} from '../types';

export const BasketContext = React.createContext({
    basket: [] as ItemType[],
    addToBasket: (item: ItemType) => {},
    removeFromBasket: (item: ItemType) => {},
    isInBasket: (item: ItemType): boolean  => {return false; },
});
