import { useEffect, useState } from 'react';
import { Upload, Search, Filter , Film, FileText, Edit, Trash2, Plus, X, Copy } from 'lucide-react';
import type { MediaItem } from '../../types';
import axios from 'axios';
import { BACKEND_URL } from '../../utils';
import toast, { Toaster } from 'react-hot-toast';

interface MediaFilter {
  search: string;
  type: 'all' | 'image' | 'video' | 'document';
  sortBy: 'date' | 'name' | 'size';
}

const mediaItems: MediaItem[] = [
  {
    _id: '1',
    url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    title: 'Nature Landscape',
    type: "image",
    altText: 'Beautiful mountain landscape',
    uploadedAt: '2024-03-10',
    size: '2.4 MB',
    dimensions: '2400x1600'
  },
  {
    _id: '2',
    url: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    title: 'City View',
    type: "image",
    altText: 'Modern city skyline',
    uploadedAt: '2024-03-09',
    size: '1.8 MB',
    dimensions: '2000x1333'
  }
];

export default function MediaLibrary() {
  const [filter, setFilter] = useState<MediaFilter>({
    search: '',
    type: 'all',
    sortBy: 'date'
  });
  const [mediaImages, setMediaImages] = useState<MediaItem[]>(mediaItems);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

  const [newMediaTitle, setNewMediaTitle] = useState('Title');
  const [newMediaAltText, setNewMediaAltText] = useState('Alt Text');
  const [newMediaFile, setNewMediaFile] = useState<File | null>(null);

  const filteredMedia = mediaImages.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(filter.search.toLowerCase());
    const matchesType = filter.type === 'all' || item.type === filter.type;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    switch (filter.sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'date':
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      default:
        return 0;
    }
  });

  function showMediaUpdateModel() {
    setNewMediaAltText("")
    setNewMediaTitle("")
    setNewMediaFile(null)
    setShowUploadModal(true)
  }

  async function fetchMediaImages() {
    try {
      const response = await axios.get(`${BACKEND_URL}/image`)
      const imagedata = response.data.data
      setMediaImages(imagedata)
      console.log(response.data)
    } catch (e: any) {
      console.log("Error while fetching images", e)
    }
  }

  useEffect(() => {
    fetchMediaImages()
  }, [])

  const handleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleDelete = async (idArray: string[]) => {
    if (confirm(`Are you sure you want to delete ${idArray.length} item(s)?`)) {
      // Here you would typically make an API call to delete the items
      try {
        const response = await axios.post(`${BACKEND_URL}/image/delete`, { idArray }, {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        })
        console.log("Deleted successfully", response.data)
        setMediaImages(prev => prev.filter(item => !idArray.includes(item._id)))
      } catch (e: any) {
        console.log("Error while deleting media image ", e)
      }
      console.log('Deleting items:', idArray);
      setSelectedItems([]);
    }
  };

  async function saveChangesHandler() {
    if (editingItem) {
      try {
        const response = await axios.put(`${BACKEND_URL}/image/${editingItem._id}`,
          {
            title: editingItem.title,
            altText: editingItem.altText
          },
          {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
        setMediaImages(prev => prev.map(item => item._id === editingItem._id ? response.data.data : item))
        console.log("Changes saved successfully", response.data.data)
      } catch (Err: any) {
        console.log("Error while saving changes", Err)
        alert("Error while saving changes")
      } finally {
        console.log("Changes saved successfully")
        setShowEditModal(false);
      }
    }
  }

  async function fileUploadHandler() {
    if (!newMediaFile) {
      alert("Please select a file to upload")
      return
    }
    if (!newMediaTitle || newMediaTitle.trim() === "" || !newMediaAltText || newMediaAltText.trim() === "") {
      alert("Please enter a title and alt text")
      return
    }
    const formData = new FormData()
    formData.append('image', newMediaFile)
    formData.append('title', newMediaTitle)
    formData.append('altText', newMediaAltText)
    try {
      const response = await axios.post(`${BACKEND_URL}/image/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      const fileResponseData = response.data.data
      console.log("File uploaded successfully", fileResponseData)
      setMediaImages(prev => [...prev, fileResponseData])
    } catch (Err: any) {
      console.log("Error while uploading file", Err)
    } finally {
      setShowUploadModal(false)
    }
  }

  function onCopyHandler(url: string) {
    navigator.clipboard.writeText(url)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Media Library</h1>
        <div className="flex space-x-3">
          {selectedItems.length > 0 && (
            <button
              onClick={() => handleDelete(selectedItems)}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </button>
          )}
          <button
            onClick={showMediaUpdateModel}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search media..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>
          <select
            value={filter.sortBy}
            onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.map((item) => (
          <div
            key={item._id}
            className={`group relative bg-white rounded-lg shadow-sm overflow-hidden ${selectedItems.includes(item._id) ? 'ring-2 ring-indigo-500' : ''
              }`}
          >
            <div className="aspect-video relative">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.altText}
                  className="object-cover w-full h-full"
                />
              ) : item.type === 'video' ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Film className="h-8 w-8 text-gray-400" />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete([item._id])}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                    <button
                      onClick={() => onCopyHandler(item.url)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <Copy className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleSelect(item._id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded opacity-0 group-hover:opacity-100 checked:opacity-100"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
              <div className="mt-1 flex justify-between text-sm text-gray-500">
                <span>{item.size}</span>
                <span>{item.dimensions}</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(item.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        <button
          onClick={showMediaUpdateModel}
          className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          <div className="text-center">
            <Plus className="mx-auto h-8 w-8" />
            <span className="mt-2 block text-sm font-medium">Upload New</span>
          </div>
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowUploadModal(false)}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Upload Media
                      </h3>
                      <button
                        onClick={() => setShowUploadModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className='space-y-4'>
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={newMediaTitle}
                          onChange={(e) => {
                            setNewMediaTitle(e.target.value);
                          }}
                          className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="alt-text" className="block text-sm font-medium text-gray-700">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          id="alt-text"
                          name="altText"
                          value={newMediaAltText}
                          onChange={(e) => {
                            setNewMediaAltText(e.target.value);
                          }}
                          className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div
                      className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        // Handle file drop
                      }}
                    >
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={(e) => {
                                setNewMediaFile(e.target.files?.[0] || null);
                              }}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    <div className='flex justify-center'>
                      <button
                        onClick={fileUploadHandler}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >Upload</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowEditModal(false)}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Edit Media
                      </h3>
                      <button
                        onClick={() => setShowEditModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={editingItem.title}
                          onChange={(e) => {
                            setEditingItem(prev => ({
                              ...prev!,
                              title: e.target.value
                            }));
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="alt-text" className="block text-sm font-medium text-gray-700">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          id="alt-text"
                          name="altText"
                          value={editingItem.altText || ''}
                          onChange={(e) => {
                            setEditingItem(prev => ({
                              ...prev!,
                              altText: e.target.value
                            }));
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowEditModal(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveChangesHandler}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Save Changes
                        </button>
                      </div>
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