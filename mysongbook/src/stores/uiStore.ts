import { create } from 'zustand';

interface UIStore {
  // 상태
  isDarkMode: boolean;
  isTagDropdownOpen: boolean;
  
  // 액션
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  setTagDropdownOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // 초기 상태
  isDarkMode: false,
  isTagDropdownOpen: false,

  // 액션
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: (isDark) => set({ isDarkMode: isDark }),
  setTagDropdownOpen: (isOpen) => set({ isTagDropdownOpen: isOpen }),
})); 