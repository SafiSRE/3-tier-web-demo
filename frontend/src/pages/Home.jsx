// frontend/src/pages/Home.jsx - FINAL ENHANCEMENT

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TestimonialCarousel from '../components/TestimonialCarousel'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- NEW Hero Images Array ---
const heroImages = [
    '/assets/hero_1.jpg',
    '/assets/hero_2.jpg', // You must add this image
    '/assets/hero_3.jpg', // You must add this image
    '/assets/hero_4.jpg',       // You must add this image
    '/assets/hero_5.jpg',       // You must add this image
    '/assets/hero_6.jpg',       // You must add this image
    //'/assets/hero_7.jpg',       // You must add this image
    //'/assets/hero_8.jpg',       // You must add this image
    //'/assets/hero_9.jpg',       // You must add this image
    //'/assets/hero_10.jpg',       // You must add this image
];

// Simple SVG icons (unchanged)
function AmenityIcon({ type }) {
  if (type === 'wifi') return <svg width="16" height="16" viewBox="0 0 24 24" style={{display:'inline-block',verticalAlign:'middle'}}><path fill="currentColor" d="M12 18c.8 0 1.5-.7 1.5-1.5S12.8 15 12 15s-1.5.7-1.5 1.5S11.2 18 12 18zm-4-3.2a6 6 0 018 0l1.3-1.3a8 8 0 00-10.6 0L8 14.8zm-2.8-2.8a10 10 0 0115.6 0L22 10.2a12 12 0 00-18 0L5.2 12z"/></svg>
  if (type === 'breakfast') return <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17h18v2H3zM6 6h12v2H6zM8 9h8v2H8z"/></svg>
  if (type === 'sea') return <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M2 17c4 0 4-3 8-3s4 3 8 3v2H2v-2z"/></svg>
  return null
}
function StarIcon({ filled }) {
  return <span style={{ color: filled ? '#f59e0b' : '#d1d5db', fontSize: 18 }}>★</span>
}

