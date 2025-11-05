// frontend/src/pages/Support.jsx
import React from 'react';

export default function Support(){
  return (
    <div className="container" style={{maxWidth:900}}>
      <h2>Support</h2>
      <div className="form">
        <h4>FAQs</h4>
        <div className="small"><strong>How do I modify a booking?</strong><br/>Contact support with your booking reference and we will help.</div>
        <hr/>
        <div className="small"><strong>Are taxes included?</strong><br/>Yes — prices shown include 18% GST.</div>
        <hr/>
        <div className="small"><strong>Refund policy</strong><br/>Cancellations depend on host policy; contact support for specifics.</div>
        <hr/>
        <div style={{marginTop:12}}>
          <a className="btn" href="/contact">Contact Support</a>
        </div>
      </div>
    </div>
  )
}
