import { create } from "zustand";

type NavigationState = {
  currentHash: string;
  setHash: (hash: string) => void;
  getCurrentSection: () => string;
};

function normalizeHash(hash: string): string {
  const cleanHash = hash
    .split("#")
    .filter(Boolean)
    .at(-1);

  return cleanHash ? `#${cleanHash}` : "#home";
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentHash: "",
  
  setHash: (hash: string) => {
    const normalizedHash = normalizeHash(hash);
    
    // Only set if different from current hash to prevent duplicate sets
    const currentHash = get().currentHash;
    if (currentHash === normalizedHash) {
      return;
    }
    
    set({ currentHash: normalizedHash });
    // Sync with URL only on client - always replace, never append
    if (typeof window !== "undefined") {
      window.location.hash = normalizedHash;
    }
  },

  getCurrentSection: () => {
    return normalizeHash(get().currentHash).replace("#", "") || "home";
  },
}));

// Initialize from window.location.hash on client mount only
if (typeof window !== "undefined") {
  // Use microtask to defer initialization after hydration
  Promise.resolve().then(() => {
    const normalizedHash = normalizeHash(window.location.hash);
    useNavigationStore.setState({ currentHash: normalizedHash });
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${normalizedHash}`);
  });

  // Listen to hash changes in the browser
  const handleHashChange = () => {
    const normalizedHash = normalizeHash(window.location.hash);
    useNavigationStore.setState({ currentHash: normalizedHash });
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${normalizedHash}`);
  };
  window.addEventListener("hashchange", handleHashChange);
}
