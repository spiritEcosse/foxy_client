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
    Alert,
    ButtonGroup,
    Checkbox,
    Grid,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddressForm from './AddressForm';
import {AddressContext} from './AddressContext';
import {fetchData} from '../utils';
import {FinancialDetailsType} from '../types';
import {UserContext} from './UserContext';
import {BasketContext} from './BasketContext';
import {OrderContext} from './OrderContext';
import GooglePayButton from '@google-pay/button-react';
import Box from '@mui/material/Box';
import {useError} from './ErrorContext';
import Divider from '@mui/material/Divider';
import Loading from './Loading';

const CheckoutComponent = () => {
    const {basketItems, setBasketItemsAndStore, removeFromBasket} = useContext(BasketItemContext);
    const [checked, setChecked] = React.useState<number[]>([]);
    const navigate = useNavigate();
    const totalExTaxes = basketItems.reduce((total, item) => total + item.item.price * item.quantity, 0);
    const [financialDetails, setFinancialDetails] = useState<FinancialDetailsType>({} as FinancialDetailsType);
    const taxes = Math.round(totalExTaxes * (financialDetails.tax_rate || 0) * 100) / 100;
    const total = totalExTaxes + taxes;
    const roundedTotal = Math.round(total * 100) / 100;
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const {address, setAddressAndStore} = useContext(AddressContext);
    const {user, setUserAndStore} = useContext(UserContext);
    const {order, setOrder} = useContext(OrderContext);
    const {basket, setBasket, setBasketAndStore} = useContext(BasketContext);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const {setErrorMessage} = useError();
    const [previousAddress, setPreviousAddress] = useState(address);
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        const fetchFinancialDetails = async () => {
            try {
                const response = await fetchData('', 'financialdetails', 'GET', {}, true);
                if (response.data.length) {
                    setFinancialDetails(response.data[0]);
                } else {
                    setErrorMessage('No financial details found. You cannot proceed with the order.');
                }
            } catch (error) {
                setErrorMessage(`Failed to fetch financial details: ${error}`);
            }
        };

        fetchFinancialDetails();
    }, []);

    useEffect(() => {
        const isDisabled = !address || !address.country_id || !address.city || !address.address || !address.zipcode;
        setIsButtonDisabled(isDisabled);
    }, [address]);

    const googlePayConfig = {
        environment: import.meta.env.VITE_APP_GOOGLE_PAY_ENV,
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
            {
                type: 'CARD',
                parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
                },
                tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                        gateway: financialDetails.gateway,
                        gatewayMerchantId: financialDetails.gateway_merchant_id
                    },
                },
            },
        ],
        merchantInfo: {
            merchantId: financialDetails.merchant_id,
            merchantName: financialDetails.merchant_name
        },
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: `${roundedTotal}`,
            currencyCode: 'EUR',
            countryCode: address?.country.code || 'ES',
        },
    };

    const onLoadPaymentData = (paymentData: any) => {
        createOrder();
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
                height: '470px'
            }}>
                <p>Your cart is empty.</p>
                <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                    Continue Shopping
                </Button>
            </div>
        );
    }

    const hasAddressChanged = () => {
        return address && previousAddress && (
            address.country_id !== previousAddress.country_id ||
            address.city !== previousAddress.city ||
            address.address !== previousAddress.address ||
            address.zipcode !== previousAddress.zipcode
        );
    };

    const createOrder = async () => {
        if (!address || !user || !basket) {
            setErrorMessage('Address, user or basket is not set');
            return;
        }

        setPaying(true);

        let currentAddressId = address.id;
        try {
            // How to detect if fields in address has changed and then create a new address?
            if (hasAddressChanged() || !address.id) {
                const _address = await fetchData('', 'address', 'POST', {
                    address: address.address,
                    country_id: address.country_id,
                    city: address.city,
                    zipcode: address.zipcode,
                    user_id: user.id
                }, true);
                setAddressAndStore(_address);
                currentAddressId = _address.id;
            }

            const items = basketItems.map((basketItem) => ({
                id: basketItem.id,
                item_id: basketItem.item.id,
                price: basketItem.item.price,
                basket_id: basket.id
            }));

            await fetchData('', 'basketitem/items', 'PUT', {
                items: items
            }, true);

            const createdOrder = await fetchData('', 'order', 'POST', {
                basket_id: basket.id,
                total: total,
                total_ex_taxes: totalExTaxes,
                tax_rate: financialDetails.tax_rate,
                taxes: taxes,
                user_id: user.id,
                address_id: currentAddressId
            });
            setOrder(createdOrder);

            await fetchData('', `basket/${basket.id}`, 'PUT', {
                user_id: user.id,
                in_use: false
            });
            const _basket = await fetchData('', 'basket', 'POST', {user_id: user.id}, true);
            setBasketAndStore(_basket);
            setBasketItemsAndStore([]);
            navigate('/success_order');
        } catch (error) {
            setErrorMessage(`Failed to create order: ${error}`);
        } finally {
            setPaying(false);
        }
    };

    return (
        <div style={{padding: '20px'}}>
            <Alert severity="info">
                Please be advised that this action is currently in the testing phase, which will entail placing a test
                order.</Alert>
            <h1>Checkout</h1>
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
                        price is {roundedTotal.toLocaleString(undefined, {
                        style: 'currency',
                        currency: 'EUR'
                    })}.</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Button variant="contained" color="secondary" onClick={deleteCheckedItems}>
                            Delete Checked Items
                        </Button>
                        <Button variant="contained" color="secondary" onClick={deleteAllItems}>
                            Delete All Items
                        </Button>
                    </ButtonGroup>
                    <Grid container spacing={2} alignItems="center" sx={{mt: 2, mb: 2}}>
                        <Grid item xs={12}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={1}></Grid>
                                <Grid item xs={1}>Delete</Grid>
                                <Grid item xs={2}>Image</Grid>
                                <Grid item xs={2}>Title</Grid>
                                <Grid item xs={2}>Price</Grid>
                                <Grid item xs={2}>Quantity</Grid>
                                <Grid item xs={2}>Total</Grid>
                            </Grid>
                            <Divider/>
                        </Grid>

                        {basketItems.map((basketItem, index) => (
                            <Grid item xs={12} key={basketItem.id}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={1}>
                                        <Checkbox
                                            checked={checked.indexOf(index) !== -1}
                                            onChange={handleCheck(index)}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton edge="end" aria-label="delete"
                                            onClick={() => removeFromBasket(basketItem.item)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <div className="basketItem" key={basketItem.item.id}
                                            style={{backgroundImage: `url(${basketItem.item.src}?twic=v1/output=preview)`}}>
                                            <Link to={`/item/${basketItem.item.slug}`}>
                                                <img
                                                    data-twic-src={`image:${new URL(basketItem.item.src).pathname}?twic=v1/cover=100x100`}
                                                    alt={basketItem.item.title}/>
                                            </Link>
                                        </div>
                                    </Grid>
                                    <Grid item xs={2}>{basketItem.item.title}</Grid>
                                    <Grid item xs={2}>
                                        {`${basketItem.item.price.toLocaleString(undefined, {
                                            style: 'currency',
                                            currency: 'EUR'
                                        })}`}
                                    </Grid>
                                    <Grid item xs={2}>{basketItem.quantity}</Grid>
                                    <Grid item xs={2}>
                                        {`${(basketItem.item.price * basketItem.quantity).toLocaleString(undefined, {
                                            style: 'currency',
                                            currency: 'EUR'
                                        })}`}
                                    </Grid>
                                </Grid>
                                <Divider/>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={10}>Total Excluding Taxes</Grid>
                                <Grid item xs={2}>
                                    {`${totalExTaxes.toLocaleString(undefined, {style: 'currency', currency: 'EUR'})}`}
                                </Grid>
                            </Grid>
                            <Divider/>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={10}>Taxes {financialDetails.tax_rate * 100}%</Grid>
                                <Grid item xs={2}>
                                    {`${taxes.toLocaleString(undefined, {style: 'currency', currency: 'EUR'})}`}
                                </Grid>
                            </Grid>
                            <Divider/>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={10}>Total</Grid>
                                <Grid item xs={2}>
                                    {`${roundedTotal.toLocaleString(undefined, {style: 'currency', currency: 'EUR'})}`}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
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
            <Box
                sx={{mt: 2, mb: 2}}
                style={{
                    pointerEvents: isButtonDisabled ? 'none' : 'auto',
                    opacity: isButtonDisabled ? 0.5 : 1
                }}>
                {
                    paying ? (
                        <Loading/>
                    ) : (
                        <GooglePayButton
                            paymentRequest={googlePayConfig}
                            onLoadPaymentData={onLoadPaymentData}
                            buttonRadius="4"
                            buttonType="buy"
                        />
                    )
                }
            </Box>
        </div>
    );
};

export default CheckoutComponent;
