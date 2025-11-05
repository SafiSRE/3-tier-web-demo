import React, {useEffect, useState} from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function MyBookings(){
  const [bookings, setBookings] = useState([]);
  useEffect(()=> {
    const token = localStorage.getItem('token');
    if(!token) { window.location='/login'; return; }
    fetch(API + '/bookings/mine', { headers: { Authorization: 'Bearer ' + token } })
      .then(r=>r.json()).then(setBookings).catch(console.error)
  },[]);
  return (
    <div className="container" style={{maxWidth:900}}>
      <h2>My Bookings</h2>
      <div className="booking-list">
        {bookings.length===0 && <div className="form">No bookings yet.</div>}
        {bookings.map(b => (
          <div key={b._id} className="form">
            <div style={{display:'flex',gap:12}}>
              <img src={b.homestay.images && b.homestay.images[0]} alt="" style={{width:140,height:90,objectFit:'cover',borderRadius:8}} />
              <div style={{flex:1}}>
                <div style={{fontWeight:800}}>{b.homestay.name}</div>
                <div className="small">From: {new Date(b.fromDate).toLocaleDateString()} To: {new Date(b.toDate).toLocaleDateString()}</div>
                <div className="small">Nights: {b.nights} | Total: ${b.totalPrice}</div>
                <div className="small">Booked by: {b.name} | Phone: {b.phone}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
