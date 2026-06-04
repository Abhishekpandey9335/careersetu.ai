import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'https://careersetu-ai-2.onrender.com/api';

const PDF_LABELS = {
  HR_CONTACTS: { label: 'HR Contacts List', price: '₹19', emoji: '📋' },
  DSA_SHEET: { label: 'DSA Sheet', price: '₹15', emoji: '💻' },
  JAVA_INTERVIEW: { label: 'Java Interview Questions', price: '₹5', emoji: '☕' },
  SPRINGBOOT_INTERVIEW: { label: 'Spring Boot Interview Qs', price: '₹5', emoji: '🍃' },
  SYSTEM_DESIGN: { label: 'System Design 20 Problems', price: '₹5', emoji: '🏗️' },
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('payments');
  const [stats, setStats] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [pdfPurchases, setPdfPurchases] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [pdfFilter, setPdfFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'ADMIN') { navigate('/'); return; }
    fetchStats();
    fetchSubscriptions(filter);
  }, []);

  async function fetchStats() {
    try {
      const [statsRes, pdfStatsRes] = await Promise.all([
        fetch(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/premium/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const statsData = await statsRes.json();
      const pdfData = await pdfStatsRes.json();
      setStats({ ...statsData.data, ...pdfData.data });
    } catch (e) {}
  }

  async function fetchSubscriptions(status) {
    setLoading(true);
    try {
      const url = status === 'ALL'
        ? `${API}/admin/subscriptions`
        : `${API}/admin/subscriptions?status=${status}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSubscriptions(data.data || []);
    } catch (e) { setSubscriptions([]); }
    finally { setLoading(false); }
  }

  async function fetchPdfPurchases(status) {
    setPdfLoading(true);
    try {
      const url = `${API}/premium/admin/purchases?status=${status}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setPdfPurchases(data.data || []);
    } catch (e) { setPdfPurchases([]); }
    finally { setPdfLoading(false); }
  }

  async function fetchUsers() {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUsers(data.data || []);
    } catch (e) { setUsers([]); }
    finally { setUsersLoading(false); }
  }

  function changeFilter(f) { setFilter(f); fetchSubscriptions(f); }
  function changePdfFilter(f) { setPdfFilter(f); fetchPdfPurchases(f); }

  function switchTab(tab) {
    setActiveTab(tab);
    if (tab === 'users' && users.length === 0) fetchUsers();
    if (tab === 'pdfPurchases') fetchPdfPurchases('ALL');
  }

  async function approve(id) {
    setActionLoading(id + '_approve');
    try {
      await fetch(`${API}/admin/subscriptions/${id}/approve`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Approved! User ka premium activate ho gaya.');
      fetchSubscriptions(filter); fetchStats();
    } catch (e) { setMessage('❌ Error: ' + e.message); }
    finally { setActionLoading(null); setTimeout(() => setMessage(''), 4000); }
  }

  async function reject(id) {
    if (!confirm('Reject karna chahte ho?')) return;
    setActionLoading(id + '_reject');
    try {
      await fetch(`${API}/admin/subscriptions/${id}/reject`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('❌ Rejected.');
      fetchSubscriptions(filter); fetchStats();
    } catch (e) { setMessage('Error: ' + e.message); }
    finally { setActionLoading(null); setTimeout(() => setMessage(''), 4000); }
  }

  async function approvePdf(id) {
    setActionLoading(id + '_pdfApprove');
    try {
      await fetch(`${API}/premium/admin/purchases/${id}/approve`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ PDF access granted!');
      fetchPdfPurchases(pdfFilter); fetchStats();
    } catch (e) { setMessage('❌ Error: ' + e.message); }
    finally { setActionLoading(null); setTimeout(() => setMessage(''), 4000); }
  }

  async function rejectPdf(id) {
    if (!confirm('Reject karna chahte ho?')) return;
    setActionLoading(id + '_pdfReject');
    try {
      await fetch(`${API}/premium/admin/purchases/${id}/reject`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('❌ PDF purchase rejected.');
      fetchPdfPurchases(pdfFilter); fetchStats();
    } catch (e) { setMessage('Error: ' + e.message); }
    finally { setActionLoading(null); setTimeout(() => setMessage(''), 4000); }
  }

  const tabStyle = (tab) => ({
    padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontWeight: 700, fontSize: 14,
    background: activeTab === tab ? '#6366f1' : '#e2e8f0',
    color: activeTab === tab ? '#fff' : '#475569'
  });

  const filterBtnStyle = (active, f) => ({
    padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontWeight: 600, fontSize: 13,
    background: active === f ? '#0e9f6e' : '#e2e8f0',
    color: active === f ? '#fff' : '#475569'
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>🛡️ Admin Panel</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0' }}>CareerSetu — {user?.email}</p>
        </div>

        {/* Toast */}
        {message && (
          <div style={{
            padding: '12px 16px', borderRadius: 8, marginBottom: 20,
            background: message.startsWith('✅') ? '#def7ec' : '#fdf2f2',
            color: message.startsWith('✅') ? '#0e9f6e' : '#e02424',
            fontWeight: 600
          }}>{message}</div>
        )}

        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
              { label: 'Total Jobs', value: stats.totalJobs, icon: '💼' },
              { label: 'Total Exams', value: stats.totalExams, icon: '📝' },
              { label: 'Active Premium', value: stats.activeSubscriptions, icon: '✅' },
              { label: 'Pending Plans', value: stats.pendingSubscriptions, icon: '⏳', highlight: true },
              { label: 'Pending PDFs', value: stats.pendingPurchases, icon: '📄', highlight: true },
              { label: 'Approved PDFs', value: stats.approvedPurchases, icon: '🔓' },
            ].map(s => (
              <div key={s.label} style={{
                background: s.highlight ? '#fffbeb' : '#fff',
                border: s.highlight ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                borderRadius: 12, padding: '14px 18px'
              }}>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.highlight ? '#d97706' : '#1e293b' }}>{s.value ?? '—'}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <button onClick={() => switchTab('payments')} style={tabStyle('payments')}>💳 Plan Payments</button>
          <button onClick={() => switchTab('pdfPurchases')} style={tabStyle('pdfPurchases')}>
            📄 PDF Purchases
            {stats?.pendingPurchases > 0 && (
              <span style={{
                marginLeft: 6, background: '#ef4444', color: '#fff',
                borderRadius: 10, padding: '1px 7px', fontSize: 11
              }}>{stats.pendingPurchases}</span>
            )}
          </button>
          <button onClick={() => switchTab('users')} style={tabStyle('users')}>👥 Users</button>
        </div>

        {/* ── PAYMENTS TAB ── */}
        {activeTab === 'payments' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {['PENDING', 'ACTIVE', 'FAILED', 'ALL'].map(f => (
                <button key={f} onClick={() => changeFilter(f)} style={filterBtnStyle(filter, f)}>
                  {f === 'PENDING' ? '⏳ Pending' : f === 'ACTIVE' ? '✅ Active' : f === 'FAILED' ? '❌ Rejected' : '📋 All'}
                </button>
              ))}
            </div>
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
                          🆔 #{sub.id} &nbsp;|&nbsp; 📅 {new Date(sub.createdAt).toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: 13, marginBottom: 4 }}>
                          👤 <strong>{sub.user?.name || 'N/A'}</strong> &nbsp;({sub.user?.email})
                        </div>
                        <div style={{ fontSize: 13, fontFamily: 'monospace', marginBottom: 4 }}>
                          💳 UPI TxnID: <strong>{sub.upiTransactionId || '—'}</strong>
                        </div>
                        {sub.screenshotUrl && (
                          <a href={sub.screenshotUrl} target="_blank" rel="noopener noreferrer"
                            style={{ color: '#6366f1', fontWeight: 600, fontSize: 13 }}>
                            🖼️ Screenshot dekho →
                          </a>
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
                        }}>{sub.status}</span>
                        {sub.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => approve(sub.id)} disabled={actionLoading === sub.id + '_approve'}
                              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#0e9f6e', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                              {actionLoading === sub.id + '_approve' ? '...' : '✅ Approve'}
                            </button>
                            <button onClick={() => reject(sub.id)} disabled={actionLoading === sub.id + '_reject'}
                              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#e02424', color: '#fff', fontWeight: 700, fontSize: 13 }}>
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
        )}

        {/* ── PDF PURCHASES TAB ── */}
        {activeTab === 'pdfPurchases' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(f => (
                <button key={f} onClick={() => changePdfFilter(f)} style={filterBtnStyle(pdfFilter, f)}>
                  {f === 'PENDING' ? '⏳ Pending' : f === 'APPROVED' ? '✅ Approved' : f === 'REJECTED' ? '❌ Rejected' : '📋 All'}
                </button>
              ))}
            </div>

            {pdfLoading ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading...</div>
            ) : pdfPurchases.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12, color: '#64748b' }}>
                No {pdfFilter.toLowerCase()} PDF purchases found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pdfPurchases.map(p => {
                  const meta = PDF_LABELS[p.pdfType] || { label: p.pdfType, price: '', emoji: '📄' };
                  return (
                    <div key={p.id} style={{
                      background: '#fff', borderRadius: 12, padding: 20,
                      border: p.status === 'PENDING' ? '2px solid #f59e0b' : '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
                            {meta.emoji} {meta.label} — {meta.price}
                          </div>
                          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>
                            🆔 #{p.id} &nbsp;|&nbsp; 📅 {new Date(p.createdAt).toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: 13, marginBottom: 4 }}>
                            👤 <strong>{p.user?.name || 'N/A'}</strong> &nbsp;({p.user?.email})
                          </div>
                          <div style={{ fontSize: 13, fontFamily: 'monospace', marginBottom: 4 }}>
                            💳 UPI TxnID: <strong>{p.upiTransactionId || '—'}</strong>
                          </div>
                          {p.screenshotUrl && (
                            <a href={p.screenshotUrl} target="_blank" rel="noopener noreferrer"
                              style={{ color: '#6366f1', fontWeight: 600, fontSize: 13 }}>
                              🖼️ Screenshot dekho →
                            </a>
                          )}
                          {p.status === 'APPROVED' && p.approvedAt && (
                            <div style={{ fontSize: 12, color: '#0e9f6e', marginTop: 4 }}>
                              ✅ Approved on: {new Date(p.approvedAt).toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                            background: p.status === 'APPROVED' ? '#def7ec' : p.status === 'PENDING' ? '#fffbeb' : '#fdf2f2',
                            color: p.status === 'APPROVED' ? '#0e9f6e' : p.status === 'PENDING' ? '#d97706' : '#e02424'
                          }}>{p.status}</span>
                          {p.status === 'PENDING' && (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => approvePdf(p.id)} disabled={actionLoading === p.id + '_pdfApprove'}
                                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#0e9f6e', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                                {actionLoading === p.id + '_pdfApprove' ? '...' : '✅ Approve'}
                              </button>
                              <button onClick={() => rejectPdf(p.id)} disabled={actionLoading === p.id + '_pdfReject'}
                                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#e02424', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                                {actionLoading === p.id + '_pdfReject' ? '...' : '❌ Reject'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>👥 Total Users: {stats?.totalUsers || '—'}</div>
              <button onClick={fetchUsers} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: 13 }}>
                🔄 Refresh
              </button>
            </div>
            {usersLoading ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading users...</div>
            ) : users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12, color: '#64748b' }}>No users found.</div>
            ) : (
              <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      {['#', 'Name', 'Email', 'Role', 'Joined'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#475569' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8' }}>{u.id}</td>
                        <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>{u.name || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                            background: u.role === 'ADMIN' ? '#ede9fe' : '#f0fdf4',
                            color: u.role === 'ADMIN' ? '#7c3aed' : '#16a34a'
                          }}>{u.role}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
