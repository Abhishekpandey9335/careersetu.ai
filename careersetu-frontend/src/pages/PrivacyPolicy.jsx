export default function PrivacyPolicy() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a56db 0%, #7e3af2 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Privacy Policy</h1>
        <p style={{ opacity: 0.9 }}>Last updated: June 1, 2024</p>
      </div>
      <div className="container" style={{ padding: '48px 20px', maxWidth: 860 }}>
        {[
          { title: '1. Introduction', content: 'Welcome to CareerSetu ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website careersetu.ai and use our services. Please read this policy carefully. If you disagree with its terms, please discontinue use of our platform.' },
          { title: '2. Information We Collect', content: 'We collect information you provide directly to us such as: (a) Account Information — name, email address, phone number, and password when you register; (b) Profile Information — educational qualification, stream, skills, career interests, and location; (c) Usage Data — pages visited, features used, time spent, and interaction with content; (d) Device Information — IP address, browser type, operating system, and device identifiers; (e) Communication Data — messages sent through our contact form or support channels.' },
          { title: '3. How We Use Your Information', content: 'We use the information we collect to: provide, operate, and maintain our platform; personalize your experience and deliver AI-powered career recommendations; send you exam notifications, job alerts, and important updates; respond to your comments, questions, and requests; analyze usage patterns to improve our services; detect and prevent fraudulent activity and ensure platform security; comply with legal obligations.' },
          { title: '4. Information Sharing', content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with: (a) Service Providers — trusted third-party companies that assist us in operating our platform (hosting, analytics, email services); (b) Legal Requirements — when required by law, court order, or government authority; (c) Business Transfers — in connection with a merger, acquisition, or sale of assets, your information may be transferred. We ensure all partners maintain appropriate data protection standards.' },
          { title: '5. Data Security', content: 'We implement industry-standard security measures to protect your personal information, including SSL encryption, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.' },
          { title: '6. Cookies', content: 'We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us remember your preferences, analyze site traffic, and provide personalized content. You can control cookie settings through your browser. Disabling cookies may affect some features of our platform.' },
          { title: '7. Your Rights', content: 'You have the right to: access the personal information we hold about you; correct inaccurate or incomplete information; request deletion of your personal data; opt out of marketing communications at any time; withdraw consent where processing is based on consent. To exercise these rights, contact us at abhishekpandit08939@gmail.com.' },
          { title: '8. Children\'s Privacy', content: 'Our platform is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will promptly delete it.' },
          { title: '9. Contact Us', content: 'If you have any questions about this Privacy Policy, please contact us at: Email: abhishekpandit08939@gmail.com | Phone: +91 9335203841 | Address: Varanasi, Uttar Pradesh, India — 221001.' },
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