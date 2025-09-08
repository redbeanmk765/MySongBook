export interface Column {
  key: string;         // 내부 고유 ID
  header: string;      // 사용자 지정: '제목', '가수'
  isTag?: boolean;      // 태그 여부
  isFixed?: boolean;
  isHidden?: boolean; // 숨김 여부
  widthRatio: number;       // 너비 (픽셀 단위)
  pixelWidth?: number; // 픽셀 단위 너비 (선택적)
}
