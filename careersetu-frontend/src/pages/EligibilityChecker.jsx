import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, ChevronRight, AlertCircle, Share2 } from 'lucide-react'
import { govtExams } from '../data/mockData'
import './EligibilityChecker.css'

const categoryIcons = { SSC: '🏛️', UPSC: '⚖️', BANKING: '🏦', RAILWAY: '🚂', STATE_PSC: '📋', DEFENCE: '🎖️', TEACHING: '👩‍🏫', POLICE: '👮', INSURANCE: '🛡️' }

function formatSalary(min, max) {
  const f = v => v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : `₹${(v / 1000).toFixed(0)}K`
  return `${f(min)} - ${f(max)}`
}

export default function EligibilityChecker() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ qualification: '', age: '', category: '', state: '', stream: '' })
  const [results, setResults] = useState(null)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const checkEligibility = () => {
    // Simple rule-based filtering
    const eligible = govtExams.filter(exam => {
      if (form.qualification === 'Class 10' && exam.minQualification === 'GRADUATION') return false
      if (form.qualification === 'Class 12' && exam.minQualification === 'GRADUATION') return false
      const age = parseInt(form.age)
      if (age && age < 18) return false
      if (age && age > 42) return false
      return true
    })
    setResults(eligible)
    setStep(4)
  }

  const grouped = results ? results.reduce((acc, e) => {
    if (!acc[e.category]) acc[e.category] = []
    acc[e.category].push(e)
    return acc
  }, {}) : {}

  return (
    <div className="eligibility-page">
      <div className="page-header-banner">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <ChevronRight size={12} /> <span>Eligibility Checker</span></div>
          <h1 className="page-title">Exam Eligibility Checker</h1>
          <p className="page-subtitle">Find all government exams you are eligible for based on your profile</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="elig-layout">
          <div className="elig-main">
            {step < 4 && (
              <div className="elig-steps-wrap card">
                {/* Step progress */}
                <div className="elig-step-bar">
                  {['Qualification', 'Personal Info', 'Preferences'].map((label, i) => (
                    <div key={label} className={`elig-step ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : ''}`}>
                      <div className="elig-step-num">{step > i + 1 ? '✓' : i + 1}</div>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="elig-form-content">
                  {step === 1 && (
                    <div className="elig-step-body fade-in">
                      <h2 className="elig-step-title">Step 1: Your Qualification</h2>
                      <div className="elig-qual-grid">
                        {['Class 10', 'Class 12', 'Diploma', 'Graduation', 'Post Graduation'].map(q => (
                          <button key={q} className={`elig-qual-btn ${form.qualification === q ? 'active' : ''}`}
                            onClick={() => setForm(p => ({ ...p, qualification: q }))}>
                            {q}
                          </button>
                        ))}
                      </div>
                      {form.qualification && (
                        <div className="form-group" style={{ marginTop: 20 }}>
                          <label className="label">Stream / Branch</label>
                          <select name="stream" className="input select" value={form.stream} onChange={handleChange}>
                            <option value="">Select Stream</option>
                            <option>Science (PCM)</option>
                            <option>Science (PCB)</option>
                            <option>Commerce</option>
                            <option>Arts / Humanities</option>
                            <option>B.Tech / Engineering</option>
                            <option>B.Sc</option>
                            <option>B.Com</option>
                            <option>BA</option>
                            <option>MBA</option>
                          </select>
                        </div>
                      )}
                      <button className="btn btn-primary btn-lg" style={{ marginTop: 20 }} onClick={() => setStep(2)} disabled={!form.qualification}>
                        Next: Personal Info <ChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="elig-step-body fade-in">
                      <h2 className="elig-step-title">Step 2: Personal Info</h2>
                      <div className="grid-2">
                        <div className="form-group">
                          <label className="label">Your Age</label>
                          <select name="age" className="input select" value={form.age} onChange={handleChange}>
                            <option value="">Select Age</option>
                            {Array.from({ length: 25 }, (_, i) => i + 16).map(a => <option key={a}>{a}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="label">Category</label>
                          <select name="category" className="input select" value={form.category} onChange={handleChange}>
                            <option value="">Select Category</option>
                            <option>General / EWS</option>
                            <option>OBC</option>
                            <option>SC</option>
                            <option>ST</option>
                            <option>PwD</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="label">State</label>
                          <select name="state" className="input select" value={form.state} onChange={handleChange}>
                            <option value="">Select State</option>
                            {['Uttar Pradesh', 'Bihar', 'Rajasthan', 'Madhya Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Haryana', 'Punjab', 'Gujarat', 'West Bengal'].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="label">Gender</label>
                          <select className="input select">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                        <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                        <button className="btn btn-primary btn-lg" onClick={() => setStep(3)} disabled={!form.age || !form.category}>
                          Next: Preferences <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="elig-step-body fade-in">
                      <h2 className="elig-step-title">Step 3: Your Preferences</h2>
                      <div className="form-group">
                        <label className="label">Preferred Exam Categories</label>
                        <div className="elig-pref-grid">
                          {Object.entries(categoryIcons).map(([cat, icon]) => (
                            <label key={cat} className="elig-pref-check">
                              <input type="checkbox" defaultChecked />
                              <span>{icon} {cat.replace('_', ' ')}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="label">Expected Salary Range</label>
                        <select className="input select">
                          <option>Any</option>
                          <option>Below ₹30K/month</option>
                          <option>₹30K–₹60K/month</option>
                          <option>₹60K–₹1L/month</option>
                          <option>Above ₹1L/month</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                        <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                        <button className="btn btn-primary btn-xl" onClick={checkEligibility}>
                          <CheckCircle size={18} /> Check My Eligible Exams
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && results && (
              <div className="fade-in">
                {/* Results header */}
                <div className="elig-results-header card">
                  <div className="erh-left">
                    <CheckCircle size={32} style={{ color: 'var(--secondary)' }} />
                    <div>
                      <h2 className="erh-title">You are eligible for <span style={{ color: 'var(--primary)' }}>{results.length} Exams!</span></h2>
                      <p className="erh-sub">Based on: {form.qualification} • Age {form.age} • {form.category} • {form.state}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-outline btn-sm"><Share2 size={14} /> Share Results</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setStep(1); setResults(null) }}>Reset</button>
                  </div>
                </div>

                {/* Grouped by category */}
                {Object.entries(grouped).map(([cat, exams]) => (
                  <div key={cat} style={{ marginTop: 24 }}>
                    <div className="section-header">
                      <h3 className="section-title">{categoryIcons[cat] || '📝'} {cat.replace('_', ' ')} ({exams.length})</h3>
                    </div>
                    <div className="elig-results-grid">
                      {exams.map(exam => (
                        <div key={exam.id} className="elig-result-card card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 700 }}>{exam.name}</h4>
                            <span className={`badge ${exam.status === 'ACTIVE' ? 'badge-success' : 'badge-yellow'}`}>{exam.status}</span>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{exam.conductingBody}</div>
                          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
                            <span>👥 {exam.vacancy?.toLocaleString()} posts</span>
                            <span>💰 {formatSalary(exam.salaryMin, exam.salaryMax)}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Link to={`/exam/${exam.slug}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>View Details</Link>
                            <a href="#" className="btn btn-outline btn-sm">Apply</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="elig-sidebar">
            <div className="sidebar-widget card-flat">
              <h3 className="sw-title">ℹ️ How It Works</h3>
              {['Fill your qualification details', 'Enter age, category & state', 'Set your preferences', 'Get all eligible exams instantly'].map((step, i) => (
                <div key={i} className="sw-item">
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 13 }}>{step}</span>
                </div>
              ))}
            </div>

            <div className="sidebar-widget card-flat" style={{ marginTop: 16 }}>
              <h3 className="sw-title">🤖 AI Exam Advisor</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Get AI-powered exam recommendations for your specific profile</p>
              <Link to="/ai-advisor" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>Ask AI Advisor →</Link>
            </div>

            <div className="sidebar-widget card-flat" style={{ marginTop: 16 }}>
              <h3 className="sw-title">📅 Upcoming Deadlines</h3>
              {govtExams.slice(0, 4).map(e => (
                <div key={e.id} className="sw-item">
                  <span style={{ fontSize: 13, flex: 1 }}>{e.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 600 }}>{e.formEnd}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
