import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userAccountsReducer from '../features/userAccounts/userAccountsSlice.jsx'
import '@testing-library/jest-dom';
import CreateUserAccount from '../components/CreateUserAccount.jsx';

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

describe('CreateUserAccount Component', () => { // integration test for CreateUser
    
    const initialState = {
        user: null,
        error: null,
    }

    const renderWrapper = (ui) => { // adds various wrappers for testing purposes
        const store = configureStore({
            reducer: {
                userAccount: userAccountsReducer,
            },
            preloadedState: initialState,
        });
        
        const queryClient = new QueryClient();
    
        return render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>{ui}</BrowserRouter>
                </QueryClientProvider>
            </Provider>
        )
    };
    
    test('adds new user to the database upon submit', async () => {
        renderWrapper(<CreateUserAccount />)

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