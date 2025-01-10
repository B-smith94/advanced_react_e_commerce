import React, { useState } from 'react';
import { Form, Container, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import '../i18n';
import { useTranslation } from 'react-i18next';
import NavBar from './NavBar';


const CreateUserAccount = () => {
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const queryClient = useQueryClient();
    const [t] = useTranslation();

    const postUserAccount = async (user) => {
        const response = await fetch('https://fakestoreapi.com/users', {
            method: "POST",
            body: JSON.stringify(user),
            headers: {'Content-Type': 'application/json; charset=UTF-8'},
        });
        if (!response.ok) throw new Error('Failed to add new user account');
        return response.json();
    }

    const { mutate, isError, error } = useMutation({
        mutationFn: postUserAccount,
        onSuccess: (data) => {
            setIsLoading(false)
            setShowSuccessModal(true);
            console.log('User successfully added:', data.id);
            queryClient.invalidateQueries(['userAccounts']);
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.target);
        const userAccount = {
            email: formData.get('email'),
            username: formData.get('username'),
            password: formData.get('password'),
            name: {
                firstname: formData.get('firstname'),
                lastname: formData.get('lastname'),
            },
            address: {
                city: formData.get('city'),
                street: formData.get('street'),
                zipcode: formData.get('zipcode').toString()
            },
            phone: formData.get('phone'),
        };
        
mutate(userAccount);                
        console.log("Submitting form with data:", userAccount);
        e.target.reset();
    }

    const handleClose = () => {
        setShowSuccessModal(false);
        navigate('/')
    }

    return (
        <Container>
            {isError && <Alert variant='danger'>{t('errorMessage')}: {error.message}</Alert>}
            <NavBar />
            <h2>{t('createUserTitle')}</h2>
             <Form onSubmit={handleSubmit} role='form' className='mb-4'>
                <Form.Group controlId='firstname'>
                    <Form.Label>{t('firstName')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='firstname'
                     placeholder={t('firstNamePlaceholder')}
                     aria-describedby='firstname'
                     disabled={isLoading}
                     required  
                    />
                </Form.Group>
                <Form.Group controlId='lastname' className='mb-4'>
                    <Form.Label>{t('lastName')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='lastname'
                     placeholder={t('lastNamePlaceholder')}
                     aria-describedby='lastname'
                     disabled={isLoading}
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='username' className='mb-4'>
                    <Form.Label>{t('username')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='username'
                     placeholder={t('usernamePlaceholder')}
                     aria-describedby='username'
                     disabled={isLoading}
                     required  
                    />
                </Form.Group>
                <Form.Group controlId='password' className='mb-4'>
                    <Form.Label>{t('password')}</Form.Label>
                    <Form.Control
                     type="password"  
                     name='password'
                     placeholder={t('passwordPlaceholder')}
                     aria-describedby='password'
                     disabled={isLoading}
                     required  
                    />
                </Form.Group>
                <Form.Group controlId='email' className='mb-4'>
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='email'
                     placeholder={t('emailPlaceholder')}
                     aria-describedby='email'
                     disabled={isLoading}
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='phone' className='mb-4'>
                    <Form.Label>{t('phone')}</Form.Label>
                    <Form.Control
                     type="tel" 
                     name='phone'
                     placeholder={t('phonePlaceholder')}
                     aria-describedby='phone'
                     disabled={isLoading}
                     required 
                    />
                </Form.Group>
                <hr />
                <h4 className='mb-3'>Address</h4>
                <Form.Group controlId='city' className='mb-4'>
                    <Form.Label>{t('city')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='city'
                     placeholder={t('cityPlaceholder')}
                     aria-describedby='city'
                     disabled={isLoading}
                     required
                    />
                </Form.Group>
                <Form.Group controlId='street' className='mb-4'>
                    <Form.Label>{t('street')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='street'
                     placeholder={t('streetPlaceholder')}
                     aria-describedby='street'
                     disabled={isLoading}
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='zipcode' className='mb-4'>
                    <Form.Label>{t('zipcode')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='zipcode'
                     placeholder={t('zipcodePlaceholder')}
                     aria-describedby='zipcode'
                     disabled={isLoading}
                     required 
                    />
                </Form.Group>
                <Button variant='primary' className='m-2' type="submit" disabled={isLoading} role='button'>
                    {isLoading ? <Spinner animation='border' size='sm' /> : t('createAccount')}
                </Button>
                <Button variant='secondary' className='m-2' onClick={() => navigate('/')} role='button'>{t('returnToLogin')}</Button>
            </Form>
            <Modal show={showSuccessModal} onHide={handleClose} aria-labelledby='modalTitle' aria-describedby='modalDescription'>
                <Modal.Header closeButton>
                    <Modal.Title id='modalTitle'>{t('createSuccess')}!</Modal.Title>
                </Modal.Header>
                <Modal.Body id='modalDescription'>{t('accountCreateSuccess')}</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        {t('goToLogin')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default CreateUserAccount