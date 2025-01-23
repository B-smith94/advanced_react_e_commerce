import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Form, Container, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavBar from './NavBar';
import '../i18n';
import { useTranslation } from 'react-i18next';

const UpdateUserAccount = () => {
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
   
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const user = useSelector((state) => state.userAccount.user);
    const [t] = useTranslation();

    console.log("User object:", user); // debugging

    useEffect(() => { // returns to login if user is not logged in already
        if (!user) {
            navigate('/'); 
        }
    }, [user, navigate])
    const queryClient = useQueryClient();    
    // sets a local state for ease of updating redux - if there is not anything in the redux store, sets it to a blank state to prevent errors
    const [formState, setFormState] = useState(user?.user || {
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
    
    const putUserAccount = async () => { // updates user account info based on id of user logged in
        setIsLoadingUpdate(true);
        const response = await fetch(`https://fakestoreapi.com/users/${user.user.id}`, {
            method: "PUT",
            body: JSON.stringify(user),
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        })
        if (!response.ok) throw new Error('Failed to update user account');
        return response.json();
    }

    const deleteUserAccount = async (user) => { // deletes data of logged-in user
        setIsLoadingDelete(true);
        const response = await fetch(`https://fakestoreapi.com/users/${user.user.id}`, {
            method: "DELETE",
        })
        if (!response.ok) throw new Error('Failed to delete user account');
        return response.json();
    }

    const { mutate: updateMutate, isError: isUpdateError, error: updateError } = useMutation({ // sets up mutation to update React Query state
        mutationFn: putUserAccount, 
        onSuccess: (data) => {
            setShowSuccessModal(true);
            setIsLoadingUpdate(false);
            console.log('User successfully added:', data.id);
            queryClient.invalidateQueries(['userAccounts']);
        }
    })

    const { mutate: deleteMutate, isError: isDeleteError, error: deleteError } = useMutation({ // Sets up mutation to delete form React Query
        mutationFn: deleteUserAccount,
        onSuccess: (data) => {
            setIsLoadingDelete(false);
            setShowDeleteModal(true);
            console.log('User successfully deleted:', data.id);
            queryClient.invalidateQueries(['userAccounts']);
        }
    })

    const handleSubmit = async (e) => { // handles changes made in the form
        e.preventDefault();
        updateMutate(formState);
        console.log("Submitting form with data:", formState);
        e.target.reset();
    }
    const handleDeleteClick = (e) => { // Handles warning before deleting account
        e.preventDefault();
        setShowConfirmDeleteModal(true);
    } 
    const handleDeleteConfirm = async (e) => { //handles delete confirmatiom
        e.preventDefault();
        deleteMutate(user);
        setShowConfirmDeleteModal(false);
    }

    const handleDeleteCancel = () => { // allows you to cancel delete option
        setShowConfirmDeleteModal(false);
    }

    const handleChange = (e) => { // updates the state used to update the Redux store
        const { name, value } = e.target;
        const updatedUser = { ...formState }; 

        if (name in updatedUser.name) updatedUser.name[name] = value;
        else if (name in updatedUser.address) updatedUser.address[name] = value;
        else updatedUser[name] = value;

        setFormState(updatedUser);
    };

    const handleClose = () => { // ensures proper navigation after deletion or update
        setShowSuccessModal(false);
        setShowDeleteModal(false);
        navigate(showSuccessModal? '/home' : '/');
    }

    return (
        <Container>
            <NavBar />
            {isUpdateError && <Alert variant='danger'>Failed to update account: {updateError.message}</Alert>}
            {isDeleteError && <Alert variant='danger'>Failed to delete account: {deleteError.message}</Alert>}
            <h2>{t('updateInfo')}</h2>
             <Form onSubmit={handleSubmit} role='form'>
                <Form.Group controlId='firstname' className='mb-4'>
                    <Form.Label>{t('firstName')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='firstname'
                     placeholder={t('firstNamePlaceholder')}
                     value={formState.name.firstname}
                     onChange={(e) => handleChange(e)}
                     aria-describedby='firstname'
                     disabled={isLoadingUpdate || isLoadingDelete}
                     required  
                    />
                </Form.Group>
                <Form.Group controlId='lastname' className='mb-4'>
                    <Form.Label>{t('lastName')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='lastname'
                     placeholder={t('lastNamePlaceholder')}
                     value={formState.name.lastname}
                     onChange={(e) => handleChange(e)}
                     aria-describedby='lastname'
                     disabled={isLoadingUpdate || isLoadingDelete}
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='username' className='mb-4'>
                    <Form.Label>{t('username')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='username'
                     placeholder={t('usernamePlaceholder')}
                     value={formState.username}
                     onChange={(e) => handleChange(e)}
                     aria-describedby='username'
                     disabled={isLoadingUpdate || isLoadingDelete}
                     required  
                    />
                </Form.Group>
                <Form.Group controlId='password' className='mb-4'>
                    <Form.Label>{t('password')}</Form.Label>
                    <Form.Control
                     type="password"  
                     name='password'
                     placeholder={t('passwordPlaceHolder')}
                     value={formState.password}
                     onChange={(e) => handleChange(e)}
                     aria-describedby='password'
                     disabled={isLoadingUpdate || isLoadingDelete}
                     required  
                    />
                </Form.Group>
                <Form.Group controlId='email' className='mb-4'>
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='email'
                     placeholder={t('emailPlaceholder')}
                     value={formState.email}
                     onChange={(e) => handleChange(e)}
                     aria-describedby='email'
                     disabled={isLoadingUpdate || isLoadingDelete}
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='phone' className='mb-4'>
                    <Form.Label>{t('phone')}</Form.Label>
                    <Form.Control
                     type="tel" 
                     name='phone'
                     placeholder={t('phonePlaceholder')}
                     value={formState.phone}
                     onChange={(e) => handleChange(e)}
                     aria-describedby='phone'
                     disabled={isLoadingUpdate || isLoadingDelete}
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
                     value={formState.address.city}
                     onChange={(e) => handleChange(e)}
                     aria-describedby='city'
                     disabled={isLoadingUpdate || isLoadingDelete}
                     required
                    />
                </Form.Group>
                <Form.Group controlId='street' className='mb-4'>
                    <Form.Label>{t('street')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='street'
                     placeholder={t('streetPlaceholder')}
                     value={formState.address.street}
                     onChange={(e) => handleChange(e)}
                     aria-describedby='street'
                     disabled={isLoadingUpdate || isLoadingDelete}
                     required 
                    />
                </Form.Group>
                <Form.Group controlId='zipcode' className='mb-4'>
                    <Form.Label>{t('zipcode')}</Form.Label>
                    <Form.Control
                     type="text" 
                     name='zipcode'
                     placeholder={t('zipcodePlaceholder')}
                     value={formState.address.zipcode}
                     onChange={(e) => handleChange(e)}
                     aria-describedby='zipcode'
                     disabled={isLoadingUpdate || isLoadingDelete}
                     required 
                    />
                </Form.Group>

                <Button variant='primary' type="submit" className='m-2' disabled={isLoadingUpdate} role='button'>
                    {isLoadingUpdate ? <Spinner animation='border' size='sm' /> : t('updateAccount')}
                </Button>

                <Button variant='danger'  className='m-2' onClick={handleDeleteClick} disabled={isLoadingDelete} role='button'>
                    {isLoadingDelete ? <Spinner animation='border' size='sm' /> : t('deleteAccount')}
                </Button>
            </Form>

            <Modal show={showSuccessModal || showDeleteModal} onHide={handleClose} aria-labelledby='modalTitle' aria-describedby='modalDescription'>
                <Modal.Header closeButton>
                    <Modal.Title id='modalTitle'>{showSuccessModal? t('updateSuccess') : t('deleteSuccess')}</Modal.Title>
                </Modal.Header>
                <Modal.Body id='modalDescription'>{showSuccessModal? t('updateSuccessMessage') : t("deleteSuccessMessage") }</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose} role='button'>
                        {showSuccessModal? t('returnToHome') : t('goToLogin')}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmDeleteModal} onHide={handleDeleteCancel} aria-labelledby='modalTitle' aria-describedby='modalDescription'>
                <Modal.Header closeButton>
                    <Modal.Title id='modalTitle'>{t('deleteConfirm')}</Modal.Title>
                </Modal.Header>
                <Modal.Body id='modalDescription'>
                    {t('deleteConfirmMessage')}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleDeleteCancel}>{t('cancel')}</Button>
                    <Button variant='danger' onClick={handleDeleteConfirm} >{t('delete')}</Button>
                </Modal.Footer>
            </Modal>
        </Container>         
    )
}

export default UpdateUserAccount