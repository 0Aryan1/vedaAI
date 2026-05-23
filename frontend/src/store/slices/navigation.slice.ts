import { create } from "zustand";

type NavigationState = {
  currentHash: string;
  setHash: (hash: string) => void;
  getCurrentSection: () => string;
};

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentHash: "",
  
  setHash: (hash: string) => {
    set({ currentHash: hash });
    // Sync with URL only on client
    if (typeof window !== "undefined") {
      window.location.hash = hash;
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
    useNavigationStore.setState({ currentHash: window.location.hash });
  });

  // Listen to hash changes in the browser
  const handleHashChange = () => {
    useNavigationStore.setState({ currentHash: window.location.hash });
  };
  window.addEventListener("hashchange", handleHashChange);
}
