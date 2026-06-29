/**
 * Farborn Client - Server API Module
 * Handles all communication with the game server
 */

const SERVER_URL = 'https://farborn-server.vercel.app';

let authToken = null;
let currentPlayer = null;

/**
 * Set auth token for API calls
 */
export function setAuthToken(token) {
  authToken = token;
}

/**
 * Get current auth token
 */
export function getAuthToken() {
  return authToken;
}

/**
 * Get current player state
 */
export function getCurrentPlayer() {
  return currentPlayer;
}

/**
 * Set current player state
 */
export function setCurrentPlayer(player) {
  currentPlayer = player;
}

/**
 * Make API request with auth
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const config = {
    method,
    headers,
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${SERVER_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Login with Farcaster credentials
 */
export async function login(fid, username, wallet) {
  const data = await apiRequest('/api/auth/login', 'POST', {
    fid,
    username,
    wallet
  });
  
  authToken = data.token;
  currentPlayer = data.player;
  
  return data;
}
/**
 * Login with Farcaster credentials and optional auth token
 */
export async function loginWithToken(fid, username, wallet, quickAuthToken) {
  const payload = {
    fid,
    username,
    wallet
  };
  
  if (quickAuthToken) {
    payload.quickAuthToken = quickAuthToken;
  }
  
  const data = await apiRequest('/api/auth/login', 'POST', payload);
  
  authToken = data.token;
  currentPlayer = data.player;
  
  return data;
}

/**
 * Get player state from server
 */
export async function getPlayerState() {
  const data = await apiRequest('/api/player');
  currentPlayer = data.player;
  return currentPlayer;
}

/**
 * Update player state on server
 */
export async function updatePlayerState(updates) {
  const data = await apiRequest('/api/player', 'PUT', updates);
  currentPlayer = data.player;
  return currentPlayer;
}

/**
 * Sync full state to server
 */
export async function syncFullState(state) {
  const data = await apiRequest('/api/sync/state', 'POST', state);
  currentPlayer = data.player;
  return { player: currentPlayer, merged: data.merged };
}

/**
 * Send event to server
 */
export async function sendEvent(type, data = {}) {
  const event = {
    id: Date.now() + Math.random(),
    type,
    data,
    ts: Date.now()
  };
  
  return await sendEvents([event]);
}

/**
 * Send batch events to server
 */
export async function sendEvents(events) {
  const data = await apiRequest('/api/sync/events', 'POST', { events });
  
  // Update local player state if server returned updated state
  if (data.player) {
    currentPlayer = data.player;
  }
  
  return {
    synced: data.synced || [],
    rejected: data.rejected || [],
    count: data.count || 0
  };
}

/**
 * Send action request to server (for validated actions)
 */
export async function sendAction(type, actionData = {}) {
  // Convert action to event format
  const eventData = {};
  
  switch (type) {
    case 'equip':
      eventData.itemId = actionData.itemId;
      break;
    case 'unequip':
      eventData.itemId = actionData.itemId;
      break;
    case 'sell':
      eventData.itemId = actionData.itemId;
      break;
    case 'forge':
      eventData.itemId = actionData.itemId;
      break;
    case 'level_up':
      // No additional data needed
      break;
    case 'zone_change':
      eventData.zone = actionData.zone;
      break;
    case 'gold_spend':
      eventData.amount = actionData.amount;
      break;
    default:
      break;
  }
  
  const result = await sendEvent(type, eventData);
  
  // If action was rejected, throw error
  if (result.rejected.length > 0) {
    const rejection = result.rejected[0];
    throw new Error(rejection.reason || 'Action rejected by server');
  }
  
  return result;
}

/**
 * Login and sync state
 */
export async function loginAndSync(fid, username, wallet) {
  const loginResult = await login(fid, username, wallet);
  
  // Get full state from server
  const serverState = await getPlayerState();
  
  return {
    token: loginResult.token,
    player: serverState
  };
}

/**
 * Logout
 */
export function logout() {
  authToken = null;
  currentPlayer = null;
}

export default {
  setAuthToken,
  getAuthToken,
  getCurrentPlayer,
  setCurrentPlayer,
  login,
  getPlayerState,
  updatePlayerState,
  syncFullState,
  sendEvent,
  sendEvents,
  sendAction,
  loginAndSync,
  logout
};
