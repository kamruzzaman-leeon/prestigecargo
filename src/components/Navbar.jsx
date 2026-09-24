import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import { Menu, X } from 'lucide-react';

export default function Navbar({ onOpenQuote }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const { companyInfo } = useDataContext();

  const brandName = companyInfo?.name?.toUpperCase() || "PRESTIGE CARGO";
  const brandTagline = companyInfo?.tagline || "Cargo & Transport Solutions";

  const isActive = (path) => location.pathname === path;

  return (
    <>


      {/* Main Navigation */}
      <header className="header">
        <div className="container nav-container">
          <Link to="/" className="brand-logo" onClick={() => setMobileNavOpen(false)}>
            <img src="/images/logo.png" alt="Prestige Cargo Logo" />
            <div className="brand-text">
              <span className="brand-name">{brandName}</span>
              <span className="brand-tagline">{brandTagline}</span>
            </div>
          </Link>

          <nav>
            <ul className={`nav-links ${mobileNavOpen ? 'mobile-open' : ''}`}>
              <li>
                <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileNavOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setMobileNavOpen(false)}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`} onClick={() => setMobileNavOpen(false)}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/tracking" className={`nav-link ${isActive('/tracking') ? 'active' : ''}`} onClick={() => setMobileNavOpen(false)}>
                  Tracking
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => setMobileNavOpen(false)}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <button className="nav-btn-quote" onClick={onOpenQuote}>
              Get a Quote
            </button>
            <button className="mobile-toggle" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle Navigation">
              {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
