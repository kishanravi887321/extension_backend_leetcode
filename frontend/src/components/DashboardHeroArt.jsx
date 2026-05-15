const DashboardHeroArt = () => {
  return (
      <svg viewBox="0 0 420 300" role="presentation">
      <svg viewBox="0 0 440 320" role="presentation">
        <defs>
            <stop offset="0%" stopColor="#13205f" />
            <stop offset="55%" stopColor="#41157d" />
            <stop offset="100%" stopColor="#080c2e" />
            <stop offset="100%" stopColor="#090f3f" />
          </linearGradient>
          <linearGradient id="robotBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="55%" stopColor="#d8c7ff" />
            <stop offset="100%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
            <stop offset="0%" stopColor="#14b8ff" />
            <stop offset="100%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="420" height="300" rx="28" fill="url(#heroSky)" opacity="0.14" />
        <path d="M18 228C100 202 150 216 220 194C292 172 330 136 404 146" stroke="#6d28d9" strokeWidth="1.8" strokeOpacity="0.32" fill="none" />
        <path d="M18 182C104 162 148 174 222 150C294 126 332 98 404 108" stroke="#38bdf8" strokeWidth="1.4" strokeOpacity="0.28" fill="none" />
        <ellipse cx="228" cy="228" rx="74" ry="16" fill="#080b18" opacity="0.7" />
        <ellipse cx="228" cy="224" rx="88" ry="18" fill="url(#robotGlow)" opacity="0.85" />
        <ellipse cx="246" cy="236" rx="90" ry="20" fill="url(#robotGlow)" opacity="0.9" />

          <circle cx="64" cy="70" r="58" fill="#ffffff" opacity="0.035" />
          <rect x="20" y="34" width="88" height="104" rx="42" fill="url(#robotBody)" />
          <rect x="30" y="44" width="68" height="60" rx="22" fill="#090d20" />
          <rect x="34" y="48" width="60" height="52" rx="20" fill="#050817" />
          <path className="robot-eye left" d="M48 73h12l-7-6" stroke="url(#faceGlow)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path className="robot-eye right" d="M76 67l7 6h-12" stroke="url(#faceGlow)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="56" y="105" width="16" height="16" rx="8" fill="#f5f3ff" opacity="0.85" />
          <circle cx="64" cy="72" r="58" fill="none" stroke="#f5f3ff" strokeWidth="1.4" strokeOpacity="0.24" />
          <circle cx="64" cy="72" r="51" fill="none" stroke="#8b5cf6" strokeWidth="7" strokeOpacity="0.16" />
          <circle cx="64" cy="14" r="7" fill="#d8c7ff" />
          <rect x="57" y="0" width="14" height="18" rx="7" fill="#d8c7ff" opacity="0.82" />
          <circle cx="40" cy="150" r="7" fill="#f5f3ff" opacity="0.72" />
          <circle cx="88" cy="150" r="7" fill="#f5f3ff" opacity="0.72" />
          <circle cx="94" cy="154" r="8" fill="#f5f3ff" opacity="0.65" />
        </g>

        <g transform="translate(86 70)">
          <circle cx="0" cy="0" r="22" fill="#22c55e" opacity="0.2" />
          <circle cx="0" cy="0" r="16" fill="#0f172a" />
          <path d="M-7 0l5 5 9-10" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        <g transform="translate(362 84)">
          <circle cx="0" cy="0" r="24" fill="#7c3aed" opacity="0.22" />
          <circle cx="0" cy="0" r="17" fill="#111827" />
          <path d="M-7 -4h14M-7 4h14" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g transform="translate(384 180)">
          <circle cx="0" cy="0" r="24" fill="#f59e0b" opacity="0.22" />
          <circle cx="0" cy="0" r="17" fill="#111827" />
          <path d="M0 -9l2.8 5.6 6.2.9-4.5 4.4 1 6.1L0 14l-5.5 2.9 1-6.1-4.5-4.4 6.2-.9z" fill="#fbbf24" />
        </g>

        <g transform="translate(330 236)">
          <path d="M0 0h58c10 0 18 8 18 18v1c0 10-8 18-18 18H0c-10 0-18-8-18-18v-1C-18 8-10 0 0 0z" fill="#111827" opacity="0.92" stroke="#8b5cf6" strokeOpacity="0.4" />
          <path d="M16 22h24" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M18 34l8-16 8 8 8-12" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        <circle cx="402" cy="62" r="3" fill="#fff" opacity="0.65" />
        <circle cx="408" cy="74" r="2" fill="#c4b5fd" opacity="0.7" />
        <circle cx="76" cy="210" r="2.5" fill="#8b5cf6" opacity="0.7" />
        <circle cx="100" cy="248" r="2" fill="#38bdf8" opacity="0.7" />
      </svg>
    </div>
  );
};

export default DashboardHeroArt;