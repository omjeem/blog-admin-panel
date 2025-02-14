import React, { useState, useRef, useEffect } from 'react';
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
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import RichTextEditor from '../../components/Editor/TextEditor';
import axios from 'axios';
import { BACKEND_URL } from '../../utils';
import { MediaItem } from '../../types';
import { MultiSelectCombobox } from '../../components/MultiSelectComboBox';
import toast, { Toaster } from 'react-hot-toast';
import Toggle from '../../components/Toggle';

export enum POST_STATUS {
    PUBLISHED = "published",
    DRAFT = "draft",
}


export interface PostForm {
    _id?: string;
    title: string;
    description: string;
    slug: string;
    featuredImage: string;
    content: string;
    status: POST_STATUS;
    views: number;
    isFeatured: boolean;
    likeCount: number;
    dislikeCount: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    tags: Tag[];
    authors: Author[]
    seoTitle: string;
    seoDescription: string;
    isDeleted?: boolean;
}

interface Tag {
    name: string;
    slug: string;
    isPrimary: boolean;
    blogs: string[];
    createdAt: Date;
}

interface Author {
    blogs?: [String],
    createdAt?: Date,
    isAdmin?: Boolean,
    name: String,
    _id?: String
}

const initialPost: PostForm = {
    _id: "",
    title: '',
    description: '',
    slug: '',
    featuredImage: '',
    content: '',
    status: POST_STATUS.DRAFT,
    views: 0,
    isFeatured: false,
    likeCount: 0,
    dislikeCount: 0,
    tags: [],
    authors: [],
    isDeleted: false,
    seoTitle: '',
    seoDescription: '',
};


type MediaInsertMode = 'featured' | 'content';

