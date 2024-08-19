import React, { createContext, useCallback, useMemo, useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { useLogoutListener } from '../hooks/useLogoutListener';

interface AuthContextType {
    auth: string | null;
    setAuth: (auth: string | null) => void;
    logout: () => void;
    setAuthAndStore: (auth: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [auth, setAuth] = useState<string | null>(
        localStorage.getItem('auth')
    );

    const logout = () => {
        googleLogout();
        window.dispatchEvent(new Event('logout'));
    };

    const setAuthAndStore = useCallback((value: string | null) => {
        setAuth(value);
        if (value) {
            localStorage.setItem('auth', value);
        } else {
            localStorage.removeItem('auth');
        }
    }, []);

    useLogoutListener(() => setAuthAndStore(null));

    const contextValue = useMemo(
        () => ({
            auth,
            setAuth,
            logout,
            setAuthAndStore,
        }),
        [auth, setAuth, logout, setAuthAndStore]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
