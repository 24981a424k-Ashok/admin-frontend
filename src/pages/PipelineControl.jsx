import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import {
    Cpu, Zap, Trash2, RefreshCw, CheckCircle2, XCircle,
    Key, Activity, Clock, AlertTriangle, Play, Loader2,
    Server, Database, Globe
} from 'lucide-react';

function PipelineControl() {
    const [health, setHealth] = useState(null);
    const [keypool, setKeypool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actions, setActions] = useState({ ingest: false, digest: false, cache: false });
    const [logs, setLogs] = useState([]);
    const [lastRefresh, setLastRefresh] = useState(null);

    const addLog = (msg, type = 'info') => {
        setLogs(prev => [{ msg, type, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 49)]);
    };

    const fetchStatus = useCallback(async () => {
        try {
            const [healthRes, keypoolRes] = await Promise.allSettled([
                api.get('/api/pipeline/health'),
                api.get('/api/pipeline/keypool-status')
            ]);
            if (healthRes.status === 'fulfilled') setHealth(healthRes.value.data);
            if (keypoolRes.status === 'fulfilled') setKeypool(keypoolRes.value.data);
            setLastRefresh(new Date().toLocaleTimeString());
        } catch (err) {
            addLog('Status fetch failed: ' + err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, [fetchStatus]);

    const triggerIngest = async () => {
        setActions(a => ({ ...a, ingest: true }));
        addLog('⚡ Triggering news ingestion cycle...', 'info');
        try {
            const res = await api.post('/api/pipeline/trigger-ingest');
            addLog('✅ ' + (res.data.message || 'Ingestion initiated successfully'), 'success');
            setTimeout(fetchStatus, 5000);
        } catch (err) {
            addLog('❌ Ingest failed: ' + (err.response?.data?.error || err.message), 'error');
        } finally {
            setActions(a => ({ ...a, ingest: false }));
        }
    };

    const triggerRefresh = async () => {
        setActions(a => ({ ...a, digest: true }));
        addLog('🔄 Refreshing intelligence digest...', 'info');
        try {
            const res = await api.post('/api/pipeline/refresh-digest');
            addLog('✅ ' + (res.data.message || 'Digest refresh initiated'), 'success');
        } catch (err) {
            addLog('❌ Refresh failed: ' + (err.response?.data?.error || err.message), 'error');
        } finally {
            setActions(a => ({ ...a, digest: false }));
        }
    };

    const clearCache = async () => {
        if (!window.confirm('Clear all translation caches? This cannot be undone.')) return;
        setActions(a => ({ ...a, cache: true }));
        addLog('🗑️ Clearing translation cache...', 'info');
        try {
            const res = await api.post('/api/pipeline/clear-cache');
            addLog(`✅ Cache cleared — ${res.data.articles_cleared || 0} articles reset`, 'success');
        } catch (err) {
            addLog('❌ Cache clear failed: ' + (err.response?.data?.error || err.message), 'error');
        } finally {
            setActions(a => ({ ...a, cache: false }));
        }
    };

    const dbInfo = health?.database;
    const sched = health?.scheduler;

    return (
        <div className="pipeline-page">
            <header className="pipe-header">
                <div>
                    <h2 className="premium-text" style={{ fontSize: '1.9rem', marginBottom: '0.3rem' }}>Pipeline Control</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                        AI Engine · Ingestion · Key Pool Monitor
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {lastRefresh && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            Last sync: {lastRefresh}
                        </span>
                    )}
                    <button className="pipe-refresh-btn" onClick={fetchStatus}>
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </header>

            {/* System Health Row */}
            <div className="health-row">
                <div className="health-card glass">
                    <div className="hcard-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                        <Server size={20} />
                    </div>
                    <div className="hcard-body">
                        <span className="hcard-label">Backend Status</span>
                        <span className="hcard-value" style={{ color: loading ? 'var(--text-muted)' : health ? '#10b981' : '#ef4444' }}>
                            {loading ? 'Checking...' : health ? '● ONLINE' : '● OFFLINE'}
                        </span>
                    </div>
                </div>
                <div className="health-card glass">
                    <div className="hcard-icon" style={{ background: 'rgba(66,133,244,0.1)', color: 'var(--accent)' }}>
                        <Database size={20} />
                    </div>
                    <div className="hcard-body">
                        <span className="hcard-label">Articles in DB</span>
                        <span className="hcard-value">{loading ? '...' : dbInfo?.article_count?.toLocaleString() || '0'}</span>
                    </div>
                </div>
                <div className="health-card glass">
                    <div className="hcard-icon" style={{ background: 'rgba(251,206,4,0.1)', color: 'var(--accent-gold)' }}>
                        <Clock size={20} />
                    </div>
                    <div className="hcard-body">
                        <span className="hcard-label">Last Ingest Cycle</span>
                        <span className="hcard-value" style={{ fontSize: '0.85rem' }}>
                            {loading ? '...' : sched?.last_run && sched.last_run !== 'Never'
                                ? new Date(sched.last_run).toLocaleTimeString()
                                : 'Never'}
                        </span>
                    </div>
                </div>
                <div className="health-card glass">
                    <div className="hcard-icon" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>
                        <Key size={20} />
                    </div>
                    <div className="hcard-body">
                        <span className="hcard-label">Active API Keys</span>
                        <span className="hcard-value">{loading ? '...' : keypool?.total || '0'}</span>
                    </div>
                </div>
            </div>

            <div className="pipe-grid">
                {/* Pipeline Actions */}
                <div className="pipe-section glass">
                    <div className="section-header">
                        <Zap size={18} style={{ color: 'var(--accent-gold)' }} />
                        <h3>Pipeline Operations</h3>
                    </div>
                    <div className="action-cards">
                        <div className="action-card">
                            <div className="ac-top">
                                <div className="ac-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                    <Play size={22} />
                                </div>
                                <div>
                                    <strong>Force News Ingest</strong>
                                    <p>Manually trigger a full news collection cycle across all sources. Runs in background.</p>
                                </div>
                            </div>
                            <button
                                className="ac-btn green"
                                onClick={triggerIngest}
                                disabled={actions.ingest}
                            >
                                {actions.ingest ? <Loader2 size={16} className="spin" /> : <Play size={16} />}
                                {actions.ingest ? 'Ingesting...' : 'Trigger Ingest'}
                            </button>
                        </div>

                        <div className="action-card">
                            <div className="ac-top">
                                <div className="ac-icon" style={{ background: 'rgba(66,133,244,0.1)', color: 'var(--accent)' }}>
                                    <RefreshCw size={22} />
                                </div>
                                <div>
                                    <strong>Refresh Intelligence Digest</strong>
                                    <p>Re-run AI analysis and rebuild the news digest from existing collected articles.</p>
                                </div>
                            </div>
                            <button
                                className="ac-btn blue"
                                onClick={triggerRefresh}
                                disabled={actions.digest}
                            >
                                {actions.digest ? <Loader2 size={16} className="spin" /> : <RefreshCw size={16} />}
                                {actions.digest ? 'Refreshing...' : 'Refresh Digest'}
                            </button>
                        </div>

                        <div className="action-card">
                            <div className="ac-top">
                                <div className="ac-icon" style={{ background: 'rgba(234,67,53,0.1)', color: 'var(--accent-red)' }}>
                                    <Trash2 size={22} />
                                </div>
                                <div>
                                    <strong>Clear Translation Cache</strong>
                                    <p>Wipe all cached translations from the database. Articles will be re-translated on next request.</p>
                                </div>
                            </div>
                            <button
                                className="ac-btn red"
                                onClick={clearCache}
                                disabled={actions.cache}
                            >
                                {actions.cache ? <Loader2 size={16} className="spin" /> : <Trash2 size={16} />}
                                {actions.cache ? 'Clearing...' : 'Clear Cache'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Live Logs */}
                <div className="pipe-section glass">
                    <div className="section-header">
                        <Activity size={18} style={{ color: 'var(--accent)' }} />
                        <h3>Operation Log</h3>
                        {logs.length > 0 && (
                            <button style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setLogs([])}>Clear</button>
                        )}
                    </div>
                    <div className="log-terminal">
                        {logs.length === 0 ? (
                            <p className="log-empty">No operations logged yet. Trigger an action above.</p>
                        ) : logs.map((log, i) => (
                            <div key={i} className={`log-entry log-${log.type}`}>
                                <span className="log-time">{log.time}</span>
                                <span className="log-msg">{log.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Key Pool Monitor */}
            <div className="keypool-section glass">
                <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                    <Key size={18} style={{ color: 'var(--accent-gold)' }} />
                    <h3>Live API Key Pool Monitor</h3>
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {keypool ? `${keypool.total} keys loaded` : 'Loading...'}
                    </span>
                </div>

                {loading ? (
                    <div className="kp-loading"><Loader2 size={28} className="spin" /><span>Fetching key pool...</span></div>
                ) : keypool ? (
                    <div className="kp-grid">
                        <div className="kp-group">
                            <div className="kp-group-header">
                                <Globe size={14} />
                                <span>OpenAI Keys — {keypool.openai.count} active</span>
                                <span className="kp-badge openai">{keypool.openai.count}/20</span>
                            </div>
                            <div className="kp-keys">
                                {keypool.openai.keys.map((k) => (
                                    <div key={k.index} className="kp-key-card">
                                        <span className="kp-num">#{k.index}</span>
                                        <span className="kp-key-val">{k.key}</span>
                                        <span className={`kp-status ${k.status}`}>
                                            {k.status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {k.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="kp-group">
                            <div className="kp-group-header">
                                <Cpu size={14} />
                                <span>Groq Keys — {keypool.groq.count} active</span>
                                <span className="kp-badge groq">{keypool.groq.count}/20</span>
                            </div>
                            <div className="kp-keys">
                                {keypool.groq.keys.map((k) => (
                                    <div key={k.index} className="kp-key-card">
                                        <span className="kp-num">#{k.index}</span>
                                        <span className="kp-key-val">{k.key}</span>
                                        <span className={`kp-status ${k.status}`}>
                                            {k.status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {k.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="kp-error">
                        <AlertTriangle size={20} /> Key pool data unavailable — backend may be offline.
                    </div>
                )}
            </div>

            <style>{`
                .pipeline-page { padding: 2.5rem; max-width: 1400px; margin: 0 auto; }
                .pipe-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
                .pipe-refresh-btn {
                    display: flex; align-items: center; gap: 0.5rem;
                    padding: 0.65rem 1.2rem; background: rgba(255,255,255,0.04);
                    border: 1px solid var(--border); border-radius: 10px;
                    color: var(--text-dim); font-size: 0.85rem; cursor: pointer;
                    transition: all 0.2s;
                }
                .pipe-refresh-btn:hover { background: rgba(255,255,255,0.08); color: white; border-color: var(--accent); }

                .health-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
                .health-card {
                    display: flex; align-items: center; gap: 1.2rem;
                    padding: 1.4rem 1.6rem; border-radius: 18px;
                    transition: transform 0.2s;
                }
                .health-card:hover { transform: translateY(-3px); }
                .hcard-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .hcard-body { display: flex; flex-direction: column; gap: 0.2rem; }
                .hcard-label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
                .hcard-value { font-size: 1.1rem; font-weight: 900; color: var(--text); font-family: var(--font-display); }

                .pipe-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
                .pipe-section { padding: 1.8rem; border-radius: 20px; }
                .section-header { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
                .section-header h3 { font-size: 0.9rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text); }

                .action-cards { display: flex; flex-direction: column; gap: 1rem; }
                .action-card {
                    background: rgba(0,0,0,0.25); border: 1px solid var(--border);
                    border-radius: 16px; padding: 1.4rem;
                    display: flex; flex-direction: column; gap: 1rem;
                    transition: border-color 0.2s;
                }
                .action-card:hover { border-color: rgba(255,255,255,0.1); }
                .ac-top { display: flex; gap: 1rem; align-items: flex-start; }
                .ac-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .ac-top div strong { display: block; font-size: 0.95rem; color: var(--text); margin-bottom: 0.3rem; }
                .ac-top div p { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }
                .ac-btn {
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    padding: 0.75rem; border-radius: 10px; font-size: 0.85rem; font-weight: 700;
                    cursor: pointer; transition: all 0.2s; border: none; width: 100%;
                }
                .ac-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .ac-btn.green { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
                .ac-btn.green:hover:not(:disabled) { background: rgba(16,185,129,0.25); }
                .ac-btn.blue { background: rgba(66,133,244,0.15); color: var(--accent); border: 1px solid rgba(66,133,244,0.3); }
                .ac-btn.blue:hover:not(:disabled) { background: rgba(66,133,244,0.25); }
                .ac-btn.red { background: rgba(234,67,53,0.1); color: var(--accent-red); border: 1px solid rgba(234,67,53,0.25); }
                .ac-btn.red:hover:not(:disabled) { background: rgba(234,67,53,0.2); }

                .log-terminal {
                    background: rgba(0,0,0,0.4); border-radius: 12px; border: 1px solid var(--border);
                    padding: 1rem; height: 280px; overflow-y: auto; font-family: monospace;
                    display: flex; flex-direction: column; gap: 0.4rem;
                }
                .log-empty { color: var(--text-muted); font-size: 0.8rem; text-align: center; margin: auto; }
                .log-entry { display: flex; gap: 0.75rem; font-size: 0.78rem; }
                .log-time { color: var(--text-muted); flex-shrink: 0; }
                .log-msg { color: var(--text-dim); }
                .log-entry.log-success .log-msg { color: #10b981; }
                .log-entry.log-error .log-msg { color: var(--accent-red); }
                .log-entry.log-info .log-msg { color: var(--accent); }

                .keypool-section { padding: 2rem; border-radius: 20px; margin-bottom: 1.5rem; }
                .kp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .kp-group-header {
                    display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem;
                    font-size: 0.8rem; font-weight: 800; color: var(--text); text-transform: uppercase; letter-spacing: 1px;
                }
                .kp-badge { margin-left: auto; padding: 0.2rem 0.7rem; border-radius: 100px; font-size: 0.7rem; font-weight: 900; }
                .kp-badge.openai { background: rgba(66,133,244,0.15); color: var(--accent); }
                .kp-badge.groq { background: rgba(16,185,129,0.15); color: #10b981; }
                .kp-keys { display: flex; flex-direction: column; gap: 0.5rem; }
                .kp-key-card {
                    display: flex; align-items: center; gap: 1rem;
                    background: rgba(0,0,0,0.3); border: 1px solid var(--border);
                    border-radius: 10px; padding: 0.7rem 1rem;
                    font-family: monospace; font-size: 0.8rem;
                }
                .kp-num { color: var(--text-muted); font-weight: 900; font-size: 0.7rem; min-width: 24px; }
                .kp-key-val { flex: 1; color: var(--text-dim); }
                .kp-status { display: flex; align-items: center; gap: 0.3rem; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
                .kp-status.active { color: #10b981; }
                .kp-status.rate_limited { color: var(--accent-gold); }
                .kp-status.exhausted { color: var(--accent-red); }
                .kp-loading { display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 3rem; color: var(--text-muted); }
                .kp-error { display: flex; align-items: center; gap: 0.8rem; padding: 2rem; color: var(--accent-gold); font-size: 0.9rem; }

                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 1100px) {
                    .health-row { grid-template-columns: repeat(2, 1fr); }
                    .pipe-grid { grid-template-columns: 1fr; }
                    .kp-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}

export default PipelineControl;
