export interface TagColor {
    tag: string;
    backgroundColor: string;
    textColor: string;
  }
  
  export type TagColorMap = Record<string, TagColor>;
  
  // 기본 태그 색상 설정
  export const defaultTagColors: TagColorMap = {
    'K': {
      tag: 'K',
      backgroundColor: '#FF6B6B',
      textColor: '#FFFFFF'
    },
    'J': {
      tag: 'J',
      backgroundColor: '#4ECDC4',
      textColor: '#FFFFFF'
    },
    'E': {
      tag: 'E',
      backgroundColor: '#45B7D1',
      textColor: '#FFFFFF'
    },
    'C': {
      tag: 'C',
      backgroundColor: '#96CEB4',
      textColor: '#FFFFFF'
    },
    'default': {
      tag: 'default',
      backgroundColor: '#95A5A6',
      textColor: '#FFFFFF'
    }
  };
  
  // 태그 색상 가져오기 함수
  export const getTagColor = (tag: string, customColors?: TagColorMap): TagColor => {
    const colors = customColors || defaultTagColors;
    return colors[tag] || colors['default'];
  }; 