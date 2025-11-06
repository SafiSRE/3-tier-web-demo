// frontend/src/main.jsx - VERIFIED FINAL VERSION

import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import Contact from './pages/Contact'
import Support from './pages/Support' 
import OwnerLogin from './pages/OwnerLogin' 
import OwnerDashboard from './pages/OwnerDashboard' 
import CreateHomestay from './pages/CreateHomestay' 
import ListHomestayRequest from './pages/ListHomestayRequest'; 
import AdminLogin from './pages/AdminLogin' // CRITICAL NEW IMPORT
import AdminDashboard from './pages/AdminDashboard' // CRITICAL NEW IMPORT
import SupportAdmin from './pages/SupportAdmin' // CRITICAL NEW IMPORT

import './styles.css'

function AccountMenu(){
  const [open, setOpen] = React.useState(false);
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isOwner = user && user.role === 'owner';
  const isCustomer = user && user.role === 'customer';
  const isAdmin = user && user.role === 'admin'; // Check for admin role

  React.useEffect(() => {
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
      <div id="account-dropdown-root" style={{position:'relative', display:'inline-block'}}>
        <button className="btn account-btn" onClick={(e)=>{e.stopPropagation(); setOpen(!open)}}>
          Login
        </button>
        {open && (
          <div className="dropdown-menu">
            <Link className="dropdown-item" to="/login">Login (Customer)</Link>
            <Link className="dropdown-item" to="/owner/login">Homeowner Login</Link>
          </div>
        )}
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
        {user && user.name ? user.name : 'Account'} ({isAdmin ? 'Admin' : (isOwner ? 'Owner' : 'Guest')})
      </button>
      {open && (
        <div className="dropdown-menu">
            {isCustomer && <Link className="dropdown-item" to="/my-bookings">My Bookings</Link>}
            {isOwner && <Link className="dropdown-item" to="/owner/dashboard">Owner Dashboard</Link>}
            {isAdmin && <Link className="dropdown-item" to="/admin/dashboard">Admin Dashboard</Link>}
            <button className="dropdown-item" onClick={doLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

function App(){
  return (
    <BrowserRouter>
      <nav className="nav">
        <Link to="/" className="brand">
          <img src="/assets/logo.svg" alt="Vista Homestays" className="logo" />
        </Link>
        <div className="nav-right">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/list-homestay-request" className="nav-link nav-link-ghost">List Your Homestay</Link> 
          <Link to="/contact" className="nav-link nav-link-ghost">Contact</Link>
          <AccountMenu />
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        <Route path="/list-homestay-request" element={<ListHomestayRequest />} />
        
        {/* OWNER PORTAL ROUTES */}
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/register" element={<OwnerLogin register={true} />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/create-listing" element={<CreateHomestay />} />
        <Route path="/owner/edit/:id" element={<CreateHomestay />} />
        
        {/* ADMIN PORTAL ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/support" element={<SupportAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)