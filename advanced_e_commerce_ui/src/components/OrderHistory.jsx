// Steps: 

// 1. Set up a react query to fetch user carts from fakestoreapi.com
// 2. Configure render so that it displays:
//      - Cart ID
//      - Date of Creation
//      - Total Price
// 3. Enable users to click on individual orders to view full details, including:
//      -list of Products
//      -Total Price of the Order

import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container, ListGroup, Button, Alert, Spinner } from "react-bootstrap";
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

    console.log(carts)

    const findProductById = (productId) =>
        products?.find((product) => product.id === productId);

    const calculateCartTotal = (cartProducts) => {
        return cartProducts.reduce((acc, product) => {
            const productDetails = findProductById(product.productId);
            const productPrice = productDetails?.price || 0;
            return acc + productPrice * product.quantity;
        }, 0)
    };

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
            <ListGroup>
                {carts && carts.length > 0 ? (
                    carts.map((cart) => {
                        const totalPrice = calculateCartTotal(cart.products);
                        return (
                        <ListGroup.Item key={cart.id} className="p-3">
                            <strong>Cart ID:</strong> {cart.id} - 
                            <strong> Order Date:</strong> {cart.date} -  
                            <strong> Total Price: </strong>${totalPrice.toFixed(2)}
                            <Button variant="light" className="m-2" onClick={() => toggleCartDetails(cart.id)}>
                                {expandedCartId === cart.id ? 'Hide Details' : 'View Details'}    
                            </Button> 
                            {expandedCartId === cart.id && (
                                <ListGroup className="mt-3">
                                    {cart.products.map(product => {
                                        const productDetails = findProductById(product.productId);
                                        return (
                                            <ListGroup.Item key={product.productId}>
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

export default OrderHistory;