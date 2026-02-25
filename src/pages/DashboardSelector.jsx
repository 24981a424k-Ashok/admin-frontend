import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ShieldCheck, LogOut } from 'lucide-react';

function DashboardSelector({ user }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user.role !== 'admin') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      window.location.href = isLocal ? 'http://localhost:8000/dashboard' : 'https://uni-intel-ml-innovator2.hf.space/dashboard';
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  const goToWebsite = () => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    window.location.href = isLocal ? 'http://localhost:8000/dashboard' : 'https://uni-intel-ml-innovator2.hf.space/dashboard';
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="selector-container">
      <div className="selector-content">
        <h1 className="premium-text">Intelligence Terminal</h1>
        <p className="subtitle">AUTHENTICATED PERSONNEL: {user.role.toUpperCase()}</p>

        <div className="selection-grid">
          <div className="selection-card-premium glass" onClick={goToWebsite}>
            <div className="selection-glow"></div>
            <div className="selection-icon-box website">
              <Globe size={48} />
            </div>
            <h3>Public Dashboard</h3>
            <p>Access the live news intelligence feed and global nodes.</p>
            <div className="action-tag">ESTABLISH FEED</div>
          </div>

          {user.role === 'admin' && (
            <div className="selection-card-premium glass" onClick={goToAdmin}>
              <div className="selection-glow"></div>
              <div className="selection-icon-box admin">
                <ShieldCheck size={48} />
              </div>
              <h3>Control Center</h3>
              <p>Execute administrative protocols and blueprint operations.</p>
              <div className="action-tag accent">INITIALIZE CORE</div>
            </div>
          )}
        </div>

        <div className="selector-footer">
          <button className="exit-btn" onClick={handleLogout}>
            <LogOut size={18} /> TERMINATE SESSION
          </button>
        </div>
      </div>

      <style>{`
        .selector-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--primary);
          padding: 2rem;
          background-image: radial-gradient(circle at 50% -20%, rgba(66, 133, 244, 0.15) 0%, transparent 70%);
        }
        .selector-content {
          max-width: 900px;
          width: 100%;
          text-align: center;
        }
        h1 {
          font-size: 3.5rem;
          margin-bottom: 0.5rem;
          letter-spacing: -2px;
        }
        .subtitle {
          color: var(--text-dim);
          font-weight: 800;
          letter-spacing: 4px;
          margin-bottom: 4rem;
          font-size: 0.8rem;
          opacity: 0.8;
        }
        .selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 2.5rem;
          margin-bottom: 4rem;
        }
        .selection-card-premium {
          padding: 3.5rem 2.5rem;
          border-radius: 32px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .selection-glow {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, var(--accent-glow), transparent 70%);
            opacity: 0;
            transition: opacity 0.4s;
        }
        .selection-card-premium:hover {
          transform: translateY(-12px) scale(1.02);
          border-color: var(--accent-glow);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
        }
        .selection-card-premium:hover .selection-glow {
            opacity: 0.2;
        }
        .selection-icon-box {
          width: 100px;
          height: 100px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }
        .selection-icon-box.website {
          background: rgba(66, 133, 244, 0.1);
          color: var(--accent);
          border: 1px solid rgba(66, 133, 244, 0.2);
        }
        .selection-icon-box.admin {
          background: rgba(251, 188, 4, 0.1);
          color: var(--accent-gold);
          border: 1px solid rgba(251, 188, 4, 0.2);
        }
        .selection-card-premium h3 {
          font-family: var(--font-display);
          font-size: 1.8rem;
          margin-bottom: 1rem;
          font-weight: 800;
          position: relative;
          z-index: 1;
        }
        .selection-card-premium p {
          color: var(--text-dim);
          font-size: 1rem;
          margin-bottom: 2rem;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }
        .action-tag {
            font-size: 0.7rem;
            font-weight: 900;
            padding: 0.6rem 1.2rem;
            border-radius: 100px;
            background: rgba(255,255,255,0.05);
            color: var(--text);
            letter-spacing: 2px;
            transition: all 0.3s;
            z-index: 1;
        }
        .selection-card-premium:hover .action-tag {
            background: var(--accent);
            box-shadow: 0 0 15px var(--accent-glow);
        }
        .selection-card-premium:hover .action-tag.accent {
            background: var(--accent-gold);
            color: black;
            box-shadow: 0 0 15px rgba(251, 188, 4, 0.3);
        }

        .exit-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0 auto;
          background: transparent;
          color: var(--text-dim);
          padding: 1rem 2rem;
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.8rem;
          letter-spacing: 2px;
          border: 1px solid var(--border);
        }
        .exit-btn:hover {
          color: var(--accent-red);
          background: rgba(234, 67, 53, 0.05);
          border-color: var(--accent-red);
        }
      `}</style>
    </div>
  );
}

export default DashboardSelector;
