export default function RefundPolicy() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a56db 0%, #7e3af2 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Refund Policy</h1>
        <p style={{ opacity: 0.9 }}>Last updated: June 1, 2024</p>
      </div>
      <div className="container" style={{ padding: '48px 20px', maxWidth: 860 }}>
        {[
          { title: '1. Overview', content: 'At CareerSetu, we strive to provide the best possible experience for our users. This Refund Policy outlines the conditions under which refunds may be issued for premium subscription purchases. Please read this policy carefully before making any purchase.' },
          { title: '2. Free Plan', content: 'CareerSetu offers a comprehensive free plan that includes access to exam notifications, job listings, basic study materials, and limited AI advisor queries. No payment is required for the free plan, and therefore no refund is applicable.' },
          { title: '3. Premium Subscription — Refund Eligibility', content: 'We offer a 7-day money-back guarantee for all new premium subscriptions. If you are not satisfied with our premium features within the first 7 days of purchase, you may request a full refund. After the 7-day period, refunds will not be issued for the current billing period. Refunds are applicable only for the first-time purchase and not for renewals.' },
          { title: '4. Non-Refundable Situations', content: 'Refunds will not be issued in the following cases: (a) Requests made after 7 days of purchase; (b) Accounts found to be in violation of our Terms & Conditions; (c) Subscription renewals; (d) Partial use of premium features during the billing period; (e) Technical issues caused by the user\'s own device or internet connection.' },
          { title: '5. How to Request a Refund', content: 'To request a refund, please contact us within 7 days of purchase: Email: abhishekpandit08939@gmail.com | Subject: Refund Request — [Your Name] | Include: Your registered email, order/transaction ID, and reason for refund. We will process your request within 5–7 business days.' },
          { title: '6. Refund Processing', content: 'Approved refunds will be credited back to the original payment method within 7–10 business days, depending on your bank or payment provider. CareerSetu is not responsible for delays caused by banking institutions. You will receive an email confirmation once your refund has been processed.' },
          { title: '7. Contact Us', content: 'For any refund-related queries, contact us at: Email: abhishekpandit08939@gmail.com | Phone: +91 9335203841 | Working Hours: Monday to Saturday, 9:00 AM – 6:00 PM IST.' },
        ].map(section => (
          <div key={section.title} className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--primary)' }}>{section.title}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: 'var(--text-muted)' }}>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}