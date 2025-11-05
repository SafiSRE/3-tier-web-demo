// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TestimonialCarousel from '../components/TestimonialCarousel'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AmenityIcon({ type }) {
  // simple inline SVG icons — compact and dependency-free
  if (type === 'wifi') return <svg width="18" height="18" viewBox="0 0 24 24" style={{display:'inline-block',verticalAlign:'middle'}}><path fill="#0f172a" d="M12 18c.8 0 1.5-.7 1.5-1.5S12.8 15 12 15s-1.5.7-1.5 1.5S11.2 18 12 18zm-4-3.2a6 6 0 018 0l1.3-1.3a8 8 0 00-10.6 0L8 14.8zm-2.8-2.8a10 10 0 0115.6 0L22 10.2a12 12 0 00-18 0L5.2 12z"/></svg>
  if (type === 'breakfast') return <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#0f172a" d="M3 17h18v2H3zM6 6h12v2H6zM8 9h8v2H8z"/></svg>
  if (type === 'sea') return <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#0f172a" d="M2 17c4 0 4-3 8-3s4 3 8 3v2H2v-2z"/></svg>
  return null
}

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
                <input className="input" placeholder="Min ₹600" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
                <input className="input" placeholder="Max ₹1500" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
              </div>
              <div style={{marginTop:10, display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div className="small">Prices shown in INR • GST 18% included</div>
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
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <h3 style={{margin:0}}>{h.name}</h3>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontWeight:800, fontSize:16}}>₹{h.pricePerNight}</div>
                      <div className="small">/ night • incl. 18% GST</div>
                    </div>
                  </div>

                  <p className="small" style={{marginTop:6}}>{h.description || 'Charming homestay'}</p>

                  {/* Rating */}
                  <div style={{marginTop:8, display:'flex',alignItems:'center',gap:8}}>
                    <div style={{display:'flex',alignItems:'center',gap:4}}>
                      {/* show stars based on h.rating (0-5) */}
                      {Array.from({length:5}).map((_,i)=> {
                        const r = Math.round(h.rating || 4);
                        return <span key={i} style={{color: i < r ? '#f59e0b' : '#e6edf3'}}>★</span>
                      })}
                    </div>
                    <div className="small" style={{color:'#64748b'}}>{h.rating ? h.rating.toFixed(1) : '4.0'} • {h.reviews || 12} reviews</div>
                  </div>

                  {/* Amenities icons */}
                  <div style={{marginTop:10, display:'flex',gap:12,alignItems:'center'}}>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <AmenityIcon type="wifi" /> <span className="small">WiFi</span>
                    </div>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <AmenityIcon type="breakfast" /> <span className="small">Breakfast</span>
                    </div>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <AmenityIcon type="sea" /> <span className="small">Sea view</span>
                    </div>
                  </div>
                </div>

                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
                  <div>
                    <div className="small">Free cancellation • Instant confirmation</div>
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

        {/* Testimonial carousel */}
        <section style={{marginTop:28}}>
          <h2>Guest reviews</h2>
          <TestimonialCarousel />
        </section>

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
