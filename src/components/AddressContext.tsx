import React from 'react';
import {AddressType} from '../types';

export const AddressContext = React.createContext({
    address: {} as AddressType | null,
    setAddress: (value: (prevAddress: (AddressType | null)) => (AddressType)) => {
    },
    setAddressAndStore: ((value: AddressType | null) => {
    }),
    updateAddressField: (fieldName: keyof AddressType, newValue: any) => {
    },
});
