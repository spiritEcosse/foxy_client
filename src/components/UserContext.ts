import React from 'react';
import {UserType} from '../types';


interface UserContextProps {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    setUserAndStore: (user: UserType | null) => void;
}

const defaultUserContext: UserContextProps = {
    user: null,
    setUser: () => {
    },
    setUserAndStore: () => {
    },
};

export const UserContext = React.createContext<UserContextProps>(defaultUserContext);
