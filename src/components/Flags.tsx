import React, { useId } from "react";

/** Points of a five-pointed star centred on (cx, cy), first point at `deg`. */
function star(cx: number, cy: number, r: number, deg: number): string {
  const inner = r * 0.382;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = ((deg + i * 36) * Math.PI) / 180;
    const len = i % 2 === 0 ? r : inner;
    pts.push(`${(cx + len * Math.cos(rad)).toFixed(2)},${(cy + len * Math.sin(rad)).toFixed(2)}`);
  }
  return pts.join(" ");
}

function UnitedKingdom() {
  // Ids must be unique because several flags can be on screen at once
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice">
      <clipPath id={`uk-s-${id}`}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={`uk-t-${id}`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#uk-s-${id})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#uk-t-${id})`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

function Turkey() {
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <rect width="1200" height="800" fill="#E30A17" />
      <circle cx="425" cy="400" r="200" fill="#fff" />
      <circle cx="475" cy="400" r="160" fill="#E30A17" />
      <polygon points={star(583.33, 400, 100, 180)} fill="#fff" />
    </svg>
  );
}

function Germany() {
  return (
    <svg viewBox="0 0 5 3" preserveAspectRatio="xMidYMid slice">
      <rect width="5" height="1" y="0" fill="#000" />
      <rect width="5" height="1" y="1" fill="#DD0000" />
      <rect width="5" height="1" y="2" fill="#FFCE00" />
    </svg>
  );
}

function France() {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice">
      <rect width="1" height="2" x="0" fill="#002654" />
      <rect width="1" height="2" x="1" fill="#fff" />
      <rect width="1" height="2" x="2" fill="#CE1126" />
    </svg>
  );
}

function Spain() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 750 500" preserveAspectRatio="xMidYMid slice">
      <rect width="750" height="500" fill="#AA151B" />
      <rect width="750" height="250" y="125" fill="#F1BF00" />
      {/* Simplified coat of arms: crowned quartered shield between the Pillars of Hercules */}
      <g transform="translate(250 255)">
        {/* Pillars */}
        <g fill="#E8E8E8" stroke="#8C8C8C" strokeWidth="3">
          <rect x="-82" y="-50" width="18" height="96" />
          <rect x="64" y="-50" width="18" height="96" />
        </g>
        <g fill="#C8A100">
          <rect x="-88" y="-62" width="30" height="12" rx="2" />
          <rect x="58" y="-62" width="30" height="12" rx="2" />
          <rect x="-88" y="46" width="30" height="12" rx="2" />
          <rect x="58" y="46" width="30" height="12" rx="2" />
        </g>
        {/* Crown */}
        <path d="M-40,-66 L-46,-96 L-24,-80 L0,-104 L24,-80 L46,-96 L40,-66 Z" fill="#C8A100" stroke="#8A6D00" strokeWidth="3" />
        {/* Shield */}
        <clipPath id={`es-shield-${id}`}>
          <path d="M-46,-62 H46 V18 A46,46 0 0 1 -46,18 Z" />
        </clipPath>
        <g clipPath={`url(#es-shield-${id})`}>
          <rect x="-46" y="-62" width="46" height="56" fill="#C8102E" />
          <rect x="0" y="-62" width="46" height="56" fill="#F5F5F5" />
          <rect x="-46" y="-6" width="46" height="70" fill="#F1BF00" />
          <g fill="#C8102E">
            <rect x="-40" y="-6" width="7" height="70" />
            <rect x="-26" y="-6" width="7" height="70" />
            <rect x="-12" y="-6" width="7" height="70" />
          </g>
          <rect x="0" y="-6" width="46" height="70" fill="#C8102E" />
          <rect x="-15" y="-46" width="16" height="22" fill="#F1BF00" />
          <circle cx="23" cy="-34" r="11" fill="#6E2C8C" />
          <path d="M23,10 l8,8 l-8,8 l-8,-8 z" fill="#F1BF00" />
        </g>
        <path d="M-46,-62 H46 V18 A46,46 0 0 1 -46,18 Z" fill="none" stroke="#8A6D00" strokeWidth="4" />
      </g>
    </svg>
  );
}

function Portugal() {
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
      <rect width="240" height="400" fill="#046A38" />
      <rect width="360" height="400" x="240" fill="#DA291C" />
      {/* Armillary sphere and shield */}
      <g transform="translate(240 200)">
        <circle r="78" fill="none" stroke="#FFE900" strokeWidth="16" />
        <ellipse rx="78" ry="30" fill="none" stroke="#FFE900" strokeWidth="8" />
        <path d="M-50,-58 h100 v62 a50,50 0 0 1 -100,0 z" fill="#fff" stroke="#DA291C" strokeWidth="14" />
        <rect x="-8" y="-38" width="16" height="20" fill="#002D72" />
        <rect x="-8" y="-6" width="16" height="20" fill="#002D72" />
        <rect x="-8" y="26" width="16" height="20" fill="#002D72" />
        <rect x="-32" y="-6" width="16" height="20" fill="#002D72" />
        <rect x="16" y="-6" width="16" height="20" fill="#002D72" />
      </g>
    </svg>
  );
}

function Russia() {
  return (
    <svg viewBox="0 0 9 6" preserveAspectRatio="xMidYMid slice">
      <rect width="9" height="2" y="0" fill="#fff" />
      <rect width="9" height="2" y="2" fill="#0039A6" />
      <rect width="9" height="2" y="4" fill="#D52B1E" />
    </svg>
  );
}

function Japan() {
  return (
    <svg viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice">
      <rect width="900" height="600" fill="#fff" />
      <circle cx="450" cy="300" r="180" fill="#BC002D" />
    </svg>
  );
}

const FLAGS: Record<string, React.FC> = {
  en: UnitedKingdom,
  tr: Turkey,
  de: Germany,
  fr: France,
  es: Spain,
  pt: Portugal,
  ru: Russia,
  ja: Japan,
};

/** Flag for a UI language code. Shown in greyscale until hovered or selected (see .flag in index.css). */
export const LanguageFlag: React.FC<{ code: string }> = ({ code }) => {
  const Flag = FLAGS[code];
  return <span className="flag">{Flag ? <Flag /> : null}</span>;
};
