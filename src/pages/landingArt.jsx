export function VectorsArt() {
  return (
    <svg width="230" height="200" viewBox="0 0 230 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="ah1" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#6b6bff" />
        </marker>
        <marker id="ah2" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#a86bff" />
        </marker>
        <marker id="ah3" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#28c840" />
        </marker>
      </defs>
      <path d="M30,170 L150,90" stroke="#6b6bff" strokeWidth="4" markerEnd="url(#ah1)" />
      <path d="M150,90 L200,40" stroke="#a86bff" strokeWidth="4" markerEnd="url(#ah2)" />
      <path d="M30,170 L200,40" stroke="#28c840" strokeWidth="4" strokeDasharray="7 6" markerEnd="url(#ah3)" />
      <circle cx="30" cy="170" r="5" fill="#1d1d1f" />
    </svg>
  );
}

export function ProjectileArt() {
  return (
    <svg width="240" height="190" viewBox="0 0 240 190" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,170 L220,170" stroke="rgba(0,0,0,.15)" strokeWidth="2" />
      <path d="M20,170 Q120,-10 220,170" stroke="#6b6bff" strokeWidth="4" strokeDasharray="2 9" strokeLinecap="round" />
      <circle cx="120" cy="42" r="9" fill="#a86bff" />
      <path d="M20,170 L58,132" stroke="#28c840" strokeWidth="3.5" />
      <circle cx="20" cy="170" r="6" fill="#1d1d1f" />
    </svg>
  );
}

export function InclineArt() {
  return (
    <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,160 L220,160 L220,60 Z" fill="rgba(120,110,255,.12)" stroke="#6b6bff" strokeWidth="2.5" />
      <rect x="150" y="86" width="34" height="24" rx="5" transform="rotate(-27 167 98)" fill="#a86bff" />
      <path d="M167,98 L200,140" stroke="#28c840" strokeWidth="3.5" strokeDasharray="6 5" />
      <path d="M60,160 A24 24 0 0 1 78,144" stroke="#86868b" strokeWidth="2" fill="none" />
      <text x="66" y="154" fontFamily="monospace" fontSize="12" fill="#86868b">θ</text>
    </svg>
  );
}

export function UnitCircleArt() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(0,0,0,.12)" strokeWidth="2" />
      <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(0,0,0,.12)" strokeWidth="2" />
      <circle cx="100" cy="100" r="66" stroke="#6b6bff" strokeWidth="3" fill="none" />
      <path d="M100,100 L147,53" stroke="#a86bff" strokeWidth="3.5" />
      <line x1="147" y1="53" x2="147" y2="100" stroke="#28c840" strokeWidth="2.5" strokeDasharray="5 4" />
      <line x1="100" y1="100" x2="147" y2="100" stroke="#ff5f57" strokeWidth="2.5" />
      <circle cx="147" cy="53" r="6" fill="#a86bff" />
    </svg>
  );
}

// Triangle with all three interior angles arced — the sum is the whole idea.
export function TriangleAnglesArt() {
  return (
    <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34,150 L206,150 L138,40 Z" fill="rgba(120,110,255,.1)" stroke="#6b6bff" strokeWidth="3" strokeLinejoin="round" />
      <path d="M62,150 A28 28 0 0 0 50,128" stroke="#a86bff" strokeWidth="2.5" fill="none" />
      <path d="M178,150 A28 28 0 0 1 190,131" stroke="#28c840" strokeWidth="2.5" fill="none" />
      <path d="M124,62 A24 24 0 0 0 152,62" stroke="#ff5f57" strokeWidth="2.5" fill="none" />
      <circle cx="34" cy="150" r="4.5" fill="#1d1d1f" />
      <circle cx="206" cy="150" r="4.5" fill="#1d1d1f" />
      <circle cx="138" cy="40" r="4.5" fill="#1d1d1f" />
    </svg>
  );
}

// Two rays off a shared vertex: the small angle, and the big one containing it.
export function AdjacentAnglesArt() {
  return (
    <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40,150 L214,150" stroke="#1d1d1f" strokeWidth="3" />
      <path d="M40,150 L186,74" stroke="#1d1d1f" strokeWidth="3" />
      <path d="M40,150 L64,44" stroke="#1d1d1f" strokeWidth="3" />
      {/* outer arc: the whole angle */}
      <path d="M144,150 A104 104 0 0 0 62,48" stroke="#ff5f57" strokeWidth="2.5" fill="none" />
      {/* inner arc: the part you already know */}
      <path d="M96,150 A56 56 0 0 0 78,109" fill="rgba(168,107,255,.25)" stroke="#a86bff" strokeWidth="2.5" />
      <circle cx="40" cy="150" r="5" fill="#1d1d1f" />
      <circle cx="186" cy="74" r="5.5" fill="#6b6bff" />
      <circle cx="64" cy="44" r="5.5" fill="#6b6bff" />
    </svg>
  );
}

// Block and tackle: one fixed wheel, one movable, load hanging below.
export function PulleyArt() {
  return (
    <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M46,26 L200,26" stroke="#86868b" strokeWidth="4" />
      <circle cx="92" cy="48" r="18" fill="rgba(120,110,255,.12)" stroke="#6b6bff" strokeWidth="3" />
      <circle cx="92" cy="48" r="3.5" fill="#6b6bff" />
      <circle cx="150" cy="104" r="18" fill="rgba(168,107,255,.14)" stroke="#a86bff" strokeWidth="3" />
      <circle cx="150" cy="104" r="3.5" fill="#a86bff" />
      {/* rope: down from the fixed wheel, under the movable one, back up */}
      <path d="M74,48 L74,140" stroke="#28c840" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M110,48 L132,104" stroke="#28c840" strokeWidth="2.5" />
      <path d="M168,104 L168,26" stroke="#28c840" strokeWidth="2.5" />
      <path d="M150,122 L150,138" stroke="#86868b" strokeWidth="2.5" />
      <rect x="128" y="138" width="44" height="28" rx="5" fill="#6b6bff" />
    </svg>
  );
}

// Pendulum at one extreme, with the swing arc and the rest position dashed.
export function PendulumArt() {
  return (
    <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M76,26 L164,26" stroke="#86868b" strokeWidth="4" />
      <path d="M120,26 L120,132" stroke="rgba(0,0,0,.18)" strokeWidth="2" strokeDasharray="5 5" />
      <path d="M120,26 L74,122" stroke="#1d1d1f" strokeWidth="2.5" />
      <path d="M74,122 A106 106 0 0 0 166,122" stroke="#28c840" strokeWidth="2.5" fill="none" strokeDasharray="6 6" />
      <path d="M140,26 A20 20 0 0 0 133,40" stroke="#a86bff" strokeWidth="2" fill="none" />
      <circle cx="120" cy="26" r="4.5" fill="#86868b" />
      <circle cx="74" cy="122" r="16" fill="#6b6bff" />
    </svg>
  );
}
