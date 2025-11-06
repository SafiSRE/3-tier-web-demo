// frontend/src/pages/AdminDashboard.jsx - VERIFIED FINAL VERSION

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // CRITICAL: Ensure imports are present

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Check if user is logged in AND has the admin role
    if (!token || (user && user.role !== 'admin')) {
      nav('/admin/login', { replace: true });
      return;
    }
    fetchData();
  }, [token, user, nav]);

const fetchData = async () => {
    setLoading(true);
    try {
        const headers = { Authorization: "Bearer " + token };
        const listingRes = await fetch(API + '/admin/homestays', { headers });
        const listingData = await listingRes.json();
        if (!listingRes.ok) throw new Error(listingData.error || 'Failed to load listings');
        setListings(listingData);
    } catch (err) {
        console.error(err);
        setError("Could not load dashboard data. Check your network and backend.");
    } finally {
        // CRITICAL: This must run whether try succeeds or catch fails
        setLoading(false); 
    }
};

  const handleStatusChange = async (id, isApproved) => {
    try {
        const res = await fetch(API + `/admin/homestays/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: "Bearer " + token },
            body: JSON.stringify({ isApproved }),
        });
        if (!res.ok) throw new Error('Status update failed.');
        
        setListings(listings.map(l => l._id === id ? { ...l, isApproved } : l));
        alert(`Listing status set to: ${isApproved ? 'APPROVED' : 'REJECTED'}`);
        
    } catch (err) {
        alert(err.message);
    }
  };

  if (loading) return <div className="container form">Loading Admin Dashboard...</div>;
  if (error) return <div className="container form" style={{color:'crimson'}}>{error}</div>;

  return (
    <div className="container" style={{maxWidth: 1000}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Admin Homestay Management</h2>
        <Link to="/admin/support" className="btn btn-ghost" style={{borderColor:'#0ea5a4', color:'#0ea5a4'}}>Support Requests ({listings.length})</Link>
      </div>

      <div style={{marginTop:20}}>
        {listings.map(l => (
          <div key={l._id} className="form" style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:20, marginBottom:10}}>
            <div style={{flex:1}}>
                <div style={{fontWeight:800, fontSize:18, color: l.isApproved ? '#10b981' : '#f59e0b'}}>{l.name} ({l.isApproved ? 'Approved' : 'Pending'})</div>
                <div className="small">Owner: {l.owner.name} ({l.owner.email}) | Price: ₹{l.pricePerNight}</div>
            </div>
            <div style={{display:'flex', gap:10}}>
                {!l.isApproved && <button onClick={() => handleStatusChange(l._id, true)} className="btn btn-cta" style={{background:'#10b981'}}>Approve</button>}
                {l.isApproved && <button onClick={() => handleStatusChange(l._id, false)} className="btn btn-danger">Reject/Unapprove</button>}
                <a href={`/book/${l._id}`} target="_blank" className="btn btn-ghost">View Details</a>
            </div>
          </div>
        ))}
        {listings.length === 0 && <div className="form">No homestays to manage.</div>}
      </div>
    </div>
  );
}