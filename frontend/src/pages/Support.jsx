// frontend/src/pages/Support.jsx - ENHANCED
import React, { useState } from 'react';

const faqData = [
    { 
        q: 'How do I modify or cancel a booking?', 
        a: 'To modify or cancel a confirmed booking, please contact our support team immediately with your booking reference number. Note that cancellation and modification policies may vary based on the host and the specific homestay you booked.'
    },
    { 
        q: 'Are taxes and fees included in the price shown?', 
        a: 'Yes — all prices displayed on the homestay listing pages are inclusive of all standard taxes, including the 18% GST (Goods and Services Tax). The final total price on the booking page is the amount you pay.' 
    },
    { 
        q: 'What is the refund policy?', 
        a: 'Our refund policy depends on the individual host\'s cancellation guidelines, which are set at the time of booking. For specific details regarding your stay, please refer to the booking confirmation email or contact our support team.'
    },
    {
        q: 'Can I book without an account?',
        a: 'Yes, our platform allows you to book as a guest without creating an account. However, registering allows you to easily track and manage all your past and future bookings in the "My Bookings" section.'
    }
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{borderBottom:'1px solid #e2e8f0', padding:'12px 0'}}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{
          width:'100%', textAlign:'left', background:'none', border:'none', 
          fontWeight:700, fontSize:'16px', color:'#102a43', cursor:'pointer',
          display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0'
        }}
      >
        {question}
        <span style={{ fontSize:'20px', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div style={{
            padding:'8px 0 16px', 
            color:'#475569', 
            lineHeight:1.6, 
            animation: 'fadeIn 0.4s ease-out' // Requires CSS keyframe for smooth reveal, but simple display works too
        }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Support(){
  return (
    <div className="container" style={{maxWidth:900}}>
      <h2>Support Center</h2>
      <div className="form" style={{padding:'30px'}}>
        <h4 style={{marginTop:0}}>Frequently Asked Questions</h4>
        
        <div style={{marginBottom:20}}>
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.q} answer={faq.a} />
          ))}
        </div>
        
        <div style={{marginTop:20, paddingTop:20, borderTop:'1px solid #e2e8f0', textAlign:'center'}}>
            <p className="small">Can't find your answer here? Our team is ready to assist you.</p>
            <a className="btn btn-cta" href="/contact">Contact Support Team</a>
        </div>
      </div>
    </div>
  )
}