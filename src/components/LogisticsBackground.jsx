import React, { useEffect, useRef } from 'react';

/**
 * LogisticsBackground
 * An interactive, high-performance ambient canvas background featuring:
 * - Real-time animated Cargo Airplanes flying with jet contrails & wingtip beacon lights
 * - Container Cargo Ships sailing along ocean shipping lanes with expanding wave wakes
 * - Global trade route arcs (air & ocean corridors) connecting worldwide cargo hubs
 * - Pulsing waypoint radar rings at key logistical centers (Dhaka, Chittagong, Europe, America, Middle East, Asia)
 * - Drifting ambient telemetry particles and soft ocean-sky horizon glow
 */
export default function LogisticsBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNetwork();
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Global Logistics Hub Coordinates (percentages relative to viewport)
    const hubConfigs = [
      { id: 'DAC', name: 'Dhaka Hub (DAC)', rx: 0.62, ry: 0.38, primary: true },
      { id: 'CGP', name: 'Chittagong Port (CGP)', rx: 0.65, ry: 0.52, primary: true },
      { id: 'DXB', name: 'Dubai GCC (DXB)', rx: 0.44, ry: 0.42, primary: false },
      { id: 'FRA', name: 'Europe Hub (FRA/LHR)', rx: 0.28, ry: 0.26, primary: false },
      { id: 'JFK', name: 'North America (JFK)', rx: 0.12, ry: 0.35, primary: false },
      { id: 'SIN', name: 'Singapore (SIN)', rx: 0.82, ry: 0.68, primary: false },
      { id: 'RTM', name: 'Rotterdam Port (RTM)', rx: 0.24, ry: 0.22, primary: false },
      { id: 'PVG', name: 'East Asia (PVG)', rx: 0.85, ry: 0.32, primary: false },
    ];

    let hubs = [];
    let routes = [];
    let vehicles = [];
    let particles = [];

    // Initialize Network Points & Corridors
    function initNetwork() {
      hubs = hubConfigs.map((cfg) => ({
        ...cfg,
        x: cfg.rx * width,
        y: cfg.ry * height,
        pulseRadius: 0,
        pulseAlpha: 0.8,
        pulseSpeed: 0.015 + Math.random() * 0.01,
      }));

      // Define connectivity corridors with dedicated types: Air vs Sea
      const connections = [
        { fromId: 'DAC', toId: 'DXB', type: 'air', callsign: '✈ PC-701 DAC→DXB', speed: 0.0016 },
        { fromId: 'DXB', toId: 'FRA', type: 'air', callsign: '✈ PC-822 DXB→FRA', speed: 0.0014 },
        { fromId: 'FRA', toId: 'JFK', type: 'air', callsign: '✈ PC-905 TRANSATLANTIC', speed: 0.0013 },
        { fromId: 'SIN', toId: 'DAC', type: 'air', callsign: '✈ PC-310 SIN→DAC', speed: 0.0017 },
        { fromId: 'DAC', toId: 'PVG', type: 'air', callsign: '✈ PC-404 DAC→PVG', speed: 0.0015 },
        { fromId: 'CGP', toId: 'RTM', type: 'sea', callsign: '🚢 MV PRESTIGE VOYAGER', speed: 0.0008 },
        { fromId: 'CGP', toId: 'SIN', type: 'sea', callsign: '🚢 BENGAL FEEDER EXPRESS', speed: 0.0009 },
        { fromId: 'DXB', toId: 'CGP', type: 'sea', callsign: '🚢 ARABIAN SEA LINE', speed: 0.00085 },
      ];

      routes = [];
      connections.forEach((conn) => {
        const from = hubs.find((h) => h.id === conn.fromId);
        const to = hubs.find((h) => h.id === conn.toId);
        if (from && to) {
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          // Curve height: sea routes curve lower/deeper, air routes arch higher
          const curveMultiplier = conn.type === 'air' ? -0.22 : 0.18;
          const curveHeight = Math.min(dist * Math.abs(curveMultiplier), 110);
          const cpX = midX - (dy / dist) * curveHeight * (curveMultiplier < 0 ? -1 : 1);
          const cpY = midY + (dx / dist) * curveHeight * (curveMultiplier < 0 ? -1 : 1);

          routes.push({
            from,
            to,
            cpX,
            cpY,
            dist,
            type: conn.type,
            callsign: conn.callsign,
            baseSpeed: conn.speed,
          });
        }
      });

      // Spawn traveling vehicles (Planes & Ships)
      vehicles = [];
      routes.forEach((route, idx) => {
        vehicles.push({
          route,
          type: route.type,
          callsign: route.callsign,
          progress: (idx * 0.14) % 1,
          speed: route.baseSpeed * (0.9 + Math.random() * 0.2),
          scale: route.type === 'air' ? 1.05 : 1.15,
        });
      });

      // Spawn floating telemetry / star-chart particles
      particles = [];
      const particleCount = Math.floor(Math.min(width, 1400) / 45);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.2 - Math.random() * 0.3,
          size: 1 + Math.random() * 1.8,
          alpha: 0.15 + Math.random() * 0.35,
          pulse: Math.random() * Math.PI,
        });
      }
    }

    initNetwork();

    // Draw Sleek Vector Cargo Airplane
    function drawAirplane(ctx, x, y, angle, callsign, time, scale = 1) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(scale, scale);

      // Twin Jet Contrails (vapor trails behind jet engines)
      ctx.save();
      const contrailGrad = ctx.createLinearGradient(-42, 0, -8, 0);
      contrailGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      contrailGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.28)');
      contrailGrad.addColorStop(1, 'rgba(255, 255, 255, 0.7)');

      ctx.strokeStyle = contrailGrad;
      ctx.lineWidth = 1.6;
      // Port engine contrail
      ctx.beginPath();
      ctx.moveTo(-6, -4.5);
      ctx.lineTo(-44, -5.5);
      ctx.stroke();
      // Starboard engine contrail
      ctx.beginPath();
      ctx.moveTo(-6, 4.5);
      ctx.lineTo(-44, 5.5);
      ctx.stroke();
      ctx.restore();

      // Airplane Soft Altitude Radar Shadow
      ctx.fillStyle = 'rgba(2, 132, 199, 0.18)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fuselage Body
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(15, 0); // nose cone
      ctx.bezierCurveTo(11, -3, -4, -3.2, -13, -2.5); // left fuselage
      ctx.lineTo(-15, 0); // tail tip
      ctx.lineTo(-13, 2.5); // right fuselage
      ctx.bezierCurveTo(-4, 3.2, 11, 3, 15, 0);
      ctx.closePath();
      ctx.fill();

      // Swept Main Cargo Wings
      ctx.fillStyle = '#0369a1';
      ctx.beginPath();
      ctx.moveTo(2, -2.5);
      ctx.lineTo(-4, -17); // left wingtip
      ctx.lineTo(-9, -17);
      ctx.lineTo(-6, -2.5);
      ctx.lineTo(-6, 2.5);
      ctx.lineTo(-9, 17);
      ctx.lineTo(-4, 17); // right wingtip
      ctx.lineTo(2, 2.5);
      ctx.closePath();
      ctx.fill();

      // Twin Jet Engines under wings
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-6, -6, 6, 2.5);
      ctx.fillRect(-6, 3.5, 6, 2.5);

      // Tail Stabilizers
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(-10, -1);
      ctx.lineTo(-14, -8);
      ctx.lineTo(-16, -8);
      ctx.lineTo(-13, 0);
      ctx.lineTo(-16, 8);
      ctx.lineTo(-14, 8);
      ctx.lineTo(-10, 1);
      ctx.closePath();
      ctx.fill();

      // Cockpit Windshield (Gloss White)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(12, -1);
      ctx.lineTo(9, -2);
      ctx.lineTo(9, 2);
      ctx.lineTo(12, 1);
      ctx.closePath();
      ctx.fill();

      // Flashing Navigation Wingtip Lights (FAA standard: Red on Port, Green on Starboard)
      const flash = Math.sin(time * 6) > 0;
      if (flash) {
        ctx.fillStyle = '#ef4444'; // Red Port
        ctx.beginPath();
        ctx.arc(-5, -17, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#22c55e'; // Green Starboard
        ctx.beginPath();
        ctx.arc(-5, 17, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // White Strobe on Tail
      if (Math.sin(time * 10) > 0.6) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-15, 0, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Callsign Tag
      if (callsign) {
        ctx.rotate(-angle);
        ctx.font = '700 9.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0369a1';
        ctx.fillText(callsign, 14, -12);
      }

      ctx.restore();
    }

    // Draw Sleek Vector Container Cargo Ship
    function drawCargoShip(ctx, x, y, angle, callsign, time, scale = 1) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(scale, scale);

      // Sea Wake / Water Ripple Waves Behind Stern
      ctx.save();
      for (let w = 1; w <= 3; w++) {
        const wakeAlpha = Math.max(0, 0.45 - w * 0.12);
        ctx.strokeStyle = `rgba(56, 189, 248, ${wakeAlpha})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-13, 0);
        ctx.lineTo(-13 - w * 12, -4 - w * 5);
        ctx.moveTo(-13, 0);
        ctx.lineTo(-13 - w * 12, 4 + w * 5);
        ctx.stroke();
      }
      ctx.restore();

      // Container Ship Hull
      ctx.fillStyle = '#0f172a'; // dark navy ship hull
      ctx.beginPath();
      ctx.moveTo(17, 0); // bulbous bow point
      ctx.lineTo(12, -5.5); // bow flare
      ctx.lineTo(-14, -5.5); // port hull
      ctx.lineTo(-16, 0); // stern transom
      ctx.lineTo(-14, 5.5); // starboard hull
      ctx.lineTo(12, 5.5); // bow flare
      ctx.closePath();
      ctx.fill();

      // Cargo Deck
      ctx.fillStyle = '#334155';
      ctx.fillRect(-13, -4.5, 23, 9);

      // Stacked Colored Cargo Container Boxes (Red, Blue, Gold, Green)
      const containerColors = ['#ef4444', '#0284c7', '#f59e0b', '#10b981', '#38bdf8'];
      for (let col = 0; col < 4; col++) {
        const color = containerColors[col % containerColors.length];
        ctx.fillStyle = color;
        ctx.fillRect(-9 + col * 4.6, -3.5, 3.8, 3);
        ctx.fillStyle = containerColors[(col + 2) % containerColors.length];
        ctx.fillRect(-9 + col * 4.6, 0.5, 3.8, 3);
      }

      // Ship Bridge / Navigation Superstructure (Stern cabin)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-14, -3.5, 3.8, 7);
      // Navigation windows
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-11, -2.5, 1, 5);

      // Radar Mast with rotating beacon
      const radarSweep = time * 4.5;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(-12 + Math.cos(radarSweep) * 3.5, Math.sin(radarSweep) * 3.5);
      ctx.stroke();

      // Ship Callsign Label
      if (callsign) {
        ctx.rotate(-angle);
        ctx.font = '700 9.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(callsign, 14, 15);
      }

      ctx.restore();
    }

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient soft gradient illumination following cursor softly
      const ambientGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        Math.max(width * 0.45, 450)
      );
      ambientGrad.addColorStop(0, 'rgba(56, 189, 248, 0.045)');
      ambientGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.02)');
      ambientGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Floating Telemetry Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.025;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const dynamicAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.fillStyle = `rgba(2, 132, 199, ${dynamicAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Curved Trade Route Paths (Air dashed vs Sea dotted)
      routes.forEach((r) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(r.from.x, r.from.y);
        ctx.quadraticCurveTo(r.cpX, r.cpY, r.to.x, r.to.y);
        if (r.type === 'air') {
          ctx.strokeStyle = 'rgba(2, 132, 199, 0.11)';
          ctx.lineWidth = 1.3;
          ctx.setLineDash([5, 6]);
          ctx.lineDashOffset = -time * 14;
        } else {
          ctx.strokeStyle = 'rgba(14, 165, 233, 0.13)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 5]);
          ctx.lineDashOffset = -time * 8;
        }
        ctx.stroke();
        ctx.restore();
      });

      // 4. Draw Traveling Vehicles (Airplanes & Ships) with accurate Tangent Angles
      vehicles.forEach((veh) => {
        veh.progress += veh.speed;
        if (veh.progress >= 1) {
          veh.progress = 0;
        }

        const t = veh.progress;
        const oneMinusT = 1 - t;

        // Position on quadratic Bezier curve
        const x =
          oneMinusT * oneMinusT * veh.route.from.x +
          2 * oneMinusT * t * veh.route.cpX +
          t * t * veh.route.to.x;
        const y =
          oneMinusT * oneMinusT * veh.route.from.y +
          2 * oneMinusT * t * veh.route.cpY +
          t * t * veh.route.to.y;

        // Tangent derivative for heading angle
        const dx =
          2 * oneMinusT * (veh.route.cpX - veh.route.from.x) +
          2 * t * (veh.route.to.x - veh.route.cpX);
        const dy =
          2 * oneMinusT * (veh.route.cpY - veh.route.from.y) +
          2 * t * (veh.route.to.y - veh.route.cpY);
        const angle = Math.atan2(dy, dx);

        if (veh.type === 'air') {
          drawAirplane(ctx, x, y, angle, veh.callsign, time, veh.scale);
        } else {
          drawCargoShip(ctx, x, y, angle, veh.callsign, time, veh.scale);
        }
      });

      // 5. Draw Hub Waypoints & Expanding Sonar / Radar Rings
      hubs.forEach((h) => {
        h.pulseRadius += 0.35;
        h.pulseAlpha = Math.max(0, 0.75 - h.pulseRadius / 36);

        if (h.pulseRadius > 36) {
          h.pulseRadius = 3;
          h.pulseAlpha = 0.75;
        }

        // Radar Ripple Ring
        ctx.strokeStyle = `rgba(2, 132, 199, ${h.pulseAlpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.pulseRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Hub Core Dot
        ctx.fillStyle = h.primary ? '#0284c7' : '#0369a1';
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.primary ? 4.5 : 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Subtle Hub Halo
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.primary ? 8 : 6, 0, Math.PI * 2);
        ctx.fill();

        // Hub Code Label
        ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(71, 85, 105, 0.55)';
        ctx.fillText(h.id, h.x + 8, h.y + 3);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="logistics-ambient-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="logistics-canvas" />
      <div className="logistics-gradient-overlay" />
    </div>
  );
}
