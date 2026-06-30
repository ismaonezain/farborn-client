// ═══════════════════════════════════════════════════════════
//  Farborn Sync — Server-authoritative intent system
// ═══════════════════════════════════════════════════════════

const QUEUE_KEY = 'farborn_event_queue';
const SERVER_URL = 'https://farborn-server.vercel.app';

let eventQueue = [];
let isSyncing = false;
let syncToken = null;

// ─── Intent Event Types (send to server, receive results) ─
export const EVENT_TYPES = {
  // Economy
  GOLD_CHANGE: 'gold_change',
  TOKEN_CONVERT: 'token_convert',
  
  // Equipment
  ITEM_DROP: 'item_drop',
  ITEM_EQUIP: 'item_equip',
  ITEM_UNEQUIP: 'item_unequip',
  ITEM_SELL: 'item_sell',
  FORGE_UPGRADE: 'forge_upgrade',
  
  // Progression
  LEVEL_UP: 'level_up',
  ZONE_CHANGE: 'zone_change',
  SKILL_USE: 'skill_use',
  PRESTIGE: 'prestige',
  
  // Upgrades
  STAT_UPGRADE: 'stat_upgrade',
  
  // Sync
  FULL_STATE: 'full_state',
};

// ─── Server-Authoritative Intent Types ───────────────────
// These are INTENTS: client sends, server processes and returns RESULTS
export const INTENT_TYPES = {
  COMBAT_TICK: 'combat_tick',
  EQUIP_REQUEST: 'equip_request',
  UNEQUIP_REQUEST: 'unequip_request',
  SELL_REQUEST: 'sell_request',
  FORGE_REQUEST: 'forge_request',
  ZONE_CHANGE_REQUEST: 'zone_change_request',
  STAT_UPGRADE_REQUEST: 'stat_upgrade_request',
};

// ─── Direct API Helpers (no queue — send intent, wait for result) ──

async function apiPost(endpoint, body) {
  const res = await fetch(`${SERVER_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': syncToken ? `Bearer ${syncToken}` : undefined,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

async function apiGet(endpoint) {
  const res = await fetch(`${SERVER_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': syncToken ? `Bearer ${syncToken}` : undefined,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

/**
 * Send combat tick intent to server.
 * Server calculates damage, exp, gold, drops — returns results.
 * Client keeps all visual/animation code.
 */
export async function sendCombatTick(zone) {
  try {
    return await apiPost('/api/combat/tick', { zone });
  } catch (err) {
    console.warn('Combat tick failed:', err.message);
    return null;
  }
}

/**
 * Send equip intent to server.
 * Returns updated equipped slots + stats.
 */
export async function sendEquipRequest(itemId) {
  try {
    return await apiPost('/api/equip', { itemId });
  } catch (err) {
    console.warn('Equip request failed:', err.message);
    return { error: err.message };
  }
}

/**
 * Send unequip intent to server.
 * Returns updated equipped slots + stats.
 */
export async function sendUnequipRequest(itemId) {
  try {
    return await apiPost('/api/unequip', { itemId });
  } catch (err) {
    console.warn('Unequip request failed:', err.message);
    return { error: err.message };
  }
}

/**
 * Send sell intent to server.
 * Returns updated gold + inventory.
 */
export async function sendSellRequest(itemId) {
  try {
    return await apiPost('/api/sell', { itemId });
  } catch (err) {
    console.warn('Sell request failed:', err.message);
    return { error: err.message };
  }
}

/**
 * Send forge intent to server.
 * Returns forge result (success/fail, updated item stats).
 */
export async function sendForgeRequest(itemId) {
  try {
    return await apiPost('/api/forge', { itemId });
  } catch (err) {
    console.warn('Forge request failed:', err.message);
    return { error: err.message };
  }
}

/**
 * Send zone change intent to server.
 * Returns updated zone state.
 */
export async function sendZoneChange(zone) {
  try {
    return await apiPost('/api/zone/change', { zone });
  } catch (err) {
    console.warn('Zone change request failed:', err.message);
    return { error: err.message };
  }
}

/**
 * Send stat upgrade intent to server.
 * Returns updated stats.
 */
export async function sendStatUpgrade(stat) {
  try {
    return await apiPost('/api/stat/upgrade', { stat });
  } catch (err) {
    console.warn('Stat upgrade request failed:', err.message);
    return { error: err.message };
  }
}

/**
 * Check offline progress (called once on login).
 * Returns { duration, expGained, goldGained } or null.
 */
export async function checkOfflineProgress() {
  if (!syncToken) return null;
  try {
    const result = await apiGet('/api/offline/progress');
    return result;
  } catch (err) {
    console.warn('Offline progress check failed:', err.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
//  Legacy Queue System (DEPRECATED — kept for backward compat)
// ═══════════════════════════════════════════════════════════

/**
 * @deprecated Use sendEquipRequest, sendSellRequest, etc. instead.
 * This queue system is kept for backward compatibility only.
 */
export function loadQueue() {
  try {
    const saved = localStorage.getItem(QUEUE_KEY);
    if (saved) eventQueue = JSON.parse(saved);
  } catch { eventQueue = []; }
}

/**
 * @deprecated Use server-authoritative intents instead.
 */
export function saveQueue() {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(eventQueue));
}

/**
 * @deprecated Use server-authoritative intents instead.
 */
export function clearQueue() {
  eventQueue = [];
  saveQueue();
}

/**
 * @deprecated Use server-authoritative intents instead.
 */
export function getQueueLength() {
  return eventQueue.length;
}

/**
 * @deprecated Use server-authoritative intents instead.
 */
export function queueEvent(type, data = {}) {
  const event = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    data,
    ts: Date.now(),
    synced: false,
  };
  
  eventQueue.push(event);
  saveQueue();
  
  // Try to sync immediately
  flushQueue();
  
  return event;
}

/**
 * @deprecated Use server-authoritative intents instead.
 */
export async function flushQueue() {
  if (isSyncing || eventQueue.length === 0 || !syncToken) return;
  
  isSyncing = true;
  
  try {
    // Get unsynced events
    const unsynced = eventQueue.filter(e => !e.synced);
    if (unsynced.length === 0) {
      isSyncing = false;
      return;
    }
    
    // Batch sync (max 50 events per request)
    const batches = [];
    for (let i = 0; i < unsynced.length; i += 50) {
      batches.push(unsynced.slice(i, i + 50));
    }
    
    for (const batch of batches) {
      const res = await fetch(`${SERVER_URL}/api/sync/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${syncToken}`,
        },
        body: JSON.stringify({ events: batch }),
      });
      
      if (res.ok) {
        const result = await res.json();
        
        // Mark synced events
        const syncedIds = new Set(result.synced || []);
        eventQueue.forEach(e => {
          if (syncedIds.has(e.id)) e.synced = true;
        });
        
        // Remove old synced events (keep last 100 for reference)
        eventQueue = eventQueue.filter(e => !e.synced).slice(-100);
        saveQueue();
      }
    }
  } catch (err) {
    console.warn('Sync failed:', err.message);
    // Will retry on next flush
  } finally {
    isSyncing = false;
  }
}

// ─── Full State Sync (on login/important events) ─────────
export async function syncFullState(state) {
  if (!syncToken) return null;
  
  try {
    const res = await fetch(`${SERVER_URL}/api/sync/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${syncToken}`,
      },
      body: JSON.stringify({
        level: state.level,
        zone: state.zone,
        gold: state.gold,
        exp: state.exp,
        equipped: state.equipped,
        bag: state.inventory,
        class: state.hero?.id,
        upg: state.upg,
        skillIdx: state.skillIdx,
        totalKills: state.totalKills,
        zoneKills: state.zoneKills,
        prestige: state.prestige,
        prestigeMult: state.prestigeMult,
        potions: state.potions,
        ts: Date.now(),
      }),
    });
    
    if (res.ok) {
      const result = await res.json();
      return result.player;
    }
  } catch (err) {
    console.warn('Full sync failed:', err.message);
  }
  return null;
}

