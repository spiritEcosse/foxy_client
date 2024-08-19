import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {fetchData} from '../utils';
import Pagination from '@mui/material/Pagination';
import {Button, Grid, PaginationItem, Paper, Popover, styled, Typography} from '@mui/material';
import {BasketItemType, OrderType} from '../types';
import Box from '@mui/material/Box';
import PopupState, {bindPopover, bindTrigger} from 'material-ui-popup-state';
import '../assets/basket.scss';
import Loading from './Loading';
import {StyledLink} from './CustomTheme';
import {useBasketItemContext} from '../hooks/useBasketItemContext';
import {useErrorContext} from '../hooks/useErrorContext';
import {useUserContext} from '../hooks/useUserContext';

const OrderCard = styled(Box)(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
    margin: theme.spacing(2, 0),
    borderRadius: theme.shape.borderRadius,
    border: '1px solid', // Add border if needed
    borderColor: theme.palette.divider, // Color of the border
}));

const OrderHeader = styled(Box)(({theme}) => ({
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const DeliveryBox = styled(Box)(({theme}) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const ButtonStack = styled('div')(({theme}) => ({
    flexDirection: 'row',
    gap: theme.spacing(2),
    display: 'flex',
}));

const BoldText = styled(Typography)({
    fontWeight: 'bold',
});

interface BasketItemCardProps {
    basketItem: BasketItemType;
}

const BasketItemCard: React.FC<BasketItemCardProps> = ({basketItem}) => {
    const {addToBasket, isInBasket} = useBasketItemContext();

    return (
        <Grid container alignItems="center" sx={{pb: 2}}>
            <Grid item sx={{width: '200px'}}>
                <div key={basketItem.item.id} className="basketItem"
                    style={{backgroundImage: `url(${basketItem.item.src}?twic=v1/output=preview`}}>
                    <Link to={`/item/${basketItem.item.slug}`}>
                        <img
                            data-twic-src={`image:${new URL(basketItem.item.src).pathname}`}
                            alt={basketItem.item.title}/>
                    </Link>
                </div>
            </Grid>
            <Grid item xs>
                <StyledLink to={`/item/${basketItem.item.slug}`}>
                    {basketItem.item.title}
                </StyledLink>
                <ButtonStack>
                    {!isInBasket(basketItem.item) && (
                        <Button variant="contained" color="primary" onClick={() => addToBasket(basketItem.item)}>
                            Buy it again
                        </Button>
                    )}
                    <Button variant="outlined" color="primary" href={`/item/${basketItem.item.slug}`}>
                        View your item
                    </Button>
                </ButtonStack>
            </Grid>
        </Grid>
    );
};

const OrderComponent = () => {
    const {user} = useUserContext();
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const limit = 27;
    const pageFromUrl = parseInt(query.get('page') ?? '1', 10);
    const [pageNumber, setPageNumber] = useState(1);
    const [countPages, setCountPages] = useState(1);
    const [orders, setOrders] = useState<OrderType[]>([]);
    const {setErrorMessage} = useErrorContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            const path = `order?user_id=${user.id}&page=${pageFromUrl}&limit=${limit}`;
            fetchData('', path, 'GET', {}, true)
                .then(data => {
                    setOrders(data.data);
                    setCountPages(data ? Math.ceil(data.total / limit) : 1);
                    setPageNumber(data ? data._page : 1);
                }).catch(({code, message}) => {
                    setErrorMessage(`Error fetching data: ${message}, code: ${code}`);
                }).finally(() => {
                    setLoading(false);
                });
        }
    }, [user, navigate, pageFromUrl, limit, setErrorMessage]);

    if (loading) {
        return <Loading/>;
    }

    if (orders.length === 0) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '470px'
            }}>
                <p>You don't have orders.</p>
                <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                    Continue Shopping
                </Button>
            </div>
        );
    }

    return (
        <div style={{padding: '20px', maxWidth: '100%'}}>
            <h1>Orders</h1>
            <Paper style={{padding: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                    <Pagination
                        page={pageNumber}
                        color="primary"
                        variant="outlined"
                        count={countPages}
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )}
                    />
                </div>
                {orders.map((order: OrderType) => (
                    <OrderCard key={order.id}>
                        <OrderHeader>
                            <Grid container spacing={2}>
                                <Grid item xs={7}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <BoldText>Order {order.status}</BoldText>
                                            <Typography
                                                variant="body2">{new Date(order.created_at).toLocaleDateString()}</Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <BoldText>Total</BoldText>
                                            <Typography variant="body2">{order.total.toLocaleString(undefined, {
                                                style: 'currency',
                                                currency: 'EUR',
                                            })}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <BoldText>Ship to</BoldText>
                                            <PopupState variant="popover" popupId={`demo-popup-popover-${order.id}`}
                                                disableAutoFocus={true} parentPopupState={null}>
                                                {(popupState) => (
                                                    <React.Fragment>
                                                        <Button variant="outlined" {...bindTrigger(popupState)}>
                                                            {order.user.first_name} {order.user.last_name}
                                                        </Button>
                                                        <Popover
                                                            sx={(theme) => ({
                                                                '.MuiPaper-root': {
                                                                    borderRadius: theme.shape.borderRadius, // Use theme's borderRadius
                                                                    border: '1px solid', // Use a solid border
                                                                    borderColor: theme.palette.divider, // Use theme's borderColor for the Popover's border
                                                                }
                                                            })}
                                                            {...bindPopover(popupState)}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'center',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'center',
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    p: 2,
                                                                }}
                                                            >
                                                                {order.address.country.title}<br/>
                                                                {order.address.city}<br/>
                                                                {order.address.zipcode}<br/>
                                                                {order.address.address}
                                                            </Typography>
                                                        </Popover>
                                                    </React.Fragment>
                                                )}
                                            </PopupState>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={5}>
                                    <Grid container spacing={2} justifyContent="flex-end">
                                        <Grid item>
                                            <Typography variant="body2" dir="ltr">Order # {order.reference}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </OrderHeader>

                        <DeliveryBox>
                            <Grid container spacing={2}>
                                <Grid item xs={9}>
                                    {order.basket_items.map((basketItem: BasketItemType) => (
                                        <BasketItemCard key={basketItem.id} basketItem={basketItem}/>
                                    ))}
                                </Grid>
                            </Grid>
                        </DeliveryBox>
                    </OrderCard>
                ))}
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                    <Pagination
                        page={pageNumber}
                        color="primary"
                        variant="outlined"
                        count={countPages}
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )}
                    />
                </div>
            </Paper>
        </div>
    );
};

export default OrderComponent;
