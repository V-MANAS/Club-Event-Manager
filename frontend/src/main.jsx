import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/App';
import Login from './pages/Login';
import Register from './pages/Register';
import Clubs from './pages/Clubs';
import Events from './pages/Events';
import './styles.css'; // ✅ use Tailwind + custom CSS

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/clubs' element={<Clubs />} />
      <Route path='/events' element={<Events />} />
    </Routes>
  </BrowserRouter>
);
