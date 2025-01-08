import { useDispatch } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';
import { Card, Button, Row, Col, Spinner, Alert, Dropdown, Form } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo } from 'react';

const ProductCatalog = () => {
    const dispatch = useDispatch(); 
    const [category, setCategory] = useState('');

    const fetchProducts = async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        return products;
    }

    const { data: products, isLoading, error } = useQuery({ 
        queryKey: ['products'], 
        queryFn: fetchProducts,
        refetchOnReconnect: true, 
        refetchOnWindowFocus: true, 
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, 
        cacheTime: 15 * 60 * 1000 
    });

    const handleAddToCart = (id) => {
        dispatch(addItem({ id }));
    };

    const filterByCategory = useMemo(() => {
        if (!category) return products;
        return products.filter((product) => product.category === category);
    }, [products, category])

    if (isLoading) return <Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>;
    if (error) return <Alert variant='danger'>{error.message}</Alert>; 

    return (
        <div>
            <h2>Product Catalog</h2> 
            <Form.Group>
                <Dropdown className='mb-2'>
                    <Dropdown.Toggle id='dropdown-filter-category'>
                        View by Category
                    </Dropdown.Toggle>
                    <Dropdown.Menu aria-labelledby='dropdown-filter-category'>
                        <Dropdown.Item onClick={() => setCategory('')}>Show All</Dropdown.Item>
                        {Array.from(new Set(products.map(product => product.category))).map((category) => (
                            <Dropdown.Item key={category} onClick={() => setCategory(category)}>
                                {category}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Form.Group>

            <Row xs={1} md={4} className='g-4'>
            {filterByCategory.map(product => (
                <Col key={product.id}>
                    <Card style={{ width: '18rem' }}>
                        <div style={{ padding: '10px' }}>
                            <Card.Img variant='top' src={product.image} style={{ height: '250px', objectFit: 'contain' }} />
                        </div>
                        <Card.Body>
                            <Card.Title>{product.title}</Card.Title>
                            <Card.Text><b>Category:</b> {product.category}</Card.Text>
                            <Card.Text>{product.description}</Card.Text>
                            <Card.Text><b>Price:</b> ${product.price}</Card.Text>
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