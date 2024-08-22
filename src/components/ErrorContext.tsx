import React, { createContext, useMemo, useState } from 'react';

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

    const contextValue = useMemo(
        () => ({
            errorMessage,
            setErrorMessage,
        }),
        [errorMessage]
    );

    return (
        <ErrorContext.Provider value={contextValue}>
            {children}
        </ErrorContext.Provider>
    );
};
