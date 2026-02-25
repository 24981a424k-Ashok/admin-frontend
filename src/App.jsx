import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardSelector from './pages/DashboardSelector';
import AdminPanel from './pages/AdminPanel';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const role = localStorage.getItem('userRole');
        console.log("App.jsx mounting - Session found:", !!token);
        if (token) {
            setUser({ token, role });
        }
        setLoading(false);
    }, []);

    if (loading) return <div style={{ color: 'white', background: '#0f172a', padding: '2rem', height: '100vh' }}>Loading Admin System...</div>;

    console.log("App rendering route tree. User logged in:", !!user);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setUser={setUser} />} />

                <Route
                    path="/select"
                    element={user && user.token ? <DashboardSelector user={user} /> : <Navigate to="/login" />}
                />

                <Route
                    path="/admin/*"
                    element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/login" />}
                />

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
