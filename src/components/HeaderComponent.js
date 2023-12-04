import * as React from 'react';
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
import {Link, useNavigate} from "react-router-dom";

interface
Props
{
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window ? : () => Window;
}

const drawerWidth = 240;

export default function HeaderComponent(props: Props) {
    const {window} = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navItems = [
        {id: 1, title: 'About', link: '/about'},
        {id: 2, title: 'Contact', link: '/contact'},
    ];

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
            <Typography variant="h6" sx={{my: 2}}>
                FOXY
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
                            FOXY
                        </Typography>
                    </Link>
                    <Box sx={{display: {xs: 'none', sm: 'block', marginLeft: 'auto'}}}>
                        {navItems.map(item => (
                            <Button component={Link} key={item.id} sx={{color: '#fff'}} to={item.link}>
                                {item.title}
                            </Button>
                        ))}
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
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}