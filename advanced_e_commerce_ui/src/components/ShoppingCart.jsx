import { useMemo, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, deleteItem, checkout } from '../features/cart/cartSlice';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const ShoppingCart = () => {
    const cart = useSelector((state) => state.cart); 
    const cartItemIds = Object.keys(cart.items); 
    const dispatch = useDispatch(); 
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate()
   
    const handleAddItem = useCallback((id) => dispatch(addItem({ id })), [dispatch]);
    const handleRemoveItem = useCallback((id) => dispatch(removeItem({ id })), [dispatch]);
    const handleCheckout = useCallback(() => {
        dispatch(checkout()), [dispatch];
        setShowSuccessModal(true);
    });
    const handleDeleteItem = useCallback((id) => dispatch(deleteItem({ id })), [dispatch]);

    const handleClose = () => {
        setShowSuccessModal(false);
        navigate('/home');
    }
    useEffect(() => {
        sessionStorage.setItem('cartItems', JSON.stringify(cart.items));
    }, [cart.items]); 

    const productQueries = useQueries({
        queries: cartItemIds.map(id => ({
            queryKey: ['products', id],
            queryFn: () => fetch(`https://fakestoreapi.com/products/${id}`).then(res => res.json())
        }))
    });

    const getProductName = useCallback((id) => {
        const index = cartItemIds.findIndex(itemId => itemId === id);
        const productQuery = productQueries[index];
        return productQuery?.data?.title || 'Unknown Product';
    }, [productQueries, cartItemIds]);

    const productNames = useMemo(() =>
        cartItemIds.reduce((acc, id) => ({ 
            ...acc,
        [id]: getProductName(id)
        }), {}), 
    [cartItemIds, getProductName]); 
    

    const totalPrice = useMemo(() => {
        return cartItemIds.reduce((total, id) => {
            const index = cartItemIds.findIndex(itemId => itemId === id);
            const productQuery = productQueries[index];

            if (productQuery.isSuccess && productQuery.data) {
                const productPrice = productQuery.data.price;
                const quantity = cart.items[id];
                return total + (productPrice * quantity);
            }
            return total;
        }, 0) 
    }, [cart.items, cartItemIds, productQueries]) 

    return (
        <div>
            <NavBar />
            <h2>Shopping Cart</h2>
            <ListGroup role='list'> 
                {totalPrice > 0 ? Object.entries(cart.items).map(([id, quantity]) => (
                    <ListGroup.Item key={id} className='d-flex justify-content-between align-items-center' role='listitem'>
                        <span>{productNames[id]}  - Quantity: {quantity}</span>
                        <div>
                            <Button variant='light' className='me-1' onClick={() => handleAddItem(id)} role='button'>+</Button>
                            <Button variant='light' className='me-1' onClick={() => handleRemoveItem(id)} role='button'>-</Button>
                            <Button variant='danger' onClick={() => handleDeleteItem(id)} role='button'>Remove from Cart</Button>
                        </div>
                    </ListGroup.Item>
                )): "Shopping cart is empty."}
            </ListGroup>
            <p>Total Items: {cart.totalItems}</p>
            <p>Total Price: ${totalPrice.toFixed(2)}</p> 
            <Button variant='primary' onClick={handleCheckout} role='button'>Checkout</Button>
            <Link to={'/home'}>
                <Button variant='secondary' className='ms-2' role='link'>Return to Home</Button>
            </Link>
            <Modal show={showSuccessModal} onHide={handleClose} aria-labelledby='modalTitle' aria-describedby='modalDescription'>
                <Modal.Header closeButton>
                    <Modal.Title id='modalTitle'>All Checked Out!</Modal.Title>
                </Modal.Header>
                <Modal.Body id='modalDescription'>Product has been successfully checked out!</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose} role='button'>
                        Return to Product Catalog
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ShoppingCart;