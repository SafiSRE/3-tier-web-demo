// frontend/src/main.jsx
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
import './styles.css'

function AccountMenu(){
  const [open, setOpen] = React.useState(false);
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

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
    return <Link to="/login" className="nav-link">Login</Link>;
  }

  function doLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/';
  }

  return (
    <div id="account-dropdown-root" style={{position:'relative', display:'inline-block'}}>
      <button className="btn account-btn" onClick={(e)=>{e.stopPropagation(); setOpen(!open)}}>
        {user && user.name ? user.name : 'Account'}
      </button>
      {open && (
        <div className="dropdown-menu">
          <Link className="dropdown-item" to="/my-bookings">My Bookings</Link>
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
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/support" className="nav-link">Support</Link>
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
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
