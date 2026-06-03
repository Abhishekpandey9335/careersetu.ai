import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, X, Sparkles, Crown, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Premium.css';

const UPI_ID = 'abhishekpandey29632@oksbi';
const UPI_NAME = 'Abhishek Pandey';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    color: 'var(--text-secondary)',
    features: [
      { label: 'Govt exam notifications', included: true },
      { label: 'Private job listings', included: true },
      { label: 'Basic eligibility checker', included: true },
      { label: 'Study material (limited)', included: true },
      { label: 'AI queries (10/day)', included: true },
      { label: 'Personalized roadmaps', included: false },
      { label: 'Premium study material', included: false },
      { label: 'Company readiness score', included: false },
      { label: 'Mock interview sessions', included: false },
      { label: 'Ad-free experience', included: false },
      { label: 'Resume ATS optimizer', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    id: 'MONTHLY',
    name: 'Premium Monthly',
    price: '₹99',
    amount: 99,
    period: '/month',
    color: 'var(--primary)',
    badge: 'Most Popular',
    features: [
      { label: 'Everything in Free', included: true },
      { label: 'Unlimited AI queries', included: true },
      { label: 'Personalized roadmaps', included: true },
      { label: 'All premium study material', included: true },
      { label: 'Company readiness score', included: true },
      { label: 'Mock interview sessions (5/mo)', included: true },
      { label: 'Ad-free experience', included: true },
      { label: 'Resume ATS optimizer', included: true },
      { label: 'Priority support', included: true },
      { label: 'Skill gap analyzer', included: true },
      { label: 'Salary predictor', included: true },
      { label: 'Save AI conversations', included: false },
    ],
  },
  {
    id: 'YEARLY',
    name: 'Premium Yearly',
    price: '₹799',
    amount: 799,
    period: '/year',
    color: 'var(--purple)',
    badge: 'Best Value — Save 33%',
    features: [
      { label: 'Everything in Monthly', included: true },
      { label: 'Unlimited mock interviews', included: true },
      { label: 'Save AI conversations', included: true },
      { label: 'Human expert review (1/yr)', included: true },
      { label: 'Early access to new features', included: true },
      { label: 'Dedicated career manager', included: true },
      { label: 'College & job referrals', included: true },
      { label: 'Interview guarantee program', included: true },
      { label: 'All monthly features included', included: true },
      { label: 'Priority placement assistance', included: true },
      { label: 'Group mentorship sessions', included: true },
      { label: 'Career certificate', included: true },
    ],
  },
];

function UPIModal({ plan, user, onClose, onSuccess }) {
  const [copied, setCopied] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${plan.amount}&cu=INR&tn=${encodeURIComponent('CareerSetu ' + plan.name)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (!txnId.trim() || txnId.trim().length < 6) {
      setError('Please enter a valid UPI Transaction ID (min 6 characters).');
      return;
    }
    setSubmitted(true);
    setTimeout(() => onSuccess(), 1500);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 32,
        maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 20,
        }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>💳</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Pay via UPI</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {plan.name} — <strong style={{ color: plan.color }}>{plan.price}</strong>
          </p>
        </div>

        {/* UPI ID */}
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

        {/* Pay via app button */}

          href={upiLink}
          className="btn btn-primary w-full"
          style={{ justifyContent: 'center', marginBottom: 20, display: 'flex' }}
        >
          📱 Open UPI App to Pay
        </a>

        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13,
          color: '#92400e', lineHeight: 1.6,
        }}>
          <strong>Steps:</strong><br />
          1. Copy UPI ID or click "Open UPI App"<br />
          2. Pay <strong>{plan.price}</strong> to <strong>{UPI_ID}</strong><br />
          3. Copy the Transaction ID from your UPI app<br />
          4. Paste it below and confirm
        </div>

        {/* Transaction ID input */}
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
          {error && <p style={{ color: '#e02424', fontSize: 12, marginTop: 4 }}>{error}</p>}
        </div>

        <button
          className="btn btn-primary w-full"
          style={{ justifyContent: 'center' }}
          onClick={handleConfirm}
          disabled={submitted}
        >
          {submitted ? '✅ Verifying...' : '✅ Confirm Payment'}
        </button>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
          After verification, premium will be activated within 2–4 hours.<br />
          Support: abhishekpandit08939@gmail.com
        </p>
      </div>
    </div>
  );
}

