import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const AdminDashboard = ({ user }) => {
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        pricePerUnit: '',
        unitsIncluded: '',
        validity: '',
        status: 'Active',
        description: ''
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const token = user?.token; // Assuming we store token in user object on login
            const res = await fetch(`${API_BASE_URL}/api/admin/plans`, {
                headers: { 'auth-token': token }
            });
            const data = await res.json();
            if (res.ok) setPlans(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = user?.token;
            const res = await fetch(`${API_BASE_URL}/api/admin/plans`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Plan Created!');
                fetchPlans();
                setFormData({ name: '', pricePerUnit: '', unitsIncluded: '', validity: '', status: 'Active', description: '' });
            } else {
                alert('Failed to create plan');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this plan?')) return;
        try {
            const token = user?.token;
            await fetch(`${API_BASE_URL}/api/admin/plans/${id}`, {
                method: 'DELETE',
                headers: { 'auth-token': token }
            });
            fetchPlans();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="animate-fade">
            <h1 className="title">Admin Dashboard</h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Create New Plan</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input type="text" name="name" placeholder="Plan Name" value={formData.name} onChange={handleChange} required className="input" />
                    <input type="number" name="pricePerUnit" placeholder="Price per Unit" value={formData.pricePerUnit} onChange={handleChange} required className="input" />
                    <input type="number" name="unitsIncluded" placeholder="Units Included" value={formData.unitsIncluded} onChange={handleChange} required className="input" />
                    <input type="number" name="validity" placeholder="Validity (Days)" value={formData.validity} onChange={handleChange} required className="input" />
                    <select name="status" value={formData.status} onChange={handleChange} className="input">
                        <option value="Active">Active</option>
                        <option value="Archived">Archived</option>
                    </select>
                    <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="input" />
                    <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Add Plan</button>
                </form>
            </div>

            <div className="plan-grid">
                {plans.map(plan => (
                    <div key={plan._id} className="plan-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4>{plan.name}</h4>
                            <button onClick={() => handleDelete(plan._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                        </div>
                        <p>{plan.unitsIncluded} units / {plan.validity} days</p>
                        <p>${plan.pricePerUnit}/unit</p>
                        <p>Status: {plan.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
