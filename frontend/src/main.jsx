import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import './styles.css'

function App(){
  return (
    <BrowserRouter>
      <nav className="nav">
        <Link to="/">Vista Homestays</Link>
        <div>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
