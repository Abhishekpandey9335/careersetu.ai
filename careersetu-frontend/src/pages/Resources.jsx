import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, Newspaper, Gift, Calendar, Video, ExternalLink } from 'lucide-react';
import './Resources.css';

const blogPosts = [
  { id: 1, title: 'SSC CGL vs Bank PO — Which is Better in 2024?', category: 'Career Advice', date: '15 May 2024', readTime: '8 min', views: '45K' },
  { id: 2, title: 'TCS NQT Complete Preparation Guide 2024', category: 'IT Jobs', date: '12 May 2024', readTime: '12 min', views: '32K' },
  { id: 3, title: 'UPSC Preparation Strategy for Working Professionals', category: 'UPSC', date: '10 May 2024', readTime: '15 min', views: '28K' },
  { id: 4, title: 'Top 10 Government Jobs After B.Tech', category: 'Govt Jobs', date: '08 May 2024', readTime: '6 min', views: '52K' },
  { id: 5, title: 'How to Crack IBPS PO in First Attempt', category: 'Banking', date: '05 May 2024', readTime: '10 min', views: '38K' },
  { id: 6, title: 'Data Analyst vs Software Engineer — Salary & Growth', category: 'Career Advice', date: '01 May 2024', readTime: '7 min', views: '41K' },
];

const govtSchemes = [
  { title: 'PM Internship Scheme 2024', desc: 'Central govt scheme for 1 crore internships', tag: 'New' },
  { title: 'PM Kaushal Vikas Yojana 4.0', desc: 'Free skill development and certification', tag: 'Open' },
  { title: 'National Career Service Portal', desc: 'Official job portal by Ministry of Labour', tag: 'Portal' },
  { title: 'Startup India', desc: 'Funding and support for student startups', tag: 'Funding' },
];

const scholarships = [
  { name: 'National Scholarship Portal', amount: 'Up to ₹50,000', deadline: '31 Oct 2024' },
  { name: 'AICTE Pragati Scholarship', amount: '₹50,000/year', deadline: '15 Nov 2024' },
  { name: 'PM Scholarship for CAPF', amount: '₹36,000/year', deadline: '30 Sep 2024' },
  { name: 'Inspire Scholarship (DST)', amount: '₹80,000/year', deadline: '30 Nov 2024' },
];

const webinars = [
  { title: 'SSC CGL 2024 Strategy Session', date: '25 May 2024', time: '7:00 PM', speaker: 'Ranveer Singh IAS', free: true },
  { title: 'Cracking TCS Digital 2024', date: '28 May 2024', time: '6:00 PM', speaker: 'Priya Sharma (TCS)', free: true },
  { title: 'UPSC Mains Answer Writing Workshop', date: '02 Jun 2024', time: '5:00 PM', speaker: 'Vinod Kumar IAS', free: false },
  { title: 'Data Science Career Masterclass', date: '05 Jun 2024', time: '7:00 PM', speaker: 'Anil Mehta (Google)', free: false },
];

const categoryColors = {
  'Career Advice': 'var(--primary)',
  'IT Jobs': 'var(--purple)',
  'UPSC': 'var(--secondary)',
  'Govt Jobs': '#f59e0b',
  'Banking': '#0ea5e9',
};

