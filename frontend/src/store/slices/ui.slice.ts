import { create } from "zustand";

type UIState = {
  openDropdown: "notifications" | "profile" | null;
  mobileMenuOpen: boolean;
  setOpenDropdown: (dropdown: "notifications" | "profile" | null) => void;
  toggleDropdown: (dropdown: "notifications" | "profile") => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
};

export const useUIStore = create<UIState>((set, get) => ({
  openDropdown: null,
  mobileMenuOpen: false,

  setOpenDropdown: (dropdown) => set({ openDropdown: dropdown }),

  toggleDropdown: (dropdown) => {
    const current = get().openDropdown;
    set({ openDropdown: current === dropdown ? null : dropdown });
  },

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
}));
