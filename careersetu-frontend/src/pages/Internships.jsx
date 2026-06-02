import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Clock, ChevronRight, DollarSign, Filter } from 'lucide-react'
import './PrivateJobs.css'
import './Internships.css'

const internshipsData = [
  { id: 1, company: 'Google', title: 'Software Engineering Intern', location: 'Bangalore', stipend: 80000, duration: '3 months', skills: ['Python', 'Algorithms', 'Data Structures'], type: 'Tech', deadline: '30 Jun 2024', isRemote: false },
  { id: 2, company: 'Microsoft', title: 'Product Management Intern', location: 'Hyderabad', stipend: 70000, duration: '2 months', skills: ['Analytics', 'Product Thinking', 'Excel'], type: 'Management', deadline: '15 Jul 2024', isRemote: false },
  { id: 3, company: 'Flipkart', title: 'Data Science Intern', location: 'Bangalore', stipend: 50000, duration: '3 months', skills: ['Python', 'ML', 'SQL'], type: 'Data', deadline: '20 Jun 2024', isRemote: true },
  { id: 4, company: 'Zomato', title: 'UI/UX Design Intern', location: 'Gurugram', stipend: 25000, duration: '2 months', skills: ['Figma', 'Adobe XD', 'Prototyping'], type: 'Design', deadline: '25 Jun 2024', isRemote: true },
  { id: 5, company: 'Paytm', title: 'Backend Developer Intern', location: 'Noida', stipend: 40000, duration: '6 months', skills: ['Java', 'Spring Boot', 'MySQL'], type: 'Tech', deadline: '10 Jul 2024', isRemote: false },
  { id: 6, company: 'BYJU\'S', title: 'Content Writing Intern', location: 'Bangalore', stipend: 15000, duration: '3 months', skills: ['Writing', 'Research', 'SEO'], type: 'Content', deadline: '05 Jul 2024', isRemote: true },
  { id: 7, company: 'Razorpay', title: 'Frontend Developer Intern', location: 'Bangalore', stipend: 60000, duration: '3 months', skills: ['React', 'JavaScript', 'CSS'], type: 'Tech', deadline: '12 Jul 2024', isRemote: false },
  { id: 8, company: 'Naukri.com', title: 'Marketing Intern', location: 'Noida', stipend: 18000, duration: '2 months', skills: ['Social Media', 'Content', 'Analytics'], type: 'Marketing', deadline: '28 Jun 2024', isRemote: true },
]

const typeColors = { Tech: '#1a56db', Management: '#7e3af2', Data: '#0e9f6e', Design: '#ff6b35', Content: '#f59e0b', Marketing: '#0ea5e9' }

function InternCard({ intern }) {
  const color = typeColors[intern.type] || '#1a56db'
  return (
    <div className="intern-card card">
      <div className="ic-header">
        <div className="ic-logo" style={{ background: color + '15', color }}>
          {intern.company.slice(0, 2).toUpperCase()}
        </div>
        <div className="ic-info">
          <h3 className="ic-title">{intern.title}</h3>
          <div className="ic-company">{intern.company}</div>
        </div>
        {intern.isRemote && <span className="badge badge-success">Remote</span>}
      </div>
      <div className="ic-meta">
        <span><MapPin size={12} /> {intern.location}</span>
        <span><Clock size={12} /> {intern.duration}</span>
        <span><DollarSign size={12} /> ₹{(intern.stipend / 1000).toFixed(0)}K/mo</span>
      </div>
      <div className="ic-skills">
        {intern.skills.map(s => <span key={s} className="tag">{s}</span>)}
      </div>
      <div className="ic-footer">
        <span className="ic-deadline">Last Date: <strong>{intern.deadline}</strong></span>
        <button className="btn btn-primary btn-sm">Apply Now</button>
      </div>
    </div>
  )
}

export default function Internships() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterMode, setFilterMode] = useState('All')

  const types = ['All', ...new Set(internshipsData.map(i => i.type))]
  const filtered = internshipsData.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.company.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'All' || i.type === filterType
    const matchMode = filterMode === 'All' || (filterMode === 'Remote' ? i.isRemote : !i.isRemote)
    return matchSearch && matchType && matchMode
  })

  return (
    <div className="internships-page">
      <div className="page-header-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <ChevronRight size={12} /> <span>Internships</span>
          </div>
          <h1 className="page-title">Latest Internships 2024</h1>
          <p className="page-subtitle">Find internships at top startups & MNCs. Paid internships with stipend ₹10K–₹1L/month</p>
          <div className="page-stats">
            <span>🎓 5K+ Internships</span>
            <span>🏢 500+ Companies</span>
            <span>💻 Remote & On-site</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        {/* Filters */}
        <div className="card-flat intern-filter-bar">
          <div className="search-input-wrap" style={{ flex: 1 }}>
            <Search size={16} className="search-bar-icon" />
            <input className="search-bar-input" placeholder="Search internships, companies, skills..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input select" style={{ width: 150 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
          <select className="input select" style={{ width: 150 }} value={filterMode} onChange={e => setFilterMode(e.target.value)}>
            <option>All</option>
            <option>Remote</option>
            <option>On-site</option>
          </select>
          <button className="btn btn-primary"><Filter size={14} /> Filter</button>
        </div>

        {/* Type pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0' }}>
          {types.map(t => (
            <button key={t} className={`chip ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
              {t !== 'All' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: typeColors[t] || '#999', display: 'inline-block', marginRight: 4 }} />}
              {t}
            </button>
          ))}
        </div>

        <div className="results-count">Showing <strong>{filtered.length}</strong> internships</div>

        <div className="interns-grid" style={{ marginTop: 12 }}>
          {filtered.map(i => <InternCard key={i.id} intern={i} />)}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <div className="empty-icon">🎓</div>
              <h3>No internships found</h3>
              <p>Try different search or filter</p>
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="intern-tips card" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>💡 Tips to Get Selected</h2>
          <div className="grid-4">
            {[
              { icon: '📝', title: 'Strong Resume', tip: 'Make an ATS-friendly resume with relevant skills and projects' },
              { icon: '💻', title: 'Build Projects', tip: 'Have 2–3 portfolio projects relevant to the role you are applying for' },
              { icon: '🎤', title: 'Interview Prep', tip: 'Practice common HR and technical questions using our AI interview coach' },
              { icon: '⚡', title: 'Apply Early', tip: 'Apply within 48 hours of posting — early applicants get 3x more responses' },
            ].map(t => (
              <div key={t.title} className="intern-tip-card card-flat" style={{ padding: 16 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.tip}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
