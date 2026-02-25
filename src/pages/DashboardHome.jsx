import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Activity,
    FileText,
    Megaphone,
    BookOpen,
    TrendingUp,
    Users,
    Shield,
    Clock,
    Zap,
    Globe
} from 'lucide-react';

function DashboardHome() {
    const [stats, setStats] = useState({
        articles: 0,
        ads: 0,
        papers: 0,
        blueprints: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('adminToken');
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const [art, ads, pap, blu] = await Promise.all([
                    axios.get('/api/articles', { headers }),
                    axios.get('/api/ads', { headers }),
                    axios.get('/api/newspapers', { headers }),
                    axios.get('/api/blueprints', { headers })
                ]);
                setStats({
                    articles: art.data.length || 0,
                    ads: ads.data.length || 0,
                    papers: pap.data.length || 0,
                    blueprints: blu.data.length || 0
                });
            } catch (err) {
                console.error("failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Intelligence Assets', value: stats.articles, icon: <FileText />, color: 'var(--accent)' },
        { label: 'Campaign Nodes', value: stats.ads, icon: <Megaphone />, color: 'var(--accent-gold)' },
        { label: 'Publication Sources', value: stats.papers, icon: <BookOpen />, color: '#10b981' },
        { label: 'Active Blueprints', value: stats.blueprints, icon: <Activity />, color: '#a855f7' },
    ];

    return (
        <div className="dashboard-home">
            <header className="home-header">
                <div className="greeting-box">
                    <h1 className="premium-text">Intelligence Command</h1>
                    <p>System operational. All nodes active and reporting.</p>
                </div>
                <div className="system-status">
                    <div className="status-indicator">
                        <div className="pulse"></div>
                        <span>NETWORK SECURE</span>
                    </div>
                </div>
            </header>

            <div className="stats-grid">
                {statCards.map((stat, i) => (
                    <div key={i} className="stat-card glass" style={{ "--card-color": stat.color }}>
                        <div className="stat-icon" style={{ color: stat.color, background: `${stat.color}15` }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value">{loading ? '...' : stat.value}</span>
                        </div>
                        <div className="stat-trend">
                            <TrendingUp size={14} />
                            <span>+12%</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="home-grid-main">
                <div className="activity-panel glass">
                    <div className="panel-header">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-accent" />
                            <h3>Intelligence Modules</h3>
                        </div>
                    </div>
                    <div className="modules-list">
                        <div className="module-item">
                            <div className="module-icon"><Zap size={18} /></div>
                            <div className="module-info">
                                <strong>Category Intelligence</strong>
                                <span>9 Active Sectors (Sports, Politics, Tech...)</span>
                            </div>
                            <Link to="/admin/articles" className="module-link">Manage</Link>
                        </div>
                        <div className="module-item">
                            <div className="module-icon"><Globe size={18} /></div>
                            <div className="module-info">
                                <strong>Global Node Network</strong>
                                <span>12 International Terminals Operational</span>
                            </div>
                            <Link to="/admin/articles" className="module-link">Monitor</Link>
                        </div>
                        <div className="module-item">
                            <div className="module-icon"><BookOpen size={18} /></div>
                            <div className="module-info">
                                <strong>Press & Publications</strong>
                                <span>{stats.papers} Registered Newspaper Sources</span>
                            </div>
                            <Link to="/admin/newspapers" className="module-link">Configure</Link>
                        </div>
                        <div className="module-item">
                            <div className="module-icon"><Megaphone size={18} /></div>
                            <div className="module-info">
                                <strong>Ad & Campaign Nodes</strong>
                                <span>{stats.ads} Strategic Placements Active</span>
                            </div>
                            <Link to="/admin/ads" className="module-link">Deploy</Link>
                        </div>
                    </div>
                </div>

                <div className="quick-actions glass">
                    <div className="panel-header">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-gold" />
                            <h3>Tactical Overview</h3>
                        </div>
                    </div>
                    <div className="quick-grid">
                        <div className="quick-box">
                            <span className="box-val">98%</span>
                            <span className="box-lab">Feed Accuracy</span>
                        </div>
                        <div className="quick-box">
                            <span className="box-val">1.2s</span>
                            <span className="box-lab">Latency Average</span>
                        </div>
                        <div className="quick-box">
                            <span className="box-val">Active</span>
                            <span className="box-lab">AI Synthesis</span>
                        </div>
                        <div className="quick-box">
                            <span className="box-val">0</span>
                            <span className="box-lab">Alerts</span>
                        </div>
                    </div>
                    <div className="action-pills">
                        <button className="pill-btn" onClick={async () => {
                            const token = localStorage.getItem('adminToken');
                            try {
                                await axios.post('/api/sync-intelligence', {}, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                alert('Intelligence synchronization initiated.');
                            } catch (err) {
                                alert('Sync failed: ' + (err.response?.data?.error || err.message));
                            }
                        }}>Re-sync Nodes</button>
                        <button className="pill-btn danger">Emergency Lock</button>
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-home {
                    padding: 2.5rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .home-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 3rem;
                }
                .greeting-box h1 {
                    font-size: 2.5rem;
                    letter-spacing: -1.5px;
                    margin-bottom: 0.5rem;
                }
                .greeting-box p {
                    color: var(--text-muted);
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                }
                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: rgba(16, 185, 129, 0.1);
                    padding: 0.6rem 1.2rem;
                    border-radius: 100px;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    color: #10b981;
                    font-size: 0.7rem;
                    font-weight: 900;
                    letter-spacing: 1.5px;
                }
                .pulse {
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #10b981;
                    animation: pulse-ring 2s infinite;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(2.5); opacity: 0; }
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 2rem;
                    margin-bottom: 3rem;
                }
                .stat-card {
                    padding: 1.8rem;
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    transition: transform 0.3s;
                    position: relative;
                }
                .stat-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--card-color);
                }
                .stat-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .stat-info {
                    display: flex;
                    flex-direction: column;
                }
                .stat-label {
                    color: var(--text-dim);
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .stat-value {
                    font-size: 1.8rem;
                    font-weight: 900;
                    font-family: var(--font-display);
                    color: var(--text);
                }
                .stat-trend {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    color: #10b981;
                    font-size: 0.7rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 2px;
                }

                .home-grid-main {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 2rem;
                }
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border);
                }
                .panel-header h3 {
                    font-size: 1rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: var(--text);
                }
                .view-all {
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: var(--accent);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .activity-panel {
                    padding: 2rem;
                    border-radius: 24px;
                }
                .modules-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .module-item {
                    display: flex;
                    align-items: center;
                    gap: 1.2rem;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 1.2rem;
                    border-radius: 16px;
                    border: 1px solid var(--border);
                    transition: all 0.2s;
                }
                .module-item:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: var(--accent);
                    transform: translateX(5px);
                }
                .module-icon {
                    width: 42px;
                    height: 42px;
                    background: rgba(66, 133, 244, 0.1);
                    color: var(--accent);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .module-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .module-info strong {
                    font-size: 0.95rem;
                    color: var(--text);
                }
                .module-info span {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }
                .module-link {
                    margin-left: auto;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--accent);
                    text-transform: uppercase;
                    text-decoration: none;
                    letter-spacing: 1px;
                }
                .module-link:hover {
                    text-decoration: underline;
                }

                .quick-actions {
                    padding: 2rem;
                    border-radius: 24px;
                }
                .quick-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .quick-box {
                    background: rgba(0,0,0,0.3);
                    padding: 1.2rem;
                    border-radius: 16px;
                    text-align: center;
                    border: 1px solid var(--border);
                }
                .box-val {
                    display: block;
                    font-size: 1.2rem;
                    font-weight: 900;
                    color: var(--text);
                    margin-bottom: 0.2rem;
                }
                .box-lab {
                    display: block;
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .action-pills {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }
                .pill-btn {
                    padding: 0.9rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border);
                    color: var(--text);
                    transition: all 0.2s;
                }
                .pill-btn:hover {
                    background: rgba(255,255,255,0.06);
                    border-color: var(--accent-glow);
                }
                .pill-btn.danger:hover {
                    background: rgba(234, 67, 53, 0.1);
                    border-color: var(--accent-red);
                    color: var(--accent-red);
                }
            `}</style>
        </div>
    );
}

export default DashboardHome;