export default function NewPost() {
    const [post, setPost] = useState<PostForm>(initialPost);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [mediaInsertMode, setMediaInsertMode] = useState<MediaInsertMode>('content');
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

    const [isUpdate, setIsUpdate] = useState(false);

    const [allAuthors, setAllAuthors] = useState<string[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);


    async function fetchPostDetails() {
        const url = window.location.href;
        if (!url.endsWith("/admin/posts/new") || !url.endsWith("/admin/posts/new/")) {
            const postId = url.split("/").pop();
            console.log("Post ID is ", postId)
            try {
                const response = await axios.get(`${BACKEND_URL}/blogs/${postId}`, {
                    headers : {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const blogData = response.data.response
                console.log("Response is ", blogData)

                setIsUpdate(true)
                setPost(blogData)
            } catch (err: any) {
                console.log("Error while fetching the post", err)
            }

        }
    }

    useEffect(() => {
        fetchPostDetails()
    }, [])

    async function fetchAllTags() {
        try {
            const response = await axios.get(`${BACKEND_URL}/tags`)
            const tagsData = response.data.response
            setAllTags(tagsData)
        } catch (Err: any) {
            console.log("Error while fetching the tags", Err)
        }
    }

    async function fetchAllAuthors() {
        try {
            const response = await axios.get(`${BACKEND_URL}/authors`)
            const authorsData = response.data.response
            setAllAuthors(authorsData)
        } catch (Err: any) {
            console.log("Error while fetching the tags", Err)
        }
    }
    useEffect(() => {
        fetchAllTags()
        fetchAllAuthors()
    }, [])
    // const editorRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        console.log("Name is ", name, "Value is ", value)
        if (name === 'title') {
            const slug = generateSlug(value);
            setPost(prev => ({ ...prev, title: value, slug: slug }));
        } else {
            setPost(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, options } = e.target;
        const values = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        setPost(prev => ({ ...prev, [name]: values }));
    };

    async function fetchMediaImages() {
        try {
            const response = await axios.get(`${BACKEND_URL}/image`)
            const imagedata = response.data.data
            setMediaItems(imagedata)
            console.log(response.data)
        } catch (e: any) {
            console.log("Error while fetching images", e)
        }
    }


    useEffect(() => {
        fetchMediaImages()
    }, [])

    const generateSlug = (data: string) => {
        return data
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const openMediaLibrary = (mode: MediaInsertMode) => {
        setMediaInsertMode(mode);
        setShowMediaLibrary(true);
    };

    const handleMediaSelect = (mediaUrl: string) => {
        if (mediaInsertMode === "featured") {
            setPost(prev => ({ ...prev, featuredImage: mediaUrl }))
        }
        setShowMediaLibrary(false);
    };

    const handleSave = async (status: 'draft' | 'published') => {
        const postToSave = { ...post, status };
        delete postToSave.createdAt;
        delete postToSave._id;
        try {
            const response = await axios.post(`${BACKEND_URL}/blogs`, postToSave, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log("Response is ", response.data)
            toast.success("Post saved successfully")
            navigate('/admin/posts');
        } catch (err: any) {
            const message = err?.response?.data?.error
            if (message) {
                toast.error(message)
            } else {
                toast.error("Error while saving the post")
            }
            console.log("Error while saving the post", err)
        }
        console.log('Saving post:', postToSave);

    };

    const handleAuthorChange = (selectedOptions: { value: string; label: string }[]) => {
        const selectedAuthors = selectedOptions.map((option: any) => option)
        console.log("Selected Authors are ", selectedAuthors)
        setPost(prev => ({ ...prev, authors: selectedAuthors }))
    }

    const handleTagChange = (selectedOptions: { value: string; label: string }[]) => {
        const selectedTags = selectedOptions.map((option: any) => option)
        setPost(prev => ({ ...prev, tags: selectedTags }))
    }

    async function postupdateHandler() {
        try {
            const response = await axios.put(`${BACKEND_URL}/blogs/${post._id}`, post, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = response.data
            toast.success("Post updated successfully")
            console.log("Response is ", data)
        } catch (err: any) {
            const message = err?.response?.data?.error
            if (message) {
                toast.error(message)
            } else {
                toast.error("Error while saving the post")
            }
            console.log("Error while updating the post", err)
        }
    }

    console.log("Post is ", post.content)

    function postStatusChangeHandler(val: boolean) {
        if (val) {
            setPost(prev => ({ ...prev, status: POST_STATUS.PUBLISHED }))
        } else {
            setPost(prev => ({ ...prev, status: POST_STATUS.DRAFT }))
        }
    }

    return (
        <div className="space-y-6">
            <Toaster />
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/admin/posts"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-2xl font-semibold text-gray-900">New Post</h1>
                </div>
                {
                    !isUpdate ? (
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
                    ) : (
                        <div className="flex items-center space-x-3">

                            {
                                <div className='flex gap-3 font-semibold text-lg items-center'>
                                    <span>{post.status === POST_STATUS.PUBLISHED ? "Published" : "Draft"}</span>
                                    <Toggle initial={post.status === POST_STATUS.DRAFT ? false : true} onChange={postStatusChangeHandler} />
                                </div>
                            }
                            <button
                                onClick={postupdateHandler}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Update
                            </button>
                        </div>
                    )
                }

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
                                        {/* <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <Link2 className="h-4 w-4 mr-2" />
                                            Add Link data
                                        </button> */}
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
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={post.description}
                                    onChange={handleInputChange}
                                    className="mt-1 block p-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Write a brief description..."
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
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Authors & Tags</h3>
                        <div className="space-y-4">
                            <div className='space-y-2'>
                                <label >Authors</label>
                                <MultiSelectCombobox selectedOptionsTags={post.authors} options={allAuthors} placeholder="Select Author..." onChange={handleAuthorChange} />
                            </div>

                            <div className='space-y-2'>
                                <label >Tags</label>
                                <MultiSelectCombobox selectedOptionsTags={post.tags} options={allTags} placeholder="Select Tags..." onChange={handleTagChange} />
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
                                            {mediaItems.map((item) => (
                                                <button
                                                    key={item._id}
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
                                            {/* <button
                                                className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
                                            >
                                                <div className="text-center">
                                                    <Plus className="mx-auto h-8 w-8" />
                                                    <span className="mt-1 block text-sm font-medium">Upload New</span>
                                                </div>
                                            </button> */}
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