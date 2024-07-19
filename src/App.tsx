import './App.css';
import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import ItemComponent from './components/ItemComponent';
import FooterComponent from './components/FooterComponent';
import {HelmetProvider} from 'react-helmet-async';
import HomeComponent from './components/HomeComponent';
import PageComponent from './components/PageComponent';
import {ThemeProvider} from '@mui/material/styles';
import theme from './components/CustomTheme';
import {installTwicPics} from '@twicpics/components/react';
import {CurrencyContext} from './components/CurrencyContext';
import AccountComponent from './components/AccountComponent';
import OrderComponent from './components/OrderComponent';
import OrderDetailsComponent from './components/OrderDetailsComponent';
import {AddressType, BasketItemType, BasketType, ItemType, OrderType, UserType} from './types';
import {BasketContext} from './components/BasketContext';
import {UserContext} from './components/UserContext';
import {LoginPopupContext} from './components/LoginPopupContext';
import {fetchData} from './utils';
import {BasketItemContext} from './components/BasketItemContext';
import CheckoutComponent from './components/CheckoutComponent';
import {AddressContext} from './components/AddressContext';
import {OrderContext} from './components/OrderContext';
import SuccessOrderComponent from './components/SuccessOrderComponent';
import {useError} from './components/ErrorContext';
import {Slide, Snackbar} from '@mui/material';

const helmetContext = {};
const domain = `https://${import.meta.env.VITE_APP_TWIC_PICS_NAME}.twic.pics`;

installTwicPics({
    // domain is mandatory
    domain
});

function App() {
    const [currency, setCurrency] = useState(localStorage.getItem('currency') ?? 'EUR');
    const [basket, setBasket] = useState<BasketType | null>(JSON.parse(localStorage.getItem('basket') || 'null'));
    const [address, setAddress] = useState<AddressType | null>(JSON.parse(localStorage.getItem('address') || 'null'));
    const [basketItems, setBasketItems] = useState<BasketItemType[]>(JSON.parse(localStorage.getItem('basket_items') || '[]'));
    const [user, setUser] = useState<UserType | null>(JSON.parse(localStorage.getItem('user') || 'null'));
    const [order, setOrder] = useState<OrderType | null>(null);
    const [showLoginPopup, setShowLoginPopup] = useState(JSON.parse(localStorage.getItem('showLoginPopup') || 'false'));
    const [auth, setAuth] = useState(localStorage.getItem('auth'));
    const {errorMessage, setErrorMessage} = useError();

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorMessage(''); // Clear the error message when Snackbar is closed
    };

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
    };

    const setShowLoginPopupAndStore = (value: boolean) => {
        setShowLoginPopup(value);
        localStorage.setItem('showLoginPopup', JSON.stringify(value));
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
        const handleStorageChange = () => {
            setAuth(localStorage.getItem('auth'));
            setUserAndStore(null);
            setAddressAndStore(null);
            setBasketAndStore(null);
            setOrder(null);
            setBasketItemsAndStore([]);
            setShowLoginPopup(JSON.parse(localStorage.getItem('showLoginPopup') || 'false'));
            localStorage.removeItem('user');
            localStorage.removeItem('basket');
            localStorage.removeItem('basket_items');
            localStorage.removeItem('address');
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup the event listener
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [currency, auth]);

    const addToBasket = async (item: ItemType) => {
        if (!basket) {
            setShowLoginPopupAndStore(true);
            return;
        }

        try {
            const params = {
                basket_id: basket.id,
                item_id: item.id,
            };
            const basketItem = await fetchData('', 'basketitem', 'POST', params, true);
            setBasketItemAndStore(basketItem);
        } catch (error) {
            setErrorMessage(`Error adding item to basket: ${error}`);
        }
    };

    const isInBasket = (item: ItemType): boolean => {
        return basketItems.some((basketItem) => basketItem.item.id === item.id);
    };

    const removeFromBasket = async (excludeItem: ItemType) => {
        try {
            if (!basketItems) {
                setShowLoginPopupAndStore(true);
                return;
            }
            const basketItem = basketItems.find((basketItem) => basketItem.item.id === excludeItem.id);
            if (!basketItem) {
                console.error(`No basket item found with item id ${excludeItem.id}`);
                setErrorMessage('Error removing item from basket');
                return;
            }
            await fetchData('', `basketitem/${basketItem.id}`, 'DELETE', {}, true);
            setBasketItems((currentBasket) => {
                const updatedBasket = currentBasket.filter((basketItem) => basketItem.item.id !== excludeItem.id);
                localStorage.setItem('basket_items', JSON.stringify(updatedBasket));
                return updatedBasket;
            });
        } catch (error) {
            setErrorMessage(`Error removing item from basket: ${error}`);
        }
    };

    const value = useMemo(() => ({currency, setCurrency}), [currency, setCurrency]);

    return (
        <OrderContext.Provider value={{order, setOrder}}>
            <AddressContext.Provider value={{address, setAddress, setAddressAndStore, updateAddressField}}>
                <LoginPopupContext.Provider value={{showLoginPopup, setShowLoginPopup, setShowLoginPopupAndStore}}>
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
                                    <Snackbar
                                        open={!!errorMessage}
                                        autoHideDuration={6000}
                                        onClose={handleClose}
                                        message={errorMessage}
                                        TransitionComponent={(props) => <Slide {...props} direction="up"/>}
                                    />
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
