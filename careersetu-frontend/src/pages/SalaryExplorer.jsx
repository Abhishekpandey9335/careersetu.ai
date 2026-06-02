import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Briefcase, MapPin, ChevronRight, BarChart3 } from 'lucide-react';
import './SalaryExplorer.css';

const salaryData = [
  { role: 'Software Engineer', freshers: '3.5 - 7 LPA', mid: '8 - 18 LPA', senior: '18 - 40 LPA', avg: 650000, growth: 'High', security: 'High', satisfaction: 4.2, skills: ['Java', 'Python', 'React', 'SQL'] },
  { role: 'Data Analyst', freshers: '4 - 8 LPA', mid: '8 - 15 LPA', senior: '15 - 30 LPA', avg: 600000, growth: 'High', security: 'High', satisfaction: 4.0, skills: ['Python', 'SQL', 'Excel', 'Power BI'] },
  { role: 'DevOps Engineer', freshers: '5 - 10 LPA', mid: '10 - 20 LPA', senior: '20 - 45 LPA', avg: 750000, growth: 'Very High', security: 'High', satisfaction: 4.1, skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'] },
  { role: 'Product Manager', freshers: '8 - 15 LPA', mid: '15 - 30 LPA', senior: '30 - 60 LPA', avg: 1200000, growth: 'High', security: 'Medium', satisfaction: 4.3, skills: ['Analytics', 'Product Strategy', 'Agile'] },
  { role: 'IAS Officer', freshers: '56,100 - 2,50,000', mid: 'Grade A', senior: 'Cabinet Secretary', avg: 120000, growth: 'Steady', security: 'Very High', satisfaction: 4.5, skills: ['Leadership', 'Administration', 'Policy'] },
  { role: 'Bank PO', freshers: '48,480 - 85,920', mid: 'Senior Manager', senior: 'AGM/DGM', avg: 65000, growth: 'Steady', security: 'Very High', satisfaction: 4.4, skills: ['Finance', 'Banking', 'Customer Service'] },
  { role: 'SSC CGL Officer', freshers: '44,900 - 1,42,400', mid: 'Section Officer', senior: 'Deputy Secretary', avg: 80000, growth: 'Steady', security: 'Very High', satisfaction: 4.3, skills: ['Administration', 'GK', 'Aptitude'] },
  { role: 'Machine Learning Engineer', freshers: '6 - 14 LPA', mid: '14 - 30 LPA', senior: '30 - 60 LPA', avg: 1000000, growth: 'Very High', security: 'High', satisfaction: 4.2, skills: ['Python', 'TensorFlow', 'Statistics', 'ML'] },
];

const growthColor = { 'Very High': 'var(--secondary)', 'High': 'var(--primary)', 'Steady': '#f59e0b', 'Medium': '#f59e0b' };

export default function SalaryExplorer() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(salaryData[0]);

  const filtered = salaryData.filter(s =>
    !search || s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="salary-explorer-page">
      <div className="page-header-banner">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <ChevronRight size={12} /> <span>Salary Explorer</span></div>
          <h1 className="page-title">💰 Salary Explorer</h1>
          <p className="page-subtitle">Explore salary ranges, growth prospects and insights for any career</p>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        {/* Search */}
        <div className="card-flat" style={{ display: 'flex', gap: 10, padding: '14px 16px', borderRadius: 'var(--radius-lg)', marginBottom: 24 }}>
          <div className="search-input-wrap" style={{ flex: 1 }}>
            <Search size={16} className="search-bar-icon" />
            <input className="search-bar-input" placeholder="Search any job or career (e.g. Software Engineer, Bank PO...)" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary">Explore</button>
        </div>

        <div className="se-layout">
          {/* Left: list */}
          <div className="se-list">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)' }}>POPULAR CAREERS</h3>
            {filtered.map(item => (
              <button
                key={item.role}
                className={`se-list-item ${selected.role === item.role ? 'active' : ''}`}
                onClick={() => setSelected(item)}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.role}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Avg: ₹{item.avg >= 100000 ? (item.avg / 100000).toFixed(1) + 'L' : (item.avg / 1000).toFixed(0) + 'K'}/yr</div>
                </div>
                <span style={{ color: growthColor[item.growth], fontSize: 11, fontWeight: 600 }}>↑ {item.growth}</span>
              </button>
            ))}
          </div>

          {/* Right: detail */}
          <div className="se-detail">
            <div className="se-hero card">
              <div className="se-hero-top">
                <div>
                  <h2 className="se-role-title">{selected.role}</h2>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge-success"><TrendingUp size={11} /> Growth: {selected.growth}</span>
                    <span className="badge badge-primary">Job Security: {selected.security}</span>
                    <span className="badge badge-yellow">⭐ {selected.satisfaction}/5</span>
                  </div>
                </div>
                <div className="se-avg-box">
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Average Salary</div>
                  <div className="se-avg-sal">₹{selected.avg >= 100000 ? (selected.avg / 100000).toFixed(1) + 'L' : (selected.avg / 1000).toFixed(0) + 'K'} PA</div>
                </div>
              </div>
            </div>

            {/* Salary breakup */}
            <div className="se-salary-table card" style={{ marginTop: 16 }}>
              <h3 className="tab-section-title">Salary by Experience</h3>
              <div className="se-salary-bars">
                {[
                  { label: 'Fresher (0-2 yr)', range: selected.freshers, pct: 30 },
                  { label: 'Mid Level (3-6 yr)', range: selected.mid, pct: 65 },
                  { label: 'Senior (6+ yr)', range: selected.senior, pct: 100 },
                ].map(row => (
                  <div key={row.label} className="se-salary-row">
                    <span className="se-exp-label">{row.label}</span>
                    <div className="se-bar-wrap">
                      <div className="progress-bar" style={{ height: 10 }}>
                        <div className="progress-fill" style={{ width: row.pct + '%', background: 'var(--primary)' }} />
                      </div>
                    </div>
                    <span className="se-range">{row.range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="card" style={{ padding: 20, marginTop: 16 }}>
              <h3 className="tab-section-title">Key Skills Required</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {selected.skills.map(s => <span key={s} className="chip active">{s}</span>)}
              </div>
              <Link to="/ai-advisor" className="btn btn-primary" style={{ marginTop: 14 }}>
                🤖 Get My Skill Gap Analysis
              </Link>
            </div>

            {/* Career comparison table */}
            <div className="card" style={{ padding: 20, marginTop: 16 }}>
              <h3 className="tab-section-title">Top Careers Comparison</h3>
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Role</th><th>Fresher Salary</th><th>Growth</th><th>Job Security</th></tr></thead>
                  <tbody>
                    {salaryData.slice(0, 5).map(row => (
                      <tr key={row.role} style={{ cursor: 'pointer' }} onClick={() => setSelected(row)}>
                        <td style={{ fontWeight: row.role === selected.role ? 700 : 400, color: row.role === selected.role ? 'var(--primary)' : 'inherit' }}>{row.role}</td>
                        <td style={{ color: 'var(--secondary)', fontWeight: 600 }}>{row.freshers}</td>
                        <td><span style={{ color: growthColor[row.growth], fontWeight: 600 }}>↑ {row.growth}</span></td>
                        <td><span className={`badge ${row.security === 'Very High' ? 'badge-success' : 'badge-yellow'}`}>{row.security}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
