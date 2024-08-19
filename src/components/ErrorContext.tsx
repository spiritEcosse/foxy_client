import React, { createContext, useState } from 'react';

interface ErrorContextType {
    errorMessage: string;
    setErrorMessage: (message: string) => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(
    undefined
);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
            {children}
        </ErrorContext.Provider>
    );
};
