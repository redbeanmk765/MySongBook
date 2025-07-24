import { ChangeLog } from "@/types/ChangeLog";


export const performUndo = (log: ChangeLog) => {
    switch (log.type) {
        case "addRow":
            // 로우 추가 취소
            // 예: 데이터에서 해당 로우 제거
            break;
        case "deleteRow":
            // 로우 삭제 취소
            // 예: 데이터에 해당 로우 다시 추가
            break;
        case "updateRow":
            // 로우 업데이트 취소
            // 예: 이전 상태로 되돌리기
            break;
        case "addColumn":
            // 컬럼 추가 취소
            // 예: 컬럼 제거
            break;
        case "deleteColumn":
            // 컬럼 삭제 취소
            // 예: 컬럼 다시 추가
            break;
        case "updateColumnHeader":
            // 컬럼 헤더 업데이트 취소
            // 예: 이전 헤더로 되돌리기
            break;
        case "renameTag":
            // 태그 이름 변경 취소
            // 예: 이전 태그 이름으로 되돌리기
            break;
        case "changeTagColor":
            // 태그 색상 변경 취소
            // 예: 이전 색상으로 되돌리기
            break;
    }
}

export const performRedo = (log: ChangeLog) => {
    switch (log.type) {
        case "addRow":
            // 로우 추가 다시 실행
            // 예: 데이터에 해당 로우 추가
            break;
        case "deleteRow":
            // 로우 삭제 다시 실행
            // 예: 데이터에서 해당 로우 제거
            break;
        case "updateRow":
            // 로우 업데이트 다시 실행
            // 예: 새로운 상태로 업데이트
            break;
        case "addColumn":
            // 컬럼 추가 다시 실행
            // 예: 컬럼 다시 추가
            break;
        case "deleteColumn":
            // 컬럼 삭제 다시 실행
            // 예: 컬럼 제거
            break;
        case "updateColumnHeader":
            // 컬럼 헤더 업데이트 다시 실행
            // 예: 새로운 헤더로 업데이트
            break;
        case "renameTag":
            // 태그 이름 변경 다시 실행
            // 예: 새로운 태그 이름으로 변경
            break;
        case "changeTagColor":
            // 태그 색상 변경 다시 실행
            // 예: 새로운 색상으로 변경
            break;
    }

}