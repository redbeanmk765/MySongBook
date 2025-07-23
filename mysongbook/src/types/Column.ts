export interface Column {
  key: string;         // 내부 고유 ID
  header: string;      // 사용자 지정: '제목', '가수'
  isTag?: boolean;      // 태그 여부
  isFixed?: boolean;
}
