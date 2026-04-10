// frontend/src/components/dashboard/HeroSection.tsx
// Hyperstudio-inspired hero — dark bg + rising hand SVG + stats bar
// No external assets needed — hand is pure SVG

import React from 'react';
import { useNavigate } from 'react-router-dom';

// ── Types ─────────────────────────────────────────────────────
interface HeroSectionProps {
  totalApplications?: number;
  avgAtsScore?: number;
  interviewRate?: number;
  offersGenerated?: number;
}

// ── Hand SVG ──────────────────────────────────────────────────
const HandSVG: React.FC = () => (
  <svg
    viewBox="0 0 340 460"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="340"
    height="460"
    style={{ position: 'relative', zIndex: 2 }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="handFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#b8b4a8" stopOpacity="0.0" />
        <stop offset="20%"  stopColor="#b8b4a8" stopOpacity="0.45" />
        <stop offset="55%"  stopColor="#c8c4b8" stopOpacity="0.72" />
        <stop offset="100%" stopColor="#d0ccbe" stopOpacity="0.90" />
      </linearGradient>
      <linearGradient id="palmFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#a8a49a" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#c0bcb0" stopOpacity="0.85" />
      </linearGradient>
      <filter id="handShadow">
        <feDropShadow dx="0" dy="-8" stdDeviation="18"
          floodColor="#e8e4d9" floodOpacity="0.07" />
      </filter>
    </defs>

    {/* WRIST / BASE */}
    <path d="M95 460 L95 340 Q95 320 110 310 L230 310 Q245 320 245 340 L245 460 Z"
      fill="url(#palmFade)" filter="url(#handShadow)" />
    <path d="M115 380 Q170 370 225 380" stroke="rgba(80,76,68,0.35)" strokeWidth="0.8" fill="none" />
    <path d="M108 400 Q170 388 232 400" stroke="rgba(80,76,68,0.25)" strokeWidth="0.7" fill="none" />
    <path d="M113 420 Q170 410 227 420" stroke="rgba(80,76,68,0.20)" strokeWidth="0.6" fill="none" />

    {/* THUMB */}
    <path d="M95 330 Q82 320 72 300 Q60 275 65 255 Q70 235 85 230 Q98 228 106 240 Q115 255 113 275 Q111 295 110 310 L95 330Z"
      fill="url(#handFade)" />
    <path d="M80 260 Q86 248 98 248" stroke="rgba(80,76,68,0.3)" strokeWidth="0.7" fill="none" />
    <path d="M70 262 Q72 252 82 252 Q90 252 92 262 Q92 272 82 274 Q72 272 70 262Z"
      fill="rgba(60,56,50,0.20)" stroke="rgba(100,96,88,0.25)" strokeWidth="0.5" />

    {/* INDEX FINGER */}
    <path d="M108 310 Q104 285 103 260 Q102 230 104 200 Q106 170 110 148 Q114 126 122 120 Q130 115 138 120 Q146 126 148 148 Q151 172 150 200 Q149 230 148 260 Q147 285 147 310 Z"
      fill="url(#handFade)" />
    <path d="M106 250 Q127 244 149 250" stroke="rgba(80,76,68,0.28)" strokeWidth="0.7" fill="none" />
    <path d="M106 215 Q127 209 149 215" stroke="rgba(80,76,68,0.22)" strokeWidth="0.7" fill="none" />
    <path d="M107 178 Q127 172 148 178" stroke="rgba(80,76,68,0.18)" strokeWidth="0.6" fill="none" />
    <path d="M113 134 Q116 122 127 120 Q138 120 141 132 Q143 143 136 148 Q128 152 119 148 Q113 143 113 134Z"
      fill="rgba(60,56,50,0.18)" stroke="rgba(100,96,88,0.22)" strokeWidth="0.5" />

    {/* MIDDLE FINGER */}
    <path d="M152 310 Q151 282 150 254 Q149 220 150 188 Q151 156 153 130 Q155 104 160 88 Q165 72 173 68 Q181 64 189 68 Q197 73 202 90 Q207 108 208 134 Q209 160 208 190 Q207 222 206 254 Q205 283 204 310 Z"
      fill="url(#handFade)" />
    <path d="M150 255 Q177 248 205 255" stroke="rgba(80,76,68,0.28)" strokeWidth="0.7" fill="none" />
    <path d="M150 215 Q177 208 205 215" stroke="rgba(80,76,68,0.22)" strokeWidth="0.7" fill="none" />
    <path d="M151 174 Q177 167 204 174" stroke="rgba(80,76,68,0.18)" strokeWidth="0.6" fill="none" />
    <path d="M160 102 Q164 88 176 84 Q188 82 195 96 Q199 108 193 118 Q186 126 175 126 Q164 124 160 114 Q158 108 160 102Z"
      fill="rgba(60,56,50,0.18)" stroke="rgba(100,96,88,0.22)" strokeWidth="0.5" />

    {/* RING FINGER */}
    <path d="M208 310 Q208 284 207 257 Q206 225 207 196 Q208 167 211 144 Q214 120 219 106 Q224 92 231 88 Q239 84 247 90 Q255 96 258 114 Q261 133 260 160 Q259 188 257 216 Q255 244 254 271 Q253 291 252 310 Z"
      fill="url(#handFade)" />
    <path d="M207 255 Q230 248 254 255" stroke="rgba(80,76,68,0.28)" strokeWidth="0.7" fill="none" />
    <path d="M208 216 Q230 209 254 216" stroke="rgba(80,76,68,0.22)" strokeWidth="0.6" fill="none" />
    <path d="M209 176 Q230 169 254 176" stroke="rgba(80,76,68,0.17)" strokeWidth="0.6" fill="none" />
    <path d="M219 118 Q223 104 234 100 Q245 98 251 112 Q254 124 248 132 Q241 140 231 139 Q220 137 218 127 Q217 122 219 118Z"
      fill="rgba(60,56,50,0.18)" stroke="rgba(100,96,88,0.22)" strokeWidth="0.5" />

    {/* PINKY FINGER */}
    <path d="M256 310 Q256 288 255 266 Q254 240 255 218 Q256 195 259 176 Q262 156 268 144 Q274 132 281 130 Q288 128 295 134 Q302 141 304 158 Q306 176 304 198 Q302 220 300 243 Q298 266 297 288 Q297 299 296 310 Z"
      fill="url(#handFade)" />
    <path d="M255 260 Q276 254 300 260" stroke="rgba(80,76,68,0.26)" strokeWidth="0.7" fill="none" />
    <path d="M256 225 Q276 219 300 225" stroke="rgba(80,76,68,0.20)" strokeWidth="0.6" fill="none" />
    <path d="M258 192 Q276 186 299 192" stroke="rgba(80,76,68,0.15)" strokeWidth="0.5" fill="none" />
    <path d="M268 156 Q272 144 281 142 Q291 141 297 153 Q299 163 295 170 Q289 177 280 176 Q271 174 268 166 Q267 161 268 156Z"
      fill="rgba(60,56,50,0.18)" stroke="rgba(100,96,88,0.22)" strokeWidth="0.5" />

    {/* Edge highlights */}
    <path d="M104 200 Q103 168 108 148" stroke="rgba(200,196,186,0.12)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M151 150 Q150 118 156 95"  stroke="rgba(200,196,186,0.12)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M209 170 Q210 145 218 118" stroke="rgba(200,196,186,0.10)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M257 195 Q258 174 266 156" stroke="rgba(200,196,186,0.08)" strokeWidth="1.0" fill="none" strokeLinecap="round" />
    <path d="M240 460 L242 330 Q243 318 246 312" stroke="rgba(200,196,186,0.08)" strokeWidth="1.5" fill="none" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────
const HeroSection: React.FC<HeroSectionProps> = ({
  totalApplications = 2841,
  avgAtsScore        = 82,
  interviewRate      = 14,
  offersGenerated    = 318,
}) => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Applications Sent', value: totalApplications.toLocaleString() },
    { label: 'Avg ATS Score',     value: `${avgAtsScore}%`                  },
    { label: 'Interview Rate',    value: `${interviewRate}%`                },
    { label: 'Offers Generated',  value: offersGenerated.toString()         },
  ];

  return (
    <section style={s.hero}>
      {/* Warm glow behind hand */}
      <div style={s.glow} />

      {/* Hand */}
      <div style={s.handWrap}>
        <div style={s.handMask} />
        <HandSVG />
      </div>

      {/* Copy */}
      <div style={s.content}>
        <span style={s.eyebrow}>// Intelligent Job Automation</span>

        <h1 style={s.h1}>
          Apply smarter.<br />
          <span style={s.h1dim}>Land faster.</span>
        </h1>

        <p style={s.sub}>
          AutoApply AI discovers roles, tailors your resume, scores ATS fit,
          and submits — while you focus on what matters.
        </p>

        <div style={s.actions}>
          <button
            style={s.btnPrimary}
            onClick={() => navigate('/jobs')}
            onMouseEnter={e => (e.currentTarget.style.background = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.background = '#e8e4d9')}
          >
            Start Applying →
          </button>
          <button
            style={s.btnGhost}
            onClick={() => navigate('/dashboard')}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)';
              e.currentTarget.style.color = '#f5f4f0';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
              e.currentTarget.style.color = 'rgba(245,244,240,0.45)';
            }}
          >
            View Dashboard
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={s.statsBar}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              ...s.statItem,
              ...(i < stats.length - 1 ? s.statBorderRight : {}),
            }}
          >
            <span style={s.statLabel}>{stat.label}</span>
            <span style={s.statValue}>{stat.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

// ── Styles ────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  hero: {
    position: 'relative',
    width: '100%',
    minHeight: 560,
    overflow: 'hidden',
    background: '#080808',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '56px 64px 80px',
    fontFamily: "'Syne', sans-serif",
    WebkitFontSmoothing: 'antialiased',
  },
  glow: {
    position: 'absolute',
    bottom: 0,
    right: 60,
    width: 320,
    height: 380,
    background: 'radial-gradient(ellipse at 50% 80%, rgba(232,228,217,0.045) 0%, transparent 65%)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  handWrap: {
    position: 'absolute',
    bottom: -20,
    right: 40,
    width: 340,
    height: 460,
    zIndex: 2,
    pointerEvents: 'none',
  },
  handMask: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, #080808 0%, #080808 6%, transparent 38%, transparent 72%, #080808 100%)',
    zIndex: 3,
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 5,
    maxWidth: 560,
  },
  eyebrow: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'rgba(245,244,240,0.35)',
    display: 'block',
    marginBottom: 20,
  },
  h1: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(38px, 5.5vw, 64px)',
    fontWeight: 800,
    letterSpacing: '-0.035em',
    lineHeight: 1.0,
    color: '#f5f4f0',
    margin: '0 0 18px',
  },
  h1dim: {
    color: 'rgba(245,244,240,0.38)',
  },
  sub: {
    fontSize: 14,
    color: 'rgba(245,244,240,0.50)',
    lineHeight: 1.75,
    maxWidth: 400,
    margin: '0 0 32px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  btnPrimary: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 700,
    padding: '13px 28px',
    background: '#e8e4d9',
    color: '#080808',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s',
    borderRadius: 0,
  },
  btnGhost: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '13px 28px',
    background: 'transparent',
    color: 'rgba(245,244,240,0.45)',
    border: '1px solid rgba(255,255,255,0.14)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    borderRadius: 0,
  },
  statsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    zIndex: 6,
  },
  statItem: {
    flex: 1,
    padding: '14px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  statBorderRight: {
    borderRight: '1px solid rgba(255,255,255,0.06)',
  },
  statLabel: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 9,
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
    color: 'rgba(245,244,240,0.28)',
  },
  statValue: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: '-0.025em',
    color: '#f5f4f0',
    lineHeight: 1,
  },
};
