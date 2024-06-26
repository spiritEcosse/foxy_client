import './App.css';
import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {
    BrowserRouter as Router,
    createRoutesFromChildren,
    matchRoutes,
    Route,
    Routes,
    useLocation,
    useNavigationType
} from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import ItemComponent from './components/ItemComponent';
import FooterComponent from './components/FooterComponent';
import {HelmetProvider} from 'react-helmet-async';
import HomeComponent from './components/HomeComponent';
import PageComponent from './components/PageComponent';
import {ThemeProvider} from '@mui/material/styles';
import theme from './components/CustomTheme';
import {installTwicPics} from '@twicpics/components/react';
import * as Sentry from '@sentry/react';
import {CurrencyContext} from './components/CurrencyContext';
import AccountComponent from './components/AccountComponent';
import OrderComponent from './components/OrderComponent';
import OrderDetailsComponent from './components/OrderDetailsComponent';
import {ItemType, UserType} from './types';
import {BasketContext} from './components/BasketContext';
import {UserContext} from './components/UserContext';
import {LoginPopupContext} from './components/LoginPopupContext';

const helmetContext = {};
const domain = `https://${import.meta.env.VITE_APP_TWIC_PICS_NAME}.twic.pics`;

installTwicPics({
    // domain is mandatory
    domain
});

if (process.env.VITE_APP_SENTRY_DSN !== 'null') {
    Sentry.init({
        dsn: process.env.VITE_APP_SENTRY_DSN,
        integrations: [
            // See docs for support of different versions of variation of react router
            // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
            Sentry.reactRouterV6BrowserTracingIntegration({
                useEffect: React.useEffect,
                useLocation,
                useNavigationType,
                createRoutesFromChildren,
                matchRoutes
            }),
            Sentry.replayIntegration()
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        tracesSampleRate: 1.0,

        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', /^https:\/\/api\.dev\.faithfishart\.comi/],

        // Capture Replay for 100% of all sessions,
        // plus for 100% of sessions with an error
        replaysSessionSampleRate: 1.0,
        replaysOnErrorSampleRate: 1.0
    });
}

function App() {
    const [currency, setCurrency] = useState(localStorage.getItem('currency') ?? 'EUR');
    const [basket, setBasket] = useState<ItemType[]>([]);
    const [user, setUser] = useState<UserType | null>(JSON.parse(localStorage.getItem('user') || 'null'));
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const setUserAndStore = (user: UserType | null) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    };

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    const addToBasket = (item: ItemType) => {
        if (user === null) {
            setShowLoginPopup(true);
        } else {
            setBasket((currentBasket) => [...currentBasket, item]);
        }
    };

    const removeFromBasket = (excludeItem: ItemType) => {
        setBasket((currentBasket) => currentBasket.filter((item) => item.id !== excludeItem.id));
    };

    const isInBasket = (item: ItemType): boolean => {
        return basket.some((basketItem) => basketItem.id === item.id);
    };

    const value = useMemo(() => ({currency, setCurrency}), [currency, setCurrency]);

    return (
        <LoginPopupContext.Provider value={{showLoginPopup, setShowLoginPopup}}>
            <UserContext.Provider value={{user, setUser, setUserAndStore}}>
                <BasketContext.Provider value={{basket, addToBasket, removeFromBasket, isInBasket}}>
                    <CurrencyContext.Provider value={value}>
                        <Router>
                            <HelmetProvider context={helmetContext}>
                                <ThemeProvider theme={theme}>
                                    <div className="App">
                                        <HeaderComponent/>
                                        <Routes>
                                            <Route path="/" element={<HomeComponent/>}/>
                                            <Route path="/account" element={<AccountComponent/>}/>
                                            <Route path="/account/order" element={<OrderComponent/>}/>
                                            <Route path="/account/order/:id" element={<OrderDetailsComponent/>}/>
                                            <Route path="/:slug" element={<PageComponent/>}/>
                                            <Route path="/item/:slug" element={<ItemComponent/>}/>
                                        </Routes>
                                        <FooterComponent/>
                                    </div>
                                </ThemeProvider>
                            </HelmetProvider>
                        </Router>
                    </CurrencyContext.Provider>
                </BasketContext.Provider>
            </UserContext.Provider>
        </LoginPopupContext.Provider>
    );
}

export default App;
