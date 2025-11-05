// frontend/src/components/TestimonialCarousel.jsx - CORRECTED

import React, { useEffect, useState } from 'react'

const sample = [
  { name: 'Asha S.', text: 'Lovely stay — the host was incredibly kind and the location near the beach was absolutely perfect for our family.', place: 'Goa, India' },
  { name: 'Ravi K.', text: 'The rooms were spotless, and the complimentary breakfast was amazing. Highly recommended for any traveler looking for quality.', place: 'Kerala, India' },
  { name: 'Meera P.', text: 'Amazing sea view right from our balcony! The host provided prompt support throughout our entire stay. Five stars.', place: 'Pondicherry, India' }
];

export default function TestimonialCarousel(){
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true); // State to control opacity

  // Auto-slide and fade effect
  useEffect(()=> {
    const totalCycleTime = 4500; // Total time for display (4.0s) + transition (0.5s)
    const transitionTime = 500; // CSS transition duration

    const slideTimer = setInterval(() => {
        // 1. Start fade out
        setFade(false); 
        
        // 2. After fade out time, change content and start fade in
        const changeTimer = setTimeout(() => {
            setIdx(i => (i + 1) % sample.length);
            setFade(true); 
        }, transitionTime); 

        return () => clearTimeout(changeTimer);

    }, totalCycleTime);

    return ()=> clearInterval(slideTimer);
  }, []); // Empty dependency array means this runs once on mount

  // Manual dot click handler
  function handleDotClick(newIdx) {
      if (newIdx === idx) return;

      // Start fade out, set new index after transition, then fade in
      setFade(false); 
      setTimeout(() => {
          setIdx(newIdx);
          setFade(true);
      }, 300); // Shorter manual transition time
  }

  const cur = sample[idx];
  
  return (
    <div className="testimonial-card" style={{ transition: 'opacity 0.5s ease', opacity: fade ? 1 : 0 }}>
      {/* Testimonial Header (Avatar & Name) */}
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <div style={{
          width:56, 
          height:56, 
          borderRadius:28, 
          background:'#0ea5a4', 
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          fontWeight:700,
          color:'white', 
          fontSize: '20px',
          boxShadow: '0 0 0 3px #e0f2f7' 
        }}>
          {cur.name[0]}
        </div>
        <div>
          <div style={{fontWeight:800, color:'#102a43'}}>{cur.name}</div>
          <div className="small">{cur.place}</div>
        </div>
      </div>
      
      {/* Testimonial Quote */}
      <p style={{
        marginTop:16, 
        fontSize:'17px', 
        lineHeight:1.6, 
        fontStyle:'italic', 
        color:'#102a43' 
      }}>
        "{cur.text}"
      </p>
      
      {/* Carousel Dots */}
      <div style={{display:'flex',gap:8,marginTop:16, borderTop:'1px solid #f1f5f9', paddingTop:12}}>
        {sample.map((_,i)=> 
          <button 
            key={i} 
            onClick={() => handleDotClick(i)}
            style={{
                width: i===idx ? 10 : 8, 
                height: i===idx ? 10 : 8,
                borderRadius:4, 
                border:'none',
                background: i===idx ? '#0ea5a4' : '#e6edf3',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }} 
            aria-label={`Go to testimonial ${i + 1}`}
          />
        )}
      </div>
    </div>
  )
}