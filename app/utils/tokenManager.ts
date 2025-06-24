import { useState, useEffect } from 'react';

// Token management utility
const DEFAULT_TOKENS = 16000; // changed from 1600 to 16000

// Create a custom event for token updates
const TOKEN_UPDATE_EVENT = 'tokenUpdate';

const isBrowser = typeof window !== 'undefined';

export function getTokens(): number {
  if (!isBrowser) return DEFAULT_TOKENS;
  const tokens = localStorage.getItem('userTokens');
  return tokens ? parseInt(tokens) : DEFAULT_TOKENS;
}

export const setTokens = (tokens: number): void => {
  if (!isBrowser) return;
  localStorage.setItem('userTokens', tokens.toString());
  // Dispatch event when tokens are updated
  window.dispatchEvent(new CustomEvent(TOKEN_UPDATE_EVENT, { detail: tokens }));
};

export function deductTokens(amount: number): boolean {
  const currentTokens = getTokens();
  if (currentTokens >= amount) {
    setTokens(currentTokens - amount);
    return true;
  }
  return false;
}

export function addTokens(amount: number): void {
  const currentTokens = getTokens();
  setTokens(currentTokens + amount);
}

export const initializeTokens = (): void => {
  if (!isBrowser) return;
  const currentTokens = getTokens();

  // If tokens are less than DEFAULT_TOKENS, set to DEFAULT_TOKENS and mark as migrated
  if (currentTokens < DEFAULT_TOKENS) {
    setTokens(DEFAULT_TOKENS);
    localStorage.setItem('hasMigratedToNewTokens', 'true');
  }
};

// Create a custom hook for token updates
export const useTokenUpdate = () => {
  const [tokens, setTokens] = useState(getTokens());

  useEffect(() => {
    if (!isBrowser) return;
    
    // Initialize tokens on component mount
    initializeTokens();
    
    const handleTokenUpdate = (event: CustomEvent) => {
      setTokens(event.detail);
    };

    window.addEventListener(TOKEN_UPDATE_EVENT, handleTokenUpdate as EventListener);
    return () => {
      window.removeEventListener(TOKEN_UPDATE_EVENT, handleTokenUpdate as EventListener);
    };
  }, []);

  return tokens;
};