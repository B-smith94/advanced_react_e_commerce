import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logIn, setError } from '../features/userAccounts/userAccountsSlice';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('https://fakestoreapi.com/users');
            if (!response.ok) throw new Error('Failed to fetch users');

            const users = await response.json();
            const user = users.find((user) => user.username === username) ;

            if (!user || user.password !== password) throw new Error('Invalid username or password');

            dispatch(logIn({ user }));
            setLoginError(null);
            setShowSuccessModal(true);

            sessionStorage.setItem('userSession', JSON.stringify(user));
        } catch(error) {
            setLoginError(error.message);
            dispatch(setError(error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setShowSuccessModal(false);
        navigate('/home');
    }

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
                        <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                            {isLoading? <Spinner animation='border' size='sm' /> : 'Login'}
                        </Button>
                        <div className='mt-2'>
                            <p>Or, if you need to make an account, <Button variant='light' onClick={() => navigate('/add-account')}>Click Here.</Button></p>
                        </div>
                       
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