import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

function ArticleForm({ article, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'World News',
        country: '',
        bias_rating: 'Neutral',
        impact_score: 5,
        credibility_score: 0.9,
        why_it_matters: '',
        who_is_affected: '',
        short_term_impact: '',
        long_term_impact: '',
        sentiment: 'Neutral',
        summary_bullets: [''],
        impact_tags: ['']
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (article) {
            setFormData({
                ...article,
                summary_bullets: article.summary_bullets.length ? article.summary_bullets : [''],
                impact_tags: article.impact_tags.length ? article.impact_tags : ['']
            });
        }
    }, [article]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (index, value, field) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (index, field) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArray.length ? newArray : [''] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('adminToken');
            const payload = {
                ...formData,
                summary_bullets: formData.summary_bullets.filter(b => b.trim()),
                impact_tags: formData.impact_tags.filter(t => t.trim())
            };

            if (article) {
                await axios.put(`/api/articles/${article.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/articles', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save article');
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        "AI & Machine Learning", "Business & Economy", "Defense & Security",
        "Education", "Entertainment", "Environment & Climate",
        "India / Local News", "Lifestyle & Wellness", "Politics",
        "Science & Health", "Sports", "Technology", "World News", "Other News"
    ];

    return (
        <div className="article-form-overlay">
            <div className="article-form-modal glass">
                <header className="modal-header">
                    <h2>{article ? 'Edit Intelligence' : 'Draft New Intelligence'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </header>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-grid">
                        <div className="form-section full-width">
                            <label>Headline</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="High impact title..."
                                required
                            />
                        </div>

                        <div className="form-section full-width">
                            <label>Core Intelligence (Content)</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Detailed analysis and report..."
                                rows={4}
                                required
                            />
                        </div>

                        <div className="form-section">
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="form-section">
                            <label>Country (Code or Name)</label>
                            <input name="country" value={formData.country} onChange={handleChange} placeholder="e.g. India, USA, Global" />
                        </div>

                        <div className="form-section">
                            <label>Bias Rating</label>
                            <select name="bias_rating" value={formData.bias_rating} onChange={handleChange}>
                                <option value="Neutral">Neutral</option>
                                <option value="Slightly Left">Slightly Left</option>
                                <option value="Slightly Right">Slightly Right</option>
                                <option value="Biased">Biased</option>
                            </select>
                        </div>

                        <div className="form-section">
                            <label>Impact Score (1-10)</label>
                            <input name="impact_score" type="number" min="1" max="10" value={formData.impact_score} onChange={handleChange} />
                        </div>

                        <div className="form-section full-width">
                            <label>Why It Matters</label>
                            <textarea name="why_it_matters" value={formData.why_it_matters} onChange={handleChange} rows={2} />
                        </div>

                        <div className="form-section full-width">
                            <label>Who Is Affected</label>
                            <textarea name="who_is_affected" value={formData.who_is_affected} onChange={handleChange} rows={2} />
                        </div>

                        <div className="form-section full-width">
                            <label>Short Term Impact</label>
                            <textarea name="short_term_impact" value={formData.short_term_impact} onChange={handleChange} rows={2} />
                        </div>

                        <div className="form-section full-width">
                            <label>Long Term Impact</label>
                            <textarea name="long_term_impact" value={formData.long_term_impact} onChange={handleChange} rows={2} />
                        </div>

                        <div className="form-section full-width">
                            <label>Key Insights (Bullet Points)</label>
                            {formData.summary_bullets.map((bullet, idx) => (
                                <div key={idx} className="array-input-group">
                                    <input
                                        value={bullet}
                                        onChange={(e) => handleArrayChange(idx, e.target.value, 'summary_bullets')}
                                        placeholder="Insight point..."
                                    />
                                    <button type="button" onClick={() => removeArrayItem(idx, 'summary_bullets')} className="remove-btn">×</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayItem('summary_bullets')} className="add-btn">+ Add Insight</button>
                        </div>

                        <div className="form-section full-width">
                            <label>Impact Tags</label>
                            <div className="tags-flex">
                                {formData.impact_tags.map((tag, idx) => (
                                    <div key={idx} className="array-input-group mini">
                                        <input
                                            value={tag}
                                            onChange={(e) => handleArrayChange(idx, e.target.value, 'impact_tags')}
                                            placeholder="Tag"
                                        />
                                        <button type="button" onClick={() => removeArrayItem(idx, 'impact_tags')} title="Remove">×</button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addArrayItem('impact_tags')} className="add-btn">+ Tag</button>
                            </div>
                        </div>
                    </div>

                    <footer className="modal-footer">
                        {error && <div className="error-box"><AlertCircle size={16} /> {error}</div>}
                        <div className="flex gap-4 items-center">
                            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                            <button type="submit" disabled={loading} className="save-btn">
                                {loading ? 'Processing...' : 'Verify & Publish Intelligence'}
                            </button>
                        </div>
                    </footer>
                </form>
            </div>

            <style>{`
        .article-form-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 23, 0.85);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .article-form-modal {
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: 20px;
        }
        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h2 { font-size: 1.5rem; margin: 0; color: white; }
        .close-btn { background: transparent; color: #64748b; }
        .close-btn:hover { color: white; }
        
        .modal-body {
          padding: 2rem;
          overflow-y: auto;
          flex: 1;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .form-section { display: flex; flex-direction: column; gap: 0.5rem; }
        .full-width { grid-column: span 2; }
        
        label { font-size: 0.85rem; font-weight: 600; color: #94a3b8; }
        input, select, textarea {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 0.75rem;
          color: white;
          font-size: 0.95rem;
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .array-input-group { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
        .array-input-group input { flex: 1; }
        .remove-btn { color: #ef4444; font-size: 1.5rem; width: 40px; }
        .add-btn { text-align: left; color: #3b82f6; font-size: 0.85rem; font-weight: 600; padding: 0.5rem 0; width: fit-content; }
        
        .tags-flex { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .mini input { width: 100px; padding: 0.4rem 0.6rem; font-size: 0.85rem; }
        
        .modal-footer {
          padding: 1.5rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .error-box { color: #ef4444; display: flex; items: center; gap: 0.5rem; font-size: 0.9rem; }
        .cancel-btn { color: #94a3b8; background: transparent; padding: 0.75rem 1.5rem; }
        .cancel-btn:hover { color: white; }
        .save-btn {
          background: #2563eb;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
        }
        .save-btn:hover { background: #3b82f6; transform: translateY(-1px); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
        </div>
    );
}

export default ArticleForm;
