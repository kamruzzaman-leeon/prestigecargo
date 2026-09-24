import React from 'react';
import { useDataContext } from '../context/DataContext';
import {
  Award, ShieldCheck, Globe, CheckCircle2, ArrowRight,
  Plane, Truck, FileCheck, Anchor
} from 'lucide-react';
import FlyingPlane from '../components/FlyingPlane';

export default function About({ onOpenQuote }) {
  const { companyInfo } = useDataContext();

  const established = companyInfo?.establishedYear || "2015";
  const companyName = companyInfo?.name || "Prestige Cargo";

  const milestones = [
    { year: established, title: "Establishment in Dhaka", desc: "Founded in Dakshinkhan, Dhaka, specializing in customs C&F documentation for air cargo." },
    { year: "2018", title: "Chittagong Port Expansion", desc: "Established dedicated sea port clearance desk at Chittagong Port Authority (CGP)." },
    { year: "2021", title: "Global Freight Network", desc: "Partnered with premier international ocean lines and major air cargo carriers." },
    { year: "2024+", title: "Digital Operations & Cold Chain", desc: "Introduced express tracking, pharmaceutical cold chain handling, and EPZ bonded carrier solutions." }
  ];

  return (
    <div className="section-white">
      {/* Header */}
      <section className="section section-offwhite page-header-banner" style={{ padding: '3.5rem 0' }}>
        <FlyingPlane />
        <div className="container text-center">
          <span className="section-tag">About {companyName}</span>
          <h1 className="section-title">Who We Are &amp; Our Legacy</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Licensed Freight Forwarding Agency &amp; Customs Clearing (C&amp;F) Specialist in Bangladesh.
          </p>
        </div>
      </section>

      {/* Main Company Story */}
      <section className="section">
        <div className="container">
          <div className="why-us-grid" style={{ marginBottom: '4rem', alignItems: 'center' }}>
            <div>
              <span className="section-tag">Company Background</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem', color: '#0f172a' }}>
                Empowering Bangladesh Trade &amp; Global Supply Chains
              </h2>
              <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '1rem' }}>
                <strong>{companyName} BD</strong> is a modern, fully compliant logistics service provider based in Gawair (Kazi Bari), Dakshinkhan, Dhaka. We serve as a vital link for manufacturers, ready-made garment (RMG) exporters, commercial importers, and international corporate traders across Bangladesh.
              </p>
              <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Our core expertise spans <strong>Air Cargo Forwarding</strong> from Hazrat Shahjalal International Airport (DAC), <strong>Ocean Container Shipping</strong> via Chittagong Port Authority (CGP) &amp; Mongla Port, <strong>Licensed Customs Clearance (C&amp;F)</strong>, and <strong>Nationwide Container Trucking</strong>.
              </p>

              <ul className="service-features" style={{ marginBottom: '2rem' }}>
                <li><CheckCircle2 size={18} color="#0284c7" /> NBR Licensed Clearing &amp; Forwarding (C&amp;F) Agent</li>
                <li><CheckCircle2 size={18} color="#0284c7" /> Direct Chittagong Port &amp; Dhaka Airport Customs Desks</li>
                <li><CheckCircle2 size={18} color="#0284c7" /> EPZ &amp; Bonded Facility Transportation</li>
                <li><CheckCircle2 size={18} color="#0284c7" /> End-to-End Export &amp; Import Tariff Advisory</li>
              </ul>

              <button className="btn btn-primary" onClick={onOpenQuote}>
                Request Rate Quote <ArrowRight size={16} />
              </button>
            </div>
            <div>
              <img
                src="/images/about_company.png"
                alt="Prestige Cargo Corporate Headquarters Dhaka"
                style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.08)' }}
              />
            </div>
          </div>

          {/* Milestones & Timeline */}
          <div style={{ marginBottom: '4rem' }}>
            <div className="text-center" style={{ marginBottom: '3rem' }}>
              <span className="section-tag">Our Journey</span>
              <h2 className="section-title">Milestones &amp; Key Achievements</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {milestones.map((m, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7', display: 'block', marginBottom: '0.5rem' }}>{m.year}</span>
                  <h4 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.5rem' }}>{m.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Focus Breakdown */}
          <div style={{ marginBottom: '4rem' }}>
            <div className="text-center" style={{ marginBottom: '2.5rem' }}>
              <span className="section-tag">Our Field of Expertise</span>
              <h2 className="section-title">What We Do in the Logistics Sector</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Plane size={32} color="#0284c7" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>1. Air Cargo Forwarding</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                  Managing high-priority export &amp; import air shipments out of Hazrat Shahjalal International Airport (DAC). We handle air consolidations, perishable cargo, and garment buyer sample deliveries.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Anchor size={32} color="#0284c7" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>2. Ocean Freight (FCL / LCL)</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                  Full Container Load (FCL) and Less than Container Load (LCL) forwarding via Chittagong Port (CGP) &amp; Mongla Port. Partnered with major global ocean shipping lines for seamless international transit.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <FileCheck size={32} color="#0284c7" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>3. Customs Clearing &amp; C&amp;F</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                  Complete assistance with customs house documentation, Bill of Entry filing, HS Code tariff verification, and physical inspection handling at air cargo and sea port customs terminals.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Truck size={32} color="#0284c7" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>4. Inland Road Transport</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                  Operating a fleet of covered vans, prime movers, and trailers for factory-to-port and warehouse deliveries across EPZ zones and major industrial hubs in Bangladesh.
                </p>
              </div>
            </div>
          </div>

          {/* Key Value Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <div className="info-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <Award size={36} color="#0284c7" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Proven Reliability</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Consistently delivering cargo according to schedule with strict compliance.</p>
            </div>

            <div className="info-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <ShieldCheck size={36} color="#0284c7" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Licensed C&amp;F Operations</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Full handling of customs clearance at Dhaka airport and Chittagong seaport.</p>
            </div>

            <div className="info-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <Globe size={36} color="#0284c7" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Global Partner Network</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Connecting Bangladesh exporters with major trade routes in Europe, Americas, &amp; Asia.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
