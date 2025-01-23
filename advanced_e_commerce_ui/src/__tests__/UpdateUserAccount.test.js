import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store.jsx';
import { logIn } from '../features/userAccounts/userAccountsSlice.jsx';
import '@testing-library/jest-dom';
import UpdateUserAccount from '../components/UpdateUserAccount.jsx';

global.fetch = jest.fn((options) => {
    if (options && options.method === 'DELETE') {
        return Promise.resolve({
            status: 200, 
            json: () => Promise.resolve({ message: 'Account deleted' })
        });
    }
    return Promise.resolve({
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
    });
});

beforeEach(() => {
    fetch.mockClear();

    store.dispatch(logIn({
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
    }));
    console.log('Redux state after login:', store.getState().userAccount.user);
});

describe('Update User Account Component', () => { // unit tests for UpdateUser

    const renderWrapper = (ui) => { // adds various wrappers for testing purposes
        
        const queryClient = new QueryClient();
    
        return render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>{ui}</BrowserRouter>
                </QueryClientProvider>
            </Provider>
        )
    };

    test('user account is updated upon submission', async () => {
        renderWrapper(<UpdateUserAccount />);

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
        
        renderWrapper(<UpdateUserAccount />)

        store.dispatch(logIn({
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
        }))

        fireEvent.click(screen.getByText(/Delete Account/i));

        const modal = await waitFor(() => screen.getByRole('dialog'));
        expect(modal).toBeInTheDocument();

        const deleteButton = within(modal).getByRole('button', { name: /Delete/i });
        expect(deleteButton).not.toBeDisabled();


        fireEvent.click(deleteButton);


        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/users/21', {
                method: 'DELETE',
            })
        });
    })
})