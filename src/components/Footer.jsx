import React from 'react';
import { Link } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';

export default function Footer() {
  const { companyInfo } = useDataContext();

  const fullAddress = companyInfo?.headOffice?.address || "75, Sarker R.E.F Tower-1st floor, Gawair (Kazi Bari), Dakshinkhan, Dhaka-1230, Bangladesh.";
  const websiteDomain = companyInfo?.contacts?.website || "www.prestigecargobd.com";
  const brandName = companyInfo?.name?.toUpperCase() || "PRESTIGE CARGO";
  const brandTagline = companyInfo?.tagline?.toUpperCase() || "CARGO & TRANSPORT SOLUTION";

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" style={{ textDecoration: 'none' }} className="footer-logo">
              <div className="footer-logo-badge">
                <img src="/images/logo.png" alt="Prestige Cargo" />
              </div>
              <div>
                <span className="footer-brand-name">{brandName}</span>
                <span className="footer-brand-tagline">{brandTagline}</span>
              </div>
            </Link>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8', marginTop: '0.5rem' }}>
              Providing dependable freight forwarding, air &amp; ocean transport, and customs clearance services across Bangladesh and global trade lanes.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">
              <li><Link to="/services">Air Freight Forwarding</Link></li>
              <li><Link to="/services">Ocean Freight (FCL/LCL)</Link></li>
              <li><Link to="/services">Customs Clearance &amp; C&amp;F</Link></li>
              <li><Link to="/services">Inland Road Transport</Link></li>
              <li><Link to="/services">Warehousing &amp; CFS Storage</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Head Office Location</h4>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: '#cbd5e1', marginBottom: '1rem' }}>
              {fullAddress}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#0284c7', fontWeight: 600 }}>
              {websiteDomain}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {companyInfo?.name || 'Prestige Cargo'}. All Rights Reserved.</p>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <span>Designed for Prestige Cargo BD</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <Link to="/admin" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
              Admin Portal →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
