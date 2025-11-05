import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const res = await fetch(API + '/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
      const data = await res.json();
      if(res.ok){
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        nav('/');
      } else setErr(data.error || 'Login failed');
    }catch(e){console.error(e); setErr('Network error')}
  }

  return (
    <div className="container" style={{maxWidth:600}}>
      <h2>Login</h2>
      <form className="form" onSubmit={submit}>
        <label className="label">Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        <label className="label">Password</label>
        <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{marginTop:12}}>
          <button className="btn" type="submit">Login</button>
          <Link to="/register" style={{marginLeft:12}}>Register</Link>
        </div>
        {err && <div style={{color:'crimson',marginTop:8}}>{err}</div>}
      </form>
    </div>
  )
}
