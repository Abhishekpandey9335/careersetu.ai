import { Link } from 'react-router-dom';

export default function Careers() {
  const openings = [
    { title: 'Frontend Developer (React.js)', type: 'Full-time', location: 'Remote / Varanasi', exp: '1–3 years', skills: ['React.js', 'Tailwind CSS', 'JavaScript', 'REST APIs'], desc: 'Build and maintain beautiful, responsive UI components for CareerSetu platform. Work closely with the design and backend teams.' },
    { title: 'Backend Developer (Spring Boot)', type: 'Full-time', location: 'Remote / Varanasi', exp: '1–3 years', skills: ['Java', 'Spring Boot', 'PostgreSQL', 'REST APIs'], desc: 'Develop robust backend APIs, manage database schema, and ensure platform scalability and performance.' },
    { title: 'Content Writer (Career & Education)', type: 'Part-time / Freelance', location: 'Remote', exp: '0–2 years', skills: ['Content Writing', 'SEO', 'Research', 'Hindi/English'], desc: 'Write engaging articles, exam guides, career advice blogs, and study material for millions of students.' },
    { title: 'Social Media Manager', type: 'Part-time', location: 'Remote', exp: '0–1 year', skills: ['Instagram', 'YouTube', 'Canva', 'Content Creation'], desc: 'Manage CareerSetu\'s social media presence, create engaging content, and grow our student community.' },
    { title: 'AI/ML Engineer', type: 'Full-time', location: 'Remote', exp: '2–4 years', skills: ['Python', 'NLP', 'Machine Learning', 'LLMs'], desc: 'Build and improve our AI Career Advisor, recommendation engine, and personalization features.' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a56db 0%, #7e3af2 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Careers at CareerSetu</h1>
        <p style={{ fontSize: 18, opacity: 0.9 }}>Join our mission to empower millions of students across India 🚀</p>
      </div>

      <div className="container" style={{ padding: '48px 20px' }}>
        {/* Why Join */}
        <div className="card" style={{ padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: 'var(--primary)' }}>Why Join CareerSetu?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: '🚀', title: 'High Impact Work', desc: 'Your work will directly impact millions of students\' lives and career journeys.' },
              { icon: '🏠', title: 'Remote Friendly', desc: 'Work from anywhere in India. We believe in flexibility and work-life balance.' },
              { icon: '📈', title: 'Fast Growth', desc: 'Early-stage startup — grow fast, take ownership, and build your career with us.' },
              { icon: '🤝', title: 'Great Team', desc: 'Work with passionate, talented people who care about education and technology.' },
              { icon: '💰', title: 'Competitive Pay', desc: 'Market-competitive salaries with performance bonuses and equity options.' },
              { icon: '🎓', title: 'Learning Culture', desc: 'Access to premium courses, conferences, and continuous learning opportunities.' },
            ].map(item => (
              <div key={item.title} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 18, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: 'var(--primary)' }}>Current Openings ({openings.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {openings.map(job => (
            <div key={job.title} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">{job.type}</span>
                    <span className="badge badge-yellow">📍 {job.location}</span>
                    <span className="badge badge-success">💼 {job.exp}</span>
                  </div>
                </div>
                <a href={`mailto:abhishekpandit08939@gmail.com?subject=Application for ${job.title}`} className="btn btn-primary btn-sm">Apply Now</a>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 12 }}>{job.desc}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {job.skills.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Apply CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1a56db, #7e3af2)', borderRadius: 16, padding: 32, textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Don't see a role for you?</h2>
          <p style={{ opacity: 0.9, marginBottom: 20 }}>Send us your resume and we'll reach out when a suitable position opens up.</p>
          <a href="mailto:abhishekpandit08939@gmail.com?subject=General Application - CareerSetu" className="btn" style={{ background: 'white', color: '#1a56db', fontWeight: 700, padding: '10px 28px', borderRadius: 8 }}>Send Resume →</a>
        </div>
      </div>
    </div>
  );
}