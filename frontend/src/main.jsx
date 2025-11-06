// frontend/src/main.jsx - ENHANCED FOR OWNER PORTAL

import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
// ... existing imports ...
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import Contact from './pages/Contact'
import Support from './pages/Support'
// --- NEW OWNER IMPORTS ---
import OwnerLogin from './pages/OwnerLogin' // New
import OwnerDashboard from './pages/OwnerDashboard' // New
import CreateHomestay from './pages/CreateHomestay' // New

import './styles.css'

function AccountMenu(){
  const [open, setOpen] = React.useState(false);
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isOwner = user && user.role === 'owner';
  const isCustomer = user && user.role === 'customer';

  React.useEffect(() => {
    // ... existing handleClickOutside logic ...
    function handleClickOutside(e){
      const el = document.getElementById('account-dropdown-root');
      if(!el) return;
      if(!el.contains(e.target)){
        setOpen(false);
      }
    }
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  if(!token){
    return (
        <div style={{display:'flex', gap:10}}>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/owner/login" className="nav-link small">Host Login</Link>
        </div>
    );
  }

  function doLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/';
  }

  return (
    <div id="account-dropdown-root" style={{position:'relative', display:'inline-block'}}>
      <button className="btn account-btn" onClick={(e)=>{e.stopPropagation(); setOpen(!open)}}>
        {user && user.name ? user.name : 'Account'} ({isOwner ? 'Owner' : 'Guest'})
      </button>
      {open && (
        <div className="dropdown-menu">
            {isCustomer && <Link className="dropdown-item" to="/my-bookings">My Bookings</Link>}
            {isOwner && <Link className="dropdown-item" to="/owner/dashboard">Owner Dashboard</Link>}
            <button className="dropdown-item" onClick={doLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

function App(){
  return (
    <BrowserRouter>
      {/* Navigation Bar (unchanged) */}
      <nav className="nav">
        <Link to="/" className="brand">
          <img src="/assets/logo.svg" alt="Vista Homestays" className="logo" />
        </Link>
        <div className="nav-right">
          <Link to="/" className="nav-link">Home</Link>
          {/* New link to owner section */}
          <Link to="/owner/dashboard" className="nav-link">Host</Link> 
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/support" className="nav-link">Support</Link>
          <AccountMenu />
        </div>
      </nav>

      <Routes>
        {/* Customer Routes (Existing) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        
        {/* --- NEW OWNER PORTAL ROUTES --- */}
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/register" element={<OwnerLogin register={true} />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/create-listing" element={<CreateHomestay />} />
        <Route path="/owner/edit/:id" element={<CreateHomestay />} /> {/* Re-use Create component */}
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)