import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, BookOpen, Loader2, Globe, Palette } from 'lucide-react';

function NewspaperManagement() {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPaper, setNewPaper] = useState({
        name: '',
        url: '',
        logo_text: '',
        logo_color: '#000000',
        country: 'Global'
    });

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('/api/newspapers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPapers(res.data);
        } catch (err) {
            console.error('Failed to fetch newspapers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPaper = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/newspapers', newPaper, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewPaper({ name: '', url: '', logo_text: '', logo_color: '#000000', country: 'Global' });
            setShowAddForm(false);
            fetchPapers();
        } catch (err) {
            alert('Failed to add newspaper');
        }
    };

    const handleDeletePaper = async (id) => {
        if (!window.confirm('Delete this newspaper?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/newspapers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPapers();
        } catch (err) {
            alert('Failed to delete newspaper');
        }
    };

    return (
        <div className="newspaper-management-page">
            <header className="page-header">
                <div>
                    <h2 className="premium-text" style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Publication Curator</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Managing global intelligence sources and branding nodes.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="create-btn"
                >
                    <Plus size={20} /> Register Source
                </button>
            </header>

            {showAddForm && (
                <div className="glass-modal-overlay">
                    <div className="glass-modal glass p-8">
                        <h2 className="premium-text mb-6" style={{ fontSize: '1.4rem' }}>Register Intelligence Source</h2>
                        <form onSubmit={handleAddPaper} className="flex flex-col gap-6">
                            <div className="input-group">
                                <label>Publication Name</label>
                                <input
                                    type="text" required
                                    value={newPaper.name}
                                    onChange={(e) => setNewPaper({ ...newPaper, name: e.target.value })}
                                    placeholder="e.g. The New York Times"
                                />
                            </div>
                            <div className="input-group">
                                <label>Primary Intelligence URL</label>
                                <input
                                    type="text" required
                                    value={newPaper.url}
                                    onChange={(e) => setNewPaper({ ...newPaper, url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="input-group">
                                    <label>Initials</label>
                                    <input
                                        type="text"
                                        value={newPaper.logo_text}
                                        onChange={(e) => setNewPaper({ ...newPaper, logo_text: e.target.value })}
                                        placeholder="e.g. NYT"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Node Color</label>
                                    <div className="color-input-wrapper">
                                        <input
                                            type="color"
                                            value={newPaper.logo_color}
                                            onChange={(e) => setNewPaper({ ...newPaper, logo_color: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            value={newPaper.logo_color}
                                            onChange={(e) => setNewPaper({ ...newPaper, logo_color: e.target.value })}
                                            style={{ flex: 1, fontSize: '0.75rem' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Intelligence Node</label>
                                <select
                                    value={newPaper.country}
                                    onChange={(e) => setNewPaper({ ...newPaper, country: e.target.value })}
                                    className="premium-select"
                                >
                                    <option value="Global">Global</option>
                                    <option value="USA">USA</option>
                                    <option value="UK">UK</option>
                                    <option value="Japan">Japan</option>
                                    <option value="China">China</option>
                                    <option value="India">India</option>
                                    <option value="Germany">Germany</option>
                                    <option value="France">France</option>
                                    <option value="Russia">Russia</option>
                                    <option value="Australia">Australia</option>
                                    <option value="UAE">UAE</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Initialize Source</button>
                                <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">Discard</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <Loader2 className="animate-spin" size={40} />
                    <p>Scanning intelligence sources...</p>
                </div>
            ) : (
                <div className="paper-grid">
                    {papers.map(paper => (
                        <div key={paper.id} className="paper-card-premium">
                            <div className="paper-preview-box">
                                <div
                                    className="paper-mock-logo-lg"
                                    style={{ color: paper.logo_color }}
                                >
                                    {paper.logo_text || paper.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="paper-actions-overlay">
                                    <button
                                        onClick={() => handleDeletePaper(paper.id)}
                                        className="paper-remove-btn"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="paper-meta">
                                <div className="node-tag">
                                    <Globe size={12} /> {paper.country.toUpperCase()} NODE
                                </div>
                                <h3 className="paper-name">{paper.name}</h3>
                                <p className="paper-url-text">{paper.url}</p>
                            </div>
                        </div>
                    ))}

                    {papers.length === 0 && (
                        <div className="col-span-full py-20 text-center glass rounded-3xl" style={{ borderStyle: 'dashed' }}>
                            <BookOpen className="mx-auto text-slate-800 mb-4" size={64} />
                            <p className="text-slate-500 text-lg">No publications registered.</p>
                            <button onClick={() => setShowAddForm(true)} className="text-emerald-500 mt-2 font-bold hover:underline">Add your first newspaper</button>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .newspaper-management-page {
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
                .input-group input, .premium-select {
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
                }
                .cancel-btn {
                    flex: 1;
                    background: transparent;
                    border: 1px solid var(--border);
                    color: var(--text-dim);
                    padding: 0.9rem;
                }

                .paper-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                }
                .paper-card-premium {
                    background: var(--secondary);
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .paper-card-premium:hover {
                    transform: translateY(-5px);
                    border-color: var(--accent-glow);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }
                .paper-preview-box {
                    height: 140px;
                    background: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .paper-mock-logo-lg {
                    font-size: 3rem;
                    font-weight: 800;
                    font-family: serif;
                    letter-spacing: -2px;
                    filter: drop-shadow(0 0 10px rgba(255,255,255,0.1));
                }
                .paper-actions-overlay {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .paper-card-premium:hover .paper-actions-overlay {
                    opacity: 1;
                }
                .paper-remove-btn {
                    background: rgba(234, 67, 53, 0.1);
                    color: var(--accent-red);
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(234, 67, 53, 0.2);
                    border-radius: 10px;
                }
                .paper-remove-btn:hover {
                    background: var(--accent-red);
                    color: white;
                }
                .paper-meta {
                    padding: 1.5rem;
                }
                .node-tag {
                    font-size: 0.6rem;
                    font-weight: 900;
                    color: var(--accent);
                    letter-spacing: 2px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.8rem;
                }
                .paper-name {
                    font-family: var(--font-display);
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: var(--text);
                }
                .paper-url-text {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    margin-top: 0.4rem;
                    word-break: break-all;
                }
            `}</style>
        </div>
    );
}

export default NewspaperManagement;
