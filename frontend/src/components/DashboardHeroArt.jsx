const DashboardHeroArt = () => {
  return (
    <div className="dashboard-hero-art" aria-hidden="true">
      <svg viewBox="0 0 440 320" role="presentation">
        <defs>
          <linearGradient id="heroSky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="55%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
          <linearGradient id="robotBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5f3ff" />
            <stop offset="55%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <radialGradient id="robotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="faceGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#14b8ff" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="440" height="320" rx="28" fill="url(#heroSky)" opacity="0.16" />
        <path d="M22 232C102 206 154 220 222 198C292 175 332 140 408 150" stroke="#6d28d9" strokeWidth="1.8" strokeOpacity="0.28" fill="none" />
        <path d="M22 184C108 164 150 176 224 152C296 128 334 100 408 110" stroke="#38bdf8" strokeWidth="1.4" strokeOpacity="0.22" fill="none" />
        <ellipse cx="228" cy="232" rx="72" ry="16" fill="#080b18" opacity="0.75" />
        <ellipse cx="234" cy="228" rx="92" ry="20" fill="url(#robotGlow)" opacity="0.62" />

        <g className="robot-figure" transform="translate(146 46)">
          <circle cx="64" cy="70" r="56" fill="#ffffff" opacity="0.03" />
          <rect x="20" y="34" width="88" height="104" rx="42" fill="url(#robotBody)" />
          <rect x="30" y="44" width="68" height="60" rx="22" fill="#090d20" />
          <rect x="34" y="48" width="60" height="52" rx="20" fill="#050817" />
          <path className="robot-eye left" d="M48 73h12l-7-6" stroke="url(#faceGlow)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path className="robot-eye right" d="M76 67l7 6h-12" stroke="url(#faceGlow)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="56" y="105" width="16" height="16" rx="8" fill="#f5f3ff" opacity="0.85" />
          <circle cx="64" cy="72" r="58" fill="none" stroke="#f5f3ff" strokeWidth="1.4" strokeOpacity="0.22" />
          <circle cx="64" cy="72" r="51" fill="none" stroke="#8b5cf6" strokeWidth="7" strokeOpacity="0.14" />
          <circle cx="64" cy="14" r="7" fill="#d8c7ff" />
          <rect x="57" y="0" width="14" height="18" rx="7" fill="#d8c7ff" opacity="0.82" />
          <circle cx="40" cy="150" r="7" fill="#f5f3ff" opacity="0.72" />
          <circle cx="88" cy="150" r="7" fill="#f5f3ff" opacity="0.72" />
          <circle cx="94" cy="154" r="8" fill="#f5f3ff" opacity="0.65" />
        </g>

        <g className="hero-orb orb-violet" transform="translate(96 76)">
          <circle cx="0" cy="0" r="22" fill="#22c55e" opacity="0.18" />
          <circle cx="0" cy="0" r="16" fill="#0f172a" />
          <path d="M-7 0l5 5 9-10" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        <g className="hero-orb orb-amber" transform="translate(358 88)">
          <circle cx="0" cy="0" r="24" fill="#7c3aed" opacity="0.2" />
          <circle cx="0" cy="0" r="17" fill="#111827" />
          <path d="M-7 -4h14M-7 4h14" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g className="hero-chip" transform="translate(336 238)">
          <path d="M0 0h58c10 0 18 8 18 18v1c0 10-8 18-18 18H0c-10 0-18-8-18-18v-1C-18 8-10 0 0 0z" fill="#111827" opacity="0.92" stroke="#8b5cf6" strokeOpacity="0.35" />
          <path d="M16 22h24" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M18 34l8-16 8 8 8-12" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        <circle cx="402" cy="62" r="3" fill="#fff" opacity="0.65" />
        <circle cx="408" cy="74" r="2" fill="#c4b5fd" opacity="0.7" />
        <circle cx="76" cy="210" r="2.5" fill="#8b5cf6" opacity="0.7" />
        <circle cx="100" cy="248" r="2" fill="#38bdf8" opacity="0.7" />
      </svg>
      <div className="hero-floating-badge check">✓</div>
      <div className="hero-floating-badge braces">AI</div>
      <div className="hero-floating-badge trophy">★</div>
    </div>
  );
};

export default DashboardHeroArt;