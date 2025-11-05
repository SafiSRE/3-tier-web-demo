import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// coupon: VISTA10 -> 10% off
function calculateTotals(price, nights, coupon){
  const subtotal = price * nights;
  const gst = +(subtotal * 0.18).toFixed(2);
  let total = subtotal + gst;
  if(coupon === 'VISTA10') total = +(total * 0.9).toFixed(2);
  return { subtotal, gst, total };
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
  const nav = useNavigate();

  useEffect(()=> {
    fetch(API + '/homestays/' + id).then(r=>r.json()).then(setHomestay).catch(console.error)
  },[id]);

  useEffect(()=> {
    if(homestay && fromDate && toDate){
      const d1 = new Date(fromDate);
      const d2 = new Date(toDate);
      const diff = Math.ceil((d2 - d1)/(1000*60*60*24));
      const nights = diff>0 ? diff : 1;
      setTotals(calculateTotals(homestay.pricePerNight, nights, coupon));
    }
  }, [homestay, fromDate, toDate, coupon]);

  async function submit(e){
    e.preventDefault();
    const token = localStorage.getItem('token');
    // allow guest booking if not logged in

    if(!fromDate || !toDate){ alert('Select dates'); return; }
    const d1 = new Date(fromDate), d2 = new Date(toDate);
    const nights = Math.ceil((d2 - d1)/(1000*60*60*24)) || 1;
    const payload = {
      homestayId: id,
      fromDate, toDate, name, phone, aadhar, address, couponCode: coupon,
      nights,
      subtotal: totals ? totals.subtotal : homestay.pricePerNight * nights,
      gst: totals ? totals.gst : 0,
      totalPrice: totals ? totals.total : homestay.pricePerNight * nights * 1.18
    };
    const res = await fetch(API + '/bookings', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer ' + token},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(res.ok){
      alert('Booked!'); nav('/my-bookings');
    } else {
      alert(data.error || 'Booking failed');
    }
  }

  if(!homestay) return <div className="container">Loading...</div>

  return (
    <div className="container" style={{maxWidth:700}}>
      <h2>Book: {homestay.name}</h2>
      <div className="card" style={{marginBottom:12}}>
        <img src={homestay.images && homestay.images[0]} alt="" />
        <div className="card-body">
          <div style={{fontWeight:800}}>${homestay.pricePerNight} / night</div>
          <div className="small">Price range $600 - $1500 | GST 18% applied</div>
        </div>
      </div>

      <form className="form" onSubmit={submit}>
        <div className="small">You can book as a guest without logging in. To view your bookings later, please register / login.</div>
        <label className="label">From</label>
        <input type="date" className="input" value={fromDate} onChange={e=>setFromDate(e.target.value)} />
        <label className="label">Up to</label>
        <input type="date" className="input" value={toDate} onChange={e=>setToDate(e.target.value)} />

        <label className="label">Your Name</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} required />

        <label className="label">Phone</label>
        <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} required />

        <label className="label">Aadhar Number</label>
        <input className="input" value={aadhar} onChange={e=>setAadhar(e.target.value)} required />

        <label className="label">Address</label>
        <input className="input" value={address} onChange={e=>setAddress(e.target.value)} required />

        <label className="label">Coupon Code (optional)</label>
        <input className="input" value={coupon} onChange={e=>setCoupon(e.target.value)} />

        {totals && (
          <div style={{marginTop:8}}>
            <div>Subtotal: ${totals.subtotal.toFixed(2)}</div>
            <div>GST (18%): ${totals.gst.toFixed(2)}</div>
            <div style={{fontWeight:800}}>Total: ${totals.total.toFixed(2)}</div>
          </div>
        )}

        <div style={{marginTop:12}}>
          <button className="btn" type="submit">Confirm Booking</button>
        </div>
      </form>
    </div>
  )
}
