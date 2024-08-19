import { useEffect } from 'react';

export const useLogoutListener = (callback: () => void) => {
    useEffect(() => {
        const handleLogout = () => {
            callback();
        };

        window.addEventListener('logout', handleLogout);

        return () => {
            window.removeEventListener('logout', handleLogout);
        };
    }, [callback]);
};
