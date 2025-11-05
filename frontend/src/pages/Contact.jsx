// frontend/src/pages/Contact.jsx - WITH CAPTCHA ENHANCEMENT

import React, { useState, useEffect } from 'react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- CAPTCHA Logic ---
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    const question = `What is ${num1} + ${num2}?`;
    const answer = num1 + num2;
    return { question, answer };
}

export default function Contact(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [msg,setMsg]=useState('');
  const [sent,setSent]=useState(false);
  const [error,setError]=useState(null);
  const [loading, setLoading] = useState(false);

  // New CAPTCHA states
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  
  // Refresh CAPTCHA on load/reset
  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  async function submit(e){
    e.preventDefault();
    setError(null);
    setSent(false);

    // --- CAPTCHA VALIDATION ---
    if (Number(captchaInput) !== captcha.answer) {
        setError('Incorrect CAPTCHA answer. Please try again.');
        setCaptcha(generateCaptcha()); // Regenerate question
        setCaptchaInput('');
        return; 
    }
    // --- END CAPTCHA VALIDATION ---

    setLoading(true);
    
    try {
      const res = await fetch(API + '/contact', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, message: msg })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');
      
      setSent(true);
      setName(''); setEmail(''); setMsg('');
      setCaptcha(generateCaptcha()); // Regenerate CAPTCHA on successful send
      setCaptchaInput('');
      
    } catch (err) {
      setError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  // Simple icon for contact details (unchanged)
  const ContactIcon = ({ path }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{verticalAlign:'middle'}}><path fill="#fff" d={path}/></svg>
  );


  return (
    <div className="container" style={{maxWidth:1000}}>
      <h2>Contact Us</h2>
      
      <div className="form" style={{display:'flex',gap:30,alignItems:'stretch', padding:0, background:'transparent', boxShadow:'none'}}>
        
        {/* --- Left Column: Contact Form --- */}
        <div style={{flex:1, padding:'24px', background:'white', borderRadius:'12px', boxShadow:'0 6px 18px rgba(2,6,23,0.06)'}}>
          <p>Have a question about a booking or need help? Send us a message and our team will respond within 24 hours.</p>
          
          {/* Feedback Messages (unchanged) */}
          {sent && <div style={{padding:'10px 15px', background:'#e6ffed', color:'#22c55e', borderRadius:'8px', marginBottom:12, fontWeight:600}}>
            ✅ Message sent successfully — we will get back to you soon!
          </div>}
          {error && <div style={{padding:'10px 15px', background:'#fee2e2', color:'#dc2626', borderRadius:'8px', marginBottom:12, fontWeight:600}}>
            ❌ Error: {error}
          </div>}
          
          <form onSubmit={submit}>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <label className="label">Message</label>
            <textarea className="input" rows="6" value={msg} onChange={e=>setMsg(e.target.value)} required />
            
            {/* --- CAPTCHA INTEGRATION --- */}
            <label className="label" style={{marginTop:20}}>Security Check</label>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div style={{fontWeight:800, padding:'10px 15px', background:'#f1f5f9', borderRadius:8, border:'1px solid #e2e8f0', minWidth:150}}>
                    {captcha.question}
                </div>
                <input 
                    className="input" 
                    type="number" 
                    placeholder="Your answer" 
                    value={captchaInput} 
                    onChange={e=>setCaptchaInput(e.target.value)} 
                    required 
                    style={{flexGrow:1}}
                />
            </div>
            {/* --- END CAPTCHA INTEGRATION --- */}

            <div style={{marginTop:20}}>
              <button className="btn btn-cta" type="submit" disabled={loading} style={{minWidth:150}}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
        
        {/* --- Right Column: Support Info Card (unchanged) --- */}
        <div style={{width:300}}>
          <div className="form" style={{background:'#0ea5a4', color:'white', padding:'24px', boxShadow:'0 6px 18px rgba(14, 165, 164, 0.4)'}}>
            <h4 style={{marginTop:0, color:'white'}}>Contact Details</h4>
            
            <div style={{display:'flex',alignItems:'center',gap:12,marginTop:16}}>
              <ContactIcon path="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              <div>
                <div style={{fontWeight:600}}>Email</div>
                <div className="small" style={{color:'rgba(255,255,255,0.85)'}}>support@vistahomestays.example</div>
              </div>
            </div>
            
            <div style={{display:'flex',alignItems:'center',gap:12,marginTop:16}}>
              <ContactIcon path="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 16H6V6h12v12z"/>
              <div>
                <div style={{fontWeight:600}}>Phone</div>
                <div className="small" style={{color:'rgba(255,255,255,0.85)'}}>+91-98765-43210</div>
              </div>
            </div>
            
            <div style={{display:'flex',alignItems:'center',gap:12,marginTop:16}}>
              <ContactIcon path="M12 11.5A2.5 2.5 0 009.5 9a2.5 2.5 0 000 5a2.5 2.5 0 002.5-2.5zm0-7.5a7.5 7.5 0 00-7.5 7.5c0 4.19 5.86 11.38 7.5 11.38s7.5-7.19 7.5-11.38A7.5 7.5 0 0012 4z"/>
              <div>
                <div style={{fontWeight:600}}>Support Hours</div>
                <div className="small" style={{color:'rgba(255,255,255,0.85)'}}>Mon–Sat 09:00–18:00 IST</div>
              </div>
            </div>
            
            <a href="/support" className="btn btn-ghost" style={{display:'block', width:'100%', marginTop:24, borderColor:'white', color:'white'}}>
              View Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}