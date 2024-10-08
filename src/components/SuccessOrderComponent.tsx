import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useOrderContext } from '../hooks/useOrderContext';

const SuccessOrderComponent: React.FC = () => {
    const { order } = useOrderContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!order) {
            navigate('/');
        }
    }, [order, navigate]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '20px',
            }}
        >
            <h2>Order Success</h2>
            {order && (
                <p>
                    Your order with ID: {order.reference} has been successfully
                    placed.
                </p>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
            >
                Continue Shopping
            </Button>
        </div>
    );
};

export default SuccessOrderComponent;
