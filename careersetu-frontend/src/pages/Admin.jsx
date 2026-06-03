import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'https://careersetu-ai-2.onrender.com/api';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchStats();
    fetchSubscriptions(filter);
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data.data);
    } catch (e) {}
  }

  async function fetchSubscriptions(status) {
    setLoading(true);
    try {
      const url = status === 'ALL'
        ? `${API}/admin/subscriptions`
        : `${API}/admin/subscriptions?status=${status}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSubscriptions(data.data || []);
    } catch (e) {
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }

  function changeFilter(f) {
    setFilter(f);
    fetchSubscriptions(f);
  }

  async function approve(id) {
    setActionLoading(id + '_approve');
    try {
      const res = await fetch(`${API}/admin/subscriptions/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMessage('✅ Approved! User ka premium activate ho gaya.');
      fetchSubscriptions(filter);
      fetchStats();
    } catch (e) {
      setMessage('❌ Error: ' + e.message);
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(''), 4000);
    }
  }

  async function reject(id) {
    if (!confirm('Reject karna chahte ho?')) return;
    setActionLoading(id + '_reject');
    try {
      await fetch(`${API}/admin/subscriptions/${id}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('❌ Rejected.');
      fetchSubscriptions(filter);
      fetchStats();
    } catch (e) {
      setMessage('Error: ' + e.message);
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(''), 4000);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>🛡️ Admin Panel</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0' }}>CareerSetu Payment Verification</p>
        </div>

        {/* Message Toast */}
        {message && (
          <div style={{
            padding: '12px 16px', borderRadius: 8, marginBottom: 20,
            background: message.startsWith('✅') ? '#def7ec' : '#fdf2f2',
            color: message.startsWith('✅') ? '#0e9f6e' : '#e02424',
            fontWeight: 600
          }}>
            {message}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
              { label: 'Total Subscriptions', value: stats.totalSubscriptions, icon: '📋' },
              { label: 'Active Premium', value: stats.activeSubscriptions, icon: '✅' },
              { label: 'Pending Verification', value: stats.pendingSubscriptions, icon: '⏳', highlight: true },
            ].map(s => (
              <div key={s.label} style={{
                background: s.highlight ? '#fffbeb' : '#fff',
                border: s.highlight ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                borderRadius: 12, padding: '16px 20px'
              }}>
                <div style={{ fontSize: 22 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.highlight ? '#d97706' : '#1e293b' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {['PENDING', 'ACTIVE', 'FAILED', 'ALL'].map(f => (
            <button key={f} onClick={() => changeFilter(f)} style={{
              padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 13,
              background: filter === f ? '#6366f1' : '#e2e8f0',
              color: filter === f ? '#fff' : '#475569'
            }}>
              {f === 'PENDING' ? '⏳ Pending' : f === 'ACTIVE' ? '✅ Active' : f === 'FAILED' ? '❌ Rejected' : '📋 All'}
            </button>
          ))}
        </div>

        {/* Subscriptions Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading...</div>
        ) : subscriptions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12, color: '#64748b' }}>
            No {filter.toLowerCase()} subscriptions found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {subscriptions.map(sub => (
              <div key={sub.id} style={{
                background: '#fff', borderRadius: 12, padding: 20,
                border: sub.status === 'PENDING' ? '2px solid #f59e0b' : '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
                      👑 {sub.plan} Plan — ₹{sub.amount}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>
                      🆔 Sub ID: #{sub.id} &nbsp;|&nbsp;
                      📅 {new Date(sub.createdAt).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 13, marginBottom: 4 }}>
                      👤 User: <strong>{sub.user?.name || sub.user?.email || 'N/A'}</strong>
                      &nbsp;({sub.user?.email})
                    </div>
                    <div style={{ fontSize: 13, marginBottom: 4, fontFamily: 'monospace' }}>
                      💳 UPI TxnID: <strong>{sub.upiTransactionId || '—'}</strong>
                    </div>
                    {sub.screenshotUrl && (
                      <div style={{ marginTop: 8 }}>
                        <a href={sub.screenshotUrl} target="_blank" rel="noopener noreferrer"
                          style={{ color: '#6366f1', fontWeight: 600, fontSize: 13 }}>
                          🖼️ Screenshot dekho →
                        </a>
                      </div>
                    )}
                    {sub.status === 'ACTIVE' && sub.endDate && (
                      <div style={{ fontSize: 12, color: '#0e9f6e', marginTop: 4 }}>
                        Valid till: {new Date(sub.endDate).toLocaleDateString('en-IN')}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                      background: sub.status === 'ACTIVE' ? '#def7ec' : sub.status === 'PENDING' ? '#fffbeb' : '#fdf2f2',
                      color: sub.status === 'ACTIVE' ? '#0e9f6e' : sub.status === 'PENDING' ? '#d97706' : '#e02424'
                    }}>
                      {sub.status}
                    </span>

                    {sub.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => approve(sub.id)}
                          disabled={actionLoading === sub.id + '_approve'}
                          style={{
                            padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            background: '#0e9f6e', color: '#fff', fontWeight: 700, fontSize: 13
                          }}
                        >
                          {actionLoading === sub.id + '_approve' ? '...' : '✅ Approve'}
                        </button>
                        <button
                          onClick={() => reject(sub.id)}
                          disabled={actionLoading === sub.id + '_reject'}
                          style={{
                            padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            background: '#e02424', color: '#fff', fontWeight: 700, fontSize: 13
                          }}
                        >
                          {actionLoading === sub.id + '_reject' ? '...' : '❌ Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
