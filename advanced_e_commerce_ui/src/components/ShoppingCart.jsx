import { useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, checkout } from '../features/cart/cartSlice';
import { Button, ListGroup } from 'react-bootstrap';
import { useQueries } from '@tanstack/react-query';

// Memoization => caching the result of an expensive function call and returning the cached result if the same inputs occur
// useMemo => Store the result and recompute if specific values change
// useCallback => Helps to make sure our callback function remains the same and DOES NOT rerender unless a dependency changes
// useQueries => provide a list of ids and api call, and it will make multiple simultanious API calls

const ShoppingCart = () => {
    const cart = useSelector((state) => state.cart); //gets the state of the cart
    const cartItemIds = Object.keys(cart.items); // gets all the keys for items in cart
    const dispatch = useDispatch(); 
    // references actions in cartSlice, allows actions to be used in component
    const handleAddItem = useCallback((id) => dispatch(addItem({ id })), [dispatch]);
    const handleRemoveItem = useCallback((id) => dispatch(removeItem({ id })), [dispatch]);
    const handleCheckout = useCallback(() => dispatch(checkout()), [dispatch]);

    useEffect(() => {
        sessionStorage.setItem('cartItems', JSON.stringify(cart.items));
    }, [cart.items]); // every time cart.items changes, stores in sessionStorage as 'cartItems'. NOTE: wipes when session ends

    const productQueries = useQueries({
        queries: cartItemIds.map(id => ({
            queryKey: ['products', id],
            queryFn: () => fetch(`https://fakestoreapi.com/products/${id}`).then(res => res.json())
        }))
    });

    // Function to get product name by ID
    const getProductName = useCallback((id) => {
        // Find the index of the id in your original cartItemIds array
        const index = cartItemIds.findIndex(itemId => itemId === id);
        // Use this index to access the corresponding query result
        const productQuery = productQueries[index];
        return productQuery?.data?.title || 'Unknown Product';
    }, [productQueries, cartItemIds]);

    // Memoizing product names
    const productNames = useMemo(() =>
        cartItemIds.reduce((acc, id) => ({ // runs function and returns accumulation of results
            ...acc,
        [id]: getProductName(id)
        }), {}), // {} = starting value for acc
    [cartItemIds, getProductName]); // only recomputes result if cartItemIds or getProductName change
    
    // Memoize total price calculation
    const totalPrice = useMemo(() => {
        return cartItemIds.reduce((total, id) => {
            // find product query result by matching id
            const index = cartItemIds.findIndex(itemId => itemId === id);
            const productQuery = productQueries[index];
            // check if data is loaded
            if (productQuery.isSuccess && productQuery.data) {
                // Accumulate total price
                const productPrice = productQuery.data.price;
                const quantity = cart.items[id];
                return total + (productPrice * quantity);
            }

            return total;
        }, 0) // 0 = starting value for total
    }, [cart.items, cartItemIds, productQueries]) // does not recompute unless these change

    return (
        <div>
            <h2>Shopping Cart</h2>
            <ListGroup> {/* loops over items in cart state, then maps over state */}
                {Object.entries(cart.items).map(([id, quantity]) => (
                    <ListGroup.Item key={id} className='d-flex justify-content-between align-items-center'>
                        <span>{productNames.id}  - Quantity: {quantity}</span>
                        <div>
                            <Button variant='success' onClick={() => handleAddItem(id)}>+</Button>
                            <Button variant='danger' onClick={() => handleRemoveItem(id)}>-</Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <p>Total Items: {cart.totalItems}</p>
            <p>Total Price: ${totalPrice.toFixed(2)}</p> {/* toFixed => sets decimal point to amount of places in (), 2 in this case*/}
            <Button variant='primary' onClick={handleCheckout}>Checkout</Button>
            <Link to={'/home'}>
                <Button variant='secondary' className='ms-2'>Return to Home</Button>
            </Link>
        </div>
    );
};

export default ShoppingCart;

/* UNOPTIMIZED VERSION - ONLY USE ABOVE CODE IF PERFORMANCE ISSUES OCCUR: 
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, checkout } from '../features/cart/cartSlice';
import { Button, ListGroup } from 'react-bootstrap';
import products from '../data/product';


const ShoppingCart = () => {
    const cart = useSelector((state) => state.cart); //gets the state of the cart
    const dispatch = useDispatch(); 
    // references actions in cartSlice, allows actions to be used in component
    const handleAddItem = (id) => dispatch(addItem({ id }));
    const handleRemoveItem = (id) => dispatch(removeItem({ id }));
    const handleCheckout = () => dispatch(checkout());


    // Function to get product name by ID
    const getProductName = (id) => {
        const product = products.find(product => product.id === parseInt(id));
        return product ? product.name : 'Unknown Product';
    };

    return (
        <div>
            <h2>Shopping Cart</h2>
            <ListGroup> {/* loops over items in cart state, then maps over state }
            {Object.entries(cart.items).map(([id, quantity]) => (
                <ListGroup.Item key={id} className='d-flex justify-content-between align-items-center'>
                    <span>{getProductName(id)}  - Quantity: {quantity}</span>
                    <div>
                        <Button variant='success' onClick={() => handleAddItem(id)}>+</Button>
                        <Button variant='danger' onClick={() => handleRemoveItem(id)}>-</Button>
                    </div>
                </ListGroup.Item>
            ))}
        </ListGroup>
        <p>Total Items: {cart.totalItems}</p>
        <Button variant='primary' onClick={handleCheckout}>Checkout</Button>
        <Link to={'/home'}>
            <Button variant='secondary' className='ms-2'>Return to Home</Button>
        </Link>
    </div>
);
};

export default ShoppingCart; */