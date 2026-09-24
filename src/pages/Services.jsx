import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { Plane, Ship, ShieldCheck, Truck, Warehouse, CheckCircle2, ArrowRight, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function Services({ onOpenQuote }) {
  const { servicesList } = useDataContext();
  const [openFaq, setOpenFaq] = useState(null);

  const svcs = servicesList || [];
  const svcAir = svcs.find(s => s.id?.includes('air')) || {
    title: "Air Freight Forwarding",
    description: "Prestige Cargo offers swift and reliable air freight forwarding from Hazrat Shahjalal International Airport (DAC). We manage priority shipments, express consolidations, and direct air cargo charter services to major global hubs.",
    image: "/images/air_freight.png"
  };
  const svcOcean = svcs.find(s => s.id?.includes('ocean')) || {
    title: "Ocean Freight (FCL / LCL)",
    description: "We partner with premier global shipping lines to offer full container loads (FCL) and less than container loads (LCL) out of Chittagong Port (CGP) and Mongla Port.",
    image: "/images/ocean_freight.png"
  };
  const svcCustoms = svcs.find(s => s.id?.includes('custom')) || {
    title: "Customs Clearance & C&F Agent",
    description: "Navigating customs regulations smoothly. Our C&F experts manage import/export duty assessment, HS Code classification, and physical customs inspection at Dhaka Airport & Chittagong Port.",
    image: "/images/customs_clearance.png"
  };
  const svcTruck = svcs.find(s => s.id?.includes('truck')) || {
    title: "Inland Road Transport & Trucking",
    description: "Fleet of covered vans, container prime movers, and trailers ensuring safe road transport from factories and EPZ zones directly to ports and warehouses.",
    image: "/images/truck_transport.png"
  };
  const svcWarehouse = svcs.find(s => s.id?.includes('warehouse')) || {
    title: "Warehousing & CFS Storage",
    description: "Secure Container Freight Station (CFS) storage, cargo sorting, palletization, and distribution support.",
    image: "/images/warehouse_cfs.png"
  };

  const faqs = [
    {
      question: "What documents are required for Garment (RMG) exports from Bangladesh?",
      answer: "For RMG exports, standard required documents include Commercial Invoice, Packing List, Export Permission (EXP Form from Bangladesh Bank), Certificate of Origin (CO), GSP/Euro 1 Form (if applicable), Master Bill of Lading / House Airway Bill, and Factory Inspection Reports."
    },
    {
      question: "How long does customs clearance take at Hazrat Shahjalal International Airport (DAC)?",
      answer: "For standard air export shipments with pre-filed documentation, customs clearance at DAC Air Cargo Village typically takes between 6 to 12 hours. Express air cargo can be processed faster with pre-arranged inspection."
    },
    {
      question: "What is the key difference between FCL and LCL ocean shipping?",
      answer: "Full Container Load (FCL) means an entire 20ft or 40ft ocean container is dedicated exclusively to your cargo. Less than Container Load (LCL) consolidates smaller shipments from multiple shippers into a shared container, making it cost-effective for smaller volumes."
    },
    {
      question: "Does Prestige Cargo handle EPZ and Bonded Warehouse clearance?",
      answer: "Yes! We specialize in EPZ (Export Processing Zone) and bonded facility customs documentation. We coordinate directly with Bangladesh Customs and BEPZA authorities for smooth duty-free raw material entry and finished product export."
    },
    {
      question: "How are customs duties and taxes calculated in Bangladesh?",
      answer: "Customs duties are assessed based on the Harmonized System (HS) Code of the imported item, applied to the CIF (Cost, Insurance, and Freight) value. Taxes may include Customs Duty (CD), Regulatory Duty (RD), Supplementary Duty (SD), and Value Added Tax (VAT)."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="section-white">
      {/* Services Header */}
      <section className="section section-offwhite page-header-banner" style={{ padding: '3.5rem 0' }}>
        <div className="container text-center">
          <span className="section-tag">Logistics Solutions</span>
          <h1 className="section-title">Our Freight &amp; Customs Services</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Comprehensive Air, Sea, Inland Transport, Warehousing, and Customs Clearance Services in Bangladesh.
          </p>
        </div>
      </section>

      {/* Main Services List */}
      <section className="section">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

          {/* Air Freight */}
          <div className="why-us-grid">
            <div>
              <div style={{ width: 48, height: 48, borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Plane size={24} />
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{svcAir.title}</h2>
              <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {svcAir.description}
              </p>
              <ul className="service-features" style={{ marginBottom: '2rem' }}>
                <li><CheckCircle2 size={16} color="#0284c7" /> Airport-to-Airport &amp; Door-to-Door Delivery</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Perishable &amp; Temperature Sensitive Cargo Handling</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Garment-on-Hanger (GOH) Unit Load Devices</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Complete Airway Bill (HAWB / MAWB) Issuance</li>
              </ul>
              <button className="btn btn-primary" onClick={onOpenQuote}>
                Book Air Cargo Quote <ArrowRight size={16} />
              </button>
            </div>
            <div>
              <img
                src={svcAir.image || "/images/air_freight.png"}
                alt={svcAir.title}
                style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px', border: '1px solid #e2e8f0' }}
              />
            </div>
          </div>

          {/* Ocean Freight */}
          <div className="why-us-grid" style={{ direction: 'rtl' }}>
            <div style={{ direction: 'ltr' }}>
              <div style={{ width: 48, height: 48, borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Ship size={24} />
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{svcOcean.title}</h2>
              <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {svcOcean.description}
              </p>
              <ul className="service-features" style={{ marginBottom: '2rem' }}>
                <li><CheckCircle2 size={16} color="#0284c7" /> Standard Dry &amp; High Cube Containers (20ft / 40ft / 45ft)</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> LCL Groupage &amp; Freight De-consolidation</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Temperature-Controlled Reefer Containers</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Port-to-Port &amp; Door Container Movement</li>
              </ul>
              <button className="btn btn-primary" onClick={onOpenQuote}>
                Book Ocean Container <ArrowRight size={16} />
              </button>
            </div>
            <div style={{ direction: 'ltr' }}>
              <img
                src={svcOcean.image || "/images/ocean_freight.png"}
                alt={svcOcean.title}
                style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px', border: '1px solid #e2e8f0' }}
              />
            </div>
          </div>

          {/* Customs Clearance */}
          <div className="why-us-grid">
            <div>
              <div style={{ width: 48, height: 48, borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{svcCustoms.title}</h2>
              <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {svcCustoms.description}
              </p>
              <ul className="service-features" style={{ marginBottom: '2rem' }}>
                <li><CheckCircle2 size={16} color="#0284c7" /> Dhaka Air Cargo &amp; Chittagong Port Customs Clearance</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> EPZ &amp; Bonded Facility Documentation</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> NBR Compliance &amp; Duty Refund Advisory</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Speedy Customs Release &amp; Physical Inspection Support</li>
              </ul>
              <button className="btn btn-primary" onClick={onOpenQuote}>
                Inquire Customs Brokerage <ArrowRight size={16} />
              </button>
            </div>
            <div>
              <img
                src={svcCustoms.image || "/images/customs_clearance.png"}
                alt={svcCustoms.title}
                style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)' }}
              />
            </div>
          </div>

          {/* Inland Road Transport */}
          <div className="why-us-grid" style={{ direction: 'rtl' }}>
            <div style={{ direction: 'ltr' }}>
              <div style={{ width: 48, height: 48, borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Truck size={24} />
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{svcTruck.title}</h2>
              <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {svcTruck.description}
              </p>
              <ul className="service-features" style={{ marginBottom: '2rem' }}>
                <li><CheckCircle2 size={16} color="#0284c7" /> Nationwide Factory &amp; Warehouse Pickup</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Real-time GPS Fleet Monitoring</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Benapole Land Border Customs Transit</li>
              </ul>
              <button className="btn btn-primary" onClick={onOpenQuote}>
                Book Trucking Service <ArrowRight size={16} />
              </button>
            </div>
            <div style={{ direction: 'ltr' }}>
              <img
                src={svcTruck.image || "/images/truck_transport.png"}
                alt={svcTruck.title}
                style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px', border: '1px solid #e2e8f0' }}
              />
            </div>
          </div>

          {/* Warehousing & CFS */}
          <div className="why-us-grid">
            <div>
              <div style={{ width: 48, height: 48, borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Warehouse size={24} />
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{svcWarehouse.title}</h2>
              <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {svcWarehouse.description}
              </p>
              <ul className="service-features" style={{ marginBottom: '2rem' }}>
                <li><CheckCircle2 size={16} color="#0284c7" /> 24/7 Monitored Secure Warehousing</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Cargo Packing, Labeling, &amp; Consolidation</li>
                <li><CheckCircle2 size={16} color="#0284c7" /> Inventory Tracking &amp; Cross-docking</li>
              </ul>
              <button className="btn btn-primary" onClick={onOpenQuote}>
                Inquire Warehousing <ArrowRight size={16} />
              </button>
            </div>
            <div>
              <img
                src={svcWarehouse.image || "/images/warehouse_cfs.png"}
                alt={svcWarehouse.title}
                style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px', border: '1px solid #e2e8f0' }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="section section-offwhite" style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-tag">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Learn more about Bangladesh freight forwarding, customs clearance procedures, and shipment documentation.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    background: 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <HelpCircle size={20} color="#0284c7" />
                    {faq.question}
                  </span>
                  {openFaq === index ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </button>

                {openFaq === index && (
                  <div style={{ padding: '0 1.5rem 1.25rem 3.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.65, borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
