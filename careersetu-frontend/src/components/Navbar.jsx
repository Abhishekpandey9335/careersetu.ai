import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Menu, X, ChevronDown, Sparkles, LogOut, LayoutDashboard, Crown, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Govt Exams', path: '/govt-exams' },
  { label: 'Private Jobs', path: '/private-jobs' },
  { label: 'Internships', path: '/internships' },
  { label: 'Companies', path: '/companies' },
  { label: 'Strategies', path: '/learn' },
  { label: 'Lectures', path: '/lectures' },
];
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    // Also highlight "Learn" when on old URLs
    if (path === '/learn') {
      return location.pathname.startsWith('/learn')
        || location.pathname.startsWith('/study-material')
        || location.pathname.startsWith('/roadmap')
        || location.pathname.startsWith('/resources');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
       <Link to="/" className="navbar-logo">
                 <img src="/logo.png" alt="Btech Wale" className="logo-icon-img" />
                 <div className="logo-text">
                   <span className="logo-main">Btech Wale</span>
                   <span className="logo-tagline">Your Career, Our Guidance</span>
                 </div>
               </Link>

        <div className="navbar-links">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/ai-advisor" className="nav-link nav-link-ai">
            <Sparkles size={14} />
            AI Advisor
            <span className="new-badge">New</span>
          </Link>
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className={`nav-link nav-link-dashboard ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
          )}
        </div>

        <div className="navbar-right">
          <div className={`search-wrap ${searchOpen ? 'open' : ''}`}>
            {searchOpen ? (
              <form onSubmit={handleSearch} className="search-form">
                <Search size={16} className="search-icon-inner" />
                <input
                  autoFocus
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search exams, jobs, colleges..."
                  className="search-input"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="search-close">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button className="icon-btn" onClick={() => setSearchOpen(true)} title="Search">
                <Search size={18} />
              </button>
            )}
          </div>

          {isLoggedIn ? (
            <>
              <button className="icon-btn notif-btn" title="Notifications">
                <Bell size={18} />
                <span className="notif-badge">3</span>
              </button>
              <div className="user-menu-wrap">
                <button className="user-avatar-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  <div className="user-avatar">{user?.name?.[0] || 'U'}</div>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-dropdown-name">{user?.name || 'Student'}</div>
                      <div className="user-dropdown-email">{user?.email || 'student@example.com'}</div>
                    </div>
                    <Link to="/dashboard" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={15} /> My Dashboard
                    </Link>
                    <Link to="/learn" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <BookOpen size={15} /> Learn Hub
                    </Link>
                    <Link to="/premium" className="user-dropdown-item premium-item" onClick={() => setUserMenuOpen(false)}>
                      <Crown size={15} /> Upgrade to Premium
                    </Link>
                    <button className="user-dropdown-item logout-item" onClick={logout}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          <button className="icon-btn mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearch} className="mobile-search-form">
            <Search size={16} />
            <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search exams, jobs..." className="mobile-search-input" />
          </form>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link to="/ai-advisor" className="mobile-nav-link ai-link" onClick={() => setMobileOpen(false)}>
            <Sparkles size={14} /> AI Advisor
          </Link>
          {isLoggedIn && (
            <Link to="/dashboard" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          )}
          {!isLoggedIn && (
            <div className="mobile-auth">
              <Link to="/login" className="btn btn-outline" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Register Free</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
