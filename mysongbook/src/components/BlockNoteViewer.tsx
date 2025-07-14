"use client";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

export default function BlockNoteViewer({ content }) {
  const editor = useBlockNote({ initialContent: content, editable: false });
  return <BlockNoteView editor={editor} theme="light" />;
}
