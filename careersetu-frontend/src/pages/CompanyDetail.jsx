import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ExternalLink, Star, Users, Briefcase, TrendingUp, MapPin } from 'lucide-react';
import { companies } from '../data/mockData';
import './CompanyDetail.css';

const allCompanies = [
  ...companies,
  { id: 6, name: 'HCL Technologies', slug: 'hcl', industry: 'IT Services', avgPackageFresher: 380000, readinessScore: 80, label: 'Good', color: '#0070ad' },
  { id: 7, name: 'Tech Mahindra', slug: 'tech-mahindra', industry: 'IT Services', avgPackageFresher: 350000, readinessScore: 74, label: 'Good', color: '#e31837' },
];

const companyDetails = {
  tcs: {
    about: 'Tata Consultancy Services (TCS) is India\'s largest IT company and a global leader in IT services, consulting, and digital transformation. With 600,000+ employees worldwide, TCS serves clients in 46 countries.',
    hq: 'Mumbai, India',
    founded: '1968',
    employees: '600,000+',
    ceo: 'K Krithivasan',
    rounds: ['Online Aptitude Test', 'Technical Interview (1-2 rounds)', 'HR Interview'],
    dsaLevel: 'Beginner - Intermediate',
    aptitudeTopics: ['Quantitative Aptitude', 'Verbal Ability', 'Logical Reasoning', 'Coding (2 questions)'],
    hrQuestions: ['Tell me about yourself', 'Why TCS?', 'Where do you see yourself in 5 years?', 'Strengths & Weaknesses'],
    salaryData: [
      { role: 'Ninja (Fresher)', exp: '0 yr', ctc: '3.5 LPA' },
      { role: 'Digital (Fresher)', exp: '0 yr', ctc: '7 LPA' },
      { role: 'Smart Hire', exp: '0 yr', ctc: '10.5 LPA' },
      { role: 'Software Engineer', exp: '2-4 yr', ctc: '6-12 LPA' },
      { role: 'IT Analyst', exp: '4-6 yr', ctc: '10-18 LPA' },
      { role: 'Senior Consultant', exp: '6+ yr', ctc: '18-35 LPA' },
    ],
    skills: ['Java', 'Python', 'C/C++', 'SQL', 'DBMS', 'OS Concepts', 'Data Structures'],
    reviews: [
      { name: 'Rahul K', rating: 4, text: 'Good work-life balance. Strong learning culture. On-site opportunities available.', role: 'Software Engineer' },
      { name: 'Priya S', rating: 3, text: 'Salary increments are slow. Good company for freshers to start career.', role: 'IT Analyst' },
      { name: 'Amit T', rating: 5, text: 'Excellent training programs. International exposure. Global brand.', role: 'Senior Consultant' },
    ],
  },
};

const tabs = ['Overview', 'Interview Process', 'Salary', 'Reviews', 'Preparation', 'Jobs'];

