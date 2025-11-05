import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Register(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const res = await fetch(API + '/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password})});
      const data = await res.json();
      if(res.ok){
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        nav('/');
      } else setErr(data.error || 'Register failed');
    }catch(e){console.error(e); setErr('Network error')}
  }

  return (
    <div className="container" style={{maxWidth:600}}>
      <h2>Register</h2>
      <form className="form" onSubmit={submit}>
        <label className="label">Name</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} />
        <label className="label">Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        <label className="label">Password</label>
        <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{marginTop:12}}>
          <button className="btn" type="submit">Register</button>
          <Link to="/login" style={{marginLeft:12}}>Login</Link>
        </div>
        {err && <div style={{color:'crimson',marginTop:8}}>{err}</div>}
      </form>
    </div>
  )
}
