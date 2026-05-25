import { create } from "zustand";

type NavigationState = {
  currentHash: string;
  setHash: (hash: string) => void;
  getCurrentSection: () => string;
};

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentHash: "",
  
  setHash: (hash: string) => {
    // Always normalize hash to include '#' prefix
    const normalizedHash = hash.startsWith('#') ? hash : '#' + hash;
    
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
    const hash = get().currentHash;
    // Extract section from hash (e.g., "#home" -> "home")
    return hash.replace("#", "") || "home";
  },
}));

// Initialize from window.location.hash on client mount only
if (typeof window !== "undefined") {
  // Use microtask to defer initialization after hydration
  Promise.resolve().then(() => {
    useNavigationStore.setState({ currentHash: window.location.hash || '#home' });
  });

  // Listen to hash changes in the browser
  const handleHashChange = () => {
    const newHash = window.location.hash || '#home';
    useNavigationStore.setState({ currentHash: newHash });
  };
  window.addEventListener("hashchange", handleHashChange);
}
