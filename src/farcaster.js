// ═══════════════════════════════════════════════════════════
//  FARCASTER MINI APP INTEGRATION
// ═══════════════════════════════════════════════════════════

import { connectWallet as walletConnect, disconnectWallet } from './wallet.js';
import * as serverApi from './server-api.js';

const SERVER_URL = 'https://farborn-server.vercel.app';

// ─── State ──────────────────────────────────────────────
let sdk = null;
export function getSDK() { return sdk; }
let farcasterUser = null;
let isFarcasterUser = false;
let walletAddress = null;
let loginToken = null;
let tokenGateStatus = { hasAccess: false, checked: false };

// ─── SDK Init ───────────────────────────────────────────
export async function initFarcaster() {
  try {
    const sdkModule = await import('@farcaster/miniapp-sdk');
    sdk = sdkModule.sdk;
    console.log('✅ SDK imported');

    try { await sdk.actions.ready(); } catch (e) {
      console.log('⚠️ ready():', e.message);
    }

    return null;
  } catch (err) {
    console.log('⚠️ Farcaster init error:', err.message);
    sdk = null;
  }
  return null;
}

// ─── Decode Quick Auth JWT → FID ────────────────────────
function decodeQuickAuthToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    console.log('📦 Quick Auth payload:', JSON.stringify(decoded).slice(0, 400));
    return decoded;
  } catch (e) {
    console.log('⚠️ JWT decode error:', e.message);
    return null;
  }
}

// ─── Fetch Farcaster username via server proxy ──────────
async function fetchFarcasterUsername(fid) {
  try {
    const res = await fetch(`${SERVER_URL}/api/farcaster/user/${fid}`);
    const data = await res.json();
    if (data.username) {
      console.log(`👤 Farcaster username: @${data.username} (FID: ${fid})`);
      return data.username;
    }
  } catch (e) {
    console.log('⚠️ Farcaster API error:', e.message);
  }
  return null;
}

// ─── Wallet Connection ──────────────────────────────────
export async function connectWallet() {
  try {
    walletAddress = await walletConnect();
    return walletAddress;
  } catch (err) {
    console.error('Wallet connect failed:', err);
    throw err;
  }
}

// ─── Auth Login ─────────────────────────────────────────
export async function login() {
  if (!walletAddress) return { error: 'Wallet not connected' };

  try {
    let quickAuthToken = null;

    // Get Quick Auth token from SDK (3s max — generous for cold SDK init)
    if (sdk) {
      try {
        const authPromise = sdk.quickAuth.getToken();
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
        const { token: qt } = await Promise.race([authPromise, timeoutPromise]);
        quickAuthToken = qt;
        console.log('🔑 Quick Auth token');

        // Decode JWT to get FID
        const payload = decodeQuickAuthToken(qt);
        if (payload && payload.sub) {
          const fid = parseInt(payload.sub, 10);
          
          // Fetch username from Hub API
          const username = await fetchFarcasterUsername(fid);
          
          farcasterUser = {
            fid: fid,
            username: username || `user${fid}`,
            displayName: username || '',
          };
          isFarcasterUser = true;
          console.log(`👤 @${farcasterUser.username} (FID: ${farcasterUser.fid})`);
        }
      } catch (e) {
        console.log('⚠️ Quick Auth error:', e.message);
      }
    }

    // Fallback mock user if no FC user resolved
    if (!farcasterUser) {
      farcasterUser = {
        fid: parseInt(walletAddress.slice(2, 10), 16),
        username: 'player',
        displayName: 'Player'
      };
      isFarcasterUser = false;
    }

    let authPayload = {
      fid: farcasterUser.fid,
      username: farcasterUser.username,
      wallet: walletAddress
    };

    if (quickAuthToken) {
      authPayload.quickAuthToken = quickAuthToken;
    }

    // Retry login up to 2x with backoff (Vercel cold start fix)
    let lastErr = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`🔄 Login retry ${attempt}...`);
          await new Promise(r => setTimeout(r, 1500 * attempt));
        }
        const data = await serverApi.loginWithToken(farcasterUser.fid, farcasterUser.username, walletAddress, quickAuthToken);
        
        if (data.token) {
          loginToken = data.token;
          serverApi.setAuthToken(data.token);
          localStorage.setItem('farborn_auth_token', loginToken);
          localStorage.setItem('farborn_auth_expires', data.expiresAt);
          localStorage.setItem('farborn_wallet', walletAddress);
          return { success: true, player: data.player };
        }
        // Server returned error (not network) — don't retry
        return data;
      } catch (e) {
        lastErr = e;
        console.warn(`⚠️ Login attempt ${attempt + 1} failed:`, e.message);
      }
    }

    // All retries exhausted
    console.error('Login failed after retries:', lastErr);
    return { error: 'Network error — server may be offline' };
  } catch (err) {
    console.error('Login failed:', err);
    return { error: 'Network error — server may be offline' };
  }
}

