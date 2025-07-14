"use client";

import { useCreateBlockNote, BlockNoteViewRaw } from "@blocknote/react";
import "@blocknote/core/style.css";
import { PartialBlock } from "@blocknote/core";

interface BlockNoteEditorProps {
  content: PartialBlock[];
  onChange: (blocks: PartialBlock[]) => void;
}

export default function BlockNoteEditor({ content, onChange }: BlockNoteEditorProps) {
  const editor = useCreateBlockNote({ initialContent: content });

  return (
    <BlockNoteViewRaw
      editor={editor}
      onChange={() => {
        const blocks = editor.document;
        onChange(blocks);
      }}
    />
  );
}