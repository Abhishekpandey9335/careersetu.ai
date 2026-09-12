import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, Check, Video, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Premium.css';

const UPI_ID = 'abhishekpandey29632@oksbi';
const UPI_NAME = 'Abhishek Pandey';
const API_URL = import.meta.env.VITE_API_URL || 'https://careersetu-ai-2.onrender.com/api';

const interviewTypes = [
  { id: 'FRONTEND_DEVELOPER', name: 'Frontend Developer', amount: 49, price: '₹49' },
  { id: 'BACKEND_DEVELOPER', name: 'Backend Developer', amount: 69, price: '₹69' },
  { id: 'FULL_STACK_DEVELOPER', name: 'Full Stack Developer', amount: 99, price: '₹99' },
  { id: 'AI_ML_INTERVIEW', name: 'AI & ML Interview', amount: 99, price: '₹99' },
  { id: 'ML_ENGINEER', name: 'ML Engineer', amount: 99, price: '₹99' },
  { id: 'GEN_AI_DEVELOPER', name: 'Gen AI Developer', amount: 99, price: '₹99' },
  { id: 'SYSTEM_DESIGN_ENGINEER', name: 'System Design Engineer', amount: 99, price: '₹99' },
  { id: 'FULL_STACK_AI_ML_INTERVIEW', name: 'Full Stack + AI/ML Interview', amount: 129, price: '₹129' },
];

function UPIModal({ interview, onClose, onSuccess }) {
  const [copied, setCopied] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${interview.amount}&cu=INR&tn=${encodeURIComponent('Ai Rojgar Mock Interview - ' + interview.name)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshot = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result);
    reader.readAsDataURL(file);
  };

  const handleConfirm = async () => {
    if (!txnId.trim() || txnId.trim().length < 6) {
      setError('Please enter a valid UPI Transaction ID (min 6 characters).');
      return;
    }
    setSubmitted(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/interview-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          interviewType: interview.id,
          transactionId: txnId.trim(),
          screenshotUrl: screenshot || '',
        }),
      });

      if (!res.ok) throw new Error('Failed');
      onSuccess();
    } catch {
      setError('Something went wrong. Please try again or contact support.');
      setSubmitted(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, overflowY: 'auto',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 32,
        maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        position: 'relative', margin: 'auto',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 20,
        }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎤</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Book Mock Interview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {interview.name} — <strong style={{ color: '#1a56db' }}>{interview.price}</strong>
          </p>
        </div>

        <div style={{
          background: '#f0f4ff', border: '2px dashed #1a56db',
          borderRadius: 12, padding: '16px 20px', marginBottom: 16, textAlign: 'center',
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>UPI ID</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1a56db', letterSpacing: 1 }}>{UPI_ID}</div>
          <button onClick={handleCopy} className="btn btn-outline btn-sm" style={{ marginTop: 10 }}>
            {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy UPI ID</>}
          </button>
        </div>

        <button
          onClick={() => { window.location.href = upiLink; }}
          className="btn btn-primary w-full"
          style={{ justifyContent: 'center', marginBottom: 20 }}
        >
          📱 Open UPI App to Pay
        </button>

        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          fontSize: 13, color: '#92400e', lineHeight: 1.6,
        }}>
          <strong>Steps:</strong><br />
          1. Copy UPI ID or click "Open UPI App"<br />
          2. Pay <strong>{interview.price}</strong> to <strong>{UPI_ID}</strong><br />
          3. Copy the Transaction ID from your UPI app<br />
          4. Upload screenshot & paste Transaction ID below<br />
          5. We'll schedule your Google Meet interview within 1 week
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>
            UPI Transaction ID *
          </label>
          <input
            className="input"
            placeholder="e.g. 123456789012"
            value={txnId}
            onChange={e => { setTxnId(e.target.value); setError(''); }}
            style={{ fontSize: 15 }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>
            Payment Screenshot *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleScreenshot}
            style={{
              display: 'block', width: '100%', padding: '8px 12px',
              border: '1px solid var(--border)', borderRadius: 8,
              fontSize: 13, cursor: 'pointer',
            }}
          />
          {screenshot && (
            <div style={{ marginTop: 8, textAlign: 'center' }}>
              <img src={screenshot} alt="screenshot" style={{
                maxWidth: '100%', maxHeight: 120, borderRadius: 8,
                border: '1px solid var(--border)',
              }} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                ✅ Screenshot attached
              </div>
            </div>
          )}
        </div>

        {error && (
          <p style={{ color: '#e02424', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
            {error}
          </p>
        )}

        <button
          className="btn btn-primary w-full"
          style={{ justifyContent: 'center' }}
          onClick={handleConfirm}
          disabled={submitted}
        >
          {submitted ? '⏳ Submitting...' : '✅ Confirm Booking'}
        </button>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
          After verification, we'll schedule your interview within 1 week.<br />
          Support: airojgar8@gmail.com
        </p>
      </div>
    </div>
  );
}

export default function MockInterview() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBook = (interview) => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setSelected(interview);
  };

  const handleSuccess = () => {
    setSelected(null);
    setBookingSuccess(true);
  };

  if (bookingSuccess) {
    return (
      <div className="premium-page">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Booking Received!</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 16px' }}>
            We'll verify your payment and schedule your mock interview with a Google Meet link within{' '}
            <strong>1 week</strong>. You'll get an email confirmation with the date and link.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>
            For any issues contact: airojgar8@gmail.com
          </p>
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Go to Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-page">
      {selected && (
        <UPIModal
          interview={selected}
          onClose={() => setSelected(null)}
          onSuccess={handleSuccess}
        />
      )}

      <div className="premium-hero">
        <div className="container">
          <div className="premium-hero-content">
            <div className="premium-hero-badge"><Video size={16} /> 1:1 Mock Interviews</div>
            <h1 className="premium-hero-title">
              Practice with a Real<br />
              <span className="gradient-text">1:1 Mock Interview</span>
            </h1>
            <p className="premium-hero-sub">
              Live Google Meet interview with personal feedback and a strategy to crack your next real interview.
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 20px' }}>
        <div className="pricing-grid">
          {interviewTypes.map((iv) => (
            <div key={iv.id} className="pricing-card card">
              <div className="pricing-header">
                <h2 className="pricing-name" style={{ color: '#1a56db' }}>{iv.name}</h2>
                <div className="pricing-price">
                  <span className="price-amount" style={{ color: '#1a56db' }}>{iv.price}</span>
                </div>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <Video size={15} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                  <span>Live 1:1 Google Meet interview</span>
                </div>
                <div className="pricing-feature">
                  <Clock size={15} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                  <span>Scheduled within 1 week</span>
                </div>
                <div className="pricing-feature">
                  <Check size={15} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                  <span>Personalized feedback & strategy</span>
                </div>
              </div>
              <div className="pricing-cta">
                <button
                  className="btn btn-lg w-full"
                  style={{ background: '#1a56db', color: '#fff', justifyContent: 'center' }}
                  onClick={() => handleBook(iv)}
                >
                  Book Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}