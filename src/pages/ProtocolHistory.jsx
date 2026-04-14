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
            const historyRes = await axios.get('/api/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(historyRes.data);
        } catch (err) {
            console.error('Failed to fetch protocol history:', err);
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
                        <div key={record.id} className="history-item glass p-6 mb-4 flex items-start gap-4 animate-in">
                            <div className="action-badge p-3 rounded-xl bg-white/5 border border-white/10">
                                {getActionIcon(record.action)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg capitalize">{record.action} {record.target_type || 'Protocol'}</span>
                                        <span className="text-xs text-accent-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">{record.admin_user}</span>
                                    </div>
                                    <span className="text-sm text-dim bg-white/5 px-3 py-1 rounded-full flex items-center gap-2">
                                        <Clock size={12} />
                                        {new Date(record.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-muted text-sm mb-4">
                                    {record.details || `Administrative action performed on ${record.target_type} #${record.target_id}.`}
                                </p>
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
