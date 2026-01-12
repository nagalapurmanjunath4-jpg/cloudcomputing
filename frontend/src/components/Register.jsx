import React, { useState } from 'react';

const Register = ({ onRegister, onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }),
            });
            const data = await response.json();
            if (response.ok) {
                onRegister(); // Successfully registered
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <div className="card animate-fade" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h2 className="title">Register</h2>
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
                <div className="form-group">
                    <label>Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Already have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={onSwitchToLogin}>Login</span>
            </p>
        </div>
    );
};

export default Register;
