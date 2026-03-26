import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Link as LinkIcon, Type, X, Upload, CheckCircle2, AlertCircle, Loader2, Smartphone, Eye, Megaphone, Trash2, Sparkles } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function BlueprintEditor() {
    const [campaign, setCampaign] = useState({
        headline: '',
        imageUrl: '',
        targetUrl: '',
        is_published: false
    });
    const [isSaving, setIsSaving] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [status, setStatus] = useState(null); 

    // Initial Load
    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const res = await axios.get('/api/blueprints/active');
                if (res.data && res.data.structure && res.data.structure.type === 'campaign') {
                    const content = res.data.structure.content;
                    setCampaign(content);
                    updateWordCount(content.headline);
                }
            } catch (err) { console.error("Load failed", err); }
        };
        fetchCampaign();
    }, []);

    const updateWordCount = (text) => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        setWordCount(words);
    };

    const handleHeadlineChange = (e) => {
        const text = e.target.value;
        const words = text.trim() ? text.trim().split(/\s+/) : [];
        if (words.length <= 100 || text.length < campaign.headline.length) {
            setCampaign({ ...campaign, headline: text });
            updateWordCount(text);
        }
    };

    const handleSave = async (publish = false) => {
        setIsSaving(true);
        setStatus(null);
        try {
            const structure = { type: 'campaign', content: { ...campaign, is_published: publish } };
            const res = await axios.post('/api/blueprints', { name: 'Campaign Node', structure });
            const blueprintId = res.data._id || res.data.id;

            if (publish && blueprintId) {
                await axios.post(`/api/blueprints/publish/${blueprintId}`);
                setStatus({ type: 'success', message: 'Campaign Live!' });
            } else {
                setStatus({ type: 'success', message: 'Config Saved!' });
            }
        } catch (err) {
            const serverMsg = err.response?.data?.error || err.message;
            setStatus({ type: 'error', message: `Save error: ${serverMsg}` });
        } finally {
            setIsSaving(false);
            setTimeout(() => setStatus(null), 4000);
        }
    };

    // --- PREMIUM INLINE STYLES ---
    const s = {
        page: { background: '#050505', minHeight: '100vh', color: '#fff', padding: '40px', fontFamily: "'Outfit', sans-serif" },
        glass: { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px' },
        input: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px 16px 16px 50px', color: '#fff', width: '100%', outline: 'none', fontSize: '14px' },
        label: { fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#fbbc05', marginBottom: '12px', display: 'block' },
        btnMain: { background: '#4285f4', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' },
    };

    return (
        <div style={s.page}>
            {/* Global Smooth Transition Styles */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
                body { margin: 0; background: #050505; }
                input:focus, textarea:focus { border-color: #4285f4 !important; background: rgba(66,133,244,0.05) !important; }
                button:hover { filter: brightness(1.2); transform: translateY(-1px); }
                button:active { transform: translateY(0px); }
            `}</style>

            <AnimatePresence>
                {status && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, background: status.type === 'success' ? '#34a853' : '#ea4335', padding: '12px 24px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.4)', fontWeight: 700, fontSize: '14px' }}>
                        {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {status.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <Megaphone style={{ color: '#4285f4' }} size={28} />
                            <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', margin: 0, background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Campaign Hub
                            </h1>
                        </div>
                        <p style={{ color: '#666', fontSize: '14px', fontWeight: 500 }}>Active Node Configuration & Intelligence Deployment</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => handleSave(false)} style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '12px 24px', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
                            Save Cache
                        </button>
                        <button onClick={() => handleSave(true)} style={s.btnMain}>
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            Deploy Protocol
                        </button>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'start' }}>
                    {/* Form Section */}
                    <div style={{ ...s.glass, padding: '40px' }}>
                        <div style={{ marginBottom: '32px' }}>
                            <label style={s.label}><Type size={12} style={{ marginRight: '8px' }} /> Protocol Headline</label>
                            <div style={{ position: 'relative' }}>
                                <Type style={{ position: 'absolute', left: '16px', top: '16px', color: '#444' }} size={18} />
                                <textarea style={{ ...s.input, height: '120px', resize: 'none' }} placeholder="Mission-critical headline..." value={campaign.headline} onChange={handleHeadlineChange} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: '#444', fontWeight: 800 }}>
                                <span>SYSTEM RESTRICTION: 100 WORDS</span>
                                <span style={{ color: wordCount >= 90 ? '#ea4335' : '#4285f4' }}>{wordCount} / 100</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={s.label}><ImageIcon size={12} style={{ marginRight: '8px' }} /> Strategic Media URL</label>
                            <div style={{ position: 'relative' }}>
                                <ImageIcon style={{ position: 'absolute', left: '16px', top: '16px', color: '#444' }} size={18} />
                                <input style={s.input} type="text" placeholder="https://cdn.platform.com/asset.png" value={campaign.imageUrl} onChange={e => setCampaign({ ...campaign, imageUrl: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ marginBottom: 0 }}>
                            <label style={s.label}><LinkIcon size={12} style={{ marginRight: '8px' }} /> Navigation Target</label>
                            <div style={{ position: 'relative' }}>
                                <LinkIcon style={{ position: 'absolute', left: '16px', top: '16px', color: '#444' }} size={18} />
                                <input style={s.input} type="text" placeholder="https://uniintel.in/destination" value={campaign.targetUrl} onChange={e => setCampaign({ ...campaign, targetUrl: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#444', marginBottom: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                            <Eye size={12} /> Live Intelligence Preview
                        </div>
                        
                        {/* Compact Phone Mockup */}
                        <div style={{ width: '280px', height: '540px', background: '#111', border: '10px solid #222', borderRadius: '48px', padding: '12px', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
                            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100px', height: '20px', background: '#222', borderBottomLeftRadius: '14px', borderBottomRightRadius: '14px', zIndex: 10 }}></div>
                            <div style={{ width: '100%', height: '100%', background: '#000', borderRadius: '32px', overflow: 'hidden', position: 'relative' }}>
                                {/* Mock UI */}
                                <div style={{ padding: '24px', opacity: 0.1, pointerEvents: 'none' }}>
                                    <div style={{ width: '30%', height: '8px', background: '#fff', borderRadius: '4px', marginBottom: '40px' }}></div>
                                    <div style={{ width: '100%', height: '120px', background: '#222', borderRadius: '20px', marginBottom: '20px' }}></div>
                                    <div style={{ width: '90%', height: '10px', background: '#222', borderRadius: '5px', marginBottom: '10px' }}></div>
                                    <div style={{ width: '70%', height: '10px', background: '#222', borderRadius: '5px' }}></div>
                                </div>

                                {/* Active Ad Popup */}
                                <AnimatePresence>
                                    {campaign.headline && (
                                        <motion.div initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                                            style={{ position: 'absolute', top: '25%', left: '16px', right: '16px', zIndex: 100, background: '#fff', borderRadius: '24px', padding: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                                            <div style={{ width: '100%', height: '100px', background: '#f5f5f5', borderRadius: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                                                {campaign.imageUrl ? <img src={campaign.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Ad" /> : <ImageIcon size={30} color="#ccc" />}
                                                <X size={14} style={{ position: 'absolute', top: '8px', right: '8px', color: '#aaa' }} />
                                            </div>
                                            <h4 style={{ color: '#000', margin: '0 0 16px 0', textAlign: 'center', fontSize: '18px', fontWeight: 800, lineHeight: 1.2 }}>{campaign.headline}</h4>
                                            <button style={{ width: '100%', background: '#4285f4', color: '#fff', border: 'none', padding: '10px', borderRadius: '12px', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>Learn More</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1 }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlueprintEditor;
