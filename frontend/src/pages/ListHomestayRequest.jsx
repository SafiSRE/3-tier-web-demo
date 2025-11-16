// frontend/src/pages/ListHomestayRequest.jsx - REVISED WITH CONTACT.JSX CAPTCHA

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- CAPTCHA Logic (Copied from Contact.jsx) ---
function generateCaptcha() {
    // Generates a simple addition problem
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    const question = `What is ${num1} + ${num2}?`;
    const answer = num1 + num2;
    return { question, answer };
}

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
    const [files, setFiles] = useState(null); 
    const [status, setStatus] = useState(null); // 'success' or 'error' (submission status)
    const [loading, setLoading] = useState(false);
    
    // NEW: Error state for immediate feedback (like CAPTCHA failure)
    const [error, setError] = useState(null); 

    // NEW CAPTCHA states (Copied from Contact.jsx)
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [captchaInput, setCaptchaInput] = useState('');
    
    const nav = useNavigate();

    // Refresh CAPTCHA on load/reset
    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        setError(null); // Clear previous errors

        // --- CAPTCHA VALIDATION (Copied from Contact.jsx) ---
        if (Number(captchaInput) !== captcha.answer) {
            setError('Incorrect CAPTCHA answer. Please try again.');
            setCaptcha(generateCaptcha()); // Regenerate question
            setCaptchaInput('');
            return; 
        }
        // --- END CAPTCHA VALIDATION ---

        setLoading(true);

        const payload = {
            ownerName: `${firstName} ${lastName}`,
            email, phone, location, propertyType, rooms,
            source: hearAbout, photoLink, description,
            hasFiles: files ? files.length : 0 
        };

        try {
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
            setCaptcha(generateCaptcha()); // Regenerate CAPTCHA on successful send
            setCaptchaInput('');
            
            setTimeout(() => { nav('/'); }, 3000);

        } catch (err) {
            setStatus('error'); // Set status for the persistent success/error message box
            setError(err.message || 'Network error occurred. Please try again.'); // Set error state for debug/display
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
            
            {/* Display submission status */}
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
            {/* Display immediate feedback (like CAPTCHA failure) */}
            {error && !status && (
                <div className="form" style={{background:'#fee2e2', color:'#dc2626', marginBottom: 20}}>
                    ❌ Error: {error}
                </div>
            )}
            
            <form className="form" onSubmit={handleSubmit} style={{padding: 30}}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    
                    {/* Rows 1-7: Existing Form Fields (omitted for brevity) */}
                    <input className="input" placeholder="First Name *" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                    <input className="input" placeholder="Last Name *" value={lastName} onChange={e => setLastName(e.target.value)} required />
                    <input className="input" placeholder="Email ID *" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <select className="input" style={{ width: 80 }} defaultValue="+91">
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                        </select>
                        <input className="input" placeholder="Mobile Phone *" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
                    </div>
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
                    <input 
                        className="input" 
                        placeholder="Photos/Website link (if any)" 
                        value={photoLink} 
                        onChange={e => setPhotoLink(e.target.value)} 
                        style={{ gridColumn: '1 / -1' }}
                    />
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
                    <textarea 
                        className="input" 
                        placeholder="Describe your property" 
                        rows="4" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        style={{ gridColumn: '1 / -1', marginTop: 10 }}
                    />
                </div>

                {/* --- CAPTCHA SECTION (New, Matching Contact.jsx Style) --- */}
                <div style={{ 
                    gridColumn: '1 / -1', 
                    marginTop: 25, 
                    paddingTop: 15, 
                    borderTop: '1px solid #e2e8f0' 
                }}>
                    <label className="label">Security Check</label>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                        <div style={{fontWeight:800, padding:'10px 15px', background:'#f1f5f9', borderRadius:8, border:'1px solid #e2e8f0', minWidth:150}}>
                            {captcha.question}
                        </div>
                        <input 
                            className="input" 
                            type="number" 
                            placeholder="Your answer" 
                            value={captchaInput} 
                            onChange={e=>setCaptchaInput(e.target.value)} 
                            required 
                            style={{flexGrow:1}}
                        />
                    </div>
                </div>
                {/* --- END CAPTCHA SECTION --- */}

                <div style={{ marginTop: 25, textAlign: 'center' }}>
                    <button className="btn btn-cta" type="submit" disabled={loading} style={{ 
                        background: '#0ea5a4', 
                        color: 'white', 
                        padding: '12px 30px', 
                        fontSize: '16px',
                        fontWeight: 700,
                        width: '50%'
                    }}>
                        {loading ? 'Submitting...' : 'Submit Your Homestay'} 
                    </button>
                </div>
            </form>
        </div>
    );
}