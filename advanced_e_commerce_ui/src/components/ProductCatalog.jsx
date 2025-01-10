import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';
import { Card, Button, Row, Col, Spinner, Alert, Dropdown, Form } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { sortProducts, setProducts } from '../features/products/productsSlice';
import '../i18n';
import { useTranslation } from 'react-i18next';

const ProductCatalog = () => {
    const dispatch = useDispatch(); 
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState({min: '', max: ''});
    const [criteria, setCriteria] = useState('')
    const products = useSelector((state) => state.products.items);
    const [t] = useTranslation();
    // useCallback prevents unnecessary rerendering of redux actions
    const handleSortProducts = useCallback((criteria) => dispatch(sortProducts(criteria)), [dispatch]);
    const handleSetProducts = useCallback((productsList) => dispatch(setProducts(productsList)), [dispatch]); 

    const fetchProducts = async () => { // fetches products data
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        return products;
    }
    // runs fetchProducts automatically, stores the data in the 'products' state, and sets parameters for when to rerun the function
    const { data: apiProducts, isLoading, error } = useQuery({  //stores data in products state via React Query
        queryKey: ['products'], 
        queryFn: fetchProducts,
        refetchOnReconnect: true, 
        refetchOnWindowFocus: true, 
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, 
        cacheTime: 15 * 60 * 1000 
    });


    useEffect(() => { // adds products to redux for manipulation
        if (apiProducts) {
            handleSetProducts(apiProducts);
        }
    }, [apiProducts, dispatch]);
    
    useEffect(() => {
        localStorage.setItem('catalogItems', JSON.stringify(products.items)) //adds products to local storage to reduce rerendering
    }, [products.items])

    // Adds items to the cart
    const handleAddToCart = (id) => { //adds items to the cart
        dispatch(addItem({ id }));
    };
    // Search and filter functions
    const filterProducts = useMemo(() => { //sets up filtering functions by category, title, or price range, then memoizes results
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
    if (error) return <Alert variant='danger'>{error.message}</Alert>;  // loading and error handling

    return (
        <div>
            <h2>{t('catalog')}</h2> 
            <Row>
                <Col>
                    <Form.Group>
                        <Dropdown className='mb-2' role='menu'>
                            <Dropdown.Toggle id='dropdown-filter-category'>
                                {t('filter')} {category}
                            </Dropdown.Toggle>
                            <Dropdown.Menu aria-labelledby='dropdown-filter-category'>
                                <Dropdown.Item onClick={() => setCategory('')} role='menuitem'>{t('showAll')}</Dropdown.Item>
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
                                {t("sortProducts")} {criteria}
                            </Dropdown.Toggle>
                            <Dropdown.Menu aria-labelledby='dropdown-sort'>
                                <Dropdown.Item onClick={() => {setCriteria('Title'); handleSortProducts('Title')}} role='menuitem'>{t('productTitle')}</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setCriteria('Category'); handleSortProducts('Category')}} role='menuitem'>{t('productCat')}</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setCriteria('Price asc.'); handleSortProducts('Price asc.')}} role='menuitem'>{t('priceAsc')}</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setCriteria('Price desc.'); handleSortProducts('Price desc.')}} role='menuitem'>{t('priceDesc')}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                </Col>
            </Row>
            <Form className='mb-2' role='form'>
                <hr />
                <h5>{t('searchProducts')}</h5>
                <Row>
                    <Col className='col-6'>
                        <Form.Group controlId='productName'>
                            <Form.Label>{t('productName')}</Form.Label>
                            <Form.Control
                             type='text'
                             placeholder={t('searchPlaceholder')}
                             name='title'
                             value={title}
                             onChange={(e) => setTitle(e.target.value)}
                             aria-describedby='productName'
                            />
                        </Form.Group>
                    </Col>
                    <Col className='col-3'>
                        <Form.Group controlId='priceMin'>
                            <Form.Label>{t('minPrice')}</Form.Label>
                            <Form.Control
                             type='number'
                             placeholder={t('minPricePlaceholder')}
                             value={price.min}
                             onChange={(e) => setPrice((prevPrice) => ({...prevPrice, min: e.target.value}))}
                             aria-describedby='priceMin'
                            />
                        </Form.Group>
                    </Col>
                    <Col className='col-3'>
                        <Form.Group controlId='priceMax'>
                            <Form.Label>{t('maxPrice')}</Form.Label>
                            <Form.Control
                             type='number'
                             placeholder={t('maxPricePlaceholder')}
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
                            <Card.Img variant='top' src={product.image} role='img' alt={`${t('altImgTxt')} ${product.title}`} style={{ height: '250px', objectFit: 'contain' }} />
                        </div>
                        <Card.Body>
                            <Card.Title id='cardTitle'>{product.title}</Card.Title>
                            <Card.Text><b>{t('productCat')}:</b> {product.category}</Card.Text>
                            <Card.Text id='cardDescription'>{product.description}</Card.Text>
                            <Card.Text><b>{t('productPrice')}:</b> ${product.price}</Card.Text>
                            <Button variant='primary' onClick={() => handleAddToCart(product.id)}>{t('addToCart')}</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
            </Row>
        </div>
    );
};

export default ProductCatalog;