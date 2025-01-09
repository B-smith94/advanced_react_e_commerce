import React, { useState } from 'react';
import { Form, Container, Button, Alert, Modal } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';


const CreateUserAccount = () => {
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const queryClient = useQueryClient();

    const postUserAccount = async (user) => {
        const response = await fetch('https://fakestoreapi.com/users', {
            method: "POST",
            body: JSON.stringify(user),
            headers: {'Content-Type': 'application/json; charset=UTF-8'},
        });
        if (!response.ok) throw new Error('Failed to add new product');
        return response.json();
    }

    const { mutate, isLoading, isError, error } = useMutation({
        mutationFn: postUserAccount,
        onSuccess: (data) => {
            setShowSuccessModal(true);
            console.log('User successfully added:', data.id);
            queryClient.invalidateQueries(['UserAccounts']);
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
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
             <Form onSubmit={handleSubmit}>
                <Form.Group controlId='firstname'>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                     type="text" 
                     name='firstname'
                     placeholder='Enter your first name'
                     required  
                    />
                </Form.Group>
                <Form.Group controlId='lastname'>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                     type="text" 
                     name='lastname'
                     placeholder='Enter your last name'
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='username'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                     type="text" 
                     name='username'
                     placeholder='Enter your desired username'
                     required  
                    />
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                     type="password"  
                     name='password'
                     placeholder='Enter your password'
                     required  
                    />
                </Form.Group>
                <Form.Group controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                     type="text" 
                     name='email'
                     placeholder='Enter your email address'
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='phone'>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                     type="tel" 
                     name='phone'
                     placeholder='Enter your phone number'
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='city'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                     type="text" 
                     name='city'
                     placeholder='Enter your home city'
                     required
                    />
                </Form.Group>
                <Form.Group controlId='street'>
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                     type="text" 
                     name='street'
                     placeholder='Enter your street address'
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='zipcode'>
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control
                     type="text" 
                     name='zipcode'
                     placeholder='Enter zip code'
                     required 
                    />
                </Form.Group>
                <Button variant='primary' type="submit" disabled={isLoading}>
                    {isLoading ? 'Finalizing...' : 'Create Account'}
                </Button>
            </Form>
            <Modal show={showSuccessModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Creation Successful!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Account creation successful. Happy shopping!</Modal.Body>
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