import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import { addUser } from '../features/userAccounts/userAccountsSlice';
import { useDispatch } from 'react-redux';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const storedUser = localStorage.getItem('userSession')
        if (storedUser) {
            const userSession = JSON.parse(storedUser);
            dispatch(addUser(userSession));
        }
    }, [dispatch])

    const fetchUserAccounts = async () => {
        const response = await fetch('https://fakestoreapi.com/users');
        if (!response.ok) {
            throw new Error ('Failed to fetch users');
        }
        console.log('Usernames successfully retrieved')
        return response.json();
    };

    const { data: userAccounts, isLoading, error } = useQuery({
        queryKey: ['userAccounts'],
        queryFn: fetchUserAccounts,
        refetchOnReconnect: true, 
        refetchOnWindowFocus: true, 
        retry: 3, 
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, 
        cacheTime: 15 * 60 * 1000 
    })

    const handleLogin = (e) => {
        e.preventDefault();
        const user = userAccounts.find(
            (u) => u.username === username && u.password === password
        );

        if (user) {
            setLoginError(null);
            setShowSuccessModal(true);
            localStorage.setItem('userSession', JSON.stringify(user));
            console.log('Logged-in user:', user)
        } else {
            setLoginError("Invalid username or password.")
            console.log("Invalid username or password")
        }
    }

    const handleClose = () => {
        setShowSuccessModal(false);
        navigate('/home');
    }

    if (isLoading) return <Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>;
    if (error) return <Alert variant='danger'>{error.message}</Alert>; 

    return (
        <Container className="vh-100">
            <Row className="justify-content-center">
                <Col md={5} >
                    <h1>Login</h1>
                    {loginError && <Alert variant='danger' className='m-3'>{loginError}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="usernameInput" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                isInvalid={!!loginError}
                            />
                        </Form.Group>
                        <Form.Group controlId="passwordInput" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={!!loginError}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Modal show={showSuccessModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login Successful!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Successfully logged in. Welcome back, {username}!</Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' onClick={handleClose}>
                        Start Shopping
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Login