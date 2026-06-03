import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Briefcase, Bell, Target,
  CheckCircle, Flame, Trophy, ChevronRight, Sparkles, Crown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService, notificationService } from '../services/services';
import './Dashboard.css';

const sideNav = [
  { icon: <LayoutDashboard size={18} />, label: 'Overview', id: 'overview' },
  { icon: <Target size={18} />, label: 'AI Career Report', id: 'report' },
  { icon: <BookOpen size={18} />, label: 'Study Progress', id: 'progress' },
  { icon: <Briefcase size={18} />, label: 'Applications', id: 'applications' },
  { icon: <Bell size={18} />, label: 'Notifications', id: 'notifications' },
  { icon: <Crown size={18} />, label: 'Premium & Receipts', id: 'premium' },
];

const statusConfig = {
  APPLIED:      { label: 'Applied',        color: '#1a56db', bg: '#ebf5ff' },
  UNDER_REVIEW: { label: 'Under Review',   color: '#f59e0b', bg: '#fffbeb' },
  SELECTED:     { label: 'Selected ✓',     color: '#0e9f6e', bg: '#def7ec' },
  REJECTED:     { label: 'Rejected',       color: '#e02424', bg: '#fdf2f2' },
};

const notifIcons = { FORM: '📋', RESULT: '📊', ADMIT: '🪪', ALERT: '🔔', GENERAL: '🔔' };

const API_URL = import.meta.env.VITE_API_URL || 'https://careersetu-ai-2.onrender.com/api';

