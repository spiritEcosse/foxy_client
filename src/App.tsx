import './App.css';
import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import ItemComponent from './components/ItemComponent';
import FooterComponent from './components/FooterComponent';
import { HelmetProvider } from 'react-helmet-async';
import HomeComponent from './components/HomeComponent';
import PageComponent from './components/PageComponent';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/CustomTheme';
import { installTwicPics } from '@twicpics/components/react';
import { CurrencyProvider } from './components/CurrencyContext';
import AccountComponent from './components/AccountComponent';
import OrderComponent from './components/OrderComponent';
import OrderDetailsComponent from './components/OrderDetailsComponent';
import { BasketProvider } from './components/BasketContext';
import { LoginPopupProvider } from './components/LoginPopupContext';
import { BasketItemProvider } from './components/BasketItemContext';
import CheckoutComponent from './components/CheckoutComponent';
import { AddressProvider } from './components/AddressContext';
import { OrderProvider } from './components/OrderContext';
import SuccessOrderComponent from './components/SuccessOrderComponent';
import { Slide, Snackbar, SnackbarCloseReason } from '@mui/material';
import { UserProvider } from './components/UserContext';
import { useErrorContext } from './hooks/useErrorContext';
import { AuthProvider } from './components/AuthProvider';

const helmetContext = {};
const domain = `https://${import.meta.env.VITE_APP_TWIC_PICS_NAME}.twic.pics`;

installTwicPics({
    // domain is mandatory
    domain,
});

function App() {
    const { errorMessage, setErrorMessage } = useErrorContext();

    const handleClose = React.useCallback(
        (event: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => {
            if (reason === 'clickaway') {
                return;
            }
            setErrorMessage('');
        },
        [setErrorMessage]
    );

    return (
        <AuthProvider>
            <OrderProvider>
                <AddressProvider>
                    <LoginPopupProvider>
                        <UserProvider>
                            <BasketProvider>
                                <BasketItemProvider>
                                    <CurrencyProvider>
                                        <Router>
                                            <HelmetProvider
                                                context={helmetContext}
                                            >
                                                <ThemeProvider theme={theme}>
                                                    <div className="App">
                                                        <HeaderComponent />
                                                        <Routes>
                                                            <Route
                                                                path="/"
                                                                element={
                                                                    <HomeComponent />
                                                                }
                                                            />
                                                            <Route
                                                                path="/success_order"
                                                                element={
                                                                    <SuccessOrderComponent />
                                                                }
                                                            />
                                                            <Route
                                                                path="/checkout"
                                                                element={
                                                                    <CheckoutComponent />
                                                                }
                                                            />
                                                            <Route
                                                                path="/account"
                                                                element={
                                                                    <AccountComponent />
                                                                }
                                                            />
                                                            <Route
                                                                path="/account/order"
                                                                element={
                                                                    <OrderComponent />
                                                                }
                                                            />
                                                            <Route
                                                                path="/account/order/:id"
                                                                element={
                                                                    <OrderDetailsComponent />
                                                                }
                                                            />
                                                            <Route
                                                                path="/:slug"
                                                                element={
                                                                    <PageComponent />
                                                                }
                                                            />
                                                            <Route
                                                                path="/item/:slug"
                                                                element={
                                                                    <ItemComponent />
                                                                }
                                                            />
                                                        </Routes>
                                                        <FooterComponent />
                                                    </div>
                                                </ThemeProvider>
                                            </HelmetProvider>
                                        </Router>
                                        <Snackbar
                                            open={!!errorMessage}
                                            autoHideDuration={6000}
                                            onClose={handleClose}
                                            message={errorMessage}
                                            TransitionComponent={(props) => (
                                                <Slide
                                                    {...props}
                                                    direction="up"
                                                />
                                            )}
                                        />
                                    </CurrencyProvider>
                                </BasketItemProvider>
                            </BasketProvider>
                        </UserProvider>
                    </LoginPopupProvider>
                </AddressProvider>
            </OrderProvider>
        </AuthProvider>
    );
}

export default App;
