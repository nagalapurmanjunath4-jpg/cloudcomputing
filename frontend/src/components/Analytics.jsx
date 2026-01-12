import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config';

const Analytics = ({ user }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (user) fetchAnalytics();
    }, [user]);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/payment/analytics/${user.userId || user._id}`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Helper to get max value for scaling
    const maxUnits = Math.max(...data.map(d => d.totalUnits), 100);

    return (
        <div className="animate-fade">
            <h1 className="title">Usage Analytics (Last 6 Months)</h1>
            <div className="card" style={{ height: '400px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '2rem 1rem' }}>
                {data.length === 0 ? <p>No data available</p> : data.map((item, index) => (
                    <div key={index} style={{ textAlign: 'center', width: '10%' }}>
                        <div
                            style={{
                                height: `${(item.totalUnits / maxUnits) * 250}px`,
                                background: 'var(--primary)',
                                borderRadius: '4px 4px 0 0',
                                transition: 'height 0.5s ease'
                            }}
                            title={`${item.totalUnits} Units`}
                        ></div>
                        <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Month {item._id}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.totalUnits} Units</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Analytics;
