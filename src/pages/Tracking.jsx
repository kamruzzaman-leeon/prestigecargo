import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { Search, CheckCircle2, Clock, Box, Plane } from 'lucide-react';
import FlyingPlane from '../components/FlyingPlane';

export default function Tracking({ onOpenQuote }) {
  const { trackingData } = useDataContext();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsTrackingLoading(true);
    const upperCode = trackingNumber.trim().toUpperCase();

    setTimeout(() => {
      setIsTrackingLoading(false);
      if (trackingData && trackingData[upperCode]) {
        setTrackingResult(trackingData[upperCode]);
      } else {
        setTrackingResult({
          number: upperCode,
          status: 'In Transit',
          origin: 'Dhaka Airport Terminal (DAC)',
          destination: 'Hamburg Port Terminal (HAM)',
          estimatedDelivery: 'August 28, 2026',
          currentLocation: 'Dubai Air Cargo Hub',
          steps: [
            { title: 'Cargo Received & Inspected', date: 'Aug 22, 10:30 AM', completed: true },
            { title: 'Customs Cleared at Dhaka (DAC)', date: 'Aug 23, 02:15 PM', completed: true },
            { title: 'Departed Hub Air Transport', date: 'Aug 24, 08:00 AM', completed: true },
            { title: 'In Transit - Connecting Hub', date: 'Aug 24, 02:45 PM', current: true },
            { title: 'Arrival at Destination Port', date: 'Est. Aug 28', completed: false }
          ]
        });
      }
    }, 600);
  };

  return (
    <div className="section-white">
      <section className="section section-offwhite page-header-banner" style={{ padding: '3.5rem 0' }}>
        <FlyingPlane />
        <div className="container text-center">
          <span className="section-tag">Real-Time Visibility</span>
          <h1 className="section-title">Shipment Tracking</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Track your Air Waybill (AWB) or Container Booking reference instantly.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="action-card">
            <form onSubmit={handleTrackSubmit} className="track-form">
              <div className="input-group">
                <Search className="input-icon" size={18} />
                <input
                  type="text"
                  placeholder="Enter HBL / AWB Container Tracking Number (e.g. PC-98421)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isTrackingLoading}>
                {isTrackingLoading ? 'Searching...' : 'Track Package'}
              </button>
            </form>

            {trackingResult ? (
              <div style={{ marginTop: '2rem', padding: '1.75rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Tracking Ref</span>
                    <h3 style={{ fontSize: '1.3rem', color: '#0f172a' }}>{trackingResult.number}</h3>
                  </div>
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600 }}>
                    ● {trackingResult.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Origin</span>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{trackingResult.origin}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Destination</span>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{trackingResult.destination}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Est. Delivery</span>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{trackingResult.estimatedDelivery}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {trackingResult.steps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {step.completed ? (
                        <CheckCircle2 size={22} color="#0284c7" />
                      ) : step.current ? (
                        <Clock size={22} color="#f59e0b" />
                      ) : (
                        <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #cbd5e1' }} />
                      )}
                      <div style={{ flexGrow: 1 }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: step.current ? 700 : 500, color: step.current ? '#0284c7' : '#0f172a' }}>
                          {step.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{step.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <Box size={40} style={{ margin: '0 auto 1rem auto', color: '#94a3b8' }} />
                <p>Try entering sample code: <strong>PC-98421</strong> to test tracking timeline.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
