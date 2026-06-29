// ═══════════════════════════════════════════════════════════
//  ACCESSORY VISUALS - SVG renders by rarity
// ═══════════════════════════════════════════════════════════

export const ACCESSORY_VISUALS = {
  // ─── COMMON ─────────────────────────────────────────────
  'Bat Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 20 L10 8 L14 20 L4 18 L16 28 L12 36 L20 32 L32 44 L44 32 L52 36 L48 28 L60 18 L50 20 L54 8 Z" 
          fill="#4a4a4a" stroke="#333" stroke-width="1"/>
    <path d="M32 20 L32 44" stroke="#555" stroke-width="1" opacity="0.5"/>
    <circle cx="32" cy="22" r="2" fill="#ff4444" opacity="0.8"/>
  </svg>`,

  'Devil Tail': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 52 Q20 48 16 36 Q14 28 18 20 Q22 14 32 12 Q42 14 46 20 Q50 28 48 36 Q44 48 32 52" 
          fill="none" stroke="#8B0000" stroke-width="3" stroke-linecap="round"/>
    <path d="M32 12 L34 4 L30 4 Z" fill="#ff0000"/>
    <circle cx="32" cy="6" r="2" fill="#ff4444"/>
  </svg>`,

  'Butterfly Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="20" cy="28" rx="12" ry="16" fill="#FF69B4" opacity="0.7" transform="rotate(-20 20 28)"/>
    <ellipse cx="44" cy="28" rx="12" ry="16" fill="#FF69B4" opacity="0.7" transform="rotate(20 44 28)"/>
    <ellipse cx="18" cy="40" rx="8" ry="10" fill="#FFB6C1" opacity="0.6" transform="rotate(-30 18 40)"/>
    <ellipse cx="46" cy="40" rx="8" ry="10" fill="#FFB6C1" opacity="0.6" transform="rotate(30 46 40)"/>
    <line x1="32" y1="20" x2="32" y2="44" stroke="#8B4513" stroke-width="2"/>
    <circle cx="30" cy="18" r="1" fill="#000"/>
    <circle cx="34" cy="18" r="1" fill="#000"/>
  </svg>`,

  'Bee Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="22" cy="24" rx="10" ry="14" fill="#FFD700" opacity="0.4" transform="rotate(-15 22 24)"/>
    <ellipse cx="42" cy="24" rx="10" ry="14" fill="#FFD700" opacity="0.4" transform="rotate(15 42 24)"/>
    <ellipse cx="24" cy="36" rx="7" ry="10" fill="#FFA500" opacity="0.3" transform="rotate(-25 24 36)"/>
    <ellipse cx="40" cy="36" rx="7" ry="10" fill="#FFA500" opacity="0.3" transform="rotate(25 40 36)"/>
    <path d="M28 20 L36 20 L36 44 L28 44 Z" fill="#FFD700" stroke="#000" stroke-width="1"/>
    <path d="M28 24 L36 24 M28 28 L36 28 M28 32 L36 32 M28 36 L36 36 M28 40 L36 40" stroke="#000" stroke-width="0.5"/>
  </svg>`,

  'Fairy Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 16 Q8 20 12 36 Q14 44 32 48 Q50 44 52 36 Q56 20 32 16" fill="#E0FFFF" opacity="0.5" stroke="#87CEEB" stroke-width="1"/>
    <path d="M32 16 Q20 10 16 18 Q14 24 24 28" fill="#B0E0E6" opacity="0.4"/>
    <path d="M32 16 Q44 10 48 18 Q50 24 40 28" fill="#B0E0E6" opacity="0.4"/>
    <circle cx="32" cy="32" r="3" fill="#FFD700"/>
    <circle cx="32" cy="32" r="1" fill="#FFF"/>
    <path d="M30 28 L32 24 L34 28" stroke="#FFD700" stroke-width="1" fill="none"/>
  </svg>`,

  // ─── UNCOMMON ───────────────────────────────────────────
  'Burning Tail': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 52 Q16 44 12 28 Q10 20 16 12 Q22 8 32 8 Q42 8 48 12 Q54 20 52 28 Q48 44 32 52" 
          fill="url(#burn-gradient)" stroke="#FF4500" stroke-width="1"/>
    <path d="M32 48 Q22 42 20 32 Q18 24 22 18 Q26 14 32 14 Q38 14 42 18 Q46 24 44 32 Q42 42 32 48" 
          fill="url(#burn-inner)" opacity="0.8"/>
    <path d="M30 10 L32 4 L34 10" fill="#FFD700"/>
    <circle cx="32" cy="6" r="2" fill="#FFF" opacity="0.8"/>
    <defs>
      <linearGradient id="burn-gradient" x1="32" y1="8" x2="32" y2="52">
        <stop offset="0%" stop-color="#FFD700"/>
        <stop offset="50%" stop-color="#FF8C00"/>
        <stop offset="100%" stop-color="#FF4500"/>
      </linearGradient>
      <linearGradient id="burn-inner" x1="32" y1="14" x2="32" y2="48">
        <stop offset="0%" stop-color="#FFF8DC"/>
        <stop offset="100%" stop-color="#FFD700"/>
      </linearGradient>
    </defs>
  </svg>`,

  'Shadow Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 20 L8 8 L12 24 L2 22 L18 32 L14 40 L24 36 L32 52 L40 36 L50 40 L46 32 L62 22 L52 24 L56 8 Z" 
          fill="#2F2F4F" stroke="#1a1a2e" stroke-width="1"/>
    <path d="M32 20 L32 52" stroke="#4a4a6a" stroke-width="1" opacity="0.5"/>
    <circle cx="32" cy="24" r="3" fill="#6a5acd" opacity="0.6"/>
    <circle cx="32" cy="24" r="1" fill="#fff" opacity="0.8"/>
    <path d="M20 16 Q26 20 32 16 Q38 20 44 16" stroke="#6a5acd" stroke-width="0.5" fill="none" opacity="0.5"/>
  </svg>`,

  'Wyvern Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 18 L6 6 L10 18 L2 16 L16 28 L12 36 L22 32 L32 48 L42 32 L52 36 L48 28 L62 16 L54 18 L58 6 Z" 
          fill="#8B4513" stroke="#5C3D0E" stroke-width="1.5"/>
    <path d="M32 18 L32 48" stroke="#A0522D" stroke-width="2"/>
    <path d="M16 14 L22 20 M48 14 L42 20" stroke="#A0522D" stroke-width="1"/>
    <circle cx="32" cy="22" r="4" fill="#FF6347" opacity="0.7"/>
    <circle cx="32" cy="22" r="2" fill="#FFF" opacity="0.5"/>
  </svg>`,

  // ─── RARE ───────────────────────────────────────────────
  'Dragon Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 16 L4 4 L8 16 L0 14 L14 26 L10 34 L22 30 L32 50 L42 30 L54 34 L50 26 L64 14 L56 16 L60 4 Z" 
          fill="url(#dragon-gradient)" stroke="#228B22" stroke-width="2"/>
    <path d="M32 16 L32 50" stroke="#32CD32" stroke-width="2"/>
    <path d="M14 12 L20 18 M50 12 L44 18" stroke="#32CD32" stroke-width="1.5"/>
    <circle cx="32" cy="20" r="5" fill="#FFD700" opacity="0.8"/>
    <circle cx="32" cy="20" r="2" fill="#FFF"/>
    <path d="M24 10 Q28 14 32 10 Q36 14 40 10" stroke="#FFD700" stroke-width="1" fill="none"/>
    <defs>
      <linearGradient id="dragon-gradient" x1="32" y1="4" x2="32" y2="50">
        <stop offset="0%" stop-color="#90EE90"/>
        <stop offset="50%" stop-color="#228B22"/>
        <stop offset="100%" stop-color="#006400"/>
      </linearGradient>
    </defs>
  </svg>`,

  'Phoenix Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 14 L6 6 L10 18 L0 16 L16 28 L12 38 L24 32 L32 52 L40 32 L52 38 L48 28 L64 16 L54 18 L58 6 Z" 
          fill="url(#phoenix-gradient)" stroke="#FF4500" stroke-width="2"/>
    <path d="M32 14 L32 52" stroke="#FFD700" stroke-width="2"/>
    <circle cx="32" cy="18" r="6" fill="#FFD700" opacity="0.9"/>
    <circle cx="32" cy="18" r="3" fill="#FFF"/>
    <path d="M22 8 Q27 14 32 8 Q37 14 42 8" stroke="#FFD700" stroke-width="1.5" fill="none"/>
    <circle cx="18" cy="12" r="2" fill="#FF6347" opacity="0.6"/>
    <circle cx="46" cy="12" r="2" fill="#FF6347" opacity="0.6"/>
    <defs>
      <linearGradient id="phoenix-gradient" x1="32" y1="6" x2="32" y2="52">
        <stop offset="0%" stop-color="#FFD700"/>
        <stop offset="30%" stop-color="#FF8C00"/>
        <stop offset="60%" stop-color="#FF4500"/>
        <stop offset="100%" stop-color="#DC143C"/>
      </linearGradient>
    </defs>
  </svg>`,

  // ─── EPIC ───────────────────────────────────────────────
  'Celestial Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 12 L2 4 L6 16 L-4 14 L12 26 L8 36 L20 30 L32 52 L44 30 L56 36 L52 26 L68 14 L58 16 L62 4 Z" 
          fill="url(#celestial-gradient)" stroke="#9370DB" stroke-width="2"/>
    <path d="M32 12 L32 52" stroke="#DDA0DD" stroke-width="2"/>
    <circle cx="32" cy="16" r="7" fill="#FFF" opacity="0.9"/>
    <circle cx="32" cy="16" r="4" fill="#E6E6FA"/>
    <circle cx="32" cy="16" r="2" fill="#FFF"/>
    <circle cx="16" cy="10" r="1.5" fill="#FFF" opacity="0.7"/>
    <circle cx="48" cy="10" r="1.5" fill="#FFF" opacity="0.7"/>
    <circle cx="12" cy="20" r="1" fill="#FFF" opacity="0.5"/>
    <circle cx="52" cy="20" r="1" fill="#FFF" opacity="0.5"/>
    <path d="M20 6 Q26 12 32 6 Q38 12 44 6" stroke="#FFF" stroke-width="1" fill="none" opacity="0.6"/>
    <defs>
      <linearGradient id="celestial-gradient" x1="32" y1="4" x2="32" y2="52">
        <stop offset="0%" stop-color="#E6E6FA"/>
        <stop offset="30%" stop-color="#9370DB"/>
        <stop offset="60%" stop-color="#6A5ACD"/>
        <stop offset="100%" stop-color="#483D8B"/>
      </linearGradient>
    </defs>
  </svg>`,

  'Void Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 12 L4 4 L8 16 L0 14 L14 26 L10 36 L22 30 L32 52 L42 30 L54 36 L50 26 L64 14 L56 16 L60 4 Z" 
          fill="url(#void-gradient)" stroke="#4B0082" stroke-width="2"/>
    <path d="M32 12 L32 52" stroke="#8B008B" stroke-width="2"/>
    <circle cx="32" cy="16" r="6" fill="#000" stroke="#8B008B" stroke-width="1"/>
    <circle cx="32" cy="16" r="3" fill="#4B0082"/>
    <circle cx="32" cy="16" r="1" fill="#FFF" opacity="0.8"/>
    <circle cx="18" cy="12" r="1" fill="#9932CC" opacity="0.6"/>
    <circle cx="46" cy="12" r="1" fill="#9932CC" opacity="0.6"/>
    <path d="M22 8 Q27 12 32 8 Q37 12 42 8" stroke="#9932CC" stroke-width="1" fill="none" opacity="0.5"/>
    <defs>
      <linearGradient id="void-gradient" x1="32" y1="4" x2="32" y2="52">
        <stop offset="0%" stop-color="#2F1F4F"/>
        <stop offset="30%" stop-color="#4B0082"/>
        <stop offset="60%" stop-color="#2E0854"/>
        <stop offset="100%" stop-color="#1a0a2e"/>
      </linearGradient>
    </defs>
  </svg>`,

  // ─── LEGENDARY ──────────────────────────────────────────
  'Cosmic Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 10 L0 2 L4 14 L-6 12 L10 24 L6 34 L18 28 L32 52 L46 28 L58 34 L54 24 L70 12 L60 14 L64 2 Z" 
          fill="url(#cosmic-gradient)" stroke="#FFD700" stroke-width="2"/>
    <path d="M32 10 L32 52" stroke="#FFF" stroke-width="2" opacity="0.8"/>
    <circle cx="32" cy="14" r="8" fill="#FFF" opacity="0.95"/>
    <circle cx="32" cy="14" r="5" fill="#FFD700"/>
    <circle cx="32" cy="14" r="2" fill="#FFF"/>
    <circle cx="14" cy="8" r="2" fill="#FFF" opacity="0.8"/>
    <circle cx="50" cy="8" r="2" fill="#FFF" opacity="0.8"/>
    <circle cx="10" cy="18" r="1.5" fill="#FFD700" opacity="0.7"/>
    <circle cx="54" cy="18" r="1.5" fill="#FFD700" opacity="0.7"/>
    <circle cx="18" cy="4" r="1" fill="#FFF" opacity="0.6"/>
    <circle cx="46" cy="4" r="1" fill="#FFF" opacity="0.6"/>
    <path d="M18 6 Q25 12 32 6 Q39 12 46 6" stroke="#FFD700" stroke-width="1.5" fill="none"/>
    <path d="M14 2 Q22 8 32 2 Q42 8 50 2" stroke="#FFF" stroke-width="1" fill="none" opacity="0.5"/>
    <defs>
      <linearGradient id="cosmic-gradient" x1="32" y1="2" x2="32" y2="52">
        <stop offset="0%" stop-color="#FFFACD"/>
        <stop offset="20%" stop-color="#FFD700"/>
        <stop offset="50%" stop-color="#FF8C00"/>
        <stop offset="80%" stop-color="#FF4500"/>
        <stop offset="100%" stop-color="#8B0000"/>
      </linearGradient>
    </defs>
  </svg>`,

  'Infernal Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 10 L2 4 L6 16 L-4 14 L12 26 L8 36 L20 30 L32 52 L44 30 L56 36 L52 26 L68 14 L58 16 L62 4 Z" 
          fill="url(#infernal-gradient)" stroke="#FF0000" stroke-width="2"/>
    <path d="M32 10 L32 52" stroke="#FF4500" stroke-width="2"/>
    <circle cx="32" cy="14" r="7" fill="#FF0000" opacity="0.9"/>
    <circle cx="32" cy="14" r="4" fill="#FFD700"/>
    <circle cx="32" cy="14" r="2" fill="#FFF"/>
    <path d="M16 6 L20 12 L24 6 L28 12 L32 6 L36 12 L40 6 L44 12 L48 6" stroke="#FF4500" stroke-width="1.5" fill="none"/>
    <circle cx="12" cy="10" r="1.5" fill="#FF6347" opacity="0.7"/>
    <circle cx="52" cy="10" r="1.5" fill="#FF6347" opacity="0.7"/>
    <circle cx="8" cy="20" r="1" fill="#FFD700" opacity="0.5"/>
    <circle cx="56" cy="20" r="1" fill="#FFD700" opacity="0.5"/>
    <defs>
      <linearGradient id="infernal-gradient" x1="32" y1="4" x2="32" y2="52">
        <stop offset="0%" stop-color="#FF4500"/>
        <stop offset="30%" stop-color="#FF0000"/>
        <stop offset="60%" stop-color="#DC143C"/>
        <stop offset="100%" stop-color="#8B0000"/>
      </linearGradient>
    </defs>
  </svg>`,

  // ─── MYTHIC ─────────────────────────────────────────────
  'Primordial Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 8 L-2 0 L4 14 L-8 12 L8 26 L4 38 L18 30 L32 54 L46 30 L60 38 L56 26 L72 12 L60 14 L66 0 Z" 
          fill="url(#primordial-gradient)" stroke="#9400D3" stroke-width="2.5"/>
    <path d="M32 8 L32 54" stroke="#DDA0DD" stroke-width="2.5"/>
    <circle cx="32" cy="12" r="9" fill="#FFF" opacity="1"/>
    <circle cx="32" cy="12" r="6" fill="#9400D3"/>
    <circle cx="32" cy="12" r="3" fill="#FFF"/>
    <circle cx="32" cy="12" r="1" fill="#9400D3"/>
    <circle cx="10" cy="6" r="2.5" fill="#FFF" opacity="0.9"/>
    <circle cx="54" cy="6" r="2.5" fill="#FFF" opacity="0.9"/>
    <circle cx="6" cy="16" r="2" fill="#DDA0DD" opacity="0.8"/>
    <circle cx="58" cy="16" r="2" fill="#DDA0DD" opacity="0.8"/>
    <circle cx="14" cy="2" r="1.5" fill="#FFF" opacity="0.7"/>
    <circle cx="50" cy="2" r="1.5" fill="#FFF" opacity="0.7"/>
    <path d="M16 4 Q24 10 32 4 Q40 10 48 4" stroke="#FFF" stroke-width="2" fill="none"/>
    <path d="M10 0 Q20 6 32 0 Q44 6 54 0" stroke="#DDA0DD" stroke-width="1.5" fill="none" opacity="0.6"/>
    <defs>
      <linearGradient id="primordial-gradient" x1="32" y1="0" x2="32" y2="54">
        <stop offset="0%" stop-color="#E6E6FA"/>
        <stop offset="20%" stop-color="#DDA0DD"/>
        <stop offset="40%" stop-color="#BA55D3"/>
        <stop offset="60%" stop-color="#9400D3"/>
        <stop offset="80%" stop-color="#800080"/>
        <stop offset="100%" stop-color="#4B0082"/>
      </linearGradient>
    </defs>
  </svg>`,

  'Eternity Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 6 L-4 -2 L2 12 L-10 10 L6 24 L2 36 L16 28 L32 54 L48 28 L62 36 L58 24 L74 10 L62 12 L68 -2 Z" 
          fill="url(#eternity-gradient)" stroke="#FFD700" stroke-width="3"/>
    <path d="M32 6 L32 54" stroke="#FFF" stroke-width="3" opacity="0.9"/>
    <circle cx="32" cy="10" r="10" fill="#FFF" opacity="1"/>
    <circle cx="32" cy="10" r="7" fill="#FFD700"/>
    <circle cx="32" cy="10" r="4" fill="#FFF"/>
    <circle cx="32" cy="10" r="2" fill="#FFD700"/>
    <circle cx="32" cy="10" r="0.5" fill="#FFF"/>
    <circle cx="8" cy="4" r="3" fill="#FFF" opacity="1"/>
    <circle cx="56" cy="4" r="3" fill="#FFF" opacity="1"/>
    <circle cx="4" cy="14" r="2.5" fill="#FFD700" opacity="0.9"/>
    <circle cx="60" cy="14" r="2.5" fill="#FFD700" opacity="0.9"/>
    <circle cx="12" cy="-2" r="2" fill="#FFF" opacity="0.8"/>
    <circle cx="52" cy="-2" r="2" fill="#FFF" opacity="0.8"/>
    <path d="M12 2 Q22 8 32 2 Q42 8 52 2" stroke="#FFF" stroke-width="2.5" fill="none"/>
    <path d="M6 -2 Q18 4 32 -2 Q46 4 58 -2" stroke="#FFD700" stroke-width="2" fill="none" opacity="0.7"/>
    <defs>
      <linearGradient id="eternity-gradient" x1="32" y1="-2" x2="32" y2="54">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="15%" stop-color="#FFD700"/>
        <stop offset="35%" stop-color="#FFA500"/>
        <stop offset="55%" stop-color="#FF8C00"/>
        <stop offset="75%" stop-color="#FF4500"/>
        <stop offset="100%" stop-color="#B22222"/>
      </linearGradient>
    </defs>
  </svg>`,

  // ─── IMMORTAL ───────────────────────────────────────────
  'Immortal Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 4 L-6 -4 L0 10 L-12 8 L4 22 L0 34 L14 26 L32 54 L50 26 L64 34 L60 22 L76 8 L64 10 L70 -4 Z" 
          fill="url(#immortal-gradient)" stroke="#C0C0C0" stroke-width="3"/>
    <path d="M32 4 L32 54" stroke="#FFF" stroke-width="3"/>
    <circle cx="32" cy="8" r="11" fill="#FFF" opacity="1"/>
    <circle cx="32" cy="8" r="8" fill="#C0C0C0"/>
    <circle cx="32" cy="8" r="5" fill="#FFF"/>
    <circle cx="32" cy="8" r="3" fill="#C0C0C0"/>
    <circle cx="32" cy="8" r="1.5" fill="#FFF"/>
    <circle cx="6" cy="2" r="3.5" fill="#FFF" opacity="1"/>
    <circle cx="58" cy="2" r="3.5" fill="#FFF" opacity="1"/>
    <circle cx="2" cy="12" r="3" fill="#C0C0C0" opacity="0.9"/>
    <circle cx="62" cy="12" r="3" fill="#C0C0C0" opacity="0.9"/>
    <circle cx="10" cy="-4" r="2.5" fill="#FFF" opacity="0.9"/>
    <circle cx="54" cy="-4" r="2.5" fill="#FFF" opacity="0.9"/>
    <circle cx="16" cy="0" r="2" fill="#C0C0C0" opacity="0.8"/>
    <circle cx="48" cy="0" r="2" fill="#C0C0C0" opacity="0.8"/>
    <path d="M10 0 Q21 6 32 0 Q43 6 54 0" stroke="#FFF" stroke-width="3" fill="none"/>
    <path d="M4 -4 Q18 2 32 -4 Q46 2 60 -4" stroke="#C0C0C0" stroke-width="2.5" fill="none" opacity="0.7"/>
    <defs>
      <linearGradient id="immortal-gradient" x1="32" y1="-4" x2="32" y2="54">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="15%" stop-color="#F0F0F0"/>
        <stop offset="35%" stop-color="#D3D3D3"/>
        <stop offset="55%" stop-color="#C0C0C0"/>
        <stop offset="75%" stop-color="#A9A9A9"/>
        <stop offset="100%" stop-color="#808080"/>
      </linearGradient>
    </defs>
  </svg>`,

  'Deathless Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 4 L-6 -4 L0 10 L-12 8 L4 22 L0 34 L14 26 L32 54 L50 26 L64 34 L60 22 L76 8 L64 10 L70 -4 Z" 
          fill="url(#deathless-gradient)" stroke="#228B22" stroke-width="3"/>
    <path d="M32 4 L32 54" stroke="#90EE90" stroke-width="3"/>
    <circle cx="32" cy="8" r="11" fill="#FFF" opacity="1"/>
    <circle cx="32" cy="8" r="8" fill="#228B22"/>
    <circle cx="32" cy="8" r="5" fill="#90EE90"/>
    <circle cx="32" cy="8" r="3" fill="#FFF"/>
    <circle cx="32" cy="8" r="1.5" fill="#228B22"/>
    <circle cx="6" cy="2" r="3.5" fill="#FFF" opacity="1"/>
    <circle cx="58" cy="2" r="3.5" fill="#FFF" opacity="1"/>
    <circle cx="2" cy="12" r="3" fill="#90EE90" opacity="0.9"/>
    <circle cx="62" cy="12" r="3" fill="#90EE90" opacity="0.9"/>
    <circle cx="10" cy="-4" r="2.5" fill="#FFF" opacity="0.9"/>
    <circle cx="54" cy="-4" r="2.5" fill="#FFF" opacity="0.9"/>
    <circle cx="16" cy="0" r="2" fill="#90EE90" opacity="0.8"/>
    <circle cx="48" cy="0" r="2" fill="#90EE90" opacity="0.8"/>
    <path d="M10 0 Q21 6 32 0 Q43 6 54 0" stroke="#FFF" stroke-width="3" fill="none"/>
    <path d="M4 -4 Q18 2 32 -4 Q46 2 60 -4" stroke="#90EE90" stroke-width="2.5" fill="none" opacity="0.7"/>
    <defs>
      <linearGradient id="deathless-gradient" x1="32" y1="-4" x2="32" y2="54">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="15%" stop-color="#90EE90"/>
        <stop offset="35%" stop-color="#32CD32"/>
        <stop offset="55%" stop-color="#228B22"/>
        <stop offset="75%" stop-color="#006400"/>
        <stop offset="100%" stop-color="#004d00"/>
      </linearGradient>
    </defs>
  </svg>`,

  // ─── ARCHGOD ────────────────────────────────────────────
  'Omega Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 2 L-8 -6 L-2 10 L-14 8 L2 22 L-2 36 L12 28 L32 56 L52 28 L66 36 L62 22 L78 8 L66 10 L72 -6 Z" 
          fill="url(#omega-gradient)" stroke="#FFD700" stroke-width="3.5"/>
    <path d="M32 2 L32 56" stroke="#FFF" stroke-width="3.5"/>
    <circle cx="32" cy="6" r="12" fill="#FFF" opacity="1"/>
    <circle cx="32" cy="6" r="9" fill="#FFD700"/>
    <circle cx="32" cy="6" r="6" fill="#FFF"/>
    <circle cx="32" cy="6" r="4" fill="#FFD700"/>
    <circle cx="32" cy="6" r="2" fill="#FFF"/>
    <circle cx="32" cy="6" r="0.8" fill="#FFD700"/>
    <circle cx="4" cy="0" r="4" fill="#FFF" opacity="1"/>
    <circle cx="60" cy="0" r="4" fill="#FFF" opacity="1"/>
    <circle cx="0" cy="10" r="3.5" fill="#FFD700" opacity="0.95"/>
    <circle cx="64" cy="10" r="3.5" fill="#FFD700" opacity="0.95"/>
    <circle cx="8" cy="-6" r="3" fill="#FFF" opacity="0.95"/>
    <circle cx="56" cy="-6" r="3" fill="#FFF" opacity="0.95"/>
    <circle cx="14" cy="-2" r="2.5" fill="#FFD700" opacity="0.9"/>
    <circle cx="50" cy="-2" r="2.5" fill="#FFD700" opacity="0.9"/>
    <circle cx="20" cy="2" r="2" fill="#FFF" opacity="0.8"/>
    <circle cx="44" cy="2" r="2" fill="#FFF" opacity="0.8"/>
    <path d="M8 -2 Q20 4 32 -2 Q44 4 56 -2" stroke="#FFF" stroke-width="3.5" fill="none"/>
    <path d="M2 -6 Q16 0 32 -6 Q48 0 62 -6" stroke="#FFD700" stroke-width="3" fill="none" opacity="0.8"/>
    <path d="M-2 -10 Q14 -4 32 -10 Q50 -4 66 -10" stroke="#FFF" stroke-width="2" fill="none" opacity="0.5"/>
    <defs>
      <linearGradient id="omega-gradient" x1="32" y1="-6" x2="32" y2="56">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="10%" stop-color="#FFFACD"/>
        <stop offset="25%" stop-color="#FFD700"/>
        <stop offset="45%" stop-color="#FFA500"/>
        <stop offset="65%" stop-color="#FF8C00"/>
        <stop offset="85%" stop-color="#FF4500"/>
        <stop offset="100%" stop-color="#B22222"/>
      </linearGradient>
    </defs>
  </svg>`,

  'Divine Wings': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 2 L-8 -6 L-2 10 L-14 8 L2 22 L-2 36 L12 28 L32 56 L52 28 L66 36 L62 22 L78 8 L66 10 L72 -6 Z" 
          fill="url(#divine-gradient)" stroke="#FFD700" stroke-width="3.5"/>
    <path d="M32 2 L32 56" stroke="#FFF" stroke-width="3.5"/>
    <circle cx="32" cy="6" r="12" fill="#FFF" opacity="1"/>
    <circle cx="32" cy="6" r="9" fill="#FFD700"/>
    <circle cx="32" cy="6" r="6" fill="#FFF"/>
    <circle cx="32" cy="6" r="4" fill="#FFD700"/>
    <circle cx="32" cy="6" r="2" fill="#FFF"/>
    <circle cx="32" cy="6" r="0.8" fill="#FFD700"/>
    <circle cx="4" cy="0" r="4" fill="#FFF" opacity="1"/>
    <circle cx="60" cy="0" r="4" fill="#FFF" opacity="1"/>
    <circle cx="0" cy="10" r="3.5" fill="#FFD700" opacity="0.95"/>
    <circle cx="64" cy="10" r="3.5" fill="#FFD700" opacity="0.95"/>
    <circle cx="8" cy="-6" r="3" fill="#FFF" opacity="0.95"/>
    <circle cx="56" cy="-6" r="3" fill="#FFF" opacity="0.95"/>
    <circle cx="14" cy="-2" r="2.5" fill="#FFD700" opacity="0.9"/>
    <circle cx="50" cy="-2" r="2.5" fill="#FFD700" opacity="0.9"/>
    <circle cx="20" cy="2" r="2" fill="#FFF" opacity="0.8"/>
    <circle cx="44" cy="2" r="2" fill="#FFF" opacity="0.8"/>
    <path d="M8 -2 Q20 4 32 -2 Q44 4 56 -2" stroke="#FFF" stroke-width="3.5" fill="none"/>
    <path d="M2 -6 Q16 0 32 -6 Q48 0 62 -6" stroke="#FFD700" stroke-width="3" fill="none" opacity="0.8"/>
    <path d="M-2 -10 Q14 -4 32 -10 Q50 -4 66 -10" stroke="#FFF" stroke-width="2" fill="none" opacity="0.5"/>
    <defs>
      <linearGradient id="divine-gradient" x1="32" y1="-6" x2="32" y2="56">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="10%" stop-color="#FFFACD"/>
        <stop offset="25%" stop-color="#FFD700"/>
        <stop offset="45%" stop-color="#FFA500"/>
        <stop offset="65%" stop-color="#FF8C00"/>
        <stop offset="85%" stop-color="#FF4500"/>
        <stop offset="100%" stop-color="#B22222"/>
      </linearGradient>
    </defs>
  </svg>`
};

// Function to get accessory visual by name
export function getAccessoryVisual(name) {
  return ACCESSORY_VISUALS[name] || ACCESSORY_VISUALS['Bat Wings'];
}

// Function to get rarity color for accessory
export function getAccessoryRarityColor(rarity) {
  const colors = {
    common: '#aaa',
    uncommon: '#4caf50',
    rare: '#2196f3',
    epic: '#9c27b0',
    legendary: '#ff9800',
    mythic: '#f44336',
    immortal: '#e0e0e0',
    archgod: '#ff6f00'
  };
  return colors[rarity] || '#aaa';
}
