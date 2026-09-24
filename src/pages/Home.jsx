import React from 'react';
import { Link } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import FlyingPlane from '../components/FlyingPlane';
import {
  Plane, Ship, Truck, ShieldCheck, MapPin, Globe, ArrowRight,
  CheckCircle2, Clock, Award, Headphones, Box, Building2, Anchor, FileCheck,
  Briefcase, Zap, Layers, BarChart3, Navigation, Sparkles
} from 'lucide-react';

export default function Home({ onOpenQuote }) {
  const { companyInfo, heroSlides, industriesList, servicesList, tradeLanes } = useDataContext();

  const [estOrigin, setEstOrigin] = React.useState('Dhaka (DAC)');
  const [estDest, setEstDest] = React.useState('Europe / UK Hubs');
  const [estService, setEstService] = React.useState('Air Freight');

  const handleQuickQuoteSubmit = (e) => {
    e.preventDefault();
    onOpenQuote({
      origin: estOrigin,
      destination: estDest,
      serviceType: estService
    });
  };

  // Editable Hero from Admin Panel (with exact original fallbacks)
  const hero = (heroSlides && heroSlides[0]) || {};
  const heroBadge = hero.tabLabel || "Licensed Freight Forwarder & Customs C&F Specialist";
  const heroTitle = hero.title || "Reliable Global Cargo & Transport Solutions";
  const heroDesc = hero.subtitle || "Prestige Cargo delivers fast, secure, and cost-effective Air Freight, Ocean Shipping, Customs Clearance, and Supply Chain management across Bangladesh and international trade lanes.";
  const heroImg = hero.image || "/images/home_hero_ship.png";
  const floatingTitle = hero.type || "Ocean & Air Cargo Lines";

  // Editable Services from Admin Panel
  const svcAir = servicesList?.find(s => s.id?.includes('air')) || {
    title: "Air Freight Forwarding",
    description: "Rapid air cargo solutions connecting Dhaka International Airport (DAC) with major trade gateways in Europe, North America, and Middle East."
  };
  const svcOcean = servicesList?.find(s => s.id?.includes('ocean')) || {
    title: "Ocean Freight (FCL/LCL)",
    description: "Cost-effective sea freight forwarding via Chittagong Port (CGP) & Mongla Port with premier global container shipping lines."
  };
  const svcCustoms = servicesList?.find(s => s.id?.includes('custom')) || {
    title: "Customs Clearance & C&F",
    description: "Seamless customs documentation, HS classification, and accelerated clearance at Dhaka Airport and Chittagong Customs House."
  };
  const svcTruck = servicesList?.find(s => s.id?.includes('truck')) || {
    title: "Inland Road Transport",
    description: "Dependable nationwide trucking network for safe container, covered van, and flatbed trailer movement across Bangladesh."
  };

  // Editable Trade Corridors from Admin Panel
  const laneEU = tradeLanes?.find(l => l.id?.includes('eu')) || {
    title: "Dhaka/Chittagong → EU & UK",
    description: "Serving London (LHR), Frankfurt (FRA), Rotterdam, & Hamburg for RMG exports and consumer goods.",
    airTransit: "2 - 4 Days",
    seaTransit: "22 - 28 Days"
  };
  const laneNA = tradeLanes?.find(l => l.id?.includes('america')) || {
    title: "Dhaka/Chittagong → USA & Canada",
    description: "Direct connections to JFK, ORD, LAX air ports and US East & West Coast seaports (New York, Savannah, LA).",
    airTransit: "3 - 5 Days",
    seaTransit: "28 - 35 Days"
  };
  const laneGCC = tradeLanes?.find(l => l.id?.includes('gcc')) || {
    title: "Dhaka → Dubai / Jebel Ali / KSA",
    description: "Daily air freight and ocean container feeder services to Dubai (DXB/Jebel Ali), Riyadh, and Jeddah.",
    airTransit: "1 - 2 Days",
    seaTransit: "10 - 14 Days"
  };
  const laneAsia = tradeLanes?.find(l => l.id?.includes('asia')) || {
    title: "China / Singapore → Bangladesh",
    description: "Fast import logistics for raw fabrics, yarn, machinery, and electronic components entering Chittagong & Dhaka.",
    airTransit: "1 - 3 Days",
    seaTransit: "7 - 12 Days"
  };

  // Editable Industries from Admin Panel
  const indRMG = industriesList?.find(i => i.id?.includes('rmg')) || {
    title: "Ready-Made Garments (RMG) & Textiles",
    overview: "Dedicated GOH (Garment on Hanger) containers, buyer consolidation, and urgent air charters to meet buyer season deadlines."
  };
  const indPharma = industriesList?.find(i => i.id?.includes('pharma')) || {
    title: "Pharmaceuticals & Healthcare",
    overview: "Cold-chain temperature-controlled air freight and reefer containers for medicine, active ingredients, and vaccines."
  };
  const indMachinery = industriesList?.find(i => i.id?.includes('machinery')) || {
    title: "Industrial Capital Machinery & Project Goods",
    overview: "Flat-rack, open-top, and heavy lift transport for factory setup equipment and infrastructure projects."
  };
  const industryImg = (industriesList && industriesList[0]?.image) || "/images/truck_transport.png";

  return (
    <div>
      {/* Hero Section */}
      <section className="hero section-white">
        {/* Animated Flying Cargo Airplane across the Hero */}
        <FlyingPlane isHero={true} />

        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <ShieldCheck size={16} />
              <span>{heroBadge}</span>
            </div>
            <h1 className="hero-title">
              {heroTitle.includes('&') ? (
                <>
                  {heroTitle.split('&')[0]} &amp; <span>{heroTitle.split('&')[1]}</span>
                </>
              ) : (
                heroTitle
              )}
            </h1>
            <p className="hero-description">
              {heroDesc}
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => onOpenQuote()}>
                Get Instant Freight Quote <ArrowRight size={18} />
              </button>
              <Link to="/about" className="btn btn-outline">
                About Our Company
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Customs Compliance</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{tradeLanes?.length ? tradeLanes.length * 35 : '150'}+</span>
                <span className="stat-label">Global Trade Corridors</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Cargo Monitoring Support</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img src={heroImg} alt="Large Ocean Container Cargo Vessel" />
            </div>
            <div className="floating-card">
              <div className="floating-icon">
                <Ship size={24} color="#0284c7" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>{floatingTitle}</strong>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Seamless Global &amp; Bangladesh Shipping</span>
              </div>
              <div className="floating-ship-wake">
                <span className="wake-wave"></span>
                <span className="wake-wave w2"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Compliance Banner */}
      <section style={{ background: '#091e42', padding: '1.25rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.06em', opacity: 0.9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={16} color="#f59e0b" />
            <span>NBR Licensed C&amp;F Agent</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="#38bdf8" />
            <span>BAFFA Compliant Partner</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plane size={16} color="#f59e0b" />
            <span>IATA Standard Air Freight Agent</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Anchor size={16} color="#38bdf8" />
            <span>Chittagong Port Authority Registered</span>
          </div>
        </div>
      </section>

      {/* Quick Rate Estimator Bar with Auto-Prefill */}
      <section className="quick-box">
        <div className="container">
          <div className="action-card" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Box size={20} color="#0284c7" /> Quick Freight Rate Estimator &amp; Cargo Inquiry
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                Select origin, destination, and service type below — your choices will automatically pre-fill your formal cargo quote request.
              </p>
            </div>

            <form onSubmit={handleQuickQuoteSubmit} className="track-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="input-group">
                <select value={estOrigin} onChange={(e) => setEstOrigin(e.target.value)}>
                  <option value="Dhaka (DAC)">Origin: Dhaka (DAC Airport)</option>
                  <option value="Chittagong (CGP)">Origin: Chittagong (CGP Port)</option>
                  <option value="Mongla Port">Origin: Mongla Port</option>
                  <option value="Benapole Land Port">Origin: Benapole Land Port</option>
                </select>
              </div>
              <div className="input-group">
                <select value={estDest} onChange={(e) => setEstDest(e.target.value)}>
                  <option value="Europe / UK Hubs">Destination: Europe / UK</option>
                  <option value="USA / Canada">Destination: USA / Canada</option>
                  <option value="Middle East (GCC)">Destination: Middle East (GCC)</option>
                  <option value="Asia Pacific">Destination: Asia Pacific</option>
                </select>
              </div>
              <div className="input-group">
                <select value={estService} onChange={(e) => setEstService(e.target.value)}>
                  <option value="Air Freight">Service: Air Cargo Express</option>
                  <option value="Ocean FCL">Service: Ocean FCL (Full Container)</option>
                  <option value="Ocean LCL">Service: Ocean LCL (Consolidation)</option>
                  <option value="Customs Brokerage">Service: Customs Clearance (C&amp;F)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Request Rate Quote <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Company Overview & Industry Role */}
      <section className="section section-offwhite" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="why-us-grid" style={{ alignItems: 'center' }}>
            <div>
              <span className="section-tag">About {companyInfo?.name || 'Prestige Cargo'}</span>
              <h2 className="section-title">Your Complete Freight &amp; Customs Partner in Bangladesh</h2>
              <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                Headquartered in Dakshinkhan, Dhaka, <strong>{companyInfo?.name || 'Prestige Cargo'}</strong> is a premier freight forwarding agency and licensed C&amp;F operator. We specialize in facilitating smooth international trade for Bangladesh’s rapidly expanding export-import sector.
              </p>
              <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                From Garment-on-Hanger (GOH) air cargo leaving Hazrat Shahjalal International Airport (DAC) to full container loads cleared at Chittagong Port Authority (CGP), our team manages end-to-end logistics with absolute compliance and zero delay.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <FileCheck size={20} color="#0284c7" style={{ marginBottom: '0.35rem' }} />
                  <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.25rem 0' }}>Customs Documentation</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Expert HS Code classification, Bill of Entry, and duty evaluation.</p>
                </div>
                <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <Anchor size={20} color="#0284c7" style={{ marginBottom: '0.35rem' }} />
                  <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.25rem 0' }}>Port &amp; Airport Handling</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Dedicated clearance desks at DAC Airport &amp; Chittagong Seaport.</p>
                </div>
              </div>

              <Link to="/about" className="btn btn-primary">
                Read Full Company Overview <ArrowRight size={16} />
              </Link>
            </div>

            <div>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                <h3 style={{ fontSize: '1.3rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <MapPin size={22} color="#0284c7" /> Bangladesh Operational Hubs
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                  Active operation desks and licensed customs clearance teams at Bangladesh's primary gateways:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a' }}>Dhaka Air Cargo Hub (DAC)</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Hazrat Shahjalal International Airport</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                      Air Freight &amp; Express
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a' }}>Chittagong Seaport (CGP)</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Chittagong Port Authority Terminal</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                      FCL &amp; LCL Container
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a' }}>Benapole &amp; Mongla Ports</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Land Border &amp; Deep Sea Terminals</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#b45309', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                      Customs &amp; Trucking
                    </span>
                  </div>
                </div>

                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Headquarters: Dakshinkhan, Dhaka</span>
                  <Link to="/contact" style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    Contact Office <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="section section-white">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Core Capabilities</span>
            <h2 className="section-title">End-to-End Freight Services</h2>
            <p className="section-subtitle">
              Comprehensive cargo solutions tailored to commercial exporters, garment manufacturers, importers, and global corporate clients.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon"><Plane size={26} /></div>
              <h3 className="service-title">{svcAir.title}</h3>
              <p className="service-desc">
                {svcAir.description}
              </p>
              <ul className="service-features">
                <li><CheckCircle2 size={15} color="#0284c7" /> Express Priority Cargo &amp; Charters</li>
                <li><CheckCircle2 size={15} color="#0284c7" /> Garment on Hanger (GOH) Logistics</li>
                <li><CheckCircle2 size={15} color="#0284c7" /> Temperature-Controlled Pharma Shipment</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon"><Ship size={26} /></div>
              <h3 className="service-title">{svcOcean.title}</h3>
              <p className="service-desc">
                {svcOcean.description}
              </p>
              <ul className="service-features">
                <li><CheckCircle2 size={15} color="#0284c7" /> Full Container Load (20ft / 40ft / High Cube)</li>
                <li><CheckCircle2 size={15} color="#0284c7" /> LCL Groupage Consolidation</li>
                <li><CheckCircle2 size={15} color="#0284c7" /> Breakbulk &amp; Heavy Lift Cargo</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon"><ShieldCheck size={26} /></div>
              <h3 className="service-title">{svcCustoms.title}</h3>
              <p className="service-desc">
                {svcCustoms.description}
              </p>
              <ul className="service-features">
                <li><CheckCircle2 size={15} color="#0284c7" /> Bill of Entry &amp; Duty Evaluation</li>
                <li><CheckCircle2 size={15} color="#0284c7" /> EPZ &amp; Bonded Facility Documentation</li>
                <li><CheckCircle2 size={15} color="#0284c7" /> Pre-shipment Inspection Support</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon"><Truck size={26} /></div>
              <h3 className="service-title">{svcTruck.title}</h3>
              <p className="service-desc">
                {svcTruck.description}
              </p>
              <ul className="service-features">
                <li><CheckCircle2 size={15} color="#0284c7" /> Container Prime Movers &amp; Covered Vans</li>
                <li><CheckCircle2 size={15} color="#0284c7" /> GPS Tracked Fleet Delivery</li>
                <li><CheckCircle2 size={15} color="#0284c7" /> Factory-to-Port Shuttles</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Major Trade Lanes Section */}
      <section className="section section-offwhite">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Global Corridors</span>
            <h2 className="section-title">Major Trade Routes &amp; Transit Schedules</h2>
            <p className="section-subtitle">
              Frequent scheduled departures connecting Bangladesh with key economic hubs worldwide.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div className="corridor-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>Europe &amp; UK Corridor</span>
                <Globe size={18} color="#0284c7" />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0f172a' }}>{laneEU.title || "Dhaka/Chittagong → EU & UK"}</h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                {laneEU.description}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                • Air Transit: {laneEU.airTransit}<br />
                • Sea Transit: {laneEU.seaTransit}
              </div>
            </div>

            <div className="corridor-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>North America Corridor</span>
                <Globe size={18} color="#16a34a" />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0f172a' }}>{laneNA.title || "Dhaka/Chittagong → USA & Canada"}</h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                {laneNA.description}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                • Air Transit: {laneNA.airTransit}<br />
                • Sea Transit: {laneNA.seaTransit}
              </div>
            </div>

            <div className="corridor-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, background: '#fef3c7', color: '#b45309', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>Middle East (GCC)</span>
                <Globe size={18} color="#d97706" />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0f172a' }}>{laneGCC.title || "Dhaka → Dubai / Jebel Ali / KSA"}</h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                {laneGCC.description}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                • Air Transit: {laneGCC.airTransit}<br />
                • Sea Transit: {laneGCC.seaTransit}
              </div>
            </div>

            <div className="corridor-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, background: '#f3e8ff', color: '#6b21a8', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>Intra-Asia Route</span>
                <Globe size={18} color="#9333ea" />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0f172a' }}>{laneAsia.title || "China / Singapore → Bangladesh"}</h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                {laneAsia.description}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                • Air Transit: {laneAsia.airTransit}<br />
                • Sea Transit: {laneAsia.seaTransit}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Served Section */}
      <section className="section section-white">
        <div className="container">
          <div className="why-us-grid" style={{ alignItems: 'center' }}>
            <div>
              <span className="section-tag">Industry Verticals</span>
              <h2 className="section-title">Specialized Industry Freight Solutions</h2>
              <p style={{ color: '#475569', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                Different industries require tailored supply chain handling. Prestige Cargo provides custom equipment and handling standards for key Bangladesh business sectors:
              </p>

              <div className="why-features">
                <div className="why-item">
                  <div className="why-icon"><Briefcase size={22} /></div>
                  <div className="why-content">
                    <h4>{indRMG.title}</h4>
                    <p>{indRMG.overview}</p>
                  </div>
                </div>

                <div className="why-item">
                  <div className="why-icon"><Zap size={22} /></div>
                  <div className="why-content">
                    <h4>{indPharma.title}</h4>
                    <p>{indPharma.overview}</p>
                  </div>
                </div>

                <div className="why-item">
                  <div className="why-icon"><Layers size={22} /></div>
                  <div className="why-content">
                    <h4>{indMachinery.title}</h4>
                    <p>{indMachinery.overview}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)' }}>
                <img
                  src={industryImg}
                  alt="Inland Container Truck Cargo Bangladesh"
                  style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
