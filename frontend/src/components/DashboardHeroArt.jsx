const DashboardHeroArt = () => {
  return (
    <div className="dashboard-hero-art" aria-hidden="true">
      <svg viewBox="0 0 440 320" role="presentation">
        <defs>
          <linearGradient id="heroSky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#12246f" />
            <stop offset="55%" stopColor="#4c1d95" />
            <stop offset="100%" stopColor="#090f3f" />
          </linearGradient>
          <linearGradient id="robotBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8f7ff" />
            <stop offset="50%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          <radialGradient id="robotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="faceGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="440" height="320" rx="30" fill="url(#heroSky)" opacity="0.15" />
        <path d="M20 248C102 220 146 240 224 214C302 188 338 148 420 160" stroke="#6d28d9" strokeWidth="2" strokeOpacity="0.35" fill="none" />
        <path d="M18 202C104 178 150 190 221 166C292 142 336 108 424 118" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.32" fill="none" />
        <ellipse cx="246" cy="240" rx="80" ry="18" fill="#0f0f1b" opacity="0.65" />
        <ellipse cx="246" cy="236" rx="90" ry="20" fill="url(#robotGlow)" opacity="0.9" />

        <g transform="translate(180 56)">
          <circle cx="68" cy="72" r="64" fill="#ffffff" opacity="0.04" />
          <circle cx="68" cy="72" r="53" fill="url(#robotBody)" opacity="0.18" />
          <rect x="20" y="36" width="96" height="110" rx="48" fill="url(#robotBody)" />
          <rect x="31" y="47" width="74" height="64" rx="26" fill="#0f172a" />
          <rect x="36" y="52" width="64" height="54" rx="22" fill="#070b1f" />
          <path d="M53 80h14l-8-7" stroke="url(#faceGlow)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M83 73l8 7h-14" stroke="url(#faceGlow)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="58" y="112" width="20" height="20" rx="10" fill="#e5e7eb" opacity="0.82" />
          <circle cx="68" cy="74" r="64" fill="none" stroke="#f5f3ff" strokeWidth="1.5" strokeOpacity="0.28" />
          <circle cx="68" cy="74" r="56" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeOpacity="0.18" />
          <circle cx="68" cy="16" r="8" fill="#c4b5fd" />
          <rect x="60" y="0" width="16" height="22" rx="8" fill="#c4b5fd" opacity="0.85" />
          <circle cx="42" cy="154" r="8" fill="#f5f3ff" opacity="0.65" />
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