import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Search, GraduationCap, Filter, ExternalLink, Calendar, 
    Plus, X, Image as ImageIcon, CheckCircle2, AlertCircle,
    ArrowRight, Loader2, Sparkles
} from 'lucide-react';

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
            // Ensure they are sorted by date desc if backend didn't
            const sortedItems = Array.isArray(items) ? items.sort((a,b) => new Date(b.published_at) - new Date(a.published_at)) : [];
            setArticles(sortedItems);
        } catch (err) {
            console.error("Failed to fetch student articles", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setShowAddModal(true);
    };

    const validateFirstStep = () => {
        if (!newArticle.title || !newArticle.image_url || !newArticle.redirect_url) {
            alert("Please fill all fields");
            return false;
        }
        const wordCount = newArticle.description.trim().split(/\s+/).length;
        if (wordCount < 100) {
            alert(`Description must be at least 100 words. Current count: ${wordCount}`);
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
            setNewArticle({ title: '', image_url: '', description: '', redirect_url: '', category: 'Scholarships & Internships' });
            fetchArticles();
            alert("Article published successfully to Student Portal!");
        } catch (err) {
            alert("Failed to publish article");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="student-management-premium p-8 max-w-7xl mx-auto">
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                            <GraduationCap size={32} />
                        </div>
                        Student Intelligence Hub
                    </h2>
                    <p className="text-slate-400 text-lg">Orchestrate premium opportunities and global notifications.</p>
                </div>
                <button 
                    onClick={handleAddClick}
                    className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-xl"
                >
                    <Plus size={24} /> New Manual Article
                </button>
            </header>

            {/* Category Filter */}
            <div className="flex gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-8 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border-2 ${
                            category === cat 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 h-[450px] rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-800">
                            <GraduationCap size={64} className="mx-auto mb-6 text-slate-700" />
                            <p className="text-2xl font-bold text-slate-500">No intelligence found for this sector.</p>
                        </div>
                    ) : (
                        articles.map(article => (
                            <div key={article.id} className="group relative bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 flex flex-col hover:shadow-2xl hover:shadow-blue-500/10">
                                <div className="h-56 relative overflow-hidden">
                                    <img 
                                        src={article.image_url || 'https://images.unsplash.com/photo-1523050853063-913ec98ceed6?auto=format&fit=crop&w=800&q=80'} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                                        alt={article.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                            {article.category}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-8 line-clamp-4 leading-relaxed">
                                        {article.summary || article.content}
                                    </p>
                                    
                                    <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Intelligence Source</span>
                                            <span className="text-sm text-slate-200 font-bold">{article.authority || 'Global Intel'}</span>
                                        </div>
                                        <a 
                                            href={article.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-4 bg-slate-800 rounded-2xl text-white hover:bg-blue-600 transition-all shadow-lg"
                                        >
                                            <ExternalLink size={20} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Add Article Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                    <div className="bg-slate-900 w-full max-w-2xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-white mb-2">New Intelligence Asset</h2>
                                    <p className="text-slate-400">Step 1: Core Configuration</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-400 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleContinueToPublish} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Asset Headline</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:border-blue-500 transition-all outline-none"
                                        placeholder="Enter a compelling headline..."
                                        value={newArticle.title}
                                        onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Image Address</label>
                                        <input 
                                            type="text"
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
                                            placeholder="https://..."
                                            value={newArticle.image_url}
                                            onChange={e => setNewArticle({...newArticle, image_url: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Redirect Link</label>
                                        <input 
                                            type="text"
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
                                            placeholder="https://..."
                                            value={newArticle.redirect_url}
                                            onChange={e => setNewArticle({...newArticle, redirect_url: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Detailed Intelligence (Min 100 Words)</label>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${newArticle.description.split(/\s+/).length >= 100 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            Word Count: {newArticle.description.trim() ? newArticle.description.trim().split(/\s+/).length : 0}
                                        </span>
                                    </div>
                                    <textarea 
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-3xl p-6 text-white h-48 focus:border-blue-500 transition-all outline-none resize-none leading-relaxed"
                                        placeholder="Describe the opportunity or news in detail..."
                                        value={newArticle.description}
                                        onChange={e => setNewArticle({...newArticle, description: e.target.value})}
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-xl"
                                >
                                    Continue to Deployment <ArrowRight size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Publish Modal */}
            {showPublishModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                    <div className="bg-slate-900 w-full max-w-lg rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30">
                                <Sparkles size={40} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2">Final Deployment</h2>
                            <p className="text-slate-400 mb-10">Assign a sector for this intelligence.</p>

                            <div className="space-y-3 mb-10">
                                {categories.slice(1).map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setNewArticle({...newArticle, category: cat})}
                                        className={`w-full p-4 rounded-2xl font-bold border-2 transition-all text-left flex items-center justify-between ${
                                            newArticle.category === cat 
                                            ? 'bg-blue-600/10 border-blue-600 text-blue-400' 
                                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                        }`}
                                    >
                                        {cat}
                                        {newArticle.category === cat && <CheckCircle2 size={20} />}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => { setShowPublishModal(false); setShowAddModal(true); }}
                                    className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all"
                                >
                                    Go Back
                                </button>
                                <button 
                                    onClick={handleFinalPublish}
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-xl disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Deploying...' : 'Deploy Intel'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .student-management-premium { font-family: 'Inter', sans-serif; }
            `}</style>
        </div>
    );
}

export default StudentManagement;
