import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';

function Login({ setUser }) {
  console.log("Login Page Rendering...");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Establish Connection triggered for:", email);
    setLoading(true);
    setError('');

    // Safety alert to confirm button is active
    console.log("Sending request to /api/auth/login...");

    try {
      // Use absolute URL as fallback if proxy is suspect
      const apiUrl = '/api/auth/login';
      const res = await axios.post(apiUrl, { email, password }, { timeout: 10000 });
      console.log("Server Response Received:", res.data);

      if (res.data.status === 'success') {
        if (!res.data.token && res.data.role === 'user') {
          alert("Authenticated as External Personnel. Redirecting to Public Feed.");
        } else {
          alert("Admin Connection Established. Welcome Commander.");
        }

        const userData = { token: res.data.token, role: res.data.role };
        setUser(userData);
        if (res.data.token) localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('userRole', res.data.role);
        navigate('/select');
      } else {
        alert("ACCESS DENIED: Authentication Failed.");
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error("Critical Connection Error:", err);
      let msg = err.message;
      if (err.code === 'ECONNABORTED') msg = "Connection Timeout (10s)";
      if (err.response) msg = `Server Error (${err.response.status}): ${err.response.data?.error || err.response.statusText}`;

      alert("CONNECTION FAILURE: " + msg);
      setError('Connection failed: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass">
        <div className="login-header">
          <div className="logo-box">
            <span className="logo-uni">UNI</span>
            <span className="logo-intel">INTEL</span>
          </div>
          <h2 className="premium-text">Intelligence Access</h2>
          <p>Personnel Authentication Required</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Admin Protocol</label>
            <div className="field-box">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="Identification Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Security Key</label>
            <div className="field-box">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                placeholder="Access Code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Establish Connection'}
          </button>
        </form>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: var(--primary);
          background-image: 
            radial-gradient(circle at 50% 50%, rgba(66, 133, 244, 0.05) 0%, transparent 50%),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 100% 100%, 40px 40px, 40px 40px;
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 3.5rem 2.5rem;
          border-radius: 32px;
          text-align: center;
          position: relative;
        }
        .login-card::before {
            content: '';
            position: absolute;
            top: -2px; left: -2px; right: -2px; bottom: -2px;
            background: linear-gradient(135deg, var(--border-highlight), transparent, var(--border-highlight));
            border-radius: 34px;
            z-index: -1;
            opacity: 0.5;
        }
        .login-header {
          margin-bottom: 3rem;
        }
        .logo-box {
            font-size: 1.8rem;
            font-weight: 900;
            letter-spacing: -1px;
            margin-bottom: 1.5rem;
        }
        .logo-uni { color: var(--text); }
        .logo-intel { color: var(--accent); }

        .login-header h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .login-header p {
          color: var(--text-dim);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
        }
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            text-align: left;
        }
        .input-group label {
            font-size: 0.7rem;
            font-weight: 900;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding-left: 0.5rem;
        }
        .field-box {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--accent);
          opacity: 0.7;
        }
        .field-box input {
          width: 100%;
          padding: 1rem 1.2rem 1rem 3.2rem;
          background: rgba(0, 0, 0, 0.4) !important;
          border-radius: 14px;
        }
        .field-box input:focus {
            border-color: var(--accent);
            box-shadow: 0 0 15px var(--accent-glow);
        }
        .auth-btn {
          background: linear-gradient(135deg, var(--accent), #1d4ed8);
          color: white;
          padding: 1.1rem;
          font-size: 1rem;
          font-weight: 800;
          margin-top: 1rem;
          border-radius: 14px;
          box-shadow: 0 4px 20px var(--accent-glow);
        }
        .auth-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px var(--accent-glow);
        }
        .error-msg {
          color: var(--accent-red);
          font-size: 0.8rem;
          font-weight: 700;
          background: rgba(234, 67, 53, 0.1);
          padding: 0.8rem;
          border-radius: 10px;
          border: 1px solid rgba(234, 67, 53, 0.2);
        }
      `}</style>
    </div>
  );
}

export default Login;
