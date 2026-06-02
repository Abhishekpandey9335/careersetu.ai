import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, TrendingUp, Users, Star, Briefcase } from 'lucide-react';
import { companies } from '../data/mockData';
import './CompanyExplorer.css';

const industries = ['All', 'IT Services', 'Consulting', 'E-commerce', 'Finance', 'FMCG', 'Manufacturing'];

const allCompanies = [
  ...companies,
  { id: 6, name: 'HCL Technologies', slug: 'hcl', industry: 'IT Services', avgPackageFresher: 380000, readinessScore: 80, label: 'Good', color: '#0070ad', founded: 1976, employees: '225K+' },
  { id: 7, name: 'Tech Mahindra', slug: 'tech-mahindra', industry: 'IT Services', avgPackageFresher: 350000, readinessScore: 74, label: 'Good', color: '#e31837', founded: 1986, employees: '160K+' },
  { id: 8, name: 'Cognizant', slug: 'cognizant', industry: 'IT Services', avgPackageFresher: 400000, readinessScore: 76, label: 'Good', color: '#0033a0', founded: 1994, employees: '350K+' },
  { id: 9, name: 'Deloitte', slug: 'deloitte', industry: 'Consulting', avgPackageFresher: 700000, readinessScore: 55, label: 'Average', color: '#86bc25', founded: 1845, employees: '415K+' },
  { id: 10, name: 'Flipkart', slug: 'flipkart', industry: 'E-commerce', avgPackageFresher: 1500000, readinessScore: 50, label: 'Needs Work', color: '#2874f0', founded: 2007, employees: '50K+' },
];

function CompanyCard({ company }) {
  const fmt = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`;
  const scoreColor = company.readinessScore >= 80 ? 'var(--secondary)' : company.readinessScore >= 60 ? '#f59e0b' : 'var(--red)';

  return (
    <Link to={`/company/${company.slug}`} className="company-card card">
      <div className="cc-header">
        <div className="cc-logo" style={{ background: company.color + '18', color: company.color }}>
          {company.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="cc-readiness">
          <div className="cc-score" style={{ color: scoreColor }}>{company.readinessScore}%</div>
          <div className="cc-score-label" style={{ color: scoreColor }}>{company.label}</div>
        </div>
      </div>
      <h3 className="cc-name">{company.name}</h3>
      <div className="cc-industry badge badge-navy">{company.industry}</div>
      <div className="progress-bar" style={{ marginTop: 12, marginBottom: 6 }}>
        <div className="progress-fill" style={{ width: company.readinessScore + '%', background: scoreColor }} />
      </div>
      <div className="cc-meta">
        <span><Briefcase size={12} /> {fmt(company.avgPackageFresher)} fresher</span>
        <span><Users size={12} /> {company.employees || '100K+'}</span>
      </div>
    </Link>
  );
}

export default function CompanyExplorer() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');

  const filtered = allCompanies.filter(c =>
    (industry === 'All' || c.industry === industry) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="company-explorer-page">
      <div className="page-header-banner">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <ChevronRight size={12} /> <span>Company Explorer</span></div>
          <h1 className="page-title">Company Explorer</h1>
          <p className="page-subtitle">Explore top companies, check your readiness score and prepare to get placed</p>
          <div className="page-stats">
            <span>🏢 500+ Companies</span>
            <span>💼 Placement Insights</span>
            <span>✅ Interview Prep</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        {/* Search & industry filter */}
        <div className="ce-toolbar card-flat">
          <div className="search-input-wrap" style={{ flex: 1 }}>
            <Search size={16} className="search-bar-icon" />
            <input className="search-bar-input" placeholder="Search company name..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="industry-chips">
            {industries.map(ind => (
              <button key={ind} className={`chip ${industry === ind ? 'active' : ''}`} onClick={() => setIndustry(ind)}>{ind}</button>
            ))}
          </div>
        </div>

        {/* Your readiness overview */}
        <div className="readiness-overview card" style={{ marginTop: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 4 }}>Your Company Readiness Scores</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
            Based on your profile — improve skills to boost your score
          </p>
          <div className="readiness-bars">
            {allCompanies.slice(0, 6).map(c => (
              <div key={c.id} className="ro-item">
                <div className="ro-company">
                  <div className="ro-logo" style={{ background: c.color + '15', color: c.color }}>{c.name.slice(0, 2)}</div>
                  <span className="ro-name">{c.name}</span>
                </div>
                <div className="ro-bar-wrap">
                  <div className="progress-bar" style={{ height: 10 }}>
                    <div className="progress-fill" style={{ width: c.readinessScore + '%', background: c.color }} />
                  </div>
                </div>
                <span className="ro-pct" style={{ color: c.color }}>{c.readinessScore}%</span>
                <span className="ro-label" style={{ color: c.color, fontWeight: 600, fontSize: 12 }}>{c.label}</span>
              </div>
            ))}
          </div>
          <Link to="/ai-advisor" className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>
            🤖 Get AI Improvement Plan →
          </Link>
        </div>

        {/* Company grid */}
        <div className="section-header" style={{ marginTop: 32 }}>
          <h2 className="section-title">All Companies ({filtered.length})</h2>
        </div>
        <div className="companies-grid">
          {filtered.map(c => <CompanyCard key={c.id} company={c} />)}
        </div>
      </div>
    </div>
  );
}
