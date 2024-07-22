// LoginPopupContext.tsx
import React from 'react';


export const LoginPopupContext = React.createContext({
    showLoginPopup: false,
    setShowLoginPopup: (popup: boolean) => {
    },
    setShowLoginPopupAndStore: (popup: boolean) => {
    },
});
