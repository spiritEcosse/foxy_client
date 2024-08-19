import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useLogoutListener } from '../hooks/useLogoutListener';

// Correctly define the context type
export const LoginPopupContext = React.createContext<{
    showLoginPopup: boolean;
    setShowLoginPopup: Dispatch<SetStateAction<boolean>>;
    setShowLoginPopupAndStore: (popup: boolean) => void;
        }>({
            showLoginPopup: false,
            setShowLoginPopup: () => {
                // No-op placeholder function
            },
            setShowLoginPopupAndStore: () => {
                // No-op placeholder function
            },
        });

export const LoginPopupProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [showLoginPopup, setShowLoginPopup] = useState<boolean>(
        JSON.parse(localStorage.getItem('showLoginPopup') ?? 'false'),
    );

    // Function to set the state and store in localStorage
    const setShowLoginPopupAndStore = (popup: boolean) => {
        setShowLoginPopup(popup);
        localStorage.setItem('showLoginPopup', JSON.stringify(popup));
    };

    useLogoutListener(() =>
        setShowLoginPopupAndStore(
            JSON.parse(localStorage.getItem('showLoginPopup') ?? 'true'),
        ),
    );

    const contextValue = useMemo(() => ({
        showLoginPopup,
        setShowLoginPopup,
        setShowLoginPopupAndStore,
    }), [showLoginPopup]);

    return (
        <LoginPopupContext.Provider value={contextValue}>
            {children}
        </LoginPopupContext.Provider>
    );
};
