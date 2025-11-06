// frontend/src/pages/SupportAdmin.jsx (NEW FILE)

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function SupportAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
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
      const res = await fetch(API + '/admin/requests', { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load requests');
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError("Could not load support requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    if (!window.confirm('Mark this request as RESOLVED/PROCESSED?')) return;
    try {
        const res = await fetch(API + '/admin/requests/' + id, {
            method: 'DELETE', // DELETE simulates marking as resolved
            headers: { Authorization: "Bearer " + token },
        });
        if (!res.ok) throw new Error('Could not resolve request.');
        
        // Remove from local state
        setRequests(requests.filter(r => r._id !== id));
    } catch (err) {
        alert(err.message);
    }
  };

  if (loading) return <div className="container form">Loading Support Admin Panel...</div>;
  if (error) return <div className="container form" style={{color:'crimson'}}>{error}</div>;

  return (
    <div className="container" style={{maxWidth: 1000}}>
      <h2>Support Request Admin</h2>
      <div className="small">Total Pending Requests: {requests.length}</div>
      
      <div style={{marginTop:20}}>
        {requests.map(r => (
          <div key={r._id} className="form" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:20, marginBottom:10}}>
            <div style={{flex:1}}>
                <div style={{fontWeight:800, fontSize:16}}>{r.name}</div>
                <div className="small">Email: {r.email} | Submitted: {new Date(r.createdAt).toLocaleDateString()}</div>
                <p style={{marginTop:10, padding:10, background:'#f1f5f9', borderRadius:6, borderLeft:'3px solid #0ea5a4'}}>
                    **Message:** {r.message}
                </p>
            </div>
            <button onClick={() => handleResolve(r._id)} className="btn btn-cta" style={{background:'#10b981', minWidth:120}}>
                Resolve
            </button>
          </div>
        ))}
        {requests.length === 0 && <div className="form">No outstanding support or listing requests.</div>}
      </div>
    </div>
  );
}