// ─── Get Server State (on login) ─────────────────────────
export async function getServerState() {
  if (!syncToken) return null;
  
  try {
    const res = await fetch(`${SERVER_URL}/api/sync/state`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${syncToken}`,
      },
    });
    
    if (res.ok) {
      const result = await res.json();
      return result.player;
    }
  } catch (err) {
    console.warn('Get server state failed:', err.message);
  }
  return null;
}

// ─── Merge Logic ─────────────────────────────────────────
export function mergeStates(local, server) {
  if (!server) return local;
  if (!local) return server;
  
  // Server is source of truth for most things
  // But local wins for items/gold if local ts > server ts
  
  const merged = { ...server };
  
  // Merge inventory (server items + local unsynced items)
  if (local.inventory && server.bag) {
    const serverItemIds = new Set(server.bag.map(i => i.id));
    const localOnly = local.inventory.filter(i => !serverItemIds.has(i.id));
    merged.bag = [...server.bag, ...localOnly];
  }
  
  // Merge equipped (server wins, but check local)
  if (local.equipped && server.equipped) {
    merged.equipped = server.equipped; // Server is source of truth
  }
  
  // Gold: take higher value (both could have earned offline)
  merged.gold = Math.max(local.gold || 0, server.gold || 0);
  
  // Level: take higher
  merged.level = Math.max(local.level || 1, server.level || 1);
  
  // Zone: take higher
  merged.zone = Math.max(local.zone || 0, server.zone || 0);

  // Potions: client is source of truth (server stores JSON)
  if (local.potions) {
    merged.potions = local.potions;
  }

  return merged;
}

// ─── Init ────────────────────────────────────────────────
export function initSync(token) {
  syncToken = token;
  loadQueue();
  
  // Flush queue on visibility change (user comes back to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && syncToken) {
      flushQueue();
    }
  });
  
  // Flush on online
  window.addEventListener('online', () => {
    if (syncToken) flushQueue();
  });
  
  // Periodic flush every 10 seconds (if there are events)
  setInterval(() => {
    if (eventQueue.length > 0 && syncToken) {
      flushQueue();
    }
  }, 10000);
}

export function setSyncToken(token) {
  syncToken = token;
}
