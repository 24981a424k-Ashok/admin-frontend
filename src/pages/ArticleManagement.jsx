import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, ExternalLink, Filter, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';
import ArticleForm from '../components/Article/ArticleForm';

function ArticleManagement() {
    const [articles, setArticles] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [refreshMessage, setRefreshMessage] = useState('');

    const categories = ['All', 'AI & Machine Learning', 'Business & Economy', 'Defense & Security', 'Entertainment', 'Politics', 'Science & Health', 'Sports', 'Technology', 'World News', 'India / Local News'];

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('/api/articles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setArticles(res.data);
        } catch (err) {
            console.error('Failed to fetch articles:', err);
            alert('Failed to load articles');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setRefreshMessage('');
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post('/api/articles/refresh', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setRefreshMessage('Live site updated!');
                setTimeout(() => setRefreshMessage(''), 3000);
            }
        } catch (err) {
            alert('Failed to refresh live site');
        } finally {
            setRefreshing(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/articles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setArticles(articles.filter(a => (a.id || a._id) !== id));
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            alert(`Failed to delete article: ${errorMsg}`);
        }
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingArticle(null);
        setShowForm(true);
    };

    // This line was duplicated and is now removed to avoid redeclaration.
    // const categories = ['All', ...new Set(articles.map(a => a.category))];

    const filteredArticles = articles
        .filter(art => {
            const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                art.content.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeTab === 'All' || art.category === activeTab;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

    if (showForm) {
        return (
            <ArticleForm
                article={editingArticle}
                onClose={() => setShowForm(false)}
                onSave={() => {
                    setShowForm(false);
                    fetchArticles();
                }}
            />
        );
    }

    return (
        <div className="article-management">
            <header className="page-header">
                <div>
                    <h2 className="premium-text" style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Intel Management</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Curating and analyzing global intelligence artifacts.</p>
                </div>
                <div className="header-actions">
                    <button className="sync-btn" onClick={handleRefresh} disabled={refreshing}>
                        <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                        {refreshMessage || 'Sync with Live'}
                    </button>
                    <button className="create-btn" onClick={handleCreate}>
                        <Plus size={20} /> New Article
                    </button>
                </div>
            </header>

            <div className="management-controls glass">
                <div className="search-bar-premium">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search headlines or intelligence content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="category-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`cat-tab ${activeTab === cat ? 'active' : ''}`}
                            onClick={() => setActiveTab(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 className="animate-spin mb-4" size={40} />
                    <p>Syncing with Intelligence Database...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredArticles
                        .sort((a, b) => new Date(a.published_at) - new Date(b.published_at))
                        .map((art, index) => (
                            <div key={art.id} className="premium-article-card group">
                                <div className="card-index">#{index + 1}</div>
                                <div className="flex justify-between items-start gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="category-badge">
                                                {art.category}
                                            </span>
                                            <span className="timestamp">
                                                {new Date(art.published_at).toLocaleString()}
                                            </span>
                                            {art.country && (
                                                <span className="country-tag">
                                                    {art.country}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="article-title">
                                            {art.title}
                                        </h3>
                                        <p className="article-preview">
                                            {art.content}
                                        </p>
                                        <div className="tag-container">
                                            {art.impact_tags && art.impact_tags.length > 0 && art.impact_tags.map((tag, i) => (
                                                <span key={i} className="impact-tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="action-buttons">
                                        <button
                                            onClick={() => handleEdit(art)}
                                            className="edit-btn"
                                            title="Edit Intelligence"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(art.id)}
                                            className="delete-btn"
                                            title="Delete Node"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {filteredArticles.length === 0 && (
                        <div className="text-center py-20 glass-card">
                            <p className="text-slate-500 text-lg">No intelligence findings match your search.</p>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .article-management {
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
                .header-actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .sync-btn {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border);
                    color: var(--text-dim);
                    padding: 0.8rem 1.4rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.9rem;
                }
                .sync-btn:hover:not(:disabled) {
                    background: rgba(255,255,255,0.06);
                    color: white;
                    border-color: var(--accent);
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

                .management-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    padding: 1.5rem;
                    border-radius: 20px;
                    margin-bottom: 3rem;
                }
                .search-bar-premium {
                    position: relative;
                    width: 100%;
                }
                .search-bar-premium input {
                    width: 100%;
                    padding: 1.1rem 1.25rem 1.1rem 3.5rem;
                    background: rgba(0,0,0,0.3) !important;
                    font-size: 1rem;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                }
                .search-icon {
                    position: absolute;
                    left: 1.4rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }
                .category-tabs {
                    display: flex;
                    gap: 0.6rem;
                    overflow-x: auto;
                    padding-bottom: 0.5rem;
                }
                .cat-tab {
                    padding: 0.65rem 1.35rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border);
                    color: var(--text-dim);
                    font-size: 0.85rem;
                    white-space: nowrap;
                    border-radius: 10px;
                }
                .cat-tab:hover { background: rgba(255,255,255,0.06); color: var(--text); }
                .cat-tab.active {
                    background: var(--accent);
                    color: white;
                    border-color: var(--accent);
                    box-shadow: 0 4px 12px var(--accent-glow);
                }

                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    color: var(--text-muted);
                    gap: 1.5rem;
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .premium-article-card {
                    background: var(--secondary);
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    padding: 1.75rem;
                    position: relative;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-bottom: 1.5rem;
                }
                .premium-article-card:hover {
                    background: rgba(255,255,255,0.02);
                    border-color: rgba(66, 133, 244, 0.3);
                    transform: translateY(-4px);
                    box-shadow: 10px 10px 40px rgba(0,0,0,0.4);
                }
                .card-index {
                    position: absolute;
                    top: 1.25rem;
                    right: 1.5rem;
                    font-family: var(--font-display);
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: rgba(255,255,255,0.05);
                }
                .category-badge {
                    padding: 0.3rem 0.8rem;
                    border-radius: 6px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    background: rgba(66, 133, 244, 0.1);
                    color: var(--accent);
                    border: 1px solid rgba(66, 133, 244, 0.2);
                    display: inline-block;
                }
                .timestamp {
                    color: var(--text-muted);
                    font-size: 0.75rem;
                }
                .article-title {
                    font-size: 1.35rem;
                    font-family: var(--font-display);
                    font-weight: 700;
                    color: var(--text);
                    margin: 1.2rem 0 0.8rem;
                    line-height: 1.4;
                }
                .article-preview {
                    color: var(--text-dim);
                    line-height: 1.7;
                    font-size: 0.95rem;
                    margin-bottom: 1.5rem;
                }
                .impact-tag {
                    color: var(--text-muted);
                    font-size: 0.7rem;
                    background: rgba(255,255,255,0.02);
                    padding: 0.25rem 0.6rem;
                    border: 1px solid var(--border);
                    border-radius: 6px;
                }
                .action-buttons {
                    display: flex;
                    gap: 0.6rem;
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid var(--border);
                }
                .edit-btn, .delete-btn {
                    padding: 0.6rem 1.2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    border-radius: 10px;
                    border: 1px solid var(--border);
                    background: rgba(255,255,255,0.02);
                    color: var(--text-dim);
                    transition: all 0.2s;
                }
                .edit-btn:hover { background: var(--accent); color: white; border-color: var(--accent); }
                .delete-btn:hover { background: rgba(234, 67, 53, 0.1); color: var(--accent-red); border-color: var(--accent-red); }
            `}</style>
        </div>
    );
}

export default ArticleManagement;