export default function Resources() {
  return (
    <div className="resources-page">
      <div className="page-header-banner">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <ChevronRight size={12} /> <span>Resources</span></div>
          <h1 className="page-title">Resources & Career News</h1>
          <p className="page-subtitle">Stay updated with latest career news, blog posts, government schemes, scholarships & events</p>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>

        {/* Blog / Articles */}
        <div className="section-header">
          <h2 className="section-title">📝 Blog & Career Articles</h2>
          <a href="#" className="section-link">View All <ChevronRight size={14} /></a>
        </div>
        <div className="blog-grid">
          {blogPosts.map(post => (
            <div key={post.id} className="blog-card card">
              <div className="blog-meta-top">
                <span className="badge" style={{ background: (categoryColors[post.category] || 'var(--primary)') + '15', color: categoryColors[post.category] || 'var(--primary)', fontSize: 11 }}>
                  {post.category}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{post.readTime} read</span>
              </div>
              <h3 className="blog-title">{post.title}</h3>
              <div className="blog-footer">
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📅 {post.date}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>👁️ {post.views} views</span>
              </div>
              <a href="#" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>Read Article <ExternalLink size={12} /></a>
            </div>
          ))}
        </div>

        {/* 3-col section: Govt Schemes, Scholarships, Webinars */}
        <div className="resources-three-col" style={{ marginTop: 48 }}>

          {/* Govt Schemes */}
          <div>
            <div className="section-header">
              <h2 className="section-title">🏛️ Government Schemes</h2>
            </div>
            <div className="schemes-list">
              {govtSchemes.map(s => (
                <div key={s.title} className="scheme-card card">
                  <div className="scheme-header">
                    <h3 className="scheme-title">{s.title}</h3>
                    <span className={`badge ${s.tag === 'New' ? 'badge-red' : s.tag === 'Open' ? 'badge-success' : 'badge-primary'}`}>{s.tag}</span>
                  </div>
                  <p className="scheme-desc">{s.desc}</p>
                  <a href="#" className="scheme-link">Learn More →</a>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarships */}
          <div>
            <div className="section-header">
              <h2 className="section-title">🎓 Scholarships</h2>
            </div>
            <div className="scholarships-list">
              {scholarships.map(s => (
                <div key={s.name} className="scholarship-card card">
                  <div className="scholarship-icon">🎓</div>
                  <div>
                    <h3 className="scholarship-name">{s.name}</h3>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: 12 }}>
                      <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{s.amount}</span>
                      <span style={{ color: 'var(--red)' }}>Deadline: {s.deadline}</span>
                    </div>
                    <a href="#" className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>Apply Now</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webinars */}
          <div>
            <div className="section-header">
              <h2 className="section-title">🎥 Events & Webinars</h2>
            </div>
            <div className="webinars-list">
              {webinars.map(w => (
                <div key={w.title} className="webinar-card card">
                  <div className="webinar-header">
                    <span className={`badge ${w.free ? 'badge-success' : 'badge-purple'}`}>{w.free ? 'Free' : 'Paid'}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{w.date} • {w.time}</span>
                  </div>
                  <h3 className="webinar-title">{w.title}</h3>
                  <div className="webinar-speaker">
                    <div className="speaker-avatar">{w.speaker[0]}</div>
                    <span style={{ fontSize: 12 }}>{w.speaker}</span>
                  </div>
                  <button className={`btn btn-sm w-full ${w.free ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'center', marginTop: 10 }}>
                    {w.free ? 'Register Free' : 'Buy Ticket'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Career News */}
        <div style={{ marginTop: 48 }}>
          <div className="section-header">
            <h2 className="section-title">📰 Career News</h2>
          </div>
          <div className="news-list">
            {[
              { headline: 'SSC CGL 2024 Notification Released — 17,727 Vacancies', time: '2 hours ago', category: 'SSC' },
              { headline: 'IBPS PO 2024 Registration Window Opens on May 21', time: '5 hours ago', category: 'Banking' },
              { headline: 'TCS to Hire 40,000 Freshers in FY 2024-25', time: '1 day ago', category: 'IT' },
              { headline: 'Railway NTPC 2024: CBT-1 Exam Dates Announced', time: '2 days ago', category: 'Railway' },
              { headline: 'UPSC CSE 2024 Prelims Result Expected in July', time: '3 days ago', category: 'UPSC' },
            ].map((n, i) => (
              <div key={i} className="news-item card">
                <div className="news-dot"></div>
                <div style={{ flex: 1 }}>
                  <span className={`badge badge-navy`} style={{ marginBottom: 6, display: 'inline-flex' }}>{n.category}</span>
                  <p className="news-headline">{n.headline}</p>
                  <span className="news-time">{n.time}</span>
                </div>
                <a href="#" className="news-read-more">Read →</a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
