import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Homepage from './components/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import ShoppingCart from './components/ShoppingCart.jsx';
import Logout from './components/Logout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateUserAccount from './components/CreateUserAccount.jsx';
import UpdateUserAccount from './components/UpdateUserAccount.jsx';
import './App.css'

function App() {
  const queryClient = new QueryClient()

  return (                        
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/home' element={<Homepage />} />
        <Route path='/cart' element={<ShoppingCart />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/add-account' element={<CreateUserAccount />} />
        <Route path='/update-account' element={<UpdateUserAccount />} />
      </Routes>
    </QueryClientProvider>  

  )
}

export default App
