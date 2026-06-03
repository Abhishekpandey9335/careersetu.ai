import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a56db 0%, #7e3af2 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>About CareerSetu</h1>
        <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 600, margin: '0 auto' }}>India's #1 AI-Powered Career Guidance Platform — Empowering millions of students to achieve their dream careers.</p>
      </div>

      <div className="container" style={{ padding: '48px 20px' }}>
        {/* Mission */}
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: 'var(--primary)' }}>🎯 Our Mission</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)' }}>
            At CareerSetu, our mission is to bridge the gap between aspirants and their dream careers. We believe every student in India deserves access to quality career guidance, exam preparation resources, and job opportunities — regardless of their background or financial status. We are committed to providing a comprehensive, AI-powered platform that makes career planning simple, personalized, and accessible to all.
          </p>
        </div>

        {/* Vision */}
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: 'var(--primary)' }}>🔭 Our Vision</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)' }}>
            To become the most trusted career companion for every student in India — from Class 10 to Post Graduation. We envision a future where AI-driven guidance helps every aspirant make informed career decisions, prepare effectively for competitive exams, and land their dream job or government position. Our goal is to serve 100 million students by 2030.
          </p>
        </div>

        {/* What We Offer */}
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--primary)' }}>💡 What We Offer</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {[
              { icon: '🏛️', title: 'Government Job Exams', desc: 'Complete information on SSC, UPSC, Banking, Railway, Defence and all state-level exams with vacancy details, syllabus, and application links.' },
              { icon: '💼', title: 'Private Job Listings', desc: 'Curated job openings from top companies like TCS, Infosys, Wipro, Accenture, Google, Amazon and hundreds more.' },
              { icon: '🎓', title: 'Internship Opportunities', desc: 'Thousands of internship listings from startups to MNCs to help students gain real-world experience while studying.' },
              { icon: '📚', title: 'Study Material', desc: 'Free and premium study material including syllabus, previous year papers, mock tests, video lectures, notes and e-books.' },
              { icon: '🤖', title: 'AI Career Advisor', desc: 'Our intelligent AI advisor analyzes your profile and gives personalized career recommendations, exam suggestions and preparation tips.' },
              { icon: '🗺️', title: 'Career Roadmaps', desc: 'Step-by-step preparation roadmaps for all major exams and career paths, designed by toppers and industry experts.' },
            ].map(item => (
              <div key={item.title} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--primary)' }}>📊 CareerSetu in Numbers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20, textAlign: 'center' }}>
            {[
              { num: '50L+', label: 'Students Served' },
              { num: '25K+', label: 'Exam Notifications' },
              { num: '15K+', label: 'Job Listings' },
              { num: '5K+', label: 'Internships' },
              { num: '500+', label: 'Company Profiles' },
              { num: '98%', label: 'Satisfaction Rate' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{stat.num}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Founder */}
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--primary)' }}>👨‍💻 Meet the Founder</h2>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #1a56db, #7e3af2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: 'white', fontWeight: 800, flexShrink: 0 }}>AP</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Abhishek Pandey</h3>
              <p style={{ color: 'var(--primary)', fontSize: 14, marginBottom: 12 }}>Founder & CEO, CareerSetu | Varanasi, Uttar Pradesh</p>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-muted)' }}>
                Abhishek Pandey is a passionate technologist and career mentor from Varanasi, Uttar Pradesh. Having witnessed firsthand the struggles of millions of students in finding the right career guidance, he founded CareerSetu with a vision to democratize career counseling using the power of Artificial Intelligence. With deep expertise in software development and a strong understanding of India's competitive exam ecosystem, Abhishek has built CareerSetu as a one-stop solution for every career need — from government job notifications to private sector placements, AI-powered guidance to personalized roadmaps.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1a56db, #7e3af2)', borderRadius: 16, padding: 32, textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Get in Touch</h2>
          <p style={{ opacity: 0.9, marginBottom: 20 }}>Have questions or suggestions? We'd love to hear from you.</p>
          <Link to="/contact" className="btn" style={{ background: 'white', color: '#1a56db', fontWeight: 700, padding: '10px 28px', borderRadius: 8 }}>Contact Us →</Link>
        </div>
      </div>
    </div>
  );
}