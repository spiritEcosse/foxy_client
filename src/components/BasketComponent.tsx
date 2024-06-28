import React, {useContext} from 'react';
import {BasketContext} from './BasketContext';

const BasketComponent = () => {
    const {basket, basket_item, removeFromBasket} = useContext(BasketContext);

    return (
        <div>
            <h2>Basket</h2>
            {basket_item.map((item) => (
                <div key={item.id}>
                    <p>{item.title}</p>
                    <button onClick={() => removeFromBasket(item)}>Remove from cart</button>
                </div>
            ))}
        </div>
    );
};

export default BasketComponent;
