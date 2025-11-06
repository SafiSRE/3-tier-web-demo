// frontend/src/pages/OwnerLogin.jsx (NEW FILE)

import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function OwnerLogin({ register = false }){
  const [name,setName]=useState(''); 
  const [email,setEmail]=useState(''); 
  const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const endpoint = register ? API + '/auth/owner/register' : API + '/auth/owner/login';
    
    try{
      const res = await fetch(endpoint, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({name,email,password})
      });
      const data = await res.json();
      
      if(res.ok){
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect owner to their dashboard
        nav('/owner/dashboard');
      } else setErr(data.error || (register ? 'Registration failed' : 'Login failed'));
      
    }catch(e){
        console.error(e); 
        setErr('Network error');
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="container" style={{maxWidth:600}}>
      <h2>{register ? 'Host Registration' : 'Host Login'}</h2>
      <div className="small" style={{marginBottom:15}}>
          {register 
            ? 'Sign up to list and manage your homestay properties.' 
            : 'Access your dedicated dashboard to manage listings and bookings.'
          }
      </div>

      <form className="form" onSubmit={submit}>
        {register && (
            <>
                <label className="label">Name</label>
                <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
            </>
        )}
        <label className="label">Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label className="label">Password</label>
        <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} required />
        
        <div style={{marginTop:12}}>
          <button className="btn btn-cta" type="submit" disabled={loading}>
              {loading ? 'Processing...' : (register ? 'Register as Host' : 'Host Login')}
          </button>
          
          <div style={{marginTop:15}}>
            {register ? (
                <Link to="/owner/login" className="small">Already a host? Log in here.</Link>
            ) : (
                <Link to="/owner/register" className="small">New host? Register your property.</Link>
            )}
          </div>
        </div>
        
        {err && <div style={{color:'crimson',marginTop:8}}>{err}</div>}
      </form>
    </div>
  )
}