import { create } from 'zustand';

type Mode = 'read' | 'edit';

interface UIStore {
  // 상태
  isDarkMode: boolean;
  isTagDropdownOpen: boolean;
  isAdmin: boolean;
  mode: Mode;
  
  // 액션
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  setTagDropdownOpen: (isOpen: boolean) => void;
  setAdminStatus: (isAdmin: boolean) => void;
  setMode: (mode: Mode) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // 초기 상태
  isDarkMode: false,
  isTagDropdownOpen: false,
  isAdmin: true, 
  mode: 'edit',  

  // 액션
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: (isDark) => set({ isDarkMode: isDark }),
  setTagDropdownOpen: (isOpen) => set({ isTagDropdownOpen: isOpen }),
  setAdminStatus: (isAdmin) => set({ isAdmin }),
  setMode: (mode) => set({ mode }),
})); 