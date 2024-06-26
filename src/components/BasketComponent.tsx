import React, { useContext } from 'react';
import { BasketContext } from './BasketContext';

const BasketComponent = () => {
    const { basket, removeFromBasket } = useContext(BasketContext);

    return (
        <div>
            <h2>Basket</h2>
            {basket.map((item) => (
                <div key={item.id}>
                    <p>{item.title}</p>
                    <button onClick={() => removeFromBasket(item.id)}>Remove from cart</button>
                </div>
            ))}
        </div>
    );
};

export default BasketComponent;
