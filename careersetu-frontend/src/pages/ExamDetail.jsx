import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ExternalLink, Download, BookOpen, Clock, Users, Calendar, DollarSign } from 'lucide-react';
import { govtExams } from '../data/mockData';
import './ExamDetail.css';

const tabs = ['Overview', 'Eligibility', 'Syllabus', 'Salary', 'Selection Process', 'Preparation', 'FAQ'];

const categoryIcons = {
  SSC: '🏛️', UPSC: '⚖️', BANKING: '🏦', RAILWAY: '🚂',
  STATE_PSC: '📋', DEFENCE: '🎖️', TEACHING: '👩‍🏫', POLICE: '👮',
};

export default function ExamDetail() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  const exam = govtExams.find(e => e.slug === slug) || govtExams[0];
  const fmt = (v) => v >= 100000 ? `₹${(v/100000).toFixed(0)}L` : `₹${(v/1000).toFixed(0)}K`;

  return (
    <div className="exam-detail-page">
      {/* Breadcrumb */}
      <div className="exam-detail-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <ChevronRight size={12} />
            <Link to="/govt-exams">Govt Exams</Link> <ChevronRight size={12} />
            <span>{exam.name}</span>
          </div>
          <div className="exam-detail-hero">
            <div className="exam-detail-icon">{categoryIcons[exam.category] || '📝'}</div>
            <div className="exam-detail-info">
              <div className="exam-detail-meta-top">
                <span className="badge badge-primary">{exam.category}</span>
                <span className={`badge ${exam.status === 'ACTIVE' ? 'badge-success' : 'badge-yellow'}`}>{exam.status}</span>
              </div>
              <h1 className="exam-detail-title">{exam.name}</h1>
              <p className="exam-detail-body">{exam.conductingBody}</p>
              <div className="exam-detail-quick-stats">
                <div className="eds-stat"><Users size={14} /><span>{exam.vacancy?.toLocaleString()} Vacancies</span></div>
                <div className="eds-stat"><Calendar size={14} /><span>Last Date: {exam.formEnd}</span></div>
                <div className="eds-stat"><DollarSign size={14} /><span>{fmt(exam.salaryMin)} - {fmt(exam.salaryMax)}</span></div>
                <div className="eds-stat"><Clock size={14} /><span>Exam: {exam.examDate}</span></div>
              </div>
            </div>
            <div className="exam-detail-actions">
              <a href="#" className="btn btn-primary btn-lg"><ExternalLink size={15} /> Apply Now</a>
              <button className="btn btn-outline">🔔 Get Alerts</button>
              <button className="btn btn-ghost"><Download size={15} /> PDF</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="exam-tabs-bar">
        <div className="container">
          <div className="exam-tabs">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`exam-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{padding: '28px 20px'}}>
        <div className="page-with-sidebar">
          {/* Main Content */}
          <div className="exam-tab-content">
            {activeTab === 'Overview' && (
              <div className="tab-panel">
                <div className="info-grid">
                  {[
                    { label: 'Notification Date', value: '01 Mar 2024' },
                    { label: 'Application Start', value: exam.formEnd ? '01 Mar 2024' : 'TBD' },
                    { label: 'Application End', value: exam.formEnd },
                    { label: 'Exam Date', value: exam.examDate },
                    { label: 'Result Date', value: 'Dec 2024' },
                    { label: 'Total Vacancies', value: exam.vacancy?.toLocaleString() },
                    { label: 'Application Fee', value: `₹${exam.applicationFeeGeneral} (General)` },
                    { label: 'Exam Mode', value: 'Online (CBT)' },
                  ].map(item => (
                    <div key={item.label} className="info-item">
                      <span className="info-label">{item.label}</span>
                      <span className="info-value">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="important-links-box">
                  <h3>Important Links</h3>
                  <div className="imp-links">
                    <a href="#" className="imp-link"><ExternalLink size={13} /> Official Notification PDF</a>
                    <a href="#" className="imp-link"><ExternalLink size={13} /> Apply Online</a>
                    <a href="#" className="imp-link"><Download size={13} /> Download Syllabus</a>
                    <a href="#" className="imp-link"><Download size={13} /> Previous Year Papers</a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Eligibility' && (
              <div className="tab-panel">
                <h3 className="tab-section-title">Age Limit</h3>
                <div className="table-wrap">
                  <table className="table">
                    <thead><tr><th>Category</th><th>Min Age</th><th>Max Age</th><th>Relaxation</th></tr></thead>
                    <tbody>
                      <tr><td>General / EWS</td><td>18</td><td>32</td><td>-</td></tr>
                      <tr><td>OBC</td><td>18</td><td>35</td><td>+3 years</td></tr>
                      <tr><td>SC/ST</td><td>18</td><td>37</td><td>+5 years</td></tr>
                      <tr><td>PwD (General)</td><td>18</td><td>42</td><td>+10 years</td></tr>
                    </tbody>
                  </table>
                </div>
                <h3 className="tab-section-title" style={{marginTop:24}}>Educational Qualification</h3>
                <div className="eligibility-point"><span className="eligibility-bullet">✅</span> {exam.minQualification?.replace('_', ' ')} from a recognized university</div>
                <div className="eligibility-point"><span className="eligibility-bullet">✅</span> Candidates in final year can also apply</div>
                <div className="eligibility-point"><span className="eligibility-bullet">✅</span> Nationality: Indian Citizen</div>
              </div>
            )}

            {activeTab === 'Syllabus' && (
              <div className="tab-panel">
                <h3 className="tab-section-title">Exam Syllabus</h3>
                {[
                  { subject: 'Quantitative Aptitude', topics: ['Number System', 'Percentage', 'Profit & Loss', 'Time & Work', 'Speed & Distance', 'Geometry', 'Algebra', 'Trigonometry'] },
                  { subject: 'English Language', topics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Cloze Test', 'Sentence Improvement', 'Error Detection'] },
                  { subject: 'General Intelligence & Reasoning', topics: ['Analogy', 'Classification', 'Series', 'Coding-Decoding', 'Blood Relations', 'Puzzles'] },
                  { subject: 'General Awareness', topics: ['Current Affairs', 'History', 'Geography', 'Economics', 'Science & Technology', 'Computer Knowledge'] },
                ].map(s => (
                  <div key={s.subject} className="syllabus-section">
                    <h4 className="syllabus-subject">{s.subject}</h4>
                    <div className="syllabus-topics">
                      {s.topics.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                ))}
                <button className="btn btn-outline" style={{marginTop:16}}><Download size={14} /> Download Full Syllabus PDF</button>
              </div>
            )}

            {activeTab === 'Salary' && (
              <div className="tab-panel">
                <div className="salary-highlight-box">
                  <div className="salary-big">{fmt(exam.salaryMin)} - {fmt(exam.salaryMax)}</div>
                  <div className="salary-desc">Pay Scale (Gross per month)</div>
                </div>
                <div className="table-wrap" style={{marginTop:20}}>
                  <table className="table">
                    <thead><tr><th>Component</th><th>Amount</th></tr></thead>
                    <tbody>
                      <tr><td>Basic Pay</td><td>{fmt(exam.salaryMin)}</td></tr>
                      <tr><td>HRA (10%)</td><td>₹{Math.round(exam.salaryMin*0.1/100)*100}</td></tr>
                      <tr><td>DA (42%)</td><td>₹{Math.round(exam.salaryMin*0.42/100)*100}</td></tr>
                      <tr><td>Transport Allowance</td><td>₹3,600</td></tr>
                      <tr><td><strong>Gross Salary</strong></td><td><strong>{fmt(exam.salaryMin + exam.salaryMin*0.52)}</strong></td></tr>
                      <tr><td>Deductions (PF, Tax)</td><td>~₹5,000</td></tr>
                      <tr><td><strong>In-hand Salary</strong></td><td><strong style={{color:'var(--secondary)'}}>₹{((exam.salaryMin + exam.salaryMin*0.52 - 5000)/1000).toFixed(0)}K</strong></td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="perks-box">
                  <h3>Additional Perks & Benefits</h3>
                  <div className="perks-list">
                    {['Medical Facilities', 'LTC (Leave Travel Concession)', 'Government Quarters', 'Pension Benefits', 'Job Security', 'Career Progression'].map(p => (
                      <span key={p} className="perk-item">✅ {p}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Selection Process' && (
              <div className="tab-panel">
                <h3 className="tab-section-title">Selection Stages</h3>
                <div className="selection-steps">
                  {['Preliminary Exam (Tier I)', 'Main Exam (Tier II)', 'Skill Test / Document Verification', 'Medical Examination', 'Final Merit List'].map((step, i) => (
                    <div key={step} className="selection-step">
                      <div className="step-num">{i+1}</div>
                      <div className="step-info">
                        <div className="step-title">{step}</div>
                        <div className="step-sub">{i === 0 ? 'Objective type MCQ, 200 marks, 1 hour' : i === 1 ? 'Descriptive + Objective, 400 marks, 2 hours' : i === 2 ? 'Computer proficiency test' : i === 3 ? 'Physical fitness examination' : 'Final joining based on merit'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Preparation' && (
              <div className="tab-panel">
                <h3 className="tab-section-title">Recommended Books</h3>
                <div className="books-grid">
                  {[
                    { title: 'Quant by R.S. Aggarwal', subject: 'Mathematics', author: 'R.S. Aggarwal' },
                    { title: 'Lucent General Knowledge', subject: 'GK', author: 'Lucent' },
                    { title: 'Wren & Martin English', subject: 'English', author: 'Wren & Martin' },
                    { title: 'M.K. Pandey Reasoning', subject: 'Reasoning', author: 'M.K. Pandey' },
                  ].map(book => (
                    <div key={book.title} className="book-card card">
                      <div className="book-icon">📚</div>
                      <div className="book-title">{book.title}</div>
                      <div className="book-subject badge badge-primary">{book.subject}</div>
                      <a href="#" className="btn btn-outline btn-sm" style={{marginTop:10}}>Buy on Amazon</a>
                    </div>
                  ))}
                </div>
                <h3 className="tab-section-title" style={{marginTop:24}}>YouTube Channels</h3>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {['SSC Adda247', 'Study IQ', 'Unacademy SSC', 'Wifistudy', 'Khan GS Research Centre'].map(ch => (
                    <span key={ch} className="chip">{ch}</span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'FAQ' && (
              <div className="tab-panel">
                {[
                  { q: `What is the eligibility for ${exam.name}?`, a: `Candidates should have ${exam.minQualification?.replace('_', ' ')} from a recognized university.` },
                  { q: 'How many attempts are allowed?', a: 'No restriction on number of attempts as long as you are within the age limit.' },
                  { q: 'Is there negative marking?', a: 'Yes, 0.50 marks deducted for each wrong answer in Tier I.' },
                  { q: 'Can final year students apply?', a: 'Yes, candidates appearing in final year exams can apply.' },
                ].map(faq => (
                  <div key={faq.q} className="faq-item">
                    <div className="faq-q">Q: {faq.q}</div>
                    <div className="faq-a">A: {faq.a}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sidebar-widget card-flat">
              <h3 className="sw-title">🤖 AI Career Advisor</h3>
              <p style={{fontSize:13,color:'var(--text-muted)',marginBottom:12}}>Ask me anything about this exam</p>
              <Link to="/ai-advisor" className="btn btn-primary w-full" style={{justifyContent:'center'}}>Chat with AI →</Link>
            </div>

            <div className="sidebar-widget card-flat" style={{marginTop:16}}>
              <h3 className="sw-title">📊 Quick Stats</h3>
              {[
                { label: 'Total Posts', val: exam.vacancy?.toLocaleString() },
                { label: 'Application Fee', val: `₹${exam.applicationFeeGeneral}` },
                { label: 'Category', val: exam.category },
                { label: 'Qualification', val: exam.minQualification?.replace('_', ' ') },
              ].map(s => (
                <div key={s.label} className="sw-item">
                  <span style={{color:'var(--text-muted)',fontSize:12}}>{s.label}</span>
                  <span style={{fontWeight:600,fontSize:13}}>{s.val}</span>
                </div>
              ))}
            </div>

            <div className="sidebar-widget card-flat" style={{marginTop:16}}>
              <h3 className="sw-title">🔗 Related Exams</h3>
              {govtExams.filter(e => e.category === exam.category && e.id !== exam.id).slice(0,3).map(e => (
                <Link key={e.id} to={`/exam/${e.slug}`} className="sw-exam-link">
                  <span>{categoryIcons[e.category]}</span>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{e.name}</div>
                    <div style={{fontSize:11,color:'var(--text-muted)'}}>{e.vacancy?.toLocaleString()} Vacancies</div>
                  </div>
                  <ChevronRight size={14} style={{marginLeft:'auto',color:'var(--text-muted)'}} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
