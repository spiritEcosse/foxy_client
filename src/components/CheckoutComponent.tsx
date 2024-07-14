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
import {FinancialDetailsType, OrderType} from '../types';
import {UserContext} from './UserContext';
import {BasketContext} from './BasketContext';
import {OrderContext} from './OrderContext';
import GooglePayButton from '@google-pay/button-react';
import Box from '@mui/material/Box';

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

    useEffect(() => {
        const fetchFinancialDetails = async () => {
            try {
                const response = await fetchData('', 'financialdetails', 'GET');
                if (response.data.length) {
                    setFinancialDetails(response.data[0]);
                } else {
                    console.error('No financial details found');
                }
            } catch (error) {
                console.error('Failed to fetch financial details:', error);
            }
        };

        fetchFinancialDetails();
        // Update the button disabled state based on address fields
        const isDisabled = !address || !address.country_id || !address.city || !address.address || !address.zipcode;
        setIsButtonDisabled(isDisabled);
    }, [address, setFinancialDetails]);

    const googlePayConfig = {
        environment: 'TEST', // Use 'PRODUCTION' for real payments
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
            countryCode: address?.country.code || 'US',
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
                height: '100vh'
            }}>
                <p>Your basket is empty.</p>
                <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                    Return to Home Page
                </Button>
            </div>
        );
    }

    const createOrder = async () => {
        if (!address || !user || !basket) {
            console.error('Address, user or basket is not set');
            return;
        }

        let _address;
        if (address.id === 0) {
            _address = await fetchData('', 'address', 'POST', {
                address: address.address,
                country_id: address.country_id,
                city: address.city,
                zipcode: address.zipcode,
                user_id: user.id
            });
        } else {
            _address = await fetchData('', `address/${address.id}`, 'PUT', {
                address: address.address,
                country_id: address.country_id,
                city: address.city,
                zipcode: address.zipcode,
                user_id: user.id
            });
        }
        setAddressAndStore(_address);

        const items = basketItems.map((basketItem) => ({
            id: basketItem.id,
            item_id: basketItem.item.id,
            price: basketItem.item.price,
            basket_id: basket.id
        }));

        fetchData('', 'basketitem/items', 'PUT', {
            items: items
        });

        await fetchData('', 'order', 'POST', {
            basket_id: basket.id,
            total: total,
            total_ex_taxes: totalExTaxes,
            tax_rate: financialDetails.tax_rate,
            taxes: taxes,
            user_id: user.id,
            reference: 'ref',
            address_id: address.id
        }).then((data: OrderType) => {
            setOrder(data);
        });

        await fetchData('', `basket/${basket.id}`, 'PUT', {
            user_id: user.id,
            in_use: false
        }).then(() => {
            setBasketItemsAndStore([]);
            setBasketAndStore(null);
        });
        const _basket = await fetchData('', 'basket', 'POST', {user_id: user.id});
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
                                    <TableCell colSpan={6}>Taxes {financialDetails.tax_rate * 100}%</TableCell>
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
            <Box
                sx={{mt: 2, mb: 2}}
                style={{
                    pointerEvents: isButtonDisabled ? 'none' : 'auto',
                    opacity: isButtonDisabled ? 0.5 : 1
                }}>
                <GooglePayButton
                    environment="TEST"
                    paymentRequest={googlePayConfig}
                    onLoadPaymentData={onLoadPaymentData}
                    buttonColor="white"
                    buttonRadius="4"
                    buttonType="buy"
                />
            </Box>
        </div>
    );
};

export default CheckoutComponent;
