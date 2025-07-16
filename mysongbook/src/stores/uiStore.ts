import { create } from 'zustand';

export interface UIStore {
  // 상태
  isDarkMode: boolean;
  isTagDropdownOpen: boolean;
  isAdmin: boolean;
  mode: 'edit' | 'read';

  // 액션
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  setTagDropdownOpen: (isOpen: boolean) => void;
  setMode: (mode: 'edit' | 'read') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // 초기 상태
  isDarkMode: false,
  isTagDropdownOpen: false,
  isAdmin: false,
  mode: 'read',

  // 액션
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: (isDark) => set({ isDarkMode: isDark }),
  setTagDropdownOpen: (isOpen) => set({ isTagDropdownOpen: isOpen }),
  setMode: (mode) => set({ mode }),
}));