import React, { useState, useEffect } from 'react';
import api from '../api';
import { Save, ShieldAlert, RefreshCw, Smartphone, AlertTriangle } from 'lucide-react';

function SystemSettings() {
    const [config, setConfig] = useState({
        app_version: '1.0.0',
        min_version: '1.0.0',
        force_update: 'false',
        maintenance_mode: 'false',
        maintenance_message: 'System is undergoing scheduled maintenance. Please check back later.'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSync, setLastSync] = useState(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get('/api/config');
                // Backend returns a list of config objects, convert to a simple map
                const configMap = {};
                res.data.forEach(item => {
                    configMap[item.config_key] = item.config_value;
                });
                setConfig(prev => ({ ...prev, ...configMap }));
                setLastSync(new Date().toLocaleTimeString());
            } catch (err) {
                console.error("Failed to fetch system config", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Send requests for each key
            const promises = Object.entries(config).map(([key, value]) => 
                api.post('/api/config', { config_key: key, config_value: String(value) })
            );
            await Promise.all(promises);
            setLastSync(new Date().toLocaleTimeString());
            alert('PROTOCOL UPDATED: Global system parameters synchronized.');
        } catch (err) {
            alert('UPSTREAM ERROR: Failed to synchronize config nodes.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center opacity-50">Initializing Secure Connection...</div>;

    return (
        <div className="system-settings p-8 max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="premium-text text-3xl mb-1">Launch Control</h2>
                    <p className="text-muted text-sm uppercase tracking-widest font-bold">Play Store Deployment Parameters</p>
                </div>
                {lastSync && (
                    <div className="flex items-center gap-2 text-xs text-dim bg-secondary px-3 py-1 rounded-full border border-border">
                        <RefreshCw size={12} className={saving ? 'animate-spin' : ''} />
                        Sync: {lastSync}
                    </div>
                )}
            </header>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="card glass grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div className="form-group">
                        <label className="block text-xs font-black uppercase mb-2 text-accent">Active App Version</label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" size={16} />
                            <input 
                                type="text"
                                className="w-full pl-10"
                                value={config.app_version}
                                onChange={e => setConfig({...config, app_version: e.target.value})}
                                placeholder="e.g. 1.1.0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="block text-xs font-black uppercase mb-2 text-accent">Minimum Required Version</label>
                        <div className="relative">
                            <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-red" size={16} />
                            <input 
                                type="text"
                                className="w-full pl-10"
                                value={config.min_version}
                                onChange={e => setConfig({...config, min_version: e.target.value})}
                                placeholder="e.g. 1.0.5"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="block text-xs font-black uppercase mb-2 text-accent-gold">Force Update Flag</label>
                        <select 
                            className="w-full"
                            value={config.force_update}
                            onChange={e => setConfig({...config, force_update: e.target.value})}
                        >
                            <option value="true">ENABLED (Mandatory Update)</option>
                            <option value="false">DISABLED (Optional Update)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="block text-xs font-black uppercase mb-2 text-accent-gold">System Maintenance Mode</label>
                        <select 
                            className="w-full"
                            value={config.maintenance_mode}
                            onChange={e => setConfig({...config, maintenance_mode: e.target.value})}
                        >
                            <option value="true">MAINTENANCE (System Lock)</option>
                            <option value="false">OPERATIONAL (Public Access)</option>
                        </select>
                    </div>

                    <div className="form-group md:col-span-2">
                        <label className="block text-xs font-black uppercase mb-2 text-muted">Maintenance Message</label>
                        <textarea 
                            className="w-full min-h-[100px]"
                            value={config.maintenance_message}
                            onChange={e => setConfig({...config, maintenance_message: e.target.value})}
                            placeholder="Message displayed to users during maintenance..."
                        />
                    </div>
                </div>

                {config.maintenance_mode === 'true' && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-4 text-red-500 text-sm">
                        <AlertTriangle size={24} />
                        <div>
                            <strong className="block">WARNING: CRITICAL STATE</strong>
                            The system is currently set to Maintenance Mode. All news nodes will be locked for consumer access.
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button 
                        type="button" 
                        className="px-6 py-3 bg-secondary text-dim hover:text-white"
                        onClick={() => window.location.reload()}
                    >
                        Revert
                    </button>
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="px-10 py-3 bg-accent hover:bg-blue-600 shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        <Save size={18} />
                        {saving ? 'Syncing...' : 'Deploy Protocol'}
                    </button>
                </div>
            </form>

            <style>{`
                .form-group label { transition: color 0.2s; }
                .form-group:focus-within label { color: var(--text); }
                input, select, textarea { 
                    font-size: 0.9rem;
                    border: 1px solid var(--border);
                }
                .bg-accent { background-color: var(--accent); }
                .bg-secondary { background-color: var(--secondary); }
                .text-accent { color: var(--accent); }
                .text-accent-red { color: var(--accent-red); }
                .text-accent-gold { color: var(--accent-gold); }
                .text-muted { color: var(--text-muted); }
                .text-dim { color: var(--text-dim); }
                .tracking-widest { letter-spacing: 0.15em; }
            `}</style>
        </div>
    );
}

export default SystemSettings;
