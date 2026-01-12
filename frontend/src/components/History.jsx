import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const History = ({ user, onDeleteBill }) => {
    const [bills, setBills] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: 'All'
    });

    useEffect(() => {
        if (user) fetchBills();
    }, [user, filters]);

    const fetchBills = async () => {
        try {
            const query = new URLSearchParams({
                startDate: filters.startDate,
                endDate: filters.endDate,
                status: filters.status
            }).toString();

            const res = await fetch(`${API_BASE_URL}/api/payment/user/${user.userId || user._id}?${query}`);
            if (res.ok) {
                const data = await res.json();
                setBills(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleDelete = async (billId) => {
        if (!window.confirm("Delete this bill?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/payment/${billId}`, { method: 'DELETE' });
            if (res.ok) {
                setBills(bills.filter(b => b._id !== billId));
            } else {
                alert("Failed to delete");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="animate-fade">
            <h1 className="title">Bill History</h1>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="input" />
                <span>to</span>
                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="input" />
                <select name="status" value={filters.status} onChange={handleFilterChange} className="input">
                    <option value="All">All Statuses</option>
                    <option value="Payment Successful">Successful</option>
                    <option value="Insufficient Units">Failed</option>
                </select>
                <button onClick={() => setFilters({ startDate: '', endDate: '', status: 'All' })} className="btn-secondary">Reset</button>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Plan</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Units</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map(bill => (
                            <tr key={bill._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem' }}>{new Date(bill.paymentDate).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}>{bill.planName}</td>
                                <td style={{ padding: '1rem' }}>{bill.unitsUsed} / {bill.unitsIncluded}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        color: bill.status === 'Payment Successful' ? 'green' : 'red',
                                        fontWeight: 'bold'
                                    }}>
                                        {bill.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <button onClick={() => handleDelete(bill._id)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bills.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No records found</div>}
            </div>
        </div>
    );
};

export default History;
