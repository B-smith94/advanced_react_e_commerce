import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Form, Container, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavBar from './NavBar';

const UpdateUserAccount = () => {
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const user = useSelector((state) => state.userAccount.user.user);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [formState, setFormState] = useState(user || {
        name: {
            firstname: '', 
            lastname: ''
        }, email: '',
        password: '', 
        username: '', 
        phone: '', 
        address: { 
            city: '', 
            street: '', 
            zipcode: '' 
        } 
    }); 

    const queryClient = useQueryClient();

    console.log(user);

    useEffect(() => {
        if (!user) {
            navigate('/'); 
        }
    }, [user, navigate])

    const putUserAccount = async () => {
        setIsLoadingUpdate(true);
        const response = await fetch(`https://fakestoreapi.com/users/${user.id}`, {
            method: "PUT",
            body: JSON.stringify(user),
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        })
        if (!response.ok) throw new Error('Failed to update user account');
        return response.json();
    }

    const deleteUserAccount = async (user) => {
        setIsLoadingDelete(true);
        const response = await fetch(`https://fakestoreapi.com/users/${user.id}`, {
            method: "DELETE",
        })
        if (!response.ok) throw new Error('Failed to delete user account');
        return response.json();
    }

    const { mutate: updateMutate, isError: isUpdateError, error: updateError } = useMutation({
        mutationFn: putUserAccount,
        onSuccess: (data) => {
            setShowSuccessModal(true);
            setIsLoadingUpdate(false);
            console.log('User successfully added:', data.id);
            queryClient.invalidateQueries(['userAccounts']);
        }
    })

    const { mutate: deleteMutate, isError: isDeleteError, error: deleteError } = useMutation({
        mutationFn: deleteUserAccount,
        onSuccess: (data) => {
            setIsLoadingDelete(false);
            setShowDeleteModal(true);
            console.log('User successfully deleted:', data.id);
            queryClient.invalidateQueries(['userAccounts']);
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        updateMutate(formState);
        console.log("Submitting form with data:", formState);
        e.target.reset();
    }
    const handleDeleteClick = (e) => {
        e.preventDefault();
        setShowConfirmDeleteModal(true);
    } 
    const handleDeleteConfirm = async (e) => {
        e.preventDefault();
        deleteMutate(user);
        setShowConfirmDeleteModal(false);
    }

    const handleDeleteCancel = () => {
        setShowConfirmDeleteModal(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedUser = { ...formState }; 

        if (name in updatedUser.name) updatedUser.name[name] = value;
        else if (name in updatedUser.address) updatedUser.address[name] = value;
        else updatedUser[name] = value;

        setFormState(updatedUser);
    };

    const handleClose = () => {
        setShowSuccessModal(false);
        setShowDeleteModal(false);
        navigate(showSuccessModal? '/home' : '/');
    }

    return (
        <Container>
            <NavBar />
            {isUpdateError && <Alert variant='danger'>Failed to update account: {updateError.message}</Alert>}
            {isDeleteError && <Alert variant='danger'>Failed to delete account: {deleteError.message}</Alert>}
             <Form onSubmit={handleSubmit} role='form'>
                <Form.Group controlId='firstname'>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                     type="text" 
                     name='firstname'
                     placeholder='Enter your first name'
                     value={formState.name.firstname}
                     onChange={(e) => handleChange(e)}
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
                     value={formState.name.lastname}
                     onChange={(e) => handleChange(e)}
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
                     value={formState.username}
                     onChange={(e) => handleChange(e)}
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
                     value={formState.password}
                     onChange={(e) => handleChange(e)}
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
                     value={formState.email}
                     onChange={(e) => handleChange(e)}
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
                     value={formState.phone}
                     onChange={(e) => handleChange(e)}
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
                     value={formState.address.city}
                     onChange={(e) => handleChange(e)}
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
                     value={formState.address.street}
                     onChange={(e) => handleChange(e)}
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
                     value={formState.address.zipcode}
                     onChange={(e) => handleChange(e)}
                     aria-describedby='zipcode'
                     required 
                    />
                </Form.Group>

                <Button variant='primary' type="submit" className='m-2' disabled={isLoadingUpdate} role='button'>
                    {isLoadingUpdate ? <Spinner animation='border' size='sm' /> : 'Update Account'}
                </Button>

                <Button variant='danger'  className='m-2' onClick={handleDeleteClick} disabled={isLoadingDelete} role='button'>
                    {isLoadingDelete ? <Spinner animation='border' size='sm' /> : 'Delete Account'}
                </Button>
            </Form>

            <Modal show={showSuccessModal || showDeleteModal} onHide={handleClose} aria-labelledby='modalTitle' aria-describedby='modalDescription'>
                <Modal.Header closeButton>
                    <Modal.Title id='modalTitle'>{showSuccessModal? 'Update Successful!': 'Deletion Successful'}</Modal.Title>
                </Modal.Header>
                <Modal.Body id='modalDescription'>{showSuccessModal? 'Account update successful. Happy shopping!': "Account successfully deleted. We'll miss you!" }</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose} role='button'>
                        {showSuccessModal? 'Back to Home' : 'Go to Login'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmDeleteModal} onHide={handleDeleteCancel} aria-labelledby='modalTitle' aria-describedby='modalDescription'>
                <Modal.Header closeButton>
                    <Modal.Title id='modalTitle'>Are you sure you want to delete your account?</Modal.Title>
                </Modal.Header>
                <Modal.Body id='modalDescription'>
                    This action is irreversible.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleDeleteCancel}>Cancel</Button>
                    <Button variant='danger' onClick={handleDeleteConfirm}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>         
    )
}

export default UpdateUserAccount