function PremiumReceipts() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/subscriptions/history`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(d => setHistory(d.data || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  if (!history.length) return (
    <div className="empty-state">
      <div className="empty-icon">👑</div>
      <h3>No transactions yet</h3>
      <p style={{ marginBottom: 16, color: 'var(--text-muted)' }}>
        Upgrade to Premium to unlock all features.
      </p>
      <Link to="/premium" className="btn btn-primary btn-sm">Get Premium →</Link>
    </div>
  );

  return (
    <div>
      {history.map((sub) => (
        <div key={sub.id} className="card" style={{ marginBottom: 16, padding: 24 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', flexWrap: 'wrap', gap: 12
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
                👑 CareerSetu {sub.plan} Plan
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                Receipt #{sub.id} • {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>
                💰 Amount: <strong>₹{sub.amount}</strong>
              </div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>
                🔖 UPI Transaction ID:{' '}
                <strong style={{ fontFamily: 'monospace' }}>
                  {sub.upiTransactionId || '—'}
                </strong>
              </div>
              {sub.startDate && (
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Valid: {new Date(sub.startDate).toLocaleDateString('en-IN')} →{' '}
                  {new Date(sub.endDate).toLocaleDateString('en-IN')}
                </div>
              )}
            </div>
            <div>
              <span className="badge" style={{
                fontSize: 13, padding: '6px 14px',
                background:
                  sub.status === 'ACTIVE' ? '#def7ec' :
                  sub.status === 'PENDING' ? '#fffbeb' : '#fdf2f2',
                color:
                  sub.status === 'ACTIVE' ? '#0e9f6e' :
                  sub.status === 'PENDING' ? '#f59e0b' : '#e02424',
              }}>
                {sub.status === 'ACTIVE' ? '✅ Active' :
                 sub.status === 'PENDING' ? '⏳ Pending Verification' :
                 sub.status}
              </span>
            </div>
          </div>

          {sub.status === 'PENDING' && (
            <div style={{
              marginTop: 12, padding: '10px 14px',
              background: '#fffbeb', borderRadius: 8,
              fontSize: 13, color: '#92400e'
            }}>
              ⏳ Payment verification in progress. Premium will be activated within 2–4 hours.
              Need help? Email: <strong>abhishekpandit08939@gmail.com</strong>
            </div>
          )}

          {sub.status === 'ACTIVE' && (
            <div style={{
              marginTop: 12, padding: '10px 14px',
              background: '#def7ec', borderRadius: 8,
              fontSize: 13, color: '#0e9f6e'
            }}>
              ✅ Premium is active! Enjoy all CareerSetu Premium features.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    dashboardService.get()
      .then((res) => setDashboard(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isLoggedIn, navigate]);

  const markRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setDashboard((prev) => ({
        ...prev,
        recentNotifications: prev.recentNotifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
    } catch { /* silent */ }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <div className="spinner" />&nbsp; Loading your dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p>⚠️ {error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const profile       = dashboard?.profile || {};
  const applications  = dashboard?.applications || [];
  const appStats      = dashboard?.applicationStats || {};
  const notifications = dashboard?.recentNotifications || [];
  const upcomingExams = dashboard?.upcomingDeadlines || [];
  const bookmarks     = dashboard?.bookmarks || {};

  const displayName = profile.name || user?.name || 'Student';

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <div className="dh-content">
            <div>
              <h1 className="dh-title">Welcome back, {displayName}! 👋</h1>
              <p className="dh-sub">
                {profile.qualification || 'Student'} • Goal: {profile.targetExam || 'Career Growth'}
              </p>
            </div>
            <div className="dh-stats">
              <div className="dh-stat">
                <Flame size={18} style={{ color: '#ff6b35' }} />
                <span className="dh-stat-num">{profile.streak || 0}</span>
                <span className="dh-stat-label">Day Streak</span>
              </div>
              <div className="dh-stat">
                <Trophy size={18} style={{ color: '#f59e0b' }} />
                <span className="dh-stat-num">{profile.careerScore || '—'}</span>
                <span className="dh-stat-label">Career Score</span>
              </div>
              <div className="dh-stat">
                <CheckCircle size={18} style={{ color: '#0e9f6e' }} />
                <span className="dh-stat-num">{appStats.total || 0}</span>
                <span className="dh-stat-label">Applications</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        <div className="dashboard-layout">
          {/* Sidebar nav */}
          <aside className="dashboard-nav card-flat">
            {sideNav.map((item) => (
              <button
                key={item.id}
                className={`dashboard-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'notifications' && dashboard?.unreadNotificationCount > 0 && (
                  <span className="badge badge-accent" style={{ marginLeft: 'auto', fontSize: 10 }}>
                    {dashboard.unreadNotificationCount}
                  </span>
                )}
              </button>
            ))}
            <div className="dashboard-nav-divider" />
            <Link to="/premium" className="dashboard-nav-item premium-nav">
              👑 <span>Go Premium</span>
            </Link>
          </aside>

          {/* Main content */}
          <div className="dashboard-main">

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div className="fade-in">
                <div className="ai-daily-task card">
                  <div className="adt-left">
                    <div className="adt-icon"><Sparkles size={20} /></div>
                    <div>
                      <div className="adt-label">AI Daily Task</div>
                      <h3 className="adt-title">
                        {profile.todayTask || 'Ask your AI advisor for today\'s task'}
                      </h3>
                      <p className="adt-sub">
                        {profile.targetExam
                          ? `Based on your ${profile.targetExam} roadmap`
                          : 'Set your target exam to get a personalized plan'}
                      </p>
                    </div>
                  </div>
                  <Link to="/ai-advisor" className="btn btn-primary btn-sm">Ask AI →</Link>
                </div>

                <div className="dashboard-stats-grid">
                  {[
                    { label: 'Exams Saved', val: bookmarks?.exams?.length || 0, icon: '📋', color: 'var(--primary)' },
                    { label: 'Jobs Applied', val: appStats?.applied || 0, icon: '💼', color: 'var(--secondary)' },
                    { label: 'Under Review', val: appStats?.underReview || 0, icon: '⏳', color: 'var(--purple)' },
                    { label: 'Selected', val: appStats?.selected || 0, icon: '✅', color: 'var(--accent)' },
                  ].map((s) => (
                    <div key={s.label} className="ds-stat-card card">
                      <div className="ds-stat-icon" style={{ color: s.color }}>{s.icon}</div>
                      <div className="ds-stat-val">{s.val}</div>
                      <div className="ds-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="dashboard-two-col">
                  <div>
                    <div className="section-header">
                      <h2 className="section-title">📋 Saved Exams</h2>
                      <Link to="/govt-exams" className="section-link">
                        View All <ChevronRight size={14} />
                      </Link>
                    </div>
                    <div className="saved-list">
                      {(bookmarks?.exams || []).slice(0, 4).map((b) => (
                        <div key={b.id} className="saved-item card">
                          <div className="saved-item-main">
                            <span className="saved-item-icon">📋</span>
                            <div>
                              <div className="saved-item-name">{b.examName || b.name}</div>
                              <div className="saved-item-date">Saved</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!bookmarks?.exams?.length) && (
                        <div className="empty-state" style={{ padding: '20px 0' }}>
                          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            No saved exams yet.{' '}
                            <Link to="/govt-exams" style={{ color: 'var(--primary)' }}>
                              Browse exams →
                            </Link>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="section-header">
                      <h2 className="section-title">📅 Upcoming Deadlines</h2>
                    </div>
                    <div className="saved-list">
                      {upcomingExams.slice(0, 5).map((e) => (
                        <div key={e.id} className="deadline-item card">
                          <div className="deadline-dot" style={{ background: 'var(--primary)' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{e.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.formEnd}</div>
                          </div>
                          <span className="badge badge-primary">Form</span>
                        </div>
                      ))}
                      {!upcomingExams.length && (
                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No upcoming deadlines.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── APPLICATIONS ── */}
            {activeTab === 'applications' && (
              <div className="fade-in">
                <h2 className="section-title" style={{ marginBottom: 20 }}>📝 Application Tracker</h2>
                {applications.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No applications yet</h3>
                    <p>
                      <Link to="/govt-exams" className="btn btn-primary btn-sm" style={{ marginRight: 8 }}>
                        Browse Exams
                      </Link>
                      <Link to="/private-jobs" className="btn btn-outline btn-sm">Browse Jobs</Link>
                    </p>
                  </div>
                ) : (
                  <div className="applications-table card-flat">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Position</th><th>Type</th><th>Applied On</th>
                          <th>Status</th><th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app) => {
                          const s = statusConfig[app.status] || statusConfig.APPLIED;
                          return (
                            <tr key={app.id}>
                              <td style={{ fontWeight: 600 }}>{app.examName || app.jobTitle || app.name}</td>
                              <td>
                                <span className={`badge ${app.type === 'EXAM' ? 'badge-primary' : 'badge-purple'}`}>
                                  {app.type === 'EXAM' ? 'Govt' : 'Private'}
                                </span>
                              </td>
                              <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                                {new Date(app.createdAt || app.appliedDate).toLocaleDateString('en-IN')}
                              </td>
                              <td>
                                <span className="badge" style={{ background: s.bg, color: s.color }}>
                                  {s.label}
                                </span>
                              </td>
                              <td><button className="btn btn-ghost btn-sm">View</button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === 'notifications' && (
              <div className="fade-in">
                <h2 className="section-title" style={{ marginBottom: 20 }}>🔔 Notifications</h2>
                {notifications.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔔</div>
                    <h3>All caught up!</h3>
                    <p>No new notifications.</p>
                  </div>
                ) : (
                  <div className="notif-list">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notif-item card ${!n.read ? 'unread' : ''}`}
                        onClick={() => !n.read && markRead(n.id)}
                        style={{ cursor: !n.read ? 'pointer' : 'default' }}
                      >
                        <div className="notif-icon">{notifIcons[n.type] || '🔔'}</div>
                        <div className="notif-content">
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-msg">{n.message}</div>
                          <div className="notif-time">
                            {new Date(n.createdAt).toLocaleString('en-IN', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                          </div>
                        </div>
                        {!n.read && <div className="unread-dot" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── AI REPORT ── */}
            {activeTab === 'report' && (
              <div className="fade-in">
                <h2 className="section-title" style={{ marginBottom: 20 }}>🤖 AI Career Report Card</h2>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <Sparkles size={48} style={{ color: 'var(--purple)', marginBottom: 16 }} />
                  <h3>Get Your Personalized Report</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
                    Ask our AI advisor to generate your career report based on your profile and goals.
                  </p>
                  <Link to="/ai-advisor" className="btn btn-primary">
                    <Sparkles size={16} /> Generate AI Report
                  </Link>
                </div>
              </div>
            )}

            {/* ── PROGRESS ── */}
            {activeTab === 'progress' && (
              <div className="fade-in">
                <h2 className="section-title" style={{ marginBottom: 20 }}>📚 Study Progress</h2>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <BookOpen size={48} style={{ color: 'var(--primary)', marginBottom: 16 }} />
                  <h3>Start a Roadmap</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
                    Follow a roadmap to track your study progress here.
                  </p>
                  <Link to="/roadmaps" className="btn btn-primary">Browse Roadmaps</Link>
                </div>
              </div>
            )}

            {/* ── PREMIUM RECEIPTS ── */}
            {activeTab === 'premium' && (
              <div className="fade-in">
                <h2 className="section-title" style={{ marginBottom: 20 }}>👑 Premium & Transaction History</h2>
                <PremiumReceipts />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
