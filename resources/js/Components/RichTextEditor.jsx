import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { useCallback, useEffect, useRef } from 'react';

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing your content...' }) {
    const fileInputRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Color,
            Highlight.configure({ multicolor: true }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3',
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    // Emit initial content on mount so parent form knows about it
    useEffect(() => {
        if (editor) {
            const html = editor.getHTML();
            if (html && html !== '<p></p>' && html !== '') {
                onChange(html);
            }
        }
    }, [editor]);

    const addImage = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleImageUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                editor?.chain().focus().setImage({ src: e.target.result }).run();
            };
            reader.readAsDataURL(file);
        }
        // Reset input
        e.target.value = '';
    }, [editor]);

    const addLink = useCallback(() => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor?.chain().focus().setLink({ href: url, target: '_blank' }).run();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({ onClick, active, children, title }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-2 rounded transition-colors ${
                active
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
            }`}
        >
            {children}
        </button>
    );

    const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-300">
                {/* History */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Undo (Ctrl+Z)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Redo (Ctrl+Y)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                    </svg>
                </ToolbarButton>

                <Divider />

                {/* Text Style */}
                <select
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'paragraph') {
                            editor.chain().focus().setParagraph().run();
                        } else if (value.startsWith('heading')) {
                            const level = parseInt(value.split('.')[1]);
                            editor.chain().focus().toggleHeading({ level }).run();
                        }
                    }}
                    defaultValue="paragraph"
                    className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100"
                    title="Text Style"
                >
                    <option value="paragraph">Normal</option>
                    <option value="heading.1">Heading 1</option>
                    <option value="heading.2">Heading 2</option>
                    <option value="heading.3">Heading 3</option>
                </select>

                <Divider />

                {/* Text Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    title="Bold (Ctrl+B)"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                        <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    title="Italic (Ctrl+I)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive('underline')}
                    title="Underline (Ctrl+U)"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive('strike')}
                    title="Strikethrough"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4H8M20 8H14M10 12a4 4 0 004 4c1.5 0 3-.5 4-2M6 16c0 2 2 4 6 4s6-2 6-4" />
                    </svg>
                </ToolbarButton>

                <Divider />

                {/* Highlight & Color */}
                <ToolbarButton
                    onClick={() => {
                        const color = window.prompt('Enter color (hex):', '#038c34');
                        if (color) {
                            editor.chain().focus().setColor(color).run();
                        }
                    }}
                    title="Text Color"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11 2L5 14h3l1.5-3h5L16 14h3L13 2h-2zm-1.5 8L12 5l2.5 5h-5z" />
                        <rect x="4" y="17" width="16" height="4" fill="#038c34" rx="1" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    active={editor.isActive('highlight')}
                    title="Highlight"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </ToolbarButton>

                <Divider />

                {/* Alignment */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    active={editor.isActive({ textAlign: 'left' })}
                    title="Align Left"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 4h18v2H3V4zm0 4h12v2H3V8zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    active={editor.isActive({ textAlign: 'center' })}
                    title="Align Center"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 4h18v2H3V4zm3 4h12v2H6V8zm-3 4h18v2H3v-2zm3 4h12v2H6v-2zm-3 4h18v2H3v-2z" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    active={editor.isActive({ textAlign: 'right' })}
                    title="Align Right"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 4h18v2H3V4zm6 4h12v2H9V8zm-6 4h18v2H3v-2zm6 4h12v2H9v-2zm-6 4h18v2H3v-2z" />
                    </svg>
                </ToolbarButton>

                <Divider />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM9 5h12M9 12h12M9 19h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 4h2v3H3V4zm0 6h2v3H3v-3zm0 6h2v3H3v-3zM9 5h12M9 12h12M9 19h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </ToolbarButton>

                <Divider />

                {/* Blockquote & Code */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    title="Quote"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    active={editor.isActive('codeBlock')}
                    title="Code Block"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive('code')}
                    title="Inline Code"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                    </svg>
                </ToolbarButton>

                <Divider />

                {/* Horizontal Rule */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Horizontal Line"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="2" rx="1" />
                    </svg>
                </ToolbarButton>

                {/* Image Upload */}
                <ToolbarButton
                    onClick={addImage}
                    title="Upload Image"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </ToolbarButton>

                {/* Link */}
                <ToolbarButton
                    onClick={addLink}
                    active={editor.isActive('link')}
                    title="Add Link"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </ToolbarButton>

                {/* Clear Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                    title="Clear Formatting"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M7 8h6M7 12h3" />
                    </svg>
                </ToolbarButton>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );
}
