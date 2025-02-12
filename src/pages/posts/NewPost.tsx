import React, { useState, useRef } from 'react';
import {
    Save,
    Image,
    Link2,
    Eye,
    ArrowLeft,
    Bold,
    Italic,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Quote,
    Code,
    Undo,
    Redo,
    Plus,
    X,
    Twitter,
    Linkedin,
    Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import RichTextEditor from '../../components/Editor/TextEditor';

interface PostForm {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    categories: string[];
    tags: string[];
    seoTitle: string;
    seoDescription: string;
    status: 'draft' | 'published';
    author: {
        name: string;
        socials: {
            twitter: string;
            linkedin: string;
            website: string;
        }
    }
}

interface FormatAction {
    icon: React.ElementType;
    label: string;
    command: string;
    value?: string;
}

const initialPost: PostForm = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categories: [],
    tags: [],
    seoTitle: '',
    seoDescription: '',
    status: 'draft',
    author: {
        name: '',
        socials: {
            twitter: '',
            linkedin: '',
            website: ''
        }
    }
};

const formatActions: FormatAction[] = [
    { icon: Bold, label: 'Bold', command: 'bold' },
    { icon: Italic, label: 'Italic', command: 'italic' },
    { icon: Heading1, label: 'Heading 1', command: 'formatBlock', value: '<h1>' },
    { icon: Heading2, label: 'Heading 2', command: 'formatBlock', value: '<h2>' },
    { icon: List, label: 'Bullet List', command: 'insertUnorderedList' },
    { icon: ListOrdered, label: 'Numbered List', command: 'insertOrderedList' },
    { icon: AlignLeft, label: 'Align Left', command: 'justifyLeft' },
    { icon: AlignCenter, label: 'Align Center', command: 'justifyCenter' },
    { icon: AlignRight, label: 'Align Right', command: 'justifyRight' },
    { icon: Quote, label: 'Quote', command: 'formatBlock', value: '<blockquote>' },
    { icon: Code, label: 'Code', command: 'formatBlock', value: '<pre>' }
];

const availableCategories = [
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Writing' },
    { id: '3', name: 'Development' },
    { id: '4', name: 'Design' }
];

const availableTags = [
    { id: '1', name: 'React' },
    { id: '2', name: 'JavaScript' },
    { id: '3', name: 'Web Development' },
    { id: '4', name: 'UI/UX' }
];

const sampleMediaItems = [
    {
        id: '1',
        url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028',
        type: 'image',
        title: 'Sample Image 1',
        dimensions: '2400x1600'
    },
    {
        id: '2',
        url: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
        type: 'image',
        title: 'Sample Image 2',
        dimensions: '2400x1600'
    }
];

type MediaInsertMode = 'featured' | 'content';

