// zustand store에서만 태그 색상 관리
export interface TagColor {
  tag: string;
  backgroundColor: string;
  textColor: string;
}

export type TagColorMap = Record<string, TagColor>;

const initialTagColors: TagColorMap = {
  'K': { tag: 'K', backgroundColor: '#FF6B6B', textColor: '#FFFFFF' },
  'J': { tag: 'J', backgroundColor: '#F39C12', textColor: '#FFFFFF' },
  'E': { tag: 'E', backgroundColor: '#45B7D1', textColor: '#FFFFFF' },
  'C': { tag: 'C', backgroundColor: '#96CEB4', textColor: '#FFFFFF' },
  'VOCALOID': { tag: 'VOCALOID', backgroundColor: '#4ECDC4', textColor: '#FFFFFF' },
  'default': { tag: 'default', backgroundColor: '#95A5A6', textColor: '#FFFFFF' },
};

import { create } from 'zustand';

interface TagColorStore {
  tagColors: TagColorMap;
  setTagColor: (tag: string, color: Partial<Omit<TagColor, 'tag'>>) => void;
  setTagColors: (colors: TagColorMap) => void;
  renameTag: (oldTag: string, newTag: string) => void
}

export const useTagColorStore = create<TagColorStore>((set, get) => ({
  tagColors: initialTagColors,

  setTagColor: (tag, color) => set((state) => ({
    tagColors: {
      ...state.tagColors,
      [tag]: {
        ...state.tagColors[tag],
        ...color,
        tag,
      },
    },
  })),

  setTagColors: (colors) => set({ tagColors: colors }),

  renameTag: (oldTag, newTag) => {
    const { tagColors } = get();
    if (!tagColors[oldTag]) return;

    const newTagColors: TagColorMap = { ...tagColors };
    newTagColors[newTag] = {
      ...newTagColors[oldTag],
      tag: newTag,
    };
    delete newTagColors[oldTag];
    set({ tagColors: newTagColors });
  },
})); 