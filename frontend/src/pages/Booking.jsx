// frontend/src/pages/Booking.jsx - ENHANCED
import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// coupon: VISTA10 -> 10% off
function calculateTotals(price, nights, coupon){
  const subtotal = price * nights;
  const gstRate = 0.18;
  const gst = +(subtotal * gstRate).toFixed(2);
  let total = subtotal + gst;
  let discount = 0;
  
  if(coupon.toUpperCase() === 'VISTA10'){
    discount = +(total * 0.1).toFixed(2);
    total = +(total - discount).toFixed(2);
  }
  return { subtotal, gst, total, discount, gstRate };
}

export default function Booking(){
  const { id } = useParams();
  const [homestay, setHomestay] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const [aadhar,setAadhar]=useState('');
  const [address,setAddress]=useState('');
  const [coupon,setCoupon]=useState('');
  const [totals,setTotals]=useState(null);
  const [nights, setNights] = useState(1);
  const nav = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(()=> {
    fetch(API + '/homestays/' + id).then(r=>r.json()).then(setHomestay).catch(console.error)
  },[id]);

  useEffect(()=> {
    if(homestay && fromDate && toDate){
      const d1 = new Date(fromDate);
      const d2 = new Date(toDate);
      const diff = Math.ceil((d2 - d1)/(1000*60*60*24));
      const calculatedNights = diff>0 ? diff : 1;
      setNights(calculatedNights);
      setTotals(calculateTotals(homestay.pricePerNight, calculatedNights, coupon));
    } else {
      setTotals(null);
      setNights(1);
    }
  }, [homestay, fromDate, toDate, coupon]);

  async function submit(e){
    e.preventDefault();
    
    if(!fromDate || !toDate){ alert('Please select valid check-in and check-out dates.'); return; }
    if(nights <= 0) { alert('Check-out date must be after check-in date.'); return; }

    const payload = {
      homestayId: id,
      fromDate, toDate, name, phone, aadhar, address, couponCode: coupon,
      nights,
      subtotal: totals ? totals.subtotal : 0,
      gst: totals ? totals.gst : 0,
      totalPrice: totals ? totals.total : 0
    };
    
    const res = await fetch(API + '/bookings', {
      method:'POST',
      headers:{'Content-Type':'application/json', 'Authorization': token ? 'Bearer ' + token : undefined},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    
    if(res.ok){
      alert('Booking successful! Check your bookings list.'); 
      nav('/my-bookings');
    } else {
      alert(data.error || 'Booking failed. Please check your details and try again.');
    }
  }

  if(!homestay) return <div className="container">Loading homestay details...</div>

  return (
    <div className="container" style={{maxWidth:1000}}>
      <h2>Book: {homestay.name}</h2>
      
      <div className="booking-layout">
        
        {/* --- Booking Form Panel --- */}
        <form className="booking-form-panel form" onSubmit={submit}>
          <div className="small" style={{marginBottom:16}}>
            {token 
              ? `You are logged in as ${JSON.parse(localStorage.getItem('user')).name}.`
              : 'You can book as a guest. To view your bookings later, please register/login.'
            }
          </div>

          <label className="label">Check-in Date</label>
          <input type="date" className="input" value={fromDate} onChange={e=>setFromDate(e.target.value)} required />
          
          <label className="label">Check-out Date</label>
          <input type="date" className="input" value={toDate} onChange={e=>setToDate(e.target.value)} required />
          
          <div className="small" style={{color: nights <= 0 ? '#ef4444' : '#0ea5a4', fontWeight:600, marginBottom:16}}>
            {fromDate && toDate && nights > 0 ? `Total Nights: ₹{nights}` : 'Please select valid dates.'}
          </div>

          <h4 style={{marginTop:20}}>Guest Details</h4>
          <label className="label">Your Name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} required />

          <label className="label">Phone Number</label>
          <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} required type="tel" />

          <label className="label">Aadhar Number</label>
          <input className="input" value={aadhar} onChange={e=>setAadhar(e.target.value)} required />

          <label className="label">Address</label>
          <input className="input" value={address} onChange={e=>setAddress(e.target.value)} required />

          <div style={{marginTop:20}}>
            <button className="btn btn-cta" type="submit" disabled={nights <= 0 || !totals} style={{width:'100%'}}>
              Confirm Booking (Pay ₹{totals ? totals.total.toFixed(2) : '—'})
            </button>
          </div>
        </form>

        {/* --- Price Summary Panel (Sticky) --- */}
        <div className="booking-summary-panel">
          <div className="price-summary-card">
            <h4 style={{marginTop:0, marginBottom:16}}>💰 Order Summary</h4>
            
            <img 
              src={homestay.images && homestay.images[0]} 
              alt={homestay.name} 
              style={{width:'100%', height:150, objectFit:'cover', borderRadius:8, marginBottom:12}} 
            />
            
            <div style={{fontWeight:800}}>{homestay.name}</div>
            <div className="small">Price: ₹{homestay.pricePerNight} / night</div>
            
            <div style={{marginTop:16, borderTop:'1px solid #e6edf3', paddingTop:16}}>
              <label className="label">Coupon Code (Optional)</label>
              <input 
                className="input" 
                value={coupon} 
                onChange={e=>setCoupon(e.target.value)} 
                placeholder="VISTA10 for 10% off"
                style={{marginBottom:16}}
              />
              
              {totals && (
                <>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
                    <span>Base Price ({nights} nights):</span>
                    <span>₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
                    <span>GST ({totals.gstRate*100}%):</span>
                    <span>₹{totals.gst.toFixed(2)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:8, color:'#0ea5a4', fontWeight:600}}>
                      <span>Coupon Discount:</span>
                      <span>- ₹{totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{display:'flex', justifyContent:'space-between', fontWeight:800, marginTop:15, borderTop:'1px dashed #e2e8f0', paddingTop:15}}>
                    <span>TOTAL PAYABLE:</span>
                    <span style={{color:'#ef4444', fontSize:22}}>₹{totals.total.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
            {!totals && <div className="small" style={{marginTop:10}}>Select valid dates to view the final price.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
