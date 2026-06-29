// ═══════════════════════════════════════════════════════════
//  WALLET CONNECTOR — using Wagmi
//  Docs: https://miniapps.farcaster.xyz/docs/guides/wallets
// ═══════════════════════════════════════════════════════════

import { http, createConfig, getAccount, connect, disconnect, switchChain } from '@wagmi/core';
import { base } from '@wagmi/core/chains';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

// ─── Wagmi Config ───────────────────────────────────────
export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    farcasterMiniApp()
  ],
});

// ─── Connect Wallet ─────────────────────────────────────
// In Farcaster: automatically connects to user's wallet
// In Browser: falls back to injected wallet (MetaMask etc)
export async function connectWallet() {
  // Check if already connected
  let account = getAccount(wagmiConfig);
  if (account.isConnected && account.address) {
    console.log(`🔗 Already connected: ${account.address}`);
    return account.address;
  }

  try {
    // Try Farcaster Mini App connector first
    await connect(wagmiConfig, { connector: wagmiConfig.connectors[0] });
    account = getAccount(wagmiConfig);
    if (account.address) {
      console.log(`🔗 Connected via Wagmi: ${account.address}`);
      return account.address;
    }
  } catch (err) {
    console.warn('⚠️ Wagmi connect failed:', err.message);
  }

  // Fallback: check if any injected wallet exists (browser mode)
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Use injected connector if available
      const { injected } = await import('@wagmi/connectors/injected');
      const injConnector = injected();
      await connect(wagmiConfig, { connector: injConnector });
      account = getAccount(wagmiConfig);
      if (account.address) {
        console.log(`🔗 Connected via injected: ${account.address}`);
        return account.address;
      }
    } catch (err) {
      console.warn('⚠️ Injected connect failed:', err.message);
    }
  }

  throw new Error('NO_WALLET');
}

// ─── Disconnect ─────────────────────────────────────────
export async function disconnectWallet() {
  try {
    await disconnect(wagmiConfig);
  } catch {}
}

// ─── Sign Message ───────────────────────────────────────
export async function signMessage(message) {
  const account = getAccount(wagmiConfig);
  if (!account.address) throw new Error('NO_WALLET');

  const { signMessage: wagmiSign } = await import('@wagmi/core');
  return wagmiSign(wagmiConfig, { message });
}

// ─── Raw Request ────────────────────────────────────────
export async function rawRequest(method, params) {
  const account = getAccount(wagmiConfig);
  if (!account.connector) return null;
  return account.connector.request({ method, params });
}

// ─── Switch to Base ─────────────────────────────────────
export async function switchToBase() {
  try {
    await switchChain(wagmiConfig, { chainId: base.id });
  } catch (err) {
    console.warn('⚠️ Switch chain failed:', err.message);
  }
}

// ─── Get current address ────────────────────────────────
export function getCurrentAddress() {
  const account = getAccount(wagmiConfig);
  return account.address || null;
}

export function isConnected() {
  const account = getAccount(wagmiConfig);
  return account.isConnected;
}
