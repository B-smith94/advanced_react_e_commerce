import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login';

global.fetch = jest.fn(() => 
    Promise.resolve({
        json: () => Promise.resolve({ id: 101, title: 'foo', body: 'bar', userId: 1})
    })
);

beforeEach(() => {
    fetch.mockClear();
});

describe('Login Component', () => {
    test('all user accounts are rendered after running the fetch function', async () => {
        render(<Login />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/users')
        });
    });
});