export default function NewPost() {
    const [post, setPost] = useState<PostForm>(initialPost);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [mediaInsertMode, setMediaInsertMode] = useState<MediaInsertMode>('content');
    const editorRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // console.log("post >> ",editorRef)
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setPost(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, options } = e.target;
        const values = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        setPost(prev => ({ ...prev, [name]: values }));
    };

    const generateSlug = () => {
        const slug = post.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setPost(prev => ({ ...prev, slug }));
    };

    const handleFormat = (action: FormatAction) => {
        if (!editorRef.current) return;

        // Save the current selection
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        // Focus the editor
        editorRef.current.focus();

        // Restore the selection if it exists
        if (range) {
            selection?.removeAllRanges();
            selection?.addRange(range);
        }

        // Apply the formatting
        if (action.command === 'formatBlock') {
            // Handle block formatting specially
            document.execCommand('formatBlock', false, action.value);
        } else {
            document.execCommand(action.command, false, action.value || '');
        }

        // Update content in state
        if (editorRef.current) {
            setPost(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
        }
    };

    const openMediaLibrary = (mode: MediaInsertMode) => {
        setMediaInsertMode(mode);
        setShowMediaLibrary(true);
    };

    const handleMediaSelect = (mediaUrl: string) => {
        if (mediaInsertMode === 'featured') {
            setPost(prev => ({ ...prev, featuredImage: mediaUrl }));
        } else {
            const img = `
        <figure class="my-8">
          <img 
            src="${mediaUrl}" 
            alt="Article image" 
            class="w-full rounded-lg object-cover"
            style="aspect-ratio: 16/9;"
          />
          <figcaption class="mt-2 text-center text-sm text-gray-500">
            Click to add caption
          </figcaption>
        </figure>
      `;

            if (editorRef.current) {
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = img;
                    range.insertNode(tempDiv.firstChild as Node);
                } else {
                    editorRef.current.innerHTML += img;
                }
                // Update content in state
                setPost(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
            }
        }

        setShowMediaLibrary(false);
    };

    const handleEditorChange = () => {
        if (editorRef.current) {
            console.log("editorRef.current >> ", editorRef.current.innerHTML)
            setPost(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
        }
    };

    const handleSave = (status: 'draft' | 'published') => {
        const postToSave = { ...post, status };
        console.log('Saving post:', postToSave);
        // Here you would typically make an API call to save the post
        navigate('/posts');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/posts"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-2xl font-semibold text-gray-900">New Post</h1>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => handleSave('draft')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={() => handleSave('published')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Publish
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={post.title}
                                    onChange={handleInputChange}
                                    onBlur={generateSlug}
                                    className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Enter post title"
                                />
                            </div>

                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    value={post.slug}
                                    onChange={handleInputChange}
                                    className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="post-url-slug"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                        Content
                                    </label>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => openMediaLibrary('content')}
                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <Image className="h-4 w-4 mr-2" />
                                            Add Media 
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <Link2 className="h-4 w-4 mr-2" />
                                            Add Link data
                                        </button>
                                    </div>
                                </div>
                                <div className="border border-gray-300 rounded-md">
                                    <div className="flex border-b border-gray-300">
                                        <button
                                            onClick={() => setActiveTab('editor')}
                                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'editor'
                                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Editor
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('preview')}
                                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'preview'
                                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                    {activeTab === 'editor' && (
                                        <>
                                            <RichTextEditor
                                                content={post.content}
                                                onChange={(content) => setPost(prev => ({ ...prev, content }))}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'preview' && (
                                        <div
                                            className="p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl"
                                            dangerouslySetInnerHTML={{ __html: post.content || '<p class="text-gray-400">Nothing to preview</p>' }}
                                        />
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                                    Excerpt
                                </label>
                                <textarea
                                    id="excerpt"
                                    name="excerpt"
                                    rows={3}
                                    value={post.excerpt}
                                    onChange={handleInputChange}
                                    className="mt-1 block p-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Write a brief excerpt..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h3>
                        {post.featuredImage ? (
                            <div className="relative group">
                                <img
                                    src={post.featuredImage}
                                    alt="Featured"
                                    className="w-full aspect-video object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => setPost(prev => ({ ...prev, featuredImage: '' }))}
                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => openMediaLibrary('featured')}
                                className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
                            >
                                <div className="text-center">
                                    <Image className="mx-auto h-12 w-12" />
                                    <span className="mt-2 block text-sm font-medium">
                                        Set Featured Image
                                    </span>
                                </div>
                            </button>
                        )}
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Categories & Tags</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                                    Categories
                                </label>
                                <select
                                    id="categories"
                                    name="categories"
                                    multiple
                                    value={post.categories}
                                    onChange={handleMultiSelect}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {availableCategories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                                    Tags
                                </label>
                                <select
                                    id="tags"
                                    name="tags"
                                    multiple
                                    value={post.tags}
                                    onChange={handleMultiSelect}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {availableTags.map(tag => (
                                        <option key={tag.id} value={tag.id}>
                                            {tag.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Author Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">
                                    Author Name
                                </label>
                                <input
                                    type="text"
                                    id="authorName"
                                    name="authorName"
                                    value={post.author?.name || ''}
                                    onChange={(e) => setPost(prev => ({
                                        ...prev,
                                        author: {
                                            ...prev.author,
                                            name: e.target.value
                                        }
                                    }))}
                                    className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Enter author name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Social Links
                                </label>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500">
                                            <Twitter className="h-5 w-5" />
                                        </span>
                                        <input
                                            type="url"
                                            value={post.author?.socials?.twitter || ''}
                                            onChange={(e) => setPost(prev => ({
                                                ...prev,
                                                author: {
                                                    ...prev.author,
                                                    socials: {
                                                        ...prev.author?.socials,
                                                        twitter: e.target.value
                                                    }
                                                }
                                            }))}
                                            className="flex-1 p-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Twitter profile URL"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500">
                                            <Linkedin className="h-5 w-5" />
                                        </span>
                                        <input
                                            type="url"
                                            value={post.author?.socials?.linkedin || ''}
                                            onChange={(e) => setPost(prev => ({
                                                ...prev,
                                                author: {
                                                    ...prev.author,
                                                    socials: {
                                                        ...prev.author?.socials,
                                                        linkedin: e.target.value
                                                    }
                                                }
                                            }))}
                                            className="flex-1 p-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="LinkedIn profile URL"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500">
                                            <Globe className="h-5 w-5" />
                                        </span>
                                        <input
                                            type="url"
                                            value={post.author?.socials?.website || ''}
                                            onChange={(e) => setPost(prev => ({
                                                ...prev,
                                                author: {
                                                    ...prev.author,
                                                    socials: {
                                                        ...prev.author?.socials,
                                                        website: e.target.value
                                                    }
                                                }
                                            }))}
                                            className="flex-1 p-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Personal website URL"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
                                    SEO Title
                                </label>
                                <input
                                    type="text"
                                    id="seoTitle"
                                    name="seoTitle"
                                    value={post.seoTitle}
                                    onChange={handleInputChange}
                                    className="mt-1 block p-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
                                    Meta Description
                                </label>
                                <textarea
                                    id="seoDescription"
                                    name="seoDescription"
                                    rows={3}
                                    value={post.seoDescription}
                                    onChange={handleInputChange}
                                    className="mt-1 block p-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Library Modal */}
            {showMediaLibrary && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowMediaLibrary(false)}
                        />
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                {mediaInsertMode === 'featured' ? 'Choose Featured Image' : 'Insert Media'}
                                            </h3>
                                            <button
                                                onClick={() => setShowMediaLibrary(false)}
                                                className="text-gray-400 hover:text-gray-500"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {sampleMediaItems.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleMediaSelect(item.url)}
                                                    className="group relative"
                                                >
                                                    <div className="aspect-video w-full overflow-hidden rounded-lg">
                                                        <img
                                                            src={item.url}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <div className="mt-2 flex items-start justify-between">
                                                        <div className="text-left">
                                                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                                            <p className="text-xs text-gray-500">{item.dimensions}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                            <button
                                                className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
                                            >
                                                <div className="text-center">
                                                    <Plus className="mx-auto h-8 w-8" />
                                                    <span className="mt-1 block text-sm font-medium">Upload New</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}