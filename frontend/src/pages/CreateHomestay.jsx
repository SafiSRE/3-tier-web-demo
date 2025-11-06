// frontend/src/pages/CreateHomestay.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CreateHomestay() {
  const { id } = useParams(); 
  const isEditing = !!id;
  const nav = useNavigate();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [images, setImages] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Redirect if not owner
  useEffect(() => {
    if (!token || (user && user.role !== 'owner')) {
      nav('/owner/login', { replace: true });
    }
  }, [token, user, nav]);
  
  // Fetch existing data for editing
  useEffect(() => {
    if (isEditing && token) {
      fetch(API + '/homestays/' + id)
        .then(res => res.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            setName(data.name || '');
            setDescription(data.description || '');
            setPricePerNight(data.pricePerNight || '');
            setImages((data.images || []).join(', '));
        })
        .catch(err => {
            setFetchError("Could not load homestay data for editing.");
            console.error(err);
        });
    }
  }, [id, isEditing, token]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? API + '/homestays/' + id : API + '/homestays';

    try {
        const payload = {
            name, description, 
            pricePerNight: Number(pricePerNight), 
            images: images.split(',').map(url => url.trim()).filter(url => url)
        };

        const res = await fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token 
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Operation failed');
        
        alert(`Homestay ${isEditing ? 'updated' : 'created'} successfully!`);
        nav('/owner/dashboard');

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };
  
  if (fetchError) return <div className="container form" style={{color:'crimson'}}>{fetchError}</div>;


  return (
    <div className="container" style={{maxWidth:700}}>
      <h2>{isEditing ? 'Edit Homestay' : 'Create New Homestay'}</h2>

      <form className="form" onSubmit={handleSubmit}>
        <label className="label">Homestay Name</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} required />

        <label className="label">Description</label>
        <textarea className="input" rows="4" value={description} onChange={e => setDescription(e.target.value)} required />

        <label className="label">Price Per Night (₹)</label>
        <input className="input" type="number" value={pricePerNight} onChange={e => setPricePerNight(e.target.value)} required />

        <label className="label">Image URLs (Comma Separated)</label>
        <textarea className="input" rows="3" value={images} onChange={e => setImages(e.target.value)} placeholder="e.g., /assets/image1.jpg, /assets/image2.jpg" required />
        <div className="small">Note: Upload functionality is simplified to comma-separated URLs for this demo.</div>

        <div style={{marginTop:20}}>
          <button className="btn btn-cta" type="submit" disabled={loading} style={{marginRight:10}}>
            {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Publish Listing')}
          </button>
          <Link to="/owner/dashboard" className="btn btn-ghost">Cancel</Link>
        </div>
        
        {error && <div style={{color:'crimson', marginTop:10}}>{error}</div>}
      </form>
    </div>
  );
}