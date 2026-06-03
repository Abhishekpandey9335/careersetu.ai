export default function TermsConditions() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a56db 0%, #7e3af2 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Terms & Conditions</h1>
        <p style={{ opacity: 0.9 }}>Last updated: June 1, 2024</p>
      </div>
      <div className="container" style={{ padding: '48px 20px', maxWidth: 860 }}>
        {[
          { title: '1. Acceptance of Terms', content: 'By accessing and using CareerSetu ("Platform"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform. We reserve the right to modify these terms at any time, and your continued use of the platform constitutes acceptance of any changes.' },
          { title: '2. Use of the Platform', content: 'CareerSetu grants you a limited, non-exclusive, non-transferable license to access and use our platform for personal, non-commercial purposes. You agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of others. You must not: attempt to gain unauthorized access to any part of the platform; use automated tools to scrape or extract data; post false, misleading, or harmful content; impersonate any person or entity.' },
          { title: '3. User Accounts', content: 'To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account. CareerSetu reserves the right to terminate accounts that violate these terms.' },
          { title: '4. Intellectual Property', content: 'All content on CareerSetu — including text, graphics, logos, images, study materials, and software — is the property of CareerSetu or its content suppliers and is protected by Indian and international copyright laws. You may not reproduce, distribute, or create derivative works without our explicit written permission.' },
          { title: '5. Premium Services', content: 'CareerSetu offers premium subscription plans with additional features. By subscribing to a premium plan, you agree to pay the applicable fees. Subscription fees are billed monthly or annually as selected. Premium features may change over time. We will notify you of significant changes to premium offerings.' },
          { title: '6. Disclaimer of Warranties', content: 'CareerSetu provides the platform on an "as is" and "as available" basis without warranties of any kind. We do not warrant that the platform will be uninterrupted, error-free, or free of viruses. Job listings and exam information are sourced from official channels but may occasionally be outdated. Users should verify information from official sources before making decisions.' },
          { title: '7. Limitation of Liability', content: 'CareerSetu shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. Our total liability for any claims shall not exceed the amount you paid to us in the preceding 12 months. We are not responsible for third-party websites linked from our platform.' },
          { title: '8. Governing Law', content: 'These Terms shall be governed by the laws of India. Any disputes shall be resolved in the courts of Varanasi, Uttar Pradesh, India. If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.' },
          { title: '9. Contact', content: 'For questions about these Terms, contact us at: Email: abhishekpandit08939@gmail.com | Phone: +91 9335203841 | Address: Varanasi, Uttar Pradesh, India.' },
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