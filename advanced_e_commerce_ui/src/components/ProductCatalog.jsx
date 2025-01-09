import { useDispatch } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';
import { Card, Button, Row, Col, Spinner, Alert, Dropdown, Form } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo, useCallback } from 'react';
import { sortProducts } from '../features/products/productsSlice';

const ProductCatalog = () => {
    const dispatch = useDispatch(); 
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState({min: '', max: ''});
    const [criteria, setCriteria] = useState('')


    const handleSortProducts = useCallback((criteria) => dispatch(sortProducts(criteria)), [dispatch]);

    const fetchProducts = async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        return products;
    }
    // runs fetchProducts automatically, stores the data in the 'products' state, and sets parameters for when to rerun the function
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
    // Adds items to the cart
    const handleAddToCart = (id) => {
        dispatch(addItem({ id }));
    };
    // Search and filter functions
    const filterProducts = useMemo(() => {
        if (!products) return [];
        
        return products.filter((product) => {
            const matchCategory = category ? product.category === category : true;
            const matchTitle = title ? product.title.toLowerCase().includes(title.toLowerCase()) : true;
            const matchPrice = 
                (price.min ? product.price >= Number(price.min) : true) && 
                (price.max ? product.price <= Number(price.max) : true)
            return matchCategory && matchTitle && matchPrice;
        })
    }, [products, category, title, price])

    if (isLoading) return <Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>;
    if (error) return <Alert variant='danger'>{error.message}</Alert>; 

    return (
        <div>
            <h2>Product Catalog</h2> 
            <Row>
                <Col>
                    <Form.Group>
                        <Dropdown className='mb-2'>
                            <Dropdown.Toggle id='dropdown-filter-category'>
                                Filter by {category}
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
                    <Form.Group>
                        <Dropdown className='mb-2'>
                            <Dropdown.Toggle id='dropdown-sort'>
                                Sort Products by {criteria}
                            </Dropdown.Toggle>
                            <Dropdown.Menu aria-labelledby='dropdown-sort'>
                                <Dropdown.Item onClick={() => {setCriteria('Title'); handleSortProducts('Title')}}>Title</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setCriteria('Category'); handleSortProducts('Category')}}>Category</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setCriteria('Price asc.'); handleSortProducts('Price asc.')}}>Price Asc.</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setCriteria('Price desc.'); handleSortProducts('Price desc.')}}>Price Desc.</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                </Col>
            </Row>
            <Form className='mb-2'>
                <hr />
                <h5>Search Products</h5>
                <Row>
                    <Col className='col-6'>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                             type='text'
                             placeholder='Enter the name of the product'
                             name='title'
                             value={title}
                             onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col className='col-3'>
                        <Form.Group>
                            <Form.Label>Minimum Price</Form.Label>
                            <Form.Control
                             type='number'
                             placeholder='Enter minimum price'
                             value={price.min}
                             onChange={(e) => setPrice((prevPrice) => ({...prevPrice, min: e.target.value}))}
                            />
                        </Form.Group>
                    </Col>
                    <Col className='col-3'>
                        <Form.Group>
                            <Form.Label>Maximum Price</Form.Label>
                            <Form.Control
                             type='number'
                             placeholder='Enter maximum price'
                             value={price.max}
                             onChange={(e) => setPrice((prevPrice) => ({...prevPrice, max: e.target.value}))}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} md={4} className='g-4'>
            {filterProducts.map(product => (
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