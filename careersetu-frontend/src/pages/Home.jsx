import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, ChevronRight, Sparkles, Bot, Send,
  CheckCircle, TrendingUp, MapPin, Briefcase, Clock,
  Play, Target, Building2, GraduationCap, Rocket,
  BookOpen, PlayCircle
} from 'lucide-react';
import {
  privateJobs, roadmaps, companies,
  successStories
} from '../data/mockData';
import './Home.css';

const companyColors = {
  TCS: '#3b5998', Infosys: '#007bff', Wipro: '#5ba3e0',
  Accenture: '#a100ff', Capgemini: '#0070ad', Google: '#ea4335',
  Microsoft: '#00a4ef', Flipkart: '#2874f0'
};

const topHiringCompanies = [
  'TCS', 'Infosys', 'Accenture', 'Wipro', 'Amazon',
  'Microsoft', 'Google', 'Deloitte', 'IBM', 'Capgemini'
];

function formatSalary(min, max) {
  const fmt = (v) => v >= 100000 ? `${(v/100000).toFixed(0)}L` : `${(v/1000).toFixed(0)}K`;
  return `${fmt(min)} - ${fmt(max)}`;
}

function JobCard({ job }) {
  const color = companyColors[job.companyName] || '#1a56db';
  return (
    <div className="job-card card">
      <div className="job-card-header">
        <div className="job-company-logo" style={{ background: color + '15', color }}>
          {job.companyName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="job-company-name">{job.companyName}</div>
          <div className="job-type-badge">
            <span className={`badge ${job.type === 'INTERNSHIP' ? 'badge-purple' : 'badge-primary'}`}>
              {job.type === 'INTERNSHIP' ? 'Internship' : 'Full-time'}
            </span>
          </div>
        </div>
      </div>
      <h3 className="job-title">{job.title}</h3>
      <div className="job-details">
        <span><MapPin size={12} /> {job.location}</span>
        <span><Briefcase size={12} /> {job.experienceMin}-{job.experienceMax || 2} yrs</span>
      </div>
      <div className="job-salary">{formatSalary(job.salaryMin, job.salaryMax)}</div>
      <div className="job-skills">
        {job.skillsRequired?.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
      </div>
      <a href={job.applyLink || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm apply-btn">
        Apply Now <ArrowRight size={13} />
      </a>
    </div>
  );
}

function AiWidget() {
  const [messages, setMessages] = useState([
    { role: 'user', text: 'Mujhe backend developer banna hai, kaunsi skills seekhun?' },
    { role: 'ai', text: 'Aapke profile ke hisaab se:\n• Java + Spring Boot\n• SQL Databases\n• REST APIs\n• Docker basics\n• System Design fundamentals' }
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: 'Great question! Let me analyze your profile and give you the best recommendations. Please visit our full AI Advisor for detailed guidance.' }]);
    }, 800);
  };

  return (
    <div className="ai-widget card-flat">
      <div className="ai-widget-header">
        <Bot size={16} /> AI Career Assistant
        <span className="badge badge-purple" style={{marginLeft:'auto'}}>AI</span>
      </div>
      <p className="ai-widget-subtitle">Ask any career related question</p>
      <div className="ai-messages">
        {messages.map((m, i) => (
          <div key={i} className={`ai-msg ${m.role}`}>
            <div className="ai-msg-bubble" style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="ai-input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything..."
          className="ai-input"
        />
        <button className="ai-send-btn" onClick={handleSend}><Send size={14} /></button>
      </div>
      <button className="btn btn-primary w-full" style={{marginTop:10,justifyContent:'center'}} onClick={() => navigate('/ai-advisor')}>
        <Sparkles size={14} /> Chat with AI Advisor
      </button>
    </div>
  );
}

const quickAccessItems = [
  { icon: <Briefcase size={20} />, title: 'Private Jobs', desc: 'Handpicked job opportunities from top companies.', path: '/private-jobs', color: '#db2777', bg: '#fce7f3' },
  { icon: <GraduationCap size={20} />, title: 'Internships', desc: 'Gain real-world experience and build your future.', path: '/internships', color: '#0e9f6e', bg: '#dcfce7' },
  { icon: <Bot size={20} />, title: 'AI Advisor', desc: 'Get personalized career guidance & recommendations.', path: '/ai-advisor', color: '#d97706', bg: '#fef3c7' },
  { icon: <Target size={20} />, title: 'Strategies', desc: 'PDFs • Roadmaps • Resources for your success.', path: '/learn', color: '#7c3aed', bg: '#ede9fe' },
  { icon: <PlayCircle size={20} />, title: 'Lectures', desc: 'Free & Premium Video Lectures.', path: '/lectures', color: '#2563eb', bg: '#dbeafe' },
];

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-blob" />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-left fade-in-up">
              <div className="hero-badge">
                <Sparkles size={14} /> 25,000+ Careers Matched. You're Next.
              </div>
              <h1 className="hero-title">
                Naukri Sirf Sapna Nahi,<br />
                <span className="gradient-text">Ab Reality Hai.</span>
              </h1>
              <p className="hero-subtitle">
                Airojgar.in aapke career dreams ko haqeeqat banane ke liye bana hai.
                Yahan aapko milte hain latest private jobs, internships, top companies,
                career guidance aur expert strategies – sab ek hi jagah.
              </p>
              <div className="hero-stats">
                {[['15K+', 'Jobs'], ['5K+', 'Internships'], ['500+', 'Companies'], ['10K+', 'Study Materials']].map(([num, label]) => (
                  <div key={label} className="hero-stat">
                    <span className="hero-stat-num">{num}</span>
                    <span className="hero-stat-label">{label}</span>
                  </div>
                ))}
              </div>
              <div className="hero-actions">
                <Link to="/private-jobs" className="btn btn-primary btn-lg">
                  <Briefcase size={16} /> Find Private Jobs <ArrowRight size={16} />
                </Link>
                <Link to="/ai-advisor" className="btn btn-outline btn-lg">
                  <Bot size={16} /> Get My Career Match
                </Link>
              </div>
            </div>

            <div className="hero-right fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="hero-visual">
                <div className="float-card float-card-1">
                  <div className="float-card-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}><Bot size={18} /></div>
                  <div>
                    <div className="float-card-title">AI Career Advisor</div>
                    <div className="float-card-sub">Personalized guidance</div>
                  </div>
                  <ChevronRight size={16} className="float-card-arrow" />
                </div>

                <div className="float-card float-card-2">
                  <div className="float-card-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><Briefcase size={18} /></div>
                  <div>
                    <div className="float-card-title">Interview Preparation</div>
                    <div className="float-card-sub">Mock tests &amp; tips</div>
                  </div>
                  <ChevronRight size={16} className="float-card-arrow" />
                </div>

                <div className="float-card float-card-3">
                  <div className="float-card-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}><Building2 size={18} /></div>
                  <div>
                    <div className="float-card-title">Top Companies</div>
                    <div className="float-card-sub">Explore hiring now</div>
                  </div>
                  <ChevronRight size={16} className="float-card-arrow" />
                </div>

                <div className="speech-bubble">
                  <Target size={14} />
                  <span>Right Guidance<br />Better Opportunities</span>
                </div>

                <div className="hero-tagline">Build<br />Your Future</div>

                <div className="video-pill">
                  <span className="video-play"><Play size={12} fill="white" /></span>
                  <div>
                    <div className="video-pill-title">Watch Intro Video</div>
                    <div className="video-pill-sub">2 min</div>
                  </div>
                </div>

                <div className="mug-tag">Better Skills<br />Bigger Opportunities</div>

                <div className="device-mockup">
                  <div className="device-screen">
                    <div className="device-topbar">
                      <Rocket size={13} /> Airojgar.in
                    </div>
                    <h4 className="device-heading">Your Dream Job Awaits</h4>
                    <div className="device-search">
                      <span>Search jobs, internships, companies...</span>
                      <span className="device-search-btn">→</span>
                    </div>
                    <div className="device-icons">
                      {[
                        { icon: <Briefcase size={16} />, label: 'Jobs' },
                        { icon: <GraduationCap size={16} />, label: 'Internships' },
                        { icon: <Building2 size={16} />, label: 'Companies' },
                        { icon: <BookOpen size={16} />, label: 'Study Materials' },
                      ].map(i => (
                        <div key={i.label} className="device-icon-item">
                          <div className="device-icon-box">{i.icon}</div>
                          <span>{i.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="device-base" />
                </div>
              </div>
            </div>
          </div>

          {/* Top Hiring Companies strip */}
          <div className="companies-strip">
            <div className="companies-strip-label">
              <div className="companies-strip-icon"><Building2 size={18} /></div>
              <div>
                <div className="companies-strip-title">Top Hiring Companies</div>
                <div className="companies-strip-sub">Get placed at dream companies</div>
              </div>
            </div>
            <div className="companies-strip-logos">
              {topHiringCompanies.map(name => (
                <span key={name} className="company-pill" style={{ color: companyColors[name] || '#1a1f3a' }}>
                  {name}
                </span>
              ))}
            </div>
            <Link to="/company-explorer" className="section-link strip-view-all">View All <ChevronRight size={14} /></Link>
          </div>

          {/* Quick Access */}
          <div className="quick-access">
            <div className="quick-access-header">
              <div>
                <div className="quick-access-title"><Sparkles size={16} /> Quick Access</div>
                <div className="quick-access-sub">Explore what you need, faster.</div>
              </div>
              <Link to="/learn" className="section-link">View All <ChevronRight size={14} /></Link>
            </div>
            <div className="quick-access-grid">
              {quickAccessItems.map(item => (
                <Link key={item.title} to={item.path} className="quick-access-card" style={{ background: item.bg }}>
                  <div className="quick-access-icon" style={{ color: item.color, background: '#ffffffb3' }}>{item.icon}</div>
                  <div className="quick-access-title-sm" style={{ color: item.color }}>{item.title}</div>
                  <div className="quick-access-desc">{item.desc}</div>
                  <ArrowRight size={15} className="quick-access-arrow" style={{ color: item.color }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="section">
        <div className="container">
          <div className="home-main-grid">
            <div className="home-left">
              {/* Private Jobs */}
              <div className="section-header">
                <h2 className="section-title">Latest Private Job Openings</h2>
                <Link to="/private-jobs" className="section-link">View All <ChevronRight size={14} /></Link>
              </div>
              <div className="exam-cards-scroll">
                {privateJobs.slice(0, 5).map(job => <JobCard key={job.id} job={job} />)}
              </div>

              {/* Salary + Company Readiness */}
              <div className="widgets-row" style={{marginTop: 40}}>
                <div className="widget-card card-flat">
                  <h3 className="widget-title">Salary Explorer</h3>
                  <p className="widget-sub">Explore salary, growth & more</p>
                  <div style={{display:'flex', gap:8}}>
                    <input className="input" placeholder="Search any job or career" style={{flex:1}} />
                    <button className="btn btn-primary">Explore</button>
                  </div>
                  <div className="salary-result">
                    <div className="salary-job-title">Software Engineer</div>
                    <div className="salary-avg">Average Salary</div>
                    <div className="salary-amount">6.5 LPA</div>
                    <div className="salary-range">Freshers: 3.5 LPA &nbsp;•&nbsp; Experienced: 15 LPA</div>
                    <div className="salary-tags">
                      <span className="badge badge-success"><TrendingUp size={11} /> Growth: High</span>
                      <span className="badge badge-primary">Job Security: High</span>
                      <span className="badge badge-yellow">⭐ Satisfaction: 4.2/5</span>
                    </div>
                  </div>
                  <Link to="/salary-explorer" className="section-link" style={{marginTop:12}}>View Detailed Report →</Link>
                </div>

                <div className="widget-card card-flat">
                  <h3 className="widget-title">Company Readiness Score</h3>
                  <p className="widget-sub">See how ready you are for top companies</p>
                  <div className="readiness-list">
                    {companies.map(c => (
                      <div key={c.id} className="readiness-item">
                        <span className="readiness-company">{c.name}</span>
                        <div className="readiness-bar-wrap">
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width: c.readinessScore+'%', background: c.color}}></div>
                          </div>
                        </div>
                        <span className="readiness-pct" style={{color: c.color}}>{c.readinessScore}%</span>
                        <span className="readiness-label" style={{color: c.color}}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/company-explorer" className="btn btn-outline btn-sm w-full" style={{justifyContent:'center',marginTop:12}}>Improve Your Skills →</Link>
                </div>
              </div>

              {/* Study Material */}
              <div className="section-header" style={{marginTop:40}}>
                <h2 className="section-title">Study Material & Resources</h2>
                <Link to="/study-material" className="section-link">Explore All Study Materials →</Link>
              </div>
              <div className="study-material-grid">
                {[
                  { icon: '📝', label: 'Interview Questions', sub: 'Company-wise Q&A', path: '/study-material', color: '#7e3af2' },
                  { icon: '📊', label: 'Mock Tests', sub: 'Practice Tests & Quizzes', path: '/study-material', color: '#0e9f6e' },
                  { icon: '📒', label: 'Notes & PDFs', sub: 'Skill-based Notes', path: '/study-material', color: '#f59e0b' },
                  { icon: '▶️', label: 'Video Lectures', sub: 'Free & Premium Videos', path: '/study-material', color: '#ef4444' },
                  { icon: '📚', label: 'E-Books', sub: 'Books for Preparation', path: '/study-material', color: '#0ea5e9' },
                  { icon: '🗺️', label: 'Roadmaps', sub: 'Skill-building Paths', path: '/roadmaps', color: '#1a56db' },
                ].map(item => (
                  <Link key={item.label} to={item.path} className="study-item card">
                    <div className="study-item-icon" style={{background: item.color + '15', color: item.color}}>{item.icon}</div>
                    <div className="study-item-label">{item.label}</div>
                    <div className="study-item-sub">{item.sub}</div>
                  </Link>
                ))}
              </div>

              {/* Popular Roadmaps */}
              <div className="section-header" style={{marginTop:40}}>
                <h2 className="section-title">Popular Roadmaps</h2>
                <Link to="/roadmaps" className="section-link">View All Roadmaps →</Link>
              </div>
              <div className="roadmaps-grid">
                {roadmaps.slice(0, 4).map(rm => (
                  <div key={rm.id} className="roadmap-card card">
                    <div className="roadmap-icon">🗺️</div>
                    <h3 className="roadmap-title">{rm.title}</h3>
                    <div className="roadmap-meta">
                      <span><Clock size={12} /> {rm.durationWeeks} Weeks Plan</span>
                      <span className={`badge ${rm.difficulty === 'HARD' ? 'badge-red' : rm.difficulty === 'MEDIUM' ? 'badge-yellow' : 'badge-success'}`}>
                        {rm.difficulty}
                      </span>
                    </div>
                    <Link to={`/roadmap/${rm.slug}`} className="roadmap-link">View Roadmap →</Link>
                  </div>
                ))}
              </div>

              {/* Success Stories */}
              <div className="section-header" style={{marginTop:40}}>
                <h2 className="section-title">Success Stories</h2>
              </div>
              <p style={{color:'var(--text-muted)',fontSize:13,marginBottom:16}}>Real stories from real achievers</p>
              <div className="success-grid">
                {successStories.map(s => (
                  <div key={s.id} className="success-card card">
                    <div className="success-avatar" style={{background: s.color}}>{s.initials}</div>
                    <div>
                      <div className="success-name">{s.name}</div>
                      <div className="success-exam">{s.exam}</div>
                      <div className="success-rank badge badge-success">{s.rank}</div>
                    </div>
                    <p className="success-quote">"{s.quote}"</p>
                  </div>
                ))}
              </div>

              {/* Why Airojgar */}
              <div className="why-section">
                <h2 className="section-title" style={{textAlign:'center',marginBottom:32}}>Why Choose Airojgar?</h2>
                <div className="why-grid">
                  {[
                    { icon: '🎯', title: 'All in One Platform', sub: 'Everything in one place' },
                    { icon: '🤖', title: 'AI Powered Guidance', sub: 'Smart AI recommendations' },
                    { icon: '📌', title: 'Personalized Roadmaps', sub: 'Tailored to your profile' },
                    { icon: '✅', title: 'Expert Content', sub: 'Verified by industry pros' },
                    { icon: '❤️', title: 'Trusted by Thousands', sub: 'Growing student community' },
                    { icon: '🆓', title: '100% Free to Get Started', sub: 'No credit card needed' },
                  ].map(w => (
                    <div key={w.title} className="why-item card">
                      <div className="why-icon">{w.icon}</div>
                      <div className="why-title">{w.title}</div>
                      <div className="why-sub">{w.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="home-right">
              <AiWidget />
              <div className="premium-sidebar card" style={{marginTop:20}}>
                <div className="premium-crown">👑</div>
                <h3>Go Premium</h3>
                <p>Unlock unlimited AI queries, premium study material & more</p>
                <ul className="premium-features-list">
                  <li><CheckCircle size={13} /> Unlimited AI conversations</li>
                  <li><CheckCircle size={13} /> Premium study material</li>
                  <li><CheckCircle size={13} /> Mock interview sessions</li>
                  <li><CheckCircle size={13} /> Ad-free experience</li>
                </ul>
                <Link to="/premium" className="btn btn-accent btn-sm w-full" style={{justifyContent:'center',marginTop:12}}>
                  Upgrade — ₹99/mo
                </Link>
              </div>
              <div className="subscribe-sidebar card-flat" style={{marginTop:20}}>
                <h3>Get Important Updates</h3>
                <p>Never miss any important job or internship alert</p>
                <div style={{display:'flex',gap:8,marginTop:12}}>
                  <input className="input" placeholder="Enter your email" style={{flex:1}} />
                  <button className="btn btn-primary btn-sm">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-grid">
            <div>
              <h2>Ready to Build Your Dream Career?</h2>
              <p>Join thousands of students who are already achieving their goals with Airojgar...</p>
              <Link to="/register" className="btn btn-accent btn-lg" style={{marginTop:20}}>
                Get Started For Free <ArrowRight size={16} />
              </Link>
            </div>
            <div className="cta-right">
              <h3>Get Important Updates</h3>
              <p>Never miss any important job or internship alert</p>
              <div className="cta-subscribe">
                <input className="input" placeholder="Enter your email" />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
