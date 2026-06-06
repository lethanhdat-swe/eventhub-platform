import { useEffect, useRef, useState } from 'react';

import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';

import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import ImageResize from 'tiptap-extension-resize-image';

import { ImagePlus } from 'lucide-react';
import { uploadService } from '@/lib/services/upload/uploadService';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

const content = '<p></p>';

function UploadImageControl({ editor }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !editor) return;

    try {
      setUploading(true);

      const uploaded = await uploadService.uploadImage(file);
      const imageUrl = resolvePublicAssetUrl(uploaded.url);

      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: file.name,
          title: file.name,
        })
        .run();
    } catch (error) {
      console.error('Upload image failed:', error);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <>
      <RichTextEditor.Control
        type="button"
        disabled={uploading || !editor}
        onClick={() => inputRef.current?.click()}
        title={uploading ? 'Đang tải ảnh...' : 'Tải ảnh lên'}
        aria-label="Tải ảnh lên"
      >
        <ImagePlus size={16} strokeWidth={1.8} />
      </RichTextEditor.Control>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleUploadImage}
      />
    </>
  );
}

function RichTextEditorComponent({
  value = content,
  onChange,
  minHeight = 240,
  disabled = false,
}) {
  const editor = useEditor({
    editable: !disabled,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ link: false }),
      Link,
      ImageResize.configure({
        inline: false,
      }),
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();
    const nextHtml = value || '';

    if (currentHtml !== nextHtml) {
      editor.commands.setContent(nextHtml, false);
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(!disabled);
  }, [editor, disabled]);

  return (
    <div
      className={
        disabled
          ? 'eventhub-rich-text-editor opacity-60'
          : 'eventhub-rich-text-editor'
      }
    >
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Link />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
            <UploadImageControl editor={editor} />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignRight />
            <RichTextEditor.AlignJustify />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content style={{ minHeight }} />
      </RichTextEditor>
    </div>
  );
}

export default RichTextEditorComponent;
