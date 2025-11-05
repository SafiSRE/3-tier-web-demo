// frontend/src/pages/Contact.jsx
import React, { useState } from 'react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Contact(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [msg,setMsg]=useState('');
  const [sent,setSent]=useState(false);
  const [error,setError]=useState(null);

  async function submit(e){
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(API + '/contact', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, message: msg })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSent(true);
      setName(''); setEmail(''); setMsg('');
    } catch (err) {
      setError(err.message || 'Network error');
    }
  }

  return (
    <div className="container" style={{maxWidth:800}}>
      <h2>Contact Us</h2>
      <div className="form" style={{display:'flex',gap:20,alignItems:'stretch'}}>
        <div style={{flex:1}}>
          <p>Have a question about a booking or need help? Send us a message and our team will respond within 24 hours.</p>
          {sent && <div style={{color:'green',marginBottom:8}}>Message sent — we will get back to you soon!</div>}
          {error && <div style={{color:'crimson',marginBottom:8}}>{error}</div>}
          <form onSubmit={submit}>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <label className="label">Message</label>
            <textarea className="input" rows="6" value={msg} onChange={e=>setMsg(e.target.value)} required />
            <div style={{marginTop:12}}>
              <button className="btn" type="submit">Send Message</button>
            </div>
          </form>
        </div>
        <div style={{width:260}}>
          <div className="form">
            <h4>Support</h4>
            <div className="small">Email: support@vistahomestays.example</div>
            <div className="small" style={{marginTop:8}}>Phone: +91-98765-43210</div>
            <div className="small" style={{marginTop:8}}>Hours: Mon–Sat 09:00–18:00</div>
          </div>
        </div>
      </div>
    </div>
  )
}
