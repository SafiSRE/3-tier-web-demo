import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Home(){
  const [homestays, setHomestays] = useState([]);
  useEffect(()=> {
    fetch(API + '/homestays').then(r=>r.json()).then(setHomestays).catch(console.error)
  },[]);

  return (
    <>
      <section className="hero" style={{backgroundImage:`url('/assets/hero_beach.jpg')`}}>
        <div className="container" style={{textAlign:'center'}}>
          <h1 className="hero-title">Vista Homestays</h1>
          <p className="hero-sub">Quiet beaches, warm hosts — book your stay</p>
        </div>
      </section>

      <div className="container">
        <h2>Available Homestays</h2>
        <div className="cards">
          {homestays.map(h => (
            <div className="card" key={h._id}>
              <img src={h.images && h.images[0] ? h.images[0] : '/assets/placeholder.jpg'} alt={h.name} />
              <div className="card-body">
                <div>
                  <h3>{h.name}</h3>
                  <p className="small">{h.description}</p>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
                  <div>
                    <div style={{fontWeight:800}}>${h.pricePerNight} / night</div>
                    <div className="small">Includes 18% GST in final price</div>
                  </div>
                  <Link className="btn" to={'/book/' + h._id}>Book Now</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        © Vista Homestays
      </footer>
    </>
  )
}
