import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Lectures from './pages/Lectures';

// Pages
import Home from './pages/Home';
import PrivateJobs from './pages/PrivateJobs';
import Internships from './pages/Internships';
import LearnHub from './pages/LearnHub';
import AIAdvisor from './pages/AIAdvisor';
import Dashboard from './pages/Dashboard';
import CompanyExplorer from './pages/CompanyExplorer';
import CompanyDetail from './pages/CompanyDetail';
import SalaryExplorer from './pages/SalaryExplorer';
import Premium from './pages/Premium';
import Admin from './pages/Admin';
import { Login, Register } from './pages/Auth';
import NotFound from './pages/NotFound';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import Careers from './pages/Careers';

function Layout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public pages */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/private-jobs" element={<Layout><PrivateJobs /></Layout>} />
          <Route path="/internships" element={<Layout><Internships /></Layout>} />

          {/* LearnHub */}
          <Route path="/learn" element={<Layout><LearnHub /></Layout>} />
          <Route path="/study-material" element={<Layout><LearnHub /></Layout>} />
          <Route path="/roadmaps" element={<Layout><LearnHub /></Layout>} />
          <Route path="/roadmap/:slug" element={<Layout><LearnHub /></Layout>} />
          <Route path="/resources" element={<Layout><LearnHub /></Layout>} />

          <Route path="/company-explorer" element={<Layout><CompanyExplorer /></Layout>} />
          <Route path="/companies" element={<Layout><CompanyExplorer /></Layout>} />
          <Route path="/company/:slug" element={<Layout><CompanyDetail /></Layout>} />
          <Route path="/salary-explorer" element={<Layout><SalaryExplorer /></Layout>} />
          <Route path="/premium" element={<Layout><Premium /></Layout>} />

          {/* AI Advisor */}
          <Route path="/ai-advisor" element={<Layout><AIAdvisor /></Layout>} />

          {/* Footer pages */}
          <Route path="/about" element={<Layout><AboutUs /></Layout>} />
          <Route path="/contact" element={<Layout><ContactUs /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/terms" element={<Layout><TermsConditions /></Layout>} />
          <Route path="/refund" element={<Layout><RefundPolicy /></Layout>} />
          <Route path="/careers" element={<Layout><Careers /></Layout>} />

          {/* Protected pages */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </Layout>
            }
          />

          {/* Admin panel */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Lectures page */}
          <Route path="/lectures" element={<Layout><Lectures /></Layout>} />

          {/* Catch all */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
