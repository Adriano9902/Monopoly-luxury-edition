
import React from 'react';
import { PlayerToken } from '../types';

interface IconProps {
  className?: string;
  color?: string;
  is3D?: boolean;
}

// Definition of a shared Gold Gradient to be used across icons for a "3D" feel
const GoldGradient = () => (
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style={{ stopColor: '#fbf5db', stopOpacity: 1 }} />
      <stop offset="20%" style={{ stopColor: '#d99a1c', stopOpacity: 1 }} />
      <stop offset="50%" style={{ stopColor: '#edd071', stopOpacity: 1 }} />
      <stop offset="80%" style={{ stopColor: '#935812', stopOpacity: 1 }} />
      <stop offset="100%" style={{ stopColor: '#643a16', stopOpacity: 1 }} />
    </linearGradient>
    <filter id="iconShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
      <feOffset dx="1" dy="1" result="offsetblur" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.5" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

export const IconJet: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} filter="url(#iconShadow)">
    <GoldGradient />
    <path d="M22 12L12 2l-2 3 5 7H2l3 3-3 3h13l-5 7 2 3 10-10z" fill={color} stroke="#000" strokeWidth="0.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12l8-6-3 6 3 6-8-6z" fill="#000" opacity="0.1"/>
  </svg>
);

export const IconYacht: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} filter="url(#iconShadow)">
    <GoldGradient />
    <path d="M2 16c0-2 2-3 4-3s3 1 4 3 3 1 4-1 4-3 8-3" stroke={color} strokeWidth="1" />
    <path d="M5 13l2-9h8l2 9M8 4h8" fill={color} stroke="#000" strokeWidth="0.2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="9" y="5" width="6" height="3" fill="#000" opacity="0.1" />
  </svg>
);

export const IconOil: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} filter="url(#iconShadow)">
    <GoldGradient />
    <path d="M12 2l-7 20h14L12 2z" fill={color} stroke="#000" strokeWidth="0.2" />
    <path d="M12 6l-3 10h6L12 6z" fill="#000" opacity="0.2"/>
  </svg>
);

export const IconCrypto: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} filter="url(#iconShadow)">
    <GoldGradient />
    <circle cx="12" cy="12" r="9" fill={color} stroke="#000" strokeWidth="0.2" />
    <path d="M10 8h4a2 2 0 0 1 0 4h-4v-4zm0 4h5a2 2 0 0 1 0 4h-5v-4z" stroke="#000" strokeWidth="0.8" />
    <path d="M12 6v12" stroke="#000" strokeWidth="0.8" />
  </svg>
);

export const IconScam: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} filter="url(#iconShadow)">
    <GoldGradient />
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill={color} stroke="#000" strokeWidth="0.2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="16" r="1.5" fill="#000" opacity="0.3" />
  </svg>
);

export const IconTrain: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} filter="url(#iconShadow)">
    <GoldGradient />
    <rect x="4" y="3" width="16" height="16" rx="2" fill={color} stroke="#000" strokeWidth="0.2" />
    <path d="M4 11h16" stroke="#000" strokeWidth="0.5" />
    <path d="M12 3v8" stroke="#000" strokeWidth="0.5" />
    <circle cx="8" cy="15" r="1.5" fill="#000" opacity="0.2" />
    <circle cx="16" cy="15" r="1.5" fill="#000" opacity="0.2" />
  </svg>
);

export const IconBolt: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} filter="url(#iconShadow)">
    <GoldGradient />
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={color} stroke="#000" strokeWidth="0.2" />
    <path d="M13 2l-2 5h4l-2 5" fill="#000" opacity="0.1" />
  </svg>
);

export const IconChip: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} filter="url(#iconShadow)">
    <GoldGradient />
    <rect x="4" y="4" width="16" height="16" rx="2" fill={color} stroke="#000" strokeWidth="0.2" />
    <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" stroke="#000" strokeWidth="0.8" />
    <rect x="9" y="9" width="6" height="6" fill="#000" fillOpacity="0.1" />
  </svg>
);

export const IconDiamond: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} filter="url(#iconShadow)">
    <GoldGradient />
    <path d="M6 3l12 0l4 6l-10 12l-10 -12z" fill={color} stroke="#000" strokeWidth="0.2" />
    <path d="M10 3l-4 6l10 12M14 3l4 6l-10 12" stroke="#000" strokeWidth="0.3" opacity="0.2"/>
  </svg>
);

export const IconWatch: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} filter="url(#iconShadow)">
    <GoldGradient />
    <circle cx="12" cy="12" r="6" fill={color} stroke="#000" strokeWidth="0.2" />
    <path d="M9 6V2h6v4M9 18v4h6v-4" stroke={color} strokeWidth="1.5" />
    <path d="M12 10v2l1 1" stroke="#000" strokeWidth="0.8" />
  </svg>
);

// Added missing icons used in TileComponent
export const IconJail: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <GoldGradient />
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" />
    <path d="M7 3v18M11 3v18M15 3v18M19 3v18" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const IconChance: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <GoldGradient />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconLuxuryChance: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <GoldGradient />
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCommunity: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <GoldGradient />
    <path d="M21 7H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" fill={color} stroke="#000" strokeWidth="0.5" />
    <path d="M1 12h22M12 7v14" stroke="#000" strokeWidth="0.5" opacity="0.3" />
  </svg>
);

export const IconDisaster: React.FC<IconProps> = ({ className, color = "url(#goldGrad)" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <GoldGradient />
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" />
    <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconLock: React.FC<IconProps> = ({ className, color = "#94a3b8" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="2" fill="rgba(0,0,0,0.5)" />
    <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const PlayerTokenIcon: React.FC<{ token: PlayerToken; className?: string; color?: string; animate?: boolean }> = ({ token, className, color, animate }) => {
  const props = { 
    className: `${className} ${animate ? 'hover:scale-110 transition-transform duration-500' : ''} drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]`, 
    color 
  };
  
  switch (token) {
    case PlayerToken.JET: return <IconJet {...props} />;
    case PlayerToken.YACHT: return <IconYacht {...props} />;
    case PlayerToken.OIL: return <IconOil {...props} />;
    case PlayerToken.CRYPTO: return <IconCrypto {...props} />;
    case PlayerToken.SCAM: return <IconScam {...props} />;
    case PlayerToken.TRAIN: return <IconTrain {...props} />;
    case PlayerToken.BOLT: return <IconBolt {...props} />;
    case PlayerToken.CHIP: return <IconChip {...props} />;
    case PlayerToken.DIAMOND: return <IconDiamond {...props} />;
    case PlayerToken.WATCH: return <IconWatch {...props} />;
    default: return <IconJet {...props} />;
  }
};
