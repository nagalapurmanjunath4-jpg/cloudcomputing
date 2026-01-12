import React, { useState } from 'react';

const Login = ({ onLogin, onSwitchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                onLogin(data);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <div className="card animate-fade" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h2 className="title">Login</h2>
            {error && <div className="error-box">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Don't have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={onSwitchToRegister}>Register</span>
            </p>
        </div>
    );
};

export default Login;
