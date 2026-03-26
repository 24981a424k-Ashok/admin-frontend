import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Search, GraduationCap, Filter, ExternalLink, Calendar, 
    Plus, X, Image as ImageIcon, CheckCircle2, AlertCircle,
    ArrowRight, Loader2, Sparkles, Megaphone, Globe, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function StudentManagement() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [newArticle, setNewArticle] = useState({
        title: '',
        image_url: '',
        description: '',
        redirect_url: '',
        category: 'Scholarships & Internships'
    });

    const categories = ["All", "Scholarships & Internships", "Exams & Results", "Policy & Research", "Admissions & Courses", "Campus Life", "Career & Jobs"];

    useEffect(() => {
        fetchArticles();
    }, [category]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(`/api/articles?category=${category}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const items = res.data.articles || res.data;
            const sortedItems = Array.isArray(items) ? items.sort((a,b) => new Date(b.published_at) - new Date(a.published_at)) : [];
            setArticles(sortedItems);
        } catch (err) {
            console.error("Failed to fetch student articles", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setNewArticle({ title: '', image_url: '', description: '', redirect_url: '', category: 'Scholarships & Internships' });
        setShowAddModal(true);
    };

    const validateFirstStep = () => {
        if (!newArticle.title || !newArticle.image_url || !newArticle.redirect_url || !newArticle.description) {
            alert("Please fill all mission-critical fields");
            return false;
        }
        const wordCount = newArticle.description.trim() ? newArticle.description.trim().split(/\s+/).length : 0;
        if (wordCount < 100) {
            alert(`Intelligence depth insufficient. Current count: ${wordCount} words. Requirement: 100+ words.`);
            return false;
        }
        return true;
    };

    const handleContinueToPublish = (e) => {
        e.preventDefault();
        if (validateFirstStep()) {
            setShowAddModal(false);
            setShowPublishModal(true);
        }
    };

    const handleFinalPublish = async () => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/student/articles', newArticle, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowPublishModal(false);
            fetchArticles();
            alert("Intelligence Node Deployed Successfully!");
        } catch (err) {
            alert("Deployment failure. Check connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- PREMIUM INLINE STYLES ---
    const s = {
        page: { background: '#050505', minHeight: '100vh', color: '#fff', padding: '40px', fontFamily: "'Outfit', 'Inter', sans-serif" },
        glass: { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px' },
        card: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '28px', overflow: 'hidden', transition: 'all 0.4s ease', display: 'flex', flexDirection: 'column' },
        input: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', color: '#fff', width: '100%', outline: 'none', fontSize: '14px' },
        btnPri: { background: '#fff', color: '#000', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
        badge: { background: 'rgba(66,133,244,0.1)', color: '#4285f4', padding: '4px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' },
        modal: { position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }
    };

    return (
        <div style={s.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap');
                body { margin: 0; background: #050505; }
                .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }
                .art-card:hover { transform: translateY(-8px); border-color: rgba(66,133,244,0.4) !important; background: rgba(255,255,255,0.05) !important; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
                .cat-pill { padding: 12px 24px; border-radius: 100px; font-weight: 700; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); color: #888; transition: all 0.3s; white-space: nowrap; }
                .cat-pill.active { background: #4285f4; color: #fff; border-color: #4285f4; box-shadow: 0 10px 25px rgba(66,133,244,0.3); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                textarea:focus, input:focus { border-color: #4285f4 !important; background: rgba(66,133,244,0.05) !important; }
            `}</style>

            <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                            <div style={{ background: '#4285f4', padding: '10px', borderRadius: '16px' }}><GraduationCap size={32} color="#fff" /></div>
                            <h1 style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-1.5px', margin: 0 }}>Student Intelligence</h1>
                        </div>
                        <p style={{ color: '#666', fontSize: '18px', margin: 0, fontWeight: 500 }}>Global Sector Monitoring & Opportunity Deployment</p>
                    </div>
                    <button onClick={handleAddClick} style={s.btnPri}>
                        <Plus size={20} /> Deploy Manual Article
                    </button>
                </header>

                {/* Filters */}
                <div className="no-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginBottom: '48px', paddingBottom: '10px' }}>
                    {categories.map(cat => (
                        <div key={cat} onClick={() => setCategory(cat)} className={`cat-pill ${category === cat ? 'active' : ''}`}>
                            {cat}
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="grid-container">
                        {[1,2,3,4,5,6].map(i => <div key={i} style={{ ...s.card, height: '400px', opacity: 0.1 }}></div>)}
                    </div>
                ) : (
                    <div className="grid-container">
                        {articles.length === 0 ? (
                            <div style={{ colSpan: 'all', textAlign: 'center', padding: '100px', ...s.glass, gridColumn: '1 / -1' }}>
                                <Globe size={48} color="#222" style={{ marginBottom: '20px' }} />
                                <h3 style={{ color: '#444', fontSize: '24px' }}>No active intelligence in this sector.</h3>
                            </div>
                        ) : (
                            articles.map(article => (
                                <div key={article.id} className="art-card" style={s.card}>
                                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                        <img src={article.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                                        <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                                            <span style={s.badge}>{article.category}</span>
                                        </div>
                                    </div>
                                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1.3, marginBottom: '12px' }}>{article.title}</h3>
                                        <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>{article.summary}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#333' }}></div>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#444' }}>{article.authority || 'SOURCE NODE'}</span>
                                            </div>
                                            <a href={article.url} target="_blank" rel="noreferrer" style={{ color: '#4285f4' }}><ExternalLink size={18} /></a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* MODALS WITHOUT OVERLAP */}
            <AnimatePresence>
                {showAddModal && (
                    <div style={s.modal} onClick={() => setShowAddModal(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            style={{ ...s.glass, background: '#0a0a0a', width: '100%', maxWidth: '700px', cursor: 'default' }} onClick={e => e.stopPropagation()}>
                            <div style={{ padding: '40px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>Create Intelligence Node</h2>
                                        <p style={{ color: '#666', fontSize: '14px' }}>Step 1: Core Configuration</p>
                                    </div>
                                    <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer' }}><X /></button>
                                </div>
                                <div style={{ display: 'grid', gap: '24px' }}>
                                    <input style={s.input} placeholder="Mission Headline" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <input style={s.input} placeholder="Image URL" value={newArticle.image_url} onChange={e => setNewArticle({...newArticle, image_url: e.target.value})} />
                                        <input style={s.input} placeholder="Target Redirect URL" value={newArticle.redirect_url} onChange={e => setNewArticle({...newArticle, redirect_url: e.target.value})} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#444' }}>INTEL DEPTH (MIN 100 WORDS)</span>
                                            <span style={{ fontSize: '10px', fontWeight: 800, color: newArticle.description.split(/\s+/).length >= 100 ? '#34a853' : '#444' }}>
                                                {newArticle.description.trim() ? newArticle.description.trim().split(/\s+/).length : 0} WORDS
                                            </span>
                                        </div>
                                        <textarea style={{ ...s.input, height: '160px', resize: 'none' }} placeholder="Provide detailed intelligence coverage..." value={newArticle.description} onChange={e => setNewArticle({...newArticle, description: e.target.value})} />
                                    </div>
                                    <button onClick={handleContinueToPublish} style={{ ...s.btnPri, background: '#4285f4', color: '#fff', justifyContent: 'center', width: '100%', padding: '18px' }}>
                                        Analyze & Proceed <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showPublishModal && (
                    <div style={s.modal} onClick={() => setShowPublishModal(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            style={{ ...s.glass, background: '#0a0a0a', width: '100%', maxWidth: '500px', cursor: 'default', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                            <div style={{ padding: '48px' }}>
                                <div style={{ background: 'rgba(66,133,244,0.1)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                    <Zap color="#4285f4" size={32} />
                                </div>
                                <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px' }}>Deployment Path</h2>
                                <p style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>Target specific student sector for this node.</p>
                                
                                <div style={{ display: 'grid', gap: '10px', marginBottom: '32px' }}>
                                    {categories.slice(1).map(cat => (
                                        <div key={cat} onClick={() => setNewArticle({...newArticle, category: cat})} 
                                            style={{ padding: '16px', borderRadius: '16px', border: '1px solid', borderColor: newArticle.category === cat ? '#4285f4' : 'rgba(255,255,255,0.05)', background: newArticle.category === cat ? 'rgba(66,133,244,0.05)' : 'transparent', color: newArticle.category === cat ? '#4285f4' : '#888', fontWeight: 700, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between' }}>
                                            {cat} {newArticle.category === cat && <CheckCircle2 size={16} />}
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <button onClick={() => { setShowPublishModal(false); setShowAddModal(true); }} style={{ ...s.btnPri, background: 'transparent', border: '1px solid #333', color: '#888', justifyContent: 'center' }}>Back</button>
                                    <button onClick={handleFinalPublish} disabled={isSubmitting} style={{ ...s.btnPri, background: '#4285f4', color: '#fff', justifyContent: 'center' }}>
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Deploy'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default StudentManagement;
