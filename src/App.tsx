import './App.css';
import * as React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
    useNavigationType,
    createRoutesFromChildren,
    matchRoutes
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
import {useEffect, useMemo, useState} from 'react';
import {CurrencyContext} from './components/CurrencyContext';

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

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency]);

    return (
        <CurrencyContext.Provider value={value}>
            <Router>
                <HelmetProvider context={helmetContext}>
                    <ThemeProvider theme={theme}>
                        <div className="App">
                            <HeaderComponent/>
                            <Routes>
                                <Route path="/" element={<HomeComponent/>}/>
                                <Route path="/:slug" element={<PageComponent/>}/>
                                <Route path="/item/:slug" element={<ItemComponent/>}/>
                            </Routes>
                            <FooterComponent/>
                        </div>
                    </ThemeProvider>
                </HelmetProvider>
            </Router>
        </CurrencyContext.Provider>
    );
}

export default App;
