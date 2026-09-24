import React from 'react';
import { Plane } from 'lucide-react';

/**
 * Animated Flying Cargo Airplane with radar glow pulse circle and contrail stream.
 * Used on Homepage Hero as well as Page Header Banners (About, Services, Tracking, Contact).
 */
export default function FlyingPlane({ isHero = false }) {
  return (
    <div
      className={isHero ? 'hero-plane-flight' : 'banner-plane-flight'}
      aria-hidden="true"
    >
      <div className="flight-contrail" />
      <div className="flight-plane-icon-box">
        <Plane size={isHero ? 22 : 19} className="flight-plane-svg" />
        <span className="flight-plane-pulse" />
      </div>
    </div>
  );
}
