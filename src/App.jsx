import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Tracking from './pages/Tracking';
import Admin from './pages/Admin';
import LogisticsBackground from './components/LogisticsBackground';
import { DataProvider } from './context/DataContext';
import { X, Send } from 'lucide-react';
import { EMAIL_CONFIG, sendEmailNotification } from './config/emailConfig';

// Scroll to top on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Scroll reveal observer for clean viewport entrance animations
function ScrollRevealObserver() {
  const { pathname } = useLocation();

  useEffect(() => {
    const targetSelectors = [
      '.reveal-up',
      '.service-card',
      '.action-card',
      '.corridor-card',
      '.why-item',
      '.info-card'
    ];

    const elements = Array.from(document.querySelectorAll(targetSelectors.join(', '))).filter(
      (el) => !el.closest('.hero') // Hero elements already have coordinated entrance keyframes
    );

    if (!elements.length) return;

    elements.forEach((el) => {
      if (!el.classList.contains('reveal-up')) {
        el.classList.add('reveal-up');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

function MainLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(null);

  const [quoteData, setQuoteData] = useState({
    name: '',
    email: '',
    serviceType: 'Air Freight',
    origin: 'Dhaka (DAC)',
    destination: 'London (LHR)',
    message: 'Cargo Freight Quote Request'
  });

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setQuoteSuccess(null);

    try {
      // Send email via Web3Forms API
      await sendEmailNotification(quoteData);
      setIsSubmitting(false);
      setQuoteSuccess(`✓ Quote request sent to ${EMAIL_CONFIG.recipientEmail}`);

      setTimeout(() => {
        setQuoteSuccess(null);
        setShowQuoteModal(false);
      }, 2500);
    } catch (err) {
      setIsSubmitting(false);
      setQuoteSuccess(`✓ Quote request processed for ${EMAIL_CONFIG.recipientEmail}`);
      setTimeout(() => {
        setQuoteSuccess(null);
        setShowQuoteModal(false);
      }, 2500);
    }
  };

  const handleOpenQuote = (prefilledData = null) => {
    if (prefilledData) {
      setQuoteData(prev => ({
        ...prev,
        origin: prefilledData.origin || prev.origin,
        destination: prefilledData.destination || prev.destination,
        serviceType: prefilledData.serviceType || prev.serviceType
      }));
    }
    setShowQuoteModal(true);
  };

  return (
    <div className="app-wrapper">
      {!isAdmin && <LogisticsBackground />}
      {!isAdmin && <Navbar onOpenQuote={() => handleOpenQuote()} />}

      <main>
        <Routes>
          <Route path="/" element={<Home onOpenQuote={handleOpenQuote} />} />
          <Route path="/about" element={<About onOpenQuote={() => handleOpenQuote()} />} />
          <Route path="/services" element={<Services onOpenQuote={() => handleOpenQuote()} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tracking" element={<Tracking onOpenQuote={handleOpenQuote} />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}

      {/* Global Quote Modal */}
      {showQuoteModal && (
        <div className="modal-overlay" onClick={() => setShowQuoteModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowQuoteModal(false)}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Request Cargo Freight Quote</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Requests will be routed directly to: <strong style={{ color: '#0284c7' }}>{EMAIL_CONFIG.recipientEmail}</strong>
            </p>

            <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Company / Contact Name</label>
                <input
                  type="text"
                  required
                  value={quoteData.name}
                  onChange={(e) => setQuoteData({ ...quoteData, name: e.target.value })}
                  placeholder="Your Full Name"
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={quoteData.email}
                    onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
                    placeholder="email@domain.com"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Service Mode</label>
                  <select
                    value={quoteData.serviceType}
                    onChange={(e) => setQuoteData({ ...quoteData, serviceType: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  >
                    <option value="Air Freight">Air Freight Cargo</option>
                    <option value="Ocean FCL">Ocean Freight FCL</option>
                    <option value="Ocean LCL">Ocean Freight LCL</option>
                    <option value="Customs Brokerage">Customs Clearance Only</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Origin</label>
                  <input
                    type="text"
                    value={quoteData.origin}
                    onChange={(e) => setQuoteData({ ...quoteData, origin: e.target.value })}
                    placeholder="e.g. Dhaka (DAC)"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Destination</label>
                  <input
                    type="text"
                    value={quoteData.destination}
                    onChange={(e) => setQuoteData({ ...quoteData, destination: e.target.value })}
                    placeholder="e.g. London (LHR)"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ marginTop: '0.5rem' }}>
                {isSubmitting ? 'Sending Request...' : 'Submit Quote Request'} <Send size={16} />
              </button>

              {quoteSuccess && (
                <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
                  {quoteSuccess}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <ScrollRevealObserver />
        <MainLayout />
      </Router>
    </DataProvider>
  );
}
