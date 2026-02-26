import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Image as ImageIcon, Loader2, Sparkles, Megaphone } from 'lucide-react';

function AdManagement() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAd, setNewAd] = useState({ image_url: '', caption: '', position: 'both', target_node: 'Global', target_url: '' });

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('/api/ads', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAds(res.data);
        } catch (err) {
            console.error('Failed to fetch ads:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAd = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/ads', newAd, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewAd({ image_url: '', caption: '', position: 'both', target_node: 'Global', target_url: '' });
            setShowAddForm(false);
            fetchAds();
        } catch (err) {
            alert('Failed to add advertisement');
        }
    };

    const handleDeleteAd = async (id) => {
        if (!window.confirm('Remove this advertisement?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/ads/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAds();
        } catch (err) {
            alert('Failed to remove advertisement');
        }
    };

    return (
        <div className="ad-management-page">
            <header className="page-header">
                <div>
                    <h2 className="premium-text" style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Campaign Assets</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Managing sidebar and mobile advertisement intelligence.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="create-btn"
                >
                    <Plus size={20} /> New Asset
                </button>
            </header>

            {showAddForm && (
                <div className="glass-modal-overlay">
                    <div className="glass-modal glass p-8">
                        <h2 className="premium-text mb-6" style={{ fontSize: '1.4rem' }}>New Intelligence Asset</h2>
                        <form onSubmit={handleAddAd} className="flex flex-col gap-6">
                            <div className="input-group">
                                <label>Asset Image URL</label>
                                <input
                                    type="text"
                                    required
                                    value={newAd.image_url}
                                    onChange={(e) => setNewAd({ ...newAd, image_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="input-group">
                                <label>Campaign Headline</label>
                                <input
                                    type="text"
                                    value={newAd.caption}
                                    onChange={(e) => setNewAd({ ...newAd, caption: e.target.value })}
                                    placeholder="e.g. Premium Intelligence Access"
                                />
                            </div>
                            <div className="input-group">
                                <label>Asset Position</label>
                                <select
                                    className="glass-select"
                                    value={newAd.position}
                                    onChange={(e) => setNewAd({ ...newAd, position: e.target.value })}
                                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', padding: '0.8rem', borderRadius: '12px', color: 'white' }}
                                >
                                    <option value="both">Both Sides</option>
                                    <option value="left">Left Sidebar Only</option>
                                    <option value="right">Right Sidebar Only</option>
                                    <option value="mobile">Mobile Overlay</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Target Redirection URL (Optional)</label>
                                <input
                                    type="text"
                                    value={newAd.target_url || ''}
                                    onChange={(e) => setNewAd({ ...newAd, target_url: e.target.value })}
                                    placeholder="https://client-site.com"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Initialize Asset</button>
                                <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">Discard</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <Loader2 className="animate-spin" size={40} />
                    <p>Fetching campaign assets...</p>
                </div>
            ) : (
                <div className="ad-grid">
                    {ads.map(ad => (
                        <div key={ad.id} className="ad-card-premium">
                            <div className="ad-image-box">
                                <img src={ad.image_url} alt={ad.caption} className="ad-preview-img" />
                                <div className="ad-overlay-actions">
                                    <button
                                        onClick={() => handleDeleteAd(ad.id)}
                                        className="remove-icon-btn"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>
                            <div className="ad-meta">
                                <div className="sponsored-tag">
                                    <Sparkles size={14} /> SPONSORED INTELLIGENCE • {ad.position?.toUpperCase() || 'BOTH'}
                                </div>
                                <h3 className="ad-title">{ad.caption || 'No Caption Provided'}</h3>
                                <p className="ad-url text-xs text-blue-400 mt-1 truncate">{ad.target_url || 'No redirect URL'}</p>
                                <p className="ad-url text-xs text-slate-500 mt-1 truncate">{ad.image_url}</p>
                            </div>
                        </div>
                    ))}

                    {ads.length === 0 && (
                        <div className="col-span-full py-20 text-center glass rounded-3xl" style={{ borderStyle: 'dashed' }}>
                            <ImageIcon className="mx-auto text-slate-800 mb-4" size={64} />
                            <p className="text-slate-500 text-lg">No advertisement assets found.</p>
                            <button onClick={() => setShowAddForm(true)} className="text-blue-500 mt-2 font-bold hover:underline">Click to start adding images</button>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .ad-management-page {
                    padding: 2.5rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 3rem;
                }
                .create-btn {
                    background: linear-gradient(135deg, var(--accent), #1d4ed8);
                    color: white;
                    padding: 0.8rem 1.6rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    box-shadow: 0 4px 15px var(--accent-glow);
                }
                .create-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px var(--accent-glow);
                }

                .glass-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(12px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 2rem;
                }
                .glass-modal {
                    width: 100%;
                    max-width: 500px;
                    border-radius: 24px;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                }
                .input-group label {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .input-group input {
                    background: rgba(0,0,0,0.3) !important;
                }
                .modal-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .save-btn {
                    flex: 1;
                    background: var(--accent);
                    color: white;
                    padding: 0.9rem;
                    font-weight: 700;
                }
                .cancel-btn {
                    flex: 1;
                    background: transparent;
                    border: 1px solid var(--border);
                    color: var(--text-dim);
                    padding: 0.9rem;
                }

                .ad-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 2.5rem;
                }
                .ad-card-premium {
                    background: var(--secondary);
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .ad-card-premium:hover {
                    transform: translateY(-8px);
                    border-color: var(--accent-glow);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }
                .ad-image-box {
                    height: 220px;
                    position: relative;
                    background: #000;
                    overflow: hidden;
                }
                .ad-preview-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.6;
                    transition: opacity 0.3s, transform 0.5s;
                }
                .ad-card-premium:hover .ad-preview-img {
                    opacity: 0.8;
                    transform: scale(1.05);
                }
                .ad-overlay-actions {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .ad-card-premium:hover .ad-overlay-actions {
                    opacity: 1;
                }
                .remove-icon-btn {
                    background: var(--accent-red);
                    color: white;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(234, 67, 53, 0.4);
                }
                .ad-meta {
                    padding: 1.5rem;
                }
                .sponsored-tag {
                    font-size: 0.6rem;
                    font-weight: 900;
                    color: var(--accent-gold);
                    letter-spacing: 2px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.8rem;
                }
                .ad-title {
                    font-family: var(--font-display);
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: var(--text);
                }
                .ad-url {
                    font-size: 0.7rem;
                    color: var(--border-highlight);
                    margin-top: 0.4rem;
                    word-break: break-all;
                }
            `}</style>
        </div>
    );
}

export default AdManagement;
