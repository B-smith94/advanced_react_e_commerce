import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import ProductCatalog from '../components/ProductCatalog';
import { Provider } from 'react-redux';
import { store } from '../store';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const createQueryClient = () => 
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                cacheTime: 0,
                staleTime: 0,
                refetchOnWindowFocus: false,
            },
        },
    });

// Mock fetch to return mock data
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
            {
                id: 1,
                title: 'Product 1',
                category: 'Category 1',
                description: 'Description for product 1',
                price: 100,
                image: 'https://via.placeholder.com/150'
            }
        ]), // Ensure mockProducts is returned
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
        expect(await screen.findByText('Product 1'));
        expect(await screen.findByText('$100'));
    });
});