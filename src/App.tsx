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
import {AddressType, BasketItemType, BasketType, ItemType, OrderType, UserType} from './types';
import {BasketContext} from './components/BasketContext';
import {UserContext} from './components/UserContext';
import {LoginPopupContext} from './components/LoginPopupContext';
import {CustomError, fetchData} from './utils';
import {BasketItemContext} from './components/BasketItemContext';
import CheckoutComponent from './components/CheckoutComponent';
import {AddressContext} from './components/AddressContext';
import {OrderContext} from './components/OrderContext';
import SuccessOrderComponent from './components/SuccessOrderComponent';

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
    const [basket, setBasket] = useState<BasketType | null>(JSON.parse(localStorage.getItem('basket') || 'null'));
    const [address, setAddress] = useState<AddressType | null>(JSON.parse(localStorage.getItem('address') || 'null'));
    const [basketItems, setBasketItems] = useState<BasketItemType[]>(JSON.parse(localStorage.getItem('basket_items') || '[]'));
    const [user, setUser] = useState<UserType | null>(JSON.parse(localStorage.getItem('user') || 'null'));
    const [order, setOrder] = useState<OrderType | null>(null);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const updateAddressField = (fieldName: keyof AddressType, newValue: any) => {
        setAddress((prevAddress) => {
            if (prevAddress) {
                return {...prevAddress, [fieldName]: newValue};
            }
            return {
                id: 0,
                address: '',
                country_id: 0,
                country: {id: 0, title: '', code: '', created_at: new Date(), updated_at: new Date()},
                city: '',
                zipcode: '',
                user_id: 0,
                created_at: new Date(),
                updated_at: new Date()
            };
        });
    };

    const setUserAndStore = (user: UserType | null) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        if (!user) {
            localStorage.setItem('auth', '');
        }
    };

    const setBasketAndStore = (basket: BasketType | null) => {
        setBasket(basket);
        localStorage.setItem('basket', JSON.stringify(basket));
    };

    const setBasketItemsAndStore = (basketItems: BasketItemType[]) => {
        setBasketItems(basketItems);
        localStorage.setItem('basket_items', JSON.stringify(basketItems));
    };

    const setAddressAndStore = (address: AddressType | null) => {
        setAddress(address);
        localStorage.setItem('address', JSON.stringify(address));
    };

    const setBasketItemAndStore = (value: BasketItemType) => {
        setBasketItems((currentBasketItems) => {
            const updatedBasketItems = [...currentBasketItems, value];
            localStorage.setItem('basket_items', JSON.stringify(updatedBasketItems));
            return updatedBasketItems;
        });
    };

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    const addToBasket = async (item: ItemType) => {
        if (localStorage.getItem('user') == 'null') {
            setShowLoginPopup(true);
            return;
        }

        if (basket) {
            try {
                const params = {
                    basket_id: basket.id,
                    item_id: item.id,
                };
                const basketItem = await fetchData('', 'basketitem', 'POST', setShowLoginPopup, params);
                setBasketItemAndStore(basketItem);
            } catch (error) {
                if ((error as CustomError).code) {
                    console.log((error as CustomError).code, (error as CustomError).message);
                } else {
                    console.log(error);
                }
                return;
            }
        } else {
            console.log('Set up basket.scss firstly.');
        }
    };

    const isInBasket = (item: ItemType): boolean => {
        return basketItems.some((basketItem) => basketItem.item.id === item.id);
    };

    const removeFromBasket = async (excludeItem: ItemType) => {
        try {
            if (localStorage.getItem('user') == 'null') {
                setShowLoginPopup(true);
                return;
            }
            const basketItem = basketItems.find((basketItem) => basketItem.item.id === excludeItem.id);
            if (!basketItem) {
                console.error(`No basket item found with item id ${excludeItem.id}`);
                return;
            }
            await fetchData('', `basketitem/${basketItem.id}`, 'DELETE', setShowLoginPopup);
            setBasketItems((currentBasket) => {
                const updatedBasket = currentBasket.filter((basketItem) => basketItem.item.id !== excludeItem.id);
                localStorage.setItem('basket_items', JSON.stringify(updatedBasket));
                return updatedBasket;
            });
        } catch (error) {
            if ((error as CustomError).code) {
                console.log((error as CustomError).code, (error as CustomError).message);
            } else {
                console.log(error);
            }
            return;
        }
    };

    const value = useMemo(() => ({currency, setCurrency}), [currency, setCurrency]);

    return (
        <OrderContext.Provider value={{order, setOrder}}>
            <AddressContext.Provider value={{address, setAddress, setAddressAndStore, updateAddressField}}>
                <LoginPopupContext.Provider value={{showLoginPopup, setShowLoginPopup}}>
                    <UserContext.Provider value={{user, setUser, setUserAndStore}}>
                        <BasketContext.Provider value={{basket, setBasket, setBasketAndStore}}>
                            <BasketItemContext.Provider
                                value={{
                                    basketItems,
                                    setBasketItems,
                                    setBasketItemsAndStore,
                                    setBasketItemAndStore,
                                    addToBasket,
                                    removeFromBasket,
                                    isInBasket
                                }}>
                                <CurrencyContext.Provider value={value}>
                                    <Router>
                                        <HelmetProvider context={helmetContext}>
                                            <ThemeProvider theme={theme}>
                                                <div className="App">
                                                    <HeaderComponent/>
                                                    <Routes>
                                                        <Route path="/" element={<HomeComponent/>}/>
                                                        <Route path="/success_order"
                                                            element={<SuccessOrderComponent/>}/>
                                                        <Route path="/checkout" element={<CheckoutComponent/>}/>
                                                        <Route path="/account" element={<AccountComponent/>}/>
                                                        <Route path="/account/order" element={<OrderComponent/>}/>
                                                        <Route path="/account/order/:id"
                                                            element={<OrderDetailsComponent/>}/>
                                                        <Route path="/:slug" element={<PageComponent/>}/>
                                                        <Route path="/item/:slug" element={<ItemComponent/>}/>
                                                    </Routes>
                                                    <FooterComponent/>
                                                </div>
                                            </ThemeProvider>
                                        </HelmetProvider>
                                    </Router>
                                </CurrencyContext.Provider>
                            </BasketItemContext.Provider>
                        </BasketContext.Provider>
                    </UserContext.Provider>
                </LoginPopupContext.Provider>
            </AddressContext.Provider>
        </OrderContext.Provider>
    );
}

export default App;
