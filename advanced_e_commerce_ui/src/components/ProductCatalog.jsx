import { useDispatch, useSelector } from 'react-redux';
//import { useEffect } from 'react';
import { addItem } from '../features/cart/cartSlice';
//import { fetchProducts } from '../features/products/productsSlice';
//import products from '../data/product';
import { Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query'; // react query hook

const ProductCatalog = () => {
    const dispatch = useDispatch(); // creates dispatch

    const fetchProducts = async () => { // function to be passed into useQuery()
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        return products;
    }

    //const products = useSelector((state) => state.products.items);
    //const productsStatus = useSelector((state) => state.products.status);
    //const error = useSelector((state) => state.products.error);

    //useEffect(() => {
    //    if (productsStatus === 'idle') {
    //        dispatch(fetchProducts()); // gonna result in a promise
    //    }
    //}, [productsStatus, dispatch]);

    //saved data to 'products' key - caches data, removes necessity of calling the same api multiple times quickly
// stored data in products key, other parts of app that make the same API call can access data stored in products instead of calling the API
    const { data: products, isLoading, error } = useQuery({ // breaks down data into an object: data prop is products, isLoading and error have no value until API is called
        queryKey: ['products'], 
        // By caching our data, we don't have to amek the same API call multiple times
        queryFn: fetchProducts,
        refetchOnReconnect: true, // Automatically refetches when the network reconnects IF DATA IS STALE
        refetchOnWindowFocus: true, // Automatically refetches when the window is refocuses IF DATA IS STALE
        retry: 3, // Retries failed queries up to 3 times
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff strategy - Increases time between retries based on attempt number, maximum of 30 seconds
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes - need to wait at least 5 min before doing another fetch
        cacheTime: 15 * 60 * 1000 // Data is cached for 15 minutes after query becomes inactive - clears cache 15 minutes after application is inactive
        // allows data to still be useable (although stale) if disconnected
    });          //minutes * seconds * milliseconds

    const handleAddToCart = (id) => {
        dispatch(addItem({ id })); // pass id into addItem, which is passed into dispatch so that store can check for actions
    };
    // if isLoading or error have a value, below code runs
    if (isLoading) return <Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>;
    if (error) return <Alert variant='danger'>{error.message}</Alert>;

    return (
        <div>
            <h2>Product Catalog</h2> {/* productsStatus matches addCases in builder in productsSlice */}
            {/*productsStatus === 'loading' && <Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>}
            {productsStatus === 'failed' && <Alert variant='danger'>{error}</Alert>}*/}
            <Row xs={1} md={4} className='g-4'>
            {products.map(product => (
                <Col key={product.id}>
                    <Card style={{ width: '18rem' }}>
                        <div style={{ padding: '10px' }}>
                            <Card.Img variant='top' src={product.image} style={{ height: '250px', objectFit: 'contain' }} />
                        </div>
                        <Card.Body>
                            <Card.Title>{product.title}</Card.Title>
                            <Card.Text>Price: ${product.price}</Card.Text>
                            <Button variant='primary' onClick={() => handleAddToCart(product.id)}>Add to Cart</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
            </Row>
        </div>
    );
};

export default ProductCatalog;