import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {GoogleOAuthProvider} from '@react-oauth/google';
import * as Sentry from '@sentry/react';
import {createRoutesFromChildren, matchRoutes, useLocation, useNavigationType} from 'react-router-dom';
import {ErrorProvider} from './components/ErrorContext';

Sentry.init({
    dsn: import.meta.env.VITE_APP_SENTRY_DSN,
    integrations: [
        // See docs for support of different versions of variation of React router
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
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development'
});


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Sentry.ErrorBoundary fallback={<div>An error has occurred</div>}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
                <ErrorProvider>
                    <App/>
                </ErrorProvider>
            </GoogleOAuthProvider>
        </Sentry.ErrorBoundary>
    </React.StrictMode>,
);
