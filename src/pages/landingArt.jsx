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

export function GrapherArt() {
  return (
    <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="90" x2="220" y2="90" stroke="rgba(0,0,0,.12)" strokeWidth="2" />
      <line x1="120" y1="20" x2="120" y2="160" stroke="rgba(0,0,0,.12)" strokeWidth="2" />
      <path d="M24,150 C70,40 110,150 160,50 C185,0 205,60 216,34" stroke="#6b6bff" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M24,120 Q120,-30 216,120" stroke="#a86bff" strokeWidth="3" fill="none" strokeDasharray="6 5" />
    </svg>
  );
}

const PROBABILITY_BARS = [40, 78, 116, 60, 30];

export function ProbabilityArt() {
  return (
    <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="24" y1="160" x2="220" y2="160" stroke="rgba(0,0,0,.15)" strokeWidth="2" />
      {PROBABILITY_BARS.map((h, i) => (
        <rect
          key={i}
          x={34 + i * 38}
          y={160 - h}
          width="26"
          height={h}
          rx="5"
          fill={i === 2 ? "#a86bff" : "#6b6bff"}
          opacity={i === 2 ? 1 : 0.55}
        />
      ))}
      <path d="M34,120 Q120,10 206,120" stroke="#28c840" strokeWidth="3" fill="none" strokeDasharray="5 5" />
    </svg>
  );
}
