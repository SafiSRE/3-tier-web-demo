// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Home(){
  const [homestays, setHomestays] = useState([]);
  const [q, setQ] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(()=> {
    fetch(API + '/homestays').then(r=>r.json()).then(setHomestays).catch(console.error)
  },[]);

  const filtered = homestays.filter(h => {
    if(q && !h.name.toLowerCase().includes(q.toLowerCase())) return false;
    if(minPrice && h.pricePerNight < Number(minPrice)) return false;
    if(maxPrice && h.pricePerNight > Number(maxPrice)) return false;
    return true;
  });

  return (
    <>
      <section className="hero" style={{backgroundImage:`url('/assets/hero_beach.jpg')`}}>
        <div className="hero-overlay"></div>
        <div className="hero-inner container">
          <div className="hero-left">
            <h1 className="hero-title">Vista Homestays</h1>
            <p className="hero-sub">Discover handpicked homestays, private hosts, and coastal escapes. Book trusted stays with easy cancellation.</p>
            <div style={{marginTop:16}}>
              <a className="btn btn-cta" href="#browse">Browse Homestays</a>
              <a className="btn btn-ghost" href="/contact" style={{marginLeft:12}}>Contact Us</a>
            </div>
          </div>
          <div className="hero-right">
            <div className="search-card">
              <input className="input" placeholder="Search by name" value={q} onChange={e=>setQ(e.target.value)} />
              <div style={{display:'flex',gap:8, marginTop:8}}>
                <input className="input" placeholder="Min $600" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
                <input className="input" placeholder="Max $1500" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
              </div>
              <div style={{marginTop:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div className="small">Best Prices • 18% GST included</div>
                <div style={{display:'flex',gap:8}}>
                  <a className="btn" href="#browse">Search</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container" id="browse">
        <h2 style={{marginTop:24}}>Featured Homestays</h2>

        <div className="filter-bar">
          <div className="small">Showing {filtered.length} of {homestays.length}</div>
          <div style={{display:'flex',gap:8}}>
            <select className="input" onChange={(e)=>{ const val=e.target.value; if(val==='low') setHomestays(h => [...h].sort((a,b)=>a.pricePerNight-b.pricePerNight)); if(val==='high') setHomestays(h => [...h].sort((a,b)=>b.pricePerNight-a.pricePerNight)); }}>
              <option value="">Sort</option>
              <option value="low">Price low→high</option>
              <option value="high">Price high→low</option>
            </select>
          </div>
        </div>

        <div className="cards">
          {filtered.map(h => (
            <div className="card card-large" key={h._id}>
              <div className="card-media">
                <img src={h.images && h.images[0] ? h.images[0] : '/assets/placeholder.jpg'} alt={h.name} />
              </div>
              <div className="card-body">
                <div>
                  <h3 style={{margin:0}}>{h.name}</h3>
                  <p className="small" style={{marginTop:6}}>{h.description || 'Charming homestay'}</p>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
                  <div>
                    <div style={{fontWeight:800}}>${h.pricePerNight} <span className="small">/ night</span></div>
                    <div className="small">Inclusive of 18% GST</div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    <Link className="btn" to={'/book/' + h._id}>Book</Link>
                    <Link className="btn btn-ghost" to={'/book/' + h._id}>Details</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="footer" style={{marginTop:28}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
            <div>© {new Date().getFullYear()} Vista Homestays</div>
            <div style={{display:'flex',gap:12}}>
              <a href="/contact" className="small">Contact</a>
              <a href="/support" className="small">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
