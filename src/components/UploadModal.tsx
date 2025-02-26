import axios from "axios";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { BACKEND_URL } from "../utils";

export default function UploadModal(
    {
        setShowUploadModal,
        setMediaImages
    }
        :
        {
            setShowUploadModal: (val: boolean) => void,
            setMediaImages: (data: any) => void
        },

) {

    const [newMediaTitle, setNewMediaTitle] = useState('Title');
    const [newMediaAltText, setNewMediaAltText] = useState('Alt Text');
    const [newMediaFile, setNewMediaFile] = useState<File | null>(null);

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
            setMediaImages((prev: any) => [...prev, fileResponseData])
        } catch (Err: any) {
            console.log("Error while uploading file", Err)
        } finally {
            setShowUploadModal(false)
        }
    }
    return <div className="fixed inset-0 z-[99] overflow-y-auto">
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
}