"use client";

import { Bold, Heading2, Heading3, Italic, Link as LinkIcon, List, ListOrdered } from "lucide-react";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NodeEditorProps extends Omit<React.ComponentProps<"div">, "onChange" | "content"> {
  content: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  isActive,
  onClick,
  children,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(isActive && "bg-surface-hover")}
    >
      {children}
    </Button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-border p-1">
      <ToolbarButton
        label="Bold"
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        isActive={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        isActive={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 />
      </ToolbarButton>
      <ToolbarButton
        label="Bullet list"
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        isActive={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered />
      </ToolbarButton>
      <ToolbarButton
        label="Link"
        isActive={editor.isActive("link")}
        onClick={() => {
          const url = window.prompt("Link URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      >
        <LinkIcon />
      </ToolbarButton>
    </div>
  );
}

export function NodeEditor({ content, onChange, className, ...props }: NodeEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "min-h-48 rounded-b-lg px-3 py-2 text-body focus:outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("rounded-lg border border-input", className)} {...props}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
