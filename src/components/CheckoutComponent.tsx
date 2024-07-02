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
    Autocomplete,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {fetchData} from '../utils';
import {CountryType} from '../types';
import {AddressContext} from './AddressContext';

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
    const {address, setAddress, setAddressAndStore} = useContext(AddressContext);
    const [countries, setCountries] = useState<CountryType[]>([]);
    const [countriesLoaded, setCountriesLoaded] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const loadCountries = () => {
        if (!countriesLoaded) {
            fetchData('', 'country?limit=200', 'GET', setShowLoginPopup)
                .then(data => {
                    setCountries(data.data);
                    setCountriesLoaded(true);
                })
                .catch(error => console.error('Error:', error));
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

    const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        // Handle form submission here
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

            <Accordion expanded={expanded === 'addressPanel'} onChange={(event, isExpanded) => {
                handleChange('addressPanel')(event, isExpanded);
                if (isExpanded) {
                    loadCountries();
                }
            }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="addressPanel-content"
                    id="addressPanel-header"
                >
                    <Typography sx={{width: '33%', flexShrink: 0}}>
                        Address
                    </Typography>
                    <Typography
                        sx={{color: 'text.secondary'}}>{address ? `Your address is ${address.country.title}` : 'Point your address, please'}.</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Autocomplete
                                id="country-search"
                                options={countries}
                                renderInput={(params) => <TextField {...params} required label="Country"
                                    variant="outlined"/>}
                                getOptionLabel={(option: CountryType) => option.title}
                                style={{width: 300}}
                            />
                            <TextField
                                name="address"
                                label="Address"
                                required
                                value={address?.address}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="city"
                                label="City"
                                value={address?.city}
                                required
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="zipcode"
                                label="Zipcode"
                                value={address?.zipcode}
                                fullWidth
                                required
                                margin="normal"
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </form>
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default CheckoutComponent;
