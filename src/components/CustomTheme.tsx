import {createTheme} from '@mui/material/styles';

const CustomTheme = createTheme({
    palette: {
        primary: {
            main: '#78C59B',
            contrastText: '#fff'
        },
        secondary: {
            main: '#00617A',
            contrastText: '#fff'
        },
    }
});
CustomTheme.typography.h1 = {
    fontSize: '1rem',
    '@media (min-width:600px)': {
        fontSize: '1.5rem'
    },
    [CustomTheme.breakpoints.up('md')]: {
        fontSize: '2.4rem'
    }
};

export default CustomTheme;
