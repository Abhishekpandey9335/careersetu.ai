import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Users, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { examService } from '../services/services';
import './GovtExams.css';

const examCategories = [
  'All', 'SSC', 'UPSC', 'BANKING', 'RAILWAY',
  'STATE_PSC', 'DEFENCE', 'TEACHING', 'POLICE', 'INSURANCE',
];

const categoryIcons = {
  SSC: '🏛️', UPSC: '⚖️', BANKING: '🏦', RAILWAY: '🚂',
  STATE_PSC: '📋', DEFENCE: '🎖️', TEACHING: '👩‍🏫', POLICE: '👮', INSURANCE: '🛡️', All: '📑',
};

function ExamCard({ exam }) {
  const isActive = exam.status === 'ACTIVE';
  const formatSal = (v) =>
    v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : `₹${(v / 1000).toFixed(0)}K`;

  return (
    <div className="exam-list-card card">
      <div className="elc-header">
        <div className="elc-icon">{categoryIcons[exam.category] || '📝'}</div>
        <div className="elc-info">
          <h3 className="elc-name">{exam.name}</h3>
          <div className="elc-body">{exam.conductingBody}</div>
        </div>
        <span className={`badge ${isActive ? 'badge-success' : 'badge-yellow'}`}>
          {exam.status}
        </span>
      </div>
      <div className="elc-details">
        <div className="elc-detail-item">
          <Users size={13} />
          <span><strong>{exam.vacancy?.toLocaleString()}</strong> Vacancies</span>
        </div>
        <div className="elc-detail-item">
          <Calendar size={13} />
          <span>Last Date: <strong>{exam.formEnd}</strong></span>
        </div>
        <div className="elc-detail-item">
          <span className="badge badge-primary">
            {exam.minQualification?.replace('_', ' ')}
          </span>
        </div>
        {exam.salaryMin && exam.salaryMax && (
          <div className="elc-detail-item">
            <span>💰 {formatSal(exam.salaryMin)} – {formatSal(exam.salaryMax)}</span>
          </div>
        )}
      </div>
      <div className="elc-footer">
        <span className="elc-fee">Fees: ₹{exam.applicationFeeGeneral}</span>
        <Link to={`/exam/${exam.slug}`} className="btn btn-primary btn-sm">
          View Details <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export default function GovtExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [upcomingExams, setUpcomingExams] = useState([]);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        size: 20,
        sortBy,
        ...(activeCategory !== 'All' && { category: activeCategory }),
        ...(searchQuery && { search: searchQuery }),
      };
      const res = await examService.search(params);
      setExams(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, sortBy, page]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    examService.getUpcoming(30).then((res) => setUpcomingExams(res.data || [])).catch(() => {});
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(0); fetchExams(); }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]); // eslint-disable-line

  return (
    <div className="govt-exams-page">
      <div className="page-header-banner">
        <div className="container">
          <div className="page-header-content">
            <div>
              <div className="breadcrumb">
                <Link to="/">Home</Link> <ChevronRight size={12} /> <span>Govt Exams</span>
              </div>
              <h1 className="page-title">Government Job Exams 2024</h1>
              <p className="page-subtitle">
                Find all government job notifications, exam details, eligibility, salary &amp; more
              </p>
              <div className="page-stats">
                <span>📋 {exams.length > 0 ? `${exams.length}+` : '...'} Active Notifications</span>
                <span>👥 60M+ Aspirants</span>
                <span>✅ Verified Information</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        <div className="page-with-sidebar">
          <div>
            {/* Search & Sort */}
            <div className="search-sort-bar card-flat">
              <div className="search-input-wrap">
                <Search size={16} className="search-bar-icon" />
                <input
                  className="search-bar-input"
                  placeholder="Search by exam name, conducting body..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                />
              </div>
              <div className="sort-wrap">
                <SlidersHorizontal size={15} />
                <select
                  className="input select sort-select"
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                >
                  <option value="createdAt">Sort by Latest</option>
                  <option value="formEnd">Sort by Last Date</option>
                  <option value="vacancy">Sort by Vacancy</option>
                </select>
              </div>
            </div>

            {/* Category filter */}
            <div className="category-filter-bar">
              {examCategories.map((cat) => (
                <button
                  key={cat}
                  className={`chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => { setActiveCategory(cat); setPage(0); }}
                >
                  {categoryIcons[cat] || '📝'} {cat === 'STATE_PSC' ? 'State PSC' : cat}
                </button>
              ))}
            </div>

            {/* Results */}
            {error && (
              <div className="error-state">
                <p>⚠️ {error}</p>
                <button className="btn btn-outline btn-sm" onClick={fetchExams}>Retry</button>
              </div>
            )}

            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading exams...</p>
              </div>
            ) : (
              <>
                <div className="results-count">
                  Showing <strong>{exams.length}</strong> exam notifications
                  {activeCategory !== 'All' && <> in <strong>{activeCategory}</strong></>}
                </div>
                <div className="exam-list">
                  {exams.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🔍</div>
                      <h3>No exams found</h3>
                      <p>Try different search terms or categories</p>
                    </div>
                  ) : (
                    exams.map((exam) => <ExamCard key={exam.id} exam={exam} />)
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination" style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      ← Prev
                    </button>
                    <span style={{ padding: '6px 12px', fontSize: 13 }}>
                      Page {page + 1} / {totalPages}
                    </span>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sidebar-widget card-flat">
              <h3 className="sw-title">📅 Upcoming Deadlines</h3>
              {upcomingExams.slice(0, 5).map((e) => (
                <div key={e.id} className="sw-item">
                  <span className="sw-exam-name">{e.name}</span>
                  <span className="sw-date">{e.formEnd}</span>
                </div>
              ))}
            </div>

            <div className="sidebar-widget card-flat" style={{ marginTop: 16 }}>
              <h3 className="sw-title">✅ Quick Eligibility Check</h3>
              <div className="form-group">
                <label className="label">Qualification</label>
                <select className="input select">
                  <option>Select</option>
                  <option>Class 10</option>
                  <option>Class 12</option>
                  <option>Graduation</option>
                </select>
              </div>
              <Link
                to="/eligibility-checker"
                className="btn btn-primary w-full"
                style={{ justifyContent: 'center' }}
              >
                Check Eligibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
