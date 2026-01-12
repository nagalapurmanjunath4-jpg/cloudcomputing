import React, { useState } from 'react';

const BillDetails = ({ selectedPlan, user, onPaymentSuccess, onBack }) => {
    const [consumerName, setConsumerName] = useState('');
    const [unitsUsed, setUnitsUsed] = useState('');
    const [paymentMode, setPaymentMode] = useState('Credit Card');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async () => {
        if (!consumerName || !unitsUsed) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/payment/paybill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    consumerName,
                    planName: selectedPlan.name,
                    unitsUsed: Number(unitsUsed),
                    paymentMode,
                    description,
                    userId: user?.userId || user?._id // Fallback for ID depending on how user object is structured
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onPaymentSuccess(data);
            } else {
                setError(data.error || 'Payment Failed');
                if (data.message) {
                    setError(data.message);
                }
            }
        } catch (err) {
            console.error(err);
            setError('Network Error: Could not connect to server.');
        } finally {
            setLoading(false);
        }
    };

    if (!selectedPlan) return null;

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        marginTop: '0.5rem',
        marginBottom: '1rem',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        outline: 'none',
        backgroundColor: '#f8fafc',
        color: '#1e293b'
    };

    const labelStyle = {
        fontWeight: '600',
        color: '#475569',
        fontSize: '0.9rem',
        display: 'block'
    };

    const focusStyle = (e) => {
        e.target.style.borderColor = '#3b82f6';
        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        e.target.style.backgroundColor = '#ffffff';
    };

    const blurStyle = (e) => {
        e.target.style.borderColor = '#e2e8f0';
        e.target.style.boxShadow = 'none';
        e.target.style.backgroundColor = '#f8fafc';
    };

    return (
        <div className="card animate-fade" style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={onBack}
                    className="btn-link"
                    style={{
                        marginRight: '1rem',
                        fontSize: '1.5rem',
                        textDecoration: 'none',
                        color: 'var(--text-secondary)'
                    }}
                >
                    ←
                </button>
                <h2 className="title" style={{ margin: 0, border: 'none', padding: 0 }}>Payment Details</h2>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-light-mesh)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold', marginBottom: '0.5rem' }}>Selected Plan</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-color)' }}>{selectedPlan.name}</div>
                <div style={{ color: 'var(--primary)', marginTop: '0.25rem', fontWeight: '600' }}>Includes {selectedPlan.unitsIncluded} Units</div>
            </div>

            <div className="form-group">
                <label htmlFor="consumerName">Consumer Name</label>
                <input
                    id="consumerName"
                    type="text"
                    placeholder="Enter your full name"
                    value={consumerName}
                    onChange={(e) => setConsumerName(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="unitsUsed">Units Used</label>
                <input
                    id="unitsUsed"
                    type="number"
                    placeholder="Enter units consumed"
                    value={unitsUsed}
                    onChange={(e) => setUnitsUsed(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="paymentMode">Payment Mode</label>
                <div style={{ position: 'relative' }}>
                    <select
                        id="paymentMode"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        style={{ appearance: 'none', cursor: 'pointer' }}
                    >
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="UPI">UPI</option>
                        <option value="Net Banking">Net Banking</option>
                        <option value="Wallet">Wallet</option>
                    </select>
                    <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}>▼</div>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="description">Remarks (Optional)</label>
                <input
                    id="description"
                    type="text"
                    placeholder="Add a note for this payment..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <button
                onClick={handlePayment}
                disabled={loading}
                style={{ marginTop: '1.5rem' }}
            >
                {loading ? 'Processing Secure Payment...' : `Pay Bill for ${selectedPlan.name}`}
            </button>

            {error && (
                <div className="error-box animate-fade" style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '0.5rem', fontSize: '1.2rem' }}>⚠️</span> {error}
                </div>
            )}
        </div>
    );
};

export default BillDetails;
