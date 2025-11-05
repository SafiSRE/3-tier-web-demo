// frontend/src/pages/MyBookings.jsx
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
          throw new Error(txt || `HTTP ${res.status}`);
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

  if (loading) return <div className="container"><div className="form">Loading your bookings…</div></div>;
  if (error) return <div className="container"><div className="form" style={{color:'crimson'}}>{error}</div></div>;

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h2>My Bookings</h2>

      <div className="booking-list">
        {bookings.length === 0 && <div className="form">No bookings yet.</div>}

        {bookings.map((b) => (
          <div key={b._id} className="form">
            <div style={{ display: "flex", gap: 12 }}>
              <img
                src={(b.homestay && b.homestay.images && b.homestay.images[0]) || "/assets/placeholder.jpg"}
                alt={b.homestay ? b.homestay.name : "Homestay"}
                style={{ width: 140, height: 90, objectFit: "cover", borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800 }}>{b.homestay ? b.homestay.name : "Unknown Homestay"}</div>
                <div className="small">
                  From: {b.fromDate ? new Date(b.fromDate).toLocaleDateString() : "—"} To: {b.toDate ? new Date(b.toDate).toLocaleDateString() : "—"}
                </div>
                <div className="small">Nights: {b.nights || "—"} | Total: ${b.totalPrice || "—"}</div>
                <div className="small">Booked by: {b.name || "—"} | Phone: {b.phone || "—"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
