import { StateCreator } from 'zustand';
import { ChangeLog } from '@/types/ChangeLog';
import { useHistoryStore } from '@/stores/historyStore';
import { RowData } from '@/types/RowData';

export interface TagSlice {
    tags: { [key: string]: string };
    renameTag: (oldTag: string, newTag: string) => void;
    changeTagColor: (tag: string, newColor: string) => void;
}

// T에 전체 스토어 타입이 들어갑니다.
export const createTagSlice: StateCreator<any, [], [], TagSlice> = (set, get) => ({
    tags: {},
    
    renameTag: (oldTag, newTag) => {
        useHistoryStore.getState().push({ type: "renameTag", oldTag, newTag });
        set((state: any) => ({
            data: state.data.map((row: RowData) => row.tag === oldTag ? { ...row, tag: newTag } : row)
        }));
    },
    
    changeTagColor: (tag, newColor) => {
        const { tags } = get();
        const prevColor = tags[tag];
        useHistoryStore.getState().push({ type: "changeTagColor", tag, prevColor, newColor });
        set({ tags: { ...tags, [tag]: newColor } });
    }
});