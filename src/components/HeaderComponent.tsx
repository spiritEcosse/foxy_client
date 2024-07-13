import * as React from 'react';
import {useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';
import {CurrencyContext} from './CurrencyContext';
import {UserContext} from './UserContext';
import GoogleLoginComponent from './GoogleLoginComponent';
import {styled} from '@mui/material/styles';
import Badge, {BadgeProps} from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {BasketItemContext} from './BasketItemContext';
import {BasketContext} from './BasketContext';
import {AddressContext} from './AddressContext';
import {OrderContext} from './OrderContext';
import EuroIcon from '@mui/icons-material/Euro';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LogoutIcon from '@mui/icons-material/Logout';
import {googleLogout} from '@react-oauth/google';

interface HeaderComponentProps {
    window?: () => Window;
}

const StyledBadge = styled(Badge)<BadgeProps>(({theme}) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

export default function HeaderComponent(props: Readonly<HeaderComponentProps>) {
    const {window} = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navItems = [
        {id: 1, title: 'About', link: '/page/about'},
        {id: 2, title: 'Contact', link: '/page/contact'}
    ];
    const {basketItems, removeFromBasket, setBasketItemsAndStore} = useContext(BasketItemContext);
    const {setCurrency} = useContext(CurrencyContext);
    const {user, setUserAndStore} = useContext(UserContext);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };
    const {basket, setBasketAndStore} = useContext(BasketContext);
    const {address, setAddressAndStore} = useContext(AddressContext);
    const {order, setOrder} = useContext(OrderContext);

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
            <Typography variant="h6" sx={{my: 2}}>
                {import.meta.env.PROJECT_NAME}
            </Typography>
            <Divider/>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.id} disablePadding>
                        <ListItemButton sx={{textAlign: 'center'}} component={Link} to={item.link}>
                            <ListItemText primary={item.title}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar component="nav" position="static">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{flexGrow: 1, display: {sm: 'block'}}}
                        >
                            {import.meta.env.PROJECT_NAME}
                        </Typography>
                    </Link>
                    <Box sx={{display: {sm: 'flex', marginLeft: 'auto'}}}>
                        {navItems.map(item => (
                            <Button component={Link} key={item.id} sx={{color: '#fff'}}
                                to={item.link}>
                                {item.title}
                            </Button>
                        ))}
                        <IconButton
                            size="small"
                            edge="end"
                            aria-label="usd"
                            // aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={() => setCurrency('USD')}
                            color="inherit"
                        >
                            <AttachMoneyIcon/>
                        </IconButton>
                        <IconButton
                            size="small"
                            edge="end"
                            aria-label="eur"
                            // aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={() => setCurrency('EUR')}
                            color="inherit"
                        >
                            <EuroIcon/>
                        </IconButton>
                        <Link to="checkout">
                            <IconButton aria-label="cart" color="inherit" sx={{color: 'white'}}>
                                <Badge badgeContent={basketItems.length}>
                                    <ShoppingCartIcon/>
                                </Badge>
                            </IconButton>
                        </Link>
                        {(localStorage.getItem('auth') === '' || localStorage.getItem('user') == 'null' || !user) ? (
                            <GoogleLoginComponent/>
                        ) : (
                            <>
                                <IconButton
                                    size="small"
                                    edge="end"
                                    aria-label="logout"
                                    aria-haspopup="true"
                                    onClick={() => {
                                        localStorage.setItem('auth', '');
                                        setUserAndStore(null);
                                        setAddressAndStore(null);
                                        setBasketAndStore(null);
                                        setOrder(null);
                                        setBasketItemsAndStore([]);
                                        googleLogout();
                                    }}
                                    color="inherit"
                                >
                                    <LogoutIcon/>
                                </IconButton>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: 240}
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}
