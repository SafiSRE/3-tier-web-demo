// frontend/src/components/TestimonialCarousel.jsx - ENHANCED FOR 30 ITEMS & RATINGS

import React, { useEffect, useState } from 'react'

const sample = [
  // --- High-Quality Examples (5 items) ---
  { name: 'Asha S.', text: 'Lovely stay — the host was incredibly kind and the location near the beach was absolutely perfect for our family.', place: 'Goa, India', rating: 5 },
  { name: 'Ravi K.', text: 'The rooms were spotless, and the complimentary breakfast was amazing. Highly recommended for any traveler looking for quality.', place: 'Kerala, India', rating: 5 },
  { name: 'Meera P.', text: 'Amazing sea view right from our balcony! The host provided prompt support throughout our entire stay. Five stars.', place: 'Pondicherry, India', rating: 5 },
  { name: 'Vijay L.', text: 'A great weekend getaway. The property was exactly as advertised, very clean, and extremely peaceful. Will definitely book again.', place: 'Ooty, India', rating: 4 },
  { name: 'Priya R.', text: 'Fantastic value for money. The host was very communicative and ensured a smooth check-in process. A pleasant experience overall.', place: 'Kochi, India', rating: 4 },
  { name: 'Ranjan D', text: 'Clean and comfortable, perfect for a short business trip.', place: 'Bangalore', rating: 4 },
  { name: 'Sameer', text: 'Quiet neighborhood and easy access to local markets.', place: 'Jaipur', rating: 3 },
  { name: 'Shruti J', text: 'The garden was beautiful and the host was welcoming.', place: 'Mysore', rating: 5 },
  { name: 'Ahmed H', text: 'Excellent service and prompt communication from the team.', place: 'Mumbai', rating: 5 },
  { name: 'John K', text: 'Slight issue with the AC, but quickly fixed by the host.', place: 'UK', rating: 4 },
  { name: 'Ananya B', text: 'Spacious rooms, great for a large group of friends.', place: 'Manali', rating: 5 },
  { name: 'Kishan S', text: 'The view from the rooftop was breathtaking!', place: 'Patna', rating: 5 },
  { name: 'Peter H', text: 'Decent stay, location was a bit further out than expected.', place: 'USA', rating: 3 },
  { name: 'Nicole A', text: 'Felt like a home away from home. Highly recommend this place.', place: 'USA', rating: 5 },
  { name: 'Srinivas B', text: 'The kitchen was well-equipped, making cooking easy.', place: 'Delhi', rating: 4 },
  { name: 'Yaseen M', text: 'Smooth booking and hassle-free check-in experience.', place: 'Kolkata', rating: 5 },
  { name: 'Farhana B', text: 'Enjoyed the local food nearby. The area is very vibrant.', place: 'Lucknow', rating: 4 },
  { name: 'Khushi B', text: 'Very cozy place, though parking was a little tricky.', place: 'Kashmir', rating: 4 },
  { name: 'Naveen M', text: 'An unforgettable experience! Perfect for couples.', place: 'Rishikesh', rating: 5 },
  { name: 'Bhaskar', text: 'The amenities were modern and well-maintained.', place: 'Varanasi', rating: 5 },
  { name: 'Yaroslav H', text: 'Great spot for travelers looking for tranquility.', place: 'Poland', rating: 5 },
  { name: 'Manmohan S', text: 'The communication was clear and instructions were easy to follow.', place: 'Amritsar', rating: 4 },
  { name: 'Sabir A', text: 'Loved the rustic charm of the homestay.', place: 'Guwahati', rating: 5 },
  { name: 'Shoaib S', text: 'Close to all major attractions, very convenient.', place: 'Guwahati', rating: 4 },
  { name: 'Afreen', text: 'A small issue with the Wi-Fi, but otherwise perfect.', place: 'Tirupati', rating: 4 },
  { name: 'Kajol B', text: 'Best host I’ve ever encountered. Highly personal service.', place: 'Shimla', rating: 5 },
  { name: 'Ruksar B', text: 'Affordable and centrally located, couldn\'t ask for more.', place: 'Indore', rating: 4 },
  { name: 'Shaheen B', text: 'The interior design was beautiful and very thoughtful.', place: 'Amritsar', rating: 5 },
  { name: 'James A', text: 'Comfortable bed and clean linen. Slept soundly!', place: 'South Africa', rating: 5 },
  { name: 'Katie', text: 'Excellent sea view and fresh air throughout the stay.', place: 'South Africa', rating: 5 },
];

function StarIcon({ filled }) {
  return <span style={{ color: filled ? '#f59e0b' : '#d1d5db', fontSize: 18 }}>★</span>
}

export default function TestimonialCarousel(){
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true); 

  // Auto-slide and fade effect (Logic remains the same)
  useEffect(()=> {
    const totalCycleTime = 4500; 
    const transitionTime = 500; 

    const slideTimer = setInterval(() => {
        setFade(false); 
        
        const changeTimer = setTimeout(() => {
            setIdx(i => (i + 1) % sample.length);
            setFade(true); 
        }, transitionTime); 

        return () => clearTimeout(changeTimer);

    }, totalCycleTime);

    return ()=> clearInterval(slideTimer);
  }, []); 

  // Manual dot click handler (Logic remains the same)
  function handleDotClick(newIdx) {
      if (newIdx === idx) return;

      setFade(false); 
      setTimeout(() => {
          setIdx(newIdx);
          setFade(true);
      }, 300); 
  }

  const cur = sample[idx];
  
  return (
    <div className="testimonial-card" style={{ transition: 'opacity 0.5s ease', opacity: fade ? 1 : 0 }}>
      {/* Testimonial Header (Avatar, Name, Location) */}
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
      
      {/* --- RATING DISPLAY --- */}
      <div style={{marginTop:12, display:'flex', alignItems:'center', gap:8}}>
        <div style={{display:'flex', alignItems:'center', gap:2}}>
            {Array.from({length:5}).map((_,i)=> {
                return <StarIcon key={i} filled={i < cur.rating} />
            })}
        </div>
        <div className="small" style={{fontWeight:600, color:'#475569'}}>{cur.rating}.0 Rating</div>
      </div>
      {/* --- END RATING DISPLAY --- */}
      
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