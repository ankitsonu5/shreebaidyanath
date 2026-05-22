"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { 
  FaBold, FaItalic, FaUnderline, FaListUl, 
  FaListOl, FaLink, FaImage, FaUndo, FaRedo, FaCode
} from "react-icons/fa";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50/50 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all ${editor.isActive("bold") ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
      >
        <FaBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all ${editor.isActive("italic") ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
      >
        <FaItalic />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all ${editor.isActive("underline") ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
      >
        <FaUnderline />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1.5 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all ${editor.isActive("bulletList") ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
      >
        <FaListUl />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all ${editor.isActive("orderedList") ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
      >
        <FaListOl />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1.5 self-center" />
      <button
        type="button"
        onClick={setLink}
        className={`p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all ${editor.isActive("link") ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
      >
        <FaLink />
      </button>
      <button
        type="button"
        onClick={addImage}
        className="p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500"
      >
        <FaImage />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1.5 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500"
      >
        <FaUndo />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500"
      >
        <FaRedo />
      </button>
    </div>
  );
};

export default function TiptapEditor({ content, onChange }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: "Start writing your blog post here...",
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content if it changes externally (e.g., when blog data is loaded)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!mounted) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all bg-white shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-[400px] outline-none"
      />
    </div>
  );
}
