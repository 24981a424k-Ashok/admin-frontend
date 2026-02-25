import React, { useState } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Settings, History as HistoryIcon, Save, Play, ChevronLeft, LogOut, FileText, Megaphone, BookOpen, Activity } from 'lucide-react';
import BlueprintEditor from '../components/Editor/BlueprintEditor';
import ArticleManagement from './ArticleManagement';
import AdManagement from './AdManagement';
import NewspaperManagement from './NewspaperManagement';
import DashboardHome from './DashboardHome';
import ProtocolHistory from './ProtocolHistory';

function AdminPanel() {
  console.log("AdminPanel component is mounting...");
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);

  const navItems = [
    { path: '/admin', name: 'Command Center', icon: <Activity size={20} /> },
    { path: '/admin/editor', name: 'Blueprint Editor', icon: <Layout size={20} /> },
    { path: '/admin/articles', name: 'Intelligence Assets', icon: <FileText size={20} /> },
    { path: '/admin/ads', name: 'Campaign Nodes', icon: <Megaphone size={20} /> },
    { path: '/admin/newspapers', name: 'Source Nodes', icon: <BookOpen size={20} /> },
    { path: '/admin/history', name: 'Protocol History', icon: <HistoryIcon size={20} /> },
  ];

  const handlePublish = async () => {
    try {
      // For now, we fetch the first blueprint and publish it. 
      // In a real app, you'd select which one to publish.
      const res = await axios.get('/api/blueprints');
      if (res.data && res.data.length > 0) {
        const id = res.data[0]._id;
        await axios.post(`/api/blueprints/publish/${id}`);
        alert('Layout published successfully!');
      }
    } catch (err) {
      alert('Failed to publish layout');
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Nav */}
      <aside className="admin-sidebar glass">
        <div className="sidebar-header">
          <ChevronLeft
            className="back-btn"
            onClick={() => window.location.href = '/select'}
          />
          <div className="logo-area">
            <span className="logo-uni">UNI</span>
            <span className="logo-intel">INTEL</span>
          </div>
        </div>

        <div className="admin-context">
          <span className="context-label">ADMINISTRATION</span>
          <h4 className="context-title">Control Center</h4>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <div className="nav-icon-box">{item.icon}</div>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="publish-btn" onClick={handlePublish}>
            <Play size={18} fill="currentColor" /> Publish Layout
          </button>
          <button className="logout-mini" onClick={() => window.location.href = '/login'}>
            <LogOut size={16} /> System Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="editor" element={<BlueprintEditor />} />
          <Route path="articles" element={<ArticleManagement />} />
          <Route path="ads" element={<AdManagement />} />
          <Route path="newspapers" element={<NewspaperManagement />} />
          <Route path="history" element={<ProtocolHistory />} />
          <Route path="settings" element={<div className="p-4" style={{ color: 'white' }}>Settings coming soon...</div>} />
        </Routes>
      </main>

      <style>{`
        .admin-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: var(--primary);
        }
        .admin-sidebar {
          width: 280px;
          height: 100%;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border);
          z-index: 100;
          box-shadow: 10px 0 30px rgba(0,0,0,0.5);
        }
        .sidebar-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          border-bottom: 1px solid var(--border);
        }
        .logo-area {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: -0.5px;
        }
        .logo-uni { color: var(--text); }
        .logo-intel { color: var(--accent-gold); margin-left: 4px; }
        
        .admin-context {
            padding: 1.5rem 1.5rem 0.5rem;
        }
        .context-label {
            font-size: 0.65rem;
            font-weight: 900;
            color: var(--accent-gold);
            letter-spacing: 1px;
            opacity: 0.8;
        }
        .context-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--text);
            margin-top: 2px;
            font-family: var(--font-display);
        }

        .back-btn {
          cursor: pointer;
          color: var(--text-muted);
          transition: color 0.2s;
        }
        .back-btn:hover { color: var(--text); }

        .sidebar-nav {
          flex: 1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1rem;
          color: var(--text-dim);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.95rem;
          font-weight: 500;
        }
        .nav-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }
        .nav-link:hover .nav-icon-box {
            border-color: var(--accent-glow);
            background: rgba(255,255,255,0.06);
        }
        .nav-link.active {
          background: rgba(66, 133, 244, 0.1);
          color: var(--accent);
        }
        .nav-link.active .nav-icon-box {
            background: var(--accent);
            color: white;
            border-color: var(--accent);
            box-shadow: 0 0 15px var(--accent-glow);
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          background: rgba(0,0,0,0.2);
        }
        .publish-btn {
          background: linear-gradient(135deg, var(--accent), #1d4ed8);
          color: white;
          padding: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          border-radius: 12px;
          font-size: 0.9rem;
          box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
        }
        .publish-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(66, 133, 244, 0.4);
        }
        .logout-mini {
          background: transparent;
          color: var(--text-muted);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          padding: 0.5rem;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .logout-mini:hover { opacity: 1; color: var(--accent-red); }

        .admin-main {
          flex: 1;
          overflow: auto;
          background: var(--primary);
          position: relative;
        }
      `}</style>
    </div>
  );
}

export default AdminPanel;
