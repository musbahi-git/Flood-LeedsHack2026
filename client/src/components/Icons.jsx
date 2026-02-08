import React from 'react';

// Incident Alert (red → orange gradient)
export const IncidentIcon = ({ size = 24, gradient = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {gradient && (
      <defs>
        <linearGradient id="grad-incident" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
    )}
    <circle cx="12" cy="12" r="10" stroke={gradient ? "url(#grad-incident)" : "currentColor"} />
    <line x1="12" y1="8" x2="12" y2="12" stroke={gradient ? "url(#grad-incident)" : "currentColor"} />
    <line x1="12" y1="16" x2="12.01" y2="16" stroke={gradient ? "url(#grad-incident)" : "currentColor"} />
  </svg>
);

// Need Help - Heart (orange → amber gradient)
export const NeedHelpIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="grad-needhelp" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="url(#grad-needhelp)" />
    <path d="M12 5.67V21.23" stroke="url(#grad-needhelp)" />
  </svg>
);

// Can Help - Users (green → cyan gradient)
export const CanHelpIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="grad-canhelp" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="url(#grad-canhelp)" />
    <circle cx="9" cy="7" r="4" stroke="url(#grad-canhelp)" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="url(#grad-canhelp)" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="url(#grad-canhelp)" />
  </svg>
);

// Flood / Water Droplet (cyan → blue gradient)
export const FloodIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="grad-flood" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="url(#grad-flood)" />
  </svg>
);

// Location Pin (cyan → light cyan gradient)
export const LocationIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="grad-location" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#67e8f9" />
      </linearGradient>
    </defs>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="url(#grad-location)" />
    <circle cx="12" cy="10" r="3" stroke="url(#grad-location)" />
  </svg>
);

// Power / Zap (amber → yellow gradient)
export const PowerIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="grad-power" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="url(#grad-power)" />
  </svg>
);

// Travel / Car (blue → violet gradient)
export const TravelIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="grad-travel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" stroke="url(#grad-travel)" />
    <circle cx="7" cy="17" r="2" stroke="url(#grad-travel)" />
    <path d="M9 17h6" stroke="url(#grad-travel)" />
    <circle cx="17" cy="17" r="2" stroke="url(#grad-travel)" />
  </svg>
);

// Medical / Plus Circle (red → pink gradient)
export const MedicalIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="grad-medical" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#grad-medical)" />
    <line x1="12" y1="8" x2="12" y2="16" stroke="url(#grad-medical)" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="url(#grad-medical)" />
  </svg>
);

// Supplies / Package (violet → indigo gradient)
export const SuppliesIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="grad-supplies" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" stroke="url(#grad-supplies)" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="url(#grad-supplies)" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="url(#grad-supplies)" />
    <line x1="12" y1="22.08" x2="12" y2="12" stroke="url(#grad-supplies)" />
  </svg>
);

// Other / Clipboard (slate gradient)
export const OtherIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="grad-other" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
    </defs>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="url(#grad-other)" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="url(#grad-other)" />
  </svg>
);

// Route / Navigation Path (currentColor - inherits from parent)
export const RouteIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </svg>
);

// List / Menu (currentColor - inherits from parent)
export const ListIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

// Chevron Down (currentColor - for dropdowns)
export const ChevronDownIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
