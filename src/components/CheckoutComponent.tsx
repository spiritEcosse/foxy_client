import React, {useContext, useEffect, useState} from 'react';
import {BasketItemContext} from './BasketItemContext';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import {Link, useNavigate} from 'react-router-dom';
import '../assets/basket.scss';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddressForm from './AddressForm';
import {AddressContext} from './AddressContext';
import {fetchData} from '../utils';
import {AddressType, OrderType} from '../types';
import {UserContext} from './UserContext';
import {BasketContext} from './BasketContext';
import {OrderContext} from './OrderContext';

declare global {
    interface Window {
        google: any;
    }
}

const CheckoutComponent = () => {
    const {basketItems, setBasketItemsAndStore, removeFromBasket} = useContext(BasketItemContext);
    const [checked, setChecked] = React.useState<number[]>([]);
    const navigate = useNavigate();
    const totalExTaxes = basketItems.reduce((total, item) => total + item.item.price * item.quantity, 0);
    const taxRate = 0.2; // 20%
    const taxes = Math.round(totalExTaxes * taxRate * 100) / 100;
    const deliveryFees = 100;
    const total = totalExTaxes + taxes + deliveryFees;
    const roundedTotal = Math.round(total * 100) / 100;
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const {address, setAddressAndStore} = useContext(AddressContext);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const {user, setUserAndStore} = useContext(UserContext);
    const {order, setOrder} = useContext(OrderContext);
    const {basket, setBasket, setBasketAndStore} = useContext(BasketContext);
    const [googlePayClient, setGooglePayClient] = useState<any>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://pay.google.com/gp/p/js/pay.js';
        script.async = true;
        script.onload = () => initializeGooglePay();
        document.body.appendChild(script);
    }, []);

    const initializeGooglePay = () => {
        const client = new window.google.payments.api.PaymentsClient({environment: 'TEST'});
        const button = client.createButton({
            onClick: () => handleGooglePay(),
        });

        document.getElementById('google-pay-button').appendChild(button);
        setGooglePayClient(client);
    };

    const handleGooglePay = async () => {
        const paymentDataRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
                {
                    type: 'CARD',
                    parameters: {
                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                        allowedCardNetworks: ['MASTERCARD', 'VISA'],
                    },
                    tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                            gateway: 'example',
                            gatewayMerchantId: 'exampleGatewayMerchantId',
                        },
                    },
                },
            ],
            merchantInfo: {
                merchantId: 'your-merchant-id',
                merchantName: 'Example Merchant',
            },
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPriceLabel: 'Total',
                totalPrice: '100.00',
                currencyCode: 'USD',
                countryCode: 'US',
            },
        };

        try {
            const paymentData = await googlePayClient.loadPaymentData(paymentDataRequest);
            console.log('Payment successful', paymentData);
            // Handle the successful payment here (e.g., create an order, navigate to success page)
        } catch (error) {
            console.error('Payment failed', error);
        }
    };

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const handleCheck = (index: number) => () => {
        const currentIndex = checked.indexOf(index);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(index);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const deleteCheckedItems = () => {
        checked.forEach((index) => {
            removeFromBasket(basketItems[index].item);
        });
        setChecked([]);
    };

    const deleteAllItems = () => {
        basketItems.forEach((basketItem) => {
            removeFromBasket(basketItem.item);
        });
    };

    if (basketItems.length === 0) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <p>Your basket is empty.</p>
                <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                    Return to Home Page
                </Button>
            </div>
        );
    }

    const createOrder = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!address || !user || !basket) {
            console.error('Address, user or basket is not set');
            return;
        }

        if (address.id === 0) {
            await fetchData('', 'address', 'POST', setShowLoginPopup, {
                address: address.address,
                country_id: address.country_id,
                city: address.city,
                zipcode: address.zipcode,
                user_id: user.id
            }).then((data: AddressType) => {
                setAddressAndStore(data);
            });
        } else {
            await fetchData('', `address/${address.id}`, 'PUT', setShowLoginPopup, {
                address: address.address,
                country_id: address.country_id,
                city: address.city,
                zipcode: address.zipcode,
                user_id: user.id
            }).then((data: AddressType) => {
                setAddressAndStore(data);
            });
        }

        const items = basketItems.map((basketItem) => ({
            id: basketItem.id,
            item_id: basketItem.item.id,
            price: basketItem.item.price,
            basket_id: basket.id
        }));

        fetchData('', 'basketitem/items', 'PUT', setShowLoginPopup, {
            items: items
        });

        await fetchData('', 'order', 'POST', setShowLoginPopup, {
            basket_id: basket.id,
            total: total,
            total_ex_taxes: totalExTaxes,
            delivery_fees: deliveryFees,
            tax_rate: taxRate,
            taxes: taxes,
            user_id: user.id,
            reference: 'ref',
            address_id: address.id
        }).then((data: OrderType) => {
            setOrder(data);
        });

        await fetchData('', `basket/${basket.id}`, 'PUT', setShowLoginPopup, {
            user_id: user.id,
            in_use: false
        }).then(() => {
            setBasketItemsAndStore([]);
            setBasketAndStore(null);
        });
        const _basket = await fetchData('', 'basket', 'POST', setShowLoginPopup, {user_id: user.id});
        setBasketAndStore(_basket);
        navigate('/success_order');
    };

    return (
        <div>
            <Accordion expanded={expanded === 'basketItemsPanel'} onChange={handleChange('basketItemsPanel')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="basketItemsPanel-content"
                    id="basketItemsPanel-header"
                >
                    <Typography sx={{width: '33%', flexShrink: 0}}>
                        Cart
                    </Typography>
                    <Typography sx={{color: 'text.secondary'}}>You have count of items: {basketItems.length}. Total
                        price
                        is {`${roundedTotal} €`}.</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Button variant="contained" color="secondary" onClick={deleteCheckedItems}>
                        Delete Checked Items
                    </Button>
                    <Button variant="contained" color="secondary" onClick={deleteAllItems}>
                        Delete All Items
                    </Button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Delete</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {basketItems.map((basketItem, index) => (
                                    <TableRow key={basketItem.id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={checked.indexOf(index) !== -1}
                                                onChange={handleCheck(index)}/>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton edge="end" aria-label="delete"
                                                onClick={() => removeFromBasket(basketItem.item)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <div className="basketItem" key={basketItem.item.id}
                                                style={{backgroundImage: `url(${basketItem.item.src}?twic=v1/output=preview`}}>
                                                <Link to={`/item/${basketItem.item.slug}`}>
                                                    <img
                                                        data-twic-src={`image:${new URL(basketItem.item.src).pathname}?twic=v1/cover=100x100`}
                                                        alt={basketItem.item.title}/>
                                                </Link>
                                            </div>
                                        </TableCell>
                                        <TableCell>{basketItem.item.title}</TableCell>
                                        <TableCell>{`${basketItem.item.price} €`}</TableCell>
                                        <TableCell>{basketItem.quantity}</TableCell>
                                        <TableCell>{`${basketItem.item.price * basketItem.quantity} €`}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={6}>Total Excluding Taxes</TableCell>
                                    <TableCell>{`${totalExTaxes} €`}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={6}>Delivery Fees</TableCell>
                                    <TableCell>{`${deliveryFees} €`}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={6}>Taxes {taxRate * 100}%</TableCell>
                                    <TableCell>{`${taxes} €`}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={6}>Total</TableCell>
                                    <TableCell>{`${roundedTotal} €`}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'addressPanel'} onChange={handleChange('addressPanel')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="addressPanel-content"
                    id="addressPanel-header"
                >
                    <Typography sx={{width: '33%', flexShrink: 0}}>
                        Address
                    </Typography>
                    <Typography
                        sx={{color: 'text.secondary'}}>{address ? `Your country: ${address.country.title}, city: ${address.city}, address: ${address.address}, zipcode: ${address.zipcode}` : 'Point your address, please'}.</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <AddressForm/>
                </AccordionDetails>
            </Accordion>
            <div id="google-pay-button"></div>
            <Button
                type="submit"
                sx={{mt: 2, mb: 2}}
                variant="contained"
                color="primary"
                onClick={(event) => createOrder(event)}
                disabled={!address || !address.country_id || !address.city || !address.address || !address.zipcode}
            >
                Create an order
            </Button>
        </div>
    );
};

export default CheckoutComponent;
