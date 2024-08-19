import { useContext } from 'react';
import { AddressContext } from '../components/AddressContext';

export const useAddressContext = () => {
    const context = useContext(AddressContext);
    if (!context) {
        throw new Error(
            'useAddressContext must be used within a AddressProvider'
        );
    }
    return context;
};
