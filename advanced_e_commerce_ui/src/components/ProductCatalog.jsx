import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';
import { Card, Button, Row, Col, Spinner, Alert, Dropdown, Form } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { sortProducts, setProducts } from '../features/products/productsSlice';

const ProductCatalog = () => {
    const dispatch = useDispatch(); 
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState({min: '', max: ''});
    const [criteria, setCriteria] = useState('')
    const products = useSelector((state) => state.products.items);

    const handleSortProducts = useCallback((criteria) => dispatch(sortProducts(criteria)), [dispatch]);
    const handleSetProducts = useCallback((productsList) => dispatch(setProducts(productsList)), [dispatch]);

    const fetchProducts = async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        return products;
    }
    // runs fetchProducts automatically, stores the data in the 'products' state, and sets parameters for when to rerun the function
    const { data: apiProducts, isLoading, error } = useQuery({ 
        queryKey: ['products'], 
        queryFn: fetchProducts,
        refetchOnReconnect: true, 
        refetchOnWindowFocus: true, 
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, 
        cacheTime: 15 * 60 * 1000 
    });


    useEffect(() => {
        if (apiProducts) {
            handleSetProducts(apiProducts);
        }
    }, [apiProducts, dispatch]);
    
    useEffect(() => {
        localStorage.setItem('catalogItems', JSON.stringify(products.items))
    }, [products.items])

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
                        <Dropdown className='mb-2' role='menu'>
                            <Dropdown.Toggle id='dropdown-filter-category'>
                                Filter by {category}
                            </Dropdown.Toggle>
                            <Dropdown.Menu aria-labelledby='dropdown-filter-category'>
                                <Dropdown.Item onClick={() => setCategory('')} role='menuitem'>Show All</Dropdown.Item>
                                {Array.from(new Set(products.map(product => product.category))).map((category) => (
                                    <Dropdown.Item key={category} onClick={() => setCategory(category)} role='menuitem'>
                                        {category}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    <Form.Group>
                        <Dropdown className='mb-2' role='menu'>
                            <Dropdown.Toggle id='dropdown-sort'>
                                Sort Products by {criteria}
                            </Dropdown.Toggle>
                            <Dropdown.Menu aria-labelledby='dropdown-sort'>
                                <Dropdown.Item onClick={() => {setCriteria('Title'); handleSortProducts('Title')}} role='menuitem'>Title</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setCriteria('Category'); handleSortProducts('Category')}} role='menuitem'>Category</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setCriteria('Price asc.'); handleSortProducts('Price asc.')}} role='menuitem'>Price Asc.</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setCriteria('Price desc.'); handleSortProducts('Price desc.')}} role='menuitem'>Price Desc.</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                </Col>
            </Row>
            <Form className='mb-2' role='form'>
                <hr />
                <h5>Search Products</h5>
                <Row>
                    <Col className='col-6'>
                        <Form.Group controlId='productName'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                             type='text'
                             placeholder='Enter the name of the product'
                             name='title'
                             value={title}
                             onChange={(e) => setTitle(e.target.value)}
                             aria-describedby='productName'
                            />
                        </Form.Group>
                    </Col>
                    <Col className='col-3'>
                        <Form.Group controlId='priceMin'>
                            <Form.Label>Minimum Price</Form.Label>
                            <Form.Control
                             type='number'
                             placeholder='Enter minimum price'
                             value={price.min}
                             onChange={(e) => setPrice((prevPrice) => ({...prevPrice, min: e.target.value}))}
                             aria-describedby='priceMin'
                            />
                        </Form.Group>
                    </Col>
                    <Col className='col-3'>
                        <Form.Group controlId='priceMax'>
                            <Form.Label>Maximum Price</Form.Label>
                            <Form.Control
                             type='number'
                             placeholder='Enter maximum price'
                             value={price.max}
                             onChange={(e) => setPrice((prevPrice) => ({...prevPrice, max: e.target.value}))}
                             aria-describedby='priceMax'
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} md={4} className='g-4'>
            {filterProducts.map(product => (
                <Col key={product.id}>
                    <Card style={{ width: '18rem' }} aria-labelledby='cardTitle' aria-describedby='cardDescription'>
                        <div style={{ padding: '10px' }}>
                            <Card.Img variant='top' src={product.image} role='img' alt={`picture of ${product.title}`} style={{ height: '250px', objectFit: 'contain' }} />
                        </div>
                        <Card.Body>
                            <Card.Title id='cardTitle'>{product.title}</Card.Title>
                            <Card.Text><b>Category:</b> {product.category}</Card.Text>
                            <Card.Text id='cardDescription'>{product.description}</Card.Text>
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