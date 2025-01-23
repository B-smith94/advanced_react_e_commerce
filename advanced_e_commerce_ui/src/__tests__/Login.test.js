import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { Provider } from 'react-redux';
import { store } from '../store';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Create a new QueryClient instance for each test
const createQueryClient = () => new QueryClient();

describe('Login Component', () => {
    let queryClient;

    beforeEach(() => {
        queryClient = createQueryClient(); // Ensure a fresh QueryClient for every test
        jest.clearAllMocks(); // Reset mocks between tests
        global.fetch = jest.fn(); // Mock fetch API
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore original mocks after tests
    });

    const renderWithProviders = (ui) =>
        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>{ui}</BrowserRouter>
                </QueryClientProvider>
            </Provider>
        );

    it('renders the login form correctly', () => {
        renderWithProviders(<Login />);

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('shows error on invalid login credentials', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [{ username: 'testuser', password: 'testpass' }],
        });

        renderWithProviders(<Login />);

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
        });
    });
});