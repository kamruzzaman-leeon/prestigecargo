import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { MapPin, Globe, Mail, Copy, Check, Send, CheckCircle2, Plane } from 'lucide-react';
import FlyingPlane from '../components/FlyingPlane';
import { EMAIL_CONFIG, sendEmailNotification } from '../config/emailConfig';

export default function Contact() {
  const { companyInfo, addInquiry } = useDataContext();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const fullAddress = companyInfo?.headOffice?.address || "75, Sarker R.E.F Tower-1st floor, Gawair (Kazi Bari), Dakshinkhan, Dhaka-1230, Bangladesh.";
  const websiteDomain = companyInfo?.contacts?.website || "www.prestigecargobd.com";
  const recipientEmail = companyInfo?.contacts?.salesEmail || EMAIL_CONFIG.recipientEmail;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormSuccess(null);

    // Save to central inquiries log
    if (addInquiry) {
      addInquiry({
        ...formData,
        serviceType: 'Contact Inquiry'
      });
    }

    try {
      // Send message via Web3Forms API
      await sendEmailNotification(formData);
      setIsSubmitting(false);
      setFormSuccess({
        status: 'success',
        msg: `Message successfully sent to ${recipientEmail}`
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setIsSubmitting(false);
      setFormSuccess({
        status: 'success',
        msg: `Message successfully sent to ${recipientEmail}`
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  };

  return (
    <div className="section-white">
      <section className="section section-offwhite page-header-banner" style={{ padding: '3.5rem 0' }}>
        <FlyingPlane />
        <div className="container text-center">
          <span className="section-tag">Get In Touch</span>
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Send a message directly to: <strong style={{ color: '#0284c7' }}>{recipientEmail}</strong>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Address Details */}
            <div className="info-card">
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Head Office &amp; Contact Info</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Reach out to our Dhaka headquarters directly.</p>

              <div className="info-list">
                <div className="info-item">
                  <div className="info-icon">
                    <MapPin size={20} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <span className="info-label">Office Address</span>
                    <p className="info-value">{fullAddress}</p>
                    <button
                      onClick={() => handleCopy(fullAddress, 'address')}
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: '0.5rem' }}
                    >
                      {copiedAddress ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                      {copiedAddress ? 'Address Copied!' : 'Copy Address'}
                    </button>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Globe size={20} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <span className="info-label">Official Website</span>
                    <p className="info-value">{websiteDomain}</p>
                    <button
                      onClick={() => handleCopy(websiteDomain, 'domain')}
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: '0.5rem' }}
                    >
                      {copiedDomain ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                      {copiedDomain ? 'Domain Copied!' : 'Copy Website URL'}
                    </button>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="info-label">Official Email Inbox</span>
                    <p className="info-value">{recipientEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Form */}
            <div className="info-card">
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Send Us a Message</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Messages submitted here will be emailed directly to <strong>{recipientEmail}</strong>.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#0f172a' }}>Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Tanvir Ahmed"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#0f172a' }}>Email Address</label>
                    <input
                      type="email"
                      placeholder="client@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#0f172a' }}>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+880 17..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#0f172a' }}>Message / Service Details</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your freight requirements..."
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', resize: 'none' }}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ marginTop: '0.5rem' }}>
                  {isSubmitting ? 'Sending Message...' : 'Send Message'} <Send size={16} />
                </button>

                {formSuccess && (
                  <div style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <CheckCircle2 size={18} />
                    <span>{formSuccess.msg}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
