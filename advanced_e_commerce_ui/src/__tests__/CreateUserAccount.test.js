import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateUserAccount from '../components/CreateUserAccount';

global.fetch = jest.fn(() => 
    Promise.resolve({
        json: () => Promise.resolve({ 
            id: 21, 
            email: 'jd@example.com', 
            username: "ex@mpleMan", 
            password: "p@$$w0rD", 
            name: {
                firstname: 'Jimmy',
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
);

beforeEach(() => {
    fetch.mockClear();
});

describe('CreateUserAccount Component', () => {
    test('adds new user to the database upon submit', async () => {
        render(<CreateUserAccount />)

        fireEvent.change(screen.getByLabelText(/First Name/i), {target: { value: 'Jimmy'}});
        fireEvent.change(screen.getByLabelText(/Last Name/i), {target: { value: 'Dean'}});
        fireEvent.change(screen.getByLabelText(/Username/i), {target: { value: 'ex@mpleMan'}});
        fireEvent.change(screen.getByLabelText(/Password/i), {target: { value: 'p@$$w0rD'}});
        fireEvent.change(screen.getByLabelText(/Email/i), {target: { value: 'jd@example.com' }})
        fireEvent.change(screen.getByLabelText(/Phone/i), {target: { value: '1-234-567-8900'}});
        fireEvent.change(screen.getByLabelText(/City/i), {target: { value: 'dudesville'}});
        fireEvent.change(screen.getByLabelText(/Street Address/i), {target: { value: '1342 cool street'}});
        fireEvent.change(screen.getByLabelText(/Zip Code/i), {target: { value: '65421'}});



        fireEvent.click(screen.getByText(/Create Account/i));

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/users', {
            method: "POST",
            body: JSON.stringify({
                email: 'jd@example.com', 
                username: "ex@mpleMan", 
                password: "p@$$w0rD", 
                name: {
                    firstname: 'Jimmy',
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
    })
})