// ─── Token Gate ─────────────────────────────────────────
export async function checkTokenGate() {
  if (!walletAddress) {
    tokenGateStatus = { hasAccess: false, checked: true, reason: 'No wallet' };
    return tokenGateStatus;
  }
  try {
    const tokenAddress = '0x4abD609B323ce6E7C0770E86d21E76BA00209DE2';
    const calldata = '0x70a08231' + walletAddress.toLowerCase().replace('0x', '').padStart(64, '0');
    const res = await fetch('https://mainnet.base.org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to: tokenAddress, data: calldata }, 'latest'] })
    });
    const data = await res.json();
    const balance = BigInt(data.result || '0x0');
    tokenGateStatus = { hasAccess: balance >= BigInt('1000000000000000000000'), checked: true, balance: Number(balance / BigInt('1000000000000000000')), gate: 1000 };
    return tokenGateStatus;
  } catch (err) {
    tokenGateStatus = { hasAccess: true, checked: true, error: err.message, bypass: true };
    return tokenGateStatus;
  }
}

// ─── Price / Convert / Sync ─────────────────────────────
export async function fetchPrices() {
  try { return await (await fetch(`${SERVER_URL}/api/prices`)).json(); }
  catch { return { currentPrice: 10000, sellPrice: 9500, buyPrice: 10500 }; }
}
export async function convertGold(goldAmount, level) {
  if (!loginToken) return { error: 'Not logged in' };
  try { return await (await fetch(`${SERVER_URL}/api/convert`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${loginToken}` }, body: JSON.stringify({ goldAmount, level }) })).json(); }
  catch { return { error: 'Network error' }; }
}
export async function syncPlayerState(gs) {
  if (!loginToken) return null;
  try {
    const updates = { level: gs.level, zone: gs.zone, gold: gs.gold, equipped: gs.equipped, bag: gs.inventory, class: gs.hero?.id };
    return await serverApi.updatePlayerState(updates);
  } catch { return null; }
}

// ─── Disconnect / Getters ───────────────────────────────
export function disconnect() {
  walletAddress = null; farcasterUser = null; isFarcasterUser = false;
  loginToken = null; tokenGateStatus = { hasAccess: false, checked: false };
  localStorage.removeItem('farborn_wallet');
  disconnectWallet().catch(() => {});
}
export function getUser() { return farcasterUser; }
export function isRealFarcasterUser() { return isFarcasterUser; }
export function getWallet() { return walletAddress; }
export function getToken() { return loginToken; }
export function getGateStatus() { return tokenGateStatus; }
export function isLoggedIn() { return !!loginToken; }
export function checkStoredAuth() {
  const token = localStorage.getItem('farborn_auth_token');
  const expires = localStorage.getItem('farborn_auth_expires');
  const wallet = localStorage.getItem('farborn_wallet');
  if (token && expires && new Date(expires) > new Date()) {
    loginToken = token;
    if (wallet) walletAddress = wallet;
    return true;
  }
  return false;
}
