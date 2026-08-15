import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🔍</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Page Not Found</h1>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.7 }}>
          Oops! The page you're looking for doesn't exist. It may have been moved or the URL might be incorrect.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={16} /> Go to Home
          </Link>
          <Link to="/private-jobs" className="btn btn-outline btn-lg">
            <Search size={16} /> Browse Jobs
          </Link>
        </div>
        <div style={{ marginTop: 40, padding: 20, background: 'var(--bg-gray)', borderRadius: 'var(--radius-xl)' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Quick Links</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Private Jobs', path: '/private-jobs' },
              { label: 'Internships', path: '/internships' },
              { label: 'AI Advisor', path: '/ai-advisor' },
              { label: 'Study Material', path: '/study-material' },
              { label: 'Roadmaps', path: '/roadmaps' },
              { label: 'Dashboard', path: '/dashboard' },
            ].map(link => (
              <Link key={link.path} to={link.path} className="chip">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
