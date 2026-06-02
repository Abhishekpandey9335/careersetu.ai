import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import GovtExams from './pages/GovtExams';
import ExamDetail from './pages/ExamDetail';
import PrivateJobs from './pages/PrivateJobs';
import Internships from './pages/Internships';
import StudyMaterial from './pages/StudyMaterial';
import Roadmaps from './pages/Roadmaps';
import AIAdvisor from './pages/AIAdvisor';
import Dashboard from './pages/Dashboard';
import EligibilityChecker from './pages/EligibilityChecker';
import CompanyExplorer from './pages/CompanyExplorer';
import CompanyDetail from './pages/CompanyDetail';
import SalaryExplorer from './pages/SalaryExplorer';
import Resources from './pages/Resources';
import Premium from './pages/Premium';
import { Login, Register } from './pages/Auth';
import NotFound from './pages/NotFound';

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
        <Routes>
          {/* Auth pages — no layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public pages */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/govt-exams" element={<Layout><GovtExams /></Layout>} />
          <Route path="/exam/:slug" element={<Layout><ExamDetail /></Layout>} />
          <Route path="/private-jobs" element={<Layout><PrivateJobs /></Layout>} />
          <Route path="/internships" element={<Layout><Internships /></Layout>} />
          <Route path="/study-material" element={<Layout><StudyMaterial /></Layout>} />
          <Route path="/roadmaps" element={<Layout><Roadmaps /></Layout>} />
          <Route path="/roadmap/:slug" element={<Layout><Roadmaps /></Layout>} />
          <Route path="/eligibility-checker" element={<Layout><EligibilityChecker /></Layout>} />
          <Route path="/company-explorer" element={<Layout><CompanyExplorer /></Layout>} />
          <Route path="/company/:slug" element={<Layout><CompanyDetail /></Layout>} />
          <Route path="/salary-explorer" element={<Layout><SalaryExplorer /></Layout>} />
          <Route path="/resources" element={<Layout><Resources /></Layout>} />
          <Route path="/premium" element={<Layout><Premium /></Layout>} />

          {/* AI Advisor — available to all, but requires login to chat */}
          <Route path="/ai-advisor" element={<Layout><AIAdvisor /></Layout>} />

          {/* Protected pages — require login */}
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

          {/* Catch all */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
