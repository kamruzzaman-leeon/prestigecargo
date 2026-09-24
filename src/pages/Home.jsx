import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import {
  Plane, Ship, ShieldCheck, Truck, Warehouse, ArrowRight,
  Search, Sparkles, CheckCircle2, Clock, Globe, ArrowUpRight,
  Shield, Layers, Award, ChevronLeft, ChevronRight, Play, Pause,
  Building2
} from 'lucide-react';

const ICON_MAP = {
  Ship,
  Plane,
  Truck,
  Warehouse,
  ShieldCheck,
  Globe,
  Building2,
  Layers,
  Sparkles,
  Shield,
  Award
};

function resolveIcon(icon) {
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && !Array.isArray(icon))) {
    return icon;
  }
  if (typeof icon === 'string' && ICON_MAP[icon]) {
    return ICON_MAP[icon];
  }
  return Ship;
}

const HERO_SLIDES = [
  {
    id: 'ocean',
    video: '/videos/ocean_freight.mp4',
    poster: '/images/ocean_freight.png',
    icon: Ship,
    iconName: 'Ship',
    modeTag: '01 OCEAN',
    tabTitle: 'Ocean Freight',
    tabSubtitle: 'FCL & LCL Shipping',
    pill: 'GLOBAL OCEAN FREIGHT • FCL & LCL',
    headlinePrefix: 'Connecting Continents',
    headlineGradient: 'Across The Open Seas',
    desc: 'Direct vessel contracts and consolidated container freight connecting Chittagong and Mongla seaports to major international trade gateways with maximum reliability.',
    highlight: 'Chittagong & Mongla Seaports • Global Vessel Contracts',
  },
  {
    id: 'air',
    video: '/videos/air_freight.mp4',
    poster: '/images/air_freight.png',
    icon: Plane,
    iconName: 'Plane',
    modeTag: '02 AIR',
    tabTitle: 'Air Freight',
    tabSubtitle: 'Express Cargo & Charters',
    pill: 'PRIORITY AIR CARGO • CHARTERS & GOH',
    headlinePrefix: 'Time-Critical Velocity',
    headlineGradient: 'Above The Clouds',
    desc: 'Daily airline allocations, Garment on Hanger (GOH) handling, and charter solutions out of Dhaka Airport (DAC) delivering directly to tight retail calendar deadlines.',
    highlight: 'Direct Dhaka (DAC) Flights • Guaranteed Capacity & Speed',
  },
  {
    id: 'road',
    video: '/videos/road_freight.mp4',
    poster: '/images/truck_transport.png',
    icon: Truck,
    iconName: 'Truck',
    modeTag: '03 ROAD',
    tabTitle: 'Inland Transport',
    tabSubtitle: 'GPS-Tracked Van Fleet',
    pill: 'FACTORY-TO-PORT • GPS-MONITORED FLEET',
    headlinePrefix: 'Seamless Precision',
    headlineGradient: 'On Every Highway',
    desc: 'Nationwide covered vans, heavy container prime movers, and bonded intermodal transport bridging Bangladesh industrial zones and EPZs directly to port gates.',
    highlight: '64 Districts & EPZs Nationwide • 24/7 Satellite Telematics',
  },
  {
    id: 'port',
    video: '/videos/port_terminal.mp4',
    poster: '/images/warehouse_cfs.png',
    icon: Warehouse,
    iconName: 'Warehouse',
    modeTag: '04 PORT',
    tabTitle: 'Port & Customs',
    tabSubtitle: 'Licensed C&F Authority',
    pill: 'LICENSED CUSTOMS C&F • BANGLADESH',
    headlinePrefix: '24/7 Terminal Handling',
    headlineGradient: '& Fast Clearance',
    desc: 'Direct on-site customs clearance desks stationed inside Dhaka Cargo Village & Chittagong Port Authority for immediate tariff assessment and demurrage-free dispatch.',
    highlight: 'In-House Stationed Desks • Zero-Demurrage Velocity',
  },
];

const SLIDE_DURATION = 7500; // 7.5 seconds per slide

