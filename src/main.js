// Farborn v3.4 — Enhanced Map

const HEROES = [
  { id:'warrior',  name:'Warrior',  emoji:'⚔️', color:'#e53935', baseHp:120, baseAtk:15, baseDef:10, spd:1.0, melee:true },
  { id:'mage',     name:'Mage',     emoji:'🔮', color:'#9c27b0', baseHp:80,  baseAtk:25, baseDef:5,  spd:0.8, melee:false },
  { id:'rogue',    name:'Rogue',    emoji:'🗡️', color:'#8e24aa', baseHp:90,  baseAtk:20, baseDef:7,  spd:1.5, melee:true },
  { id:'ranger',   name:'Ranger',   emoji:'🏹', color:'#43a047', baseHp:95,  baseAtk:18, baseDef:8,  spd:1.2, melee:false },
  { id:'paladin',  name:'Paladin',  emoji:'🛡️', color:'#1e88e5', baseHp:140, baseAtk:12, baseDef:15, spd:0.7, melee:true },
  { id:'necromancer',name:'Necro',  emoji:'💀', color:'#f44336', baseHp:85,  baseAtk:22, baseDef:6,  spd:0.9, melee:false }
]
// Per-hero level growth (per 1 level)
const HERO_GROWTH = {
  warrior:    { atk:2.0, def:1.5, hp:12, spd:0.02 },  // tanky fighter, steady
  mage:       { atk:3.0, def:0.6, hp:6,  spd:0.01 },  // glass cannon, slow cast
  rogue:      { atk:2.8, def:0.8, hp:8,  spd:0.04 },  // assassin, fast
  ranger:     { atk:2.2, def:1.0, hp:9,  spd:0.03 },  // balanced ranged
  paladin:    { atk:1.2, def:2.5, hp:15, spd:0.01 },  // ultimate tank, slow
  necromancer:{ atk:3.2, def:0.5, hp:5,  spd:0.02 }   // extreme glass cannon
}

const MOBS = [
  { name:'Slime',      emoji:'🟢', hp:80,   atk:15,  def:4,  exp:15,  gold:8,   color:'#4caf50', ranged:false },
  { name:'Goblin',     emoji:'👺', hp:130,  atk:22,  def:8,  exp:30,  gold:18,  color:'#ff9800', ranged:false },
  { name:'Skeleton',   emoji:'💀', hp:180,  atk:30,  def:12, exp:50,  gold:30,  color:'#9e9e9e', ranged:true, skill:'Bone Arrow', skillCd:2.5 },
  { name:'Wolf',       emoji:'🐺', hp:150,  atk:35,  def:8,  exp:45,  gold:22,  color:'#795548', ranged:false },
  { name:'Orc',        emoji:'👹', hp:280,  atk:45,  def:18, exp:75,  gold:45,  color:'#4caf50', ranged:false },
  { name:'Dark Knight',emoji:'🖤', hp:400,  atk:60,  def:22, exp:120, gold:75,  color:'#212121', ranged:false },
  { name:'Demon',      emoji:'😈', hp:550,  atk:80,  def:28, exp:180, gold:120, color:'#f44336', ranged:true, skill:'Hellfire', skillCd:3 },
  { name:'Dragon',     emoji:'🐉', hp:900,  atk:120, def:40, exp:350, gold:220, color:'#ff5722', ranged:true, skill:'Fire Breath', skillCd:4 }
]
// Epic boss names for each mob type
const BOSS_NAMES = [
  '☠️ ARCHSLIME LORD', '👹 GOBLIN WARLORD', '💀 BONE REAPER',
  '🌑 ALPHA WEREWOLF', '🔴 ORC CHIEFTAIN', '⚔️ DARK PALADIN',
  '🔥 HELL LORD', '🐉 ELDER DRAGON'
]
const BOSS_COLORS = ['#00ff88', '#ff6600', '#aaaaaa', '#553333', '#22aa22', '#ff00ff', '#ff2200', '#ff4400']
// Per-type boss visual config
const BOSS_VISUALS = {
  slime:     { bodyColor:'#00e676', accentColor:'#69f0ae', eyeColor:'#fff', hornType:'none', wingType:'none', weaponType:'none', auraColor:'rgba(0,230,118,', hasTentacles:true, hasCrown:true, mouthType:'wavy' },
  goblin:    { bodyColor:'#ff6d00', accentColor:'#ffab40', eyeColor:'#ffeb3b', hornType:'none', wingType:'none', weaponType:'club', auraColor:'rgba(255,109,0,', hasTentacles:false, hasCrown:true, mouthType:'fangs' },
  skeleton:  { bodyColor:'#e0e0e0', accentColor:'#f5f5f5', eyeColor:'#7c4dff', hornType:'none', wingType:'ghost', weaponType:'scythe', auraColor:'rgba(124,77,255,', hasTentacles:false, hasCrown:true, mouthType:'skull' },
  wolf:      { bodyColor:'#4e342e', accentColor:'#8d6e63', eyeColor:'#ffeb3b', hornType:'none', wingType:'none', weaponType:'claws', auraColor:'rgba(78,52,46,', hasTentacles:false, hasCrown:true, mouthType:'beast', hasFur:true },
  orc:       { bodyColor:'#1b5e20', accentColor:'#66bb6a', eyeColor:'#f44336', hornType:'tusks', wingType:'none', weaponType:'axe', auraColor:'rgba(27,94,32,', hasTentacles:false, hasCrown:true, mouthType:'tusks' },
  darkknight:{ bodyColor:'#1a1a2e', accentColor:'#37474f', eyeColor:'#ff1744', hornType:'none', wingType:'dark', weaponType:'sword', auraColor:'rgba(63,81,181,', hasTentacles:false, hasCrown:true, mouthType:'visor' },
  demon:     { bodyColor:'#b71c1c', accentColor:'#ff5252', eyeColor:'#ffeb3b', hornType:'demon', wingType:'bat', weaponType:'trident', auraColor:'rgba(183,28,28,', hasTentacles:false, hasCrown:true, mouthType:'beast' },
  dragon:    { bodyColor:'#e65100', accentColor:'#ff9800', eyeColor:'#ffeb3b', hornType:'dragon', wingType:'dragon', weaponType:'none', auraColor:'rgba(230,81,0,', hasTentacles:false, hasCrown:true, mouthType:'beast', hasScales:true }
}

// Map mob name to boss visual key
const BOSS_MOB_KEY = { 'Slime':'slime','Goblin':'goblin','Skeleton':'skeleton','Wolf':'wolf','Orc':'orc','Dark Knight':'darkknight','Demon':'demon','Dragon':'dragon' }

// ─── ZONES (INFINITE) ──────────────────────────────────
const ZONES_BASE = [
  { name:'Green Meadow', bg:'#1a3a1a', ground:'#2d5a2d', mobs:[0,1],   reqKills:0 },
  { name:'Dark Forest',  bg:'#1a2a1a', ground:'#1d3a1d', mobs:[1,2,3], reqKills:15 },
  { name:'Cursed Lands', bg:'#2a1a2a', ground:'#3a1d3a', mobs:[2,3,4], reqKills:40 },
  { name:'Demon Realm',  bg:'#3a0a0a', ground:'#4a1d1d', mobs:[4,5,6], reqKills:80 },
  { name:'Dragon Peak',  bg:'#2a1a0a', ground:'#3a2d1d', mobs:[5,6,7], reqKills:150 }
]
const ZONES_INF = ['Ancient Ruins','Shadow Abyss','Void Gate','Astral Realm','Chaos Dimension','Hell Core','Cosmic Storm','Eternal Void','Inferno Gate','Infinite Abyss']
const ZONE_LVL_REQ = [1, 10, 25, 50, 80]
function getZone(idx) {
  if (idx < ZONES_BASE.length) return ZONES_BASE[idx]
  const loop = Math.floor((idx - ZONES_BASE.length) / ZONES_INF.length) + 2
  const infIdx = (idx - ZONES_BASE.length) % ZONES_INF.length
  const name = ZONES_INF[infIdx] + ' ' + loop
  const bgHue = (idx * 47) % 360
  return { name, bg:`hsl(${bgHue},40%,10%)`, ground:`hsl(${bgHue},40%,18%)`, mobs:[5,6,7], reqKills: 150 + (idx - ZONES_BASE.length + 1) * 100 }
}
function getZoneLvlReq(idx) {
  if (idx < ZONE_LVL_REQ.length) return ZONE_LVL_REQ[idx]
  return ZONE_LVL_REQ[ZONE_LVL_REQ.length-1] + (idx - ZONE_LVL_REQ.length + 1) * 50
}
function totalZones() { return Infinity }

// SKILLS: main + sub (sub unlocked at level 8)
// aoe: true = damage all mobs, false = single target (front mob only)
const SKILLS = {
  warrior: [
    { name:'Whirlwind',  emoji:'🌀', cd:8,  mult:2.0, aoe:true },   // AoE spin
    { name:'Cleave',     emoji:'🗡️', cd:5,  mult:1.8, aoe:false }   // Single heavy hit
  ],
  mage: [
    { name:'Fireball',   emoji:'🔥', cd:6,  mult:3.0, aoe:true },   // AoE explosion
    { name:'Blizzard',   emoji:'❄️', cd:10, mult:2.5, aoe:true }    // AoE freeze (mage ALL AoE)
  ],
  rogue: [
    { name:'Backstab',   emoji:'🗡️', cd:5,  mult:2.5, aoe:false },  // Single assassin hit
    { name:'Fan of Knives', emoji:'💨', cd:7, mult:1.8, aoe:true }  // AoE shuriken
  ],
  ranger: [
    { name:'Arrow Rain', emoji:'🌧️', cd:7,  mult:2.2, aoe:true },   // AoE arrows
    { name:'Piercing Shot', emoji:'➡️', cd:4, mult:2.0, aoe:false } // Single pierce
  ],
  paladin: [
    { name:'Holy Smite', emoji:'⚡', cd:10, mult:1.8, aoe:true },   // AoE holy
    { name:'Shield Bash', emoji:'🛡️', cd:6,  mult:2.2, aoe:false }  // Single stun
  ],
  necromancer: [
    { name:'Death Coil', emoji:'☠️', cd:6,  mult:2.8, aoe:true },   // AoE poison
    { name:'Soul Drain', emoji:'👻', cd:8,  mult:3.5, aoe:false }   // Single drain
  ]
}
// ─── STATUS EFFECTS ──────────────────────────────────────
const STATUS_EFFECTS = {
  crit:   { name:'Critical', color:'#ff4444', icon:'💥' },
  stun:   { name:'Stun',     color:'#ffd700', icon:'💫', duration:2.0 },
  freeze: { name:'Freeze',   color:'#64b5f6', icon:'🧊', duration:3.0, dmgBonus:1.2 },
  burn:   { name:'Burn',     color:'#ff6600', icon:'🔥', duration:3.0, tickInterval:0.5, tickPct:0.03 },
  poison: { name:'Poison',   color:'#7b1fa2', icon:'☠️', duration:4.0, tickInterval:1.0, tickFlat:8 },
  slow:   { name:'Slow',     color:'#42a5f5', icon:'🐌', duration:3.0, speedMult:0.5 }
}
const HERO_CRIT_RATE = { warrior:0.05, mage:0.08, rogue:0.15, ranger:0.10, paladin:0.03, necromancer:0.10 }
const CRIT_MULT = 1.5
// Status helpers
function applyStatus(target, type, duration) {
  if (!target.statusEffects) target.statusEffects = []
  target.statusEffects = target.statusEffects.filter(e => e.type !== type)
  const def = STATUS_EFFECTS[type]
  target.statusEffects.push({ type, duration, maxDuration: duration, tickTimer: def.tickInterval || 0 })
}
function isStunned(gm) { return gm.statusEffects && gm.statusEffects.some(e => e.type === 'stun') }
function isFrozen(gm)  { return gm.statusEffects && gm.statusEffects.some(e => e.type === 'freeze') }
function isSlowed(gm)  { return gm.statusEffects && gm.statusEffects.some(e => e.type === 'slow') }
function getSlowMult(gm) { return isSlowed(gm) ? STATUS_EFFECTS.slow.speedMult : 1 }
function processStatusEffects(dt) {
  for (const gm of state.mobs) {
    if (!gm.statusEffects) gm.statusEffects = []
    for (let i = gm.statusEffects.length - 1; i >= 0; i--) {
      const eff = gm.statusEffects[i]
      eff.duration -= dt
      if (eff.duration <= 0) { gm.statusEffects.splice(i, 1); continue }
      if (eff.tickTimer !== undefined) {
        eff.tickTimer -= dt
        if (eff.tickTimer <= 0) {
          const def = STATUS_EFFECTS[eff.type]
          eff.tickTimer = def.tickInterval
          if (eff.type === 'burn') {
            const burnDmg = Math.max(1, Math.floor(gm.maxHp * def.tickPct))
            gm.hp -= burnDmg
            const bx = gm.x + 18*getS(), by = canvas.height*0.48
            for (let p = 0; p < 3; p++) state.particles.push({ x:bx+Math.random()*10-5, y:by, vx:(Math.random()-0.5)*30, vy:-40-Math.random()*30, size:3*getS(), life:0.5, color:p===0?'#ff4400':p===1?'#ff8800':'#ffcc00' })
          }
          if (eff.type === 'poison') {
            const poisonDmg = Math.max(1, Math.floor(totalAtk() * 0.15))
            gm.hp -= poisonDmg
            const px = gm.x + 18*getS(), py = canvas.height*0.48
            for (let p = 0; p < 2; p++) state.particles.push({ x:px+Math.random()*8-4, y:py, vx:(Math.random()-0.5)*20, vy:-20-Math.random()*20, size:2.5*getS(), life:0.6, color:'#7b1fa2' })
          }
          // If DoT killed the mob, trigger death like playerAttack does
          if (gm.hp <= 0 && !gm.dying) {
            gm.hp = 0; gm.dying = true; gm.deathTimer = 0.8
            state.totalKills++; state.zoneKills++
            if (gm.mob.boss) {
              state.isBoss = false; state.bossKillCounter = 0
              addCombatLog('👑 BOSS DEFEATED! (DoT kill)')
            } else {
              state.bossKillCounter++
            }
            const g = Math.floor(gm.mob.gold * (gm.mob.boss ? 10 : 1) * (state.nightmare ? 2 : 1))
            const e = Math.floor(gm.mob.exp * (gm.mob.boss ? 5 : 1) * (state.nightmare ? 2 : 1))
            state.gold += g; addExp(e)
            addCombatLog(`${gm.mob.name} slain by DoT! +${g}G +${e}EXP`)
            const drop = rollEquipDrop(state.zone, gm.mob.boss)
            if (drop) {
              state.floatTexts.push({ text: `${drop.emoji} ${drop.name} → Bag`, y:canvas.height*0.38, color:drop.rarityColor, size:12, life:1.5, x:canvas.width/2+40 })
              addCombatLog(`Got ${drop.name}`)
            }
            if (state.bossKillCounter >= 50 && !state.isBoss && !state.bossWarning) {
              state.bossWarning = true; state.bossWarningTimer = 2.0
            }
            syncPrimaryMobRefs()
          }
        }
      }
    }
  }
}
function getSkill(heroId, skillIdx) {
  const list = SKILLS[heroId]
  return list ? list[Math.min(skillIdx || 0, list.length - 1)] : null
}
function switchSkill() {
  // Auto-skill: no manual swap needed
}
function updateSkillBtn() {
  // Auto-skill: no button to update
}

const UPGRADES = {
  atk: { name:'ATK',   baseCost:20, costMult:1.8, amount:3 },
  def: { name:'DEF',   baseCost:25, costMult:1.9, amount:2 },
  hp:  { name:'HP',    baseCost:15, costMult:1.7, amount:15 },
  spd: { name:'SPD',   baseCost:50, costMult:2.2, amount:0.05 }
}

// ─── EQUIPMENT SYSTEM ───────────────────────────────────
const EQUIP_TYPES = {
  weapon: { name:'Weapon',  slot:'weapon',  emoji:'⚔️' },  /* hero-specific SVGs in HEROES */
  armor:  { name:'Armor',   slot:'armor',   emoji:'🛡️',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 14 L32 6 L48 14 L50 36 L44 56 L20 56 L14 36Z" fill="url(#ar-body)" stroke="#8B6914" stroke-width="1.5"/><path d="M16 14 L32 6 L48 14 L48 20 L32 14 L16 20Z" fill="url(#ar-shoulder)"/><path d="M26 30 L32 26 L38 30 L38 40 L32 44 L26 40Z" fill="#C0392B" stroke="#FFD700" stroke-width="1"/><circle cx="32" cy="35" r="3" fill="#FFD700"/><circle cx="32" cy="35" r="1.5" fill="#E74C3C"/><path d="M18 20 L12 28 L14 30 L18 24Z" fill="url(#ar-arm)"/><path d="M46 20 L52 28 L50 30 L46 24Z" fill="url(#ar-arm)"/><defs><linearGradient id="ar-body" x1="32" y1="6" x2="32" y2="56"><stop stop-color="#5D6D7E"/><stop offset="0.5" stop-color="#34495E"/><stop offset="1" stop-color="#2C3E50"/></linearGradient><linearGradient id="ar-shoulder" x1="16" y1="6" x2="48" y2="20"><stop stop-color="#8B6914"/><stop offset="1" stop-color="#DAA520"/></linearGradient><linearGradient id="ar-arm" x1="12" y1="20" x2="18" y2="30"><stop stop-color="#5D6D7E"/><stop offset="1" stop-color="#34495E"/></linearGradient></defs></svg>` },
  shield: { name:'Shield',  slot:'shield',  emoji:'🛡️',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32 4 L54 16 L54 36 L32 58 L10 36 L10 16Z" fill="url(#sh-body)" stroke="#B8860B" stroke-width="2"/><path d="M32 4 L54 16 L54 28 L32 20 L10 28 L10 16Z" fill="url(#sh-top)"/><path d="M32 20 L46 28 L46 38 L32 48 L18 38 L18 28Z" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.6"/><circle cx="32" cy="32" r="8" fill="url(#sh-gem)" stroke="#FFD700" stroke-width="1.5"/><circle cx="32" cy="32" r="4" fill="#E8D44D"/><path d="M32 24 L34 30 L40 30 L35 34 L37 40 L32 36 L27 40 L29 34 L24 30 L30 30Z" fill="#FFD700" opacity="0.3"/><defs><linearGradient id="sh-body" x1="32" y1="4" x2="32" y2="58"><stop stop-color="#2980B9"/><stop offset="0.5" stop-color="#1A5276"/><stop offset="1" stop-color="#154360"/></linearGradient><linearGradient id="sh-top" x1="10" y1="4" x2="54" y2="28"><stop stop-color="#3498DB"/><stop offset="1" stop-color="#2471A3"/></linearGradient><radialGradient id="sh-gem"><stop stop-color="#F4D03F"/><stop offset="1" stop-color="#D4AC0D"/></radialGradient></defs></svg>` },
  helmet: { name:'Helmet',  slot:'helmet',  emoji:'⛑️',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 40 Q12 12 32 8 Q52 12 52 40Z" fill="url(#hm-dome)" stroke="#8B6914" stroke-width="1.5"/><rect x="10" y="38" width="44" height="6" rx="3" fill="url(#hm-band)"/><path d="M32 8 L32 2" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/><circle cx="32" cy="2" r="2" fill="#FFD700"/><path d="M22 44 L20 56 Q32 60 44 56 L42 44" fill="url(#hm-face)" stroke="#8B6914" stroke-width="1"/><rect x="18" y="42" width="28" height="3" rx="1.5" fill="#1A1A2E" opacity="0.8"/><path d="M24 48 L28 48 L28 52 L24 52Z" fill="#3498DB" opacity="0.6"/><path d="M36 48 L40 48 L40 52 L36 52Z" fill="#3498DB" opacity="0.6"/><defs><linearGradient id="hm-dome" x1="32" y1="8" x2="32" y2="40"><stop stop-color="#C0C0C0"/><stop offset="0.5" stop-color="#808080"/><stop offset="1" stop-color="#505050"/></linearGradient><linearGradient id="hm-band" x1="10" y1="38" x2="54" y2="44"><stop stop-color="#FFD700"/><stop offset="1" stop-color="#B8860B"/></linearGradient><linearGradient id="hm-face" x1="32" y1="44" x2="32" y2="60"><stop stop-color="#A0A0A0"/><stop offset="1" stop-color="#606060"/></linearGradient></defs></svg>` },
  boots:  { name:'Boots',   slot:'boots',   emoji:'👢',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 10 L20 38 L16 42 L14 52 L50 52 L48 42 L36 38 L36 10Z" fill="url(#bt-body)" stroke="#5C3D0E" stroke-width="1.5"/><path d="M20 10 L36 10 L36 18 L20 18Z" fill="url(#bt-top)"/><rect x="18" y="38" width="30" height="4" rx="2" fill="#8B6914"/><path d="M14 52 L12 56 L52 56 L50 52" fill="url(#bt-sole)" stroke="#3D2B1F" stroke-width="1"/><circle cx="28" cy="28" r="2" fill="#FFD700"/><circle cx="34" cy="32" r="1.5" fill="#FFD700"/><circle cx="28" cy="36" r="1.5" fill="#FFD700"/><defs><linearGradient id="bt-body" x1="28" y1="10" x2="28" y2="52"><stop stop-color="#8B4513"/><stop offset="0.5" stop-color="#654321"/><stop offset="1" stop-color="#3E2723"/></linearGradient><linearGradient id="bt-top" x1="20" y1="10" x2="36" y2="18"><stop stop-color="#A0522D"/><stop offset="1" stop-color="#8B4513"/></linearGradient><linearGradient id="bt-sole" x1="12" y1="52" x2="52" y2="56"><stop stop-color="#3E2723"/><stop offset="1" stop-color="#1B0F08"/></linearGradient></defs></svg>` },
  ring:   { name:'Ring',    slot:'ring',    emoji:'💍',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="36" rx="18" ry="20" fill="none" stroke="url(#rn-band)" stroke-width="6"/><ellipse cx="32" cy="36" rx="14" ry="16" fill="none" stroke="#1A1A2E" stroke-width="2"/><path d="M22 22 L32 14 L42 22 L38 26 L32 22 L26 26Z" fill="url(#rn-gem)" stroke="#FFD700" stroke-width="1"/><ellipse cx="32" cy="20" rx="4" ry="3" fill="#E74C3C" opacity="0.8"/><circle cx="32" cy="20" r="2" fill="#FF6B6B" opacity="0.6"/><defs><linearGradient id="rn-band" x1="14" y1="16" x2="50" y2="56"><stop stop-color="#FFD700"/><stop offset="0.5" stop-color="#FFC107"/><stop offset="1" stop-color="#B8860B"/></linearGradient><radialGradient id="rn-gem"><stop stop-color="#FF6B6B"/><stop offset="0.5" stop-color="#E74C3C"/><stop offset="1" stop-color="#C0392B"/></radialGradient></defs></svg>` },
  accessory: { name:'Accessory', slot:'accessory', emoji:'✨' }
}

// Hero-specific weapon SVGs (unique per hero class)
const HERO_WEAPONS = {
  warrior: {
    name: 'Greatsword',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="28" y="2" width="8" height="38" rx="2" fill="url(#gw-blade)"/><polygon points="32,0 28,6 36,6" fill="#E8F0FF"/><rect x="20" y="38" width="24" height="4" rx="2" fill="url(#gw-guard)"/><rect x="30" y="42" width="4" height="14" rx="1" fill="#5C3D0E"/><rect x="28" y="54" width="8" height="4" rx="2" fill="#8B6914"/><circle cx="32" cy="56" r="2" fill="#FFD700"/><defs><linearGradient id="gw-blade" x1="32" y1="0" x2="32" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#E8F4FF"/><stop offset="0.3" stop-color="#B0D4FF"/><stop offset="0.7" stop-color="#6090D0"/><stop offset="1" stop-color="#80B0E0"/></linearGradient><linearGradient id="gw-guard" x1="20" y1="38" x2="44" y2="42" gradientUnits="userSpaceOnUse"><stop stop-color="#FFD700"/><stop offset="1" stop-color="#B8860B"/></linearGradient></defs></svg>`
  },
  mage: {
    name: 'Staff',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="18" width="4" height="42" rx="2" fill="url(#st-pole)"/><circle cx="32" cy="12" r="8" fill="url(#st-orb)" stroke="#FFD700" stroke-width="1.5"/><circle cx="32" cy="12" r="4" fill="#E8D4FF" opacity="0.8"/><circle cx="30" cy="10" r="2" fill="#fff" opacity="0.5"/><path d="M26 18 L32 22 L38 18" fill="none" stroke="#FFD700" stroke-width="1.5"/><path d="M24 14 L28 18 M36 14 L40 18" stroke="#FFD700" stroke-width="1" opacity="0.5"/><defs><linearGradient id="st-pole" x1="32" y1="18" x2="32" y2="60"><stop stop-color="#8B6914"/><stop offset="0.5" stop-color="#5C3D0E"/><stop offset="1" stop-color="#3E2723"/></linearGradient><radialGradient id="st-orb"><stop stop-color="#D8B4FE"/><stop offset="0.5" stop-color="#A855F7"/><stop offset="1" stop-color="#7C3AED"/></radialGradient></defs></svg>`
  },
  rogue: {
    name: 'Dagger',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="4" width="4" height="30" rx="1.5" fill="url(#dg-blade)"/><polygon points="32,0 29,6 35,6" fill="#E8E8E8"/><rect x="26" y="32" width="12" height="3" rx="1.5" fill="#FFD700"/><rect x="30" y="35" width="4" height="10" rx="1" fill="#3E2723"/><rect x="28" y="44" width="8" height="4" rx="2" fill="#5C3D0E"/><circle cx="32" cy="46" r="1.5" fill="#C0392B"/><defs><linearGradient id="dg-blade" x1="32" y1="0" x2="32" y2="34" gradientUnits="userSpaceOnUse"><stop stop-color="#F0F0F0"/><stop offset="0.5" stop-color="#C0C0C0"/><stop offset="1" stop-color="#808080"/></linearGradient></defs></svg>`
  },
  ranger: {
    name: 'Bow',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6 Q8 32 18 58" stroke="url(#bw-wood)" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="18" cy="6" r="2" fill="#DAA520"/><circle cx="18" cy="58" r="2" fill="#DAA520"/><line x1="18" y1="6" x2="18" y2="58" stroke="#D4C4A8" stroke-width="0.8" opacity="0.6"/><path d="M42 30 L56 32 L42 34 Z" fill="#8B6914"/><rect x="22" y="30" width="20" height="1.5" rx="0.75" fill="#C0A882"/><circle cx="44" cy="32" r="1" fill="#FFD700"/><defs><linearGradient id="bw-wood" x1="14" y1="6" x2="14" y2="58"><stop stop-color="#A0522D"/><stop offset="0.5" stop-color="#8B4513"/><stop offset="1" stop-color="#654321"/></linearGradient></defs></svg>`
  },
  paladin: {
    name: 'Warhammer',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="18" width="4" height="40" rx="2" fill="url(#wh-pole)"/><rect x="18" y="6" width="28" height="14" rx="3" fill="url(#wh-head)" stroke="#FFD700" stroke-width="1"/><rect x="20" y="8" width="24" height="10" rx="2" fill="url(#wh-face)"/><circle cx="32" cy="13" r="3" fill="#FFD700" opacity="0.4"/><path d="M18 13 L14 13 L14 16 L18 16" fill="#FFD700"/><path d="M46 13 L50 13 L50 16 L46 16" fill="#FFD700"/><rect x="28" y="56" width="8" height="4" rx="2" fill="#8B6914"/><circle cx="32" cy="58" r="2" fill="#FFD700"/><defs><linearGradient id="wh-pole" x1="32" y1="18" x2="32" y2="58"><stop stop-color="#5C3D0E"/><stop offset="1" stop-color="#3E2723"/></linearGradient><linearGradient id="wh-head" x1="18" y1="6" x2="46" y2="20"><stop stop-color="#808080"/><stop offset="0.5" stop-color="#A0A0A0"/><stop offset="1" stop-color="#606060"/></linearGradient><linearGradient id="wh-face" x1="20" y1="8" x2="44" y2="18"><stop stop-color="#C0C0C0"/><stop offset="1" stop-color="#808080"/></linearGradient></defs></svg>`
  },
  necromancer: {
    name: 'Scythe',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="16" width="4" height="44" rx="2" fill="url(#sc-pole)"/><path d="M30 16 Q10 4 6 18 Q4 28 20 22 L30 20Z" fill="url(#sc-blade)" stroke="#4A0080" stroke-width="1"/><path d="M12 14 Q8 18 10 22" stroke="#9B30FF" stroke-width="0.8" opacity="0.5"/><circle cx="28" cy="18" r="2" fill="#9B30FF" opacity="0.4"/><rect x="28" y="58" width="8" height="4" rx="2" fill="#2C1A4E"/><circle cx="32" cy="60" r="1.5" fill="#9B30FF"/><defs><linearGradient id="sc-pole" x1="32" y1="16" x2="32" y2="60"><stop stop-color="#2C1A4E"/><stop offset="1" stop-color="#1A0E30"/></linearGradient><linearGradient id="sc-blade" x1="6" y1="4" x2="30" y2="22"><stop stop-color="#7B2FBE"/><stop offset="0.5" stop-color="#5B1FAE"/><stop offset="1" stop-color="#3A0F8E"/></linearGradient></defs></svg>`
  }
}
const RARITIES = {
  common:    { name:'Common',    color:'#aaa',     dropRate:0.5339, statMul:1.0 },
  uncommon:  { name:'Uncommon',  color:'#4caf50', dropRate:0.25,   statMul:1.3 },
  rare:      { name:'Rare',      color:'#2196f3', dropRate:0.15,   statMul:1.8 },
  epic:      { name:'Epic',      color:'#9c27b0', dropRate:0.05,   statMul:2.8 },
  legendary: { name:'Legendary', color:'#ff9800', dropRate:0.01,   statMul:4.5 },
  mythic:    { name:'Mythic',    color:'#f44336', dropRate:0.005,  statMul:7.0 },
  immortal:  { name:'Immortal',  color:'#e0e0e0', dropRate:0.001,  statMul:11.0 },
  archgod:   { name:'Archgod',   color:'#ff6f00', dropRate:0.0001, statMul:18.0 }
}
const EQUIP_BASE = {
  weapon: {atk:5,def:0,hp:0,spd:0}, armor:{atk:0,def:5,hp:15,spd:0}, shield:{atk:0,def:8,hp:5,spd:0},
  helmet: {atk:0,def:3,hp:10,spd:0}, boots:{atk:0,def:0,hp:0,spd:8}, ring:{atk:3,def:1,hp:8,spd:0},
  accessory:{atk:4,def:2,hp:12,spd:5}
}
// Unique name prefixes per rarity
const EQUIP_NAMES = {
  common:    ['Worn','Old','Basic','Rusty','Crude','Dull','Plain','Tattered'],
  uncommon:  ['Fine','Sturdy','Keen','Polished','Tempered','Solid','Sharp'],
  rare:      ['Blazing','Frostbound','Stormforged','Shadowveil','Crimson','Azure','Verdant'],
  epic:      ['Voidtouched','Soulbound','Doom','Eclipse','Infernal','Celestial','Abyssal'],
  legendary: ['Excalibur','Aegis','Ouroboros','Leviathan','Phoenix','Titan','Leviathan'],
  mythic:    ['Chaosbringer','Godslayer','Worldender','Eternity','Primordial','Oblivion'],
  immortal:  ['Immortal\'s Will','Eternal Watcher','Deathless','Timeless','Undying','Infinite'],
  archgod:   ['Omega','Alpha Primus','Divine Arbiter','Creation\'s Edge','Cosmic Annihilation','The Absolute']
}
// Level requirement per zone drop
// Level requirement per zone drop (scales for infinite zones)
const EQUIP_LVL_REQ = [1, 15, 35, 65, 100]
function getEquipLvlReq(zone) {
  if (zone < EQUIP_LVL_REQ.length) return EQUIP_LVL_REQ[zone]
  return EQUIP_LVL_REQ[EQUIP_LVL_REQ.length-1] + (zone - EQUIP_LVL_REQ.length + 1) * 50
}
// Accessory types grouped by rarity
const ACC_TYPES = {
  common:    ['Bat Wings', 'Devil Tail', 'Butterfly Wings', 'Bee Wings', 'Fairy Wings'],
  uncommon:  ['Burning Tail', 'Shadow Wings', 'Wyvern Wings'],
  rare:      ['Dragon Wings', 'Phoenix Wings'],
  epic:      ['Celestial Wings', 'Void Wings'],
  legendary: ['Cosmic Wings', 'Infernal Wings'],
  mythic:    ['Primordial Wings', 'Eternity Wings'],
  immortal:  ['Immortal Wings', 'Deathless Wings'],
  archgod:   ['Omega Wings', 'Divine Wings']
}
// Forge success rates
const FORGE_RATE = { 1:1.0, 2:0.95, 3:0.90, 4:0.85, 5:0.80, 6:0.70, 7:0.60, 8:0.45, 9:0.30, 10:0.20, 11:0.10, 12:0.05 }
// Forge cost per level
const FORGE_COST = [0,10,20,35,55,80,120,170,250,350,500,700,1000]
const EQUIP_ZONE_TYPES = [['weapon','armor','helmet','boots','shield','ring','accessory'],['weapon','armor','helmet','boots','shield','ring','accessory'],['weapon','armor','helmet','boots','shield','ring','accessory'],['weapon','armor','helmet','boots','shield','ring','accessory'],['weapon','armor','helmet','boots','shield','ring','accessory'],['weapon','armor','helmet','boots','shield','ring','accessory']]
const INVENTORY_MAX = 96

function generateEquip(zone) {
  const allKeys = Object.keys(EQUIP_TYPES)
  // Filter: shield only drops for paladin
  const allowedKeys = allKeys.filter(k => {
    if (k === 'shield' && (!state.hero || state.hero.id !== 'paladin')) return false
    return true
  })
  const zTypes = EQUIP_ZONE_TYPES[zone] || ['weapon','armor']
  // Filter zone types to allowed keys only
  const validTypes = zTypes.filter(k => allowedKeys.includes(k))
  // Accessory only 5% chance
  const finalTypes = validTypes.filter(k => {
    if (k === 'accessory') return Math.random() < 0.05
    return true
  })
  if (finalTypes.length === 0) return null
  const tKey = finalTypes[Math.floor(Math.random() * finalTypes.length)], type = EQUIP_TYPES[tKey]
  // Roll rarity from drop rates (no zone boost, no normalize — sisa = no drop)
  const rarityKeys = Object.keys(RARITIES)
  const rates = rarityKeys.map(k => RARITIES[k].dropRate)
  const totalRate = rates.reduce((s, v) => s + v, 0)
  let roll = Math.random(), rk = 'common', cumul = 0
  if (roll >= totalRate) return null  // sisa persentase = no drop
  for (let i = 0; i < rarityKeys.length; i++) {
    cumul += rates[i]
    if (roll < cumul) { rk = rarityKeys[i]; break }
  }
  // Boss rarity boost: shift up 2 tiers
  if (state._bossDropBoost) {
    const idx = rarityKeys.indexOf(rk)
    const boosted = Math.min(rarityKeys.length - 1, idx + 2)
    rk = rarityKeys[boosted]
  }
  const r = RARITIES[rk], base = EQUIP_BASE[tKey], mul = r.statMul, lb = 1 + zone * 0.2
  // Unique name
  const names = EQUIP_NAMES[rk]
  const prefix = names[Math.floor(Math.random() * names.length)]
  let weaponName = type.name
  if (tKey === 'weapon' && state.hero && HERO_WEAPONS[state.hero.id]) {
    weaponName = HERO_WEAPONS[state.hero.id].name
  }
  if (tKey === 'accessory') {
    weaponName = ACC_TYPES[rk] ? ACC_TYPES[rk][Math.floor(Math.random() * ACC_TYPES[rk].length)] : ACC_TYPES.common[Math.floor(Math.random() * ACC_TYPES.common.length)]
  }
  const uniqueName = prefix + ' ' + weaponName
  return {
    id: Date.now() + Math.random(), type: tKey, typeName: weaponName, slot: type.slot,
    emoji: type.emoji, rarity: rk, rarityName: r.name, rarityColor: r.color,
    name: uniqueName, forgeLevel: 0, lvlReq: getEquipLvlReq(zone),
    atk: Math.floor(base.atk * mul * lb) || 0,
    def: Math.floor(base.def * mul * lb) || 0,
    hp: Math.floor(base.hp * mul * lb) || 0,
    spd: Math.floor(base.spd * mul * lb) || 0
  }
}
// Calculate total power of an equipment item
function equipPower(item) {
  return (item.atk || 0) + (item.def || 0) + (item.hp || 0) + (item.spd || 0) + (item.forgeLevel || 0) * 5
}
function rollEquipDrop(zone, bossDrop) {
  const dropChance = 0.10  // Flat 10% for all zones
  if (Math.random() > dropChance) return null
  const eq = generateEquip(zone)
  // Always drop to inventory — no auto-equip, player equips manually
  if (state.inventory.length >= INVENTORY_MAX) return null
  // Auto-lock only if better than equipped AND better than best in bag for that slot
  const current = state.equipped[eq.slot]
  const bestInBag = state.inventory.filter(it => it.slot === eq.slot).sort((a,b) => equipPower(b) - equipPower(a))[0]
  const mustBeat = bestInBag && (!current || equipPower(bestInBag) > equipPower(current)) ? bestInBag : current
  if (!mustBeat || equipPower(eq) > equipPower(mustBeat)) {
    eq.locked = true
  }
  state.inventory.push(eq)
  return eq
}
function equipItem(idx) {
  const item = state.inventory[idx]; if (!item) return
  if (state.level < item.lvlReq) {
    addCombatLog(`Need Lv.${item.lvlReq} to equip ${item.name}`)
    state.floatTexts.push({text:`Need Lv.${item.lvlReq}!`, y:canvas.height*0.35, color:'#ff9800', size:13, life:1, x:canvas.width/2+40})
    return
  }
  const old = state.equipped[item.slot]; state.equipped[item.slot] = item
  state.inventory.splice(idx, 1); if (old) state.inventory.push(old)
  calcStats(); addCombatLog(`Equipped ${item.name}`)
  state.floatTexts.push({text:`${item.emoji} Equipped!`, y:canvas.height*0.35, color:item.rarityColor, size:14, life:1.2, x:canvas.width/2+40})
  queueEvent(EVENT_TYPES.ITEM_EQUIP, { item, slot: item.slot, old })
  // Send to server
  serverApi.sendEvent('item_equip', { itemId: item.id }).catch(e => console.warn('Server equip failed:', e))
}
function unequipItem(slot) {
  const item = state.equipped[slot]; if (!item || state.inventory.length >= INVENTORY_MAX) return
  state.inventory.push(item); state.equipped[slot] = null; calcStats()
  queueEvent(EVENT_TYPES.ITEM_UNEQUIP, { item, slot })
  // Send to server
  serverApi.sendEvent('item_unequip', { itemId: item.id }).catch(e => console.warn('Server unequip failed:', e))
}
function autoEquipAll() {
  let equipped = 0
  // Iterate backwards so splice doesn't shift indices
  for (let i = state.inventory.length - 1; i >= 0; i--) {
    const item = state.inventory[i]
    if (state.level < item.lvlReq) continue
    const slot = item.slot
    const current = state.equipped[slot]
    // Equip if slot empty or new item is stronger
    if (!current || equipPower(item) > equipPower(current)) {
      if (current) state.inventory.push(current)
      state.equipped[slot] = item
      state.inventory.splice(i, 1)
      equipped++
    }
  }
  if (equipped > 0) {
    calcStats()
    addCombatLog(`Auto-equipped ${equipped} item(s)!`)
    state.floatTexts.push({text:`⚔️ ${equipped} Auto-Equipped!`, y:canvas.height*0.35, color:'#4caf50', size:14, life:1.5, x:canvas.width/2+40})
  } else {
    addCombatLog(`No better items to equip`)
  }
  // Force refresh both equipped slots and inventory bag
  if (state.showInventory) renderInventory()
}
function sellItem(idx) {
  const item = state.inventory[idx]; if (!item) return
  const val = Math.floor((item.atk + item.def + item.hp + (item.spd||0)) * 2 + 5 + item.forgeLevel * 10)
  state.gold += val; state.inventory.splice(idx, 1)
  addCombatLog(`Sold ${item.name} +${val}G`)
  state.floatTexts.push({text:`+${val}G`, y:canvas.height*0.42, color:'#ffd700', size:14, life:1, x:canvas.width/2+40})
  queueEvent(EVENT_TYPES.ITEM_SELL, { item, gold: val, totalGold: state.gold })
  // Send to server
  serverApi.sendEvent('item_sell', { itemId: item.id }).catch(e => console.warn('Server sell failed:', e))
}
function forgeItem(idx) {
  const item = state.inventory[idx]; if (!item) return
  const nextLvl = item.forgeLevel + 1
  if (nextLvl > 12) return
  const cost = FORGE_COST[nextLvl]
  if (state.gold < cost) { addCombatLog(`Need ${cost}G to forge`); return }
  state.gold -= cost
  const rate = FORGE_RATE[nextLvl]
  if (Math.random() < rate) {
    // Success
    item.forgeLevel = nextLvl
    // Add +10% stats per forge level
    const mul = 1 + nextLvl * 0.2
    const base = EQUIP_BASE[item.type]
    const rMul = RARITIES[item.rarity].statMul
    const lb = 1 + (item.lvlReq >= 100 ? 4 : item.lvlReq >= 65 ? 3 : item.lvlReq >= 35 ? 2 : item.lvlReq >= 15 ? 1.5 : 1) * 0.2
    item.atk = Math.floor(base.atk * rMul * lb * mul) || 0
    item.def = Math.floor(base.def * rMul * lb * mul) || 0
    item.hp = Math.floor(base.hp * rMul * lb * mul) || 0
    item.spd = Math.floor(base.spd * rMul * lb * mul) || 0
    addCombatLog(`Forged ${item.name} → +${nextLvl}!`)
    state.floatTexts.push({text:`🔨 +${nextLvl}!`, y:canvas.height*0.35, color:'#4caf50', size:14, life:1.2, x:canvas.width/2+40})
    queueEvent(EVENT_TYPES.FORGE_UPGRADE, { item, level: nextLvl, gold: state.gold })
  } else {
    if (nextLvl >= 8) {
      // Destroy at +8+
      state.inventory.splice(idx, 1)
      addCombatLog(`💀 ${item.name} DESTROYED at +${nextLvl}!`)
      state.floatTexts.push({text:`💀 DESTROYED!`, y:canvas.height*0.35, color:'#f44336', size:16, life:1.5, x:canvas.width/2+40})
      queueEvent(EVENT_TYPES.FORGE_UPGRADE, { item, level: nextLvl, success: false, destroyed: true, gold: state.gold })
    } else {
      addCombatLog(`Failed to forge ${item.name} (+${nextLvl})`)
      state.floatTexts.push({text:`Forge Failed!`, y:canvas.height*0.35, color:'#ff9800', size:13, life:1, x:canvas.width/2+40})
      queueEvent(EVENT_TYPES.FORGE_UPGRADE, { item, level: nextLvl, success: false, gold: state.gold })
    }
  }
  calcStats()
  // Send to server
  serverApi.sendEvent('forge_upgrade', { itemId: item.id }).catch(e => console.warn('Server forge failed:', e))
}
function equipBonusAtk() { let b=0; for(const s in state.equipped) if(state.equipped[s]) b+=state.equipped[s].atk; return b }
function equipBonusDef() { let b=0; for(const s in state.equipped) if(state.equipped[s]) b+=state.equipped[s].def; return b }
function equipBonusHp()  { let b=0; for(const s in state.equipped) if(state.equipped[s]) b+=state.equipped[s].hp;  return b }

// ─── STATE ─────────────────────────────────────────────
const state = {
  started: false, hero: null, level: 1, exp: 0, maxExp: 100,
  gold: 0, zone: 0, totalKills: 0, zoneKills: 0,
  inCombat: false, mob: null, mobHp: 0, mobMaxHp: 0,
  mobs: [], // group of additional mobs
  upg: { atk:0, def:0, hp:0, spd:0 },
  baseAtk: 0, baseDef: 0, baseHp: 100, maxHp: 100, hp: 100,
  attackSpeed: 1.0, skill1Cd: 0, skill2Cd: 0,
  atkTimer: 0, atkInterval: 1.0, atkAnim: 0,

  lastSave: Date.now(), lastOnline: Date.now(),
  combatLog: [], floatTexts: [], selectedHero: null,

  mobHitFlash: 0, heroRecoilX: 0, heroX: 0, heroTargetX: 0,
  mobDying: false, mobDeathTimer: 0,
  inventory: [], equipped: { weapon:null, armor:null, shield:null, helmet:null, boots:null, ring:null, accessory:null },
  showInventory: false,
  // Potion system
  potions: { small: 0, medium: 0, large: 0 },
  autoPotion: true,
  lastPotionUse: 0,
  // Boss system
  isBoss: false, bossKillCounter: 0, bossWarning: false, bossWarningTimer: 0,
  // Nightmare mode
  nightmare: false
}
state.mobX = 0; state.mobTargetX = 0
state.mobSkillCd = 0
state.mobProjectile = null
state.heroProjectile = null
state.meleeSkillFx = null // { heroId, age, x, y }
state.rogueAfterimage = null // { x, y, age, snapBack }

// ─── CANVAS ────────────────────────────────────────────
const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')
let frameCount = 0, time = 0, lastTime = performance.now()
let isIdle = true, currentLoopId = 0
let HERO_SHAKE_VAR_X = 0, HERO_SHAKE_VAR_Y = 0
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
window.addEventListener('resize', resize)
resize()
function getS() { return Math.min(canvas.width, canvas.height) / 400 }

// ─── HERO DETAIL CHAR ───────────────────────────────
const HERO_DETAILS = {
  warrior:    { bodyColor:'#4a6fa5', skinColor:'#ffcc99', armorColor:'#7a4a2a', hairColor:'#3d2b1f', hairStyle:'spiky', hasCape:true, capeColor:'#5d4037', eyeColor:'#2c5697', gender:'male', body:'muscular', hairHighlight:'#6b4c3b', armorTrim:'#c0a060', eyebrowStyle:'thick' },
  mage:       { bodyColor:'#2a1a5e', skinColor:'#ffe0bd', armorColor:'#9b59b6', hairColor:'#e0e0e0', hairStyle:'longFlow', hasHat:true, hatColor:'#3a2a6e', eyeColor:'#7b1fa2', gender:'female', body:'slim', hairHighlight:'#ffffff', robeColor:'#1a0a3e', eyebrowStyle:'thin' },
  rogue:      { bodyColor:'#333333', skinColor:'#ffd4b8', armorColor:'#2c2c2c', hairColor:'#8b0000', hairStyle:'messy', hasMask:true, maskColor:'#1a1a1a', eyeColor:'#ff4444', gender:'male', body:'lean', hairHighlight:'#cc0000', scarfColor:'#4a0000', eyebrowStyle:'sharp' },
  ranger:     { bodyColor:'#2a4a2a', skinColor:'#ffdab9', armorColor:'#5d4037', hairColor:'#8b4513', hairStyle:'ponytail', hasHood:true, hoodColor:'#1a3a1a', eyeColor:'#2e7d32', gender:'female', body:'athletic', hairHighlight:'#a0522d', capeColor:'#4a6b3a', eyebrowStyle:'thin', hasElfEars:true },
  paladin:    { bodyColor:'#c0c0c0', skinColor:'#ffe0bd', armorColor:'#ffd700', hairColor:'#ffd700', hairStyle:'princely', hasCape:true, capeColor:'#1565c0', eyeColor:'#0d47a1', gender:'male', body:'muscular', armorTrim:'#fff', eyebrowStyle:'noble', hasCrown:true },
  necromancer:{ bodyColor:'#1a0a0a', skinColor:'#d8d8d8', armorColor:'#4a0000', hairColor:'#1a0a0a', hairStyle:'hood', hasHood:true, hoodColor:'#0a0000', eyeColor:'#00e676', gender:'male', body:'slim', robeColor:'#1a0000', scarfColor:'#3a0000', eyebrowStyle:'none', useGlow:true }
}

const MOB_DETAILS = {
  slime:     { color:'#4caf50', highlight:'#81c784', hasLegs:false, bounce:0.15, simple:true },
  goblin:    { color:'#3a5f0b', skinColor:'#a5d6a7', hasLegs:true, hasHair:true, hairColor:'#2e1e0f', weapon:'club' },
  skeleton:  { color:'#e0e0e0', boneColor:'#f5f5f5', hasLegs:true, eyeColor:'#ffeb3b', weapon:'bow' },
  wolf:      { color:'#5d4037', furColor:'#8d6e63', hasLegs:true, hasFur:true, eyeColor:'#ffeb3b' },
  orc:       { color:'#2e7d32', skinColor:'#66bb6a', hasLegs:true, hasHair:true, hairColor:'#1b1b1b', weapon:'axe' },
  'dark knight': { color:'#263238', armorColor:'#37474f', hasLegs:true, eyeColor:'#f44336', weapon:'sword' },
  demon:     { color:'#b71c1c', skinColor:'#ff8a65', hasLegs:true, hasHorns:true, eyeColor:'#ffeb3b', wing:true },
  dragon:    { color:'#e65100', scaleColor:'#ff9800', hasLegs:true, hasWings:true, hasHorns:true, eyeColor:'#ffeb3b' }
}

// ─── SAVE / LOAD ───────────────────────────────────────
function saveGame() {
  state.lastSave = Date.now();
  localStorage.setItem('farborn_save', JSON.stringify(state));
  // Auto-sync to server every 30 seconds
  if (isLoggedIn() && Date.now() - (state._lastServerSync || 0) > 30000) {
    state._lastServerSync = Date.now();
    syncPlayerState(state).catch(() => {});
    // Also do full state sync with new system
    syncFullState(state).catch(() => {});
  }
}
function loadGame() {
  try {
    const data = JSON.parse(localStorage.getItem('farborn_save'))
    if (data) {
      Object.assign(state, data)
      // Re-attach melee property from HEROES (save lama gak punya)
      if (state.hero) {
        const h = HEROES.find(h => h.id === state.hero.id)
        if (h) state.hero.melee = h.melee
      }
      // Ensure inventory/equipped exist for old saves
      if (!state.inventory) state.inventory = []
      if (!state.equipped) state.equipped = { weapon:null, armor:null, shield:null, helmet:null, boots:null, ring:null, accessory:null }
      // Sanitize: remove corrupted items without type/slot
      state.inventory = state.inventory.filter(item => item && item.type && item.slot && EQUIP_TYPES[item.type])
      for (const slot in state.equipped) {
        if (state.equipped[slot] && (!state.equipped[slot].type || !EQUIP_TYPES[state.equipped[slot].type])) {
          state.equipped[slot] = null
        }
      }
      // Migrate old boots without spd stat
      for (const slot in state.equipped) {
        if (state.equipped[slot] && state.equipped[slot].spd === undefined) state.equipped[slot].spd = 0
      }
      for (const item of state.inventory) {
        if (item && item.spd === undefined) item.spd = 0
      }
      // Force reset death state on load
      state.heroDying = false; state.deathTimer = 0; state.mobs = []; state.mobDying = false; state.mobDeathTimer = 0
      // Reset boss state on load (mobs cleared, so boss can't be alive)
      state.isBoss = false; state.bossWarning = false; state.bossWarningTimer = 0
      // If hero was dead on save (hp=0), auto-respawn with 50% HP
      if (state.hp <= 0 && state.started) {
        calcStats()
        state.hp = Math.floor(state.maxHp * 0.5)
        state.inCombat = false
        addCombatLog('Auto-respawned with 50% HP')
      }
      const offSec = (Date.now() - state.lastOnline) / 1000
      if (offSec > 60 && state.started && state.mobs.length > 0 && state.mobs[0]) {
        // Max 2 jam offline, rate: 1 kill per 10 detik
        const maxSec = Math.min(offSec, 7200)
        const kills = Math.floor(maxSec / 10)
        const mobRef = state.mobs[0].mob
        const og = Math.floor(mobRef.gold * kills * 0.1)
        const oe = Math.floor(mobRef.exp * kills * 0.1)
        state.gold += og; addExp(oe)
        addCombatLog(`AFK ${fmtTime(maxSec)}: +${og}G +${oe}EXP`)
        state.lastOnline = Date.now() // Reset supaya gak kehitung lagi
      }
      return true
    }
  } catch(e) {}
  return false
}
function fmtTime(s) { return s < 60 ? Math.floor(s)+'s' : s < 3600 ? Math.floor(s/60)+'m' : Math.floor(s/3600)+'h'+Math.floor((s%3600)/60)+'m' }

// ─── RESTORE FROM SERVER (1 user = 1 character) ─────────
function restoreFromServer(player) {
  if (!player) return false;
  const hero = HEROES.find(h => h.id === player.class);
  if (!hero) return false;
  const heroData = { ...hero };
  const fcUser = getUser();
  if (fcUser && fcUser.username && isRealFarcasterUser()) {
    heroData.name = '@' + fcUser.username;
  } else {
    heroData.name = player.hero_name || heroData.name;
  }
  Object.assign(state, {
    hero: heroData, started: true, hp: player.level > 0 ? undefined : heroData.baseHp,
    level: player.level || 1, zone: player.zone || 0, gold: player.gold || 0,
    exp: 0, maxExp: 100, totalKills: 0, zoneKills: 0,
    combatLog: [], floatTexts: [], particles: [],
    upg: { atk:0, def:0, hp:0, spd:0 },
    equipped: player.equipped || { weapon:null, armor:null, shield:null, helmet:null, boots:null, ring:null, accessory:null },
    inventory: player.bag || [],
    skillCd: 0, skillReady: true, atkAnim: 0, mobHitFlash: 0, heroRecoilX: 0, mobs: [], mobDying: false, mobDeathTimer: 0, skillIdx: 0,
    nightmare: false, isBoss: false, bossKillCounter: 0, bossWarning: false, bossWarningTimer: 0,
    prestige: 0, prestigeMult: 1
  });
  calcStats();
  state.hp = state.maxHp;
  state.lastOnline = Date.now();
  saveGame();
  return true;
}

// ─── STATS ─────────────────────────────────────────────
function calcStats() {
  const h = state.hero; if (!h) return
  const g = HERO_GROWTH[h.id] || { atk:2, def:1, hp:10, spd:0.02 }
  state.baseAtk = h.baseAtk + state.upg.atk * UPGRADES.atk.amount
  state.baseDef = h.baseDef + state.upg.def * UPGRADES.def.amount
  state.baseHp = h.baseHp + state.upg.hp * UPGRADES.hp.amount
  state.maxHp = state.baseHp + Math.floor((state.level - 1) * g.hp) + equipBonusHp()
  state.attackSpeed = totalSpd()
  state.atkInterval = Math.max(0.2, 0.7 / Math.max(0.4, state.attackSpeed))
  if (state.hp > state.maxHp) state.hp = state.maxHp
}
function totalAtk() {
  const h = state.hero; if (!h) return 0
  const g = HERO_GROWTH[h.id] || { atk:2 }
  return state.baseAtk + Math.floor(state.level * g.atk) + equipBonusAtk()
}
function totalDef() {
  const h = state.hero; if (!h) return 0
  const g = HERO_GROWTH[h.id] || { def:1 }
  return state.baseDef + Math.floor(state.level * g.def) + equipBonusDef()
}
function totalSpd() {
  const h = state.hero; if (!h) return 0
  // SPD from boots + accessory
  const bootSpd = state.equipped.boots ? (state.equipped.boots.spd || 0) : 0
  const accSpd = state.equipped.accessory ? (state.equipped.accessory.spd || 0) : 0
  return 1.0 + (bootSpd + accSpd) * 0.01
}

// ─── UPGRADES (AUTO) ─────────────────────────────────
function autoUpgrade() {
  const stats = ['hp','atk','def']
  for (let i = 0; i < stats.length; i++) {
    const key = stats[i]
    const u = UPGRADES[key]
    state.upg[key]++
    calcStats()
    if (key === 'hp') state.hp = Math.min(state.hp + u.amount, state.maxHp)
    // stagger float texts vertically
    state.floatTexts.push({ text: `${u.name} +${u.amount}`, y: canvas.height * 0.12 + i * 22, color: '#2196f3', size: 11, life: 1.0, x: canvas.width / 2 })
  }
}
function formatNum(n) {
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M'
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K'
  return n.toString()
}

// ─── POTION SYSTEM ────────────────────────────────────
const POTIONS = {
  small:  { name: 'Small HP Potion',  emoji: '🧪', heal: 0.20, cost: 10  },
  medium: { name: 'Medium HP Potion', emoji: '⚗️', heal: 0.40, cost: 30  },
  large:  { name: 'Large HP Potion',  emoji: '💊', heal: 0.70, cost: 80  },
}
function buyPotion(type, qty) {
  const p = POTIONS[type]
  const maxAfford = Math.floor(state.gold / p.cost)
  const amount = qty === 'max' ? maxAfford : Math.min(qty || 1, maxAfford)
  if (amount <= 0) return
  state.gold -= p.cost * amount
  state.potions[type] += amount
  state.floatTexts.push({ text: `${p.emoji} +${amount}`, y: canvas.height * 0.38, color: '#4caf50', size: 14, life: 1.0, x: canvas.width / 2 })
  addCombatLog(`Bought ${p.name} x${amount}`)
  updateShopUI()
}
function usePotion(type) {
  if (state.potions[type] <= 0 || state.hp >= state.maxHp) return
  state.potions[type]--
  const p = POTIONS[type]
  const prev = state.hp
  state.hp = Math.min(state.hp + Math.floor(state.maxHp * p.heal), state.maxHp)
  const actual = state.hp - prev
  state.floatTexts.push({ text: `+${actual} HP`, y: canvas.height * 0.35, color: '#4caf50', size: 16, life: 1.2, x: canvas.width * 0.3 + 20 })
  state.particles.push({ x: canvas.width * 0.3 + 20, y: canvas.height * 0.52, vx: 0, vy: -40, size: 5 * getS(), life: 1.0, color: '#4caf50' })
  addCombatLog(`Used ${p.name}: +${actual} HP`)
  updateShopUI()
}
function autoUsePotion() {
  if (!state.autoPotion || state.hp <= 0 || state.heroDying) return
  if (Date.now() - state.lastPotionUse < 2000) return
  if (state.hp > state.maxHp * 0.5) return
  if (state.potions.large > 0)  { usePotion('large');  state.lastPotionUse = Date.now(); return }
  if (state.potions.medium > 0) { usePotion('medium'); state.lastPotionUse = Date.now(); return }
  if (state.potions.small > 0)  { usePotion('small');  state.lastPotionUse = Date.now(); return }
}
let _shopOpen = false
function toggleShop() {
  _shopOpen = !_shopOpen
  const el = document.getElementById('shop-panel')
  if (_shopOpen) { updateShopUI(); el.style.display = 'flex' }
  else { el.style.display = 'none' }
}
function updateShopUI() {
  const g = document.getElementById('shop-gold')
  if (g) g.textContent = `${formatNum(state.gold)}G`
  const items = document.getElementById('shop-items')
  if (!items) return
  items.innerHTML = ''
  for (const type in POTIONS) {
    const p = POTIONS[type], owned = state.potions[type], canBuy = state.gold >= p.cost
    const maxAfford = Math.floor(state.gold / p.cost)
    items.innerHTML += `
      <div style="background:rgba(255,255,255,0.05);border:1px solid #333;border-radius:10px;padding:10px;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="font-size:28px;">${p.emoji}</div>
          <div style="flex:1;"><div style="font-size:11px;font-weight:bold;color:#fff;">${p.name}</div>
          <div style="font-size:9px;color:#888;">Heal ${Math.round(p.heal*100)}% HP</div>
          <div style="font-size:9px;color:#888;">Owned: <span style="color:#4caf50;">${owned}</span></div></div>
          <button onclick="buyPotion('${type}',1)" style="padding:6px 12px;background:rgba(255,215,0,0.15);border:1px solid #ffd700;border-radius:8px;color:#ffd700;font-size:10px;font-weight:bold;cursor:pointer;opacity:${canBuy?1:0.4};">${p.cost}G</button>
        </div>
        <div style="display:flex;gap:6px;margin-top:6px;">
          <button onclick="buyPotion('${type}',1)" style="flex:1;padding:5px 0;background:rgba(255,255,255,0.08);border:1px solid #555;border-radius:6px;color:#ccc;font-size:9px;cursor:pointer;opacity:${canBuy?1:0.4};">+1 (${p.cost}G)</button>
          <button onclick="buyPotion('${type}',5)" style="flex:1;padding:5px 0;background:rgba(255,255,255,0.08);border:1px solid #555;border-radius:6px;color:#ccc;font-size:9px;cursor:pointer;opacity:${maxAfford>=5?1:0.4};">+5 (${p.cost*5}G)</button>
          <button onclick="buyPotion('${type}',10)" style="flex:1;padding:5px 0;background:rgba(255,255,255,0.08);border:1px solid #555;border-radius:6px;color:#ccc;font-size:9px;cursor:pointer;opacity:${maxAfford>=10?1:0.4};">+10 (${p.cost*10}G)</button>
          <button onclick="buyPotion('${type}','max')" style="flex:1;padding:5px 0;background:rgba(76,175,80,0.15);border:1px solid #4caf50;border-radius:6px;color:#4caf50;font-size:9px;font-weight:bold;cursor:pointer;opacity:${canBuy?1:0.4};">MAX (${maxAfford})</button>
        </div>
      </div>`
  }
  items.innerHTML += `
    <div style="margin-top:8px;text-align:center;">
      <button onclick="toggleAutoPotion()" style="padding:8px 16px;background:rgba(76,175,80,0.15);border:1px solid #4caf50;border-radius:10px;color:#4caf50;font-size:10px;cursor:pointer;">${state.autoPotion ? '🟢 Auto-Use: ON' : '⚪ Auto-Use: OFF'}</button>
      <div style="font-size:8px;color:#666;margin-top:4px;">Auto-uses potion when HP below 50%</div>
    </div>`
}
function toggleAutoPotion() {
  state.autoPotion = !state.autoPotion
  updateShopUI()
}

// ─── COMBAT ────────────────────────────────────────────
function spawnMob() {
  state.rogueAfterimage = null
  state.meleeSkillFx = null
  const zone = getZone(state.zone)
  const scale = 1 + state.zone * 0.8 + state.level * 0.15
  const nmHp = state.nightmare ? 2 : 1, nmAtk = state.nightmare ? 1.5 : 1, nmDef = state.nightmare ? 1.3 : 1
  state.mobs = []
  state.mobProjectile = null
  state.heroProjectile = null
  state.heroRecoilX = 0
  state.heroX = state.heroX || canvas.width * 0.3
  // Boss spawning
  if (state.bossWarning && state.bossWarningTimer <= 0) {
    state.isBoss = true
    state.bossWarning = false
    const mIdx = zone.mobs[Math.floor(Math.random() * zone.mobs.length)]
    const base = MOBS[mIdx]
    const bName = BOSS_NAMES[mIdx] || '👑 UNKNOWN BOSS'
    const bColor = BOSS_COLORS[mIdx] || '#ffd700'
    const hp = Math.floor(base.hp * scale * 8)
    state.mobs.push({
      mob: { ...base, hp, atk: Math.floor(base.atk * scale * 3), def: Math.floor(base.def * Math.sqrt(scale) * 2), gold: base.gold * 15, exp: base.exp * 8, boss: true, name: bName, bossType: base.name, color: bColor, skillCd: 1.5, ranged: true },
      hp, maxHp: hp,
      x: canvas.width * 0.85,
      targetX: canvas.width * 0.45,
      skillCd: 1.5, hitFlash: 0, atkAnim: 0, dying: false, deathTimer: 0,
      spreadY: 0, statusEffects: [], bossPhase: 0, bossAtkTimer: 0
    })
    state.floatTexts.push({ text: '⚠️ ' + bName + ' APPEARED!', y:canvas.height*0.22, color:'#ff0000', size:28, life:2.5, x:canvas.width/2 })
    addCombatLog('⚠️ ' + bName + ' APPEARED!')
  } else {
    // Normal mob spawning
    const mobCount = Math.min(4, 2 + Math.floor(state.zone / 3))
    for (let i = 0; i < mobCount; i++) {
      const mIdx = zone.mobs[Math.floor(Math.random() * zone.mobs.length)]
      const base = MOBS[mIdx]
      const hp = Math.floor(base.hp * scale * nmHp)
      state.mobs.push({
        mob: { ...base, hp, atk: Math.floor(base.atk * scale * nmAtk), def: Math.floor(base.def * Math.sqrt(scale) * nmDef) },
        hp, maxHp: hp,
        x: canvas.width + 40 + i * 80 + Math.random() * 30,
        targetX: (base.ranged ? canvas.width * 0.70 : canvas.width * 0.42) + (i - 0.5) * 28,
        skillCd: 0, hitFlash: 0, atkAnim: 0, dying: false, deathTimer: 0,
        spreadY: (Math.random() - 0.5) * 12,
        statusEffects: []
      })
    }
  }
  // Sync primary mob references (backward compat)
  syncPrimaryMobRefs()
  state.inCombat = true
  // Hero target depends on nearest mob
  const firstMob = state.mobs[0]
  if (state.hero.melee && firstMob.mob.ranged) {
    state.heroTargetX = canvas.width * 0.55
  } else if (state.hero.melee) {
    state.heroTargetX = canvas.width * 0.35
  } else {
    state.heroTargetX = canvas.width * 0.3
  }
}

function syncPrimaryMobRefs() {
  if (state.mobs.length > 0) {
    const p = state.mobs[0]
    state.mob = p.mob
    state.mobHp = p.hp
    state.mobMaxHp = p.maxHp
    state.mobX = p.x
    state.mobTargetX = p.targetX
    state.mobSkillCd = p.skillCd
    state.mobHitFlash = p.hitFlash
    state.mobAtkAnim = p.atkAnim || 0
    state.mobDying = p.dying
    state.mobDeathTimer = p.deathTimer
  }
}
function addCombatLog(msg) { state.combatLog.unshift(msg); if (state.combatLog.length > 3) state.combatLog.pop() }
function addExp(a) {
  state.exp += a
  while (state.exp >= state.maxExp) {
    state.exp -= state.maxExp; state.level++
    state.maxExp = Math.floor(state.maxExp * 1.2)
    autoUpgrade()  // upgrade all stats on level up
    if (!state.heroDying && state.hp > 0) state.hp = state.maxHp  // only heal if alive
    state.floatTexts.push({ text: `LEVEL UP! Lv.${state.level}`, y: canvas.height*0.2, color:'#ffd700', size:20, life:2, x:canvas.width/2 })
    addCombatLog(`Level ${state.level}!`)
    if (state.level === 8) { addCombatLog('Skill 2 unlocked!'); state.floatTexts.push({ text:'🔓 Skill 2 Unlocked!', y:canvas.height*0.25, color:'#e040fb', size:16, life:2, x:canvas.width/2 }) }
    updateSkillBtn()
    // Sync to server on level up
    syncPlayerState(state).catch(() => {});
    queueEvent(EVENT_TYPES.LEVEL_UP, { level: state.level, gold: state.gold, zone: state.zone });
    // Send to server
    serverApi.sendEvent('level_up', {}).catch(e => console.warn('Server level_up failed:', e));
  }
}

function playerAttack() {
  if (!state.inCombat || state.mobs.length === 0) return
  // Find nearest alive mob
  let nearest = null, nearestDist = Infinity
  for (const gm of state.mobs) {
    if (gm.hp <= 0 || gm.dying) continue
    const d = gm.x - (state.heroX || canvas.width * 0.3)
    if (d < nearestDist) { nearestDist = d; nearest = gm }
  }
  if (!nearest) return
  // Melee: mob harus sudah sampai di hero
  if (state.hero.melee) {
    const heroX = (state.heroX || canvas.width * 0.3) + 18*getS()
    const dist = nearest.x - heroX
    if (dist > 100*getS()) return
  }
  // Auto-dual-skill: check both skills independently
  let skill = null, isSkill = false, whichSkill = 0
  // Basic attack: single target (nearest mob)
  let dmg = totalAtk() - Math.floor(nearest.mob.def * 0.5) + Math.floor(Math.random() * 5)
  // Crit check
  let isCrit = false
  const critRate = (HERO_CRIT_RATE[state.hero.id] || 0.05) + (state.upg.atk * 0.003)
  if (Math.random() < critRate) { dmg = Math.floor(dmg * CRIT_MULT); isCrit = true }
  // Freeze damage bonus
  if (isFrozen(nearest)) dmg = Math.floor(dmg * STATUS_EFFECTS.freeze.dmgBonus)
  // Skill 1: always available
  const sk1 = getSkill(state.hero.id, 0)
  if (sk1 && state.skill1Cd <= 0) {
    skill = sk1; isSkill = true; whichSkill = 1
    state.skill1Cd = sk1.cd
  } else if (state.level >= 8) {
    // Skill 2: unlocked at level 8
    const sk2 = getSkill(state.hero.id, 1)
    if (sk2 && state.skill2Cd <= 0) {
      skill = sk2; isSkill = true; whichSkill = 2
      state.skill2Cd = sk2.cd
    }
  }
  if (isSkill && skill) {
    dmg = Math.floor(dmg * skill.mult)
    state.floatTexts.push({ text: `${skill.emoji} ${skill.name}!`, y:canvas.height*0.32, color:'#ffd700', size:16, life:1.5, x:canvas.width/2+40 })
    addCombatLog(`Skill ${whichSkill}: ${skill.name}!`)
    // Apply status effects from skills
    if (skill.name === 'Shield Bash') applyStatus(nearest, 'stun', STATUS_EFFECTS.stun.duration)
    if (skill.name === 'Blizzard') { for (const gm of state.mobs) { if (!gm.dying && gm.hp > 0) applyStatus(gm, 'freeze', STATUS_EFFECTS.freeze.duration) } }
    if (skill.name === 'Fireball') { for (const gm of state.mobs) { if (!gm.dying && gm.hp > 0 && Math.random() < 0.8) applyStatus(gm, 'burn', STATUS_EFFECTS.burn.duration) } }
    if (skill.name === 'Death Coil') { for (const gm of state.mobs) { if (!gm.dying && gm.hp > 0) applyStatus(gm, 'poison', STATUS_EFFECTS.poison.duration) } }
    if (skill.name === 'Arrow Rain') { for (const gm of state.mobs) { if (!gm.dying && gm.hp > 0 && Math.random() < 0.6) applyStatus(gm, 'slow', STATUS_EFFECTS.slow.duration) } }
    // AoE: damage all OTHER mobs (skip the target)
    if (skill.aoe && state.mobs.length > 0) {
      for (const gm of state.mobs) {
        if (gm === nearest || gm.dying || gm.hp <= 0) continue
        let aoeDmg = Math.max(1, Math.floor(totalAtk() * skill.mult * 0.6) - Math.floor(gm.mob.def * 0.5))
        if (isFrozen(gm)) aoeDmg = Math.floor(aoeDmg * STATUS_EFFECTS.freeze.dmgBonus)
        gm.hp -= aoeDmg
        state.floatTexts.push({ text: `-${aoeDmg}`, y:canvas.height*0.35+Math.random()*20, color:'#ffd700', size:11, life:0.8, x:gm.x+20+Math.random()*10 })
        if (gm.hp <= 0) {
          gm.hp = 0; gm.dying = true; gm.deathTimer = 0.6
          const g = Math.floor(gm.mob.gold * 0.7)
          const e = Math.floor(gm.mob.exp * 0.7)
          state.gold += g; addExp(e)
          state.totalKills++; state.zoneKills++
          state.floatTexts.push({ text: `+${g}G`, y:canvas.height*0.42, color:'#4caf50', size:10, life:1, x:gm.x+20 })
        }
      }
    }
  }
  dmg = Math.max(1, dmg); nearest.hp -= dmg
  state.atkAnim = 20
  nearest.hitFlash = 1.0
  state.heroRecoilX = -5 * getS()
  const critText = isCrit ? 'CRIT! ' : ''
  const dmgColor = isCrit ? '#ff4444' : (isSkill ? '#ffd700' : '#ff4444')
  const dmgSize = isCrit ? 22 : (isSkill ? 18 : 14)
  state.floatTexts.push({ text: `${critText}-${dmg}`, y:canvas.height*0.35+Math.random()*20, color:dmgColor, size:dmgSize, life:1, x:canvas.width/2+40+Math.random()*30-15 })
  // Spawn particles on hit
  const hitX = nearest.x + 18*getS(), hitY = canvas.height*0.48
  const particleCount = isSkill ? 20 : 12
  const particleColors = isSkill
    ? (state.hero.id === 'warrior' ? ['#ffcc00','#ff8800','#fff','#ffd700']
      : state.hero.id === 'rogue' ? ['#ff1744','#b71c1c','#880e4f','#fff']
      : ['#ffd700','#fff8e1','#f1c40f','#fff'])
    : ['#ff5555','#ff8888','#ffaaaa']
  for (let i = 0; i < particleCount; i++) {
    const a = Math.random()*Math.PI*2, sp = 80+Math.random()*160
    state.particles.push({ x:hitX, y:hitY, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-60, size:isSkill?5*getS():4*getS(), life:isSkill?1.5:1.2, color: particleColors[i % particleColors.length] })
  }
  HERO_SHAKE_VAR_X = (Math.random()-0.5)*8; HERO_SHAKE_VAR_Y = (Math.random()-0.5)*6
  // Spawn hero projectile for ranged, melee skill VFX for melee
  if (!state.hero.melee) {
    const heroCX = (state.heroX || canvas.width * 0.3) + 18*getS()
    const mobCX = nearest.x + 18*getS()
    state.heroProjectile = {
      x: heroCX, y: canvas.height*0.52,
      tx: mobCX, ty: canvas.height*0.52,
      speed: isSkill ? 10 : 7,
      color: state.hero.color,
      isSkill: isSkill,
      skillEmoji: isSkill ? skill.emoji : null,
      skillName: isSkill ? skill.name : null,
      heroId: state.hero.id,
      life: 1, age: 0
    }
  } else if (isSkill) {
    // Melee hero skill visual effect
    state.meleeSkillFx = {
      heroId: state.hero.id,
      skillName: skill.name,
      x: nearest.x + 18*getS(),
      y: canvas.height * 0.48,
      age: 0
    }
    // Rogue backstab: blink behind mob
    if (state.hero.id === 'rogue') {
      const origX = state.heroX || canvas.width * 0.3
      state.rogueAfterimage = { x: origX, y: canvas.height * 0.48, age: 0 }
      state.heroX = nearest.x + 50 * getS() // teleport behind mob
      setTimeout(() => {
        if (state.rogueAfterimage) state.rogueAfterimage.snapBack = true
      }, 300)
    }
  }
  if (nearest.hp <= 0) {
    nearest.hp = 0; nearest.dying = true; nearest.deathTimer = 0.8
    state.totalKills++; state.zoneKills++
    // Boss kill counter
    if (nearest.mob.boss) {
      state.isBoss = false
      state.bossKillCounter = 0
      addCombatLog('👑 BOSS DEFEATED! Bonus loot!')
    } else {
      state.bossKillCounter++
    }
    const bossMult = nearest.mob.boss ? 10 : 1
    const bossExpMult = nearest.mob.boss ? 5 : 1
    const g = Math.floor(nearest.mob.gold * bossMult * (state.nightmare ? 2 : 1))
    const e = Math.floor(nearest.mob.exp * bossExpMult * (state.nightmare ? 2 : 1))
    state.gold += g; addExp(e)
    state.floatTexts.push({ text: `+${g}G +${e}EXP`, y:canvas.height*0.42, color:'#4caf50', size:14, life:1.2, x:canvas.width/2+40 })
    addCombatLog(`${nearest.mob.name} slain! +${g}G +${e}EXP`)
    // Equipment drop
    const isBossKill = nearest.mob.boss
    if (isBossKill) {
      // Boss drops 3-5 items
      const dropCount = 3 + Math.floor(Math.random() * 3)
      state._bossDropBoost = true
      for (let di = 0; di < dropCount; di++) {
        const drop = rollEquipDrop(state.zone, true)
        if (drop) {
          state.floatTexts.push({ text: `${drop.emoji} ${drop.name}`, y:canvas.height*0.38 - di*18, color:drop.rarityColor, size:12, life:1.5, x:canvas.width/2+40 })
          addCombatLog(`Boss dropped ${drop.name}`)
          queueEvent(EVENT_TYPES.ITEM_DROP, { item: drop, zone: state.zone, boss: true })
          // Send to server
          serverApi.sendEvent('item_drop', { monsterLevel: state.level, item: drop }).catch(e => console.warn('Server item_drop failed:', e))
        }
      }
      state._bossDropBoost = false
      state.floatTexts.push({ text: '👑 BOSS SLAIN!', y:canvas.height*0.30, color:'#ffd700', size:20, life:2, x:canvas.width/2 })
    } else {
      const drop = rollEquipDrop(state.zone, false)
      if (drop) {
        const msg = `${drop.emoji} ${drop.name} → Bag`
        state.floatTexts.push({ text: msg, y:canvas.height*0.38, color:drop.rarityColor, size:12, life:1.5, x:canvas.width/2+40 })
        addCombatLog(`Got ${drop.name}`)
        queueEvent(EVENT_TYPES.ITEM_DROP, { item: drop, zone: state.zone, boss: false })
        // Send to server
        serverApi.sendEvent('item_drop', { monsterLevel: state.level, item: drop }).catch(e => console.warn('Server item_drop failed:', e))
      }
      // Check if should trigger boss next
      if (state.bossKillCounter >= 50 && !state.isBoss && !state.bossWarning) {
        state.bossWarning = true
        state.bossWarningTimer = 2.0
      }
    }
    // Zone advance removed — player stays in selected zone
    // Sync primary mob refs (gameLoop will handle splice after deathTimer)
    syncPrimaryMobRefs()
  }
}

function mobAttack() {
  if (!state.inCombat || state.heroDying || state.mobs.length === 0) return
  // All mobs attack independently
  for (const gm of state.mobs) {
    if (gm.dying || gm.hp <= 0) continue
    if (gm.skillCd > 0) continue
    // Skip attack if stunned or frozen
    if (isStunned(gm) || isFrozen(gm)) { gm.skillCd = 0.5; continue }
    // Melee must be close to hero
    if (!gm.mob.ranged) {
      const heroX = (state.heroX || canvas.width * 0.3) + 18*getS()
      if (gm.x - heroX > 100*getS()) continue
    }
    const isSkill = gm.mob.ranged && gm.mob.skill
    const atkMult = isSkill ? 2.5 : 1
    const rawDmg = Math.max(1, Math.floor(gm.mob.atk * 0.7 * atkMult) - Math.floor(totalDef() * 0.3) + Math.floor(Math.random() * 2))
    const dmg = Math.max(1, rawDmg)
    gm.skillCd = gm.mob.skillCd || 2
    gm.atkAnim = 1.0
    state.hp -= dmg
    const heroDrawX = (state.heroX || canvas.width * 0.3) + 18*getS()
    state.floatTexts.push({ text: `-${dmg}`, y:canvas.height*0.32, color:'#ff4444', size:14, life:0.8, x:heroDrawX+Math.random()*20-10 })
    // Spawn projectile for ranged skill
    if (isSkill) {
      const mobCX = gm.x + 18*getS()
      state.mobProjectile = { x: mobCX, y: canvas.height*0.48, tx: canvas.width*0.3+20, ty: canvas.height*0.48, speed: 6, color: gm.mob.color, skill: gm.mob.skill, life: 1 }
    }
    // Shake on hero hit
    HERO_SHAKE_VAR_X = (Math.random()-0.5)*5; HERO_SHAKE_VAR_Y = (Math.random()-0.5)*4
    // Particles on hero hit
    const pHX = canvas.width*0.3+20, pHY = canvas.height*0.55
    for (let i=0;i<6;i++) {
      const a = Math.PI+Math.random()*Math.PI, sp = 60+Math.random()*80
      state.particles.push({ x:pHX, y:pHY, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-30, size:2.5*getS(), life:0.8, color:'#ff8800' })
    }
    if (state.hp <= 0) {
      state.hp = 0; state.heroDying = true; state.deathTimer = 1.5
      addCombatLog('Defeated!')
      setTimeout(() => { showDeathPopup() }, 1500)
      break // hero dead, stop other mobs
    }
  }
}

// Prestige removed

// ─── HUD ───────────────────────────────────────────────
function updateHUD() {
  if (!state.started || !state.hero) return
  document.querySelector('#hp-bar .fill').style.width = (state.hp/state.maxHp*100)+'%'
  document.getElementById('hp-text').textContent = `HP ${state.hp}/${state.maxHp}`
  document.querySelector('#exp-bar .fill').style.width = (state.exp/state.maxExp*100)+'%'
  document.getElementById('exp-text').textContent = `EXP ${state.exp}/${state.maxExp}`
  document.getElementById('gold-text').textContent = `${formatNum(state.gold)}G`
  document.getElementById('level-text').textContent = `Lv.${state.level} ${state.hero.name}`
  // Update inventory count
  const invEl = document.getElementById('inv-count')
  if (invEl) invEl.textContent = `${state.inventory.length}`
  const invEl2 = document.getElementById('inv-count2')
  if (invEl2) invEl2.textContent = `${state.inventory.length}/${INVENTORY_MAX}`
  // Update potion display
  const potSm = document.getElementById('pot-small')
  const potMd = document.getElementById('pot-medium')
  const potLg = document.getElementById('pot-large')
  if (potSm) potSm.textContent = `🧪${state.potions.small}`
  if (potMd) potMd.textContent = `⚗️${state.potions.medium}`
  if (potLg) potLg.textContent = `💊${state.potions.large}`
  // Update auto-upgrade display
  const upgLv = (id, key) => { const el = document.getElementById(id); if (el) el.textContent = state.upg[key] }
  upgLv('upg-atk-lv', 'atk'); upgLv('upg-def-lv', 'def')
  upgLv('upg-hp-lv', 'hp')
}

// ─── DRAWING ───────────────────────────────────────────
function drawPlayer() {
  const s = getS(), sz = 40*s, groundY = canvas.height * 0.58
  const cx = (state.heroX || canvas.width * 0.3) + (state.heroRecoilX || 0), cy = groundY - sz * 1.45
  const d = HERO_DETAILS[state.hero.id] || HERO_DETAILS.warrior
  const mobArrived = state.mobs.length === 0 || !state.mobs[0] || (state.mobs[0].x <= state.mobs[0].targetX + 2)
  isIdle = mobArrived && state.atkAnim === 0
  const walk = (!isIdle || (state.hero.melee && Math.abs(state.heroX - state.heroTargetX) > 2))
  // dt-based animations for consistent speed at any framerate
  const t = time || 0
  const walkSpeed = walk ? 5.5 : 1.2
  const walkCycle = Math.sin(t * walkSpeed)
  const walkBob = walk ? Math.abs(Math.sin(t * walkSpeed * 2)) * 4 * s : 0
  const breath = Math.sin(t * 1.3) * 1.5 * s
  // Smooth blink: 0=open, 1=closed (sine envelope every ~3.5s)
  const blinkPeriod = (t % 3.5)
  const blinkRaw = blinkPeriod < 0.18 ? Math.sin(blinkPeriod / 0.18 * Math.PI) : 0
  const blinkAmt = blinkRaw > 0.01 ? blinkRaw : 0 // 0..1 how closed
  const matk = state.atkAnim || 0
  const hr = sz * 0.32 // head radius
  const hx = cx + sz/2, hy = cy + sz * 0.25 // head center
  const bodyTop = cy + sz * 0.48
  const bodyBot = cy + sz * 1.05

  // Death animation
  if (state.heroDying) {
    const t = Math.min(1, (1.5 - (state.deathTimer || 0)) / 1.0)
    ctx.save(); ctx.globalAlpha = 1 - t * 0.7
    ctx.translate(cx+sz/2, groundY); ctx.rotate(t * Math.PI * 0.4); ctx.translate(-(cx+sz/2), -groundY)
  }

  // --- CAPE / SCARF / ROBE behind body ---
  if (d.hasCape) {
    const capeFlow = walk ? Math.sin(t*7.5)*3*s : 0
    ctx.fillStyle = d.capeColor; ctx.beginPath()
    ctx.moveTo(cx+sz*0.25, cy+sz*0.45)
    ctx.quadraticCurveTo(cx+sz*0.0+capeFlow, cy+sz*1.0, cx-sz*0.15+capeFlow*0.5, cy+sz*1.3)
    ctx.lineTo(cx+sz*0.15, cy+sz*1.3)
    ctx.quadraticCurveTo(cx+sz*0.2+capeFlow, cy+sz*1.0, cx+sz*0.4, cy+sz*0.5)
    ctx.fill()
    // Second wing
    ctx.beginPath()
    ctx.moveTo(cx+sz*0.75, cy+sz*0.45)
    ctx.quadraticCurveTo(cx+sz*1.0+capeFlow, cy+sz*1.0, cx+sz*1.15+capeFlow*0.5, cy+sz*1.3)
    ctx.lineTo(cx+sz*0.85, cy+sz*1.3)
    ctx.quadraticCurveTo(cx+sz*0.8+capeFlow, cy+sz*1.0, cx+sz*0.6, cy+sz*0.5)
    ctx.fill()
  }
  if (d.scarfColor) {
    const scarfFlow = walk ? Math.sin(t*5.5)*4*s : 0
    ctx.fillStyle = d.scarfColor; ctx.beginPath()
    ctx.moveTo(cx+sz*0.3, cy+sz*0.4); ctx.lineTo(cx+sz*0.7, cy+sz*0.4)
    ctx.lineTo(cx+sz*1.1+scarfFlow, cy+sz*0.8); ctx.lineTo(cx+sz*1.05+scarfFlow*0.5, cy+sz*1.0); ctx.lineTo(cx+sz*0.7, cy+sz*0.5); ctx.fill()
  }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(hx, groundY+2*s, sz*0.42, sz*0.07, 0, 0, Math.PI*2); ctx.fill()

  // --- EQUIP GLOW (rare+ items glow) ---
  const eqColors = { rare:'#2196f3', epic:'#9c27b0', legendary:'#ff9800', mythic:'#f44336', immortal:'#e0e0e0', archgod:'#ff6f00' }
  let bestRarity = null
  for (const slot in state.equipped) {
    const eq = state.equipped[slot]
    if (eq && eq.rarity !== 'common' && eq.rarity !== 'uncommon') {
      if (!bestRarity || RARITIES[eq.rarity].statMul > RARITIES[bestRarity].statMul) bestRarity = eq.rarity
    }
  }
  if (bestRarity) {
    const gc = eqColors[bestRarity]
    const glowPulse = 0.15 + Math.sin(t * 1.5) * 0.1
    ctx.globalAlpha = glowPulse
    ctx.strokeStyle = gc; ctx.lineWidth = bestRarity === 'archgod' ? 3 * s : 2 * s
    ctx.beginPath(); ctx.ellipse(cx + sz*0.5, cy + sz*0.5, sz*0.55, sz*0.7, 0, 0, Math.PI*2); ctx.stroke()
    // Archgod double ring + particles
    if (bestRarity === 'archgod') {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1 * s
      ctx.beginPath(); ctx.ellipse(cx + sz*0.5, cy + sz*0.5, sz*0.6, sz*0.75, 0, 0, Math.PI*2); ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  // --- ACCESSORY VISUAL (wings/aura/tail) ---
  const acc = state.equipped.accessory
  if (acc) {
    const accColor = acc.rarityColor || '#FFD700'
    const accRarity = acc.rarity || 'common'
    const wingFlap = Math.sin(t * 4) * 8 * s
    // Aura glow behind hero
    ctx.globalAlpha = 0.15 + Math.sin(t * 2) * 0.08
    ctx.fillStyle = accColor
    ctx.beginPath()
    ctx.ellipse(cx + sz*0.5, cy + sz*0.6, sz*0.9, sz*1.1, 0, 0, Math.PI*2)
    ctx.fill()
    ctx.globalAlpha = 1
    // Wings (based on rarity tier)
    if (['rare','epic','legendary','mythic','divine','celestial','transcendent','archgod'].includes(accRarity)) {
      ctx.save()
      ctx.globalAlpha = 0.7 + Math.sin(t * 3) * 0.2
      // Left wing
      ctx.fillStyle = accColor
      ctx.beginPath()
      ctx.moveTo(cx + sz*0.2, cy + sz*0.3)
      ctx.quadraticCurveTo(cx - sz*0.6, cy - sz*0.3 + wingFlap, cx - sz*0.8, cy + sz*0.1 + wingFlap*0.5)
      ctx.quadraticCurveTo(cx - sz*0.5, cy + sz*0.5, cx + sz*0.2, cy + sz*0.5)
      ctx.fill()
      // Right wing
      ctx.beginPath()
      ctx.moveTo(cx + sz*0.8, cy + sz*0.3)
      ctx.quadraticCurveTo(cx + sz*1.6, cy - sz*0.3 + wingFlap, cx + sz*1.8, cy + sz*0.1 + wingFlap*0.5)
      ctx.quadraticCurveTo(cx + sz*1.5, cy + sz*0.5, cx + sz*0.8, cy + sz*0.5)
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.restore()
    }
    // Tail (all accessories get a tail)
    ctx.strokeStyle = accColor
    ctx.lineWidth = 3 * s
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ctx.moveTo(cx + sz*0.5, cy + sz*1.1)
    const tailWag = Math.sin(t * 5) * 6 * s
    ctx.quadraticCurveTo(cx + sz*0.2 + tailWag, cy + sz*1.4, cx + sz*0.1 + tailWag*1.5, cy + sz*1.6)
    ctx.stroke()
    // Tail tip spark
    ctx.fillStyle = accColor
    ctx.beginPath()
    ctx.arc(cx + sz*0.1 + tailWag*1.5, cy + sz*1.6, 3*s, 0, Math.PI*2)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.lineWidth = 1
  }

  // --- EQUIPPED ARMOR CHECK (used by legs, body, arms) ---
  const eqArmor = state.equipped.armor

  // --- LEGS ---
  const kneeOff = walk ? walkCycle * 6 * s : Math.sin(t * 0.9) * 0.5 * s
  const ankleOff = walk ? Math.sin(t * walkSpeed + Math.PI) * 6 * s : Math.sin(t * 0.9 + Math.PI) * 0.5 * s
  const lThighX = walk ? kneeOff * 0.3 : 0
  const rThighX = walk ? ankleOff * 0.3 : 0
  if (eqArmor) {
    // Class-specific leg armor
    ctx.fillStyle = eqArmor.rarityColor || '#888'
    ctx.globalAlpha = 0.8
    ctx.fillRect(cx+sz*0.26+lThighX, bodyBot-walkBob, sz*0.18, sz*0.25)
    ctx.fillRect(cx+sz*0.56+rThighX, bodyBot-walkBob, sz*0.18, sz*0.25)
    ctx.fillRect(cx+sz*0.26+lThighX+kneeOff*0.4, bodyBot+sz*0.25-walkBob+kneeOff*0.5, sz*0.16, sz*0.22)
    ctx.fillRect(cx+sz*0.58+rThighX+ankleOff*0.4, bodyBot+sz*0.25-walkBob+ankleOff*0.5, sz*0.16, sz*0.22)
    // Knee plates
    ctx.fillStyle = eqArmor.rarityColor || '#888'; ctx.globalAlpha = 0.7
    ctx.beginPath(); ctx.arc(cx+sz*0.35+lThighX+kneeOff*0.4, bodyBot+sz*0.25-walkBob+kneeOff*0.5, sz*0.04, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(cx+sz*0.65+rThighX+ankleOff*0.4, bodyBot+sz*0.25-walkBob+ankleOff*0.5, sz*0.04, 0, Math.PI*2); ctx.fill()
    ctx.globalAlpha = 1
  } else {
    // Ragged pants (no armor)
    ctx.fillStyle = '#5d4037'
    ctx.fillRect(cx+sz*0.26+lThighX, bodyBot-walkBob, sz*0.18, sz*0.25)
    ctx.fillRect(cx+sz*0.56+rThighX, bodyBot-walkBob, sz*0.18, sz*0.25)
    // Calves (skin)
    ctx.fillStyle = d.skinColor
    ctx.fillRect(cx+sz*0.26+lThighX+kneeOff*0.4, bodyBot+sz*0.25-walkBob+kneeOff*0.5, sz*0.16, sz*0.22)
    ctx.fillRect(cx+sz*0.58+rThighX+ankleOff*0.4, bodyBot+sz*0.25-walkBob+ankleOff*0.5, sz*0.16, sz*0.22)
    // Torn pant knees
    ctx.fillStyle = '#795548'
    ctx.beginPath()
    ctx.moveTo(cx+sz*0.3+lThighX+kneeOff*0.4, bodyBot+sz*0.22-walkBob+kneeOff*0.5)
    ctx.lineTo(cx+sz*0.35+lThighX+kneeOff*0.4, bodyBot+sz*0.28-walkBob+kneeOff*0.5)
    ctx.lineTo(cx+sz*0.4+lThighX+kneeOff*0.4, bodyBot+sz*0.22-walkBob+kneeOff*0.5)
    ctx.fill()
  }
  // Shoes
  ctx.fillStyle = '#2a1a0a'; ctx.beginPath()
  ctx.roundRect(cx+sz*0.22+lThighX+kneeOff*0.5, bodyBot+sz*0.42-walkBob+kneeOff*0.3, sz*0.24, sz*0.1, 3*s); ctx.fill()
  ctx.roundRect(cx+sz*0.54+rThighX+ankleOff*0.5, bodyBot+sz*0.42-walkBob+ankleOff*0.3, sz*0.24, sz*0.1, 3*s); ctx.fill()

  // --- WARRIOR BACK SWORD (drawn BEHIND body when idle) ---
  if (state.hero.id === 'warrior' && matk === 0 && !walk) {
    ctx.save()
    // Sword on back — diagonal behind body
    const bsx = cx + sz * 0.15  // slightly left of center
    const bsy = bodyTop - sz * 0.15  // above body top
    ctx.translate(bsx, bsy)
    ctx.rotate(0.35)  // slight diagonal tilt
    // Blade (big, behind body) — rarity color tint
    const eqWpn = state.equipped.weapon
    const wpnColor = eqWpn ? eqWpn.rarityColor : '#b0bec5'
    const sl = sz * 0.85
    ctx.fillStyle = wpnColor; ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.moveTo(-sz*0.04, 0)
    ctx.lineTo(sz*0.04, 0)
    ctx.lineTo(sz*0.03, sl)
    ctx.lineTo(-sz*0.03, sl)
    ctx.fill()
    // Blade shine
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.globalAlpha = 1
    ctx.fillRect(-sz*0.01, sz*0.05, sz*0.025, sl * 0.7)
    // Guard
    ctx.fillStyle = d.armorTrim
    ctx.fillRect(-sz*0.08, -sz*0.02, sz*0.16, sz*0.04)
    // Hilt sticking up
    ctx.fillStyle = '#5d4037'
    ctx.fillRect(-sz*0.02, -sz*0.15, sz*0.04, sz*0.15)
    // Pommel
    ctx.fillStyle = wpnColor; ctx.globalAlpha = 0.9
    ctx.beginPath()
    ctx.arc(0, -sz*0.17, sz*0.03, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
    // Weapon glow for rare+
    if (eqWpn && ['rare','epic','legendary','mythic','divine','celestial','transcendent','archgod'].includes(eqWpn.rarity)) {
      ctx.globalAlpha = 0.25 + Math.sin(t*3)*0.1
      ctx.fillStyle = wpnColor
      ctx.beginPath(); ctx.ellipse(0, sl*0.5, sz*0.12, sl*0.6, 0, 0, Math.PI*2); ctx.fill()
      ctx.globalAlpha = 1
    }
    ctx.restore()
  }

  // --- BODY TORSO ---
  const bodyW = d.body==='muscular'?0.82:d.body==='lean'?0.6:d.body==='slim'?0.58:0.72
  const bodyX = cx + sz*(1-bodyW)/2
  
  if (eqArmor) {
    // EQUIPPED ARMOR: Class-specific armor visual
    const ac = eqArmor.rarityColor || '#888'
    if (state.hero.id === 'warrior') {
      // Heavy plate armor
      ctx.fillStyle = ac; ctx.globalAlpha = 0.85
      ctx.beginPath()
      ctx.moveTo(bodyX+sz*0.05, bodyTop); ctx.quadraticCurveTo(bodyX, bodyTop+sz*0.2, bodyX+sz*0.02, bodyBot)
      ctx.lineTo(bodyX+bodyW*sz-0.02*sz, bodyBot)
      ctx.quadraticCurveTo(bodyX+sz*bodyW, bodyTop+sz*0.2, bodyX+sz*bodyW-0.05*sz, bodyTop)
      ctx.closePath(); ctx.fill()
      // Shoulder plates
      ctx.fillRect(bodyX-sz*0.08, bodyTop+sz*0.02, sz*0.18, sz*0.12)
      ctx.fillRect(bodyX+bodyW*sz-sz*0.1, bodyTop+sz*0.02, sz*0.18, sz*0.12)
      // Chest plate line
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5*s
      ctx.beginPath(); ctx.moveTo(bodyX+sz*bodyW/2, bodyTop+sz*0.05); ctx.lineTo(bodyX+sz*bodyW/2, bodyTop+sz*0.35); ctx.stroke()
      ctx.globalAlpha = 1
    } else if (state.hero.id === 'mage') {
      // Flowing robes
      ctx.fillStyle = ac; ctx.globalAlpha = 0.8
      ctx.beginPath()
      ctx.moveTo(bodyX+sz*0.05, bodyTop); ctx.quadraticCurveTo(bodyX-sz*0.05, bodyTop+sz*0.3, bodyX-sz*0.08, bodyBot+sz*0.15)
      ctx.lineTo(bodyX+bodyW*sz+sz*0.08, bodyBot+sz*0.15)
      ctx.quadraticCurveTo(bodyX+sz*bodyW+sz*0.05, bodyTop+sz*0.3, bodyX+sz*bodyW-0.05*sz, bodyTop)
      ctx.closePath(); ctx.fill()
      // Magic runes
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1*s; ctx.globalAlpha = 0.4
      ctx.beginPath(); ctx.arc(bodyX+sz*bodyW/2, bodyTop+sz*0.2, sz*0.08, 0, Math.PI*2); ctx.stroke()
      ctx.globalAlpha = 1
    } else if (state.hero.id === 'rogue') {
      // Leather armor
      ctx.fillStyle = ac; ctx.globalAlpha = 0.85
      ctx.beginPath()
      ctx.moveTo(bodyX+sz*0.08, bodyTop); ctx.quadraticCurveTo(bodyX+sz*0.03, bodyTop+sz*0.15, bodyX+sz*0.04, bodyBot)
      ctx.lineTo(bodyX+bodyW*sz-sz*0.04, bodyBot)
      ctx.quadraticCurveTo(bodyX+sz*bodyW-sz*0.03, bodyTop+sz*0.15, bodyX+sz*bodyW-sz*0.08, bodyTop)
      ctx.closePath(); ctx.fill()
      // Belt straps
      ctx.strokeStyle = '#3d2b1f'; ctx.lineWidth = 2*s; ctx.globalAlpha = 0.7
      ctx.beginPath(); ctx.moveTo(bodyX+sz*0.1, bodyTop+sz*0.25); ctx.lineTo(bodyX+sz*bodyW-sz*0.1, bodyTop+sz*0.35); ctx.stroke()
      ctx.globalAlpha = 1
    } else if (state.hero.id === 'ranger') {
      // Leather + fur trim
      ctx.fillStyle = ac; ctx.globalAlpha = 0.85
      ctx.beginPath()
      ctx.moveTo(bodyX+sz*0.06, bodyTop); ctx.quadraticCurveTo(bodyX+sz*0.01, bodyTop+sz*0.18, bodyX+sz*0.03, bodyBot)
      ctx.lineTo(bodyX+bodyW*sz-sz*0.03, bodyBot)
      ctx.quadraticCurveTo(bodyX+sz*bodyW-sz*0.01, bodyTop+sz*0.18, bodyX+sz*bodyW-sz*0.06, bodyTop)
      ctx.closePath(); ctx.fill()
      // Fur collar
      ctx.fillStyle = '#8d6e63'; ctx.globalAlpha = 0.6
      ctx.beginPath()
      ctx.ellipse(bodyX+sz*bodyW/2, bodyTop+sz*0.03, sz*bodyW*0.45, sz*0.06, 0, 0, Math.PI*2)
      ctx.fill()
      ctx.globalAlpha = 1
    } else if (state.hero.id === 'paladin') {
      // Holy plate with cross
      ctx.fillStyle = ac; ctx.globalAlpha = 0.9
      ctx.beginPath()
      ctx.moveTo(bodyX+sz*0.04, bodyTop); ctx.quadraticCurveTo(bodyX-sz*0.01, bodyTop+sz*0.2, bodyX+sz*0.02, bodyBot)
      ctx.lineTo(bodyX+bodyW*sz-sz*0.02, bodyBot)
      ctx.quadraticCurveTo(bodyX+sz*bodyW+sz*0.01, bodyTop+sz*0.2, bodyX+sz*bodyW-sz*0.04, bodyTop)
      ctx.closePath(); ctx.fill()
      // Holy cross on chest
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5*s; ctx.globalAlpha = 0.7
      ctx.beginPath()
      ctx.moveTo(bodyX+sz*bodyW/2, bodyTop+sz*0.08)
      ctx.lineTo(bodyX+sz*bodyW/2, bodyTop+sz*0.32)
      ctx.moveTo(bodyX+sz*bodyW*0.3, bodyTop+sz*0.18)
      ctx.lineTo(bodyX+sz*bodyW*0.7, bodyTop+sz*0.18)
      ctx.stroke()
      // Shoulder plates
      ctx.fillStyle = ac; ctx.globalAlpha = 0.85
      ctx.fillRect(bodyX-sz*0.06, bodyTop+sz*0.02, sz*0.16, sz*0.1)
      ctx.fillRect(bodyX+bodyW*sz-sz*0.1, bodyTop+sz*0.02, sz*0.16, sz*0.1)
      ctx.globalAlpha = 1
    } else {
      // Necromancer: dark robes
      ctx.fillStyle = ac; ctx.globalAlpha = 0.85
      ctx.beginPath()
      ctx.moveTo(bodyX+sz*0.05, bodyTop); ctx.quadraticCurveTo(bodyX-sz*0.08, bodyTop+sz*0.35, bodyX-sz*0.12, bodyBot+sz*0.2)
      ctx.lineTo(bodyX+bodyW*sz+sz*0.12, bodyBot+sz*0.2)
      ctx.quadraticCurveTo(bodyX+sz*bodyW+sz*0.08, bodyTop+sz*0.35, bodyX+sz*bodyW-sz*0.05, bodyTop)
      ctx.closePath(); ctx.fill()
      // Skull emblem
      ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.3
      ctx.beginPath(); ctx.arc(bodyX+sz*bodyW/2, bodyTop+sz*0.2, sz*0.06, 0, Math.PI*2); ctx.fill()
      ctx.globalAlpha = 1
    }
    // Belt
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(bodyX, bodyBot-sz*0.08, sz*bodyW, sz*0.08)
    ctx.fillStyle = ac; ctx.globalAlpha = 0.7
    ctx.beginPath(); ctx.roundRect(bodyX+sz*bodyW*0.4, bodyBot-sz*0.12, sz*bodyW*0.2, sz*0.16, 3*s); ctx.fill()
    ctx.globalAlpha = 1
  } else {
    // NO ARMOR: Ragged beggar clothes
    const raggedBrown = '#5d4037'
    const raggedGray = '#757575'
    // Torn tunic body
    ctx.fillStyle = raggedBrown; ctx.globalAlpha = 0.9
    ctx.beginPath()
    ctx.moveTo(bodyX+sz*0.05, bodyTop); ctx.quadraticCurveTo(bodyX, bodyTop+sz*0.2, bodyX+sz*0.02, bodyBot)
    ctx.lineTo(bodyX+bodyW*sz-0.02*sz, bodyBot)
    ctx.quadraticCurveTo(bodyX+sz*bodyW, bodyTop+sz*0.2, bodyX+sz*bodyW-0.05*sz, bodyTop)
    ctx.closePath(); ctx.fill()
    // Patch on chest
    ctx.fillStyle = raggedGray; ctx.globalAlpha = 0.6
    ctx.beginPath(); ctx.roundRect(bodyX+sz*bodyW*0.25, bodyTop+sz*0.12, sz*0.18, sz*0.14, 2*s); ctx.fill()
    // Patch stitch lines
    ctx.strokeStyle = '#3e2723'; ctx.lineWidth = 1*s; ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(bodyX+sz*bodyW*0.25, bodyTop+sz*0.19)
    ctx.lineTo(bodyX+sz*bodyW*0.25+sz*0.18, bodyTop+sz*0.19)
    ctx.stroke()
    // Second patch
    ctx.fillStyle = '#6d4c41'; ctx.globalAlpha = 0.5
    ctx.beginPath(); ctx.roundRect(bodyX+sz*bodyW*0.55, bodyTop+sz*0.22, sz*0.15, sz*0.1, 2*s); ctx.fill()
    // Torn hem
    ctx.fillStyle = raggedBrown; ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.moveTo(bodyX+sz*0.02, bodyBot-sz*0.02)
    ctx.lineTo(bodyX+sz*0.12, bodyBot+sz*0.06)
    ctx.lineTo(bodyX+sz*0.22, bodyBot)
    ctx.lineTo(bodyX+sz*0.32, bodyBot+sz*0.04)
    ctx.lineTo(bodyX+bodyW*sz*0.5, bodyBot-sz*0.01)
    ctx.lineTo(bodyX+bodyW*sz*0.6, bodyBot+sz*0.05)
    ctx.lineTo(bodyX+bodyW*sz*0.75, bodyBot)
    ctx.lineTo(bodyX+bodyW*sz*0.85, bodyBot+sz*0.04)
    ctx.lineTo(bodyX+bodyW*sz-sz*0.02, bodyBot-sz*0.02)
    ctx.fill()
    // Rope belt
    ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 2*s; ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.moveTo(bodyX, bodyBot-sz*0.06)
    ctx.lineTo(bodyX+sz*bodyW, bodyBot-sz*0.06)
    ctx.stroke()
    // Knot
    ctx.fillStyle = '#8d6e63'
    ctx.beginPath(); ctx.arc(bodyX+sz*bodyW*0.5, bodyBot-sz*0.06, 2*s, 0, Math.PI*2); ctx.fill()
    ctx.globalAlpha = 1
  }

  // --- EQUIPPED ITEM VISUALS (helmet/boots/accessory) ---
  const eqHelmet = state.equipped.helmet
  const eqBoots = state.equipped.boots
  // Helmet visual on head
  if (eqHelmet) {
    const hc = eqHelmet.rarityColor || '#888'
    ctx.fillStyle = hc; ctx.globalAlpha = 0.6
    // Crown/helm shape on head
    ctx.beginPath()
    ctx.moveTo(hx-hr*0.9, hy-hr*0.1)
    ctx.lineTo(hx-hr*0.7, hy-hr*1.1)
    ctx.lineTo(hx-hr*0.3, hy-hr*0.8)
    ctx.lineTo(hx, hy-hr*1.2)
    ctx.lineTo(hx+hr*0.3, hy-hr*0.8)
    ctx.lineTo(hx+hr*0.7, hy-hr*1.1)
    ctx.lineTo(hx+hr*0.9, hy-hr*0.1)
    ctx.quadraticCurveTo(hx+hr*1.1, hy+hr*0.3, hx+hr*0.9, hy+hr*0.5)
    ctx.lineTo(hx-hr*0.9, hy+hr*0.5)
    ctx.quadraticCurveTo(hx-hr*1.1, hy+hr*0.3, hx-hr*0.9, hy-hr*0.1)
    ctx.fill()
    // Helmet rim
    ctx.strokeStyle = hc; ctx.lineWidth = 1.5*s; ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.moveTo(hx-hr*1.0, hy+hr*0.5)
    ctx.lineTo(hx+hr*1.0, hy+hr*0.5)
    ctx.stroke()
    // Visor slit
    ctx.fillStyle = '#1a1a2e'; ctx.globalAlpha = 0.8
    ctx.fillRect(hx-hr*0.5, hy-hr*0.05, hr*1, hr*0.14)
    ctx.globalAlpha = 1; ctx.lineWidth = 1
  }
  // Boot highlights — BOLD and visible
  if (eqBoots) {
    const bc = eqBoots.rarityColor || '#888'
    // Left boot fill
    ctx.fillStyle = bc; ctx.globalAlpha = 0.65
    ctx.fillRect(cx+sz*0.20+lThighX+kneeOff*0.5, bodyBot+sz*0.40-walkBob+kneeOff*0.3, sz*0.28, sz*0.12)
    // Right boot fill
    ctx.fillRect(cx+sz*0.52+rThighX+ankleOff*0.5, bodyBot+sz*0.40-walkBob+ankleOff*0.3, sz*0.28, sz*0.12)
    // Boot outline (thick)
    ctx.strokeStyle = bc; ctx.lineWidth = 2.5*s; ctx.globalAlpha = 0.85
    ctx.strokeRect(cx+sz*0.20+lThighX+kneeOff*0.5, bodyBot+sz*0.40-walkBob+kneeOff*0.3, sz*0.28, sz*0.12)
    ctx.strokeRect(cx+sz*0.52+rThighX+ankleOff*0.5, bodyBot+sz*0.40-walkBob+ankleOff*0.3, sz*0.28, sz*0.12)
    // Boot top trim band
    ctx.strokeStyle = bc; ctx.lineWidth = 1.5*s; ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(cx+sz*0.20+lThighX+kneeOff*0.5, bodyBot+sz*0.42-walkBob+kneeOff*0.3)
    ctx.lineTo(cx+sz*0.48+lThighX+kneeOff*0.5, bodyBot+sz*0.42-walkBob+kneeOff*0.3)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx+sz*0.52+rThighX+ankleOff*0.5, bodyBot+sz*0.42-walkBob+ankleOff*0.3)
    ctx.lineTo(cx+sz*0.80+rThighX+ankleOff*0.5, bodyBot+sz*0.42-walkBob+ankleOff*0.3)
    ctx.stroke()
    ctx.globalAlpha = 1; ctx.lineWidth = 1
  }

  // --- ACCESSORY VISUALS (wings/tails) ---
  const eqAcc = state.equipped.accessory
  if (eqAcc) {
    const ac = eqAcc.rarityColor || '#aaa'
    const accName = (eqAcc.name || '').toLowerCase()
    const mt = time || 0
    const isWing = accName.includes('wing') || accName.includes('feather')
    const isTail = accName.includes('tail') || accName.includes('devil')
    const isBat = accName.includes('bat')
    const isBee = accName.includes('bee') || accName.includes('wasp')
    const isButterfly = accName.includes('butterfly') || accName.includes('moth')
    const isDragon = accName.includes('dragon')
    const isWyvern = accName.includes('wyvern')
    const isDevil = accName.includes('devil') || accName.includes('demon')
    const isBurning = accName.includes('burn') || accName.includes('fire') || accName.includes('flame')
    const isFairy = accName.includes('fairy') || accName.includes('pixie')
    const isPhoenix = accName.includes('phoenix')
    const isShadow = accName.includes('shadow')
    
    ctx.save()
    const flutter = Math.sin(mt * 8) * 0.15
    const flapSpeed = isBee ? 12 : isButterfly ? 6 : isFairy ? 10 : 8
    const flap = Math.sin(mt * flapSpeed) * 0.25
    
    if (isWing || isBat || isBee || isButterfly || isDragon || isWyvern || isFairy || isPhoenix || isShadow) {
      const wingSize = isDragon ? 1.4 : isWyvern ? 1.3 : isBat ? 1.2 : isBee ? 0.8 : isButterfly ? 1.1 : isFairy ? 0.7 : isPhoenix ? 1.3 : isShadow ? 1.1 : 1.0
      const wingY = bodyTop + sz * 0.05
      // LEFT WING
      ctx.fillStyle = ac; ctx.globalAlpha = 0.5
      ctx.beginPath()
      if (isBat || isDragon || isWyvern) {
        ctx.moveTo(cx - sz*0.1, wingY)
        ctx.quadraticCurveTo(cx - sz*0.8*wingSize, wingY - sz*0.6*wingSize + flap*sz*2, cx - sz*1.0*wingSize, wingY + sz*0.1 + flutter*sz)
        ctx.quadraticCurveTo(cx - sz*0.7*wingSize, wingY - sz*0.3*wingSize + flap*sz, cx - sz*0.5*wingSize, wingY - sz*0.1*wingSize + flap*sz*0.5)
        ctx.quadraticCurveTo(cx - sz*0.6*wingSize, wingY + sz*0.1 + flutter*sz*0.5, cx - sz*0.8*wingSize, wingY + sz*0.3 + flutter*sz)
        ctx.quadraticCurveTo(cx - sz*0.5*wingSize, wingY + sz*0.15 + flutter*sz*0.3, cx - sz*0.3*wingSize, wingY + sz*0.2)
        ctx.lineTo(cx - sz*0.1, wingY + sz*0.1)
        ctx.closePath(); ctx.fill()
        ctx.strokeStyle = ac; ctx.lineWidth = 1.5*s; ctx.globalAlpha = 0.6
        ctx.beginPath()
        ctx.moveTo(cx - sz*0.1, wingY); ctx.lineTo(cx - sz*0.8*wingSize, wingY - sz*0.5*wingSize + flap*sz*1.5)
        ctx.moveTo(cx - sz*0.15, wingY + sz*0.05); ctx.lineTo(cx - sz*0.7*wingSize, wingY + sz*0.2 + flutter*sz*0.5)
        ctx.stroke()
      } else if (isBee) {
        ctx.ellipse(cx - sz*0.45*wingSize, wingY - sz*0.15 + flap*sz*0.8, sz*0.35*wingSize, sz*0.15*wingSize, -0.3 + flutter, 0, Math.PI*2); ctx.fill()
        ctx.globalAlpha = 0.35; ctx.beginPath()
        ctx.ellipse(cx - sz*0.35*wingSize, wingY + sz*0.05 + flap*sz*0.4, sz*0.25*wingSize, sz*0.1*wingSize, -0.2 + flutter*0.5, 0, Math.PI*2); ctx.fill()
      } else if (isButterfly) {
        ctx.ellipse(cx - sz*0.5*wingSize, wingY - sz*0.15 + flap*sz, sz*0.4*wingSize, sz*0.25*wingSize, -0.2 + flutter, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.3; ctx.beginPath()
        ctx.arc(cx - sz*0.5*wingSize, wingY - sz*0.15 + flap*sz, sz*0.12*wingSize, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = ac; ctx.globalAlpha = 0.4; ctx.beginPath()
        ctx.ellipse(cx - sz*0.4*wingSize, wingY + sz*0.15 + flap*sz*0.5, sz*0.3*wingSize, sz*0.18*wingSize, -0.1 + flutter*0.5, 0, Math.PI*2); ctx.fill()
      } else if (isFairy) {
        ctx.globalAlpha = 0.35; ctx.beginPath()
        ctx.ellipse(cx - sz*0.4*wingSize, wingY - sz*0.1 + flap*sz*0.7, sz*0.3*wingSize, sz*0.12*wingSize, -0.4 + flutter, 0, Math.PI*2); ctx.fill()
        ctx.globalAlpha = 0.25; ctx.beginPath()
        ctx.ellipse(cx - sz*0.35*wingSize, wingY + sz*0.08 + flap*sz*0.4, sz*0.22*wingSize, sz*0.08*wingSize, -0.2 + flutter*0.5, 0, Math.PI*2); ctx.fill()
        ctx.globalAlpha = 0.15 + Math.sin(mt*4)*0.08; ctx.beginPath()
        ctx.arc(cx - sz*0.4*wingSize, wingY - sz*0.05, sz*0.5*wingSize, 0, Math.PI*2); ctx.fillStyle = ac; ctx.fill()
      } else if (isPhoenix) {
        // Phoenix wing (flame-like, flowing)
        ctx.moveTo(cx - sz*0.1, wingY)
        ctx.quadraticCurveTo(cx - sz*0.7*wingSize, wingY - sz*0.7*wingSize + flap*sz*2, cx - sz*1.1*wingSize, wingY + sz*0.05 + flutter*sz)
        ctx.quadraticCurveTo(cx - sz*0.8*wingSize, wingY - sz*0.2*wingSize + flap*sz, cx - sz*0.5*wingSize, wingY + sz*0.05 + flutter*sz*0.5)
        ctx.quadraticCurveTo(cx - sz*0.6*wingSize, wingY + sz*0.2 + flutter*sz*0.3, cx - sz*0.3*wingSize, wingY + sz*0.15)
        ctx.lineTo(cx - sz*0.1, wingY + sz*0.08)
        ctx.closePath(); ctx.fill()
        // Flame effect
        ctx.globalAlpha = 0.3; ctx.fillStyle = '#ff6600'
        for (let f = 0; f < 3; f++) {
          ctx.beginPath()
          ctx.arc(cx - sz*(0.5+f*0.15)*wingSize, wingY - sz*0.3*wingSize + f*sz*0.1 + flap*sz*(1-f*0.2), sz*0.08, 0, Math.PI*2)
          ctx.fill()
        }
      } else if (isShadow) {
        // Shadow wing (dark, wispy)
        ctx.globalAlpha = 0.4
        ctx.moveTo(cx - sz*0.1, wingY)
        ctx.bezierCurveTo(cx - sz*0.5*wingSize, wingY - sz*0.4*wingSize + flap*sz*1.5, cx - sz*0.9*wingSize, wingY - sz*0.2*wingSize + flap*sz, cx - sz*1.0*wingSize, wingY + sz*0.15 + flutter*sz)
        ctx.bezierCurveTo(cx - sz*0.7*wingSize, wingY + sz*0.1 + flutter*sz*0.5, cx - sz*0.4*wingSize, wingY + sz*0.2 + flutter*sz*0.3, cx - sz*0.1, wingY + sz*0.1)
        ctx.closePath(); ctx.fill()
        // Shadow particles
        ctx.globalAlpha = 0.25
        for (let p = 0; p < 4; p++) {
          ctx.beginPath()
          ctx.arc(cx - sz*(0.3+p*0.15)*wingSize, wingY + Math.sin(mt*3+p)*sz*0.1, sz*0.04, 0, Math.PI*2)
          ctx.fill()
        }
      } else {
        ctx.moveTo(cx - sz*0.1, wingY)
        ctx.quadraticCurveTo(cx - sz*0.6*wingSize, wingY - sz*0.5*wingSize + flap*sz*1.5, cx - sz*0.9*wingSize, wingY + sz*0.2 + flutter*sz)
        ctx.quadraticCurveTo(cx - sz*0.5*wingSize, wingY + sz*0.1 + flutter*sz*0.3, cx - sz*0.1, wingY + sz*0.15)
        ctx.closePath(); ctx.fill()
      }
      // RIGHT WING (mirror)
      ctx.fillStyle = ac; ctx.globalAlpha = 0.5; ctx.beginPath()
      if (isBat || isDragon || isWyvern) {
        ctx.moveTo(cx + sz*0.9, wingY)
        ctx.quadraticCurveTo(cx + sz*1.6*wingSize, wingY - sz*0.6*wingSize + flap*sz*2, cx + sz*1.8*wingSize, wingY + sz*0.1 + flutter*sz)
        ctx.quadraticCurveTo(cx + sz*1.5*wingSize, wingY - sz*0.3*wingSize + flap*sz, cx + sz*1.3*wingSize, wingY - sz*0.1*wingSize + flap*sz*0.5)
        ctx.quadraticCurveTo(cx + sz*1.4*wingSize, wingY + sz*0.1 + flutter*sz*0.5, cx + sz*1.6*wingSize, wingY + sz*0.3 + flutter*sz)
        ctx.quadraticCurveTo(cx + sz*1.3*wingSize, wingY + sz*0.15 + flutter*sz*0.3, cx + sz*1.1*wingSize, wingY + sz*0.2)
        ctx.lineTo(cx + sz*0.9, wingY + sz*0.1); ctx.closePath(); ctx.fill()
      } else if (isBee) {
        ctx.ellipse(cx + sz*1.25*wingSize, wingY - sz*0.15 + flap*sz*0.8, sz*0.35*wingSize, sz*0.15*wingSize, 0.3 - flutter, 0, Math.PI*2); ctx.fill()
        ctx.globalAlpha = 0.35; ctx.beginPath()
        ctx.ellipse(cx + sz*1.15*wingSize, wingY + sz*0.05 + flap*sz*0.4, sz*0.25*wingSize, sz*0.1*wingSize, 0.2 - flutter*0.5, 0, Math.PI*2); ctx.fill()
      } else if (isButterfly) {
        ctx.ellipse(cx + sz*1.3*wingSize, wingY - sz*0.15 + flap*sz, sz*0.4*wingSize, sz*0.25*wingSize, 0.2 - flutter, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.3; ctx.beginPath()
        ctx.arc(cx + sz*1.3*wingSize, wingY - sz*0.15 + flap*sz, sz*0.12*wingSize, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = ac; ctx.globalAlpha = 0.4; ctx.beginPath()
        ctx.ellipse(cx + sz*1.2*wingSize, wingY + sz*0.15 + flap*sz*0.5, sz*0.3*wingSize, sz*0.18*wingSize, 0.1 - flutter*0.5, 0, Math.PI*2); ctx.fill()
      } else if (isFairy) {
        ctx.globalAlpha = 0.35; ctx.beginPath()
        ctx.ellipse(cx + sz*1.2*wingSize, wingY - sz*0.1 + flap*sz*0.7, sz*0.3*wingSize, sz*0.12*wingSize, 0.4 - flutter, 0, Math.PI*2); ctx.fill()
        ctx.globalAlpha = 0.25; ctx.beginPath()
        ctx.ellipse(cx + sz*1.15*wingSize, wingY + sz*0.08 + flap*sz*0.4, sz*0.22*wingSize, sz*0.08*wingSize, 0.2 - flutter*0.5, 0, Math.PI*2); ctx.fill()
        ctx.globalAlpha = 0.15 + Math.sin(mt*4)*0.08; ctx.beginPath()
        ctx.arc(cx + sz*1.2*wingSize, wingY - sz*0.05, sz*0.5*wingSize, 0, Math.PI*2); ctx.fillStyle = ac; ctx.fill()
      } else if (isPhoenix) {
        // Phoenix wing right (mirror)
        ctx.moveTo(cx + sz*0.9, wingY)
        ctx.quadraticCurveTo(cx + sz*1.5*wingSize, wingY - sz*0.7*wingSize + flap*sz*2, cx + sz*1.9*wingSize, wingY + sz*0.05 + flutter*sz)
        ctx.quadraticCurveTo(cx + sz*1.6*wingSize, wingY - sz*0.2*wingSize + flap*sz, cx + sz*1.3*wingSize, wingY + sz*0.05 + flutter*sz*0.5)
        ctx.quadraticCurveTo(cx + sz*1.4*wingSize, wingY + sz*0.2 + flutter*sz*0.3, cx + sz*1.1*wingSize, wingY + sz*0.15)
        ctx.lineTo(cx + sz*0.9, wingY + sz*0.08)
        ctx.closePath(); ctx.fill()
        ctx.globalAlpha = 0.3; ctx.fillStyle = '#ff6600'
        for (let f = 0; f < 3; f++) {
          ctx.beginPath()
          ctx.arc(cx + sz*(1.3+f*0.15)*wingSize, wingY - sz*0.3*wingSize + f*sz*0.1 + flap*sz*(1-f*0.2), sz*0.08, 0, Math.PI*2)
          ctx.fill()
        }
      } else if (isShadow) {
        // Shadow wing right (mirror)
        ctx.globalAlpha = 0.4
        ctx.moveTo(cx + sz*0.9, wingY)
        ctx.bezierCurveTo(cx + sz*1.3*wingSize, wingY - sz*0.4*wingSize + flap*sz*1.5, cx + sz*1.7*wingSize, wingY - sz*0.2*wingSize + flap*sz, cx + sz*1.8*wingSize, wingY + sz*0.15 + flutter*sz)
        ctx.bezierCurveTo(cx + sz*1.5*wingSize, wingY + sz*0.1 + flutter*sz*0.5, cx + sz*1.2*wingSize, wingY + sz*0.2 + flutter*sz*0.3, cx + sz*0.9, wingY + sz*0.1)
        ctx.closePath(); ctx.fill()
        ctx.globalAlpha = 0.25
        for (let p = 0; p < 4; p++) {
          ctx.beginPath()
          ctx.arc(cx + sz*(1.1+p*0.15)*wingSize, wingY + Math.sin(mt*3+p)*sz*0.1, sz*0.04, 0, Math.PI*2)
          ctx.fill()
        }
      } else {
        ctx.moveTo(cx + sz*0.9, wingY)
        ctx.quadraticCurveTo(cx + sz*1.4*wingSize, wingY - sz*0.5*wingSize + flap*sz*1.5, cx + sz*1.7*wingSize, wingY + sz*0.2 + flutter*sz)
        ctx.quadraticCurveTo(cx + sz*1.3*wingSize, wingY + sz*0.1 + flutter*sz*0.3, cx + sz*0.9, wingY + sz*0.15)
        ctx.closePath(); ctx.fill()
      }
    }
    if (isTail || isDevil || isBurning) {
      const tailStartX = cx + sz * 0.6, tailStartY = bodyBot + sz * 0.1
      const tailWag = Math.sin(mt * 4) * sz * 0.15
      if (isDevil || isBurning) {
        ctx.strokeStyle = isBurning ? '#ff4400' : ac; ctx.lineWidth = 3.5 * s; ctx.globalAlpha = 0.85
        ctx.beginPath()
        ctx.moveTo(tailStartX, tailStartY)
        ctx.quadraticCurveTo(tailStartX + sz*0.4, tailStartY + sz*0.2 + tailWag, tailStartX + sz*0.7, tailStartY - sz*0.1 + tailWag*1.5)
        ctx.quadraticCurveTo(tailStartX + sz*0.85, tailStartY - sz*0.3 + tailWag*1.2, tailStartX + sz*0.75, tailStartY - sz*0.5 + tailWag*0.8)
        ctx.stroke()
        ctx.fillStyle = isBurning ? '#ff4400' : ac; ctx.globalAlpha = 0.9; ctx.beginPath()
        const tipX = tailStartX + sz*0.75, tipY = tailStartY - sz*0.5 + tailWag*0.8
        ctx.moveTo(tipX, tipY - sz*0.12); ctx.lineTo(tipX - sz*0.08, tipY + sz*0.06); ctx.lineTo(tipX, tipY + sz*0.02); ctx.lineTo(tipX + sz*0.08, tipY + sz*0.06)
        ctx.closePath(); ctx.fill()
        if (isBurning) {
          for (let p = 0; p < 3; p++) {
            const px = tipX + Math.sin(mt*6+p*2)*sz*0.1, py = tipY - sz*0.1 - Math.abs(Math.sin(mt*5+p*1.5))*sz*0.2
            ctx.fillStyle = p === 0 ? '#ff6600' : p === 1 ? '#ffaa00' : '#ff4400'
            ctx.globalAlpha = 0.6 - p*0.15; ctx.beginPath()
            ctx.arc(px, py, sz*0.04*(3-p), 0, Math.PI*2); ctx.fill()
          }
        }
      } else {
        ctx.strokeStyle = ac; ctx.lineWidth = 3 * s; ctx.globalAlpha = 0.75
        ctx.beginPath()
        ctx.moveTo(tailStartX, tailStartY)
        ctx.quadraticCurveTo(tailStartX + sz*0.5, tailStartY + sz*0.3 + tailWag, tailStartX + sz*0.8, tailStartY + tailWag*1.2)
        ctx.stroke()
        ctx.fillStyle = ac; ctx.globalAlpha = 0.7; ctx.beginPath()
        ctx.arc(tailStartX + sz*0.8, tailStartY + tailWag*1.2, sz*0.06, 0, Math.PI*2); ctx.fill()
      }
    }
    ctx.globalAlpha = 1; ctx.lineWidth = 1; ctx.restore()
  }

  // --- ARMS ---
  // Left arm (back side / shield arm) - swings with walk
  const armSwing = walk ? walkCycle * 5 * s : 0 // swing with walk, opposite phase to right leg
  const larmX = walk ? -walkCycle * 2 * s : 0
  const larmY = (isIdle ? Math.sin(frameCount * 0.03) * 1.5 * s : armSwing)
  // Arm skin
  ctx.fillStyle = d.skinColor
  ctx.beginPath(); ctx.roundRect(cx-sz*0.06+larmX, bodyTop+sz*0.05+larmY, sz*0.12, sz*0.35, 3*s); ctx.fill()
  if (eqArmor) {
    // Armored sleeve
    ctx.fillStyle = eqArmor.rarityColor || '#888'
    ctx.fillRect(cx-sz*0.08+larmX, bodyTop+sz*0.12+larmY, sz*0.16, sz*0.08)
  } else {
    // Ragged sleeve (torn cloth)
    ctx.fillStyle = '#5d4037'
    ctx.fillRect(cx-sz*0.08+larmX, bodyTop+sz*0.12+larmY, sz*0.16, sz*0.06)
    // Torn edge
    ctx.fillStyle = '#795548'
    ctx.beginPath()
    ctx.moveTo(cx-sz*0.08+larmX, bodyTop+sz*0.18+larmY)
    ctx.lineTo(cx-sz*0.04+larmX, bodyTop+sz*0.21+larmY)
    ctx.lineTo(cx+sz*0.0+larmX, bodyTop+sz*0.18+larmY)
    ctx.lineTo(cx+sz*0.04+larmX, bodyTop+sz*0.2+larmY)
    ctx.lineTo(cx+sz*0.08+larmX, bodyTop+sz*0.18+larmY)
    ctx.fill()
  }
  // Shield visual (paladin only) — BOLD
  const eqShield = state.equipped.shield
  if (state.hero.id === 'paladin' && eqShield) {
    const sc = eqShield.rarityColor || '#3498DB'
    const shieldX = cx - sz*0.18 + larmX
    const shieldY = bodyTop + sz*0.12 + larmY
    // Shield body
    ctx.fillStyle = sc; ctx.globalAlpha = 0.75
    ctx.beginPath()
    ctx.moveTo(shieldX, shieldY)
    ctx.lineTo(shieldX + sz*0.40, shieldY)
    ctx.lineTo(shieldX + sz*0.40, shieldY + sz*0.34)
    ctx.lineTo(shieldX + sz*0.20, shieldY + sz*0.48)
    ctx.lineTo(shieldX, shieldY + sz*0.34)
    ctx.closePath()
    ctx.fill()
    // Shield border (thick)
    ctx.strokeStyle = sc; ctx.lineWidth = 3*s; ctx.globalAlpha = 0.9
    ctx.beginPath()
    ctx.moveTo(shieldX, shieldY)
    ctx.lineTo(shieldX + sz*0.40, shieldY)
    ctx.lineTo(shieldX + sz*0.40, shieldY + sz*0.34)
    ctx.lineTo(shieldX + sz*0.20, shieldY + sz*0.48)
    ctx.lineTo(shieldX, shieldY + sz*0.34)
    ctx.closePath()
    ctx.stroke()
    // Cross emblem
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2*s; ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.moveTo(shieldX + sz*0.20, shieldY + sz*0.06)
    ctx.lineTo(shieldX + sz*0.20, shieldY + sz*0.32)
    ctx.moveTo(shieldX + sz*0.08, shieldY + sz*0.18)
    ctx.lineTo(shieldX + sz*0.32, shieldY + sz*0.18)
    ctx.stroke()
    // Shield gem
    ctx.fillStyle = '#FFD700'; ctx.globalAlpha = 0.85
    ctx.beginPath(); ctx.arc(shieldX + sz*0.20, shieldY + sz*0.18, sz*0.05, 0, Math.PI*2); ctx.fill()
    ctx.globalAlpha = 1; ctx.lineWidth = 1
  }
  // Right arm (weapon arm) with attack swing + walk bob
  ctx.save()
  ctx.translate(cx+sz*0.88, bodyTop+sz*0.02-walkBob)
  const wid2 = state.hero.id
  let swingAngle = 0
  if (matk > 0) {
    if (wid2 === 'warrior') {
      // Warrior: hand raises UP fully vertical → sword appears → slash DOWN
      // matk counts down 20→0
      if (matk > 10) {
        // Phase 1: arm raises FULLY UP above head (vertical)
        const t = (20 - matk) / 10  // 0→1
        swingAngle = -t * 2.2  // 0 → -2.2 (arm fully up, past vertical)
      } else {
        // Phase 2: slash DOWN from above
        const t = (10 - matk) / 10  // 0→1
        swingAngle = -2.2 + t * 3.0  // -2.2 → 0.8 (big slam down)
      }
    } else if (wid2 === 'rogue') {
      // Rogue: quick double stab — fast forward thrust
      const phase = matk > 10 ? 1 : 0
      swingAngle = phase === 1
        ? (matk > 14 ? -0.8 : (1 - (matk - 14) / 4) * 1.6 - 0.8)  // pullback
        : (matk > 8 ? 0.6 : (1 - matk / 8) * 1.2)                  // thrust forward
    } else if (wid2 === 'paladin') {
      // Paladin: heavy overhead raise then smash down
      swingAngle = matk > 14 ? -1.5 : matk > 8 ? (1 - (matk - 8) / 6) * 2.5 - 1.5 : 0
    } else if (wid2 === 'ranger') {
      // Ranger: bow draw-back then release
      swingAngle = matk > 10 ? -0.3 : (1 - matk / 10) * 0.5
    }
  }
  ctx.rotate(swingAngle)
  // Arm skin
  ctx.fillStyle = d.skinColor
  ctx.beginPath(); ctx.roundRect(-sz*0.06, 0, sz*0.12, sz*0.35, 3*s); ctx.fill()
  if (eqArmor) {
    // Armored sleeve
    ctx.fillStyle = eqArmor.rarityColor || '#888'
    ctx.fillRect(-sz*0.08, sz*0.02, sz*0.16, sz*0.08)
  } else {
    // Ragged sleeve
    ctx.fillStyle = '#5d4037'
    ctx.fillRect(-sz*0.08, sz*0.02, sz*0.16, sz*0.06)
    ctx.fillStyle = '#795548'
    ctx.beginPath()
    ctx.moveTo(-sz*0.08, sz*0.08)
    ctx.lineTo(-sz*0.04, sz*0.11)
    ctx.lineTo(0, sz*0.08)
    ctx.lineTo(sz*0.04, sz*0.1)
    ctx.lineTo(sz*0.08, sz*0.08)
    ctx.fill()
  }
  // Hand/glove
  ctx.fillStyle = '#2a1a0a'; ctx.fillRect(-sz*0.07, sz*0.28, sz*0.14, sz*0.08)

  // --- WEAPON ---
  ctx.translate(0, sz*0.06)
  const wid = state.hero.id
  const eqWpnColor = state.equipped.weapon ? state.equipped.weapon.rarityColor : '#b0bec5'
  if (wid === 'warrior') {
    // Warrior: sword only visible when slashing down (matk <= 10)
    if (matk > 0 && matk <= 10) {
      const swordLen = sz * 0.9
      const swordW = sz * 0.1
      // Blade — rarity color
      ctx.fillStyle = eqWpnColor; ctx.globalAlpha = 0.85
      ctx.beginPath()
      ctx.moveTo(-swordW * 0.5, sz * 0.15)
      ctx.lineTo(swordW * 0.5, sz * 0.15)
      ctx.lineTo(swordW * 0.3, sz * 0.15 + swordLen)
      ctx.lineTo(-swordW * 0.3, sz * 0.15 + swordLen)
      ctx.fill()
      // Blade edge shine
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.globalAlpha = 1
      ctx.fillRect(-swordW * 0.1, sz * 0.2, swordW * 0.15, swordLen * 0.8)
      // Guard
      ctx.fillStyle = d.armorTrim
      ctx.beginPath()
      ctx.roundRect(-sz * 0.12, sz * 0.1, sz * 0.26, sz * 0.08, 2 * s)
      ctx.fill()
      // Hilt
      ctx.fillStyle = '#5d4037'
      ctx.fillRect(-sz * 0.025, sz * -0.05, sz * 0.06, sz * 0.2)
      // Pommel
      ctx.fillStyle = eqWpnColor; ctx.globalAlpha = 0.9
      ctx.beginPath()
      ctx.arc(sz * 0.005, sz * -0.06, sz * 0.04, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }
  } else if (wid === 'mage') {
    ctx.fillStyle = '#5d4037'; ctx.fillRect(-sz*0.01, sz*-0.65, sz*0.05, sz*1.0) // staff
    ctx.fillStyle = eqWpnColor; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(-sz*0.01, sz*-0.72, sz*0.15, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1
    ctx.fillStyle = '#e1bee7'; ctx.beginPath(); ctx.arc(-sz*0.01, sz*-0.72, sz*0.09, 0, Math.PI*2); ctx.fill()
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sz*0.03, sz*-0.76, sz*0.03, 0, Math.PI*2); ctx.fill()
  } else if (wid === 'rogue') {
    ctx.fillStyle = eqWpnColor; ctx.globalAlpha = 0.85; ctx.fillRect(sz*0.01, sz*0.25, sz*0.05, sz*0.5); ctx.globalAlpha = 1
    ctx.fillStyle = '#cfd8dc'; ctx.fillRect(-sz*0.04, sz*0.22, sz*0.15, sz*0.08)
    ctx.fillStyle = '#5d4037'; ctx.fillRect(sz*0.02, sz*0.7, sz*0.03, sz*0.1)
  } else if (wid === 'ranger') {
    // Bow body (curved wood)
    ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 3 * s
    ctx.beginPath(); ctx.arc(sz * 0.04, sz * 0.35, sz * 0.25, -1.4, 1.2); ctx.stroke()
    // Bow tips
    ctx.fillStyle = eqWpnColor; ctx.globalAlpha = 0.7
    ctx.beginPath(); ctx.arc(sz * 0.04 + Math.cos(-1.4) * sz * 0.25, sz * 0.35 + Math.sin(-1.4) * sz * 0.25, 2 * s, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(sz * 0.04 + Math.cos(1.2) * sz * 0.25, sz * 0.35 + Math.sin(1.2) * sz * 0.25, 2 * s, 0, Math.PI * 2); ctx.fill()
    // Bowstring (taut line, pulls back during attack)
    const drawAmt = matk > 0 && matk < 10 ? (1 - matk / 10) * sz * 0.15 : 0
    ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 1 * s
    ctx.beginPath()
    ctx.moveTo(sz * 0.04 + Math.cos(-1.4) * sz * 0.25, sz * 0.35 + Math.sin(-1.4) * sz * 0.25)
    ctx.quadraticCurveTo(sz * 0.04 - drawAmt, sz * 0.35, sz * 0.04 + Math.cos(1.2) * sz * 0.25, sz * 0.35 + Math.sin(1.2) * sz * 0.25)
    ctx.stroke()
    // Arrow on string (visible when bow is drawn)
    if (matk > 0 && matk < 12) {
      ctx.fillStyle = '#8d6e63'
      ctx.fillRect(sz * 0.04 - drawAmt - sz * 0.2, sz * 0.33, sz * 0.25, 2 * s)
      // Arrowhead
      ctx.fillStyle = '#b0bec5'
      ctx.beginPath(); ctx.moveTo(sz * 0.04 - drawAmt - sz * 0.2, sz * 0.33); ctx.lineTo(sz * 0.04 - drawAmt - sz * 0.25, sz * 0.34); ctx.lineTo(sz * 0.04 - drawAmt - sz * 0.2, sz * 0.35); ctx.fill()
    }
  } else if (wid === 'paladin') {
    ctx.fillStyle = eqWpnColor; ctx.globalAlpha = 0.8; ctx.fillRect(-sz*0.02, sz*0.2, sz*0.07, sz*0.7); ctx.globalAlpha = 1
    ctx.fillStyle = d.armorTrim; ctx.fillRect(-sz*0.08, sz*0.18, sz*0.19, sz*0.1)
    ctx.fillStyle = '#f1c40f'; ctx.fillRect(-sz*0.1, sz*0.22, sz*0.22, sz*0.04)
    ctx.fillStyle = eqWpnColor; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(-sz*0.02, sz*0.88, sz*0.08, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1
  } else if (wid === 'necromancer') {
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-sz*0.01, sz*0.2, sz*0.05, sz*0.6)
    ctx.fillStyle = eqWpnColor; ctx.globalAlpha = 0.7; ctx.beginPath()
    ctx.moveTo(sz*0.01, sz*0.18); ctx.quadraticCurveTo(sz*0.35, sz*0.0, sz*0.3, sz*0.25); ctx.lineTo(sz*0.1, sz*0.22); ctx.fill(); ctx.globalAlpha = 1
    ctx.fillStyle = '#00e676'; ctx.beginPath(); ctx.arc(sz*0.2, sz*0.1, sz*0.04, 0, Math.PI*2); ctx.fill()
  }
  ctx.restore()

  // --- ANIME HEAD ---
  // Hair behind head
  if (d.hairStyle === 'longFlow') {
    ctx.fillStyle = d.hairColor
    ctx.beginPath(); ctx.moveTo(hx-sz*0.12, hy-sz*0.05); ctx.quadraticCurveTo(hx-sz*0.25, hy+sz*0.1, hx-sz*0.15, hy+sz*0.35); ctx.lineTo(hx+sz*0.05, hy+sz*0.3); ctx.quadraticCurveTo(hx-sz*0.05, hy+sz*0.05, hx+sz*0.1, hy-sz*0.05); ctx.fill()
    ctx.beginPath(); ctx.moveTo(hx+sz*0.12, hy-sz*0.05); ctx.quadraticCurveTo(hx+sz*0.25, hy+sz*0.1, hx+sz*0.15, hy+sz*0.35); ctx.lineTo(hx-sz*0.05, hy+sz*0.3); ctx.quadraticCurveTo(hx+sz*0.05, hy+sz*0.05, hx-sz*0.1, hy-sz*0.05); ctx.fill()
  }
  // Face
  ctx.fillStyle = d.skinColor; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI*2); ctx.fill()
  // Chin - pointed anime style
  ctx.fillStyle = d.skinColor; ctx.beginPath(); ctx.moveTo(hx-sz*0.08, hy+hr*0.6); ctx.quadraticCurveTo(hx, hy+hr*1.05, hx+sz*0.08, hy+hr*0.6); ctx.fill()

  // Ears
  if (d.hasElfEars) {
    ctx.fillStyle = d.skinColor
    ctx.beginPath(); ctx.moveTo(hx-hr*0.9, hy-sz*0.05); ctx.lineTo(hx-hr*1.3, hy-sz*0.2); ctx.lineTo(hx-hr*0.85, hy+sz*0.04); ctx.fill()
    ctx.beginPath(); ctx.moveTo(hx+hr*0.9, hy-sz*0.05); ctx.lineTo(hx+hr*1.3, hy-sz*0.2); ctx.lineTo(hx+hr*0.85, hy+sz*0.04); ctx.fill()
  }

  // ANIME EYES (big + expressive)
  const eyeY = hy - sz*0.02, eyeW = sz*0.1, eyeH = sz*0.11
  // Eye whites
  ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.ellipse(hx-sz*0.1, eyeY, eyeW, eyeH, 0, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(hx+sz*0.1, eyeY, eyeW, eyeH, 0, 0, Math.PI*2); ctx.fill()
  // Iris (big anime iris)
  ctx.fillStyle = d.eyeColor
  ctx.beginPath(); ctx.ellipse(hx-sz*0.1, eyeY+sz*0.01, eyeW*0.85, eyeH*0.85, 0, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(hx+sz*0.1, eyeY+sz*0.01, eyeW*0.85, eyeH*0.85, 0, 0, Math.PI*2); ctx.fill()
  // Pupils
  ctx.fillStyle = '#000'
  ctx.beginPath(); ctx.ellipse(hx-sz*0.1, eyeY+sz*0.02, eyeW*0.4, eyeH*0.5, 0, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(hx+sz*0.1, eyeY+sz*0.02, eyeW*0.4, eyeH*0.5, 0, 0, Math.PI*2); ctx.fill()
  // Eye highlights (crucial for anime look)
  ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.arc(hx-sz*0.13, eyeY-sz*0.03, eyeW*0.3, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(hx+sz*0.07, eyeY-sz*0.03, eyeW*0.3, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(hx-sz*0.08, eyeY+sz*0.05, eyeW*0.15, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(hx+sz*0.12, eyeY+sz*0.05, eyeW*0.15, 0, Math.PI*2); ctx.fill()
  // Smooth blink animation (gradual close/open)
  if (blinkAmt > 0.01) {
    // Squash eye height based on blink amount
    const blinkH = eyeH * (1 - blinkAmt * 0.9) // shrink to 10% height
    // Overwrite eyes with skin color first
    ctx.fillStyle = d.skinColor
    ctx.fillRect(hx-sz*0.22, eyeY-eyeH*1.2, sz*0.44, eyeH*2.8)
    // Re-draw squashed eyes
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.ellipse(hx-sz*0.1, eyeY, eyeW, blinkH, 0, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(hx+sz*0.1, eyeY, eyeW, blinkH, 0, 0, Math.PI*2); ctx.fill()
    if (blinkAmt > 0.5) {
      // Nearly closed: draw lash line
      ctx.strokeStyle = '#6d4e4e'; ctx.lineWidth = 1.5*s
      ctx.beginPath(); ctx.moveTo(hx-sz*0.2, eyeY+sz*0.01); ctx.quadraticCurveTo(hx-sz*0.1, eyeY+sz*0.03, hx-sz*0.01, eyeY+sz*0.01); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(hx+sz*0.2, eyeY+sz*0.01); ctx.quadraticCurveTo(hx+sz*0.1, eyeY+sz*0.03, hx+sz*0.01, eyeY+sz*0.01); ctx.stroke()
    } else {
      // Partially closed: show iris/pupil through squashed eye
      ctx.fillStyle = d.eyeColor
      ctx.beginPath(); ctx.ellipse(hx-sz*0.1, eyeY+sz*0.01, eyeW*0.85, blinkH*0.85, 0, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(hx+sz*0.1, eyeY+sz*0.01, eyeW*0.85, blinkH*0.85, 0, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = '#000'
      ctx.beginPath(); ctx.ellipse(hx-sz*0.1, eyeY+sz*0.02, eyeW*0.4, blinkH*0.5, 0, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(hx+sz*0.1, eyeY+sz*0.02, eyeW*0.4, blinkH*0.5, 0, 0, Math.PI*2); ctx.fill()
    }
  }
  // Glow for necromancer
  if (d.useGlow) {
    ctx.fillStyle = 'rgba(0,230,118,0.2)'
    ctx.beginPath(); ctx.ellipse(hx-sz*0.1, eyeY, eyeW*1.5, eyeH*1.5, 0, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(hx+sz*0.1, eyeY, eyeW*1.5, eyeH*1.5, 0, 0, Math.PI*2); ctx.fill()
  }

  // Eyebrows
  if (d.eyebrowStyle && d.eyebrowStyle !== 'none') {
    ctx.strokeStyle = d.hairColor; ctx.lineWidth = 2*s
    ctx.beginPath()
    if (d.eyebrowStyle === 'thick') { ctx.moveTo(hx-sz*0.2, eyeY-eyeH*1.1); ctx.lineTo(hx-sz*0.01, eyeY-eyeH*0.8); ctx.moveTo(hx+sz*0.01, eyeY-eyeH*0.8); ctx.lineTo(hx+sz*0.2, eyeY-eyeH*1.1) }
    else if (d.eyebrowStyle === 'sharp') { ctx.moveTo(hx-sz*0.18, eyeY-eyeH); ctx.lineTo(hx-sz*0.04, eyeY-eyeH*1.2); ctx.moveTo(hx+sz*0.04, eyeY-eyeH*1.2); ctx.lineTo(hx+sz*0.18, eyeY-eyeH) }
    else if (d.eyebrowStyle === 'noble') { ctx.moveTo(hx-sz*0.16, eyeY-eyeH*0.9); ctx.quadraticCurveTo(hx-sz*0.08, eyeY-eyeH*1.1, hx-sz*0.01, eyeY-eyeH*0.85); ctx.moveTo(hx+sz*0.01, eyeY-eyeH*0.85); ctx.quadraticCurveTo(hx+sz*0.08, eyeY-eyeH*1.1, hx+sz*0.16, eyeY-eyeH*0.9) }
    else { ctx.moveTo(hx-sz*0.16, eyeY-eyeH*0.8); ctx.lineTo(hx-sz*0.01, eyeY-eyeH*0.6); ctx.moveTo(hx+sz*0.01, eyeY-eyeH*0.6); ctx.lineTo(hx+sz*0.16, eyeY-eyeH*0.8) }
    ctx.stroke()
  }

  // Mouth
  ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 1*s
  ctx.beginPath(); ctx.moveTo(hx-sz*0.04, hy+hr*0.55); ctx.quadraticCurveTo(hx, hy+hr*0.7, hx+sz*0.04, hy+hr*0.55); ctx.stroke()

  // Nose
  ctx.fillStyle = d.skinColor; ctx.beginPath(); ctx.moveTo(hx, hy+hr*0.2); ctx.lineTo(hx-sz*0.02, hy+hr*0.35); ctx.lineTo(hx+sz*0.02, hy+hr*0.35); ctx.fill()

  // Hair on top
  ctx.fillStyle = d.hairColor
  if (d.hairStyle === 'spiky') {
    ctx.beginPath(); ctx.moveTo(hx-sz*0.22, hy-sz*0.05); ctx.quadraticCurveTo(hx-sz*0.1, hy-sz*0.35, hx-sz*0.02, hy-sz*0.08); ctx.lineTo(hx+sz*0.02, hy-sz*0.08); ctx.quadraticCurveTo(hx+sz*0.1, hy-sz*0.35, hx+sz*0.22, hy-sz*0.05); ctx.fill()
    // Spikes
    ctx.beginPath(); ctx.moveTo(hx-sz*0.2, hy-sz*0.1); ctx.lineTo(hx-sz*0.22, hy-sz*0.4); ctx.lineTo(hx-sz*0.08, hy-sz*0.05); ctx.fill()
    ctx.beginPath(); ctx.moveTo(hx-sz*0.08, hy-sz*0.15); ctx.lineTo(hx-sz*0.05, hy-sz*0.48); ctx.lineTo(hx+sz*0.02, hy-sz*0.08); ctx.fill()
    ctx.beginPath(); ctx.moveTo(hx+sz*0.08, hy-sz*0.15); ctx.lineTo(hx+sz*0.05, hy-sz*0.48); ctx.lineTo(hx-sz*0.02, hy-sz*0.08); ctx.fill()
    ctx.beginPath(); ctx.moveTo(hx+sz*0.2, hy-sz*0.1); ctx.lineTo(hx+sz*0.22, hy-sz*0.4); ctx.lineTo(hx+sz*0.08, hy-sz*0.05); ctx.fill()
  } else if (d.hairStyle === 'longFlow' || d.hairStyle === 'ponytail') {
    ctx.beginPath(); ctx.arc(hx, hy-sz*0.02, hr*1.02, Math.PI, 0); ctx.fill()
    ctx.fillStyle = d.hairHighlight
    ctx.beginPath(); ctx.arc(hx, hy-sz*0.06, hr*0.5, Math.PI*0.3, Math.PI*0.7); ctx.fill()
    if (d.hairStyle === 'ponytail') {
      ctx.fillStyle = d.hairColor
      ctx.beginPath(); ctx.moveTo(hx+sz*0.18, hy-sz*0.08); ctx.quadraticCurveTo(hx+sz*0.35, hy-sz*0.25, hx+sz*0.3, hy+sz*0.15); ctx.lineTo(hx+sz*0.2, hy+sz*0.08); ctx.fill()
    }
  } else if (d.hairStyle === 'messy') {
    ctx.beginPath(); ctx.arc(hx, hy-sz*0.03, hr*1.05, Math.PI, 0); ctx.fill()
    ctx.beginPath(); ctx.moveTo(hx-sz*0.25, hy-sz*0.1); ctx.quadraticCurveTo(hx-sz*0.2, hy-sz*0.4, hx-sz*0.1, hy-sz*0.15); ctx.fill()
    ctx.beginPath(); ctx.moveTo(hx+sz*0.25, hy-sz*0.1); ctx.quadraticCurveTo(hx+sz*0.2, hy-sz*0.4, hx+sz*0.1, hy-sz*0.15); ctx.fill()
  } else if (d.hairStyle === 'princely') {
    ctx.beginPath(); ctx.moveTo(hx-sz*0.24, hy-sz*0.05); ctx.quadraticCurveTo(hx, hy-sz*0.3, hx+sz*0.24, hy-sz*0.05); ctx.fill()
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(hx-sz*0.15, hy-sz*0.02); ctx.quadraticCurveTo(hx, hy-sz*0.15, hx+sz*0.15, hy-sz*0.02); ctx.fill()
  }

  // Hood / Hat / Mask
  if (d.hasHood) {
    ctx.fillStyle = d.hoodColor || d.hairColor
    ctx.beginPath(); ctx.arc(hx, hy-sz*0.02, hr*1.08, Math.PI*0.85, Math.PI*0.15); ctx.fill()
    ctx.fillRect(hx-sz*0.22, hy-sz*0.15, sz*0.44, sz*0.15)
    // Hood tip
    ctx.beginPath(); ctx.moveTo(hx+sz*0.1, hy-sz*0.28); ctx.quadraticCurveTo(hx+sz*0.2, hy-sz*0.5, hx+sz*0.08, hy-sz*0.35); ctx.fill()
  }
  if (d.hasHat) {
    ctx.fillStyle = d.hatColor
    ctx.beginPath(); ctx.ellipse(hx, hy-sz*0.04, hr*0.95, hr*0.08, 0, 0, Math.PI*2); ctx.fill() // brim
    ctx.beginPath(); ctx.moveTo(hx-sz*0.07, hy-sz*0.08); ctx.lineTo(hx+sz*0.05, hy-sz*0.5); ctx.lineTo(hx+sz*0.1, hy-sz*0.08); ctx.fill() // cone
    ctx.strokeStyle = d.armorColor; ctx.lineWidth = 1.5*s
    ctx.beginPath(); ctx.arc(hx, hy-sz*0.25, sz*0.05, 0, Math.PI*2); ctx.stroke()
  }
  if (d.hasMask) {
    ctx.fillStyle = d.maskColor
    ctx.beginPath(); ctx.roundRect(hx-sz*0.16, hy-sz*0.03, sz*0.32, sz*0.14, 2*s); ctx.fill()
  }
  if (d.hasCrown) {
    ctx.fillStyle = '#ffd700'
    ctx.beginPath(); ctx.moveTo(hx-sz*0.16, hy-sz*0.06); ctx.lineTo(hx-sz*0.1, hy-sz*0.2); ctx.lineTo(hx-sz*0.04, hy-sz*0.08); ctx.lineTo(hx, hy-sz*0.25); ctx.lineTo(hx+sz*0.04, hy-sz*0.08); ctx.lineTo(hx+sz*0.1, hy-sz*0.2); ctx.lineTo(hx+sz*0.16, hy-sz*0.06); ctx.fill()
  }

  // --- ATTACK EFFECT ---
  if (matk > 0) {
    const phase = matk / 20
    ctx.strokeStyle = state.hero.color; ctx.lineWidth = 2.5*s; ctx.globalAlpha = Math.min(1, phase*2)
    const em = !state.hero.melee && SKILLS[state.hero.id] ? SKILLS[state.hero.id].emoji : ''
    if (em && phase > 0.5) {
      ctx.font = `${16*s}px sans-serif`; ctx.fillText(em, cx+sz*1.25, cy+sz*0.4)
    } else if (state.hero.melee) {
      ctx.beginPath(); ctx.arc(cx+sz*1.0, cy+sz*0.65, sz*0.4, -0.5, 0.5); ctx.stroke()
    } else {
      ctx.beginPath(); ctx.arc(cx+sz*1.15, cy+sz*0.5, sz*0.5, -0.3, 0.3); ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  // Name
  ctx.fillStyle = '#fff'; ctx.font = `bold ${10*s}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText(state.hero.name, hx, cy-8*s)

  // Range indicator
  if (state.hero.melee) {
    ctx.strokeStyle = 'rgba(255,100,100,0.12)'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.ellipse(hx, groundY, sz*1.6, sz*0.18, 0, 0, Math.PI*2); ctx.stroke()
  } else {
    ctx.strokeStyle = 'rgba(100,200,255,0.12)'; ctx.lineWidth = 1.5; ctx.setLineDash([4,4])
    ctx.beginPath(); ctx.moveTo(cx+sz*1.2, groundY-2*s); ctx.lineTo(cx+sz*2.5, groundY-2*s); ctx.stroke(); ctx.setLineDash([])
  }

  if (state.heroDying) ctx.restore()
}

function drawMob() {
    if (!state.inCombat || state.mobs.length === 0) return
    const s = getS(), sz = 40*s, groundY = canvas.height * 0.58
    
    // ── Unified mob rendering loop ──
    for (let mi = 0; mi < state.mobs.length; mi++) {
      const gm = state.mobs[mi]
      if (gm.hp <= 0 && !gm.dying) continue
      // Boss size multiplier
      const bossScale = gm.mob.boss ? 3.0 : 1
      const bossSz = sz * bossScale
      
      // ── Render mob with full detail ──
    let deathAlpha = 1
    let deathFall = 0
    if (gm.dying) {
      const t = Math.min(1, (gm.deathTimer > 0 ? (0.8 - gm.deathTimer) / 0.8 : 1))
      deathAlpha = 1 - t * 0.8
      deathFall = t * sz * 0.5
    }
    
    const matk = gm.atkAnim || 0
    // Attack lunge: mob dashes left toward hero, then snaps back
    const lunge = matk > 0.5 ? (1 - matk) * 2 : matk // 0→1→0 triangle
    const lungeX = gm.mob.ranged ? -lunge * 20 * s : -lunge * 50 * s
    const lungeY = gm.mob.ranged ? 0 : -lunge * 8 * s  // melee slight hop
    const cx = gm.x + lungeX, cy = groundY - sz * 1.3 + lungeY + (gm.spreadY || 0)
    const walking = gm.x > gm.targetX + 1
    const base = MOB_DETAILS[gm.mob.name.toLowerCase()] || { color: gm.mob.color, hasLegs: true }
    const mt = time || 0
    const kb = walking ? Math.sin(mt*5.5)*3.5*s : (base.simple ? Math.sin(mt*2.5)*1.5*s : Math.sin(mt*3.8)*2*s)
    const bounce = base.bounce ? Math.sin(mt*2.5)*sz*base.bounce : 0

    ctx.save()
    ctx.globalAlpha = deathAlpha
    ctx.translate(cx, cy + deathFall)
    // Death tilt
    if (gm.dying) {
      const tilt = Math.min(1, (gm.deathTimer > 0 ? (0.8 - gm.deathTimer) / 0.5 : 1)) * Math.PI * 0.3
      ctx.translate(cx, groundY)
      ctx.rotate(tilt)
      ctx.translate(-cx, -groundY)
    }

    // Shadow
    const shadowSz = gm.mob.boss ? bossSz : sz
    ctx.fillStyle = gm.mob.boss ? 'rgba(100,0,0,0.35)' : 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(shadowSz/2, groundY-cy+4*s, shadowSz*0.38, shadowSz*0.08, 0, 0, Math.PI*2); ctx.fill()
    
    // ── Status Effect Visuals ──
    if (gm.statusEffects && gm.statusEffects.length > 0) {
      for (const eff of gm.statusEffects) {
        const ex = 0, ey = 0 // relative to mob center
        if (eff.type === 'stun') {
          // Dizzy stars above head
          for (let i = 0; i < 3; i++) {
            const angle = (time||0)*3 + i*2.1
            const sx = Math.cos(angle)*sz*0.5, sy = -sz*0.8 + Math.sin(angle*0.5)*sz*0.2
            ctx.fillStyle = '#ffd700'; ctx.globalAlpha = 0.8
            ctx.font = `${8*s}px sans-serif`
            ctx.fillText('★', sx, sy)
          }
          ctx.globalAlpha = 1
        }
        if (eff.type === 'freeze') {
          // Ice crystals
          ctx.fillStyle = '#64b5f6'; ctx.globalAlpha = 0.5
          for (let i = 0; i < 4; i++) {
            const ix = Math.sin(i*1.7)*sz*0.4, iy = -sz*0.2 + Math.cos(i*2.3)*sz*0.3
            ctx.beginPath()
            ctx.moveTo(ix, iy-6*s); ctx.lineTo(ix+3*s, iy+3*s); ctx.lineTo(ix-3*s, iy+3*s)
            ctx.closePath(); ctx.fill()
          }
          // Blue tint overlay
          ctx.fillStyle = '#64b5f6'; ctx.globalAlpha = 0.15
          ctx.fillRect(-sz*0.5, -sz*0.8, sz, sz*1.2)
          ctx.globalAlpha = 1
        }
        if (eff.type === 'burn') {
          // Fire particles
          for (let i = 0; i < 4; i++) {
            const fx = Math.sin((time||0)*5+i*2)*sz*0.3
            const fy = -sz*0.3 - Math.abs(Math.sin((time||0)*4+i))*sz*0.25
            ctx.fillStyle = i===0?'#ff4400':i===1?'#ff8800':i===2?'#ffcc00':'#ff6600'
            ctx.globalAlpha = 0.7
            ctx.beginPath(); ctx.arc(fx, fy, 2.5*s, 0, Math.PI*2); ctx.fill()
          }
          ctx.globalAlpha = 1
        }
        if (eff.type === 'poison') {
          // Green bubbles
          for (let i = 0; i < 3; i++) {
            const bx = Math.cos((time||0)*2+i*2)*sz*0.3
            const by = -sz*0.1 - Math.abs(Math.sin((time||0)*3+i))*sz*0.3
            ctx.fillStyle = '#7b1fa2'; ctx.globalAlpha = 0.5
            ctx.beginPath(); ctx.arc(bx, by, 2*s, 0, Math.PI*2); ctx.fill()
          }
          ctx.globalAlpha = 1
        }
        if (eff.type === 'slow') {
          // Blue trail particles
          for (let i = 0; i < 2; i++) {
            const tx = -sz*0.3 - i*sz*0.2 + Math.sin((time||0)*2+i)*sz*0.1
            const ty = sz*0.2 + Math.sin((time||0)*3+i)*sz*0.1
            ctx.fillStyle = '#42a5f5'; ctx.globalAlpha = 0.4
            ctx.beginPath(); ctx.arc(tx, ty, 1.5*s, 0, Math.PI*2); ctx.fill()
          }
          ctx.globalAlpha = 1
        }
      }
      // Status effect duration bar
      let barX = -sz*0.4
      const barY = -sz*0.95
      for (const eff of gm.statusEffects) {
        const def = STATUS_EFFECTS[eff.type]
        const pct = Math.max(0, eff.duration / eff.maxDuration)
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.fillRect(barX, barY, sz*0.25, 3*s)
        ctx.fillStyle = def.color
        ctx.fillRect(barX, barY, sz*0.25*pct, 3*s)
        // Icon
        ctx.font = `${7*s}px sans-serif`
        ctx.fillText(def.icon, barX+sz*0.125, barY-2*s)
        barX += sz*0.3
      }
    }

    // Kaki (jika ada)
    if (base.hasLegs) {
      const legSwing = walking ? Math.sin(mt*5.5)*4*s : 0
      ctx.fillStyle = '#2a1a0a'
      ctx.fillRect(sz*0.22, sz*0.85+legSwing, sz*0.18, sz*0.4)
      ctx.fillRect(sz*0.60, sz*0.85-legSwing, sz*0.18, sz*0.4)
      ctx.fillStyle = '#3d2817'
      ctx.fillRect(sz*0.20, sz*1.15+legSwing*0.5, sz*0.22, sz*0.12)
      ctx.fillRect(sz*0.58, sz*1.15-legSwing*0.5, sz*0.22, sz*0.12)
    }

    // ─── PER-MOB BODY + HEAD ─────────────────────────────────
    const mobName = gm.mob.name.toLowerCase()
    function drawGoblinBody() {
      // Skinny green torso
      ctx.fillStyle = base.skinColor
      ctx.beginPath()
      ctx.moveTo(sz*0.15, sz*0.5); ctx.quadraticCurveTo(sz*0.1, sz*0.7, sz*0.18, sz*1.0); ctx.lineTo(sz*0.82, sz*1.0)
      ctx.quadraticCurveTo(sz*0.9, sz*0.7, sz*0.85, sz*0.5); ctx.closePath(); ctx.fill()
      // Rag vest
      ctx.fillStyle = '#4a2800'
      ctx.beginPath(); ctx.roundRect(sz*0.16, sz*0.52, sz*0.68, sz*0.38, 4*s); ctx.fill()
      // Belt + buckle
      ctx.fillStyle = '#2a1a0a'; ctx.fillRect(sz*0.16, sz*0.8, sz*0.68, sz*0.06)
      ctx.fillStyle = '#c0a060'; ctx.fillRect(sz*0.4, sz*0.78, sz*0.2, sz*0.1)
      // Necklace of bones
      for (let i=0;i<5;i++) ctx.fillRect(sz*0.2+i*sz*0.14, sz*0.52, sz*0.06, sz*0.06)
      // Left arm holding club
      ctx.fillStyle = base.skinColor; ctx.beginPath(); ctx.roundRect(sz*0.1, sz*0.55, sz*0.12, sz*0.4, 4*s); ctx.fill()
      // Pants
      ctx.fillStyle = '#3a2000'; ctx.fillRect(sz*0.2, sz*1.0, sz*0.22, sz*0.2)
      ctx.fillStyle = '#3a2000'; ctx.fillRect(sz*0.58, sz*1.0, sz*0.22, sz*0.2)
    }
    function drawGoblinHead() {
      ctx.fillStyle = base.skinColor
      ctx.beginPath(); ctx.arc(sz/2, sz*0.3, sz*0.28, 0, Math.PI*2); ctx.fill()
      // Pointed ears
      ctx.beginPath(); ctx.moveTo(sz*0.2, sz*0.25); ctx.lineTo(sz*0.05, sz*0.2); ctx.lineTo(sz*0.2, sz*0.35); ctx.fill()
      ctx.beginPath(); ctx.moveTo(sz*0.8, sz*0.25); ctx.lineTo(sz*0.95, sz*0.2); ctx.lineTo(sz*0.8, sz*0.35); ctx.fill()
      // Hair
      ctx.fillStyle = base.hairColor; ctx.beginPath(); ctx.arc(sz/2, sz*0.22, sz*0.26, Math.PI, 0); ctx.fill()
      // Eyes - squinty, angry
      ctx.fillStyle = '#fff'; ctx.fillRect(sz*0.28, sz*0.28, sz*0.12, sz*0.06)
      ctx.fillRect(sz*0.6, sz*0.28, sz*0.12, sz*0.06)
      ctx.fillStyle = '#000'; ctx.fillRect(sz*0.33, sz*0.28, sz*0.06, sz*0.05)
      ctx.fillRect(sz*0.61, sz*0.28, sz*0.06, sz*0.05)
      // Nose
      ctx.fillStyle = '#7cb342'; ctx.beginPath(); ctx.moveTo(sz*0.5, sz*0.33); ctx.lineTo(sz*0.46, sz*0.38); ctx.lineTo(sz*0.54, sz*0.38); ctx.fill()
      // Buck teeth
      ctx.fillStyle = '#fff'; ctx.fillRect(sz*0.44, sz*0.36, sz*0.06, sz*0.07); ctx.fillRect(sz*0.5, sz*0.36, sz*0.06, sz*0.07)
    }
    function drawSkeletonBody() {
      // Ribcage
      ctx.fillStyle = base.boneColor
      ctx.beginPath(); ctx.roundRect(sz*0.15, sz*0.4, sz*0.7, sz*0.62, 6*s); ctx.fill()
      // Dark hollow inside
      ctx.fillStyle = '#1a1a1a'
      ctx.beginPath(); ctx.roundRect(sz*0.25, sz*0.45, sz*0.5, sz*0.4, 4*s); ctx.fill()
      // Rib lines
      ctx.strokeStyle = '#d0d0d0'; ctx.lineWidth = 1.5*s
      for (let i=0;i<4;i++) {
        const ry = sz*0.5 + i*sz*0.08
        ctx.beginPath(); ctx.moveTo(sz*0.22, ry); ctx.lineTo(sz*0.78, ry); ctx.stroke()
      }
      // Spine
      ctx.fillStyle = '#d0d0d0'; ctx.fillRect(sz*0.47, sz*0.5, sz*0.06, sz*0.45)
      for (let i=0;i<5;i++) { ctx.fillRect(sz*0.43, sz*0.52+i*sz*0.08, sz*0.14, sz*0.04) }
      // Pelvis
      ctx.fillStyle = base.boneColor
      ctx.beginPath(); ctx.ellipse(sz/2, sz*1.0, sz*0.3, sz*0.1, 0, 0, Math.PI*2); ctx.fill()
      // Shoulder bones
      ctx.fillStyle = base.boneColor
      ctx.beginPath(); ctx.ellipse(sz*0.18, sz*0.42, sz*0.12, sz*0.06, -0.2, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*0.82, sz*0.42, sz*0.12, sz*0.06, 0.2, 0, Math.PI*2); ctx.fill()
      // Arms
      ctx.fillStyle = base.boneColor
      ctx.beginPath(); ctx.roundRect(sz*0.08, sz*0.48, sz*0.08, sz*0.45, 3*s); ctx.fill()
      ctx.beginPath(); ctx.roundRect(sz*0.84, sz*0.48, sz*0.08, sz*0.35, 3*s); ctx.fill()
    }
    function drawSkeletonHead() {
      ctx.fillStyle = base.boneColor
      ctx.beginPath(); ctx.arc(sz/2, sz*0.22, sz*0.28, 0, Math.PI*2); ctx.fill()
      // Skull eye sockets
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(sz*0.33, sz*0.22, sz*0.08, sz*0.09, 0, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*0.67, sz*0.22, sz*0.08, sz*0.09, 0, 0, Math.PI*2); ctx.fill()
      // Glowing pupils
      ctx.fillStyle = base.eyeColor; ctx.fillRect(sz*0.33, sz*0.22, sz*0.04, sz*0.04)
      ctx.fillRect(sz*0.63, sz*0.22, sz*0.04, sz*0.04)
      // Nose hole
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(sz*0.48, sz*0.26, sz*0.03, sz*0.04, 0, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*0.52, sz*0.26, sz*0.03, sz*0.04, 0, 0, Math.PI*2); ctx.fill()
      // Teeth
      ctx.fillStyle = '#fff'
      for (let i=0;i<6;i++) ctx.fillRect(sz*0.28+i*sz*0.07, sz*0.28, sz*0.05, sz*0.06)
    }
    function drawWolfBody() {
      // Quadruped body
      ctx.fillStyle = base.color
      ctx.beginPath(); ctx.ellipse(sz/2, sz*0.75, sz*0.4, sz*0.25, 0, 0, Math.PI*2); ctx.fill()
      // Fur texture - darker stripes on back
      ctx.fillStyle = '#4e342e'
      ctx.beginPath(); ctx.ellipse(sz*0.35, sz*0.6, sz*0.06, sz*0.12, 0.1, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*0.5, sz*0.58, sz*0.06, sz*0.14, 0, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*0.65, sz*0.6, sz*0.06, sz*0.12, -0.1, 0, Math.PI*2); ctx.fill()
      // Tail
      ctx.fillStyle = base.furColor
      ctx.beginPath(); ctx.ellipse(sz*0.92, sz*0.75, sz*0.12, sz*0.06, -0.5, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = base.color
      ctx.beginPath(); ctx.ellipse(sz*1.0, sz*0.7, sz*0.06, sz*0.04, -0.5, 0, Math.PI*2); ctx.fill()
      // Front legs
      ctx.fillStyle = base.color
      ctx.fillRect(sz*0.25, sz*0.88, sz*0.08, sz*0.3)
      ctx.fillRect(sz*0.45, sz*0.88, sz*0.08, sz*0.3)
      // Back legs
      ctx.fillRect(sz*0.6, sz*0.85, sz*0.08, sz*0.28)
      ctx.fillRect(sz*0.78, sz*0.85, sz*0.08, sz*0.28)
      // Paws
      ctx.fillStyle = '#3e2723'
      ctx.fillRect(sz*0.23, sz*1.1, sz*0.12, sz*0.06)
      ctx.fillRect(sz*0.43, sz*1.1, sz*0.12, sz*0.06)
      ctx.fillRect(sz*0.58, sz*1.06, sz*0.12, sz*0.06)
      ctx.fillRect(sz*0.76, sz*1.06, sz*0.12, sz*0.06)
      // Chest fur
      ctx.fillStyle = base.furColor
      ctx.beginPath(); ctx.ellipse(sz*0.3, sz*0.75, sz*0.1, sz*0.12, 0, 0, Math.PI*2); ctx.fill()
    }
    function drawWolfHead() {
      // Wolf head + snout
      ctx.fillStyle = base.color
      ctx.beginPath(); ctx.arc(sz*0.25, sz*0.5, sz*0.22, 0, Math.PI*2); ctx.fill()
      // Snout
      ctx.beginPath(); ctx.ellipse(sz*0.32, sz*0.58, sz*0.14, sz*0.1, 0.3, 0, Math.PI*2); ctx.fill()
      // Ears
      ctx.beginPath()
      ctx.moveTo(sz*0.18, sz*0.35); ctx.lineTo(sz*0.12, sz*0.2); ctx.lineTo(sz*0.28, sz*0.35); ctx.fill()
      ctx.beginPath()
      ctx.moveTo(sz*0.28, sz*0.32); ctx.lineTo(sz*0.24, sz*0.18); ctx.lineTo(sz*0.38, sz*0.32); ctx.fill()
      // Eyes
      ctx.fillStyle = base.eyeColor; ctx.fillRect(sz*0.15, sz*0.46, sz*0.06, sz*0.04)
      ctx.fillRect(sz*0.28, sz*0.46, sz*0.06, sz*0.04)
      ctx.fillStyle = '#000'; ctx.fillRect(sz*0.16, sz*0.46, sz*0.03, sz*0.04)
      ctx.fillRect(sz*0.29, sz*0.46, sz*0.03, sz*0.04)
      // Nose
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(sz*0.38, sz*0.58, sz*0.04, sz*0.03, 0, 0, Math.PI*2); ctx.fill()
      // Mouth
      ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5*s
      ctx.beginPath(); ctx.moveTo(sz*0.35, sz*0.6); ctx.lineTo(sz*0.4, sz*0.63); ctx.stroke()
    }
    function drawOrcBody() {
      // Muscular green torso
      ctx.fillStyle = base.skinColor
      ctx.beginPath()
      ctx.moveTo(sz*0.12, sz*0.5); ctx.quadraticCurveTo(sz*0.05, sz*0.7, sz*0.1, sz*1.0); ctx.lineTo(sz*0.9, sz*1.0)
      ctx.quadraticCurveTo(sz*0.95, sz*0.7, sz*0.88, sz*0.5); ctx.closePath(); ctx.fill()
      // Shoulder pads
      ctx.fillStyle = '#5d4037'
      ctx.beginPath(); ctx.ellipse(sz*0.12, sz*0.5, sz*0.15, sz*0.1, -0.2, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*0.88, sz*0.5, sz*0.15, sz*0.1, 0.2, 0, Math.PI*2); ctx.fill()
      // Leather vest
      ctx.fillStyle = '#4e342e'
      ctx.beginPath(); ctx.roundRect(sz*0.18, sz*0.52, sz*0.64, sz*0.35, 6*s); ctx.fill()
      // Belt
      ctx.fillStyle = '#1a0a00'; ctx.fillRect(sz*0.12, sz*0.82, sz*0.76, sz*0.08)
      ctx.fillStyle = '#c0a060'; ctx.fillRect(sz*0.44, sz*0.8, sz*0.12, sz*0.12)
      // War paint on chest
      ctx.fillStyle = '#b71c1c'
      ctx.beginPath(); ctx.moveTo(sz*0.35, sz*0.58); ctx.lineTo(sz*0.5, sz*0.7); ctx.lineTo(sz*0.65, sz*0.58); ctx.fill()
      // Arms
      ctx.fillStyle = base.skinColor
      ctx.beginPath(); ctx.roundRect(sz*0.02, sz*0.55, sz*0.14, sz*0.5, 5*s); ctx.fill() // left arm
      ctx.beginPath(); ctx.roundRect(sz*0.84, sz*0.55, sz*0.14, sz*0.5, 5*s); ctx.fill() // right arm
      // Wristbands
      ctx.fillStyle = '#5d4037'; ctx.fillRect(sz*0.02, sz*0.95, sz*0.14, sz*0.06)
      ctx.fillRect(sz*0.84, sz*0.95, sz*0.14, sz*0.06)
    }
    function drawOrcHead() {
      ctx.fillStyle = base.skinColor
      ctx.beginPath(); ctx.arc(sz/2, sz*0.28, sz*0.32, 0, Math.PI*2); ctx.fill()
      // Hair
      ctx.fillStyle = base.hairColor; ctx.beginPath(); ctx.arc(sz/2, sz*0.2, sz*0.3, Math.PI, 0); ctx.fill()
      // Angry brows
      ctx.fillStyle = '#1a0a00'
      ctx.fillRect(sz*0.25, sz*0.22, sz*0.15, sz*0.04)
      ctx.fillRect(sz*0.6, sz*0.22, sz*0.15, sz*0.04)
      // Eyes
      ctx.fillStyle = '#fff'; ctx.fillRect(sz*0.3, sz*0.26, sz*0.1, sz*0.07)
      ctx.fillRect(sz*0.6, sz*0.26, sz*0.1, sz*0.07)
      ctx.fillStyle = '#000'; ctx.fillRect(sz*0.33, sz*0.27, sz*0.05, sz*0.05)
      ctx.fillRect(sz*0.62, sz*0.27, sz*0.05, sz*0.05)
      // Tusks
      ctx.fillStyle = '#fff'
      ctx.beginPath(); ctx.moveTo(sz*0.38, sz*0.36); ctx.lineTo(sz*0.32, sz*0.44); ctx.lineTo(sz*0.42, sz*0.38); ctx.fill()
      ctx.beginPath(); ctx.moveTo(sz*0.62, sz*0.36); ctx.lineTo(sz*0.68, sz*0.44); ctx.lineTo(sz*0.58, sz*0.38); ctx.fill()
      // Lower jaw
      ctx.fillStyle = '#388e3c'
      ctx.beginPath(); ctx.ellipse(sz/2, sz*0.38, sz*0.15, sz*0.07, 0, 0, Math.PI*2); ctx.fill()
    }
    function drawDarkKnightBody() {
      // Full plate armor
      ctx.fillStyle = base.armorColor
      ctx.beginPath(); ctx.roundRect(sz*0.1, sz*0.38, sz*0.8, sz*0.65, 6*s); ctx.fill()
      // Cuirass center
      ctx.fillStyle = '#455a64'
      ctx.beginPath(); ctx.roundRect(sz*0.2, sz*0.42, sz*0.6, sz*0.38, 4*s); ctx.fill()
      // Shoulder pauldrons
      ctx.fillStyle = '#546e7a'
      ctx.beginPath(); ctx.ellipse(sz*0.08, sz*0.4, sz*0.15, sz*0.1, -0.2, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*0.92, sz*0.4, sz*0.15, sz*0.1, 0.2, 0, Math.PI*2); ctx.fill()
      // Tabard
      ctx.fillStyle = '#b71c1c'
      ctx.beginPath(); ctx.roundRect(sz*0.25, sz*0.5, sz*0.5, sz*0.35, 3*s); ctx.fill()
      // Cross emblem
      ctx.fillStyle = '#ffd700'
      ctx.fillRect(sz*0.46, sz*0.54, sz*0.08, sz*0.22)
      ctx.fillRect(sz*0.42, sz*0.6, sz*0.16, sz*0.06)
      // Belt
      ctx.fillStyle = '#1a0a00'; ctx.fillRect(sz*0.12, sz*0.85, sz*0.76, sz*0.06)
      ctx.fillStyle = '#c0a060'; ctx.fillRect(sz*0.44, sz*0.82, sz*0.12, sz*0.12)
      // Arms
      ctx.fillStyle = '#546e7a'
      ctx.beginPath(); ctx.roundRect(sz*0.04, sz*0.48, sz*0.1, sz*0.42, 3*s); ctx.fill()
      ctx.beginPath(); ctx.roundRect(sz*0.86, sz*0.48, sz*0.1, sz*0.42, 3*s); ctx.fill()
      // Leg armor
      ctx.fillStyle = '#546e7a'
      ctx.fillRect(sz*0.18, sz*0.92, sz*0.22, sz*0.3)
      ctx.fillRect(sz*0.6, sz*0.92, sz*0.22, sz*0.3)
      ctx.fillStyle = '#37474f'
      ctx.fillRect(sz*0.16, sz*1.12, sz*0.26, sz*0.08)
      ctx.fillRect(sz*0.58, sz*1.12, sz*0.26, sz*0.08)
    }
    function drawDarkKnightHead() {
      // Helmet
      ctx.fillStyle = '#455a64'
      ctx.beginPath(); ctx.arc(sz/2, sz*0.2, sz*0.3, 0, Math.PI*2); ctx.fill()
      // Helmet visor
      ctx.fillStyle = '#1a1a1a'
      ctx.beginPath(); ctx.roundRect(sz*0.25, sz*0.18, sz*0.5, sz*0.1, 3*s); ctx.fill()
      // Visor slit glow
      ctx.fillStyle = base.eyeColor; ctx.fillRect(sz*0.3, sz*0.2, sz*0.15, sz*0.03)
      ctx.fillRect(sz*0.55, sz*0.2, sz*0.15, sz*0.03)
      // Helmet ridge
      ctx.fillStyle = '#546e7a'
      ctx.beginPath(); ctx.moveTo(sz*0.5, sz*0.02); ctx.lineTo(sz*0.3, sz*0.08); ctx.lineTo(sz*0.7, sz*0.08); ctx.closePath(); ctx.fill()
      ctx.fillRect(sz*0.48, sz*0.02, sz*0.04, sz*0.2)
      // Visor breathing holes
      ctx.fillStyle = '#000'
      for (let i=0;i<4;i++) ctx.fillRect(sz*0.35+i*sz*0.09, sz*0.22, sz*0.04, sz*0.03)
    }
    function drawDemonBody() {
      // Muscular red torso
      ctx.fillStyle = base.skinColor
      ctx.beginPath()
      ctx.moveTo(sz*0.1, sz*0.5); ctx.quadraticCurveTo(sz*0.03, sz*0.7, sz*0.08, sz*1.0); ctx.lineTo(sz*0.92, sz*1.0)
      ctx.quadraticCurveTo(sz*0.97, sz*0.7, sz*0.9, sz*0.5); ctx.closePath(); ctx.fill()
      // Chest markings
      ctx.fillStyle = '#4a0000'
      ctx.beginPath(); ctx.moveTo(sz*0.38, sz*0.55); ctx.lineTo(sz*0.5, sz*0.65); ctx.lineTo(sz*0.62, sz*0.55); ctx.fill()
      ctx.fillRect(sz*0.48, sz*0.55, sz*0.04, sz*0.25)
      // Belt
      ctx.fillStyle = '#1a0a00'; ctx.fillRect(sz*0.1, sz*0.82, sz*0.8, sz*0.08)
      ctx.fillStyle = '#b71c1c'; ctx.fillRect(sz*0.44, sz*0.8, sz*0.12, sz*0.12)
      // Skull on belt
      ctx.fillStyle = '#e0e0e0'
      ctx.beginPath(); ctx.arc(sz/2, sz*0.88, sz*0.06, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = '#000'; ctx.fillRect(sz*0.47, sz*0.87, sz*0.02, sz*0.03); ctx.fillRect(sz*0.51, sz*0.87, sz*0.02, sz*0.03)
      // Arms
      ctx.fillStyle = base.skinColor
      ctx.beginPath(); ctx.roundRect(sz*0.02, sz*0.55, sz*0.12, sz*0.4, 4*s); ctx.fill()
      ctx.beginPath(); ctx.roundRect(sz*0.86, sz*0.55, sz*0.12, sz*0.4, 4*s); ctx.fill()
      // Claws
      ctx.fillStyle = '#000'
      for (let i=0;i<3;i++) { ctx.fillRect(sz*0.04+i*sz*0.04, sz*0.9, sz*0.02, sz*0.06) }
      for (let i=0;i<3;i++) { ctx.fillRect(sz*0.88+i*sz*0.04, sz*0.9, sz*0.02, sz*0.06) }
      // Legs
      ctx.fillStyle = base.skinColor
      ctx.fillRect(sz*0.22, sz*0.92, sz*0.18, sz*0.28)
      ctx.fillRect(sz*0.6, sz*0.92, sz*0.18, sz*0.28)
      // Hooves
      ctx.fillStyle = '#1a0a00'
      ctx.beginPath(); ctx.ellipse(sz*0.3, sz*1.18, sz*0.12, sz*0.04, 0, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*0.7, sz*1.18, sz*0.12, sz*0.04, 0, 0, Math.PI*2); ctx.fill()
      // Bat wings (drawn behind body)
      ctx.fillStyle = 'rgba(0,0,0,0.35)'
      ctx.beginPath(); ctx.ellipse(sz*0.05, sz*0.55, sz*0.25, sz*0.12, -0.3, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*0.95, sz*0.55, sz*0.25, sz*0.12, 0.3, 0, Math.PI*2); ctx.fill()
      // Tail
      ctx.fillStyle = base.skinColor
      ctx.beginPath(); ctx.ellipse(sz*0.92, sz*0.7, sz*0.08, sz*0.04, 0.8, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*1.02, sz*0.65, sz*0.06, sz*0.03, 0.8, 0, Math.PI*2); ctx.fill()
      // Tail tip
      ctx.fillStyle = '#b71c1c'; ctx.beginPath(); ctx.ellipse(sz*1.08, sz*0.62, sz*0.04, sz*0.02, 0.8, 0, Math.PI*2); ctx.fill()
    }
    function drawDemonHead() {
      ctx.fillStyle = base.skinColor
      ctx.beginPath(); ctx.arc(sz/2, sz*0.25, sz*0.32, 0, Math.PI*2); ctx.fill()
      // Horns
      ctx.fillStyle = '#3e2723'
      ctx.beginPath(); ctx.moveTo(sz*0.3, sz*0.15); ctx.lineTo(sz*0.18, sz*-0.08); ctx.lineTo(sz*0.4, sz*0.1); ctx.fill()
      ctx.beginPath(); ctx.moveTo(sz*0.7, sz*0.15); ctx.lineTo(sz*0.82, sz*-0.08); ctx.lineTo(sz*0.6, sz*0.1); ctx.fill()
      // Eyes - glowing
      ctx.fillStyle = base.eyeColor
      ctx.beginPath(); ctx.ellipse(sz*0.33, sz*0.22, sz*0.08, sz*0.06, 0, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*0.67, sz*0.22, sz*0.08, sz*0.06, 0, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = '#000'
      ctx.beginPath(); ctx.ellipse(sz*0.34, sz*0.22, sz*0.04, sz*0.05, 0, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*0.66, sz*0.22, sz*0.04, sz*0.05, 0, 0, Math.PI*2); ctx.fill()
      // Frown
      ctx.strokeStyle = '#4a0000'; ctx.lineWidth = 2*s
      ctx.beginPath(); ctx.moveTo(sz*0.38, sz*0.34); ctx.lineTo(sz*0.5, sz*0.32); ctx.lineTo(sz*0.62, sz*0.34); ctx.stroke()
    }
    function drawDragonBody() {
      // Wyvern body (2 legs + wings)
      ctx.fillStyle = base.color
      ctx.beginPath(); ctx.ellipse(sz/2, sz*0.7, sz*0.38, sz*0.25, 0, 0, Math.PI*2); ctx.fill()
      // Belly
      ctx.fillStyle = base.scaleColor
      ctx.beginPath(); ctx.ellipse(sz/2, sz*0.8, sz*0.2, sz*0.12, 0, 0, Math.PI*2); ctx.fill()
      // Scale pattern
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1
      for (let i=0;i<3;i++) { ctx.beginPath(); ctx.arc(sz*0.25+i*sz*0.04, sz*0.68, sz*0.04, 0, Math.PI*2); ctx.stroke() }
      for (let i=0;i<3;i++) { ctx.beginPath(); ctx.arc(sz*0.55+i*sz*0.04, sz*0.65, sz*0.04, 0, Math.PI*2); ctx.stroke() }
      // Neck
      ctx.fillStyle = base.color
      ctx.beginPath(); ctx.ellipse(sz*0.3, sz*0.35, sz*0.1, sz*0.2, 0.3, 0, Math.PI*2); ctx.fill()
      // Tail
      ctx.fillStyle = base.color
      ctx.beginPath(); ctx.ellipse(sz*0.95, sz*0.72, sz*0.12, sz*0.05, 0.5, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*1.08, sz*0.65, sz*0.08, sz*0.03, 0.8, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = base.scaleColor
      ctx.beginPath(); ctx.ellipse(sz*1.14, sz*0.62, sz*0.05, sz*0.02, 0.8, 0, Math.PI*2); ctx.fill()
      // Legs
      ctx.fillStyle = base.color
      ctx.fillRect(sz*0.35, sz*0.85, sz*0.1, sz*0.3)
      ctx.fillRect(sz*0.58, sz*0.85, sz*0.1, sz*0.3)
      // Claws
      ctx.fillStyle = '#3e2723'
      for (let i=0;i<3;i++) { ctx.fillRect(sz*0.35+i*sz*0.03, sz*1.08, sz*0.02, sz*0.06) }
      for (let i=0;i<3;i++) { ctx.fillRect(sz*0.58+i*sz*0.03, sz*1.08, sz*0.02, sz*0.06) }
      // Wings
      ctx.fillStyle = 'rgba(80,40,0,0.4)'
      ctx.beginPath(); ctx.ellipse(sz*0.05, sz*0.5, sz*0.22, sz*0.15, -0.3, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(sz*0.95, sz*0.5, sz*0.22, sz*0.15, 0.3, 0, Math.PI*2); ctx.fill()
    }
    function drawDragonHead() {
      ctx.fillStyle = base.color
      ctx.beginPath(); ctx.ellipse(sz*0.25, sz*0.18, sz*0.15, sz*0.12, 0.2, 0, Math.PI*2); ctx.fill()
      // Snout/jaw
      ctx.fillStyle = base.color
      ctx.beginPath(); ctx.ellipse(sz*0.32, sz*0.22, sz*0.1, sz*0.06, 0.4, 0, Math.PI*2); ctx.fill()
      // Lower jaw
      ctx.fillStyle = base.scaleColor
      ctx.beginPath(); ctx.ellipse(sz*0.32, sz*0.26, sz*0.08, sz*0.04, 0.4, 0, Math.PI*2); ctx.fill()
      // Horns
      ctx.fillStyle = '#3e2723'
      ctx.beginPath(); ctx.moveTo(sz*0.18, sz*0.12); ctx.lineTo(sz*0.1, sz*0.0); ctx.lineTo(sz*0.24, sz*0.08); ctx.fill()
      ctx.beginPath(); ctx.moveTo(sz*0.22, sz*0.1); ctx.lineTo(sz*0.16, sz*-0.02); ctx.lineTo(sz*0.28, sz*0.06); ctx.fill()
      // Eye
      ctx.fillStyle = base.eyeColor; ctx.beginPath(); ctx.ellipse(sz*0.2, sz*0.16, sz*0.05, sz*0.03, 0.2, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(sz*0.2, sz*0.16, sz*0.03, sz*0.02, 0.2, 0, Math.PI*2); ctx.fill()
      // Teeth
      ctx.fillStyle = '#fff'
      ctx.beginPath(); ctx.moveTo(sz*0.3, sz*0.24); ctx.lineTo(sz*0.32, sz*0.28); ctx.lineTo(sz*0.34, sz*0.24); ctx.fill()
      ctx.beginPath(); ctx.moveTo(sz*0.34, sz*0.24); ctx.lineTo(sz*0.36, sz*0.28); ctx.lineTo(sz*0.38, sz*0.24); ctx.fill()
      // Smoke from nostrils
      ctx.fillStyle = `rgba(150,150,150,0.2)`
      ctx.beginPath(); ctx.arc(sz*0.38, sz*0.18, sz*0.04, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.arc(sz*0.4, sz*0.15, sz*0.03, 0, Math.PI*2); ctx.fill()
    }

    if (mobName === 'slime') {
      // ── SLIME PROPER REDESIGN ──
      const sBase = getS()
      const bounceAmt = Math.sin(mt*2.5)*sz*0.06  // squash-stretch
      const wobble = Math.sin(mt*3.2)*sz*0.02      // subtle wobble
      const slimeH = sz*0.52 + bounceAmt             // body height (squish)
      const slimeW = sz*0.42 - bounceAmt*0.5         // body width (wider when squished)
      const baseY = sz*0.98                          // ground line
      const topY = baseY - slimeH
      const cx = sz/2 + wobble

      // ── Body: organic dome via bezier ──
      ctx.beginPath()
      ctx.moveTo(cx - slimeW, baseY)
      // left side curve up
      ctx.quadraticCurveTo(cx - slimeW*1.05, baseY - slimeH*0.5, cx - slimeW*0.6, topY + slimeH*0.08)
      // top dome
      ctx.quadraticCurveTo(cx - slimeW*0.3, topY - slimeH*0.12, cx, topY - slimeH*0.08)
      ctx.quadraticCurveTo(cx + slimeW*0.3, topY - slimeH*0.12, cx + slimeW*0.6, topY + slimeH*0.08)
      // right side curve down
      ctx.quadraticCurveTo(cx + slimeW*1.05, baseY - slimeH*0.5, cx + slimeW, baseY)
      // flat bottom with slight curve
      ctx.quadraticCurveTo(cx, baseY + sz*0.04, cx - slimeW, baseY)
      ctx.closePath()

      // Jelly gradient fill
      const slimeGrad = ctx.createRadialGradient(cx, topY + slimeH*0.3, sz*0.05, cx, topY + slimeH*0.3, slimeW*1.3)
      slimeGrad.addColorStop(0, '#a5d6a7')
      slimeGrad.addColorStop(0.4, '#66bb6a')
      slimeGrad.addColorStop(0.8, base.color)
      slimeGrad.addColorStop(1, '#388e3c')
      ctx.fillStyle = slimeGrad
      ctx.fill()

      // ── Inner jelly highlight (translucent) ──
      ctx.beginPath()
      ctx.ellipse(cx - slimeW*0.15, topY + slimeH*0.4, slimeW*0.25, slimeH*0.22, -0.15, 0, Math.PI*2)
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.fill()

      // ── Jelly glow rim ──
      ctx.strokeStyle = 'rgba(200,255,200,0.25)'
      ctx.lineWidth = 2*s
      ctx.beginPath()
      ctx.moveTo(cx - slimeW, baseY)
      ctx.quadraticCurveTo(cx - slimeW*1.05, baseY - slimeH*0.5, cx - slimeW*0.6, topY + slimeH*0.08)
      ctx.quadraticCurveTo(cx - slimeW*0.3, topY - slimeH*0.12, cx, topY - slimeH*0.08)
      ctx.quadraticCurveTo(cx + slimeW*0.3, topY - slimeH*0.12, cx + slimeW*0.6, topY + slimeH*0.08)
      ctx.quadraticCurveTo(cx + slimeW*1.05, baseY - slimeH*0.5, cx + slimeW, baseY)
      ctx.stroke()

      // ── Small drip on left side ──
      const dripT = (mt*0.7) % 1
      if (dripT < 0.6) {
        const dripY = baseY + dripT * sz * 0.12
        ctx.fillStyle = `rgba(102,187,106,${0.6 - dripT})`
        ctx.beginPath()
        ctx.ellipse(cx - slimeW*0.85, dripY, sz*0.015, sz*0.025, 0, 0, Math.PI*2)
        ctx.fill()
      }

      // ── Floating bubbles ──
      for (let i = 0; i < 3; i++) {
        const bt = ((mt*0.8 + i*1.1) % 2) / 2  // 0→1 cycle per bubble
        const bx = cx - slimeW*0.3 + i*slimeW*0.3
        const by = baseY - bt * slimeH * 0.7
        const br = sz*0.012 + bt*sz*0.008
        ctx.fillStyle = `rgba(255,255,255,${0.25 - bt*0.2})`
        ctx.beginPath()
        ctx.arc(bx, by, br, 0, Math.PI*2)
        ctx.fill()
        // tiny highlight on bubble
        ctx.fillStyle = `rgba(255,255,255,${0.4 - bt*0.3})`
        ctx.beginPath()
        ctx.arc(bx - br*0.3, by - br*0.3, br*0.35, 0, Math.PI*2)
        ctx.fill()
      }

      // ── Eyes: bigger, rounder, expressive ──
      const eyeY = topY + slimeH*0.42
      const eyeSpacing = slimeW*0.35

      // Eye whites (big)
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.ellipse(cx - eyeSpacing, eyeY, sz*0.075, sz*0.08, 0, 0, Math.PI*2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(cx + eyeSpacing, eyeY, sz*0.075, sz*0.08, 0, 0, Math.PI*2)
      ctx.fill()

      // Pupils (slightly looking at hero = left)
      ctx.fillStyle = '#1a3a1a'
      ctx.beginPath()
      ctx.arc(cx - eyeSpacing - sz*0.01, eyeY + sz*0.005, sz*0.045, 0, Math.PI*2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx + eyeSpacing - sz*0.01, eyeY + sz*0.005, sz*0.045, 0, Math.PI*2)
      ctx.fill()

      // Eye highlights (sparkle)
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(cx - eyeSpacing + sz*0.015, eyeY - sz*0.02, sz*0.018, 0, Math.PI*2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx + eyeSpacing + sz*0.015, eyeY - sz*0.02, sz*0.018, 0, Math.PI*2)
      ctx.fill()
      // secondary smaller highlight
      ctx.beginPath()
      ctx.arc(cx - eyeSpacing - sz*0.01, eyeY + sz*0.015, sz*0.008, 0, Math.PI*2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx + eyeSpacing - sz*0.01, eyeY + sz*0.015, sz*0.008, 0, Math.PI*2)
      ctx.fill()

      // ── Mouth: wavy happy smile ──
      ctx.strokeStyle = '#2e7d32'
      ctx.lineWidth = 1.8*s
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(cx - sz*0.06, eyeY + slimeH*0.25)
      ctx.quadraticCurveTo(cx - sz*0.02, eyeY + slimeH*0.32, cx, eyeY + slimeH*0.28)
      ctx.quadraticCurveTo(cx + sz*0.02, eyeY + slimeH*0.24, cx + sz*0.06, eyeY + slimeH*0.3)
      ctx.stroke()
      ctx.lineCap = 'butt'
    } else if (mobName === 'goblin') { drawGoblinBody(); drawGoblinHead()
    } else if (mobName === 'skeleton') { drawSkeletonBody(); drawSkeletonHead()
    } else if (mobName === 'wolf') { drawWolfBody(); drawWolfHead()
    } else if (mobName === 'orc') { drawOrcBody(); drawOrcHead()
    } else if (mobName === 'dark knight') { drawDarkKnightBody(); drawDarkKnightHead()
    } else if (mobName === 'demon') { drawDemonBody(); drawDemonHead()
    } else if (mobName === 'dragon') { drawDragonBody(); drawDragonHead()
    } else {
      // Fallback generic
      ctx.fillStyle = base.color || gm.mob.color
      ctx.beginPath(); ctx.roundRect(sz*0.12, sz*0.4+bounce, sz*0.76, sz*0.6, 8*s); ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.07)'
      ctx.beginPath(); ctx.roundRect(sz*0.18, sz*0.42+bounce, sz*0.22, sz*0.28, 4*s); ctx.fill()
      ctx.fillStyle = (base.skinColor || base.boneColor || base.color)
      ctx.beginPath(); ctx.arc(sz/2, sz*0.25+bounce, sz*0.28, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = base.eyeColor || '#fff'
      ctx.fillRect(sz*0.32, sz*0.22+bounce, sz*0.1, sz*0.1); ctx.fillRect(sz*0.58, sz*0.22+bounce, sz*0.1, sz*0.1)
      ctx.fillStyle = '#000'
      ctx.fillRect(sz*0.35, sz*0.25+bounce, sz*0.04, sz*0.04); ctx.fillRect(sz*0.61, sz*0.25+bounce, sz*0.04, sz*0.04)
    }

    // ─── BOSS EXTRA DETAIL (per-type unique visuals) ──────────────
    if (gm.mob.boss) {
      const bt = time || 0
      const mobKey = BOSS_MOB_KEY[gm.mob.bossType] || BOSS_MOB_KEY[gm.mob.name] || 'slime'
      const bv = BOSS_VISUALS[mobKey] || BOSS_VISUALS.slime
      const atkPhase = gm.atkAnim || 0
      const atkPulse = Math.sin(atkPhase * Math.PI)

      // ── Aura (per-type color) ──
      const pulse1 = 0.15 + Math.sin(bt*3) * 0.1
      ctx.globalAlpha = deathAlpha * pulse1
      ctx.fillStyle = bv.auraColor + '0.3)'
      ctx.beginPath(); ctx.ellipse(sz/2, sz*0.7, bossSz*0.55, bossSz*0.25, 0, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = bv.auraColor + '0.15)'
      ctx.beginPath(); ctx.ellipse(sz/2, sz*0.7, bossSz*0.7, bossSz*0.35, 0, 0, Math.PI*2); ctx.fill()
      ctx.globalAlpha = deathAlpha

      // ── Body recolor (overlay on generic mob shape) ──
      ctx.globalAlpha = deathAlpha * 0.4
      ctx.fillStyle = bv.bodyColor
      ctx.beginPath(); ctx.roundRect(sz*0.05, sz*0.2, sz*0.9, sz*0.9, 10*s); ctx.fill()
      ctx.globalAlpha = deathAlpha

      // ── Wings (per-type) ──
      if (bv.wingType === 'bat') {
        // Bat wings (demon)
        const wf = Math.sin(bt*4)*0.2
        ctx.fillStyle = 'rgba(120,0,0,0.7)'
        // Left wing
        ctx.beginPath(); ctx.moveTo(sz*0.1, sz*0.3)
        ctx.quadraticCurveTo(-sz*0.4, -sz*0.2+wf*sz, -sz*0.3+wf*sz*2, sz*0.1)
        ctx.quadraticCurveTo(-sz*0.2, sz*0.4, sz*0.1, sz*0.5)
        ctx.closePath(); ctx.fill()
        // Right wing
        ctx.beginPath(); ctx.moveTo(sz*0.9, sz*0.3)
        ctx.quadraticCurveTo(sz*1.4, -sz*0.2+wf*sz, sz*1.3-wf*sz*2, sz*0.1)
        ctx.quadraticCurveTo(sz*1.2, sz*0.4, sz*0.9, sz*0.5)
        ctx.closePath(); ctx.fill()
        // Wing membrane lines
        ctx.strokeStyle = 'rgba(180,0,0,0.5)'; ctx.lineWidth = 1.5*s
        for (let w = 0; w < 3; w++) {
          ctx.beginPath(); ctx.moveTo(sz*0.1, sz*0.35)
          ctx.lineTo(-sz*0.15 - w*sz*0.08, sz*0.05 + w*sz*0.12+wf*sz*0.3); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(sz*0.9, sz*0.35)
          ctx.lineTo(sz*1.15 + w*sz*0.08, sz*0.05 + w*sz*0.12+wf*sz*0.3); ctx.stroke()
        }
      } else if (bv.wingType === 'dragon') {
        // Dragon wings
        const wf = Math.sin(bt*3)*0.25
        ctx.fillStyle = 'rgba(180,60,0,0.7)'
        // Left
        ctx.beginPath(); ctx.moveTo(sz*0.15, sz*0.25)
        ctx.quadraticCurveTo(-sz*0.5+wf*sz, -sz*0.4, -sz*0.15, sz*0.0)
        ctx.quadraticCurveTo(-sz*0.1, sz*0.3, sz*0.15, sz*0.45)
        ctx.closePath(); ctx.fill()
        // Right
        ctx.beginPath(); ctx.moveTo(sz*0.85, sz*0.25)
        ctx.quadraticCurveTo(sz*1.5-wf*sz, -sz*0.4, sz*1.15, sz*0.0)
        ctx.quadraticCurveTo(sz*1.1, sz*0.3, sz*0.85, sz*0.45)
        ctx.closePath(); ctx.fill()
        // Wing bone
        ctx.strokeStyle = '#bf360c'; ctx.lineWidth = 2.5*s
        ctx.beginPath(); ctx.moveTo(sz*0.15, sz*0.3); ctx.lineTo(-sz*0.35, -sz*0.15+wf*sz); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(sz*0.85, sz*0.3); ctx.lineTo(sz*1.35, -sz*0.15+wf*sz); ctx.stroke()
      } else if (bv.wingType === 'dark') {
        // Dark knight cape/wings
        ctx.fillStyle = 'rgba(20,20,50,0.6)'
        ctx.beginPath(); ctx.moveTo(sz*0.1, sz*0.3)
        ctx.quadraticCurveTo(-sz*0.1, sz*0.9+Math.sin(bt*2)*sz*0.05, sz*0.0, sz*1.2)
        ctx.lineTo(sz*0.5, sz*1.0)
        ctx.lineTo(sz*1.0, sz*1.2)
        ctx.quadraticCurveTo(sz*1.1, sz*0.9+Math.sin(bt*2)*sz*0.05, sz*0.9, sz*0.3)
        ctx.closePath(); ctx.fill()
      } else if (bv.wingType === 'ghost') {
        // Skeleton ghostly wisps
        ctx.globalAlpha = deathAlpha * (0.3 + Math.sin(bt*2)*0.15)
        ctx.fillStyle = '#7c4dff'
        for (let gi = 0; gi < 3; gi++) {
          const gx = sz*0.2 + gi*sz*0.3
          const gy = sz*1.0 + Math.sin(bt*1.5+gi)*sz*0.15
          ctx.beginPath(); ctx.arc(gx, gy, sz*0.12, 0, Math.PI*2); ctx.fill()
        }
        ctx.globalAlpha = deathAlpha
      }

      // ── Horns/Tusks (per-type) ──
      if (bv.hornType === 'demon') {
        ctx.fillStyle = '#4a0000'
        ctx.beginPath(); ctx.moveTo(sz*0.2, sz*0.15)
        ctx.quadraticCurveTo(sz*0.1, -sz*0.3, sz*0.05, -sz*0.4)
        ctx.quadraticCurveTo(sz*0.15, -sz*0.2, sz*0.28, sz*0.18)
        ctx.closePath(); ctx.fill()
        ctx.beginPath(); ctx.moveTo(sz*0.8, sz*0.15)
        ctx.quadraticCurveTo(sz*0.9, -sz*0.3, sz*0.95, -sz*0.4)
        ctx.quadraticCurveTo(sz*0.85, -sz*0.2, sz*0.72, sz*0.18)
        ctx.closePath(); ctx.fill()
        // Horn glow
        ctx.fillStyle = `rgba(255,50,0,${0.5+Math.sin(bt*4)*0.3})`
        ctx.beginPath(); ctx.arc(sz*0.05, -sz*0.38, 3*s, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(sz*0.95, -sz*0.38, 3*s, 0, Math.PI*2); ctx.fill()
      } else if (bv.hornType === 'dragon') {
        ctx.fillStyle = '#bf360c'
        // Two big dragon horns
        ctx.beginPath(); ctx.moveTo(sz*0.2, sz*0.1)
        ctx.quadraticCurveTo(sz*0.05, -sz*0.25, sz*0.1, -sz*0.45)
        ctx.lineTo(sz*0.22, -sz*0.35)
        ctx.quadraticCurveTo(sz*0.18, -sz*0.15, sz*0.27, sz*0.15)
        ctx.closePath(); ctx.fill()
        ctx.beginPath(); ctx.moveTo(sz*0.8, sz*0.1)
        ctx.quadraticCurveTo(sz*0.95, -sz*0.25, sz*0.9, -sz*0.45)
        ctx.lineTo(sz*0.78, -sz*0.35)
        ctx.quadraticCurveTo(sz*0.82, -sz*0.15, sz*0.73, sz*0.15)
        ctx.closePath(); ctx.fill()
        // Small horns
        ctx.fillStyle = '#d84315'
        ctx.beginPath(); ctx.moveTo(sz*0.35, sz*0.08)
        ctx.lineTo(sz*0.32, -sz*0.15); ctx.lineTo(sz*0.4, sz*0.12); ctx.closePath(); ctx.fill()
        ctx.beginPath(); ctx.moveTo(sz*0.65, sz*0.08)
        ctx.lineTo(sz*0.68, -sz*0.15); ctx.lineTo(sz*0.6, sz*0.12); ctx.closePath(); ctx.fill()
      } else if (bv.hornType === 'tusks') {
        // Orc tusks
        ctx.fillStyle = '#f5f5dc'
        ctx.beginPath(); ctx.moveTo(sz*0.2, sz*0.55)
        ctx.quadraticCurveTo(sz*0.1, sz*0.45, sz*0.08, sz*0.35)
        ctx.quadraticCurveTo(sz*0.15, sz*0.4, sz*0.25, sz*0.52)
        ctx.closePath(); ctx.fill()
        ctx.beginPath(); ctx.moveTo(sz*0.8, sz*0.55)
        ctx.quadraticCurveTo(sz*0.9, sz*0.45, sz*0.92, sz*0.35)
        ctx.quadraticCurveTo(sz*0.85, sz*0.4, sz*0.75, sz*0.52)
        ctx.closePath(); ctx.fill()
      }

      // ── Eyes (per-type) ──
      const eyePulse = 0.6 + Math.sin(bt*5)*0.4
      if (mobKey === 'skeleton') {
        // Skeleton: empty eye sockets with glow
        ctx.fillStyle = '#1a1a1a'
        ctx.beginPath(); ctx.ellipse(sz*0.35, sz*0.22, 5*s, 6*s, 0, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(sz*0.65, sz*0.22, 5*s, 6*s, 0, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = `rgba(124,77,255,${eyePulse})`
        ctx.beginPath(); ctx.arc(sz*0.35, sz*0.22, 2.5*s, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(sz*0.65, sz*0.22, 2.5*s, 0, Math.PI*2); ctx.fill()
      } else if (mobKey === 'slime') {
        // Slime: 3 eyes
        ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(sz*0.3, sz*0.25, 5*s, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(sz*0.5, sz*0.2, 5*s, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(sz*0.7, sz*0.25, 5*s, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#1a1a1a'
        ctx.beginPath(); ctx.arc(sz*0.32, sz*0.25, 2.5*s, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(sz*0.52, sz*0.2, 2.5*s, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(sz*0.72, sz*0.25, 2.5*s, 0, Math.PI*2); ctx.fill()
        // Eye sparkle
        ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(sz*0.33, sz*0.23, 1*s, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(sz*0.53, sz*0.18, 1*s, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(sz*0.73, sz*0.23, 1*s, 0, Math.PI*2); ctx.fill()
      } else if (mobKey === 'goblin') {
        // Goblin: angry yellow eyes
        ctx.fillStyle = '#ffeb3b'
        ctx.beginPath(); ctx.ellipse(sz*0.35, sz*0.22, 4*s, 3*s, -0.2, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(sz*0.65, sz*0.22, 4*s, 3*s, 0.2, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#1a1a1a'
        ctx.beginPath(); ctx.arc(sz*0.36, sz*0.22, 2*s, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(sz*0.66, sz*0.22, 2*s, 0, Math.PI*2); ctx.fill()
      } else if (mobKey === 'wolf') {
        // Wolf: glowing beast eyes
        ctx.fillStyle = `rgba(255,235,59,${eyePulse})`
        ctx.beginPath(); ctx.ellipse(sz*0.33, sz*0.2, 4*s, 3*s, 0, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(sz*0.67, sz*0.2, 4*s, 3*s, 0, 0, Math.PI*2); ctx.fill()
        // Vertical pupils
        ctx.fillStyle = '#1a1a1a'
        ctx.beginPath(); ctx.ellipse(sz*0.33, sz*0.2, 1.5*s, 3*s, 0, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(sz*0.67, sz*0.2, 1.5*s, 3*s, 0, 0, Math.PI*2); ctx.fill()
      } else if (mobKey === 'darkknight') {
        // Dark knight: visor slit with red glow
        ctx.fillStyle = '#0a0a1a'
        ctx.beginPath(); ctx.roundRect(sz*0.2, sz*0.18, sz*0.6, sz*0.1, 3*s); ctx.fill()
        ctx.fillStyle = `rgba(255,23,68,${eyePulse})`
        ctx.beginPath(); ctx.roundRect(sz*0.25, sz*0.2, sz*0.5, sz*0.04, 2*s); ctx.fill()
      } else {
        // Default: 2 eyes (orc, demon, dragon)
        ctx.fillStyle = bv.eyeColor
        ctx.beginPath(); ctx.arc(sz*0.35, sz*0.22, 4*s, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(sz*0.65, sz*0.22, 4*s, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#1a1a1a'
        ctx.beginPath(); ctx.arc(sz*0.36, sz*0.22, 2*s, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(sz*0.66, sz*0.22, 2*s, 0, Math.PI*2); ctx.fill()
        // Eye shine
        ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(sz*0.37, sz*0.2, 1*s, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(sz*0.67, sz*0.2, 1*s, 0, Math.PI*2); ctx.fill()
      }

      // ── Mouth (per-type) ──
      if (bv.mouthType === 'wavy') {
        // Slime wavy smile
        ctx.strokeStyle = '#1a5e1f'; ctx.lineWidth = 2*s
        ctx.beginPath()
        ctx.moveTo(sz*0.25, sz*0.42)
        ctx.quadraticCurveTo(sz*0.35, sz*0.48+Math.sin(bt*3)*2*s, sz*0.5, sz*0.42)
        ctx.quadraticCurveTo(sz*0.65, sz*0.36-Math.sin(bt*3)*2*s, sz*0.75, sz*0.42)
        ctx.stroke()
      } else if (bv.mouthType === 'fangs') {
        // Goblin fangs
        ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.moveTo(sz*0.35, sz*0.4); ctx.lineTo(sz*0.38, sz*0.48); ctx.lineTo(sz*0.41, sz*0.4); ctx.closePath(); ctx.fill()
        ctx.beginPath(); ctx.moveTo(sz*0.59, sz*0.4); ctx.lineTo(sz*0.62, sz*0.48); ctx.lineTo(sz*0.65, sz*0.4); ctx.closePath(); ctx.fill()
        ctx.fillStyle = '#3e2723'
        ctx.beginPath(); ctx.roundRect(sz*0.32, sz*0.42, sz*0.36, sz*0.08, 2*s); ctx.fill()
      } else if (bv.mouthType === 'skull') {
        // Skeleton: jaw line
        ctx.strokeStyle = '#888'; ctx.lineWidth = 2*s
        ctx.beginPath()
        ctx.moveTo(sz*0.3, sz*0.4)
        for (let si = 0; si < 5; si++) {
          ctx.lineTo(sz*0.33 + si*sz*0.09, sz*0.44)
          ctx.lineTo(sz*0.35 + si*sz*0.09, sz*0.4)
        }
        ctx.stroke()
      } else if (bv.mouthType === 'beast') {
        // Wolf/demon/dragon: open jaw with teeth
        const jawOpen = atkPulse * sz * 0.08
        ctx.fillStyle = '#8b0000'
        ctx.beginPath()
        ctx.moveTo(sz*0.3, sz*0.4)
        ctx.quadraticCurveTo(sz*0.5, sz*0.48+jawOpen, sz*0.7, sz*0.4)
        ctx.quadraticCurveTo(sz*0.5, sz*0.42+jawOpen, sz*0.3, sz*0.4)
        ctx.fill()
        // Teeth
        ctx.fillStyle = '#fff'
        for (let ti = 0; ti < 5; ti++) {
          const tx = sz*0.33 + ti*sz*0.09
          ctx.beginPath(); ctx.moveTo(tx, sz*0.4); ctx.lineTo(tx+sz*0.02, sz*0.43+jawOpen*0.5); ctx.lineTo(tx+sz*0.04, sz*0.4); ctx.closePath(); ctx.fill()
        }
      } else if (bv.mouthType === 'tusks') {
        // Orc mouth with tusks (already drawn above)
        ctx.fillStyle = '#3e2723'
        ctx.beginPath(); ctx.roundRect(sz*0.32, sz*0.42, sz*0.36, sz*0.06, 2*s); ctx.fill()
      } else if (bv.mouthType === 'visor') {
        // Dark knight: no visible mouth
      }

      // ── Weapon (per-type, during attack) ──
      if (atkPhase > 0) {
        if (bv.weaponType === 'club') {
          ctx.save(); ctx.translate(sz*0.85, sz*0.3)
          ctx.rotate(-atkPulse * 2.5)
          ctx.fillStyle = '#5d4037'
          ctx.fillRect(-3*s, -sz*0.35, 6*s, sz*0.35)
          ctx.fillStyle = '#3e2723'
          ctx.beginPath(); ctx.ellipse(0, -sz*0.38, 8*s, 12*s, 0, 0, Math.PI*2); ctx.fill()
          ctx.restore()
        } else if (bv.weaponType === 'scythe') {
          ctx.save(); ctx.translate(sz*0.1, sz*0.4)
          ctx.rotate(atkPulse * 1.8)
          ctx.fillStyle = '#666'
          ctx.fillRect(-2*s, -sz*0.5, 4*s, sz*0.5)
          ctx.fillStyle = '#9c27b0'
          ctx.beginPath()
          ctx.moveTo(0, -sz*0.5)
          ctx.quadraticCurveTo(sz*0.2, -sz*0.6, sz*0.3, -sz*0.4)
          ctx.quadraticCurveTo(sz*0.15, -sz*0.45, 0, -sz*0.45)
          ctx.closePath(); ctx.fill()
          ctx.restore()
        } else if (bv.weaponType === 'axe') {
          ctx.save(); ctx.translate(sz*0.85, sz*0.25)
          ctx.rotate(-atkPulse * 2.2)
          ctx.fillStyle = '#5d4037'
          ctx.fillRect(-2*s, -sz*0.4, 4*s, sz*0.4)
          ctx.fillStyle = '#78909c'
          ctx.beginPath()
          ctx.moveTo(-2*s, -sz*0.4)
          ctx.quadraticCurveTo(sz*0.15, -sz*0.5, sz*0.12, -sz*0.35)
          ctx.quadraticCurveTo(sz*0.1, -sz*0.42, -2*s, -sz*0.4)
          ctx.closePath(); ctx.fill()
          ctx.restore()
        } else if (bv.weaponType === 'sword') {
          ctx.save(); ctx.translate(sz*0.85, sz*0.2)
          ctx.rotate(-atkPulse * 2.8)
          ctx.fillStyle = '#b0bec5'
          ctx.fillRect(-2*s, -sz*0.5, 4*s, sz*0.5)
          ctx.fillStyle = '#ffd700'
          ctx.fillRect(-5*s, 0, 10*s, 4*s)
          ctx.fillStyle = '#5d4037'
          ctx.fillRect(-2*s, 4*s, 4*s, sz*0.12)
          ctx.restore()
        } else if (bv.weaponType === 'trident') {
          ctx.save(); ctx.translate(sz*0.9, sz*0.3)
          ctx.rotate(-atkPulse * 2)
          ctx.fillStyle = '#4a148c'
          ctx.fillRect(-2*s, -sz*0.5, 4*s, sz*0.5)
          // 3 prongs
          for (let pi = -1; pi <= 1; pi++) {
            ctx.beginPath()
            ctx.moveTo(pi*5*s, -sz*0.5)
            ctx.lineTo(pi*5*s - 2*s, -sz*0.6)
            ctx.lineTo(pi*5*s + 2*s, -sz*0.6)
            ctx.closePath(); ctx.fill()
          }
          ctx.restore()
        } else if (bv.weaponType === 'claws') {
          // Wolf: glowing claw swipe
          ctx.strokeStyle = `rgba(255,235,59,${atkPulse*0.8})`
          ctx.lineWidth = 3*s
          for (let ci = 0; ci < 3; ci++) {
            const ca = -0.5 + ci * 0.5
            const cx2 = sz*0.85 + Math.cos(ca + atkPulse*2) * sz*0.2
            const cy2 = sz*0.3 + Math.sin(ca + atkPulse*2) * sz*0.15
            ctx.beginPath()
            ctx.moveTo(sz*0.75, sz*0.35)
            ctx.lineTo(cx2, cy2)
            ctx.stroke()
          }
        }
      }

      // ── Dragon fire breath effect (during attack) ──
      if (mobKey === 'dragon' && atkPhase > 0.2) {
        const fAlpha = Math.sin(atkPhase * Math.PI) * 0.7
        ctx.globalAlpha = deathAlpha * fAlpha
        // Fire cone
        for (let fi = 0; fi < 4; fi++) {
          const fx = sz*0.8 + fi*sz*0.15
          const fy = sz*0.35 + Math.sin(bt*8+fi)*sz*0.05
          const fs = sz*0.12 - fi*sz*0.02
          ctx.fillStyle = fi < 2 ? '#ff6600' : '#ffcc00'
          ctx.beginPath(); ctx.arc(fx, fy, fs, 0, Math.PI*2); ctx.fill()
        }
        ctx.globalAlpha = deathAlpha
      }

      // ── Demon hellfire effect (during attack) ──
      if (mobKey === 'demon' && atkPhase > 0.2) {
        const fAlpha = Math.sin(atkPhase * Math.PI) * 0.6
        ctx.globalAlpha = deathAlpha * fAlpha
        for (let fi = 0; fi < 3; fi++) {
          const fx = sz*0.75 + fi*sz*0.12
          const fy = sz*0.3 + Math.sin(bt*10+fi*2)*sz*0.04
          ctx.fillStyle = fi === 0 ? '#ff1744' : fi === 1 ? '#ff6600' : '#ffab00'
          ctx.beginPath(); ctx.arc(fx, fy, sz*0.08, 0, Math.PI*2); ctx.fill()
        }
        ctx.globalAlpha = deathAlpha
      }

      // ── Scales (dragon) ──
      if (bv.hasScales) {
        ctx.fillStyle = 'rgba(255,87,34,0.25)'
        for (let si = 0; si < 6; si++) {
          const sx = sz*0.2 + (si % 3) * sz*0.25
          const sy = sz*0.5 + Math.floor(si/3) * sz*0.2
          ctx.beginPath(); ctx.arc(sx, sy, sz*0.06, 0, Math.PI*2); ctx.fill()
        }
      }

      // ── Tentacles (slime) ──
      if (bv.hasTentacles) {
        ctx.strokeStyle = '#00c853'; ctx.lineWidth = 3*s
        for (let ti = 0; ti < 3; ti++) {
          const ta = bt*2 + ti * Math.PI * 0.7
          const tx = sz*0.25 + ti * sz*0.25
          const ty = sz*0.8
          ctx.beginPath(); ctx.moveTo(tx, ty)
          ctx.quadraticCurveTo(tx + Math.sin(ta)*sz*0.15, ty + sz*0.15, tx + Math.cos(ta)*sz*0.1, ty + sz*0.3)
          ctx.stroke()
        }
      }

      // ── Dark armor plating overlay ──
      ctx.fillStyle = 'rgba(20,0,0,0.2)'
      ctx.beginPath(); ctx.roundRect(sz*0.05, sz*0.4, sz*0.9, sz*0.7, 8*s); ctx.fill()
      // Armor plate lines
      ctx.strokeStyle = bv.auraColor + '0.3)'; ctx.lineWidth = 1.5*s
      ctx.beginPath(); ctx.moveTo(sz/2, sz*0.4); ctx.lineTo(sz/2, sz*1.1); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(sz*0.2, sz*0.6); ctx.lineTo(sz*0.8, sz*0.6); ctx.stroke()

      // ── Pulsing outline (per-type color) ──
      ctx.strokeStyle = bv.auraColor + `${0.4+Math.sin(bt*3)*0.3})`
      ctx.lineWidth = 3*s
      ctx.beginPath(); ctx.roundRect(sz*0.08, sz*0.35, sz*0.84, sz*0.8, 8*s); ctx.stroke()

      // ── Dark energy particles (per-type color) ──
      for (let pi = 0; pi < 4; pi++) {
        const pa = bt * 2 + pi * Math.PI / 2
        const pr = bossSz * 0.5 + Math.sin(bt + pi) * bossSz * 0.1
        const px = Math.cos(pa) * pr
        const py = Math.sin(pa) * pr * 0.5
        ctx.fillStyle = pi % 2 === 0 ? bv.auraColor + '0.5)' : 'rgba(255,215,0,0.3)'
        ctx.beginPath(); ctx.arc(px, py - sz*0.2, 2*s, 0, Math.PI*2); ctx.fill()
      }

      // ── Boss HP bar ──
      const hpPct2 = Math.max(0, gm.hp / gm.maxHp)
      const bBarW = sz * 1.2, bBarH = 6 * s
      const bBarX = -bBarW/2 + sz/2, bBarY = -sz * 1.1
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.beginPath(); ctx.roundRect(bBarX-2, bBarY-2, bBarW+4, bBarH+4, 3); ctx.fill()
      ctx.fillStyle = '#333'
      ctx.beginPath(); ctx.roundRect(bBarX, bBarY, bBarW, bBarH, 2); ctx.fill()
      ctx.fillStyle = hpPct2 > 0.5 ? '#ff2200' : hpPct2 > 0.25 ? '#ff6600' : '#ff0000'
      ctx.beginPath(); ctx.roundRect(bBarX, bBarY, bBarW*hpPct2, bBarH, 2); ctx.fill()
      // HP text
      ctx.font = `bold ${7*s}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      ctx.fillText(`${Math.ceil(gm.hp)}/${gm.maxHp}`, bBarX + bBarW/2, bBarY - 3*s)
    }

    // ─── PER-MOB ATTACK ANIMATION ──────────────────────────
    if (matk > 0) {
      const phase = matk // 0→1
      const tri = phase > 0.5 ? (1 - phase) * 2 : phase

      // 1. Slime: squash-stretch + particles
      if (mobName === 'slime') {
        const squash = Math.sin(phase * Math.PI) * 0.35
        ctx.save()
        ctx.translate(sz/2, groundY - cy)
        ctx.scale(1 + squash, 1 - squash)
        ctx.translate(-sz/2, -(groundY - cy))
        ctx.fillStyle = base.color
        const dy = sz*0.35
        ctx.beginPath(); ctx.arc(sz/2, sz*0.6+dy, sz*0.38, Math.PI, 0); ctx.fill()
        ctx.fillStyle = base.highlight
        ctx.beginPath(); ctx.arc(sz/2, sz*0.55+dy, sz*0.28, Math.PI, 0); ctx.fill()
        ctx.restore()
        // slime drip particles
        if (phase > 0.3 && phase < 0.8) {
          for (let i=0;i<3;i++) {
            state.particles.push({x:cx+sz/2+Math.random()*sz*0.4-sz*0.2, y:cy+sz*0.6+dy, vx:Math.random()*40-20, vy:Math.random()*60+20, size:3*s, life:0.5, color:'#a5d6a7'})
          }
        }
      }

      // 2. Wolf: bite lunge with open jaw
      else if (mobName === 'wolf') {
        // jaw open during attack
        ctx.fillStyle = '#ffcccc'
        ctx.beginPath(); ctx.arc(sz/2 + tri*sz*0.2, sz*0.35 + tri*sz*0.15, sz*0.12, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#e53935'
        ctx.beginPath(); ctx.arc(sz/2 + tri*sz*0.2, sz*0.4 + tri*sz*0.15, sz*0.06, 0, Math.PI*2); ctx.fill()
        // teeth
        ctx.fillStyle = '#fff'
        for (let i=0;i<4;i++) {
          const tx = sz/2 + tri*sz*0.2 - sz*0.08 + i*sz*0.05
          ctx.fillRect(tx, sz*0.3 + tri*sz*0.15, sz*0.04, sz*0.04)
          ctx.fillRect(tx, sz*0.38 + tri*sz*0.15, sz*0.04, sz*0.04)
        }
      }

      // 3. Goblin: wild club swing, stutter step
      else if (mobName === 'goblin') {
        ctx.save()
        ctx.translate(sz*0.1, sz*0.5)
        ctx.rotate(-tri * 1.8)
        ctx.translate(-sz*0.1, -sz*0.5)
        ctx.fillStyle = '#6d4c41'
        ctx.fillRect(sz*0.12, sz*-0.05, sz*0.18, sz*0.65)
        ctx.fillStyle = '#3e2723'
        ctx.fillRect(sz*0.08, sz*-0.15, sz*0.26, sz*0.18)
        ctx.restore()
        // swing trail
        if (phase > 0.4) {
          ctx.strokeStyle = `rgba(150,100,50,${tri*0.3})`
          ctx.lineWidth = 3*s
          ctx.beginPath(); ctx.arc(sz*0.2, sz*0.3, sz*0.6 - tri*sz*0.2, 0.5, 1.8); ctx.stroke()
        }
      }

      // 4. Skeleton: bow aim + arrow glow
      else if (mobName === 'skeleton') {
        ctx.strokeStyle = '#6d4c41'; ctx.lineWidth = 2*s
        ctx.save()
        ctx.translate(sz*0.9, sz*0.2)
        ctx.rotate(tri * 0.2)
        ctx.translate(-sz*0.9, -sz*0.2)
        // draw bow pulled back
        ctx.beginPath(); ctx.arc(sz*0.9, sz*0.2, sz*0.25, -1.2 - tri*0.4, 1.2 + tri*0.4); ctx.stroke()
        ctx.restore()
        // arrow glow at apex
        if (phase > 0.3 && phase < 0.8) {
          ctx.fillStyle = `rgba(255,235,59,${tri*0.7})`
          ctx.beginPath(); ctx.arc(sz*0.2, sz*0.25, sz*0.08 + tri*sz*0.05, 0, Math.PI*2); ctx.fill()
          ctx.fillStyle = `rgba(255,255,200,${tri*0.3})`
          ctx.beginPath(); ctx.arc(sz*0.2, sz*0.25, sz*0.18 + tri*sz*0.1, 0, Math.PI*2); ctx.fill()
        }
      }

      // 5. Orc: heavy overhead axe slam
      else if (mobName === 'orc') {
        ctx.save()
        ctx.translate(sz*0.15, sz*0.5)
        ctx.rotate(-phase * 2.5)
        ctx.translate(-sz*0.15, -sz*0.5)
        ctx.fillStyle = '#6d4c41'
        ctx.fillRect(sz*0.82, sz*0.05, sz*0.08, sz*0.6)
        ctx.fillStyle = '#90a4ae'
        ctx.beginPath(); ctx.arc(sz*0.86, sz*0.15, sz*0.14, 0, Math.PI*2); ctx.fill()
        ctx.restore()
        // ground impact flash
        if (phase > 0.7) {
          ctx.fillStyle = `rgba(255,200,100,${tri*0.4})`
          ctx.beginPath(); ctx.ellipse(sz/2, sz*1.0, sz*0.5, sz*0.08, 0, 0, Math.PI*2); ctx.fill()
        }
      }

      // 6. Dark Knight: swift horizontal slash with sword trail
      else if (mobName === 'dark knight') {
        ctx.save()
        ctx.translate(sz*0.1, sz*0.5)
        ctx.rotate(-tri * 0.8)
        ctx.translate(-sz*0.1, -sz*0.5)
        ctx.fillStyle = '#6d4c41'
        ctx.fillRect(sz*0.82, sz*0.1, sz*0.08, sz*0.7)
        ctx.fillStyle = '#f1c40f'
        ctx.fillRect(sz*0.78, sz*0.05, sz*0.16, sz*0.1)
        ctx.restore()
        // slash trail
        if (phase > 0.3) {
          ctx.strokeStyle = `rgba(200,180,255,${tri*0.4})`
          ctx.lineWidth = 2*s
          const arcAng = tri * 2.5
          ctx.beginPath(); ctx.arc(sz*0.5, sz*0.5, sz*0.5, 0.5 - arcAng, 0.8); ctx.stroke()
        }
      }

      // 7. Demon: dark fire orb grows in hand
      else if (mobName === 'demon') {
        const orbR = sz*0.15 + phase * sz*0.25
        const glowR = orbR + sz*0.15
        ctx.fillStyle = `rgba(255,50,0,${phase*0.5})`
        ctx.beginPath(); ctx.arc(sz/2, sz*0.35, glowR, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = `rgba(255,100,0,${phase*0.8})`
        ctx.beginPath(); ctx.arc(sz/2, sz*0.35, orbR, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(sz*0.48, sz*0.32, sz*0.04, 0, Math.PI*2); ctx.fill()
        // dark flame particles
        if (phase > 0.5) {
          for (let i=0;i<2;i++) {
            const a = Math.random()*Math.PI*2
            state.particles.push({x:cx+sz/2, y:cy+sz*0.35, vx:Math.cos(a)*60, vy:Math.sin(a)*60-20, size:3*s, life:0.6, color:'#ff4400'})
          }
        }
      }

      // 8. Dragon: fire breath sweep
      else if (mobName === 'dragon') {
        const sweepX = Math.sin(phase * Math.PI * 2) * sz * 0.8
        const sweepY = -Math.abs(Math.sin(phase * Math.PI * 2)) * sz * 0.3
        ctx.fillStyle = `rgba(255,200,50,${phase*0.35})`
        ctx.beginPath(); ctx.arc(sz/2 + sweepX, sz*0.4 + sweepY, sz*0.25 + phase*sz*0.3, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = `rgba(255,100,0,${phase*0.3})`
        ctx.beginPath(); ctx.arc(sz/2 + sweepX, sz*0.4 + sweepY, sz*0.4 + phase*sz*0.4, 0, Math.PI*2); ctx.fill()
        // fire particles
        if (phase > 0.2) {
          state.particles.push({x:cx+sz/2+sweepX, y:cy+sz*0.4+sweepY, vx:Math.random()*80-40, vy:-Math.random()*60-20, size:4*s, life:0.5, color:'#ff6600'})
        }
      }
    }

    ctx.restore()

    // Hit flash — brief white tint only (no white square overlay)
    // (removed per user request — was showing as white square on mob)

    // HP bar position unchanged
    const barW = sz*1.2, barH = 6*s, barX = cx+sz/2-barW/2, barY = cy-16*s
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.beginPath(); ctx.roundRect(barX-1,barY-1,barW+2,barH+2,4); ctx.fill()
    const hpPct = gm.hp/gm.maxHp
    ctx.fillStyle = hpPct>0.5?'#4caf50':hpPct>0.25?'#ffeb3b':'#f44336'
    ctx.beginPath(); ctx.roundRect(barX, barY, barW*hpPct, barH, 3); ctx.fill()
    ctx.fillStyle = '#fff'; ctx.font = `bold ${10*s}px sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(gm.mob.name, cx+sz/2, barY-6*s)
    // Boss crown
    if (gm.mob.boss) {
      const crownY = -bossSz * 1.5
      // Crown body (5 spikes)
      ctx.fillStyle = '#ffd700'
      ctx.strokeStyle = '#ffaa00'
      ctx.lineWidth = 1.5 * s
      ctx.beginPath()
      ctx.moveTo(cx+sz/2 - 18*s, crownY + 10*s)
      ctx.lineTo(cx+sz/2 - 22*s, crownY - 2*s)
      ctx.lineTo(cx+sz/2 - 10*s, crownY + 4*s)
      ctx.lineTo(cx+sz/2 - 3*s, crownY - 5*s)
      ctx.lineTo(cx+sz/2 + 3*s, crownY + 2*s)
      ctx.lineTo(cx+sz/2 + 10*s, crownY - 5*s)
      ctx.lineTo(cx+sz/2 + 18*s, crownY + 4*s)
      ctx.lineTo(cx+sz/2 + 22*s, crownY - 2*s)
      ctx.lineTo(cx+sz/2 + 18*s, crownY + 10*s)
      ctx.closePath(); ctx.fill(); ctx.stroke()
      // Crown jewels (3 gems)
      ctx.fillStyle = '#ff1744'; ctx.beginPath(); ctx.arc(cx+sz/2 - 10*s, crownY + 5*s, 2.5*s, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = '#2196f3'; ctx.beginPath(); ctx.arc(cx+sz/2, crownY + 3*s, 2.5*s, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = '#00e676'; ctx.beginPath(); ctx.arc(cx+sz/2 + 10*s, crownY + 5*s, 2.5*s, 0, Math.PI*2); ctx.fill()
      // Boss name tag
      ctx.font = `bold ${9*s}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = gm.mob.color
      ctx.globalAlpha = deathAlpha * 0.9
      ctx.fillText(gm.mob.name, cx+sz/2, -bossSz * 1.7)
      ctx.globalAlpha = deathAlpha
    }
    } // end for loop
  }

function drawBackground() {
  const s = getS(), zone = getZone(state.zone), W = canvas.width, H = canvas.height
  const groundY = H * 0.58
  // Sky gradient
  const grad = ctx.createLinearGradient(0,0,0,H); grad.addColorStop(0,zone.bg); grad.addColorStop(0.5,zone.ground); grad.addColorStop(1,'#0a0a0a')
  ctx.fillStyle = grad; ctx.fillRect(0,0,W,H)
  // Stars (twinkle — dt-based)
  for (let i=0;i<40;i++) {
    const sx = (Math.sin(i*73.1+i*0.1)*0.5+0.5)*W, sy = (Math.cos(i*51.3)*0.5+0.5)*H*0.35
    const twinkle = 0.1 + 0.15 * Math.sin(time*0.8 + i*2.1)
    ctx.fillStyle = `rgba(255,255,255,${twinkle})`
    ctx.fillRect(sx, sy, i%3===0?2:1, i%3===0?2:1)
  }
  // Moon
  const mx = W*0.82, my = H*0.08, mr = 18*s
  ctx.fillStyle = 'rgba(255,250,220,0.12)'; ctx.beginPath(); ctx.arc(mx,my,mr*2.5,0,Math.PI*2); ctx.fill()
  ctx.fillStyle = 'rgba(255,250,220,0.35)'; ctx.beginPath(); ctx.arc(mx,my,mr,0,Math.PI*2); ctx.fill()
  ctx.fillStyle = zone.bg; ctx.beginPath(); ctx.arc(mx+5*s,my-3*s,mr*0.85,0,Math.PI*2); ctx.fill()
  // Far mountains (parallax slow — dt-based)
  const mOff1 = (time * 12) % W
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  for (let i=0; i<6; i++) {
    const bx = (i*W/3 - mOff1) % (W+W/3) - W/3
    const bh = H*0.15 + Math.sin(i*2.3)*H*0.06
    ctx.beginPath(); ctx.moveTo(bx, groundY); ctx.lineTo(bx+W/5, groundY-bh); ctx.lineTo(bx+W/2.5, groundY); ctx.fill()
  }
  // Near hills (parallax medium — dt-based)
  const mOff2 = (time * 30) % W
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  for (let i=0; i<8; i++) {
    const bx = (i*W/4 - mOff2) % (W+W/4) - W/4
    const bh = H*0.08 + Math.sin(i*3.1)*H*0.04
    ctx.beginPath(); ctx.moveTo(bx, groundY); ctx.lineTo(bx+W/8, groundY-bh); ctx.lineTo(bx+W/3.5, groundY); ctx.fill()
  }
  // Trees
  const treeColors = ['#1a4a1a','#0d2d0d','#2a1a2a','#3a0a0a','#2a1a0a']
  ctx.fillStyle = treeColors[state.zone] || '#1a4a1a'
  for (let i=0; i<12; i++) {
    const tx = (i*W/7 + 20) % W, th = (20 + (i*7)%15)*s
    const tw = th*0.4
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(tx-2*s, groundY-th*0.4, 4*s, th*0.4)
    ctx.beginPath(); ctx.moveTo(tx-tw, groundY-th*0.35); ctx.lineTo(tx, groundY-th); ctx.lineTo(tx+tw, groundY-th*0.35); ctx.fill()
    ctx.beginPath(); ctx.moveTo(tx-tw*0.7, groundY-th*0.55); ctx.lineTo(tx, groundY-th*1.15); ctx.lineTo(tx+tw*0.7, groundY-th*0.55); ctx.fill()
  }
  // Ground
  ctx.fillStyle = zone.ground; ctx.fillRect(0, groundY, W, H-groundY)
  // Ground tiles (scrolling — dt-based)
  const tileScroll = isIdle ? 0 : (time * 80) % 60
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1
  for (let x = -60; x < W+60; x += 60) {
    for (let y = groundY; y < H; y += 30) {
      ctx.strokeRect(x - tileScroll, y, 58, 28)
    }
  }
  // Grass tufts (scrolling)
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1.5
  for (let i=0; i<40; i++) {
    const gx = isIdle ? (i*W/35+10)%W : ((i*W/35+10)%W - tileScroll + W) % W, gy = groundY+2+((i*13)%20)*s
    const gh = (6+(i%5)*2)*s, sway = Math.sin(frameCount*0.04+i)*2*s
    ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx+sway,gy-gh); ctx.stroke()
  }
  // Ground rocks (scrolling)
  ctx.fillStyle = 'rgba(0,0,0,0.15)'
  for (let i=0;i<12;i++) {
    const rx = ((i*W/10+40)%W - tileScroll + W) % W, ry = groundY+5+((i*11)%15)*s, rw = (8+(i%4)*3)*s, rh = rw*0.5
    ctx.beginPath(); ctx.ellipse(rx,ry,rw,rh,0,0,Math.PI*2); ctx.fill()
  }
  // Fog layer
  ctx.fillStyle = 'rgba(255,255,255,0.02)'
  for (let i=0;i<5;i++) {
    const fx = ((frameCount*0.3+i*200)%W), fy = groundY - 20*s + i*8*s
    ctx.beginPath(); ctx.ellipse(fx, fy, 80*s, 12*s, 0, 0, Math.PI*2); ctx.fill()
  }
  // Zone particles
  const particleCount = [15,20,10,25,12][state.zone] || 15
  const pColors = ['#ffd700','#8bc34a','#9c27b0','#ff5722','#ff9800']
  const pSpeeds = [0.3, 0.8, 0.4, 1.2, 0.6]
  for (let i=0; i<particleCount; i++) {
    const px = (Math.sin(i*47.3+frameCount*pSpeeds[state.zone]*0.01)*0.5+0.5)*W
    const py = ((frameCount*pSpeeds[state.zone]+i*137)%H)
    const pa = 0.15 + 0.2*Math.sin(frameCount*0.05+i)
    const ps = (1.5+(i%3))*s
    ctx.fillStyle = pColors[state.zone]
    ctx.globalAlpha = pa; ctx.beginPath(); ctx.arc(px,py,ps,0,Math.PI*2); ctx.fill()
    ctx.globalAlpha = 1
  }
  // Zone badge
  ctx.font = `bold ${13*s}px sans-serif`
  const zoneText = zone.name, tw = ctx.measureText(zoneText).width
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.beginPath(); ctx.roundRect(canvas.width/2-tw/2-10,52,tw+20,24*s,6); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(zoneText, canvas.width/2, 52+17*s)
  ctx.font = `${10*s}px sans-serif`; ctx.fillStyle = '#aaa'; ctx.fillText(`Kills: ${state.totalKills}`, canvas.width/2, 52+34*s)
  // Skill info display (top-right)
  if (state.hero && state.started) {
    const sx = canvas.width - 10, sy = 72
    ctx.textAlign = 'right'
    // Skill 1: always shown
    const sk1 = getSkill(state.hero.id, 0)
    if (sk1) {
      ctx.font = `bold ${10*s}px sans-serif`
      ctx.fillStyle = sk1.aoe ? '#ffd700' : '#4caf50'
      ctx.fillText(`S1 ${sk1.emoji} ${sk1.name}`, sx, sy)
      ctx.font = `${8*s}px sans-serif`
      ctx.fillStyle = state.skill1Cd > 0 ? '#ff5555' : '#4caf50'
      ctx.fillText(state.skill1Cd > 0 ? `${Math.ceil(state.skill1Cd)}s` : 'READY', sx, sy + 12*s)
    }
    // Skill 2: shown always, locked text if <8
    const sk2 = getSkill(state.hero.id, 1)
    if (sk2) {
      ctx.font = `bold ${10*s}px sans-serif`
      ctx.fillStyle = state.level >= 8 ? (sk2.aoe ? '#ffd700' : '#4caf50') : 'rgba(255,255,255,0.25)'
      ctx.fillText(`S2 ${sk2.emoji} ${sk2.name}`, sx, sy + 26*s)
      if (state.level >= 8) {
        ctx.font = `${8*s}px sans-serif`
        ctx.fillStyle = state.skill2Cd > 0 ? '#ff5555' : '#4caf50'
        ctx.fillText(state.skill2Cd > 0 ? `${Math.ceil(state.skill2Cd)}s` : 'READY', sx, sy + 38*s)
      } else {
        ctx.font = `${7*s}px sans-serif`
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.fillText('Lv.8 unlock', sx, sy + 38*s)
      }
    }
    ctx.textAlign = 'center'
  }
  // Combat log
  const logY = canvas.height - 160*s, logH = 60*s
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.roundRect(4,logY-4,canvas.width-8,logH+8,6); ctx.fill()
  ctx.textAlign = 'left'
  state.combatLog.slice(0,3).forEach((msg,i) => { ctx.fillStyle = `rgba(255,255,255,${0.9-i*0.25})`; ctx.font = `${10*s}px sans-serif`; ctx.fillText(msg, 10, logY+12*s+i*18*s) })
  // Float texts
  for (let i=state.floatTexts.length-1;i>=0;i--) {
    const ft = state.floatTexts[i]; ft.y -= 0.6; ft.life -= 0.02
    if (ft.life<=0) { state.floatTexts.splice(i,1); continue }
    ctx.globalAlpha = Math.min(1,ft.life); ctx.fillStyle = ft.color; ctx.font = `bold ${(ft.size||14)*s}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText(ft.text, ft.x, ft.y); ctx.globalAlpha = 1
  }
}

function drawHeroProjectile() {
  if (!state.heroProjectile) return
  const p = state.heroProjectile, s = getS()
  const angle = Math.atan2(p.ty - p.y, p.tx - p.x)
  p.age = (p.age || 0) + 1
  const hid = p.heroId || (state.hero && state.hero.id) || 'mage'

  if (hid === 'ranger') {
    // ─── RANGER: Enhanced arrow projectile ───
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(angle)
    if (p.isSkill) {
      if (p.skillName === 'Arrow Rain') {
        // Arrow Rain: 3 arrows staggered with enhanced visuals
        for (let i = -1; i <= 1; i++) {
          const offy = i * 8 * s + Math.sin(p.age * 0.3 + i) * 3 * s
          ctx.save(); ctx.translate(0, offy)
          // Arrow shaft with glow
          ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 2.5 * s
          ctx.beginPath(); ctx.moveTo(-18 * s, 0); ctx.lineTo(12 * s, 0); ctx.stroke()
          // Arrowhead (triangle)
          ctx.fillStyle = '#b0bec5'
          ctx.beginPath(); ctx.moveTo(12 * s, 0); ctx.lineTo(6 * s, -4 * s); ctx.lineTo(6 * s, 4 * s); ctx.fill()
          // Fletching
          ctx.fillStyle = '#f44336'
          ctx.beginPath(); ctx.moveTo(-16 * s, 0); ctx.lineTo(-18 * s, -3 * s); ctx.lineTo(-14 * s, 0); ctx.fill()
          ctx.beginPath(); ctx.moveTo(-16 * s, 0); ctx.lineTo(-18 * s, 3 * s); ctx.lineTo(-14 * s, 0); ctx.fill()
          // Green glow trail
          ctx.globalAlpha = 0.3
          ctx.fillStyle = '#4caf50'
          ctx.beginPath(); ctx.arc(-10 * s, 0, 3 * s, 0, Math.PI * 2); ctx.fill()
          ctx.restore()
        }
        // Enhanced glow trail
        ctx.globalAlpha = 0.4
        for (let i = 0; i < 8; i++) {
          ctx.fillStyle = i % 2 === 0 ? '#ffeb3b' : '#ff9800'
          ctx.beginPath(); ctx.arc(-i * 6 * s, 0, (5 - i * 0.6) * s, 0, Math.PI * 2); ctx.fill()
        }
      } else if (p.skillName === 'Piercing Shot') {
        // Piercing Shot: Single glowing green energy arrow
        ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = 3 * s
        ctx.beginPath(); ctx.moveTo(-20 * s, 0); ctx.lineTo(15 * s, 0); ctx.stroke()
        // Glowing arrowhead
        ctx.fillStyle = '#4caf50'
        ctx.beginPath(); ctx.moveTo(15 * s, 0); ctx.lineTo(8 * s, -5 * s); ctx.lineTo(8 * s, 5 * s); ctx.fill()
        // Energy trail
        ctx.globalAlpha = 0.5
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = i % 2 === 0 ? '#81c784' : '#a5d6a7'
          ctx.beginPath(); ctx.arc(-i * 7 * s, 0, (4 - i * 0.5) * s, 0, Math.PI * 2); ctx.fill()
        }
        // Wind streaks behind arrow
        ctx.globalAlpha = 0.3
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5 * s
        for (let i = 0; i < 4; i++) {
          ctx.beginPath()
          ctx.moveTo(-15 * s - i * 10 * s, 0)
          ctx.lineTo(-15 * s - i * 10 * s - 8 * s, 0)
          ctx.stroke()
        }
      } else {
        // Default skill arrow
        for (let i = -1; i <= 1; i++) {
          const offy = i * 8 * s + Math.sin(p.age * 0.3 + i) * 3 * s
          ctx.save(); ctx.translate(0, offy)
          ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 2.5 * s
          ctx.beginPath(); ctx.moveTo(-18 * s, 0); ctx.lineTo(12 * s, 0); ctx.stroke()
          ctx.fillStyle = '#b0bec5'
          ctx.beginPath(); ctx.moveTo(12 * s, 0); ctx.lineTo(6 * s, -4 * s); ctx.lineTo(6 * s, 4 * s); ctx.fill()
          ctx.fillStyle = '#f44336'
          ctx.beginPath(); ctx.moveTo(-16 * s, 0); ctx.lineTo(-18 * s, -3 * s); ctx.lineTo(-14 * s, 0); ctx.fill()
          ctx.beginPath(); ctx.moveTo(-16 * s, 0); ctx.lineTo(-18 * s, 3 * s); ctx.lineTo(-14 * s, 0); ctx.fill()
          ctx.restore()
        }
        ctx.globalAlpha = 0.25
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = i % 2 === 0 ? '#ffeb3b' : '#ff9800'
          ctx.beginPath(); ctx.arc(-i * 5 * s, 0, (4 - i * 0.5) * s, 0, Math.PI * 2); ctx.fill()
        }
      }
    } else {
      // Normal arrow with enhanced feather trail
      ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 2 * s
      ctx.beginPath(); ctx.moveTo(-14 * s, 0); ctx.lineTo(10 * s, 0); ctx.stroke()
      ctx.fillStyle = '#b0bec5'
      ctx.beginPath(); ctx.moveTo(10 * s, 0); ctx.lineTo(5 * s, -3 * s); ctx.lineTo(5 * s, 3 * s); ctx.fill()
      ctx.fillStyle = '#f44336'
      ctx.beginPath(); ctx.moveTo(-12 * s, 0); ctx.lineTo(-14 * s, -2.5 * s); ctx.lineTo(-10 * s, 0); ctx.fill()
      ctx.beginPath(); ctx.moveTo(-12 * s, 0); ctx.lineTo(-14 * s, 2.5 * s); ctx.lineTo(-10 * s, 0); ctx.fill()
      // Speed trail
      ctx.globalAlpha = 0.3; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5 * s
      ctx.beginPath(); ctx.moveTo(-22 * s, 0); ctx.lineTo(-14 * s, 0); ctx.stroke()
    }
    ctx.restore()
  } else if (hid === 'mage') {
    // ─── MAGE: Enhanced fireball / blizzard projectile ───
    const sz = p.isSkill ? 16 * s : 8 * s
    if (p.isSkill && p.skillName === 'Blizzard') {
      // Blizzard: Ice shard with snowflakes
      ctx.save(); ctx.translate(p.x, p.y)
      // Ice shard shape
      ctx.fillStyle = '#e3f2fd'
      ctx.beginPath()
      ctx.moveTo(0, -sz)
      ctx.lineTo(sz * 0.6, 0)
      ctx.lineTo(0, sz * 0.3)
      ctx.lineTo(-sz * 0.6, 0)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#90caf9'; ctx.lineWidth = 2 * s
      ctx.stroke()
      // Snowflakes swirling around it
      for (let i = 0; i < 6; i++) {
        const sa = i * Math.PI / 3 + p.age * 0.2
        const sx = Math.cos(sa) * sz * 1.5
        const sy = Math.sin(sa) * sz * 1.5
        ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(sx, sy, 2 * s, 0, Math.PI * 2); ctx.fill()
      }
      // Frost particles trail
      for (let i = 0; i < 6; i++) {
        const tx = -(p.tx - p.x) * i * 0.05 + Math.sin(p.age * 0.3 + i) * 3 * s
        const ty = -(p.ty - p.y) * i * 0.05 + Math.cos(p.age * 0.4 + i) * 2 * s
        ctx.globalAlpha = 0.4 - i * 0.06
        ctx.fillStyle = i % 2 === 0 ? '#bbdefb' : '#e3f2fd'
        ctx.beginPath(); ctx.arc(tx, ty, (sz * 0.4 - i * 0.3) * s, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.restore()
    } else {
      // Fireball with enhanced flame trail (normal or Fireball skill)
      // Outer glow
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 1.5)
      grad.addColorStop(0, 'rgba(255,120,0,0.6)')
      grad.addColorStop(0.5, 'rgba(255,60,0,0.2)')
      grad.addColorStop(1, 'rgba(255,0,0,0)')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(p.x, p.y, sz * 1.5, 0, Math.PI * 2); ctx.fill()
      // Fire core
      ctx.fillStyle = '#ff6600'
      ctx.beginPath(); ctx.arc(p.x, p.y, sz, 0, Math.PI * 2); ctx.fill()
      // Inner bright core
      ctx.fillStyle = '#ffcc00'
      ctx.beginPath(); ctx.arc(p.x, p.y, sz * 0.55, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.beginPath(); ctx.arc(p.x, p.y, sz * 0.25, 0, Math.PI * 2); ctx.fill()
      // Enhanced flame trail particles
      for (let i = 0; i < (p.isSkill ? 10 : 5); i++) {
        const tx = p.x - (p.tx - p.x) * i * 0.06 + Math.sin(p.age * 0.5 + i) * 4 * s
        const ty = p.y - (p.ty - p.y) * i * 0.06 + Math.cos(p.age * 0.4 + i) * 3 * s
        const ts = (sz * 0.6 - i * 0.5) * Math.max(0.3, 1 - i * 0.15)
        ctx.globalAlpha = 0.6 - i * 0.06
        ctx.fillStyle = i % 3 === 0 ? '#ff9800' : i % 3 === 1 ? '#ff5722' : '#ffeb3b'
        ctx.beginPath(); ctx.arc(tx, ty, ts, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1
      if (p.isSkill) {
        // Skill: spinning rune ring
        ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 2 * s
        ctx.beginPath(); ctx.arc(p.x, p.y, sz * 1.2, p.age * 0.2, p.age * 0.2 + Math.PI * 1.2); ctx.stroke()
        ctx.beginPath(); ctx.arc(p.x, p.y, sz * 1.2, p.age * 0.2 + Math.PI, p.age * 0.2 + Math.PI * 2.2); ctx.stroke()
      }
    }
  } else if (hid === 'necromancer') {
    // ─── NECROMANCER: Enhanced skull / soul drain projectile ───
    const sz = p.isSkill ? 18 * s : 9 * s
    if (p.isSkill && p.skillName === 'Soul Drain') {
      // Soul Drain: Purple soul beam with ghost face
      ctx.save(); ctx.translate(p.x, p.y)
      // Ghostly face/soul
      ctx.fillStyle = 'rgba(156,39,176,0.5)'
      ctx.beginPath(); ctx.arc(0, 0, sz, 0, Math.PI * 2); ctx.fill()
      // Ghost eyes
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(-sz * 0.3, -sz * 0.2, sz * 0.15, 0, Math.PI * 2)
      ctx.arc(sz * 0.3, -sz * 0.2, sz * 0.15, 0, Math.PI * 2)
      ctx.fill()
      // Energy trail
      for (let i = 0; i < 6; i++) {
        const tx = -(p.tx - p.x) * i * 0.05 + Math.sin(p.age * 0.3 + i * 1.5) * 4 * s
        const ty = -(p.ty - p.y) * i * 0.05 + Math.cos(p.age * 0.4 + i) * 3 * s
        ctx.globalAlpha = 0.4 - i * 0.05
        ctx.fillStyle = i % 2 === 0 ? '#e040fb' : '#9c27b0'
        ctx.beginPath(); ctx.arc(tx, ty, (sz * 0.4 - i * 0.3) * s, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.restore()
    } else {
      // Death Coil / normal: Enhanced green skull with ghost trail
      // Dark aura
      ctx.globalAlpha = 0.3
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 2)
      grad.addColorStop(0, 'rgba(0,230,118,0.5)')
      grad.addColorStop(0.5, 'rgba(0,100,50,0.2)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(p.x, p.y, sz * 2, 0, Math.PI * 2); ctx.fill()
      ctx.globalAlpha = 1
      // Skull shape
      ctx.fillStyle = '#1a1a1a'
      ctx.beginPath(); ctx.arc(p.x, p.y - sz * 0.1, sz * 0.8, 0, Math.PI * 2); ctx.fill()
      // Skull eye sockets
      ctx.fillStyle = '#00e676'
      ctx.beginPath(); ctx.arc(p.x - sz * 0.25, p.y - sz * 0.2, sz * 0.18, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(p.x + sz * 0.25, p.y - sz * 0.2, sz * 0.18, 0, Math.PI * 2); ctx.fill()
      // Glowing pupils
      ctx.fillStyle = '#fff'
      ctx.beginPath(); ctx.arc(p.x - sz * 0.25, p.y - sz * 0.2, sz * 0.08, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(p.x + sz * 0.25, p.y - sz * 0.2, sz * 0.08, 0, Math.PI * 2); ctx.fill()
      // Jaw
      ctx.fillStyle = '#1a1a1a'
      ctx.beginPath()
      ctx.moveTo(p.x - sz * 0.4, p.y + sz * 0.1)
      ctx.quadraticCurveTo(p.x, p.y + sz * 0.5, p.x + sz * 0.4, p.y + sz * 0.1)
      ctx.fill()
      // Teeth
      ctx.fillStyle = '#e0e0e0'
      for (let i = -2; i <= 2; i++) {
        ctx.fillRect(p.x + i * sz * 0.15 - sz * 0.04, p.y + sz * 0.05, sz * 0.08, sz * 0.12)
      }
      // Enhanced green spirit trail
      for (let i = 0; i < (p.isSkill ? 10 : 5); i++) {
        const tx = p.x - (p.tx - p.x) * i * 0.05 + Math.sin(p.age * 0.3 + i * 1.5) * 5 * s
        const ty = p.y - (p.ty - p.y) * i * 0.05 + Math.cos(p.age * 0.4 + i) * 4 * s
        ctx.globalAlpha = 0.5 - i * 0.05
        ctx.fillStyle = i % 2 === 0 ? '#00e676' : '#1b5e20'
        ctx.beginPath(); ctx.arc(tx, ty, (sz * 0.5 - i) * s, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1
      if (p.isSkill) {
        // Skill: orbiting green souls
        for (let i = 0; i < 3; i++) {
          const oa = p.age * 0.15 + i * Math.PI * 0.66
          const ox = p.x + Math.cos(oa) * sz * 1.3
          const oy = p.y + Math.sin(oa) * sz * 1.3
          ctx.fillStyle = '#00e676'
          ctx.beginPath(); ctx.arc(ox, oy, 3 * s, 0, Math.PI * 2); ctx.fill()
          ctx.fillStyle = '#fff'
          ctx.beginPath(); ctx.arc(ox, oy, 1.5 * s, 0, Math.PI * 2); ctx.fill()
        }
      }
    }
  } else {
    // Fallback: generic orb
    ctx.fillStyle = p.color
    ctx.beginPath(); ctx.arc(p.x, p.y, 5 * s, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(p.x, p.y, 2.5 * s, 0, Math.PI * 2); ctx.fill()
  }
}

function drawMobProjectile() {
  if (!state.mobProjectile) return
  const p = state.mobProjectile, s = getS()
  // Trail
  ctx.globalAlpha = 0.4
  ctx.fillStyle = p.color
  for (let i=0; i<5; i++) {
    const tx = p.x - (p.tx-p.x)*i*0.03, ty = p.y - (p.ty-p.y)*i*0.03
    ctx.beginPath(); ctx.arc(tx, ty, (4-i*0.5)*s, 0, Math.PI*2); ctx.fill()
  }
  ctx.globalAlpha = 1
  // Main projectile
  ctx.fillStyle = p.color
  ctx.beginPath(); ctx.arc(p.x, p.y, 5*s, 0, Math.PI*2); ctx.fill()
  // Glow
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.beginPath(); ctx.arc(p.x, p.y, 2.5*s, 0, Math.PI*2); ctx.fill()
  // Skill name
  ctx.font = `bold ${10*s}px sans-serif`; ctx.textAlign = 'center'
}

function drawRogueAfterimage() {
  if (!state.rogueAfterimage) return
  const ai = state.rogueAfterimage, s = getS()
  const alpha = Math.max(0, 0.5 - ai.age * 0.8) // fade out
  if (alpha <= 0) return
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.globalCompositeOperation = 'lighter'
  // Ghost clone of hero at original position
  const sz = 40 * s
  const gx = ai.x + sz / 2, gy = ai.y
  // Shadow
  ctx.fillStyle = 'rgba(100,0,150,0.3)'
  ctx.beginPath(); ctx.ellipse(gx, ai.y + sz * 0.55, sz * 0.35, sz * 0.06, 0, 0, Math.PI * 2); ctx.fill()
  // Body silhouette
  ctx.fillStyle = 'rgba(150,50,200,0.4)'
  ctx.beginPath(); ctx.roundRect(gx - sz * 0.2, ai.y - sz * 0.3, sz * 0.4, sz * 0.6, 4 * s); ctx.fill()
  // Head
  ctx.beginPath(); ctx.arc(gx, ai.y - sz * 0.4, sz * 0.15, 0, Math.PI * 2); ctx.fill()
  // Dash trail lines
  for (let i = 0; i < 5; i++) {
    const lx = ai.x + sz * 0.2 + i * 8 * s
    const la = 0.3 - i * 0.05
    ctx.strokeStyle = `rgba(180,80,255,${la})`
    ctx.lineWidth = 2 * s
    ctx.beginPath(); ctx.moveTo(lx, ai.y - sz * 0.1); ctx.lineTo(lx + 15 * s, ai.y - sz * 0.1 + Math.sin(i) * 3 * s); ctx.stroke()
  }
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  ctx.restore()
}

function drawMeleeSkillFx() {
  if (!state.meleeSkillFx) return
  const fx = state.meleeSkillFx, s = getS()
  const t = fx.age, maxT = 0.8 // duration in seconds
  if (t > maxT) { state.meleeSkillFx = null; return }
  const p = t / maxT // 0→1 progress
  const hid = fx.heroId
  const skillName = fx.skillName
  const cx = fx.x, cy = fx.y

  // Screen flash at start (brief white overlay)
  if (p < 0.15) {
    ctx.globalAlpha = (0.15 - p) * 5 * 0.2
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  if (hid === 'warrior') {
    if (skillName === 'Whirlwind') {
      // ─── WHIRLWIND: Massive golden tornado with rotating slash arcs ───
      const radius = 55 * s * (0.5 + p * 1.2)
      // 12 rotating slash arcs (gold + orange + white alternating)
      for (let i = 0; i < 12; i++) {
        const a = t * 25 + i * Math.PI / 6
        const aLen = Math.PI * 0.5 * (1 - p * 0.4)
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(a)
        // Slash arc
        ctx.strokeStyle = i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#ff8c00' : '#fff'
        ctx.lineWidth = (6 - p * 3) * s
        ctx.globalAlpha = (1 - p) * 0.95
        ctx.beginPath(); ctx.arc(0, 0, radius, -aLen / 2, aLen / 2); ctx.stroke()
        // Wide glow
        ctx.strokeStyle = 'rgba(255,215,0,0.3)'
        ctx.lineWidth = (14 - p * 7) * s
        ctx.beginPath(); ctx.arc(0, 0, radius, -aLen / 2, aLen / 2); ctx.stroke()
        ctx.restore()
      }
      // Ground cracks radiating outward (6 dark brown lines)
      for (let i = 0; i < 6; i++) {
        const ca = i * Math.PI / 3 + 0.3
        const cLen = 35 * s * p
        ctx.strokeStyle = `rgba(101,67,33,${(1 - p) * 0.7})`
        ctx.lineWidth = 3 * s
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(ca) * 12 * s, cy + 6 * s)
        ctx.lineTo(cx + Math.cos(ca) * (12 * s + cLen), cy + 6 * s + Math.sin(ca) * cLen * 0.4)
        ctx.stroke()
      }
      // Dust cloud particles swirling
      for (let i = 0; i < 10; i++) {
        const da = i * Math.PI * 2 / 10 + t * 8
        const dd = radius * 0.8 + Math.sin(i * 2.3) * 15 * s
        ctx.fillStyle = `rgba(189,183,107,${(1 - p) * 0.5})`
        ctx.beginPath(); ctx.arc(cx + Math.cos(da) * dd, cy + Math.sin(da) * dd * 0.6, (4 - p * 2) * s, 0, Math.PI * 2); ctx.fill()
      }
      // Wind streaks (curved white lines) spiraling outward
      for (let i = 0; i < 8; i++) {
        const wa = i * Math.PI / 4 + t * 6
        const wLen = 25 * s * p
        ctx.strokeStyle = `rgba(255,255,255,${(1 - p) * 0.6})`
        ctx.lineWidth = 2 * s
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(wa) * 15 * s, cy + Math.sin(wa) * 15 * s)
        ctx.quadraticCurveTo(cx + Math.cos(wa + 0.3) * 30 * s, cy + Math.sin(wa + 0.3) * 30 * s, cx + Math.cos(wa + 0.6) * (15 * s + wLen), cy + Math.sin(wa + 0.6) * (15 * s + wLen))
        ctx.stroke()
      }
      // Center: bright gold explosion flash
      const flashR = 45 * s * (1 - p * 0.5)
      const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR)
      flashGrad.addColorStop(0, 'rgba(255,220,50,0.9)')
      flashGrad.addColorStop(0.5, 'rgba(255,165,0,0.4)')
      flashGrad.addColorStop(1, 'rgba(255,100,0,0)')
      ctx.globalAlpha = (1 - p) * 0.8
      ctx.fillStyle = flashGrad
      ctx.beginPath(); ctx.arc(cx, cy, flashR, 0, Math.PI * 2); ctx.fill()
    } else if (skillName === 'Cleave') {
      // ─── CLEAVE: Single massive overhead diagonal slash ───
      const slashLen = 70 * s * (0.5 + p * 0.8)
      // Thick glowing blue-white energy blade trail
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.7) // diagonal angle
      // Blade trail glow
      ctx.strokeStyle = 'rgba(100,180,255,0.4)'
      ctx.lineWidth = 18 * s
      ctx.globalAlpha = (1 - p) * 0.7
      ctx.beginPath(); ctx.moveTo(-slashLen, -slashLen * 0.2); ctx.lineTo(slashLen, slashLen * 0.2); ctx.stroke()
      // Main blade
      ctx.strokeStyle = '#e3f2fd'
      ctx.lineWidth = 6 * s
      ctx.globalAlpha = (1 - p) * 0.95
      ctx.beginPath(); ctx.moveTo(-slashLen, -slashLen * 0.2); ctx.lineTo(slashLen, slashLen * 0.2); ctx.stroke()
      ctx.restore()
      // Ground splits open (dark crack line running diagonally)
      ctx.save(); ctx.translate(cx, cy + 10 * s); ctx.rotate(0.4)
      ctx.strokeStyle = `rgba(62,39,35,${(1 - p) * 0.8})`
      ctx.lineWidth = 4 * s
      ctx.beginPath(); ctx.moveTo(-40 * s, 0); ctx.lineTo(40 * s, 0); ctx.stroke()
      ctx.restore()
      // Sparks flying from impact point (yellow/white particles)
      for (let i = 0; i < 12; i++) {
        const sa = i * Math.PI / 6 + Math.random() * 0.3
        const sd = (15 + p * 35) * s
        ctx.fillStyle = i % 3 === 0 ? '#ffeb3b' : i % 3 === 1 ? '#fff' : '#ff9800'
        ctx.globalAlpha = (1 - p) * 0.8
        ctx.beginPath(); ctx.arc(cx + Math.cos(sa) * sd, cy + Math.sin(sa) * sd * 0.7, (2.5 - p * 1.5) * s, 0, Math.PI * 2); ctx.fill()
      }
      // Impact shockwave (expanding circle)
      const shockR = (20 + p * 50) * s
      ctx.strokeStyle = `rgba(255,255,255,${(1 - p) * 0.6})`
      ctx.lineWidth = 3 * s
      ctx.beginPath(); ctx.arc(cx, cy, shockR, 0, Math.PI * 2); ctx.stroke()
      // Debris chunks flying upward
      for (let i = 0; i < 6; i++) {
        const dx = (Math.sin(i * 2.5) * 30) * s
        const dy = (-p * 40 - i * 5) * s
        ctx.fillStyle = '#5d4037'
        ctx.globalAlpha = (1 - p) * 0.7
        ctx.fillRect(cx + dx, cy + dy, 4 * s, 3 * s)
      }
    }
  } else if (hid === 'rogue') {
    if (skillName === 'Backstab') {
      // ─── BACKSTAB: Teleport arrival + giant red X slash ───
      // Teleport arrival: purple vortex burst
      if (p < 0.3) {
        ctx.globalAlpha = (0.3 - p) * 3.3
        const burstR = 35 * s * (1 - p / 0.3)
        ctx.strokeStyle = '#b388ff'; ctx.lineWidth = 4 * s
        ctx.beginPath(); ctx.arc(cx, cy, burstR, 0, Math.PI * 2); ctx.stroke()
        ctx.strokeStyle = '#7c4dff'; ctx.lineWidth = 2 * s
        ctx.beginPath(); ctx.arc(cx, cy, burstR * 0.7, 0, Math.PI * 2); ctx.stroke()
        ctx.strokeStyle = '#e040fb'; ctx.lineWidth = 1 * s
        ctx.beginPath(); ctx.arc(cx, cy, burstR * 0.4, 0, Math.PI * 2); ctx.stroke()
      }
      // Giant red X slash (cross-cut)
      const slashSize = 60 * s * (0.5 + p * 0.7)
      ctx.strokeStyle = '#ff1744'; ctx.lineWidth = (5 - p * 3) * s
      ctx.globalAlpha = (1 - p) * 0.95
      ctx.beginPath(); ctx.moveTo(-slashSize, -slashSize); ctx.lineTo(slashSize, slashSize); ctx.stroke()
      ctx.strokeStyle = '#d50000'; ctx.lineWidth = (4 - p * 2.5) * s
      ctx.beginPath(); ctx.moveTo(slashSize, -slashSize); ctx.lineTo(-slashSize, slashSize); ctx.stroke()
      // Slash glow
      ctx.strokeStyle = 'rgba(255,0,50,0.3)'; ctx.lineWidth = 12 * s
      ctx.beginPath(); ctx.moveTo(-slashSize, -slashSize); ctx.lineTo(slashSize, slashSize); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(slashSize, -slashSize); ctx.lineTo(-slashSize, slashSize); ctx.stroke()
      // Blood splatter particles (7 red dots flying outward)
      for (let i = 0; i < 7; i++) {
        const bx = (Math.sin(i * 2.3) * 30 + p * 25) * s
        const by = (Math.cos(i * 1.7) * 25 + p * 30 - 10) * s
        ctx.fillStyle = '#ff1744'
        ctx.globalAlpha = (1 - p) * 0.85
        ctx.beginPath(); ctx.arc(cx + bx, cy + by, (3 - p * 2) * s, 0, Math.PI * 2); ctx.fill()
      }
      // Shadow silhouette fading
      ctx.fillStyle = `rgba(20,0,40,${(1 - p) * 0.4})`
      ctx.beginPath(); ctx.ellipse(cx, cy, 20 * s * (1 + p), 35 * s * (1 + p), 0, 0, Math.PI * 2); ctx.fill()
      // Dark energy wisps trailing
      for (let i = 0; i < 5; i++) {
        const wa = i * Math.PI * 2 / 5 + t * 3
        const wd = 20 * s + p * 20 * s
        ctx.strokeStyle = `rgba(100,0,150,${(1 - p) * 0.5})`
        ctx.lineWidth = 2 * s
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(wa) * wd * 0.5, cy + Math.sin(wa) * wd * 0.3)
        ctx.quadraticCurveTo(cx + Math.cos(wa + 0.5) * wd, cy + Math.sin(wa + 0.5) * wd * 0.5, cx + Math.cos(wa + 1) * wd * 1.2, cy + Math.sin(wa + 1) * wd * 0.7)
        ctx.stroke()
      }
      // Brief screen darken then flash back
      if (p < 0.2) {
        ctx.globalAlpha = (0.2 - p) * 2 * 0.3
        ctx.fillStyle = '#1a0030'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    } else if (skillName === 'Fan of Knives') {
      // ─── FAN OF KNIVES: 12 spinning shuriken in expanding ring ───
      // Center: dark energy vortex pulling inward
      const vortexR = 25 * s * (1 - p * 0.6)
      const vortexGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, vortexR)
      vortexGrad.addColorStop(0, 'rgba(60,0,80,0.6)')
      vortexGrad.addColorStop(0.5, 'rgba(100,0,120,0.3)')
      vortexGrad.addColorStop(1, 'rgba(50,0,60,0)')
      ctx.globalAlpha = (1 - p) * 0.7
      ctx.fillStyle = vortexGrad
      ctx.beginPath(); ctx.arc(cx, cy, vortexR, 0, Math.PI * 2); ctx.fill()
      // 12 spinning shuriken/knives in expanding ring
      for (let i = 0; i < 12; i++) {
        const ka = i * Math.PI / 6 + t * 12
        const kd = (15 + p * 45) * s
        const kx = cx + Math.cos(ka) * kd
        const ky = cy + Math.sin(ka) * kd * 0.8
        // Knife as triangle
        ctx.save(); ctx.translate(kx, ky); ctx.rotate(ka + Math.PI)
        ctx.fillStyle = i % 2 === 0 ? '#ff4444' : '#9c27b0'
        ctx.globalAlpha = (1 - p) * 0.9
        ctx.beginPath()
        ctx.moveTo(0, -6 * s)
        ctx.lineTo(4 * s, 4 * s)
        ctx.lineTo(-4 * s, 4 * s)
        ctx.fill()
        ctx.restore()
        // Motion trail
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(255,68,68,0.4)' : 'rgba(156,39,176,0.4)'
        ctx.lineWidth = 1.5 * s
        ctx.beginPath()
        ctx.moveTo(kx - Math.cos(ka) * 15 * s, ky - Math.sin(ka) * 15 * s)
        ctx.lineTo(kx, ky)
        ctx.stroke()
      }
      // Knife trails create spiral pattern
      for (let i = 0; i < 8; i++) {
        const sa = i * Math.PI / 4 + t * 8
        const sd = (10 + p * 40) * s
        ctx.strokeStyle = `rgba(255,68,68,${(1 - p) * 0.3})`
        ctx.lineWidth = 1 * s
        ctx.beginPath()
        ctx.arc(cx + Math.cos(sa) * sd * 0.5, cy + Math.sin(sa) * sd * 0.4, sd * 0.3, sa, sa + Math.PI / 2)
        ctx.stroke()
      }
      // Impact: multiple small slash marks
      for (let i = 0; i < 6; i++) {
        const sx = (Math.sin(i * 1.8) * 35) * s
        const sy = (Math.cos(i * 2.2) * 25) * s
        ctx.strokeStyle = '#ff8a80'
        ctx.lineWidth = 2 * s
        ctx.globalAlpha = (1 - p) * 0.7
        ctx.beginPath()
        ctx.moveTo(cx + sx - 5 * s, cy + sy - 5 * s)
        ctx.lineTo(cx + sx + 5 * s, cy + sy + 5 * s)
        ctx.stroke()
      }
    }
  } else if (hid === 'paladin') {
    if (skillName === 'Holy Smite') {
      // ─── HOLY SMITE: Divine light beam from sky + giant cross ───
      // Divine light beam from sky (thick golden column)
      const beamGrad = ctx.createLinearGradient(cx, cy - 180 * s, cx, cy + 30 * s)
      beamGrad.addColorStop(0, 'rgba(255,215,0,0)')
      beamGrad.addColorStop(0.2, 'rgba(255,215,0,0.8)')
      beamGrad.addColorStop(0.6, 'rgba(255,248,200,0.95)')
      beamGrad.addColorStop(1, 'rgba(255,200,0,0.4)')
      ctx.globalAlpha = (1 - p) * 0.7
      ctx.fillStyle = beamGrad
      const bw = 30 * s * (1 + p * 0.5)
      ctx.beginPath()
      ctx.moveTo(cx - bw * 0.3, cy - 180 * s)
      ctx.lineTo(cx + bw * 0.3, cy - 180 * s)
      ctx.lineTo(cx + bw, cy + 30 * s)
      ctx.lineTo(cx - bw, cy + 30 * s)
      ctx.fill()
      // Giant golden cross at impact point
      const crossS = 40 * s * (0.4 + p * 0.9)
      ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 5 * s
      ctx.globalAlpha = (1 - p) * 0.95
      ctx.beginPath(); ctx.moveTo(cx - crossS, cy); ctx.lineTo(cx + crossS, cy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx, cy - crossS); ctx.lineTo(cx, cy + crossS); ctx.stroke()
      // Cross glow
      ctx.strokeStyle = 'rgba(255,248,220,0.4)'; ctx.lineWidth = 12 * s
      ctx.beginPath(); ctx.moveTo(cx - crossS, cy); ctx.lineTo(cx + crossS, cy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx, cy - crossS); ctx.lineTo(cx, cy + crossS); ctx.stroke()
      // 3 expanding shockwave rings on ground
      for (let i = 0; i < 3; i++) {
        const ringR = (25 + p * 70 + i * 18) * s
        ctx.globalAlpha = (1 - p) * 0.5 * (1 - i * 0.15)
        ctx.strokeStyle = i === 0 ? '#ffd700' : i === 1 ? '#fff8e1' : '#f1c40f'
        ctx.lineWidth = (3.5 - i) * s
        ctx.beginPath(); ctx.ellipse(cx, cy + 12 * s, ringR, ringR * 0.25, 0, 0, Math.PI * 2); ctx.stroke()
      }
      // 10+ holy sparkles (4-pointed stars) orbiting
      for (let i = 0; i < 12; i++) {
        const sa = i * Math.PI / 6 + t * 5
        const sd = 30 * s + p * 25 * s
        const sx = cx + Math.cos(sa) * sd
        const sy = cy + Math.sin(sa) * sd * 0.6
        ctx.fillStyle = i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#fff' : '#ffecb3'
        ctx.globalAlpha = (1 - p) * 0.85
        ctx.beginPath()
        ctx.moveTo(sx, sy - 5 * s); ctx.lineTo(sx + 2.5 * s, sy)
        ctx.lineTo(sx, sy + 5 * s); ctx.lineTo(sx - 2.5 * s, sy)
        ctx.fill()
      }
      // Wing-shaped light burst (angel wings briefly appear)
      if (p < 0.5) {
        ctx.globalAlpha = (0.5 - p) * 2 * 0.4
        ctx.fillStyle = '#fff8e1'
        // Left wing
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.quadraticCurveTo(cx - 50 * s, cy - 40 * s, cx - 70 * s, cy - 20 * s)
        ctx.quadraticCurveTo(cx - 40 * s, cy - 10 * s, cx, cy)
        ctx.fill()
        // Right wing
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.quadraticCurveTo(cx + 50 * s, cy - 40 * s, cx + 70 * s, cy - 20 * s)
        ctx.quadraticCurveTo(cx + 40 * s, cy - 10 * s, cx, cy)
        ctx.fill()
      }
      // Dust particles rising from ground
      for (let i = 0; i < 6; i++) {
        const dx = (Math.sin(i * 3.1) * 35 + p * 25) * s
        const dy = (12 - p * 20) * s
        ctx.fillStyle = `rgba(189,183,107,${(1 - p) * 0.45})`
        ctx.beginPath(); ctx.arc(cx + dx, cy + dy, (3.5 - p * 2.5) * s, 0, Math.PI * 2); ctx.fill()
      }
    } else if (skillName === 'Shield Bash') {
      // ─── SHIELD BASH: Golden shield slamming forward + stun waves ───
      // Golden shield icon slamming forward
      const shieldX = cx + (1 - p) * 30 * s
      ctx.save(); ctx.translate(shieldX, cy - 10 * s); ctx.rotate((1 - p) * -0.5)
      // Shield body
      ctx.fillStyle = '#ffd700'
      ctx.beginPath()
      ctx.moveTo(0, -20 * s)
      ctx.lineTo(18 * s, -10 * s)
      ctx.lineTo(18 * s, 10 * s)
      ctx.lineTo(0, 22 * s)
      ctx.lineTo(-18 * s, 10 * s)
      ctx.lineTo(-18 * s, -10 * s)
      ctx.closePath()
      ctx.fill()
      // Shield border
      ctx.strokeStyle = '#ff8f00'; ctx.lineWidth = 3 * s
      ctx.stroke()
      // Shield cross emblem
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2 * s
      ctx.beginPath(); ctx.moveTo(-10 * s, 0); ctx.lineTo(10 * s, 0); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, -14 * s); ctx.lineTo(0, 14 * s); ctx.stroke()
      ctx.restore()
      // Concentric stun waves (3 golden rings expanding)
      for (let i = 0; i < 3; i++) {
        const ringR = (15 + p * 55 + i * 15) * s
        ctx.globalAlpha = (1 - p) * 0.5 * (1 - i * 0.15)
        ctx.strokeStyle = '#ffd700'
        ctx.lineWidth = (3 - i) * s
        ctx.beginPath(); ctx.arc(cx + 20 * s, cy, ringR, 0, Math.PI * 2); ctx.stroke()
      }
      // Impact flash (bright white/gold burst)
      const flashR = 30 * s * (1 - p * 0.6)
      const flashGrad = ctx.createRadialGradient(cx + 20 * s, cy, 0, cx + 20 * s, cy, flashR)
      flashGrad.addColorStop(0, 'rgba(255,255,255,0.8)')
      flashGrad.addColorStop(0.5, 'rgba(255,215,0,0.4)')
      flashGrad.addColorStop(1, 'rgba(255,215,0,0)')
      ctx.globalAlpha = (1 - p) * 0.7
      ctx.fillStyle = flashGrad
      ctx.beginPath(); ctx.arc(cx + 20 * s, cy, flashR, 0, Math.PI * 2); ctx.fill()
      // Stars circling above (stun effect, 5 spinning stars)
      for (let i = 0; i < 5; i++) {
        const sa = i * Math.PI * 2 / 5 + t * 6
        const sr = 25 * s + Math.sin(t * 8) * 5 * s
        const sx = cx + Math.cos(sa) * sr
        const sy = cy - 35 * s + Math.sin(sa) * sr * 0.3
        ctx.fillStyle = '#ffd700'
        ctx.globalAlpha = (1 - p) * 0.8
        ctx.beginPath()
        ctx.moveTo(sx, sy - 4 * s); ctx.lineTo(sx + 1.5 * s, sy - 1 * s)
        ctx.lineTo(sx + 4 * s, sy); ctx.lineTo(sx + 1.5 * s, sy + 1 * s)
        ctx.lineTo(sx, sy + 4 * s); ctx.lineTo(sx - 1.5 * s, sy + 1 * s)
        ctx.lineTo(sx - 4 * s, sy); ctx.lineTo(sx - 1.5 * s, sy - 1 * s)
        ctx.closePath()
        ctx.fill()
      }
      // Ground crack from impact
      ctx.strokeStyle = `rgba(121,85,72,${(1 - p) * 0.7})`
      ctx.lineWidth = 3 * s
      ctx.beginPath()
      ctx.moveTo(cx + 10 * s, cy + 8 * s)
      ctx.lineTo(cx + 40 * s, cy + 8 * s + Math.sin(0.8) * 15 * s)
      ctx.stroke()
      // Shield trail (golden arc)
      ctx.strokeStyle = 'rgba(255,215,0,0.4)'
      ctx.lineWidth = 4 * s
      ctx.beginPath()
      ctx.arc(cx - 20 * s, cy, 40 * s, -0.5, 0.5)
      ctx.stroke()
    }
  } else if (hid === 'mage') {
    if (skillName === 'Fireball') {
      // ─── FIREBALL: Large fireball explosion with flames ───
      const explosionR = (30 + p * 50) * s
      // Outer: red fire
      ctx.globalAlpha = (1 - p) * 0.6
      const outerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, explosionR)
      outerGrad.addColorStop(0, 'rgba(255,87,34,0.7)')
      outerGrad.addColorStop(0.5, 'rgba(255,152,0,0.3)')
      outerGrad.addColorStop(1, 'rgba(255,0,0,0)')
      ctx.fillStyle = outerGrad
      ctx.beginPath(); ctx.arc(cx, cy, explosionR, 0, Math.PI * 2); ctx.fill()
      // Middle: orange
      ctx.fillStyle = 'rgba(255,152,0,0.5)'
      ctx.beginPath(); ctx.arc(cx, cy, explosionR * 0.6, 0, Math.PI * 2); ctx.fill()
      // Inner: white-hot core
      ctx.fillStyle = 'rgba(255,255,200,0.8)'
      ctx.beginPath(); ctx.arc(cx, cy, explosionR * 0.3, 0, Math.PI * 2); ctx.fill()
      // Embers flying upward
      for (let i = 0; i < 10; i++) {
        const ex = (Math.sin(i * 2.1) * 40) * s
        const ey = (-p * 50 - i * 8) * s
        ctx.fillStyle = i % 2 === 0 ? '#ff9800' : '#ffeb3b'
        ctx.globalAlpha = (1 - p) * 0.8
        ctx.beginPath(); ctx.arc(cx + ex, cy + ey, (3 - p * 2) * s, 0, Math.PI * 2); ctx.fill()
      }
      // Fire particles trailing
      for (let i = 0; i < 8; i++) {
        const fx = cx + Math.sin(i * 1.3 + t * 5) * explosionR * 0.5
        const fy = cy + Math.cos(i * 1.7 + t * 4) * explosionR * 0.4
        ctx.fillStyle = i % 3 === 0 ? '#ff5722' : i % 3 === 1 ? '#ff9800' : '#ffcc00'
        ctx.globalAlpha = (1 - p) * 0.5
        ctx.beginPath(); ctx.arc(fx, fy, (4 - p * 2) * s, 0, Math.PI * 2); ctx.fill()
      }
      // Screen shake on impact (simulated)
      if (p < 0.3) {
        HERO_SHAKE_VAR_X = (Math.random() - 0.5) * 8
        HERO_SHAKE_VAR_Y = (Math.random() - 0.5) * 6
      }
    } else if (skillName === 'Blizzard') {
      // ─── BLIZZARD: Ice explosion with snowflakes ───
      const explosionR = (25 + p * 45) * s
      // Ice explosion (blue/white expanding circle)
      ctx.globalAlpha = (1 - p) * 0.7
      const iceGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, explosionR)
      iceGrad.addColorStop(0, 'rgba(227,242,253,0.8)')
      iceGrad.addColorStop(0.5, 'rgba(100,181,246,0.4)')
      iceGrad.addColorStop(1, 'rgba(66,165,245,0)')
      ctx.fillStyle = iceGrad
      ctx.beginPath(); ctx.arc(cx, cy, explosionR, 0, Math.PI * 2); ctx.fill()
      // Snowflakes swirling
      for (let i = 0; i < 8; i++) {
        const sa = i * Math.PI / 4 + t * 4
        const sd = 20 * s + p * 30 * s
        const sx = cx + Math.cos(sa) * sd
        const sy = cy + Math.sin(sa) * sd * 0.7
        ctx.fillStyle = '#fff'
        ctx.globalAlpha = (1 - p) * 0.8
        // 6-pointed snowflake
        ctx.beginPath()
        for (let j = 0; j < 6; j++) {
          const ja = j * Math.PI / 3
          ctx.moveTo(sx, sy)
          ctx.lineTo(sx + Math.cos(ja) * 4 * s, sy + Math.sin(ja) * 4 * s)
        }
        ctx.stroke()
      }
      // Ice crystals forming on ground
      for (let i = 0; i < 6; i++) {
        const ix = (Math.sin(i * 1.5) * 40) * s
        const iy = (Math.cos(i * 2.1) * 15 + 10) * s
        ctx.strokeStyle = '#e3f2fd'
        ctx.lineWidth = 2 * s
        ctx.globalAlpha = (1 - p) * 0.6
        ctx.beginPath()
        ctx.moveTo(cx + ix, cy + iy)
        ctx.lineTo(cx + ix + 8 * s, cy + iy - 12 * s)
        ctx.lineTo(cx + ix + 16 * s, cy + iy)
        ctx.stroke()
      }
      // Brief freeze visual (blue tint over area)
      if (p < 0.3) {
        ctx.globalAlpha = (0.3 - p) * 2 * 0.15
        ctx.fillStyle = '#bbdefb'
        ctx.fillRect(cx - 60 * s, cy - 40 * s, 120 * s, 80 * s)
      }
    }
  } else if (hid === 'necromancer') {
    if (skillName === 'Death Coil') {
      // ─── DEATH COIL: Green skull explosion + skeletal hands ───
      const explosionR = (25 + p * 40) * s
      // Skull explodes into green gas
      ctx.globalAlpha = (1 - p) * 0.6
      const gasGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, explosionR)
      gasGrad.addColorStop(0, 'rgba(0,230,118,0.7)')
      gasGrad.addColorStop(0.5, 'rgba(0,100,50,0.3)')
      gasGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = gasGrad
      ctx.beginPath(); ctx.arc(cx, cy, explosionR, 0, Math.PI * 2); ctx.fill()
      // 3 ghostly green wisps orbiting
      for (let i = 0; i < 3; i++) {
        const wa = i * Math.PI * 2 / 3 + t * 5
        const wd = 20 * s + p * 25 * s
        const wx = cx + Math.cos(wa) * wd
        const wy = cy + Math.sin(wa) * wd * 0.6
        ctx.fillStyle = '#00e676'
        ctx.globalAlpha = (1 - p) * 0.7
        ctx.beginPath(); ctx.arc(wx, wy, 5 * s, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(wx, wy, 2.5 * s, 0, Math.PI * 2); ctx.fill()
      }
      // Skeletal hands reaching up from ground (brief)
      if (p < 0.5) {
        ctx.globalAlpha = (0.5 - p) * 2 * 0.5
        ctx.strokeStyle = '#4caf50'
        ctx.lineWidth = 2 * s
        for (let i = 0; i < 3; i++) {
          const hx = (Math.sin(i * 2.1) * 30) * s
          const hy = (10 + i * 8) * s
          ctx.beginPath()
          ctx.moveTo(cx + hx, cy + hy)
          ctx.lineTo(cx + hx, cy + hy - 15 * s)
          ctx.lineTo(cx + hx + 5 * s, cy + hy - 20 * s)
          ctx.moveTo(cx + hx, cy + hy - 15 * s)
          ctx.lineTo(cx + hx - 5 * s, cy + hy - 20 * s)
          ctx.stroke()
        }
      }
      // Toxic drip particles
      for (let i = 0; i < 6; i++) {
        const dx = (Math.sin(i * 1.8) * 35) * s
        const dy = (p * 40 + i * 6) * s
        ctx.fillStyle = '#7b1fa2'
        ctx.globalAlpha = (1 - p) * 0.6
        ctx.beginPath(); ctx.arc(cx + dx, cy + dy, (2.5 - p * 1.5) * s, 0, Math.PI * 2); ctx.fill()
      }
    } else if (skillName === 'Soul Drain') {
      // ─── SOUL DRAIN: Purple beam connecting hero to target + ghost face ───
      const heroX = (state.heroX || canvas.width * 0.3) + 18 * s
      // Purple energy beam connecting hero to target
      ctx.strokeStyle = '#9c27b0'
      ctx.lineWidth = 4 * s
      ctx.globalAlpha = (1 - p) * 0.8
      ctx.beginPath()
      ctx.moveTo(heroX, cy)
      ctx.lineTo(cx, cy)
      ctx.stroke()
      // Beam glow
      ctx.strokeStyle = 'rgba(233,30,99,0.3)'
      ctx.lineWidth = 12 * s
      ctx.beginPath()
      ctx.moveTo(heroX, cy)
      ctx.lineTo(cx, cy)
      ctx.stroke()
      // Ghostly face/soul being pulled from target toward hero
      const soulX = cx + (heroX - cx) * p * 0.8
      const soulY = cy - 10 * s + Math.sin(t * 6) * 5 * s
      // Soul body
      ctx.fillStyle = 'rgba(156,39,176,0.5)'
      ctx.globalAlpha = (1 - p) * 0.6
      ctx.beginPath()
      ctx.arc(soulX, soulY, 12 * s, 0, Math.PI * 2)
      ctx.fill()
      // Ghost eyes
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(soulX - 4 * s, soulY - 3 * s, 2 * s, 0, Math.PI * 2)
      ctx.arc(soulX + 4 * s, soulY - 3 * s, 2 * s, 0, Math.PI * 2)
      ctx.fill()
      // 5 purple soul fragments flowing along beam
      for (let i = 0; i < 5; i++) {
        const fx = cx + (heroX - cx) * (i / 5 + t * 0.5) % 1
        const fy = cy + Math.sin(i * 1.3 + t * 4) * 8 * s
        ctx.fillStyle = '#e040fb'
        ctx.globalAlpha = (1 - p) * 0.7
        ctx.beginPath(); ctx.arc(fx, fy, 3 * s, 0, Math.PI * 2); ctx.fill()
      }
      // Dark energy vortex at target
      const vortexR = 20 * s * (1 - p * 0.5)
      const vortexGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, vortexR)
      vortexGrad.addColorStop(0, 'rgba(100,0,150,0.6)')
      vortexGrad.addColorStop(1, 'rgba(50,0,80,0)')
      ctx.globalAlpha = (1 - p) * 0.5
      ctx.fillStyle = vortexGrad
      ctx.beginPath(); ctx.arc(cx, cy, vortexR, 0, Math.PI * 2); ctx.fill()
      // Health absorption visual (green numbers flowing back)
      ctx.fillStyle = '#4caf50'
      ctx.font = `bold ${12 * s}px sans-serif`
      ctx.globalAlpha = (1 - p) * 0.8
      for (let i = 0; i < 3; i++) {
        const numX = cx + (heroX - cx) * (i / 3 + t * 0.3) % 1
        const numY = cy - 20 * s + Math.sin(i * 2) * 10 * s
        ctx.fillText('+HP', numX, numY)
      }
      // Beam pulses with energy
      if (p < 0.7) {
        ctx.strokeStyle = `rgba(255,255,255,${Math.sin(t * 20) * 0.3 + 0.3})`
        ctx.lineWidth = 2 * s
        ctx.beginPath()
        ctx.moveTo(heroX, cy)
        ctx.lineTo(cx, cy)
        ctx.stroke()
      }
    }
  }
  ctx.globalAlpha = 1
}

function draw() { 
  ctx.save()
  ctx.translate(HERO_SHAKE_VAR_X, HERO_SHAKE_VAR_Y)
  ctx.clearRect(-10,-10,canvas.width+20,canvas.height+20)
  if (!state.started) { ctx.restore(); return }
  drawBackground(); drawRogueAfterimage(); drawPlayer(); drawMob(); drawMobProjectile(); drawHeroProjectile(); drawMeleeSkillFx(); updateHUD(); updateSkillBtn()
  // Particles
  for (const p of state.particles) {
    ctx.globalAlpha = Math.min(1, p.life); ctx.fillStyle = p.color
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill()
    ctx.globalAlpha = 1
  }
  // ── BOSS WARNING TEXT ──
  if (state.bossWarning && state.bossWarningTimer > 0) {
    const s = getS()
    const pulse = 0.7 + Math.sin(time * 8) * 0.3
    ctx.globalAlpha = pulse
    ctx.font = `bold ${28*s}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ff0000'
    ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 20
    ctx.fillText('⚠️ BOSS INCOMING!', canvas.width/2, canvas.height * 0.2)
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }
  // ── BOSS HP BAR ──
  if (state.isBoss && state.mobs.length > 0 && state.mobs[0].mob.boss) {
    const s = getS(), bm = state.mobs[0]
    const barW = canvas.width * 0.6, barH = 18 * s
    const barX = (canvas.width - barW) / 2, barY = 20 * s
    const hpPct = Math.max(0, bm.hp / bm.maxHp)
    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.8)'
    ctx.beginPath(); ctx.roundRect(barX - 4, barY - 4, barW + 8, barH + 12 + 14*s, 6); ctx.fill()
    // Bar bg
    ctx.fillStyle = '#333'
    ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 4); ctx.fill()
    // Bar fill
    const grad = ctx.createLinearGradient(barX, barY, barX, barY + barH)
    grad.addColorStop(0, '#ff4444'); grad.addColorStop(0.5, '#cc0000'); grad.addColorStop(1, '#880000')
    ctx.fillStyle = grad
    ctx.beginPath(); ctx.roundRect(barX, barY, barW * hpPct, barH, 4); ctx.fill()
    // Bar shine
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.beginPath(); ctx.roundRect(barX, barY, barW * hpPct, barH/2, 4); ctx.fill()
    // Boss name
    ctx.font = `bold ${11*s}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffd700'
    ctx.fillText(bm.mob.name, canvas.width/2, barY + barH + 12*s)
  }
  // ── NIGHTMARE RED VIGNETTE ──
  if (state.nightmare) {
    ctx.fillStyle = 'rgba(80,0,0,0.2)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // Nightmare label
    const s = getS()
    ctx.font = `bold ${10*s}px sans-serif`
    ctx.textAlign = 'left'
    ctx.fillStyle = '#f44336'
    ctx.globalAlpha = 0.5 + Math.sin(time * 3) * 0.3
    ctx.fillText('💀 NIGHTMARE', 8, 14*s)
    ctx.globalAlpha = 1
  }
  ctx.restore()
}

// ─── GAME LOOP ─────────────────────────────────────────
function gameLoop(now) {
  if (!state.started) { return }
  try {
  const dt = Math.min(0.05, (now - lastTime) / 1000)
  lastTime = now
  time += dt
  frameCount = Math.floor(time * 60)
  // Process status effects (burn/poison DoT, stun/freeze/slow timers)
  if (state.inCombat && state.mobs.length > 0) processStatusEffects(dt)
  state.atkTimer += dt
  // Auto-upgrade removed — now triggers on level up only
  // Block attacks while hero is dying
  if (state.heroDying || state.hp <= 0) { state.atkTimer = 0 }
  else if (state.atkTimer >= state.atkInterval) {
    state.atkTimer = 0; playerAttack()
    setTimeout(mobAttack, 120)
  }
  if (state.skill1Cd > 0) state.skill1Cd = Math.max(0, state.skill1Cd - dt)
  if (state.skill2Cd > 0) state.skill2Cd = Math.max(0, state.skill2Cd - dt)
  if (state.atkAnim > 0) state.atkAnim = Math.max(0, state.atkAnim - dt * 50)
  if (state.heroRecoilX !== 0) state.heroRecoilX *= Math.pow(0.01, dt)
  if (state.heroDying && state.deathTimer > 0) state.deathTimer = Math.max(0, state.deathTimer - dt)
  if (state.meleeSkillFx) state.meleeSkillFx.age += dt
  // Boss warning timer
  if (state.bossWarning) {
    state.bossWarningTimer -= dt
    if (state.bossWarningTimer <= 0) {
      state.bossWarningTimer = 0
      // Spawn boss on next mob spawn cycle
    }
  }
  // Rogue afterimage: snap back after teleport
  if (state.rogueAfterimage) {
    state.rogueAfterimage.age += dt
    if (state.rogueAfterimage.snapBack) {
      state.heroX = state.rogueAfterimage.x // snap hero back
      state.heroTargetX = state.rogueAfterimage.x
      state.rogueAfterimage = null
    } else if (state.rogueAfterimage.age > 0.8) {
      state.rogueAfterimage = null
    }
  }
  // ── ALL MOBS: movement + attacks + death ──
  for (let i = state.mobs.length - 1; i >= 0; i--) {
    const gm = state.mobs[i]
    if (gm.dying) {
      gm.deathTimer -= dt
      if (gm.deathTimer <= 0) {
        state.mobs.splice(i, 1)
        // Sync primary mob refs after splice
        syncPrimaryMobRefs()
        // If all mobs dead, spawn new wave
        if (state.mobs.length === 0) {
          setTimeout(spawnMob, 500)
        }
        continue
      }
      continue
    }
    // Skip movement when frozen
    if (isFrozen(gm)) {
      if (gm.skillCd > 0) gm.skillCd -= dt
      if (gm.hitFlash > 0) gm.hitFlash = Math.max(0, gm.hitFlash - dt * 5)
      continue
    }
    // Movement lerp (with slow)
    const gdiff = gm.targetX - gm.x
    const glerp = Math.min(1, (gm.mob.boss ? 6 : 4.5) * dt * getSlowMult(gm))
    gm.x += gdiff * glerp
    if (Math.abs(gdiff) < 0.5) gm.x = gm.targetX

    // Boss AI: chase hero + special attack pattern
    if (gm.mob.boss && !gm.dying && gm.hp > 0 && !state.heroDying) {
      gm.bossAtkTimer = (gm.bossAtkTimer || 0) + dt
      // Phase 1: Chase hero aggressively (patrol between hero and mid)
      const heroX = state.heroX || canvas.width * 0.3
      const chaseZone = canvas.width * 0.38
      if (gm.x > chaseZone) {
        // Move closer to hero
        gm.targetX = heroX + canvas.width * 0.12 + Math.sin(time * 1.5) * canvas.width * 0.03
      } else {
        // Too close, back off slightly
        gm.targetX = heroX + canvas.width * 0.15
      }
      // Clamp boss position to stay within visible bounds
      gm.targetX = Math.max(canvas.width * 0.15, Math.min(canvas.width * 0.85, gm.targetX))
      // Phase 2: Boss attack every 1.2-1.8s (faster than normal mobs)
      if (gm.bossAtkTimer > 1.2 + Math.random() * 0.6 && gm.skillCd <= 0) {
        gm.bossAtkTimer = 0
        gm.atkAnim = 1
        gm.skillCd = 1.2
        // Screen shake on boss attack
        HERO_SHAKE_VAR_X = (Math.random() - 0.5) * 12
        HERO_SHAKE_VAR_Y = (Math.random() - 0.5) * 8
        setTimeout(() => { HERO_SHAKE_VAR_X = 0; HERO_SHAKE_VAR_Y = 0 }, 150)
        // Boss attack damage
        const atkDmg = Math.max(1, Math.floor(gm.mob.atk * 0.8) - Math.floor(totalDef() * 0.2) + Math.floor(Math.random() * 5))
        state.hp -= atkDmg
        state.hp = Math.max(0, state.hp)
        state.floatTexts.push({ text: `-${atkDmg} 💀`, y:canvas.height*0.42, color:'#ff4444', size:18, life:1, x:heroX + 10 })
        addCombatLog(`💀 ${gm.mob.name} hits for ${atkDmg} damage!`)
        if (state.hp <= 0) {
          state.heroDying = true; state.deathTimer = 1.5
          addCombatLog('Defeated by Boss!')
          setTimeout(() => { showDeathPopup() }, 1500)
          break
        }
        // Boss special attack visual (ground slam particles)
        for (let pi = 0; pi < 6; pi++) {
          state.particles.push({
            x: gm.x, y: canvas.height * 0.58,
            vx: (Math.random()-0.5) * 120, vy: -Math.random() * 80 - 30,
            size: 4*getS(), life: 0.6, color: '#ff4400'
          })
        }
      }
    }

    // Skill cooldown
    if (gm.skillCd > 0) gm.skillCd -= dt
    // Attack animation fade
    if (gm.atkAnim > 0) gm.atkAnim = Math.max(0, gm.atkAnim - dt * 2.5)
    // Hit flash fade
    if (gm.hitFlash > 0) gm.hitFlash = Math.max(0, gm.hitFlash - dt * 5)
  }
  // Dynamic heroTargetX: melee hero chases nearest alive mob
  if (state.hero.melee && state.mobs.length > 0 && !state.rogueAfterimage) {
    let nearestMob = null, nearestDist = Infinity
    for (const gm of state.mobs) {
      if (gm.hp <= 0 || gm.dying) continue
      const d = gm.x - (state.heroX || canvas.width * 0.3)
      if (d < nearestDist) { nearestDist = d; nearestMob = gm }
    }
    if (nearestMob) {
      // Hero targets position slightly left of mob (melee range)
      state.heroTargetX = nearestMob.x - 50 * getS()
    }
  }
  // Hero movement (melee closes gap, ranged stays — smooth ease-out)
  if (state.hero.melee && state.heroX !== undefined) {
    const hdiff = state.heroTargetX - state.heroX
    const hl = Math.min(1, 5.0 * dt)
    state.heroX += hdiff * hl
    if (Math.abs(hdiff) < 0.5) state.heroX = state.heroTargetX
  } else if (!state.hero.melee && state.heroX !== undefined) {
    const defX = canvas.width * 0.3
    state.heroX += (defX - state.heroX) * Math.min(1, 6 * dt)
    if (Math.abs(state.heroX - defX) < 0.5) state.heroX = defX
  }
  // Update mob projectile
  if (state.mobProjectile) {
    const p = state.mobProjectile, spd = p.speed * 60 * dt
    const dx = p.tx - p.x, dy = p.ty - p.y, dist = Math.hypot(dx, dy)
    if (dist < 8) state.mobProjectile = null
    else { p.x += (dx/dist)*spd; p.y += (dy/dist)*spd }
  }
  // Update hero projectile
  if (state.heroProjectile) {
    const p = state.heroProjectile, spd = p.speed * 60 * dt
    const dx = p.tx - p.x, dy = p.ty - p.y, dist = Math.hypot(dx, dy)
    p.age = (p.age || 0) + dt * 60
    if (dist < 8) state.heroProjectile = null
    else { p.x += (dx/dist)*spd; p.y += (dy/dist)*spd }
  }
  // Update particles
  for (let i=state.particles.length-1;i>=0;i--) {
    const p = state.particles[i]
    p.x += p.vx*dt*60; p.y += p.vy*dt*60; p.life -= dt*2; p.size *= 0.98
    if (p.life<=0) state.particles.splice(i,1)
  }
  // Shake decay
  HERO_SHAKE_VAR_X *= Math.pow(0.001, dt); HERO_SHAKE_VAR_Y *= Math.pow(0.001, dt)
  if (Math.abs(HERO_SHAKE_VAR_X) < 0.1) HERO_SHAKE_VAR_X = 0
  if (Math.abs(HERO_SHAKE_VAR_Y) < 0.1) HERO_SHAKE_VAR_Y = 0
  // Update float texts (smoother)
  for (let i=state.floatTexts.length-1;i>=0;i--) {
    const ft = state.floatTexts[i]; ft.y -= 50*dt; ft.life -= dt
    if (ft.life<=0) state.floatTexts.splice(i,1)
  }
  if (frameCount % 1800 === 0) saveGame()
  if (state.started && state.hero) autoUsePotion()
  draw()
  } catch(e) { console.warn('Game loop error:', e) }
  if (state.started) requestAnimationFrame(gameLoop)
}

// ─── HERO SELECTION ────────────────────────────────────
function setupHeroSelection() {
  const grid = document.getElementById('hero-grid'), startBtn = document.getElementById('start-btn')
  HEROES.forEach(hero => {
    const card = document.createElement('div'); card.className = 'hero-card'
    card.innerHTML = `<div class="emoji">${hero.emoji}</div><div class="name">${hero.name}</div><div class="class">HP:${hero.baseHp} ATK:${hero.baseAtk} SPD:${hero.spd}</div>`
    card.onclick = () => { document.querySelectorAll('.hero-card').forEach(c=>c.classList.remove('selected')); card.classList.add('selected'); state.selectedHero = hero; startBtn.disabled = false }
    grid.appendChild(card)
  })
  startBtn.onclick = startGame
}

function startGame() {
  if (!state.selectedHero) return
  const heroData = { ...state.selectedHero };
  // Use Farcaster username as character name (only if real FC user from context)
  const fcUser = getUser();
  if (fcUser && fcUser.username && isRealFarcasterUser()) {
    heroData.name = '@' + fcUser.username;
  }
  Object.assign(state, { hero: heroData, started: true, hp: heroData.baseHp, maxHp: heroData.baseHp,
    exp: 0, maxExp: 100, gold: 0, level: 1, zone: 0, totalKills: 0, zoneKills: 0,
    combatLog: [], floatTexts: [], particles: [], upg: { atk:0, def:0, hp:0, spd:0 },
    inventory: [], equipped: { weapon:null, armor:null, shield:null, helmet:null, boots:null, ring:null, accessory:null },
    skillCd: 0, skillReady: true, atkAnim: 0, mobHitFlash: 0, heroRecoilX: 0, mobs: [], mobDying: false, mobDeathTimer: 0, skillIdx: 0 })
  calcStats(); state.hp = state.maxHp
  document.getElementById('menu-screen').style.display = 'none'
  document.getElementById('bottom-bar').style.display = 'block'
  currentLoopId++; spawnMob(); addCombatLog(`${state.hero.name} enters ${getZone(0).name}!`); gameLoop(performance.now()); saveGame()
  // Save class to server (1 user = 1 character)
  syncPlayerState(state).catch(() => {});
}

// ─── EXPOSE TO GLOBAL (for onclick) ────────────────────
window.startGame = startGame
window.switchSkill = switchSkill


// ─── LEADERBOARD ────────────────────────────────────────
let showLeaderboard = false;
let currentLbType = 'gold';
function toggleLeaderboard() {
  showLeaderboard = !showLeaderboard;
  const panel = document.getElementById('lb-panel');
  if (showLeaderboard) {
    panel.classList.add('open');
    loadLeaderboard('gold');
  } else {
    panel.classList.remove('open');
  }
}
async function loadLeaderboard(type) {
  currentLbType = type;
  // Update tabs
  document.querySelectorAll('.lb-tab').forEach((tab, i) => {
    tab.classList.toggle('active', ['gold','level','power'][i] === type);
  });
  const list = document.getElementById('lb-list');
  list.innerHTML = '<div class="lb-loading">Loading...</div>';
  try {
    const res = await fetch(`https://farborn-server.vercel.app/api/leaderboard/${type}`);
    const data = await res.json();
    if (!data.entries || data.entries.length === 0) {
      list.innerHTML = '<div class="lb-empty">No players yet</div>';
      return;
    }
    const myWallet = getWallet();
    list.innerHTML = data.entries.map(e => {
      const rankClass = e.rank === 1 ? 'gold' : e.rank === 2 ? 'silver' : e.rank === 3 ? 'bronze' : '';
      const medal = e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : e.rank === 3 ? '🥉' : `#${e.rank}`;
      const isMe = e.wallet === myWallet || e.username === (getUser()?.username);
      let val = '';
      if (type === 'gold') val = `💰 ${e.gold.toLocaleString()}G`;
      else if (type === 'level') val = `Lv.${e.level}`;
      else if (type === 'power') val = `⚔️ ${e.power.toLocaleString()}`;
      const displayName = e.username && e.username !== 'player' ? `@${e.username}` : (e.hero_name || e.username || 'Unknown');
      return `<div class="lb-entry${isMe ? ' lb-me' : ''}">
        <span class="lb-rank ${rankClass}">${medal}</span>
        <span class="lb-name">${displayName} <span class="lb-class">${e.class || ''}</span></span>
        <span class="lb-val">${val}</span>
      </div>`;
    }).join('');
  } catch (e) {
    list.innerHTML = '<div class="lb-empty">Failed to load</div>';
  }
}
window.toggleLeaderboard = toggleLeaderboard;
window.loadLeaderboard = loadLeaderboard;


// ─── INVENTORY UI ───────────────────────────────────────
function toggleInventory() {
  state.showInventory = !state.showInventory
  const panel = document.getElementById('inv-panel')
  if (state.showInventory) { panel.classList.add('open'); renderInventory() }
  else { panel.classList.remove('open') }
}
function toggleNightmare() {
  state.nightmare = !state.nightmare
  const btn = document.getElementById('nightmare-btn')
  if (btn) btn.classList.toggle('nightmare-active', state.nightmare)
  addCombatLog(state.nightmare ? '💀 Nightmare Mode ON — 2x gold/exp, stronger mobs!' : '☀️ Normal Mode restored')
}
function renderInventory() {
  // Equipped slots
  const eqDiv = document.getElementById('equipped-slots')
  const slots = ['weapon','armor','shield','helmet','boots','ring','accessory']
  const visSlots = state.hero && state.hero.id === 'paladin' ? slots : slots.filter(s => s !== 'shield')
  eqDiv.innerHTML = ''
  for (const slot of visSlots) {
    const item = state.equipped[slot]
    const type = EQUIP_TYPES[slot]
    const div = document.createElement('div')
    div.className = 'inv-slot' + (item ? ' eq-equipped' : '')
    if (item) {
      div.style.borderColor = item.rarityColor
      // Convert hex to rgba for background
      const hc = item.rarityColor.replace('#','')
      div.style.background = `rgba(${r},${g},${b},0.12)`
      const forgeStr = item.forgeLevel > 0 ? ` +${item.forgeLevel}` : ''
      div.innerHTML = `<div class="eq-emoji">${equipIcon(item, 28)}</div>
        <div class="eq-name" style="color:${item.rarityColor}">${item.name}${forgeStr}</div>
        <div class="eq-rarity" style="color:${item.rarityColor}">${item.rarityName}</div>`
      div.onclick = () => showDetail(item, 'equipped', slot)
    } else {
      div.innerHTML = `<div class="eq-emoji">${equipSlotIcon(slot, 28)}</div>
        <div class="eq-name" style="color:#555">${type.name}</div>`
    }
    eqDiv.appendChild(div)
  }
  // Inventory bag
  const bagDiv = document.getElementById('inventory-slots')
  bagDiv.innerHTML = ''
  for (let i = 0; i < state.inventory.length; i++) {
    const item = state.inventory[i]
    const div = document.createElement('div')
    div.className = 'inv-slot'
    div.style.borderColor = item.rarityColor
    if (item.rarity === 'archgod') div.style.background = 'rgba(255,111,0,0.08)'
    else if (item.rarity === 'immortal') div.style.background = 'rgba(224,224,224,0.06)'
    else if (item.rarity === 'mythic') div.style.background = 'rgba(244,67,54,0.06)'
    const forgeTag = item.forgeLevel > 0 ? `<div class="eq-forge-tag">+${item.forgeLevel}</div>` : ''
    div.innerHTML = `<div class="eq-emoji">${equipIcon(item, 28)}</div>
      <div class="eq-name" style="color:${item.rarityColor}">${item.name}</div>
      <div class="eq-rarity" style="color:${item.rarityColor}">${item.rarityName}</div>
      ${forgeTag}`
    div.onclick = () => showDetail(item, 'bag', i)
    // Lock icon
    const lockEl = document.createElement('span')
    lockEl.className = 'lock-icon ' + (item.locked ? 'locked' : 'unlocked')
    lockEl.textContent = item.locked ? '🔒' : '🔓'
    lockEl.onclick = (e) => { e.stopPropagation(); toggleLockItem(i) }
    div.appendChild(lockEl)
    bagDiv.appendChild(div)
  }
  // Update counts
  document.getElementById('inv-count').textContent = state.inventory.length
  document.getElementById('inv-count2').textContent = state.inventory.length + '/' + INVENTORY_MAX
}

let _detailItem = null, _detailSource = null, _detailIdx = null
function showDetail(item, source, idx) {
  _detailItem = item; _detailSource = source; _detailIdx = idx
  const d = document.getElementById('item-detail')
  d.classList.add('open')
  document.getElementById('dt-emoji').innerHTML = equipIcon(item, 44)
  const forgeStr = (item.forgeLevel || 0) > 0 ? ` +${item.forgeLevel}` : ''
  document.getElementById('dt-name').textContent = item.name + forgeStr
  document.getElementById('dt-name').style.color = item.rarityColor
  document.getElementById('dt-rarity').textContent = item.rarityName
  document.getElementById('dt-rarity').style.color = item.rarityColor
  document.getElementById('dt-type').textContent = EQUIP_TYPES[item.type].name + ' Slot'
  // Stats
  let statsHtml = ''
  if (item.atk > 0) statsHtml += `<span class="detail-stat">⚔️ <b>+${item.atk}</b> ATK</span>`
  if (item.def > 0) statsHtml += `<span class="detail-stat">🛡️ <b>+${item.def}</b> DEF</span>`
  if (item.hp > 0) statsHtml += `<span class="detail-stat">❤️ <b>+${item.hp}</b> HP</span>`
  if (item.spd > 0) statsHtml += `<span class="detail-stat">⚡ <b>+${item.spd}</b> SPD</span>`
  document.getElementById('dt-stats').innerHTML = statsHtml
  // Level req
  const canEquip = state.level >= item.lvlReq
  document.getElementById('dt-lvlreq').innerHTML = `Lv.${item.lvlReq} required ${canEquip ? '<span style="color:#4caf50">✓</span>' : '<span style="color:#f44336">✗ Need '+(item.lvlReq - state.level)+' more levels</span>'}`
  // Forge info
  const forgeLevel = item.forgeLevel || 0
  const forgeColor = forgeLevel >= 10 ? '#ff6f00' : forgeLevel >= 8 ? '#f44336' : forgeLevel >= 5 ? '#ff9800' : '#ffd700'
  if (forgeLevel > 0) {
    document.getElementById('dt-forge').innerHTML = `<span style="color:${forgeColor};font-size:12px;font-weight:bold">🔨 +${forgeLevel}</span> <span style="color:#888;font-size:9px">Forged</span>`
  } else {
    document.getElementById('dt-forge').innerHTML = '<span style="color:#666;font-size:9px">Not forged</span>'
  }
  // Actions
  const actDiv = document.getElementById('dt-actions')
  let btns = ''
  if (source === 'bag') {
    btns += `<div class="detail-btn equip" onclick="doEquipDetail()" ${canEquip?'':'disabled'}>Equip<span class="btn-sub">${item.lvlReq > state.level ? 'Need Lv.'+item.lvlReq : 'Wear it'}</span></div>`
    if (item.forgeLevel < 12) {
      const fc = FORGE_COST[item.forgeLevel + 1]
      const rate = Math.floor(FORGE_RATE[item.forgeLevel + 1] * 100)
      const nextLv = item.forgeLevel + 1
      const destroyWarn = nextLv >= 8
      btns += `<div class="detail-btn forge${destroyWarn ? ' danger' : ''}" onclick="doForgeDetail()" ${state.gold>=fc?'':'disabled'}>
        🔨 +${nextLv}
        <span class="btn-sub">${fc}G · ${rate}%${destroyWarn ? ' ⚠️' : ''}</span>
        ${destroyWarn ? '<span class="btn-sub" style="color:#f44336">DESTROYED if failed!</span>' : ''}
      </div>`
    } else {
      btns += `<div class="detail-btn forge" disabled>🔨 MAX<span class="btn-sub">+12</span></div>`
    }
    if (item.locked) {
      btns += `<div class="detail-btn sell" style="opacity:0.4;cursor:not-allowed">🔒 Locked<span class="btn-sub">Unlock to sell</span></div>`
    } else {
      btns += `<div class="detail-btn sell" onclick="doSellDetail()">Sell<span class="btn-sub">+${Math.floor((item.atk+item.def+item.hp+(item.spd||0))*2+5+item.forgeLevel*10)}G</span></div>`
    }
  } else {
    btns += `<div class="detail-btn sell" onclick="doUnequipDetail()">Remove<span class="btn-sub">Back to bag</span></div>`
    // Forge equipped items directly
    if (item.forgeLevel < 12) {
      const fc = FORGE_COST[item.forgeLevel + 1]
      const rate = Math.floor(FORGE_RATE[item.forgeLevel + 1] * 100)
      const nextLv = item.forgeLevel + 1
      const destroyWarn = nextLv >= 8
      btns += `<div class="detail-btn forge${destroyWarn ? ' danger' : ''}" onclick="doForgeDetail()" ${state.gold>=fc?'':'disabled'}>
        🔨 +${nextLv}
        <span class="btn-sub">${fc}G · ${rate}%${destroyWarn ? ' ⚠️' : ''}</span>
        ${destroyWarn ? '<span class="btn-sub" style="color:#f44336">DESTROYED if failed!</span>' : ''}
      </div>`
    } else {
      btns += `<div class="detail-btn forge" disabled>🔨 MAX<span class="btn-sub">+12</span></div>`
    }
  }
  actDiv.innerHTML = btns
}
function closeDetail() {
  document.getElementById('item-detail').classList.remove('open')
  _detailItem = null
}
function doEquipDetail() { if (_detailItem && _detailSource === 'bag') { equipItem(_detailIdx); closeDetail(); renderInventory() } }
function doForgeDetail() {
  if (!_detailItem || (_detailSource !== 'bag' && _detailSource !== 'equipped')) return
  const item = _detailItem, idx = _detailIdx, src = _detailSource
  const nextLv = item.forgeLevel + 1
  if (nextLv > 12) return
  // Destruction warning for +8+
  if (nextLv >= 8) {
    showConfirm({
      icon: '⚠️', title: 'WARNING!',
      msg: `${item.name} +${item.forgeLevel} → +${nextLv}\nSuccess rate: ${Math.floor(FORGE_RATE[nextLv]*100)}%`,
      warn: 'Fail = ITEM PERMANENTLY DESTROYED!',
      okText: 'YES, FORGE', okClass: 'danger',
      onOk: () => showForgeAnimation(item, nextLv, src)
    })
    return
  }
  showForgeAnimation(item, nextLv, src)
}
// ─── DEATH POPUP ─────────────────────────────────────
let _deathCooldown = null
let _deathGoldPaid = false
let _deathPopupOpen = false
function showDeathPopup() {
  if (_deathPopupOpen) return
  _deathPopupOpen = true
  const pop = document.getElementById('death-popup')
  const goldCost = Math.floor(50 + state.level * 5)
  _deathGoldPaid = false
  // Gold button
  const goldBtn = document.getElementById('dp-gold')
  const goldCostEl = document.getElementById('dp-gold-cost')
  goldCostEl.textContent = `${goldCost}G`
  goldBtn.style.opacity = state.gold < goldCost ? '0.4' : '1'
  goldBtn.onclick = () => {
    if (state.gold < goldCost) return
    state.gold -= goldCost
    _deathGoldPaid = true
    respawnHero()
  }
  // Cooldown button — 10s cooldown, then auto-respawn
  const cdBtn = document.getElementById('dp-wait')
  const cdText = document.getElementById('dp-cd-text')
  let remaining = 10
  cdText.textContent = `${remaining}s`
  cdBtn.onclick = null
  cdBtn.style.opacity = '0.5'
  if (_deathCooldown) clearInterval(_deathCooldown)
  _deathCooldown = setInterval(() => {
    remaining--
    cdText.textContent = `${remaining}s`
    if (remaining <= 0) {
      clearInterval(_deathCooldown)
      _deathCooldown = null
      respawnHero()
    }
  }, 1000)
  pop.style.display = 'block'
}
function respawnHero() {
  _deathPopupOpen = false
  if (_deathCooldown) { clearInterval(_deathCooldown); _deathCooldown = null }
  state.hp = _deathGoldPaid ? state.maxHp : Math.floor(state.maxHp * 0.5)
  state.heroDying = false
  state.inCombat = false
  state.mob = null
  state.mobs = []
  state.heroX = canvas.width * 0.3
  state.heroTargetX = canvas.width * 0.3
  document.getElementById('death-popup').style.display = 'none'
  addCombatLog(`Respawned ${state.hp}HP`)
  setTimeout(spawnMob, 500)
}
// Custom confirm popup
function showConfirm({icon, title, msg, warn, okText, okClass, onOk}) {
  const pop = document.getElementById('confirm-popup')
  document.getElementById('cf-icon').textContent = icon || '❓'
  document.getElementById('cf-title').textContent = title || 'Confirm'
  document.getElementById('cf-msg').textContent = msg || ''
  document.getElementById('cf-warn').textContent = warn || ''
  const okBtn = document.getElementById('cf-ok')
  okBtn.textContent = okText || 'OK'
  okBtn.style.background = okClass === 'danger' ? 'rgba(244,67,54,0.2)' : 'rgba(76,175,80,0.2)'
  okBtn.style.borderColor = okClass === 'danger' ? '#f44336' : '#4caf50'
  okBtn.style.color = okClass === 'danger' ? '#f44336' : '#4caf50'
  pop.style.display = 'flex'
  document.getElementById('cf-ok').onclick = () => { pop.style.display = 'none'; if (onOk) onOk() }
  document.getElementById('cf-cancel').onclick = () => { pop.style.display = 'none' }
}
function showForgeAnimation(item, targetLv, source) {
  const ov = document.getElementById('forge-overlay')
  ov.classList.add('active')
  document.getElementById('fo-item').textContent = item.emoji
  document.getElementById('fo-hammer').textContent = '🔨'
  document.getElementById('fo-text').textContent = `Forging +${targetLv}...`
  document.getElementById('fo-level').textContent = `+${item.forgeLevel} → +${targetLv}`
  document.getElementById('fo-result').textContent = ''
  document.getElementById('fo-result').style.color = ''
  // Create sparks
  const sparksDiv = document.getElementById('fo-sparks')
  sparksDiv.innerHTML = ''
  let sparkInterval = setInterval(() => {
    for (let i = 0; i < 3; i++) {
      const spark = document.createElement('div')
      spark.className = 'forge-spark'
      spark.style.left = '50%'
      spark.style.top = '45%'
      spark.style.setProperty('--sx', (Math.random()-0.5)*120+'px')
      spark.style.setProperty('--sy', (-Math.random()*80-20)+'px')
      spark.style.background = Math.random()>0.5 ? '#ff9800' : '#ffd700'
      sparksDiv.appendChild(spark)
      setTimeout(() => spark.remove(), 700)
    }
  }, 100)
  // After 1.5s, resolve
  setTimeout(() => {
    clearInterval(sparkInterval)
    // Find item in inventory or equipped
    let idx = state.inventory.indexOf(item)
    let isEquipped = false
    if (idx === -1) {
      for (const slot in state.equipped) {
        if (state.equipped[slot] === item) { isEquipped = true; break }
      }
    }
    if (idx === -1 && !isEquipped) { ov.classList.remove('active'); return }
    const cost = FORGE_COST[targetLv]
    if (state.gold < cost) {
      document.getElementById('fo-result').textContent = 'Not enough gold!'
      document.getElementById('fo-result').style.color = '#f44336'
      document.getElementById('fo-hammer').textContent = '❌'
      setTimeout(() => { ov.classList.remove('active') }, 1000)
      return
    }
    state.gold -= cost
    const rate = FORGE_RATE[targetLv]
    if (Math.random() < rate) {
      // SUCCESS
      item.forgeLevel = targetLv
      const mul = 1 + targetLv * 0.2
      const base = EQUIP_BASE[item.type]
      const rMul = RARITIES[item.rarity].statMul
      const zoneIdx = Math.floor(item.lvlReq / 20)
      const lb = 1 + zoneIdx * 0.2
      item.atk = Math.floor(base.atk * rMul * lb * mul) || 0
      item.def = Math.floor(base.def * rMul * lb * mul) || 0
      item.hp = Math.floor(base.hp * rMul * lb * mul) || 0
      item.spd = Math.floor(base.spd * rMul * lb * mul) || 0
      document.getElementById('fo-result').textContent = `✅ +${targetLv} SUCCESS!`
      document.getElementById('fo-result').style.color = '#4caf50'
      document.getElementById('fo-level').textContent = `+${targetLv}`
      document.getElementById('fo-hammer').textContent = '✨'
      addCombatLog(`Forged ${item.name} → +${targetLv}!`)
      state.floatTexts.push({text:`🔨 +${targetLv}!`, y:canvas.height*0.35, color:'#4caf50', size:14, life:1.2, x:canvas.width/2+40})
    } else {
      if (targetLv >= 8) {
        // DESTROY
        if (isEquipped) {
          // Find and unequip the item
          for (const slot in state.equipped) {
            if (state.equipped[slot] === item) { state.equipped[slot] = null; break }
          }
          calcStats()
        } else {
          state.inventory.splice(idx, 1)
        }
        document.getElementById('fo-result').textContent = `💀 DESTROYED!`
        document.getElementById('fo-result').style.color = '#f44336'
        document.getElementById('fo-level').textContent = 'ITEM DESTROYED'
        document.getElementById('fo-hammer').textContent = '💥'
        addCombatLog(`💀 ${item.name} DESTROYED at +${targetLv}!`)
        state.floatTexts.push({text:`💀 DESTROYED!`, y:canvas.height*0.35, color:'#f44336', size:16, life:1.5, x:canvas.width/2+40})
      } else {
        document.getElementById('fo-result').textContent = `❌ FAILED!`
        document.getElementById('fo-result').style.color = '#ff9800'
        document.getElementById('fo-hammer').textContent = '😢'
        addCombatLog(`Failed to forge ${item.name} (+${targetLv})`)
        state.floatTexts.push({text:`Forge Failed!`, y:canvas.height*0.35, color:'#ff9800', size:13, life:1, x:canvas.width/2+40})
      }
    }
    // Show close button instead of auto-close
    calcStats()
    // Remove old close buttons first
    ov.querySelectorAll('.forge-result-close').forEach(e => e.remove())
    const closeBtn = document.createElement('div')
    closeBtn.className = 'forge-result forge-result-close'
    closeBtn.style.cssText = 'color:#888;font-size:11px;margin-top:12px;cursor:pointer;padding:8px 20px;border:1px solid #444;border-radius:8px;'
    closeBtn.textContent = 'TAP TO CLOSE'
    closeBtn.onclick = () => { ov.classList.remove('active'); closeDetail(); renderInventory(); calcStats() }
    ov.appendChild(closeBtn)
  }, 1500)
}
// ─── STATS PANEL ──────────────────────────────────────
function toggleStats() {
  const panel = document.getElementById('stats-panel')
  if (panel.style.display === 'flex') {
    panel.style.display = 'none'
  } else {
    renderStats()
    panel.style.display = 'flex'
  }
}
function renderStats() {
  if (!state.hero) return
  const h = state.hero
  const panel = document.getElementById('stats-panel')
  document.getElementById('stats-hero-name').textContent = `${h.emoji} ${h.name} (Lv.${state.level})`
  const heroWpn = HERO_WEAPONS[h.id]
  const atk = totalAtk(), def = totalDef(), hp = state.hp, maxHp = state.maxHp
  const eqAtk = equipBonusAtk(), eqDef = equipBonusDef()
  const eqHp = Object.values(state.equipped).reduce((s, e) => s + (e ? (e.hp||0) : 0), 0)
  const eqSpd = (state.equipped.boots ? (state.equipped.boots.spd||0) : 0) + (state.equipped.accessory ? (state.equipped.accessory.spd||0) : 0)
  let html = `
    <div style="background:rgba(255,255,255,0.04);border:1px solid #333;border-radius:10px;padding:10px;margin-bottom:8px;">
      <div style="font-size:10px;color:#888;margin-bottom:6px;">⚔️ COMBAT</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <div style="background:rgba(244,67,54,0.1);border-radius:8px;padding:8px;text-align:center;">
          <div style="font-size:18px;font-weight:bold;color:#ff6b6b;">${atk}</div>
          <div style="font-size:8px;color:#aaa;">⚔️ ATK</div>
          <div style="font-size:7px;color:#666;">base ${state.baseAtk} + equip ${eqAtk}</div>
        </div>
        <div style="background:rgba(33,150,243,0.1);border-radius:8px;padding:8px;text-align:center;">
          <div style="font-size:18px;font-weight:bold;color:#64b5f6;">${def}</div>
          <div style="font-size:8px;color:#aaa;">🛡️ DEF</div>
          <div style="font-size:7px;color:#666;">base ${state.baseDef} + equip ${eqDef}</div>
        </div>
        <div style="background:rgba(76,175,80,0.1);border-radius:8px;padding:8px;text-align:center;">
          <div style="font-size:18px;font-weight:bold;color:#81c784;">${hp}/${maxHp}</div>
          <div style="font-size:8px;color:#aaa;">❤️ HP</div>
          <div style="font-size:7px;color:#666;">base ${Math.floor(h.baseHp + state.upg.hp * UPGRADES.hp.amount)} + equip ${eqHp}</div>
        </div>
        <div style="background:rgba(255,215,0,0.1);border-radius:8px;padding:8px;text-align:center;">
          <div style="font-size:18px;font-weight:bold;color:#ffd700;">${(state.attackSpeed*100).toFixed(0)}%</div>
          <div style="font-size:8px;color:#aaa;">⚡ SPD</div>
          <div style="font-size:7px;color:#666;">boots+acc +${eqSpd}</div>
        </div>
      </div>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid #333;border-radius:10px;padding:10px;margin-bottom:8px;">
      <div style="font-size:10px;color:#888;margin-bottom:6px;">📈 UPGRADES</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:9px;">
        <div style="color:#aaa;">⚔️ ATK Lv.${state.upg.atk}</div>
        <div style="color:#aaa;">🛡️ DEF Lv.${state.upg.def}</div>
        <div style="color:#aaa;">❤️ HP Lv.${state.upg.hp}</div>
      </div>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid #333;border-radius:10px;padding:10px;margin-bottom:8px;">
      <div style="font-size:10px;color:#888;margin-bottom:6px;">🛡️ EQUIPPED</div>`
  const slots = ['weapon','armor','shield','helmet','boots','ring','accessory']
  const visSlots = h.id === 'paladin' ? slots : slots.filter(s => s !== 'shield')
  for (const slot of visSlots) {
    const item = state.equipped[slot]
    const type = EQUIP_TYPES[slot]
    if (item) {
      html += `<div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid #222;">
        ${equipIcon(item, 20)}
        <div style="flex:1;">
          <span style="color:${item.rarityColor};font-size:9px;">${item.name}${item.forgeLevel > 0 ? ' +'+item.forgeLevel : ''}</span>
          <span style="color:#666;font-size:7px;margin-left:4px;">${item.rarityName}</span>
        </div>
        <div style="font-size:8px;color:#aaa;">${item.atk ? '⚔'+item.atk+' ' : ''}${item.def ? '🛡'+item.def+' ' : ''}${item.hp ? '❤'+item.hp+' ' : ''}${item.spd ? '⚡'+item.spd : ''}</div>
      </div>`
    } else {
      html += `<div style="padding:4px 0;color:#444;font-size:9px;">${type.emoji} ${type.name} — empty</div>`
    }
  }
  html += `</div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid #333;border-radius:10px;padding:10px;margin-bottom:8px;">
      <div style="font-size:10px;color:#888;margin-bottom:6px;">🎮 GAME</div>
      <div style="font-size:9px;color:#aaa;line-height:1.6;">
        Zone: ${getZone(state.zone)?.name || '?'} (Lv.${state.level})<br>
        Gold: ${formatNum(state.gold)}G<br>
        Kills: ${state.kills}<br>
        Zone Kills: ${state.zoneKills}/10<br>
        Weapon: ${heroWpn?.name || 'Unknown'}
      </div>
    </div>`
  document.getElementById('stats-content').innerHTML = html
}
// ─── ZONE PICKER ──────────────────────────────────────
function toggleZonePicker() {
  const panel = document.getElementById('zone-panel')
  if (panel.style.display === 'flex') {
    panel.style.display = 'none'
  } else {
    renderZonePicker()
    panel.style.display = 'flex'
  }
}
function goToZone(idx) {
  if (idx < 0 || state.level < getZoneLvlReq(idx)) return
  state.zone = idx; state.zoneKills = 0
  state.bossKillCounter = 0; state.isBoss = false; state.bossWarning = false; state.bossWarningTimer = 0
  const zn = getZone(idx)
  addCombatLog(`Teleported to ${zn.name}!`)
  state.floatTexts.push({ text: `→ ${zn.name}`, y:canvas.height*0.25, color:'#00bcd4', size:18, life:2, x:canvas.width/2 })
  document.getElementById('zone-panel').style.display = 'none'
  queueEvent(EVENT_TYPES.ZONE_CHANGE, { zone: idx, name: zn.name })
  // Send to server
  serverApi.sendEvent('zone_change', { zone: idx }).catch(e => console.warn('Server zone_change failed:', e))
  state.mob = null; state.inCombat = false
  setTimeout(spawnMob, 300)
  saveGame()
}
function renderZonePicker() {
  const list = document.getElementById('zone-list')
  const maxShow = Math.min(state.zone + 5, 50)
  let html = ''
  for (let i = 0; i <= maxShow; i++) {
    const zn = getZone(i)
    const lvlReq = getZoneLvlReq(i)
    const unlocked = state.level >= lvlReq
    const isCurrent = i === state.zone
    let bg = 'rgba(255,255,255,0.03)'
    let border = '#333'
    let opacity = '1'
    if (isCurrent) { bg = 'rgba(0,188,212,0.15)'; border = '#00bcd4' }
    else if (!unlocked) { opacity = '0.4' }
    const mobNames = zn.mobs.map(m => MOBS[m]?.emoji || '?').join(' ')
    html += `<div onclick="goToZone(${i})" style="background:${bg};border:1px solid ${border};border-radius:8px;padding:8px;margin-bottom:5px;cursor:${unlocked ? 'pointer' : 'not-allowed'};opacity:${opacity};display:flex;align-items:center;gap:8px;">
      <div style="flex:1;">
        <div style="font-size:10px;color:${isCurrent ? '#00bcd4' : '#ddd'};${isCurrent ? 'font-weight:bold;' : ''}">${isCurrent ? '▶ ' : ''}${zn.name}</div>
        <div style="font-size:8px;color:#888;">${mobNames} · Req: Lv.${lvlReq}</div>
      </div>
      ${!unlocked ? '<div style="font-size:8px;color:#ff9800;">🔒</div>' : isCurrent ? '<div style="font-size:8px;color:#00bcd4;">HERE</div>' : ''}
    </div>`
  }
  list.innerHTML = html
}
// SVG icon helper - renders SVG string as data URL for img tags
function equipIcon(item, size) {
  // Use hero-specific weapon SVG if weapon type
  if (item.type === 'weapon' && state.hero && HERO_WEAPONS[state.hero.id]) {
    const hw = HERO_WEAPONS[state.hero.id]
    const colored = hw.svg
  // Use accessory visuals if accessory type
  if (item.type === "accessory" && item.typeName) {
    const accessorySvg = getAccessoryVisual(item.typeName)
    if (accessorySvg) {
      return `<img src="data:image/svg+xml,${encodeURIComponent(accessorySvg)}" width="${size}" height="${size}" style="image-rendering:auto">`
    }
  }
    return `<img src="data:image/svg+xml,${encodeURIComponent(colored)}" width="${size}" height="${size}" style="image-rendering:auto">`
  }
  const type = EQUIP_TYPES[item.type]
  if (type && type.svg) {
    const colored = type.svg
    return `<img src="data:image/svg+xml,${encodeURIComponent(colored)}" width="${size}" height="${size}" style="image-rendering:auto">`
  }
  return `<span style="font-size:${size}px">${item.emoji || type?.emoji || '?'}</span>`
}
function equipSlotIcon(typeKey, size) {
  // Use hero-specific weapon SVG if weapon slot
  if (typeKey === 'weapon' && state.hero && HERO_WEAPONS[state.hero.id]) {
    const hw = HERO_WEAPONS[state.hero.id]
    return `<img src="data:image/svg+xml,${encodeURIComponent(hw.svg)}" width="${size}" height="${size}" style="image-rendering:auto;opacity:0.3">`
  }
  const type = EQUIP_TYPES[typeKey]
  if (type && type.svg) {
    return `<img src="data:image/svg+xml,${encodeURIComponent(type.svg)}" width="${size}" height="${size}" style="image-rendering:auto;opacity:0.3">`
  }
  return `<span style="font-size:${size}px;opacity:0.3">${type?.emoji || '?'}</span>`
}
// Lock/unlock toggle
function toggleLockItem(idx) {
  const item = state.inventory[idx]; if (!item) return
  item.locked = !item.locked
  renderInventory()
}
// Sort inventory
function sortInventory(by) {
  const order = { common:0, uncommon:1, rare:2, epic:3, legendary:4, mythic:5, immortal:6, archgod:7 }
  state.inventory.sort((a, b) => {
    if (by === 'rarity') return (order[b.rarity]||0) - (order[a.rarity]||0)
    if (by === 'forge') return (b.forgeLevel||0) - (a.forgeLevel||0)
    return 0
  })
  renderInventory()
}
// Auto sell unlocked items
function autoSellUnlocked() {
  const unlocked = state.inventory.filter(i => !i.locked)
  if (unlocked.length === 0) { addCombatLog('No unlocked items to sell'); return }
  showConfirm({
    icon: '💰', title: 'Auto Sell',
    msg: `Sell ${unlocked.length} unlocked items?`,
    okText: 'SELL ALL', okClass: '',
    onOk: () => {
      let totalGold = 0
      for (let i = state.inventory.length - 1; i >= 0; i--) {
        const item = state.inventory[i]
        if (!item.locked) {
          totalGold += Math.floor((item.atk+item.def+item.hp+(item.spd||0))*2+5+item.forgeLevel*10)
          state.inventory.splice(i, 1)
        }
      }
      state.gold += totalGold
      addCombatLog(`Auto sold ${unlocked.length} items +${totalGold}G`)
      state.floatTexts.push({text:`+${totalGold}G`, y:canvas.height*0.35, color:'#ffd700', size:14, life:1.2, x:canvas.width/2+40})
      renderInventory()
    }
  })
}
// Block sell if locked
function doSellDetail() {
  if (!_detailItem || _detailSource !== 'bag') return
  if (_detailItem.locked) { addCombatLog('Item is locked! Unlock first.'); return }
  sellItem(_detailIdx); closeDetail(); renderInventory()
}
function doUnequipDetail() { if (_detailItem && _detailSource === 'equipped') { unequipItem(_detailIdx); closeDetail(); renderInventory() } }

window.toggleInventory = toggleInventory
window.renderInventory = renderInventory
window.equipItem = equipItem
window.unequipItem = unequipItem
window.sellItem = sellItem
window.forgeItem = forgeItem
window.showDetail = showDetail
window.closeDetail = closeDetail
window.doEquipDetail = doEquipDetail
window.doForgeDetail = doForgeDetail
window.doSellDetail = doSellDetail
window.doUnequipDetail = doUnequipDetail
window.toggleLockItem = toggleLockItem
window.sortInventory = sortInventory
window.autoSellUnlocked = autoSellUnlocked
window.autoEquipAll = autoEquipAll
window.showConfirm = showConfirm
window.toggleStats = toggleStats
window.toggleZonePicker = toggleZonePicker
window.goToZone = goToZone
window.toggleShop = toggleShop
window.buyPotion = buyPotion
window.toggleAutoPotion = toggleAutoPotion
window.toggleNightmare = toggleNightmare

// ─── INIT ──────────────────────────────────────────────
import { initFarcaster, connectWallet, login, checkTokenGate, fetchPrices, convertGold, syncPlayerState, getUser, getWallet, getGateStatus, isLoggedIn, checkStoredAuth, getSDK, isRealFarcasterUser } from './farcaster.js';
import { queueEvent, initSync, syncFullState, getServerState, mergeStates, EVENT_TYPES } from './sync.js';
import * as serverApi from './server-api.js';
import { ACCESSORY_VISUALS, getAccessoryVisual, getAccessoryRarityColor } from './accessory-visuals.js';

// ─── FARCASTER GATE FLOW ────────────────────────────────
let fcReady = false;
let prices = null;

const FARBORN_SC = '0x4abD609B323ce6E7C0770E86d21E76BA00209DE2';

async function initApp() {
  const gateEl = document.getElementById('gate-screen');
  const loadingEl = document.getElementById('gate-loading');
  const resultEl = document.getElementById('gate-result');

  // Show gate
  if (gateEl) gateEl.style.display = 'flex';
  if (loadingEl) loadingEl.style.display = 'block';
  if (resultEl) resultEl.style.display = 'none';

  // Init Farcaster SDK
  const user = await initFarcaster();
  if (user) {
    document.getElementById('gate-user').textContent = `@${user.username}`;
  }

  // Auto-connect wallet
  if (loadingEl) loadingEl.textContent = 'Connecting wallet...';
  let wallet;
  try {
    wallet = await connectWallet();
  } catch (err) {
    if (loadingEl) loadingEl.style.display = 'none';
    document.getElementById('gate-status').textContent = '❌ Connect wallet first';
    return;
  }

  if (!wallet) {
    if (loadingEl) loadingEl.style.display = 'none';
    document.getElementById('gate-status').textContent = '❌ Wallet connection failed';
    return;
  }

  // Check on-chain balance
  if (loadingEl) loadingEl.textContent = 'Checking $FARBORN balance...';
  const gate = await checkTokenGate();

  // Show result
  if (loadingEl) loadingEl.style.display = 'none';
  if (resultEl) resultEl.style.display = 'block';

  const balEl = document.getElementById('gate-balance');
  const startBtn = document.getElementById('gate-start-btn');
  const buyBtn = document.getElementById('gate-buy-btn');
  const scEl = document.getElementById('gate-sc');

  if (gate.hasAccess) {
    // ✅ Hold enough — show Start
    if (balEl) balEl.innerHTML = `✅ <span style="color:#4caf50;font-weight:bold;">${gate.balance.toLocaleString()} $FARBORN</span>`;
    if (startBtn) startBtn.style.display = 'block';
    if (buyBtn) buyBtn.style.display = 'none';
    if (scEl) scEl.style.display = 'none';
  } else {
    // ❌ Not enough — show Buy
    if (balEl) balEl.innerHTML = `❌ <span style="color:#f44336;font-weight:bold;">${(gate.balance || 0).toLocaleString()} / 1,000 $FARBORN</span>`;
    if (startBtn) startBtn.style.display = 'none';
    if (buyBtn) buyBtn.style.display = 'block';
    if (scEl) scEl.style.display = 'block';
  }
}

async function onStartGame() {
  const gateEl = document.getElementById('gate-screen');
  const statusEl = document.getElementById('gate-status');
  const startBtn = document.getElementById('gate-start-btn');
  
  // Safety: 15s max for entire flow
  const overallTimeout = setTimeout(() => {
    console.error('⏰ onStartGame overall timeout');
    if (statusEl) { statusEl.innerHTML = '❌ Timeout — server may be slow'; statusEl.style.color = '#f44336'; statusEl.style.fontSize = '14px'; }
    if (startBtn) { startBtn.disabled = false; startBtn.textContent = '⚔️ Enter the Realm'; }
  }, 15000);

  try {
    if (startBtn) { startBtn.disabled = true; startBtn.textContent = '⏳ Connecting...'; }
    if (statusEl) { statusEl.textContent = ''; statusEl.style.color = ''; statusEl.style.fontSize = ''; }

    // Step 1: Login to server
    if (statusEl) statusEl.textContent = '🔑 Logging in...';
    const loginResult = await login();
    if (loginResult.error) {
      console.error('Login error:', loginResult.error);
      if (statusEl) { statusEl.innerHTML = `❌ Login failed: ${loginResult.error}`; statusEl.style.color = '#f44336'; statusEl.style.fontSize = '13px'; }
      if (startBtn) { startBtn.disabled = false; startBtn.textContent = '⚔️ Enter the Realm'; }
      clearTimeout(overallTimeout);
      return;
    }

    // Initialize sync system with login token
    const { getToken } = await import('./farcaster.js');
    const authToken = getToken();
    if (authToken) {
      initSync(authToken);
      console.log('✅ Sync system initialized');
    }

    // Step 2: Check if player already has a character on server
    const player = loginResult.player;
    const hasCharacter = player && (player.level > 1 || player.gold > 0 || (player.equipped && Object.values(player.equipped).some(v => v != null)));
    console.log('Login OK, hasCharacter:', hasCharacter, 'player:', JSON.stringify(player).slice(0,200));
    
    if (hasCharacter) {
      // Try to restore existing character
      const restored = restoreFromServer(player);
      if (restored) {
        // Success — hide gate, start game
        if (gateEl) gateEl.style.display = 'none';
        document.getElementById('menu-screen').style.display = 'none';
        document.getElementById('bottom-bar').style.display = 'block';
        state.started = true;
        calcStats(); spawnMob(); gameLoop(performance.now());
        clearTimeout(overallTimeout);
        return;
      }
      // restoreFromServer failed — fall through to hero selection
      console.warn('restoreFromServer failed, falling through to hero selection');
    }

    // Step 3: New player or restore failed — show hero selection
    if (statusEl) statusEl.textContent = '⚔️ Choose your hero...';
    if (gateEl) gateEl.style.display = 'none';
    
    // Fetch prices with timeout
    try {
      prices = await Promise.race([
        fetchPrices(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('prices timeout')), 5000))
      ]);
    } catch (e) {
      console.warn('Prices fetch failed:', e.message);
      prices = { currentPrice: 10000, sellPrice: 9500, buyPrice: 10500 };
    }
    
    setupHeroSelection();
    clearTimeout(overallTimeout);
  } catch (err) {
    console.error('onStartGame error:', err);
    if (statusEl) { statusEl.innerHTML = `❌ Error: ${err.message}`; statusEl.style.color = '#f44336'; statusEl.style.fontSize = '13px'; }
    if (startBtn) { startBtn.disabled = false; startBtn.textContent = '⚔️ Enter the Realm'; }
    clearTimeout(overallTimeout);
  }
}

function onBuyToken() {
  // Copy SC address to clipboard
  navigator.clipboard.writeText(FARBORN_SC).then(() => {
    document.getElementById('gate-status').innerHTML = '📋 SC copied! Buy on <a href="https://app.uniswap.org/swap?outputCurrency=' + FARBORN_SC + '&chain=base" target="_blank" style="color:#8B5CF6;">Uniswap</a>';
  }).catch(() => {
    document.getElementById('gate-status').innerHTML = 'SC: <a href="https://basescan.org/token/' + FARBORN_SC + '" target="_blank" style="color:#8B5CF6;">' + FARBORN_SC + '</a>';
  });
}

function startOrMenu() {
  // Check if returning player (localStorage)
  if (loadGame() && state.started) {
    // Update hero name with Farcaster username if real FC user
    const fcUser = getUser();
    if (fcUser && fcUser.username && isRealFarcasterUser()) {
      state.hero.name = '@' + fcUser.username;
      saveGame(); // persist updated name
    }
    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('bottom-bar').style.display = 'block';
    calcStats(); spawnMob(); gameLoop(performance.now());
  } else {
    // No local save — show hero selection (new character)
    setupHeroSelection();
  }
}

// Expose for HTML onclick
window.onStartGame = onStartGame;
window.onBuyToken = onBuyToken;

// ─── Price display in shop ──────────────────────────────
function updatePriceDisplay() {
  if (!prices) return;
  const priceEl = document.getElementById('token-price');
  if (priceEl) {
    priceEl.textContent = `1 FARBORN = ${prices.currentPrice.toLocaleString()} gold`;
  }
}

// Patch updateShopUI to include price + convert button
const _origUpdateShopUI = typeof updateShopUI === 'function' ? updateShopUI : null;
function updateShopUIPatched() {
  if (_origUpdateShopUI) _origUpdateShopUI();
  updatePriceDisplay();
  // Add convert section if not present
  const items = document.getElementById('shop-items');
  if (items && !document.getElementById('convert-section') && prices) {
    const div = document.createElement('div');
    div.id = 'convert-section';
    div.innerHTML = `
      <div style="margin-top:12px;padding:10px;background:rgba(255,215,0,0.08);border:1px solid #ffd700;border-radius:10px;">
        <div style="font-size:11px;font-weight:bold;color:#ffd700;margin-bottom:6px;">💰 Gold → $FARBORN</div>
        <div id="token-price" style="font-size:9px;color:#888;margin-bottom:6px;">1 FARBORN = ${prices.currentPrice.toLocaleString()} gold</div>
        <div style="display:flex;gap:6px;">
          <button onclick="convertMyGold(10000)" style="flex:1;padding:5px;background:rgba(255,215,0,0.1);border:1px solid #ffd700;border-radius:6px;color:#ffd700;font-size:9px;cursor:pointer;">10K</button>
          <button onclick="convertMyGold(50000)" style="flex:1;padding:5px;background:rgba(255,215,0,0.1);border:1px solid #ffd700;border-radius:6px;color:#ffd700;font-size:9px;cursor:pointer;">50K</button>
          <button onclick="convertMyGold(100000)" style="flex:1;padding:5px;background:rgba(255,215,0,0.15);border:1px solid #ffd700;border-radius:6px;color:#ffd700;font-size:9px;font-weight:bold;cursor:pointer;">100K</button>
        </div>
      </div>`;
    items.appendChild(div);
  }
}

async function convertMyGold(amount) {
  if (state.gold < amount) { alert('Not enough gold!'); return; }
  const result = await convertGold(amount, state.level);
  if (result.error) { alert(result.error); return; }
  state.gold -= result.goldSpent || amount;
  addCombatLog(`💰 Converted ${result.goldSpent} gold → ${result.tokensClaimed} FARBORN`);
  state.floatTexts.push({ text: `${result.tokensClaimed} FARBORN! 🪙`, y: canvas.height*0.35, color: '#ffd700', size: 18, life: 2, x: canvas.width/2 });
  // Refresh prices
  prices = await fetchPrices();
  updatePriceDisplay();
}
window.convertMyGold = convertMyGold;

// ─── Force reset: buka ?reset=1 ──────────────────────────
if (window.location.search.includes('reset=1')) {
  localStorage.removeItem('farborn_save');
  window.location.search = '';
}

// ─── Boot ────────────────────────────────────────────────
initApp();
window.addEventListener('beforeunload', saveGame)
