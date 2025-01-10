import React, { useState } from 'react';
import { Form, Container, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';


const CreateUserAccount = () => {
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const queryClient = useQueryClient();

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
            {isError && <Alert variant='danger'>An error occurred: {error.message}</Alert>}
            <h2>Make a User Account</h2>
             <Form onSubmit={handleSubmit} role='form'>
                <Form.Group controlId='firstname'>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                     type="text" 
                     name='firstname'
                     placeholder='Enter your first name'
                     aria-describedby='firstname'
                     required  
                    />
                </Form.Group>
                <Form.Group controlId='lastname'>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                     type="text" 
                     name='lastname'
                     placeholder='Enter your last name'
                     aria-describedby='lastname'
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='username'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                     type="text" 
                     name='username'
                     placeholder='Enter your desired username'
                     aria-describedby='username'
                     required  
                    />
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                     type="password"  
                     name='password'
                     placeholder='Enter your password'
                     aria-describedby='password'
                     required  
                    />
                </Form.Group>
                <Form.Group controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                     type="text" 
                     name='email'
                     placeholder='Enter your email address'
                     aria-describedby='email'
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='phone'>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                     type="tel" 
                     name='phone'
                     placeholder='Enter your phone number'
                     aria-describedby='phone'
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='city'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                     type="text" 
                     name='city'
                     placeholder='Enter your home city'
                     aria-describedby='city'
                     required
                    />
                </Form.Group>
                <Form.Group controlId='street'>
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                     type="text" 
                     name='street'
                     placeholder='Enter your street address'
                     aria-describedby='street'
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='zipcode'>
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control
                     type="text" 
                     name='zipcode'
                     placeholder='Enter zip code'
                     aria-describedby='zipcode'
                     required 
                    />
                </Form.Group>
                <Button variant='primary' className='m-2' type="submit" disabled={isLoading} role='button'>
                    {isLoading ? <Spinner animation='border' size='sm' /> : 'Create Account'}
                </Button>
                <Button variant='secondary' className='m-2' onClick={() => navigate('/')} role='button'>Return to Login</Button>
            </Form>
            <Modal show={showSuccessModal} onHide={handleClose} aria-labelledby='modalTitle' aria-describedby='modalDescription'>
                <Modal.Header closeButton>
                    <Modal.Title id='modalTitle'>Creation Successful!</Modal.Title>
                </Modal.Header>
                <Modal.Body id='modalDescription'>Account creation successful. Happy shopping!</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Go to Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default CreateUserAccount