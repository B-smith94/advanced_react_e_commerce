import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { store } from './store.jsx';
import { Provider } from 'react-redux';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(//sets up the react-router-dom functions
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}> {/* Import store and Provider, then wrap App in Provider, set store=store */}
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)