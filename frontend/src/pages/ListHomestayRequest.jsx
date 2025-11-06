// frontend/src/pages/ListHomestayRequest.jsx (NEW FILE)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// This component is the public form for requesting a homestay listing.
export default function ListHomestayRequest() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [rooms, setRooms] = useState('');
    const [hearAbout, setHearAbout] = useState('');
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState(null); // For file uploads
    const [status, setStatus] = useState(null); // 'success' or 'error'
    const [loading, setLoading] = useState(false);
    
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        setLoading(true);

        const payload = {
            ownerName: `${firstName} ${lastName}`,
            email, phone, location, propertyType, rooms,
            source: hearAbout, photoLink, description,
            // Mocking file upload indication for backend review
            hasFiles: files ? files.length : 0 
        };

        try {
            // Note: This needs a new backend endpoint (e.g., /api/listing-requests)
            // For now, we'll send it to the existing contact endpoint structure, as the logic is similar (save data, no auth).
            const res = await fetch(API + '/contact', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: payload.ownerName,
                    email: payload.email,
                    message: `LISTING REQUEST: ${payload.location}, ${payload.propertyType}. Rooms: ${payload.rooms}. Details: ${payload.description}`
                })
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit request.');
            
            setStatus('success');
            // Clear all fields on successful submission
            setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setLocation('');
            setPropertyType(''); setRooms(''); setHearAbout(''); setPhotoLink(''); setDescription(''); setFiles(null);
            
            setTimeout(() => { nav('/'); }, 3000);

        } catch (err) {
            setStatus('error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: 850 }}>
            <h2>List Your Homestay</h2>
            <p className="small" style={{marginBottom: 20}}>
                Tell us about your property. Our team will review your details and contact you to proceed with onboarding.
            </p>
            
            {status === 'success' && (
                <div className="form" style={{background:'#e6ffed', color:'#22c55e', marginBottom: 20}}>
                    ✅ Request sent successfully! We will contact you shortly.
                </div>
            )}
            {status === 'error' && (
                <div className="form" style={{background:'#fee2e2', color:'#dc2626', marginBottom: 20}}>
                    ❌ Submission failed. Please check your details and network connection.
                </div>
            )}
            
            <form className="form" onSubmit={handleSubmit} style={{padding: 30}}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    
                    {/* Row 1: Name */}
                    <input className="input" placeholder="First Name *" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                    <input className="input" placeholder="Last Name *" value={lastName} onChange={e => setLastName(e.target.value)} required />

                    {/* Row 2: Contact */}
                    <input className="input" placeholder="Email ID *" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <select className="input" style={{ width: 80 }} defaultValue="+91">
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                        </select>
                        <input className="input" placeholder="Mobile Phone *" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
                    </div>

                    {/* Row 3: Property Details 1 */}
                    <select className="input" value={location} onChange={e => setLocation(e.target.value)} required>
                        <option value="">Select your property location *</option>
                        <option value="Goa">Goa</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Pondicherry">Pondicherry</option>
                        <option value="Other">Other</option>
                    </select>
                    <select className="input" value={propertyType} onChange={e => setPropertyType(e.target.value)} required>
                        <option value="">What type of property is it? *</option>
                        <option value="Villa">Independent Villa</option>
                        <option value="Apartment">Service Apartment</option>
                        <option value="Cottage">Cottage/Bungalow</option>
                    </select>

                    {/* Row 4: Property Details 2 / Source */}
                    <select className="input" value={rooms} onChange={e => setRooms(e.target.value)}>
                        <option value="">How many rooms?</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3+">3 or more</option>
                    </select>
                    <select className="input" value={hearAbout} onChange={e => setHearAbout(e.target.value)} required>
                        <option value="">Where did you hear about us? *</option>
                        <option value="Referral">Referral</option>
                        <option value="Google">Google Search</option>
                        <option value="Social">Social Media</option>
                    </select>

                    {/* Row 5: Link / Description */}
                    <input 
                        className="input" 
                        placeholder="Photos/Website link (if any)" 
                        value={photoLink} 
                        onChange={e => setPhotoLink(e.target.value)} 
                        style={{ gridColumn: '1 / -1' }}
                    />
                    
                    {/* Row 6: Picture Upload (Mocked for Demo) */}
                    <div style={{ gridColumn: '1 / -1', marginTop: 10 }}>
                        <label className="label">Upload Pictures (Mock Upload)</label>
                        <input 
                            type="file" 
                            className="input" 
                            onChange={e => setFiles(e.target.files)} 
                            multiple 
                            style={{ padding: '10px', height: 'auto', border: '1px solid #ccc' }}
                        />
                        <div className="small" style={{marginTop: 5}}>Max 5 files. Your team will review these manually.</div>
                    </div>


                    {/* Row 7: Description */}
                    <textarea 
                        className="input" 
                        placeholder="Describe your property" 
                        rows="4" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        style={{ gridColumn: '1 / -1', marginTop: 10 }}
                    />
                </div>

                <div style={{ marginTop: 25, textAlign: 'center' }}>
                    <button className="btn" type="submit" disabled={loading} style={{ 
                        background: '#102a43', // Use a solid dark color for the final CTA
                        color: 'white', 
                        padding: '12px 30px', 
                        fontSize: '16px',
                        fontWeight: 700,
                        width: '50%'
                    }}>
                        {loading ? 'Sending Request...' : 'Send a Request'}
                    </button>
                </div>
            </form>
        </div>
    );
}