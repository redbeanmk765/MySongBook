import { StateCreator } from 'zustand';
import { ChangeLog } from '@/types/ChangeLog';
import { useHistoryStore } from '@/stores/historyStore';
import { RowData } from '@/types/RowData';

// 기존 태그 색상 타입 정의
export interface TagColor {
  tag: string;
  backgroundColor: string;
  textColor: string;
}
export type TagColorList = TagColor[];

const initialTagColors: TagColorList = [
  { tag: 'K', backgroundColor: '#FF6B6B', textColor: '#FFFFFF' },
  { tag: 'J', backgroundColor: '#F39C12', textColor: '#FFFFFF' },
  { tag: 'E', backgroundColor: '#45B7D1', textColor: '#FFFFFF' },
  { tag: 'C', backgroundColor: '#96CEB4', textColor: '#FFFFFF' },
  { tag: 'VOCALOID', backgroundColor: '#4ECDC4', textColor: '#FFFFFF' },
  { tag: 'default', backgroundColor: '#95A5A6', textColor: '#FFFFFF' },
];

// 통합된 TagSlice 인터페이스
export interface TagSlice {
  tagColors: TagColorList;
  renameTag: (oldTag: string, newTag: string) => void;
  changeTagColor: (tag: string, newColor: Partial<Omit<TagColor, 'tag'>>) => void;
  setTagColors: (colors: TagColorList) => void;
  getTagNames: () => string[];
  addTag: (newTag: TagColor) => void;
  removeTag: (tag: string) => void;
  getTagColor: (tag: string) => TagColor;
}

export const createTagSlice: StateCreator<any, [], [], TagSlice> = (set, get) => ({
  tagColors: initialTagColors,
  
 renameTag: (oldTag, newTag) => {
    useHistoryStore.getState().push({ type: "renameTag", oldTag, newTag });

    set((state: any) => {
      return {
        // 기존 태그 색상 배열에서 변경
        tagColors: state.tagColors.map((item: TagColor) =>
          item.tag === oldTag ? { ...item, tag: newTag } : item
        ),
        // 데이터 스토어에서도 변경 (기존 로직과 동일)
        data: state.data.map((row: RowData) => row.tag === oldTag ? { ...row, tag: newTag } : row),
      };
    });
  },
  
  changeTagColor: (tag, newColor) => {
    set((state: any) => {
      return {
        tagColors: state.tagColors.map((item: TagColor) =>
          item.tag === tag ? { ...item, ...newColor } : item
        ),
      };
    });
  },

  setTagColors: (colors) => {
    set({ tagColors: colors });
  },

  getTagNames: () => get().tagColors.map((item: TagColor) => item.tag).filter((tag: string) => tag !== 'default'),

  addTag: (newTag: TagColor) => {
    set((state: any) => ({
      tagColors: [...state.tagColors, newTag],
    }));
  },

  removeTag: (tag: string) => {
    set((state: any) => ({
      tagColors: state.tagColors.filter((item: TagColor) => item.tag !== tag),
    }));
  },

  getTagColor: (tag: string)=> {
    const { tagColors } = get();
    return tagColors.find((item: TagColor) => item.tag === tag) || tagColors.find((item: TagColor) => item.tag === 'default')!;
  }
}); 