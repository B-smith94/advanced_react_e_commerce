import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCatalog from '../components/ProductCatalog';
import { Provider } from 'react-redux';
import { store } from '../store';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const createQueryClient = () => new QueryClient();

// Mock product data
const mockProducts = [
    {
        id: 1,
        title: 'Product 1',
        category: 'Category 1',
        description: 'Description for product 1',
        price: 100,
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 2,
        title: 'Product 2',
        category: 'Category 2',
        description: 'Description for product 2',
        price: 200,
        image: 'https://via.placeholder.com/150'
    }
];

// Mock fetch to return mock data
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(mockProducts)
    })
);

describe('ProductCatalog Component', () => {
    let queryClient;

    beforeEach(() => {
        queryClient = createQueryClient();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const renderWithProviders = (ui) =>
        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>{ui}</BrowserRouter>
                </QueryClientProvider>
            </Provider>
        );

    it('renders all products on page load', async () => {
        renderWithProviders(<ProductCatalog />);

        // Ensure products are displayed
        expect(screen.findByText(/Product 1/i));
        expect(screen.findByText(/Product 2/i));
        expect(screen.findByText('$100'));
        expect(screen.findByText('$200'));
    });
});