export default function Home({ onOpenQuote }) {
  const { companyInfo, heroSlides } = useDataContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef([]);

  // Dynamically resolve slides from context with fallback to default HERO_SLIDES
  const slides = useMemo(() => {
    if (heroSlides && Array.isArray(heroSlides) && heroSlides.length > 0) {
      return heroSlides;
    }
    return HERO_SLIDES;
  }, [heroSlides]);

  const activeIndex = currentSlide >= slides.length ? 0 : currentSlide;
  const activeSlide = slides[activeIndex] || slides[0] || HERO_SLIDES[0];
  const ActiveIcon = resolveIcon(activeSlide.icon || activeSlide.iconName);

  // Auto-play timer for slides
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  // Ensure active video is playing
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === activeIndex) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [activeIndex]);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="pc-home">
      {/* 1. HERO VIDEO CAROUSEL SECTION: Cinematic, Multimodal & Highly Lively */}
      <section className="pc-hero pc-hero-video-wrap" aria-label="Hero Video Carousel">
        {/* Layered Background Videos with Smooth Crossfade */}
        <div className="pc-hero-video-bg">
          {slides.map((slide, idx) => {
            const hasVideo = Boolean(slide.video);
            if (hasVideo) {
              return (
                <video
                  key={slide.id || idx}
                  ref={(el) => (videoRefs.current[idx] = el)}
                  src={slide.video}
                  poster={slide.poster || slide.image}
                  autoPlay={idx === 0}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className={`pc-hero-video-layer ${idx === activeIndex ? 'active' : ''}`}
                />
              );
            }
            return (
              <div
                key={slide.id || idx}
                className={`pc-hero-video-layer ${idx === activeIndex ? 'active' : ''}`}
                style={{
                  backgroundImage: `url(${slide.poster || slide.image || '/images/home_hero_ship.png'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            );
          })}
          {/* Deep Dark Overlay for Optimal Contrast */}
          <div className="pc-hero-video-overlay" />
          <div className="pc-hero-radial-glow" />
        </div>

        {/* Hero Content */}
        <div className="container pc-hero-container-clean">
          <div className="pc-hero-center-content" key={activeSlide.id}>
            <div className="pc-glow-pill">
              <ActiveIcon size={14} className="pc-glow-icon" />
              <span>{activeSlide.pill}</span>
            </div>

            <h1 className="pc-hero-title">
              {activeSlide.headlinePrefix}<br />
              <span className="pc-text-gradient">{activeSlide.headlineGradient}</span>
            </h1>

            <p className="pc-hero-desc">
              {activeSlide.desc}
            </p>

            <div className="pc-hero-cta-group">
              <button className="pc-btn-primary" onClick={() => onOpenQuote()}>
                Request Freight Quote <ArrowRight size={18} />
              </button>
              <Link to="/tracking" className="pc-btn-secondary">
                <Search size={16} /> Track Shipment
              </Link>
            </div>

            {/* Quick Metrics Strip */}
            <div className="pc-hero-metrics-strip">
              <div className="pc-metric-card">
                <span className="pc-metric-val">150+</span>
                <span className="pc-metric-label">Global Trade Corridors</span>
              </div>
              <div className="pc-metric-card">
                <span className="pc-metric-val">12h</span>
                <span className="pc-metric-label">Express Airport Clearance</span>
              </div>
              <div className="pc-metric-card">
                <span className="pc-metric-val">100%</span>
                <span className="pc-metric-label">Customs Compliance</span>
              </div>
              <div className="pc-metric-card">
                <span className="pc-metric-val">24/7</span>
                <span className="pc-metric-label">Cargo Monitoring</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multimodal Carousel Navigation Bar & Tabs */}
        <div className="pc-hero-carousel-bar">
          <div className="container pc-hero-tabs-wrap">
            <div className="pc-hero-tabs-grid">
              {slides.map((slide, idx) => {
                const TabIcon = resolveIcon(slide.icon || slide.iconName);
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={slide.id || idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`pc-hero-tab-btn ${isActive ? 'active' : ''}`}
                    aria-label={`Switch to ${slide.tabTitle}`}
                  >
                    {/* Animated Progress Bar on Active Tab */}
                    {isActive && (
                      <span
                        key={`bar-${activeIndex}-${isPlaying}`}
                        className={`pc-tab-progress-bar ${!isPlaying ? 'paused' : ''}`}
                        style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                      />
                    )}
                    <div className="pc-tab-body">
                      <div className="pc-tab-icon-wrap">
                        <TabIcon size={18} />
                      </div>
                      <div className="pc-tab-text">
                        <span className="pc-tab-mode">{slide.modeTag}</span>
                        <strong className="pc-tab-title">{slide.tabTitle}</strong>
                        <span className="pc-tab-sub">{slide.tabSubtitle}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Play/Pause & Arrow Navigation Controls */}
            <div className="pc-hero-controls">
              <button
                type="button"
                className="pc-ctrl-btn"
                onClick={goToPrev}
                aria-label="Previous mode"
                title="Previous mode"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="pc-ctrl-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                type="button"
                className="pc-ctrl-btn"
                onClick={goToNext}
                aria-label="Next mode"
                title="Next mode"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE CAPABILITIES: Modern Bento-Grid Cards */}
      <section className="pc-section pc-bg-light">
        <div className="container">
          <div className="pc-section-header text-center">
            <span className="pc-eyebrow">CORE CAPABILITIES</span>
            <h2 className="pc-section-title">Engineered for Speed, Security &amp; Compliance</h2>
            <p className="pc-section-subtitle">
              Comprehensive multimodal transport and licensed customs brokerage connecting Bangladesh factories to global markets.
            </p>
          </div>

          <div className="pc-bento-grid">
            {/* Card 1: Air Freight */}
            <div className="pc-bento-card">
              <div className="pc-card-img-wrap">
                <img src="/images/air_freight.png" alt="Air Freight Forwarding Bangladesh" />
                <span className="pc-img-tag">AIR FREIGHT</span>
              </div>
              <div className="pc-card-content">
                <h3 className="pc-card-title">Air Freight Forwarding</h3>
                <p className="pc-card-desc">
                  Swift cargo consolidations, express flight bookings, and direct airline charters out of Hazrat Shahjalal International Airport (DAC).
                </p>
                <ul className="pc-card-bullets">
                  <li><CheckCircle2 size={16} className="text-cyan" /> Priority buyer consolidations &amp; charters</li>
                  <li><CheckCircle2 size={16} className="text-cyan" /> Temperature-controlled pharma &amp; perishable handling</li>
                </ul>
                <Link to="/services" className="pc-card-link">
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Card 2: Ocean Freight */}
            <div className="pc-bento-card">
              <div className="pc-card-img-wrap">
                <img src="/images/ocean_freight.png" alt="Ocean Freight Forwarding FCL LCL" />
                <span className="pc-img-tag">OCEAN FREIGHT</span>
              </div>
              <div className="pc-card-content">
                <h3 className="pc-card-title">Ocean Freight (FCL / LCL)</h3>
                <p className="pc-card-desc">
                  Full container load and consolidated sea shipping via Chittagong Port (CGP) and Mongla Port with premier global vessel operators.
                </p>
                <ul className="pc-card-bullets">
                  <li><CheckCircle2 size={16} className="text-cyan" /> Direct contract rates with major shipping lines</li>
                  <li><CheckCircle2 size={16} className="text-cyan" /> Scheduled LCL consolidation &amp; CFS devanning</li>
                </ul>
                <Link to="/services" className="pc-card-link">
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Card 3: Customs Clearance */}
            <div className="pc-bento-card">
              <div className="pc-card-img-wrap">
                <img src="/images/customs_clearance.png" alt="Customs Clearing C&F Agent Bangladesh" />
                <span className="pc-img-tag">CUSTOMS C&amp;F</span>
              </div>
              <div className="pc-card-content">
                <h3 className="pc-card-title">Customs Clearance &amp; C&amp;F</h3>
                <p className="pc-card-desc">
                  Licensed C&amp;F agents delivering accurate HS code tariff classification, duty assessment, and swift physical examination release.
                </p>
                <ul className="pc-card-bullets">
                  <li><CheckCircle2 size={16} className="text-cyan" /> Dedicated clearance desks at DAC &amp; Chittagong</li>
                  <li><CheckCircle2 size={16} className="text-cyan" /> EPZ &amp; bonded warehouse documentation expertise</li>
                </ul>
                <Link to="/services" className="pc-card-link">
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Card 4: Inland Road Transport & CFS */}
            <div className="pc-bento-card">
              <div className="pc-card-img-wrap">
                <img src="/images/truck_transport.png" alt="Inland Road Transport Trucking Bangladesh" />
                <span className="pc-img-tag">ROAD TRANSPORT</span>
              </div>
              <div className="pc-card-content">
                <h3 className="pc-card-title">Inland Road Transport &amp; CFS</h3>
                <p className="pc-card-desc">
                  Nationwide covered van trucking, heavy container prime movers, and bonded warehousing connecting industrial zones to gateway ports.
                </p>
                <ul className="pc-card-bullets">
                  <li><CheckCircle2 size={16} className="text-cyan" /> GPS-monitored secure covered vehicle fleet</li>
                  <li><CheckCircle2 size={16} className="text-cyan" /> Factory pickup directly to CFS warehouse facilities</li>
                </ul>
                <Link to="/services" className="pc-card-link">
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PRESTIGE ADVANTAGE: Minimal, Sleek Value Pillars */}
      <section className="pc-section pc-bg-dark">
        <div className="container">
          <div className="pc-section-header text-center">
            <span className="pc-eyebrow pc-eyebrow-cyan">THE PRESTIGE ADVANTAGE</span>
            <h2 className="pc-section-title text-white">Why Leading Shippers Rely On Us</h2>
            <p className="pc-section-subtitle text-slate-300">
              Clear accountability, zero third-party bottlenecks, and meticulous regulatory compliance at every handover.
            </p>
          </div>

          <div className="pc-advantage-grid">
            <div className="pc-advantage-card">
              <div className="pc-icon-box">
                <ShieldCheck size={26} />
              </div>
              <h3 className="pc-adv-title">Direct On-Site Port Desks</h3>
              <p className="pc-adv-text">
                Our in-house personnel are permanently stationed inside Dhaka Airport Air Cargo Village and Chittagong Port Authority, ensuring immediate hands-on release without middlemen.
              </p>
            </div>

            <div className="pc-advantage-card">
              <div className="pc-icon-box">
                <Layers size={26} />
              </div>
              <h3 className="pc-adv-title">Unified Custody &amp; Oversight</h3>
              <p className="pc-adv-text">
                From factory loading and inland transit to export documentation, terminal customs, and overseas handover — coordinated through a single accountable operating team.
              </p>
            </div>

            <div className="pc-advantage-card">
              <div className="pc-icon-box">
                <Clock size={26} />
              </div>
              <h3 className="pc-adv-title">Demurrage-Free Velocity</h3>
              <p className="pc-adv-text">
                Pre-filing customs declarations, proactive bill of lading verification, and round-the-clock clearance coordination to protect you from costly demurrage and detention charges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SPECIALIZED INDUSTRY SECTORS */}
      <section className="pc-section pc-bg-light">
        <div className="container">
          <div className="pc-split-header">
            <div>
              <span className="pc-eyebrow">SECTOR EXPERTISE</span>
              <h2 className="pc-section-title" style={{ marginTop: '0.4rem' }}>
                Tailored for Your Industry's Operating Clock
              </h2>
            </div>
            <Link to="/services" className="pc-btn-outline-dark">
              View All Solutions <ArrowRight size={16} />
            </Link>
          </div>

          <div className="pc-industry-grid">
            {/* Sector 1 */}
            <div className="pc-industry-pill-card">
              <div className="pc-ind-header">
                <span className="pc-ind-num">01</span>
                <h4>Apparel &amp; Fashion (RMG)</h4>
              </div>
              <p>
                Garment on Hanger (GOH) containers, buyer consolidation, and express air charters designed to hit tight European and North American retail calendar cutoffs.
              </p>
            </div>

            {/* Sector 2 */}
            <div className="pc-industry-pill-card">
              <div className="pc-ind-header">
                <span className="pc-ind-num">02</span>
                <h4>Pharmaceuticals &amp; Cold Chain</h4>
              </div>
              <p>
                Temperature-validated air freight and reefer ocean boxes with continuous thermal data loggers for active pharma ingredients and medicine exports.
              </p>
            </div>

            {/* Sector 3 */}
            <div className="pc-industry-pill-card">
              <div className="pc-ind-header">
                <span className="pc-ind-num">03</span>
                <h4>Heavy Capital Machinery &amp; Projects</h4>
              </div>
              <p>
                Flat-rack, open-top, and bonded specialized heavy-haul trucking for industrial factory installations, power generation, and infrastructure equipment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MODERN MINIMALIST CTA BANNER */}
      <section className="pc-section pc-cta-section">
        <div className="container">
          <div className="pc-cta-banner">
            <div className="pc-cta-glow" />
            <div className="pc-cta-content">
              <span className="pc-eyebrow pc-eyebrow-cyan">PRESTIGE LOGISTICS HUB</span>
              <h2 className="pc-cta-title">Ready to Move Your Cargo With Certainty?</h2>
              <p className="pc-cta-desc">
                Contact our Dhaka operations team for verified flight/vessel schedules, competitive freight rates, and seamless customs brokerage.
              </p>
              <div className="pc-cta-actions">
                <button className="pc-btn-primary" onClick={() => onOpenQuote()}>
                  Request Instant Quote <ArrowRight size={18} />
                </button>
                <Link to="/contact" className="pc-btn-secondary">
                  Contact Operations Desk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
