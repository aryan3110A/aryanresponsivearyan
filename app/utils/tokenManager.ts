import { useState, useEffect } from 'react';

// Token management utility
const DEFAULT_TOKENS = 1600;
const TOKENS_PER_GENERATION = 40;

// Create a custom event for token updates
const TOKEN_UPDATE_EVENT = 'tokenUpdate';

const isBrowser = typeof window !== 'undefined';

export const getTokens = (): number => {
  if (!isBrowser) return DEFAULT_TOKENS;
  const tokens = localStorage.getItem('userTokens');
  return tokens ? parseInt(tokens) : DEFAULT_TOKENS;
};

export const setTokens = (tokens: number): void => {
  if (!isBrowser) return;
  localStorage.setItem('userTokens', tokens.toString());
  // Dispatch event when tokens are updated
  window.dispatchEvent(new CustomEvent(TOKEN_UPDATE_EVENT, { detail: tokens }));
};

export const deductTokens = (): boolean => {
  const currentTokens = getTokens();
  if (currentTokens >= TOKENS_PER_GENERATION) {
    setTokens(currentTokens - TOKENS_PER_GENERATION);
    return true;
  }
  return false;
};

export const addTokens = (amount: number): void => {
  const currentTokens = getTokens();
  setTokens(currentTokens + amount);
};

export const initializeTokens = (): void => {
  if (!isBrowser) return;
  if (!localStorage.getItem('userTokens')) {
    setTokens(DEFAULT_TOKENS);
  }
};

// Create a custom hook for token updates
export const useTokenUpdate = () => {
  const [tokens, setTokens] = useState(getTokens());

  useEffect(() => {
    if (!isBrowser) return;
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