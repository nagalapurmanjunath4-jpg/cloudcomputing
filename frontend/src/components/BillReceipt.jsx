import React from 'react';

const BillReceipt = ({ billData, onBackToHome }) => {
    if (!billData) return null;

    return (
        <div className="card animate-fade" style={{ textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', animation: 'bounce 1s ease infinite' }}>✅</div>
            <h2 className="title" style={{ borderBottom: 'none', fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your transaction has been completed.</p>

            <div className="result-box">
                <h3 style={{ marginTop: 0, fontSize: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>Receipt Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.75rem', fontSize: '1rem' }}>
                    <strong style={{ color: 'var(--text-color)' }}>Bill ID:</strong> <span style={{ fontFamily: 'monospace' }}>{billData.billId}</span>
                    <strong style={{ color: 'var(--text-color)' }}>Status:</strong> <span>{billData.paymentStatus}</span>
                    <strong style={{ color: 'var(--text-color)' }}>Units Remaining:</strong> <span>{billData.remainingUnits}</span>
                    <strong style={{ color: 'var(--text-color)' }}>Total Amount:</strong> <span>${(billData.totalAmount || 0).toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={onBackToHome}
                style={{ marginTop: '2rem' }}
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default BillReceipt;
