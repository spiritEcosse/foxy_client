import React from 'react';

export const CurrencyContext = React.createContext({
    currency: 'EUR',
    setCurrency: (currency: string) => {},
});
