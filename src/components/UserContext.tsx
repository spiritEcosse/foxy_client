import React, { useCallback, useMemo, useState } from 'react';
import { UserType } from '../types';
import { useLogoutListener } from '../hooks/useLogoutListener';

interface UserContextProps {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    setUserAndStore: (user: UserType | null) => void;
}

const defaultUserContext: UserContextProps = {
    user: null,
    setUser: () => {},
    setUserAndStore: () => {},
};

export const UserContext =
    React.createContext<UserContextProps>(defaultUserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<UserType | null>(
        JSON.parse(localStorage.getItem('user') ?? 'null')
    );

    const setUserAndStore = useCallback((value: UserType | null) => {
        setUser(value);
        if (value) {
            localStorage.setItem('user', JSON.stringify(value));
        } else {
            localStorage.removeItem('user');
        }
    }, []);

    useLogoutListener(() => setUserAndStore(null));

    const contextValue = useMemo(
        () => ({
            user,
            setUser,
            setUserAndStore,
        }),
        [setUserAndStore, user]
    );

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};
