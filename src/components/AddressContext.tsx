import React from 'react';
import {AddressType} from '../types';

export const AddressContext = React.createContext({
    address: {} as AddressType | null,
    setAddress: (value: AddressType | null) => {
    },
    setAddressAndStore: ((value: AddressType | null) => {
    })
});
