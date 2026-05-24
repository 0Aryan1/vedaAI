import { create } from "zustand";

type UIState = {
  openDropdown: "notifications" | "profile" | null;
  mobileMenuOpen: boolean;
  isGenerating: boolean;
  generationError: string | null;
  setOpenDropdown: (dropdown: "notifications" | "profile" | null) => void;
  toggleDropdown: (dropdown: "notifications" | "profile") => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setIsGenerating: (value: boolean) => void;
  setGenerationError: (error: string | null) => void;
  resetGenerationState: () => void;
};

export const useUIStore = create<UIState>((set, get) => ({
  openDropdown: null,
  mobileMenuOpen: false,
  isGenerating: false,
  generationError: null,

  setOpenDropdown: (dropdown) => set({ openDropdown: dropdown }),

  toggleDropdown: (dropdown) => {
    const current = get().openDropdown;
    set({ openDropdown: current === dropdown ? null : dropdown });
  },

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  setIsGenerating: (value) => set({ isGenerating: value }),

  setGenerationError: (error) => set({ generationError: error }),

  resetGenerationState: () => set({ isGenerating: false, generationError: null }),
}));
