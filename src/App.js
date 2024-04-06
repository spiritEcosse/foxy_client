import './App.css';
import * as React from 'react';
import {BrowserRouter as Router, Route, Routes, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes} from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent";
import Item from "./components/Item";
import FooterComponent from "./components/FooterComponent";
import {HelmetProvider} from "react-helmet-async";
import HomeComponent from "./components/HomeComponent";
import PageComponent from "./components/PageComponent";
import {ThemeProvider} from "@mui/material/styles";
import theme from "./components/CustomTheme";
import {installTwicPics} from "@twicpics/components/react";
import {setupCache} from "axios-cache-interceptor";
import Axios from "axios";
import * as Sentry from "@sentry/react";

const helmetContext = {};
const domain = `https://${process.env.REACT_APP_TWIC_PICS_NAME}.twic.pics`;

installTwicPics({
    // domain is mandatory
    domain: domain
})
setupCache(Axios);

if (process.env.REACT_APP_SENTRY !== "null") {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY,
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
        tracePropagationTargets: ["localhost", /^https:\/\/api\.dev\.faithfishart\.comi/],

        // Capture Replay for 100% of all sessions,
        // plus for 100% of sessions with an error
        replaysSessionSampleRate: 1.0,
        replaysOnErrorSampleRate: 1.0,
    });
}

function App() {
    return (
        <Router>
            <HelmetProvider context={helmetContext}>
                <ThemeProvider theme={theme}>
                    <div className="App">
                        <HeaderComponent/>
                        <Routes>
                            <Route path="/" exact element={<HomeComponent/>}/>
                            <Route path="/:slug" exact element={<PageComponent/>}/>
                            <Route path="/item/:id" exact element={<Item/>}/>
                        </Routes>
                        <FooterComponent/>
                    </div>
                </ThemeProvider>
            </HelmetProvider>
        </Router>
    );
}

export default App;
