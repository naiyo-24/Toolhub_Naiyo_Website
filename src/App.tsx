import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import ToolsDirectory from './pages/ToolsDirectory';
import Category from './pages/Category';
import ToolPage from './pages/ToolPage';
import Features from './pages/Features';
import DownloadPage from './pages/DownloadPage';
import Contact from './pages/Contact';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import DeleteAccount from './pages/DeleteAccount';
import BusinessToolLayout from './components/layout/BusinessToolLayout';
import { Navigate } from 'react-router-dom';
import { SplashScreen } from './components/layout/SplashScreen';
import WelcomeModal from './components/ui/WelcomeModal';
import { AuthProvider } from './lib/AuthContext';
import { DocuForgeProvider } from './pages/docuforge/DocuForgeContext';
import DocuForgeDashboard from './pages/docuforge/DocuForgeDashboard';
import WebScanner from './pages/docuforge/WebScanner';
import ImageEditor from './pages/docuforge/ImageEditor';
import PDFPreview from './pages/docuforge/PDFPreview';
import LoanDesk from './pages/LoanDesk';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SplashScreen />
        <WelcomeModal />
        <ScrollToTop />
        <Navbar />
        <main className="relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<ToolsDirectory />} />
            <Route path="/tools/:category" element={<Category />} />
            <Route path="/tool/:toolId" element={<ToolPage />} />
            <Route path="/business-tools" element={<Navigate to="/tools/business" replace />} />
            <Route path="/business-tools/:toolId" element={<BusinessToolLayout />} />
            <Route path="/features" element={<Features />} />
            <Route path="/loandesk" element={<LoanDesk />} />
            <Route path="/download" element={<DownloadPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/docuforge/*" element={
              <DocuForgeProvider>
                <Routes>
                  <Route path="" element={<DocuForgeDashboard />} />
                  <Route path="scan" element={<WebScanner />} />
                  <Route path="editor" element={<ImageEditor />} />
                  <Route path="preview" element={<PDFPreview />} />
                </Routes>
              </DocuForgeProvider>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}
export default App;
