// "use client";

// import { BlockNoteView } from "@blocknote/shadcn";
// import "@blocknote/core/style.css";
// import "@blocknote/shadcn/style.css";
// import { PartialBlock } from "@blocknote/core";

// interface BlockNoteViewerProps {
//   content: PartialBlock[];
// }

// export default function BlockNoteViewer({ content }: BlockNoteViewerProps) {
//   return (
//     <BlockNoteView
//       editor={{
//         // 이 방식은 BlockNoteView가 내부에서 readonly용 에디터를 생성할 수 있도록 해줌
//         // 공식 문서 기준: `initialContent`만 넘기면 readonly로 동작
//         initialContent: content,
//         editable: false,
//       }}
//     />
//   );
// }