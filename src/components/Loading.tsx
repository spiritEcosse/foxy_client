import React from 'react';
import {CircularProgress} from '@mui/material';

export default function Loading() {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh'}}>
            <CircularProgress/>
        </div>
    );
}
