import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, ChevronRight, SlidersHorizontal, Clock } from 'lucide-react';
import { jobService } from '../services/services';
import './PrivateJobs.css';

const companyColors = {
  TCS: '#3b5998', Infosys: '#007bff', Wipro: '#5ba3e0',
  Accenture: '#a100ff', Capgemini: '#0070ad', Google: '#ea4335',
  Microsoft: '#00a4ef', Flipkart: '#2874f0', Amazon: '#ff9900',
};

function formatSalary(min, max) {
  const fmt = (v) =>
    v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`;
  return max ? `${fmt(min)} – ${fmt(max)} PA` : `₹${fmt(min)}+ PA`;
}

function JobListCard({ job }) {
  const color = companyColors[job.companyName] || '#1a56db';
  const isInternship = job.type === 'INTERNSHIP';
  return (
    <div className="job-list-card card">
      <div className="jlc-left">
        <div className="jlc-logo" style={{ background: color + '15', color }}>
          {job.companyName?.slice(0, 2).toUpperCase()}
        </div>
      </div>
      <div className="jlc-middle">
        <div className="jlc-top">
          <h3 className="jlc-title">{job.title}</h3>
          <span className={`badge ${isInternship ? 'badge-purple' : 'badge-primary'}`}>
            {isInternship ? 'Internship' : 'Full-time'}
          </span>
        </div>
        <div className="jlc-company">{job.companyName}</div>
        <div className="jlc-meta">
          {job.location && <span><MapPin size={12} /> {job.location}</span>}
          <span>
            <Briefcase size={12} /> {job.experienceMin ?? 0}–{job.experienceMax ?? 2} yrs exp
          </span>
          <span><Clock size={12} /> Recently posted</span>
        </div>
        <div className="jlc-skills">
          {job.skillsRequired?.map((s) => (
            <span key={s} className="tag">{s}</span>
          ))}
        </div>
      </div>
      <div className="jlc-right">
        <div className="jlc-salary">
          {formatSalary(job.salaryMin, job.salaryMax)}
        </div>
        <a
          href={job.applyUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
        >
          Apply Now
        </a>
        <button className="btn btn-ghost btn-sm">🔖 Save</button>
      </div>
    </div>
  );
}

export default function PrivateJobs() {
  const [activeTab, setActiveTab] = useState('FULL_TIME');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobService.search({
        type: activeTab,
        search: search || undefined,
        page,
        size: 20,
      });
      setJobs(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => { setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="private-jobs-page">
      <div className="page-header-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <ChevronRight size={12} />
            <span>{activeTab === 'INTERNSHIP' ? 'Internships' : 'Private Jobs'}</span>
          </div>
          <h1 className="page-title">
            {activeTab === 'INTERNSHIP' ? 'Latest Internships 2024' : 'Private Sector Jobs 2024'}
          </h1>
          <p className="page-subtitle">
            Find jobs at top companies matching your skills and goals
          </p>
          <div className="page-stats">
            <span>💼 15K+ Jobs</span>
            <span>🏢 500+ Companies</span>
            <span>✅ Verified Listings</span>
          </div>
        </div>
      </div>

      <div className="pj-tabs-bar">
        <div className="container" style={{ display: 'flex', gap: 0 }}>
          <button
            className={`pj-tab ${activeTab === 'FULL_TIME' ? 'active' : ''}`}
            onClick={() => { setActiveTab('FULL_TIME'); setPage(0); }}
          >
            💼 Full-time Jobs
          </button>
          <button
            className={`pj-tab ${activeTab === 'INTERNSHIP' ? 'active' : ''}`}
            onClick={() => { setActiveTab('INTERNSHIP'); setPage(0); }}
          >
            🎓 Internships
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        <div className="page-with-sidebar">
          <div>
            <div className="pj-filter-bar card-flat">
              <div className="search-input-wrap" style={{ flex: 2 }}>
                <Search size={16} className="search-bar-icon" />
                <input
                  className="search-bar-input"
                  placeholder="Search job title, company, skill..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                />
              </div>
              <button className="btn btn-primary" onClick={fetchJobs}>
                <SlidersHorizontal size={14} /> Search
              </button>
            </div>

            {error && (
              <div className="error-state">
                <p>⚠️ {error}</p>
                <button className="btn btn-outline btn-sm" onClick={fetchJobs}>Retry</button>
              </div>
            )}

            {loading ? (
              <div className="loading-state"><div className="spinner" /><p>Loading jobs...</p></div>
            ) : (
              <>
                <div className="results-count" style={{ marginTop: 12 }}>
                  Showing <strong>{jobs.length}</strong>{' '}
                  {activeTab === 'INTERNSHIP' ? 'internships' : 'jobs'}
                </div>
                <div className="job-list" style={{ marginTop: 12 }}>
                  {jobs.map((job) => <JobListCard key={job.id} job={job} />)}
                  {jobs.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-icon">💼</div>
                      <h3>No jobs found</h3>
                      <p>Try different search or filter</p>
                    </div>
                  )}
                </div>
                {totalPages > 1 && (
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
                    <button className="btn btn-outline btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                    <span style={{ padding: '6px 12px', fontSize: 13 }}>Page {page + 1} / {totalPages}</span>
                    <button className="btn btn-outline btn-sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next →</button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sidebar-widget card-flat">
              <h3 className="sw-title">🔥 Trending Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['React.js', 'Python', 'Java', 'SQL', 'Node.js', 'Machine Learning', 'AWS', 'Docker'].map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
            <div className="sidebar-widget card-flat" style={{ marginTop: 16 }}>
              <h3 className="sw-title">🤖 AI Career Matcher</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                Let AI find jobs perfectly matching your profile
              </p>
              <Link to="/ai-advisor" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>
                Find My Jobs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
