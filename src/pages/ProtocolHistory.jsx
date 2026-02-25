import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, History as HistoryIcon, ArrowLeft, CheckCircle2, Save, Play } from 'lucide-react';

function ProtocolHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            // We fetch all blueprints first to get their IDs, then fetch history for each? 
            // Better: Let's assume there's a global history or we just fetch for the main blueprint 'Primary'.
            const blueprintsRes = await axios.get('/api/blueprints', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const primary = blueprintsRes.data.find(b => b.name === 'Primary') || blueprintsRes.data[0];
            if (primary) {
                const historyRes = await axios.get(`/api/blueprints/history/${primary._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(historyRes.data);
            }
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'publish': return <Play size={16} className="text-accent" />;
            case 'save': return <Save size={16} className="text-gold" />;
            default: return <Clock size={16} className="text-muted" />;
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div></div>;

    return (
        <div className="protocol-history p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="premium-text text-2xl mb-2">Protocol History</h2>
                    <p className="text-muted">Track all administrative changes and blueprint deployments.</p>
                </div>
            </div>

            <div className="history-timeline">
                {history.length === 0 ? (
                    <div className="glass p-8 text-center text-muted">No history records found for the primary protocol.</div>
                ) : (
                    history.map((record, idx) => (
                        <div key={record._id} className="history-item glass p-6 mb-4 flex items-start gap-4 animate-in">
                            <div className="action-badge p-3 rounded-xl bg-white/5 border border-white/10">
                                {getActionIcon(record.action)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-lg capitalize">{record.action} Protocol</span>
                                    <span className="text-sm text-dim bg-white/5 px-3 py-1 rounded-full flex items-center gap-2">
                                        <Clock size={12} />
                                        {new Date(record.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-muted text-sm mb-4">
                                    Blueprint configuration updated and {record.action === 'publish' ? 'deployed to live edge nodes' : 'saved to local storage'}.
                                </p>
                                <div className="flex gap-4">
                                    <button className="text-xs font-bold text-accent uppercase tracking-wider hover:underline">View Snapshot</button>
                                    {record.action !== 'publish' && (
                                        <button className="text-xs font-bold text-gold uppercase tracking-wider hover:underline">Restore This Version</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .history-item {
                    border-left: 4px solid var(--accent);
                    transition: all 0.3s;
                }
                .history-item:hover {
                    transform: translateX(10px);
                    border-left-color: var(--accent-glow);
                    background: rgba(255, 255, 255, 0.05);
                }
                .animate-in {
                    animation: slideIn 0.4s ease-out forwards;
                    opacity: 0;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default ProtocolHistory;
