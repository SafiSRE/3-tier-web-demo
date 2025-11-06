// frontend/src/pages/OwnerDashboard.jsx (NEW FILE)
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function OwnerDashboard() {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // 1. Authentication Check
    if (!token || (user && user.role !== 'owner')) {
      // Not logged in or not an owner -> redirect to owner login
      nav('/owner/login', { replace: true });
      return;
    }

    const fetchOwnerData = async () => {
      try {
        const headers = { Authorization: "Bearer " + token };

        // Fetch Listings (Homestay Management)
        const listingRes = await fetch(API + '/homestays/owner/mine', { headers });
        const listingData = await listingRes.json();
        if (!listingRes.ok) throw new Error(listingData.error || 'Failed to load listings');
        setListings(listingData);

        // Fetch Bookings (Revenue Tracking)
        const bookingRes = await fetch(API + '/bookings/owner/all', { headers });
        const bookingData = await bookingRes.json();
        if (!bookingRes.ok) throw new Error(bookingData.error || 'Failed to load bookings');
        setBookings(bookingData);
        
      } catch (err) {
        console.error(err);
        setError("Could not load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerData();
  }, [token, user, nav]);


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
        const res = await fetch(API + '/homestays/' + id, {
            method: 'DELETE',
            headers: { Authorization: "Bearer " + token },
        });
        if (!res.ok) {
             const data = await res.json();
             throw new Error(data.error || 'Deletion failed.');
        }
        // Remove from state on success
        setListings(listings.filter(l => l._id !== id));
    } catch (err) {
        alert(err.message);
    }
  };


  if (loading) return <div className="container form">Loading Owner Dashboard...</div>;
  if (error) return <div className="container form" style={{color:'crimson'}}>{error}</div>;

  return (
    <div className="container">
      <h2>Owner Dashboard</h2>
      <p className="small">Welcome, {user.name}. Manage your properties and incoming bookings here.</p>

      {/* --- 1. Listing Management Section --- */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20, borderBottom:'1px solid #e2e8f0', paddingBottom:10}}>
          <h3>Your Homestays ({listings.length})</h3>
          <Link to="/owner/create-listing" className="btn btn-cta">➕ Create New Listing</Link>
      </div>

      <div className="booking-list" style={{marginTop:15}}>
        {listings.length === 0 && <div className="form">You have no active listings. Start by creating one!</div>}
        {listings.map(l => (
          <div key={l._id} className="form" style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:20}}>
            <div style={{flex:1}}>
                <div style={{fontWeight:800, fontSize:18}}>{l.name}</div>
                <div className="small">Price: ₹{l.pricePerNight} / night | Bookings: {bookings.filter(b => b.homestay._id === l._id).length}</div>
            </div>
            <div style={{display:'flex', gap:10}}>
                <Link to={`/owner/edit/${l._id}`} className="btn btn-ghost" style={{borderColor: '#0ea5a4', color: '#0ea5a4'}}>Edit</Link>
                <button onClick={() => handleDelete(l._id)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* --- 2. Bookings Overview Section (Simple) --- */}
      <h3 style={{marginTop:40}}>Bookings Overview ({bookings.length})</h3>
      <div className="form">
          <p className="small">Total Bookings Received: **{bookings.length}**</p>
          <p className="small">Total Revenue: **₹{bookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}**</p>
          <p className="small">You can view detailed booking information here (future expansion).</p>
      </div>

    </div>
  );
}