import React from 'react';
import { Link } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import {
  FileText, MapPin, Box, Headphones, CheckCircle2, ArrowRight,
  ShieldCheck, Globe, Clock, Award
} from 'lucide-react';

export default function Home({ onOpenQuote }) {
  const { companyInfo, industriesList, servicesList } = useDataContext();

  return (
    <div className="eur-home">
      {/* 1. Full-Width Hero Section */}
      <section className="eur-hero">
        <div className="eur-hero-bg" style={{ backgroundImage: "url('/images/home_hero_ship.png')" }}>
          <div className="eur-hero-overlay" />
        </div>

        <div className="container eur-hero-content">
          <div className="eur-hero-badge">
            <span className="badge-dot" />
            <span>LICENSED FREIGHT FORWARDER &amp; CUSTOMS C&amp;F • BANGLADESH</span>
          </div>

          <h1 className="eur-hero-title">
            CONNECTING MARKETS.<br />
            MOVING POSSIBILITIES.
          </h1>

          <p className="eur-hero-desc">
            From factory pickup to international handover, Prestige Cargo coordinates air freight,
            ocean shipping, customs clearance, and inland transport through one accountable Bangladesh team.
          </p>

          <div className="eur-hero-actions">
            <button className="btn-eur-red" onClick={() => onOpenQuote()}>
              REQUEST A QUOTE <ArrowRight size={18} />
            </button>
            <Link to="/services" className="btn-eur-outline">
              OUR SERVICES
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="eur-hero-stats">
            <div className="eur-stat">
              <span className="eur-stat-num">100%</span>
              <span className="eur-stat-label">Customs Compliance</span>
            </div>
            <div className="eur-stat">
              <span className="eur-stat-num">150+</span>
              <span className="eur-stat-label">Global Trade Corridors</span>
            </div>
            <div className="eur-stat">
              <span className="eur-stat-num">24/7</span>
              <span className="eur-stat-label">Cargo Monitoring</span>
            </div>
            <div className="eur-stat">
              <span className="eur-stat-num">10+</span>
              <span className="eur-stat-label">Years Trusted Legacy</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Actions Section */}
      <section className="eur-section eur-bg-soft">
        <div className="container">
          <div className="eur-section-header text-center">
            <span className="eur-tag-red">QUICK ACTIONS</span>
            <h2 className="eur-section-title">How Can We Help You Today?</h2>
            <p className="eur-section-subtitle">
              Select an option below to jump directly to the service or tool you need.
            </p>
          </div>

          <div className="eur-actions-grid">
            {/* Card 1 */}
            <div className="eur-action-card" onClick={() => onOpenQuote()}>
              <div className="eur-action-icon">
                <FileText size={22} color="#0066cc" />
              </div>
              <h3 className="eur-card-title">Request a Quote</h3>
              <p className="eur-card-text">
                Compare modes, routing, and get competitive freight pricing for your next export or import shipment.
              </p>
              <span className="eur-card-link">
                GET STARTED <ArrowRight size={15} />
              </span>
            </div>

            {/* Card 2 */}
            <Link to="/tracking" className="eur-action-card">
              <div className="eur-action-icon">
                <MapPin size={22} color="#0066cc" />
              </div>
              <h3 className="eur-card-title">Track Cargo</h3>
              <p className="eur-card-text">
                Access real-time milestone status of your active air waybills and ocean container bookings.
              </p>
              <span className="eur-card-link">
                TRACK NOW <ArrowRight size={15} />
              </span>
            </Link>

            {/* Card 3 */}
            <Link to="/services" className="eur-action-card">
              <div className="eur-action-icon">
                <Box size={22} color="#0066cc" />
              </div>
              <h3 className="eur-card-title">Specialist Solutions</h3>
              <p className="eur-card-text">
                Explore our GOH garment consolidation, cold-chain pharma handling, and project machinery solutions.
              </p>
              <span className="eur-card-link">
                EXPLORE <ArrowRight size={15} />
              </span>
            </Link>

            {/* Card 4 */}
            <Link to="/contact" className="eur-action-card">
              <div className="eur-action-icon">
                <Headphones size={22} color="#0066cc" />
              </div>
              <h3 className="eur-card-title">Contact Team</h3>
              <p className="eur-card-text">
                Route an enquiry directly to our Dhaka headquarters, airport desk, or Chittagong port operations.
              </p>
              <span className="eur-card-link">
                CONTACT US <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. One Team Across The Critical Handovers (Navy Section) */}
      <section className="eur-navy-section">
        <div className="container">
          <div className="eur-handovers-grid">
            <div className="eur-handovers-content">
              <h2 className="eur-navy-title">One Team Across The Critical Handovers</h2>
              <p className="eur-navy-text">
                Freight rarely fails in the middle of a flight or sailing. Risk builds between factory,
                documents, gateway, handling facility and carrier. Prestige Cargo coordinates those
                handovers as one single, accountable operating plan.
              </p>

              <div className="eur-check-grid">
                <div className="eur-check-pill">
                  <CheckCircle2 size={18} color="#22c55e" className="flex-shrink-0" />
                  <span>Origin and factory coordination</span>
                </div>
                <div className="eur-check-pill">
                  <CheckCircle2 size={18} color="#22c55e" className="flex-shrink-0" />
                  <span>Air and ocean container freight</span>
                </div>
                <div className="eur-check-pill">
                  <CheckCircle2 size={18} color="#22c55e" className="flex-shrink-0" />
                  <span>Customs clearance (C&amp;F) &amp; inland movement</span>
                </div>
                <div className="eur-check-pill">
                  <CheckCircle2 size={18} color="#22c55e" className="flex-shrink-0" />
                  <span>CFS, consolidation and warehousing</span>
                </div>
                <div className="eur-check-pill">
                  <CheckCircle2 size={18} color="#22c55e" className="flex-shrink-0" />
                  <span>GOH and apparel handling</span>
                </div>
                <div className="eur-check-pill">
                  <CheckCircle2 size={18} color="#22c55e" className="flex-shrink-0" />
                  <span>Project and heavy special cargo</span>
                </div>
              </div>
            </div>

            <div className="eur-handovers-image">
              <img
                src="/images/warehouse_cfs.png"
                alt="Prestige Cargo Operations & CFS Warehouse"
                className="eur-rounded-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Industry Focus Section */}
      <section className="eur-section eur-bg-white">
        <div className="container">
          <div className="eur-split-header">
            <div>
              <span className="eur-tag-red">SPECIALIZED FOCUS</span>
              <h2 className="eur-section-title" style={{ marginTop: '0.5rem' }}>
                Logistics Shaped Around How Your Industry Works
              </h2>
            </div>
            <div className="eur-split-header-right">
              <p className="eur-section-subtitle" style={{ margin: 0 }}>
                Every industry has different pressures — from apparel fashion calendars to temperature-controlled pharmaceuticals and capital project machinery. We combine the right services around those operating realities.
              </p>
              <Link to="/services" className="eur-text-link">
                EXPLORE ALL INDUSTRIES <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="eur-industries-grid">
            {/* Industry 1 */}
            <div className="eur-industry-card">
              <div className="eur-industry-img-wrap">
                <img src="/images/air_freight.png" alt="Apparel & Fashion RMG Logistics" />
              </div>
              <div className="eur-industry-body">
                <div className="eur-industry-circle-arrow">
                  <ArrowRight size={18} />
                </div>
                <h3 className="eur-industry-name">Apparel &amp; Fashion (RMG)</h3>
                <p className="eur-industry-desc">
                  Buyer consolidation, GOH (Garment on Hanger) containers, and priority air charters to meet tight buyer retail seasons.
                </p>
              </div>
            </div>

            {/* Industry 2 */}
            <div className="eur-industry-card">
              <div className="eur-industry-img-wrap">
                <img src="/images/truck_transport.png" alt="Pharmaceuticals & Cold Chain" />
              </div>
              <div className="eur-industry-body">
                <div className="eur-industry-circle-arrow">
                  <ArrowRight size={18} />
                </div>
                <h3 className="eur-industry-name">Pharmaceuticals &amp; Healthcare</h3>
                <p className="eur-industry-desc">
                  Certified temperature-controlled cold-chain air freight and reefer containers for active ingredients, vaccines, and medicine.
                </p>
              </div>
            </div>

            {/* Industry 3 */}
            <div className="eur-industry-card">
              <div className="eur-industry-img-wrap">
                <img src="/images/ocean_freight.png" alt="Industrial Capital Machinery" />
              </div>
              <div className="eur-industry-body">
                <div className="eur-industry-circle-arrow">
                  <ArrowRight size={18} />
                </div>
                <h3 className="eur-industry-name">Industrial Machinery &amp; Projects</h3>
                <p className="eur-industry-desc">
                  Flat-rack, open-top containers, and bonded heavy-lift trucking for industrial factory setup and infrastructure works.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Clean CTA Section ("Let's Move Forward") */}
      <section className="eur-section eur-bg-soft" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        <div className="container">
          <div className="eur-cta-card">
            <div className="eur-cta-content">
              <h2 className="eur-cta-title">Let's Move Forward</h2>
              <p className="eur-cta-desc">
                Share your route, cargo specifications, and timeline. Our dedicated logistics team will route the enquiry and provide the most competitive, accountable plan.
              </p>
              <button className="btn-eur-red" onClick={() => onOpenQuote()}>
                REQUEST A QUOTE <ArrowRight size={18} />
              </button>
            </div>
            <div className="eur-cta-image">
              <img
                src="/images/home_hero_ship.png"
                alt="Container Cargo Shipping Bangladesh"
                className="eur-rounded-image"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
