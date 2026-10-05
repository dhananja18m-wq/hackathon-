import React from 'react';

// SVG Component illustrations matching hardware context
export function ArduinoIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="280" rx="16" fill="#1B4D3E" />
      {/* PCB body */}
      <rect x="30" y="30" width="340" height="220" rx="10" fill="#008184" stroke="#005E60" strokeWidth="3" />
      {/* USB Connector */}
      <rect x="15" y="50" width="45" height="50" rx="4" fill="#C0C7CE" stroke="#8E99A2" strokeWidth="2" />
      <rect x="25" y="62" width="25" height="26" fill="#4B5563" />
      {/* DC Barrel Jack */}
      <rect x="20" y="150" width="45" height="40" rx="4" fill="#1F2937" />
      <circle cx="35" cy="170" r="8" fill="#4B5563" />
      {/* ATmega328P Chip */}
      <rect x="180" y="130" width="120" height="35" rx="3" fill="#111827" stroke="#374151" strokeWidth="1.5" />
      <circle cx="190" cy="147" r="3" fill="#9CA3AF" />
      <text x="205" y="152" fill="#9CA3AF" fontSize="11" fontFamily="monospace" fontWeight="bold">ATMEGA328P</text>
      {/* Crystal Oscillator */}
      <rect x="135" y="95" width="22" height="12" rx="3" fill="#D1D5DB" stroke="#9CA3AF" />
      {/* Header Pins Top */}
      <rect x="110" y="38" width="240" height="16" rx="2" fill="#1F2937" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={118 + i * 16} y="42" width="8" height="8" rx="1" fill="#FBBF24" />
      ))}
      {/* Header Pins Bottom */}
      <rect x="130" y="226" width="220" height="16" rx="2" fill="#1F2937" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={138 + i * 17} y="230" width="8" height="8" rx="1" fill="#FBBF24" />
      ))}
      {/* Arduino Logo & Text */}
      <circle cx="240" cy="85" r="14" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
      <circle cx="260" cy="85" r="14" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
      <text x="200" y="112" fill="#FFFFFF" fontSize="16" fontFamily="sans-serif" fontWeight="bold" letterSpacing="1">ARDUINO</text>
      <text x="282" y="112" fill="#D4F55C" fontSize="13" fontFamily="sans-serif" fontWeight="bold">UNO</text>
      {/* LEDs */}
      <circle cx="165" cy="75" r="3" fill="#10B981" />
      <circle cx="165" cy="85" r="3" fill="#EF4444" />
    </svg>
  );
}

export function PlantMonitorHeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 340" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="520" height="340" rx="16" fill="#F4EFE6" />
      {/* Wooden Table background */}
      <rect y="230" width="520" height="110" fill="#DECBB7" />
      <line x1="0" y1="230" x2="520" y2="230" stroke="#C5B19D" strokeWidth="3" />
      {/* Terracotta Pot */}
      <polygon points="260,130 380,130 355,270 285,270" fill="#C86A4B" />
      <rect x="250" y="120" width="140" height="18" rx="4" fill="#B75839" />
      {/* Soil */}
      <ellipse cx="320" cy="130" rx="55" ry="10" fill="#3D2817" />
      {/* Basil Plant Leaves */}
      <path d="M320 130 Q315 80 290 50 Q330 65 320 130" fill="#2E7D32" />
      <path d="M320 110 Q350 70 380 60 Q350 95 320 125" fill="#43A047" />
      <path d="M320 90 Q300 40 330 20 Q340 50 320 90" fill="#388E3C" />
      <path d="M320 120 Q280 100 270 90 Q295 115 320 125" fill="#4CAF50" />
      {/* Capacitive Soil Probe inserted */}
      <rect x="295" y="100" width="16" height="60" rx="2" fill="#1E293B" stroke="#D4F55C" strokeWidth="1.5" />
      <line x1="303" y1="100" x2="303" y2="75" stroke="#EF4444" strokeWidth="2.5" />
      <line x1="300" y1="100" x2="290" y2="75" stroke="#10B981" strokeWidth="2.5" />
      <line x1="306" y1="100" x2="315" y2="75" stroke="#3B82F6" strokeWidth="2.5" />
      {/* Arduino on Table */}
      <rect x="70" y="240" width="140" height="75" rx="6" fill="#008184" stroke="#005E60" strokeWidth="2" />
      <rect x="62" y="250" width="18" height="20" rx="2" fill="#9CA3AF" />
      <rect x="120" y="265" width="45" height="18" fill="#111827" />
      {/* Jumper Wires connecting probe to Arduino */}
      <path d="M290 75 C 240 60, 160 180, 140 240" stroke="#10B981" strokeWidth="2.5" fill="none" strokeDasharray="4 2" />
      <path d="M303 75 C 260 70, 170 190, 150 240" stroke="#EF4444" strokeWidth="2.5" fill="none" />
      <path d="M315 75 C 275 80, 180 200, 160 240" stroke="#3B82F6" strokeWidth="2.5" fill="none" />
      {/* Status LED glowing */}
      <circle cx="180" cy="255" r="7" fill="#10B981" />
      <circle cx="180" cy="255" r="14" fill="#10B981" fillOpacity="0.3" />
    </svg>
  );
}

export function DeskLightIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" rx="12" fill="#24342D" />
      <circle cx="150" cy="100" r="45" fill="#FBBF24" fillOpacity="0.2" />
      <circle cx="150" cy="100" r="28" fill="#FDE68A" />
      <rect x="135" y="128" width="30" height="40" rx="4" fill="#6B7280" />
      <line x1="150" y1="168" x2="150" y2="190" stroke="#9CA3AF" strokeWidth="4" />
      <rect x="110" y="188" width="80" height="8" rx="3" fill="#374151" />
      {/* Photoresistor on base */}
      <circle cx="130" cy="184" r="5" fill="#DC2626" />
      <path d="M128 184 Q130 181 132 184 Q134 187 132 184" stroke="#FDE68A" strokeWidth="1" fill="none" />
    </svg>
  );
}
