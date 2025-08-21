import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logIn, setError } from '../features/userAccounts/userAccountsSlice';
import { useDispatch } from 'react-redux';
import NavBar from './NavBar';
import '../i18n';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [t] = useTranslation();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try { //fetches data from the api
            const response = await fetch('https://fakestoreapi.com/users');
            if (!response.ok) throw new Error('Failed to fetch users');

            const users = await response.json(); // sets data to a variable
            const user = users.find((user) => user.username === username) ; // compares the api data to local data

            if (!user || user.password !== password) throw new Error('Invalid username or password'); //if they don't match, throws an error

            dispatch(logIn({ user })); //stores user in Redux
            setLoginError(null); // Error logging
            setShowSuccessModal(true);
            localStorage.setItem('userSession', JSON.stringify(user)); //stores user information in session storage
        } catch(error) {
            setLoginError(error.message); //error logging
            dispatch(setError(error.message));
        } finally {
            setIsLoading(false);
            
        }
    };

    const handleClose = () => {
        setShowSuccessModal(false); //sets up navigation to the home page
        navigate('/home');
    }

    return (
        <Container className="vh-100">
            <NavBar />
            <Row className="justify-content-center">
                <Col md={5} >
                    <h1>{t('login')}</h1>
                    {loginError && <Alert variant='danger' className='m-3'>{loginError}</Alert>}
                    <Form onSubmit={handleLogin} role='form'>
                        <Form.Group controlId="usernameInput" className="mb-3">
                            <Form.Label>{t('username')}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t("usernamePlaceholder")}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                isInvalid={!!loginError}
                                aria-describedby='usernameInput'
                                disabled={isLoading}
                            />
                        </Form.Group>
                        <Form.Group controlId="passwordInput" className="mb-3">
                            <Form.Label>{t('password')}</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder={t("passwordPlaceholder")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={!!loginError}
                                aria-describedby='passwordInput'
                                disabled={isLoading}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" disabled={isLoading} role='button'>
                            {isLoading? <Spinner animation='border' size='sm' /> : t('login')}
                        </Button>
                        <div className='mt-2'>
                            <p id='makeAccount'>{t('navToCreateAccount')}<Button variant='light' aria-describedby='makeAccount' onClick={() => navigate('/add-account')} role='button'>{t('clickHere')}.</Button></p>
                        </div>
                    </Form>
                </Col>
            </Row>
            <Modal show={showSuccessModal} onHide={handleClose} aria-labelledby='modalTitle' aria-describedby='modalDescription'>
                <Modal.Header closeButton>
                    <Modal.Title id='modalTitle'>{t('loginSuccess')}</Modal.Title>
                </Modal.Header>
                <Modal.Body id='modalDescription'>{t('loginSuccessMessage')} {username}!</Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' onClick={handleClose}>
                        {t('startShopping')}
                    </Button>
                </Modal.Footer>
            </Modal>
            <footer>Note: Current build uses Fake Store API for authentication and product information. To log in, use "johnd" for username and "m38rmF$" for password.</footer>
        </Container>
    );
}

export default Login