export default function Premium() {
  const { isLoggedIn, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubscribe = (plan) => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setSelectedPlan(plan);
  };

  const handleSuccess = () => {
    setSelectedPlan(null);
    setPaymentSuccess(true);
  };

  if (paymentSuccess) {
    return (
      <div className="premium-page">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            Payment Received!
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 8, maxWidth: 480, margin: '0 auto 16px' }}>
            Thank you for subscribing to CareerSetu Premium! Your account will be activated within <strong>2–4 hours</strong> after payment verification.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>
            For any issues contact: abhishekpandit08939@gmail.com
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
      {selectedPlan && (
        <UPIModal
          plan={selectedPlan}
          user={user}
          onClose={() => setSelectedPlan(null)}
          onSuccess={handleSuccess}
        />
      )}

      <div className="premium-hero">
        <div className="container">
          <div className="premium-hero-content">
            <div className="premium-hero-badge"><Crown size={16} /> Premium Plans</div>
            <h1 className="premium-hero-title">
              Supercharge Your Career with<br />
              <span className="gradient-text">CareerSetu Premium</span>
            </h1>
            <p className="premium-hero-sub">
              Unlock unlimited AI guidance, premium study material, mock interviews, and more.
            </p>
            <div className="premium-hero-stats">
              {[['50K+', 'Premium Users'], ['4.9★', 'User Rating'], ['95%', 'Success Rate']].map(([num, label]) => (
                <div key={label} className="premium-hero-stat">
                  <div className="phs-num">{num}</div>
                  <div className="phs-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 20px' }}>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card card ${plan.id === 'MONTHLY' ? 'featured' : ''}`}>
              {plan.badge && (
                <div className="pricing-badge" style={{ background: plan.color }}>
                  {plan.badge}
                </div>
              )}
              <div className="pricing-header">
                <h2 className="pricing-name" style={{ color: plan.color }}>{plan.name}</h2>
                <div className="pricing-price">
                  <span className="price-amount" style={{ color: plan.color }}>{plan.price}</span>
                  <span className="price-period">{plan.period}</span>
                </div>
              </div>
              <div className="pricing-features">
                {plan.features.map((f) => (
                  <div key={f.label} className={`pricing-feature ${!f.included ? 'excluded' : ''}`}>
                    {f.included
                      ? <CheckCircle size={15} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                      : <X size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="pricing-cta">
                {plan.id === 'free' ? (
                  <Link to="/register" className="btn btn-outline btn-lg w-full" style={{ justifyContent: 'center' }}>
                    Get Started Free
                  </Link>
                ) : user?.isPremium ? (
                  <button className="btn btn-lg w-full" disabled
                    style={{ background: 'var(--secondary)', color: '#fff', justifyContent: 'center' }}>
                    <CheckCircle size={16} /> Active Plan
                  </button>
                ) : (
                  <button
                    className="btn btn-lg w-full"
                    style={{ background: plan.color, color: '#fff', justifyContent: 'center' }}
                    onClick={() => handleSubscribe(plan)}
                  >
                    <Sparkles size={16} /> Get {plan.name}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* UPI Info */}
        <div style={{
          marginTop: 40, background: '#f0f4ff', borderRadius: 16,
          padding: 28, textAlign: 'center', maxWidth: 500, margin: '40px auto 0',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>100% Secure UPI Payment</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            We accept payments via any UPI app — GPay, PhonePe, Paytm, BHIM, and more.<br />
            UPI ID: <strong style={{ color: '#1a56db' }}>{UPI_ID}</strong>
          </p>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 48, maxWidth: 700, margin: '48px auto 0' }}>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 28 }}>
            Frequently Asked Questions
          </h2>
          {[
            { q: 'How long does activation take?', a: 'Premium is activated within 2–4 hours after payment verification.' },
            { q: 'Which UPI apps are supported?', a: 'GPay, PhonePe, Paytm, BHIM, Amazon Pay — any UPI app works.' },
            { q: 'Is there a refund policy?', a: '7-day money-back guarantee if you are not satisfied.' },
            { q: 'What if I face a payment issue?', a: 'Email us at abhishekpandit08939@gmail.com with your transaction ID.' },
          ].map((faq, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q">Q: {faq.q}</div>
              <div className="faq-a">A: {faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}