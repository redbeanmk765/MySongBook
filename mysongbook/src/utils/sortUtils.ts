import { RowData } from '@/types/RowData';

export const sortData = (
  data: RowData[],
  sortKey: keyof RowData | null,
  sortDirection: "asc" | "desc"
): RowData[] => {
  if (!sortKey) return data;
  
  return [...data].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    const aIsEmpty = aValue === "";
    const bIsEmpty = bValue === "";

    // 빈 값 처리: 빈 값은 항상 마지막에 오도록
    if (aIsEmpty && !bIsEmpty) return 1;
    if (!aIsEmpty && bIsEmpty) return -1;

    // 1순위: sortKey(기본값은 "tag")
    let primaryCompare = 0;
    if (typeof aValue === "string" && typeof bValue === "string") {
      primaryCompare = aValue.localeCompare(bValue, "ko", { 
        numeric: true, 
        sensitivity: "base" 
      });
    }

    // 2순위: singer
    if (primaryCompare === 0) {
      const aSinger = a.singer;
      const bSinger = b.singer;
      const aSingerEmpty = aSinger === "";
      const bSingerEmpty = bSinger === "";

      if (aSingerEmpty && !bSingerEmpty) return 1;
      if (!aSingerEmpty && bSingerEmpty) return -1;

      primaryCompare = aSinger.localeCompare(bSinger, "ko", { 
        numeric: true, 
        sensitivity: "base" 
      });
    }

    // 3순위: name
    if (primaryCompare === 0) {
      const aName = a.name;
      const bName = b.name;
      const aNameEmpty = aName === "";
      const bNameEmpty = bName === "";

      if (aNameEmpty && !bNameEmpty) return 1;
      if (!aNameEmpty && bNameEmpty) return -1;

      primaryCompare = aName.localeCompare(bName, "ko", { 
        numeric: true, 
        sensitivity: "base" 
      });
    }

    return sortDirection === "asc" ? primaryCompare : -primaryCompare;
  });
}; 