import React, {useEffect, useMemo, useState} from 'react';

interface CurrencyContextProps {
    currency: string;
    setCurrency: (currency: string) => void;
}

export const CurrencyContext = React.createContext<CurrencyContextProps | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [currency, setCurrency] = useState<string>('EUR');

    const value = useMemo(() => ({
        currency,
        setCurrency,
    }), [currency]);

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};