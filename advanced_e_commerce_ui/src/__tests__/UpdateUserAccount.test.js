import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpdateUserAccount from '../components/UpdateUserAccount.jsx';

global.fetch = jest.fn(() => 
    Promise.resolve({
        json: () => Promise.resolve({ 
            id: 21, 
            email: 'jd@example.com', 
            username: "ex@mpleMan", 
            password: "p@$$w0rD", 
            name: {
                firstname: 'James',
                lastname: 'Dean',
            },
            address: {
                city: 'dudesville',
                street: '1342 cool street',
                number: 5,
                zipcode: 65421,
                geolocation: {
                    lat: -52.3792525,
                    long: 34.5147197
                }
            },
            phone: '1-234-567-8900'
        })
    })
)

beforeEach(() => {
    fetch.mockClear();
});

describe('Update User Account Component', () => { // unit tests for UpdateUser
    test('user account is updated upon submission', async () => {
        render(<UpdateUserAccount />)

        fireEvent.change(screen.getByLabelText(/First Name/i), {target: { value: 'James'}});
        fireEvent.change(screen.getByLabelText(/Last Name/i), {target: { value: 'Dean'}});
        fireEvent.change(screen.getByLabelText(/Username/i), {target: { value: 'ex@mpleMan'}});
        fireEvent.change(screen.getByLabelText(/Password/i), {target: { value: 'p@$$w0rD'}});
        fireEvent.change(screen.getByLabelText(/Email/i), {target: { value: 'jd@example.com' }})
        fireEvent.change(screen.getByLabelText(/Phone/i), {target: { value: '1-234-567-8900'}});
        fireEvent.change(screen.getByLabelText(/City/i), {target: { value: 'dudesville'}});
        fireEvent.change(screen.getByLabelText(/Street Address/i), {target: { value: '1342 cool street'}});
        fireEvent.change(screen.getByLabelText(/Zip Code/i), {target: { value: '65421'}});
        
        fireEvent.click(screen.getByText(/Update Account/i));

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/users/21', {
            method: 'PUT',
            body: JSON.stringify({
                email: 'jd@example.com', 
                username: "ex@mpleMan", 
                password: "p@$$w0rD", 
                name: {
                    firstname: 'James',
                    lastname: 'Dean',
                },
                address: {
                    city: 'dudesville',
                    street: '1342 cool street',
                    zipcode: "65421"
                },
                phone: '1-234-567-8900'
            }),
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        })
    });
    // unit test for button to delete a user account
    test('user data is deleted upon clicking the delete button', async () => {
        render(<UpdateUserAccount />)

        fireEvent.click(screen.getByText(/Delete Account/i));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/users/21', {
                method: 'DELETE',
            })
        });
    })
})