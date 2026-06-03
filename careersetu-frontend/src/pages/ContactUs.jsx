import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a56db 0%, #7e3af2 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Contact Us</h1>
        <p style={{ fontSize: 18, opacity: 0.9 }}>We're here to help. Reach out to us anytime!</p>
      </div>

      <div className="container" style={{ padding: '48px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
          {[
            { icon: <Mail size={24} />, title: 'Email Us', info: 'abhishekpandit08939@gmail.com', sub: 'We reply within 24 hours', color: '#1a56db' },
            { icon: <Phone size={24} />, title: 'Call Us', info: '+91 9335203841', sub: 'Mon–Sat, 9 AM – 6 PM IST', color: '#0e9f6e' },
            { icon: <MapPin size={24} />, title: 'Our Location', info: 'Varanasi, Uttar Pradesh', sub: 'India — 221001', color: '#7e3af2' },
            { icon: <Clock size={24} />, title: 'Working Hours', info: 'Mon – Saturday', sub: '9:00 AM – 6:00 PM IST', color: '#f59e0b' },
          ].map(item => (
            <div key={item.title} className="card" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: item.color + '15', color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{item.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontWeight: 600, color: item.color }}>{item.info}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{item.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Form */}
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: 'var(--primary)' }}>Send us a Message</h2>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)' }}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="label">Your Name *</label>
                  <input className="input" placeholder="Enter your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">Email Address *</label>
                  <input className="input" type="email" placeholder="Enter your email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">Subject *</label>
                  <select className="input select" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                    <option value="">Select Subject</option>
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                    <option>Feedback</option>
                    <option>Report an Issue</option>
                    <option>Premium Subscription</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Message *</label>
                  <textarea className="input" rows={5} placeholder="Write your message here..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{ resize: 'vertical' }} />
                </div>
                <button className="btn btn-primary" onClick={handleSubmit} style={{ justifyContent: 'center' }}>
                  <Send size={15} /> Send Message
                </button>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: 'var(--primary)' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { q: 'Is CareerSetu free to use?', a: 'Yes! CareerSetu is 100% free to get started. We offer both free and premium plans. The free plan includes access to all exam notifications, job listings, and basic study materials.' },
                { q: 'How do I get personalized career recommendations?', a: 'Simply fill in your profile details on the homepage — your qualification, stream, and interests — and our AI system will instantly generate personalized recommendations for you.' },
                { q: 'How often are job and exam notifications updated?', a: 'Our team updates job listings and exam notifications daily. We source information directly from official government and company websites to ensure accuracy.' },
                { q: 'Can I apply for jobs directly through CareerSetu?', a: 'Yes, you can click "Apply Now" on any job or exam listing and you will be redirected to the official application page of the company or recruitment board.' },
                { q: 'How do I contact support?', a: 'You can reach us via email at abhishekpandit08939@gmail.com or call us at +91 9335203841 during working hours (Mon–Sat, 9 AM – 6 PM IST).' },
              ].map((faq, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Q: {faq.q}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>A: {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}