export default function CompanyDetail() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  const company = allCompanies.find(c => c.slug === slug) || allCompanies[0];
  const detail = companyDetails[slug] || companyDetails['tcs'];
  const fmt = v => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`;
  const scoreColor = company.readinessScore >= 80 ? 'var(--secondary)' : company.readinessScore >= 60 ? '#f59e0b' : 'var(--red)';

  return (
    <div className="company-detail-page">
      {/* Header */}
      <div className="page-header-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <ChevronRight size={12} />
            <Link to="/company-explorer">Companies</Link> <ChevronRight size={12} />
            <span>{company.name}</span>
          </div>
          <div className="cd-hero">
            <div className="cd-logo" style={{ background: company.color + '20', color: company.color }}>
              {company.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="cd-info">
              <h1 className="cd-name">{company.name}</h1>
              <div className="cd-meta-row">
                <span className="badge badge-navy">{company.industry}</span>
                <span><MapPin size={13} /> {detail.hq}</span>
                <span><Users size={13} /> {detail.employees}</span>
                <span>Founded: {detail.founded}</span>
              </div>
            </div>
            <div className="cd-score-box">
              <div className="cd-score-num" style={{ color: scoreColor }}>{company.readinessScore}%</div>
              <div className="cd-score-label">Your Readiness</div>
              <div className="progress-bar" style={{ width: 100, height: 6 }}>
                <div className="progress-fill" style={{ width: company.readinessScore + '%', background: scoreColor }} />
              </div>
              <div style={{ fontSize: 11, color: scoreColor, fontWeight: 600, marginTop: 4 }}>{company.label}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="exam-tabs-bar">
        <div className="container">
          <div className="exam-tabs">
            {tabs.map(t => (
              <button key={t} className={`exam-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        <div className="page-with-sidebar">
          <div className="cd-content">

            {activeTab === 'Overview' && (
              <div className="tab-panel fade-in">
                <div className="cd-about card">
                  <h3 className="tab-section-title">About {company.name}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{detail.about}</p>
                  <div className="cd-facts">
                    {[
                      { label: 'Headquarters', val: detail.hq },
                      { label: 'Founded', val: detail.founded },
                      { label: 'Employees', val: detail.employees },
                      { label: 'CEO', val: detail.ceo },
                      { label: 'Fresher Package', val: fmt(company.avgPackageFresher) },
                      { label: 'Industry', val: company.industry },
                    ].map(f => (
                      <div key={f.label} className="cd-fact">
                        <span className="cd-fact-label">{f.label}</span>
                        <span className="cd-fact-val">{f.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Interview Process' && (
              <div className="tab-panel fade-in">
                <h3 className="tab-section-title">Interview Rounds</h3>
                <div className="selection-steps">
                  {detail.rounds.map((round, i) => (
                    <div key={round} className="selection-step">
                      <div className="step-num">{i + 1}</div>
                      <div className="step-info">
                        <div className="step-title">{round}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="tab-section-title" style={{ marginTop: 24 }}>DSA & Aptitude Level</h3>
                <div className="info-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="info-item"><span className="info-label">DSA Difficulty</span><span className="info-value badge badge-yellow">{detail.dsaLevel}</span></div>
                </div>
                <h3 className="tab-section-title" style={{ marginTop: 24 }}>Aptitude Topics</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {detail.aptitudeTopics.map(t => <span key={t} className="chip">{t}</span>)}
                </div>
                <h3 className="tab-section-title" style={{ marginTop: 24 }}>Common HR Questions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {detail.hrQuestions.map((q, i) => (
                    <div key={i} className="faq-item" style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 14 }}>Q{i + 1}: {q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Salary' && (
              <div className="tab-panel fade-in">
                <h3 className="tab-section-title">Salary by Role & Experience</h3>
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr><th>Role</th><th>Experience</th><th>CTC (Per Annum)</th></tr>
                    </thead>
                    <tbody>
                      {detail.salaryData.map(row => (
                        <tr key={row.role}>
                          <td style={{ fontWeight: 600 }}>{row.role}</td>
                          <td>{row.exp}</td>
                          <td style={{ color: 'var(--secondary)', fontWeight: 700 }}>{row.ctc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="tab-panel fade-in">
                <h3 className="tab-section-title">Employee Reviews</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {detail.reviews.map((r, i) => (
                    <div key={i} className="review-card card">
                      <div className="review-header">
                        <div className="review-avatar">{r.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.role}</div>
                        </div>
                        <div className="review-stars">{'⭐'.repeat(r.rating)}</div>
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 10 }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Preparation' && (
              <div className="tab-panel fade-in">
                <h3 className="tab-section-title">Required Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {detail.skills.map(s => <span key={s} className="chip">{s}</span>)}
                </div>
                <h3 className="tab-section-title">Your Readiness</h3>
                <div className="cd-readiness-breakdown">
                  {detail.skills.map((skill, i) => {
                    const pct = [70, 50, 80, 65, 55, 75, 60][i % 7];
                    return (
                      <div key={skill} className="skill-row">
                        <span className="skill-name">{skill}</span>
                        <div className="progress-bar" style={{ flex: 1, height: 8 }}>
                          <div className="progress-fill" style={{ width: pct + '%', background: pct >= 70 ? 'var(--secondary)' : pct >= 50 ? '#f59e0b' : 'var(--red)' }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, width: 36, textAlign: 'right' }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
                <Link to="/ai-advisor" className="btn btn-primary" style={{ marginTop: 16 }}>
                  🤖 Get AI Improvement Plan
                </Link>
              </div>
            )}

            {activeTab === 'Jobs' && (
              <div className="tab-panel fade-in">
                <h3 className="tab-section-title">Current Openings at {company.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Software Engineer', 'Associate Consultant', 'Data Analyst', 'DevOps Engineer'].map((title, i) => (
                    <div key={title} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
                          <span>Pan India</span> • <span>0-2 years</span> • <span>₹{3 + i * 1.5}–{7 + i * 2} LPA</span>
                        </div>
                      </div>
                      <button className="btn btn-primary btn-sm">Apply Now <ExternalLink size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div>
            <div className="sidebar-widget card-flat">
              <h3 className="sw-title">🎯 Quick Prep Tips</h3>
              {['Practice DSA on LeetCode (Easy level)', 'Solve last 5 year placement papers', 'Prepare STAR format answers for HR', 'Revise DBMS and OS concepts'].map((t, i) => (
                <div key={i} className="sw-item">
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 13 }}>{t}</span>
                </div>
              ))}
            </div>
            <div className="sidebar-widget card-flat" style={{ marginTop: 16 }}>
              <h3 className="sw-title">🏢 Similar Companies</h3>
              {allCompanies.filter(c => c.id !== company.id).slice(0, 4).map(c => (
                <Link key={c.id} to={`/company/${c.slug}`} className="sw-exam-link">
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: c.color + '15', color: c.color, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.name.slice(0, 2)}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.readinessScore}% readiness</div>
                  </div>
                  <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
