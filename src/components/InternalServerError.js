import React from 'react';
import {Button} from '@mui/material';

const InternalServerError = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Internal Server Error</h1>
            <p style={styles.message}>Sorry, something went wrong. Please try again later.</p>
            <Button variant="contained" component="a" href="/">Back Home</Button>
        </div>
    )
};

const styles = {
    container: {
        textAlign: 'center',
        marginTop: '50px',
    },
    image: {
        width: '300px', // Adjust the size based on your image dimensions
    },
    heading: {
        fontSize: '24px',
        marginTop: '20px',
    },
    message: {
        fontSize: '16px',
        marginTop: '10px',
    },
};

export default InternalServerError;
