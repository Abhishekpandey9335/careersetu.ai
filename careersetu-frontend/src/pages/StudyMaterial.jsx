import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Lock, Eye, Star, ChevronRight, Play, FileText, BookOpen, HelpCircle } from 'lucide-react';
import { studyMaterials } from '../data/mockData';
import './StudyMaterial.css';

const materialTypes = ['All', 'SYLLABUS', 'NOTES', 'PYQS', 'MOCK_TEST', 'VIDEO', 'CURRENT_AFFAIRS', 'E_BOOKS'];
const typeConfig = {
  SYLLABUS: { label: 'Syllabus', icon: '📖', color: '#1a56db' },
  NOTES: { label: 'Notes & PDFs', icon: '📝', color: '#7e3af2' },
  PYQS: { label: 'Previous Papers', icon: '📄', color: '#f59e0b' },
  MOCK_TEST: { label: 'Mock Tests', icon: '📊', color: '#0e9f6e' },
  VIDEO: { label: 'Video Lectures', icon: '▶️', color: '#ef4444' },
  CURRENT_AFFAIRS: { label: 'Current Affairs', icon: '📰', color: '#0ea5e9' },
  E_BOOKS: { label: 'E-Books', icon: '📚', color: '#10b981' },
};

const allMaterials = [
  ...studyMaterials,
  { id: 7, title: 'UPSC Prelims Mock Test Series - Set 1', type: 'MOCK_TEST', exam: 'UPSC CSE', subject: 'GS', downloads: 8900, isPremium: false },
  { id: 8, title: 'Banking & Finance Current Affairs - May 2024', type: 'CURRENT_AFFAIRS', exam: 'IBPS PO', subject: 'Current Affairs', downloads: 12400, isPremium: false },
  { id: 9, title: 'Data Structures & Algorithms E-Book', type: 'E_BOOKS', exam: null, subject: 'Programming', downloads: 21000, isPremium: true },
  { id: 10, title: 'SSC CGL Tier 2 Mathematics Video Lectures', type: 'VIDEO', exam: 'SSC CGL', subject: 'Mathematics', downloads: 18700, isPremium: false },
];

function MaterialCard({ material }) {
  const config = typeConfig[material.type] || { label: material.type, icon: '📄', color: '#6b7280' };
  return (
    <div className="material-card card">
      <div className="mc-header">
        <div className="mc-type-icon" style={{ background: config.color + '15', color: config.color }}>
          {config.icon}
        </div>
        <div className="mc-badges">
          <span className="badge" style={{ background: config.color + '15', color: config.color, fontSize: 11 }}>
            {config.label}
          </span>
          {material.isPremium && <span className="badge badge-yellow">👑 Premium</span>}
        </div>
      </div>
      <h3 className="mc-title">{material.title}</h3>
      <div className="mc-meta">
        {material.exam && <span className="tag">{material.exam}</span>}
        <span className="tag">{material.subject}</span>
      </div>
      <div className="mc-stats">
        <span><Download size={12} /> {material.downloads.toLocaleString()} downloads</span>
        <span><Star size={12} style={{ color: '#f59e0b' }} /> 4.8</span>
      </div>
      <div className="mc-actions">
        <button className="btn btn-outline btn-sm"><Eye size={13} /> Preview</button>
        {material.isPremium
          ? <button className="btn btn-sm" style={{ background: '#f59e0b', color: '#fff' }}><Lock size={13} /> Unlock</button>
          : <button className="btn btn-primary btn-sm"><Download size={13} /> Download</button>
        }
      </div>
    </div>
  );
}

export default function StudyMaterial() {
  const [activeType, setActiveType] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = allMaterials.filter(m => {
    const matchType = activeType === 'All' || m.type === activeType;
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || (m.exam || '').toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="study-material-page">
      <div className="page-header-banner">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <ChevronRight size={12} /> <span>Study Material</span></div>
          <h1 className="page-title">Study Material & Resources</h1>
          <p className="page-subtitle">Everything you need to crack any exam or interview — free & premium resources</p>
          <div className="page-stats">
            <span>📚 10K+ Study Materials</span><span>⬇️ 5M+ Downloads</span><span>✅ Verified Content</span>
          </div>
        </div>
      </div>

      {/* Category cards */}
      <div className="sm-categories-strip">
        <div className="container">
          <div className="sm-category-grid">
            {Object.entries(typeConfig).map(([key, val]) => (
              <button
                key={key}
                className={`sm-category-card ${activeType === key ? 'active' : ''}`}
                onClick={() => setActiveType(key)}
                style={{ '--cat-color': val.color }}
              >
                <span className="sm-cat-icon">{val.icon}</span>
                <span className="sm-cat-label">{val.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        <div className="page-with-sidebar">
          <div>
            {/* Search */}
            <div className="card-flat" style={{ display: 'flex', gap: 10, padding: '12px 16px', marginBottom: 16, borderRadius: 'var(--radius-lg)' }}>
              <div className="search-input-wrap" style={{ flex: 1 }}>
                <Search size={16} className="search-bar-icon" />
                <input className="search-bar-input" placeholder="Search study materials, notes, PYQs..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="input select" style={{ width: 160 }}>
                <option>All Exams</option>
                <option>SSC CGL</option><option>IBPS PO</option><option>UPSC CSE</option><option>Railway NTPC</option>
              </select>
            </div>

            <div className="results-count">Showing <strong>{filtered.length}</strong> materials</div>

            <div className="materials-grid" style={{ marginTop: 12 }}>
              {filtered.map(m => <MaterialCard key={m.id} material={m} />)}
              {filtered.length === 0 && (
                <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                  <div className="empty-icon">📚</div>
                  <h3>No materials found</h3>
                  <p>Try a different search or category</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sidebar-widget card-flat">
              <h3 className="sw-title">🔥 Most Downloaded</h3>
              {allMaterials.sort((a, b) => b.downloads - a.downloads).slice(0, 5).map(m => (
                <div key={m.id} className="sw-item">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{m.title.slice(0, 35)}...</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.downloads.toLocaleString()} downloads</div>
                  </div>
                  <Download size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                </div>
              ))}
            </div>

            <div className="sidebar-widget card-flat" style={{ marginTop: 16 }}>
              <h3 className="sw-title">📋 Browse by Exam</h3>
              {['SSC CGL', 'UPSC CSE', 'IBPS PO', 'Railway NTPC', 'SBI PO', 'NDA'].map(exam => (
                <div key={exam} className="sw-item">
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{exam}</span>
                  <span className="badge badge-primary" style={{ fontSize: 11 }}>View</span>
                </div>
              ))}
            </div>

            <div className="premium-sidebar card" style={{ marginTop: 16 }}>
              <div className="premium-crown">🔓</div>
              <h3>Unlock Premium Content</h3>
              <p>Access 5000+ premium notes, video lectures & mock tests</p>
              <Link to="/premium" className="btn btn-accent btn-sm w-full" style={{ justifyContent: 'center', marginTop: 10 }}>
                Get Premium — ₹99/mo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
