import React from 'react';
import {OrderType} from '../types';

export const OrderContext = React.createContext({
    order: {} as OrderType | null,
    setOrder: (value: OrderType | null) => {
    },
});
