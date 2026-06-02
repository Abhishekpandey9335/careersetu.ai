import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, X, Sparkles, Crown, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscriptionService } from '../services/services';
import './Premium.css';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

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

/** Load Razorpay script once */
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Premium() {
  const { isLoggedIn, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [processingPlan, setProcessingPlan] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubscribe = async (planId) => {
    if (!isLoggedIn) { navigate('/login'); return; }

    setProcessingPlan(planId);
    setPaymentError(null);

    try {
      // 1. Create Razorpay order on backend
      const orderRes = await subscriptionService.createOrder(planId);
      const order = orderRes.data;   // { orderId, amount, currency, keyId }

      // 2. Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Failed to load payment gateway. Check your internet connection.');

      // 3. Open Razorpay checkout
      await new Promise((resolve, reject) => {
        const options = {
          key: order.keyId || RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency || 'INR',
          name: 'CareerSetu',
          description: `${planId === 'MONTHLY' ? 'Monthly' : 'Yearly'} Premium Plan`,
          order_id: order.orderId,
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: { color: '#1a56db' },
          handler: async (response) => {
            try {
              // 4. Verify signature on backend
              await subscriptionService.verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              updateUser({ isPremium: true });
              setPaymentSuccess(true);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (res) =>
          reject(new Error(res.error?.description || 'Payment failed'))
        );
        rzp.open();
      });
    } catch (err) {
      if (err.message !== 'Payment cancelled') {
        setPaymentError(err.message);
      }
    } finally {
      setProcessingPlan(null);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="premium-page">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            Welcome to CareerSetu Premium!
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
            Your subscription is now active. Enjoy unlimited access to all premium features.
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
        {paymentError && (
          <div className="auth-error-banner" style={{ marginBottom: 24, maxWidth: 600, margin: '0 auto 24px' }}>
            ⚠️ {paymentError}
          </div>
        )}

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
                  <Link
                    to="/register"
                    className="btn btn-outline btn-lg w-full"
                    style={{ justifyContent: 'center' }}
                  >
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
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={processingPlan === plan.id}
                  >
                    <Sparkles size={16} />
                    {processingPlan === plan.id ? 'Processing...' : `Get ${plan.name}`}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 60, maxWidth: 700, margin: '60px auto 0' }}>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 28 }}>
            Frequently Asked Questions
          </h2>
          {[
            { q: 'Can I cancel my subscription anytime?', a: 'Yes — access continues until billing period ends.' },
            { q: 'Is there a refund policy?', a: '7-day money-back guarantee if you\'re not satisfied.' },
            { q: 'What payment methods are accepted?', a: 'All methods via Razorpay — UPI, cards, netbanking, wallets.' },
            { q: 'Is my payment data secure?', a: 'We never store card data. All payments are processed by Razorpay.' },
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
