"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/style.css";
import "@blocknote/shadcn/style.css";
import { PartialBlock } from "@blocknote/core";
import { ko } from "@blocknote/core/locales"; 

interface BlockNoteEditorProps {
  content: PartialBlock[];
  onChange?: (blocks: PartialBlock[]) => void;
  editable?: boolean;
}

export default function BlockNoteEditor({ content, onChange, editable = false,}: BlockNoteEditorProps) {
  const editor = useCreateBlockNote({ 
    initialContent: content,
    dictionary: ko,
  });

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      onChange={() => {
        if (editable && onChange) {
          onChange(editor.document);
        }
      }}
    />
  );
}