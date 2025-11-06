// frontend/src/pages/AdminLogin.jsx - VERIFIED FINAL VERSION

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // CRITICAL: Ensure useNavigate is imported
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminLogin(){
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try{
      // Use the owner login endpoint, but the backend must verify role: 'admin'
      const res = await fetch(API + '/auth/owner/login', { 
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({email,password})
      });
      const data = await res.json();
      
      if(res.ok && data.user && data.user.role === 'admin'){
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        nav('/admin/dashboard');
      } else {
        setErr('Admin login failed. Check credentials and ensure account has "admin" role.');
      }
      
    }catch(e){
        console.error(e); 
        setErr('Network error');
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="container" style={{maxWidth:500}}>
      <h2>Admin Panel Login</h2>
      <div className="small" style={{marginBottom:15}}>
          Use your admin credentials to access management tools.
      </div>

      <form className="form" onSubmit={submit}>
        <label className="label">Admin Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label className="label">Password</label>
        <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} required />
        
        <div style={{marginTop:12}}>
          <button className="btn btn-cta" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
        
        {err && <div style={{color:'crimson',marginTop:8}}>{err}</div>}
      </form>
    </div>
  )
}