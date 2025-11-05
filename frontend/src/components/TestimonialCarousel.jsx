// frontend/src/components/TestimonialCarousel.jsx
import React, { useEffect, useState } from 'react'

const sample = [
  { name: 'Asha', text: 'Lovely stay — host was kind and location was perfect.', place: 'Goa' },
  { name: 'Ravi', text: 'Clean rooms and great breakfast. Highly recommended!', place: 'Kerala' },
  { name: 'Meera', text: 'Amazing sea view and prompt host support.', place: 'Pondicherry' }
];

export default function TestimonialCarousel(){
  const [idx, setIdx] = useState(0);
  useEffect(()=> {
    const t = setInterval(()=> setIdx(i => (i+1)%sample.length), 4500);
    return ()=> clearInterval(t);
  },[]);
  const cur = sample[idx];
  return (
    <div className="testimonial-card">
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <div style={{width:56,height:56,borderRadius:28,background:'#e6f7f6',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#0ea5a4'}}>{cur.name[0]}</div>
        <div>
          <div style={{fontWeight:800}}>{cur.name}</div>
          <div className="small" style={{color:'#64748b'}}>{cur.place}</div>
        </div>
      </div>
      <p style={{marginTop:12}}>"{cur.text}"</p>
      <div style={{display:'flex',gap:6,marginTop:8}}>
        {sample.map((_,i)=> <div key={i} style={{width:8,height:8,borderRadius:4,background: i===idx ? '#0ea5a4' : '#e6edf3'}} />)}
      </div>
    </div>
  )
}
