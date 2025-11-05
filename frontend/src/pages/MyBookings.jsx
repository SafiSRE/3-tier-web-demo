// frontend/src/pages/MyBookings.jsx - ENHANCED
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Not logged in -> go to login
      nav("/login", { replace: true });
      return;
    }

    setLoading(true);
    fetch(API + "/bookings/mine", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(async (res) => {
        if (res.status === 401) {
          // token invalid or expired -> force login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          nav("/login", { replace: true });
          return null;
        }
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `HTTP ₹{res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) setBookings(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load bookings:", err);
        setError("Could not load bookings. Please try again later.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return (
    <div className="container" style={{padding:'40px', textAlign:'center'}}>
        <div className="form">Loading your bookings...</div>
    </div>
  );
  if (error) return (
    <div className="container" style={{padding:'40px', textAlign:'center'}}>
        <div className="form" style={{color:'#dc2626', background:'#fee2e2', border:'1px solid #fca5a5'}}>
            Error: {error}
        </div>
    </div>
  );

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h2>My Bookings ({bookings.length})</h2>

      <div className="booking-list">
        {bookings.length === 0 && <div className="form" style={{textAlign:'center', padding:'30px'}}>You have no active bookings yet.</div>}

        {bookings.map((b) => (
          <div key={b._id} className="form" style={{ padding: 16 }}> {/* form class used as card */}
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              {/* Media on the left */}
              <img
                src={(b.homestay && b.homestay.images && b.homestay.images[0]) || "/assets/placeholder.jpg"}
                alt={b.homestay ? b.homestay.name : "Homestay"}
                style={{ width: 160, height: 100, objectFit: "cover", borderRadius: 8 }}
              />
              
              {/* Content in the middle */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#0ea5a4' }}>
                    {b.homestay ? b.homestay.name : "Unknown Homestay"}
                </div>
                <div className="small" style={{marginTop: 4}}>
                  From: <span style={{fontWeight:600}}>{b.fromDate ? new Date(b.fromDate).toLocaleDateString() : "—"}</span> 
                  {' '}To: <span style={{fontWeight:600}}>{b.toDate ? new Date(b.toDate).toLocaleDateString() : "—"}</span>
                </div>
                <div className="small">
                    Nights: <span style={{fontWeight:600}}>{b.nights || "—"}</span> | 
                    Total: <span style={{fontWeight:800, color:'#ef4444'}}>₹{b.totalPrice || "—"}</span>
                </div>
              </div>

              {/* Guest info on the right */}
              <div style={{textAlign: 'right'}}>
                <div style={{fontWeight: 600}}>Guest Details</div>
                <div className="small">Booked by: {b.name || "—"}</div>
                <div className="small">Phone: {b.phone || "—"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}