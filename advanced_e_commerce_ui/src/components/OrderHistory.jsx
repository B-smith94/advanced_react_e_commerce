import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, ListGroup, Button, Alert, Spinner } from "react-bootstrap";

import NavBar from "./NavBar";

const OrderHistory = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.userAccount.user)
    const products = useSelector((state) => state.products.items)
    const [expandedCartId, setExpandedCartId] = useState(null);

    useEffect(() => {
        if (!user) {
            return navigate("/")
        } 
    }, [user, navigate])

    const userId = user.user.id
    console.log(userId);

    const fetchCarts = async () => {
        const response = await fetch(`https://fakestoreapi.com/carts/user/${userId}`)
        if (!response) throw new Error('Failed to fetch carts');
        const carts = await response.json();
        return carts
    }


    const { data: carts, isLoading, error } = useQuery({
        queryKey: ['carts'],
        queryFn: fetchCarts,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000,
        cacheTime: 15 * 60 * 1000
    });

    sessionStorage.setItem('cartHistory', carts)
    console.log(carts)

    const findProductById = useMemo(() =>{
        return (productId) =>
            products?.find((product) => product.id === productId)
    }, [products]);

    const calculateCartTotal = useMemo(() => {
        return (cartProducts) => {
            return cartProducts.reduce((acc, product) => {
                const productDetails = findProductById(product.productId);
                const productPrice = productDetails?.price || 0;
                return acc + productPrice * product.quantity;
            }, 0)
        }
    }, [products]);

    const toggleCartDetails = (cartId) => {
        setExpandedCartId(expandedCartId === cartId ? null : cartId)
    }

    if (isLoading) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
    if (error) {
        console.log(error); 
        return (<><Alert variant="danger">{error.message}</Alert><Button variant="primary" onClick={() => navigate('/home')}>Return to Home Page</Button></>);
    }
    
    return (
        <Container>
            <NavBar />
            <h2>Order History</h2>
            <ListGroup role="list">
                {carts && carts.length > 0 ? (
                    carts.map((cart) => {
                        const totalPrice = calculateCartTotal(cart.products);
                        return (
                        <ListGroup.Item key={cart.id} className="p-3" role="listitem">
                            <strong>Cart ID:</strong> {cart.id} - 
                            <strong> Order Date:</strong> {cart.date} -  
                            <strong> Total Price: </strong>${totalPrice.toFixed(2)}
                            <Button variant="light" role="button" className="m-2" onClick={() => toggleCartDetails(cart.id)}>
                                {expandedCartId === cart.id ? 'Hide Details' : 'View Details'}    
                            </Button> 
                            {expandedCartId === cart.id && (
                                <ListGroup className="mt-3" role='list'>
                                    {cart.products.map(product => {
                                        const productDetails = findProductById(product.productId);
                                        return (
                                            <ListGroup.Item key={product.productId} role="listitem">
                                                <div>
                                                    <strong>Product Name:</strong> {productDetails?.title || 'Unknown'}
                                                </div>
                                                <div>
                                                    <strong>Price:</strong> ${productDetails?.price || 'Unknown'}
                                                </div>
                                                <div>
                                                    <strong>Quantity:</strong> {product.quantity}
                                                </div>
                                            </ListGroup.Item>
                                        );
                                    })} 
                                </ListGroup>
                            )} 
                        </ListGroup.Item>
                    )})
                ) : 'No orders found'}
            </ListGroup>
        </Container>
    )
}
export const MemoizedOrders = React.memo(OrderHistory);

export default OrderHistory;