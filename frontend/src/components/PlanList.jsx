import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const PlanList = ({ selectedPlan, onSelectPlan }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/payment/plans/active`)
            .then(res => res.json())
            .then(data => {
                console.log("Fetched plans:", data);
                setPlans(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load plans", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container animate-fade"><p>Loading plans...</p></div>;

    return (
        <div className="animate-fade">
            {/* Plans Section */}
            <div style={{ marginBottom: '1rem' }}>
                <h2 className="title">Select a Plan</h2>
                <div className="plan-grid">
                    {plans.length === 0 ? (
                        <p>No active plans available. Please contact admin.</p>
                    ) : (
                        plans.map((plan) => (
                            <div
                                key={plan._id}
                                className={`plan-card ${selectedPlan?._id === plan._id ? 'selected' : ''}`}
                                onClick={() => onSelectPlan(plan)}
                                style={{ borderRadius: '1rem', padding: '2rem' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div className="plan-name">{plan.name}</div>
                                </div>

                                <div className="plan-price">
                                    <span style={{ fontSize: '1.25rem', verticalAlign: 'top', marginRight: '2px' }}>$</span>
                                    {plan.pricePerUnit}
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500', marginLeft: '0.25rem' }}>/unit</span>
                                </div>

                                <div className="plan-details" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ color: 'var(--accent)', background: '#f3e8ff', padding: '0.4rem', borderRadius: '0.5rem', display: 'flex' }}>⚡</span>
                                        <span><strong>{plan.unitsIncluded}</strong> Units Included</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ color: 'var(--primary)', background: '#eff6ff', padding: '0.4rem', borderRadius: '0.5rem', display: 'flex' }}>📅</span>
                                        <span><strong>{plan.validity}</strong> Days Validity</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ color: 'var(--success)', background: 'var(--success-bg)', padding: '0.4rem', borderRadius: '0.5rem', display: 'flex' }}>✨</span>
                                        <span>Status: <span style={{ color: 'var(--success)', fontWeight: '600' }}>Active</span></span>
                                    </div>
                                </div>

                                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    Select Plan <span style={{ marginLeft: '0.5rem', transition: 'transform 0.2s' }}>→</span>
                                </div>
                            </div>
                        )))}
                </div>
            </div>
        </div>
    );
};



export default PlanList;
