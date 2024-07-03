import React, {useContext, useState} from 'react';
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
import {AddressType} from '../types';
import {UserContext} from './UserContext';
import {BasketContext} from './BasketContext';

const CheckoutComponent = () => {
    const {basketItems, removeFromBasket} = useContext(BasketItemContext);
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
    const {basket, setBasket} = useContext(BasketContext);

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
            }).catch((error) => {
                console.error('Error:', error);
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
            }).catch((error) => {
                console.error('Error:', error);
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
        }).catch((error) => {
            console.error('Error:', error);
        });

        // fetchData('', 'order', 'POST', setShowLoginPopup, {
        //     address_id: data.data.id,
        //     total: total,
        //     items: basketItems.map((basketItem) => ({
        //         item_id: basketItem.item.id,
        //         quantity: basketItem.quantity,
        //     })),
        // }).then(() => {
        //     deleteAllItems();
        // });
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
                                                onClick={() => removeFromBasket(basketItem.item)}>
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
            <Button
                type="submit"
                sx={{mt: 2, mb: 2}}
                variant="contained"
                color="primary"
                onClick={createOrder}
                disabled={!address || !address.country_id || !address.city || !address.address || !address.zipcode}
            >
                Create an order
            </Button>
        </div>
    );
};

export default CheckoutComponent;