export default function Home(){

    // --- NEW Hero Slider State and Logic ---
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setCurrentImageIndex(prevIndex => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(sliderInterval);
  }, []);
  // --- END Hero Slider Logic ---

  const [homestays, setHomestays] = useState([]);
  const [q, setQ] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('');


  useEffect(()=> {
    fetch(API + '/homestays')
      .then(r=>r.json())
      .then(data => {
        setHomestays(data.map(h => ({ ...h, rating: h.rating || 4.2, reviews: h.reviews || 15 })));
      })
      .catch(console.error)
  },[]);

  // Filtering Logic (unchanged)
  let filtered = homestays.filter(h => {
    if(q && !h.name.toLowerCase().includes(q.toLowerCase())) return false;
    if(minPrice && h.pricePerNight < Number(minPrice)) return false;
    if(maxPrice && h.pricePerNight > Number(maxPrice)) return false;
    return true;
  });

  // Sorting Logic (unchanged)
  if (sortOrder === 'low') {
    filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (sortOrder === 'high') {
    filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
  }

  function clearFilters() {
    setQ('');
    setMinPrice('');
    setMaxPrice('');
    setSortOrder('');
  }

  return (
    <>
          {/* --- UPDATED Hero Section --- */}
          <section className="hero">
            {/* NEW: Iterate over images, apply active class and inline style for transition */}
            {heroImages.map((image, index) => (
                <div
                    key={index}
                    className={`hero-slide ${index === currentImageIndex ? 'active' : ''}`}
                    style={{ 
                        backgroundImage: `url(${image})`, 
                        opacity: index === currentImageIndex ? 1 : 0 
                    }}
                />
            ))}

            <div className="hero-overlay"></div>
            <div className="hero-inner container">
              <div className="hero-left">
                <h1 className="hero-title">Discover Coastal Escapes</h1>
                <p className="hero-sub">Handpicked homestays and private hosts with easy, trusted booking.</p>
                <div style={{marginTop:20}}>
                  <a className="btn btn-cta" href="#browse">Start Browsing</a>
                  <Link className="btn btn-ghost" to="/contact" style={{marginLeft:16}}>Contact Us</Link>
                </div>
              </div>
            </div>
          </section>
          {/* --- END UPDATED Hero Section --- */}

      <div className="container" id="browse">
        <div className="main-content-layout">
          {/* Filter Sidebar (unchanged) */}
          <div className="filter-sidebar form">
            <h4 style={{marginTop:0, marginBottom:16}}>🔍 Filter Your Stay</h4>
            <label className="label">Search by Name</label>
            <input className="input" placeholder="e.g., Sea Breeze Villa" value={q} onChange={e=>setQ(e.target.value)} />
            <label className="label">Min Price (₹)</label>
            <input className="input" placeholder="Min ₹600" value={minPrice} onChange={e=>setMinPrice(e.target.value)} type="number" />
            <label className="label">Max Price (₹)</label>
            <input className="input" placeholder="Max ₹1500" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} type="number" />
            <div style={{marginTop:20}}>
              <button 
                  className="btn btn-ghost" 
                  onClick={clearFilters}
                  style={{ width: '100%' }}
              >
                  Clear Filters
              </button>
            </div>
            <div className="small" style={{textAlign:'center', marginTop:10}}>*Prices shown are exclusive of 18% GST*</div>
          </div>

          {/* Results Panel */}
          <div className="results-panel">
            <h2 style={{marginTop:0}}>Homestay Listings</h2>

            <div className="filter-bar">
              <div className="small">Showing **{filtered.length}** results ({homestays.length} total)</div>
              <div style={{display:'flex',gap:8}}>
                <select className="input" value={sortOrder} onChange={(e)=>setSortOrder(e.target.value)} style={{width:'auto'}}>
                  <option value="">Sort By...</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="cards">
              {filtered.length === 0 && (
                <div style={{gridColumn:'1 / -1', textAlign:'center', padding:'40px', background:'#fff', borderRadius:'12px', boxShadow:'0 4px 12px rgba(2, 6, 23, 0.04)'}}>
                  No homestays match your current filters. Try widening your search!
                </div>
              )}
              {filtered.map(h => (
                <div className="card card-large" key={h._id}>
                  <div className="card-media">
                    <img src={h.images && h.images[0] ? h.images[0] : '/assets/placeholder.jpg'} alt={h.name} />
                  </div>
                  <div className="card-body">
                    <div style={{marginBottom:10}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <h3 style={{margin:0}}>{h.name}</h3>
                        <div style={{textAlign:'right'}}>
                          <div style={{fontWeight:800, fontSize:22, color:'#0ea5a4'}}>₹{h.pricePerNight}</div>
                          <div className="small">/ night</div>
                        </div>
                      </div>

                      <p className="small" style={{marginTop:6}}>{h.description || 'Charming homestay near the coast.'}</p>

                      {/* Enhanced Rating (unchanged) */}
                      <div style={{marginTop:8, display:'flex',alignItems:'center',gap:8}}>
                        <div style={{display:'flex',alignItems:'center',gap:4}}>
                          {Array.from({length:5}).map((_,i)=> {
                            return <StarIcon key={i} filled={i < Math.round(h.rating)} />
                          })}
                        </div>
                        <div className="small" style={{color:'#475569', fontWeight:600}}>{h.rating.toFixed(1)} • {h.reviews} reviews</div>
                      </div>

                      {/* Amenities Tags (unchanged) */}
                      <div style={{marginTop:12, display:'flex',gap:10,flexWrap:'wrap'}}>
                        {['wifi', 'breakfast', 'sea'].map((type, index) => (
                          <div key={index} style={{
                            display:'flex', gap:4, alignItems:'center',
                            background:'#e0f7fa', color:'#06b6d4', padding:'4px 8px', borderRadius:6, fontSize:13
                          }}>
                            <AmenityIcon type={type} />
                            <span>{type[0].toUpperCase() + type.slice(1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* --- UPDATED ACTION AREA --- */}
                    <div className="card-action-area">
                      <div className="small">Free cancellation</div>
                      <div style={{display:'flex',gap:8}}>
                        
                        {/* Details button: Uses teal color but as a ghost button */}
                        <Link 
                            className="btn btn-ghost" 
                            to={'/book/' + h._id} 
                            style={{borderColor: '#0ea5a4', color: '#0ea5a4', flexGrow: 1}} 
                        >
                            Details
                        </Link>
                        
                        {/* Book Now button: Teal solid, flexible width */}
                        <Link className="btn" to={'/book/' + h._id} style={{flexGrow: 1}}>
                            Book Now
                        </Link>
                      </div>
                    </div>
                    {/* --- END UPDATED ACTION AREA --- */}
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial carousel (unchanged) */}
            <section style={{marginTop:48}}>
              <h2>What Guests Say</h2>
              <TestimonialCarousel />
            </section>
          </div>
        </div>

{/* --- NEW FULL-WIDTH LARGE FOOTER --- */}
<footer className="large-footer">

    {/* Upper Footer Section: Spans full width, color is applied here */}
    <div className="footer-content">
        {/* Inner Grid: Constrains content to 1100px and holds the columns */}
        <div className="footer-inner-grid">
            
            {/* Column 1: Brand Info - COLOR FIXED */}
            <div className="footer-col">
                <Link to="/" className="brand" style={{marginLeft:0}}>
                    <h4 style={{color:'#102a43', fontSize:20}}>Vista Homestays</h4> 
                </Link>
                <p className="small" style={{color:'#475569', marginTop:10}}>
                    Your trusted partner for personalized coastal escapes and private hosted stays.
                </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
                <h4>Discover</h4>
                <Link to="/">Featured Stays</Link>
                <a href="#browse">Search by Location</a>
                <Link to="/contact">Host a Property</Link>
                <Link to="/my-bookings">My Bookings</Link>
            </div>

            {/* Column 3: Help & Support */}
            <div className="footer-col">
                <h4>Support</h4>
                <Link to="/support">FAQ / Help Center</Link>
                <Link to="/contact">Customer Support</Link>
                <Link to="/contact">Homeowner Support</Link>
                <Link to="/contact">Partner Support</Link>
            </div>

            {/* Column 4: Contact */}
            <div className="footer-col">
                <h4>Contact</h4>
                <div className="small" style={{color:'#475569'}}>
                    Email: support@vistahomestays.example
                </div>
                <div className="small" style={{color:'#475569', marginTop:10}}>
                    Phone: +91-98765-43210
                </div>
                <div className="small" style={{color:'#475569', marginTop:10}}>
                    Follow Us: (Facebook, Instagram, Threads, Twitter, Youtube)
                </div>
            </div>
        </div>
    </div>

    {/* Lower Footer Section: Spans full width, color is applied here */}
    <div className="footer-bottom">
        {/* Inner Content: Constrains width, uses flex to split content */}
        <div className="container"> 
            {/* Left Side: Copyright */}
            <span className="small" style={{ color: 'white' }}>
                © {new Date().getFullYear()} Vista Homestays. All rights reserved.
            </span>
            
            {/* Right Side: Links */}
            <div className="footer-links">
                {/* These links use the new CSS styles defined above */}
                <a href="#">Privacy Policy</a>
                <a href="#">Partner Policy</a>
                <a href="#">Cancellation Policy</a>
                <a href="#">Terms & Conditions</a>
            </div>
        </div>
    </div>
</footer>
{/* --- END NEW FULL-WIDTH LARGE FOOTER --- */}
      </div>
    </>
  )
}