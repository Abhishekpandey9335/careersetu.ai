import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">CS</div>
              <div>
                <div className="footer-logo-name">CareerSetu</div>
                <div className="footer-logo-tag">Your Career, Our Guidance</div>
              </div>
            </Link>
            <p className="footer-desc">India's most trusted career platform for govt exams, private jobs, internships, study material and career guidance.</p>
            <div className="footer-social">
              <a href="https://www.instagram.com/btech.wale25/?hl=en" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61591213472796" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Facebook size={18} />
              </a>
              <a href="https://www.youtube.com/@BtechWale9" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Youtube size={18} />
              </a>
            </div>
            <div className="footer-apps">
              <a href="#" className="app-badge">
                <span>▶</span>
                <div><small>GET IT ON</small><br /><strong>Google Play</strong></div>
              </a>
              <a href="#" className="app-badge">
                <span>🎁</span>
                <div><small>Download on the</small><br /><strong>App Store</strong></div>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/govt-exams">Govt Exams</Link>
            <Link to="/private-jobs">Private Jobs</Link>
            <Link to="/internships">Internships</Link>
            <Link to="/study-material">Study Material</Link>
            <Link to="/roadmaps">Roadmaps</Link>
            <Link to="/results">Results</Link>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <Link to="/study-material">Syllabus</Link>
            <Link to="/study-material">Previous Papers</Link>
            <Link to="/study-material">Mock Tests</Link>
            <Link to="/study-material">E-Books</Link>
            <Link to="/study-material">Notes & PDFs</Link>
            <Link to="/study-material">Video Lectures</Link>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/refund">Refund Policy</Link>
            <Link to="/careers">Careers</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CareerSetu. All Rights Reserved.</p>
          <p>Design and developed by Abhishek Pandey <br /> contact for creating website 9335203841</p>
        </div>
      </div>
    </footer>
  );
}