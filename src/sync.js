// ═══════════════════════════════════════════════════════════
//  EVENT QUEUE — Local-first sync with server
// ═══════════════════════════════════════════════════════════

const QUEUE_KEY = 'farborn_event_queue';
const SERVER_URL = 'https://farborn-server.vercel.app';

let eventQueue = [];
let isSyncing = false;
let syncToken = null;

// ─── Queue Management ────────────────────────────────────
export function loadQueue() {
  try {
    const saved = localStorage.getItem(QUEUE_KEY);
    if (saved) eventQueue = JSON.parse(saved);
  } catch { eventQueue = []; }
}

export function saveQueue() {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(eventQueue));
}

export function clearQueue() {
  eventQueue = [];
  saveQueue();
}

export function getQueueLength() {
  return eventQueue.length;
}

// ─── Event Types ─────────────────────────────────────────
// These are the state-changing events we track
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

// ─── Queue Event ─────────────────────────────────────────
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

// ─── Flush Queue to Server ───────────────────────────────
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
