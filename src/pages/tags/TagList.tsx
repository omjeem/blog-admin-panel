import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Tag } from '../../types';
import axios from 'axios';
import { BACKEND_URL } from '../../utils';

const initialTags: Tag[] = [
  {
    _id: '1',
    name: 'React',
    slug: 'react'
  },
  {
    _id: '2',
    name: 'JavaScript',
    slug: 'javascript'
  }
];

export default function TagList() {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTag, setNewTag] = useState({
    _id: '',
    name: '',
    slug: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const slug = generateSlug(value);
    setNewTag(prev => ({
      ...prev,
      [name]: value,
      slug
    }));
  };

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return slug;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTag) {
      setTags(prev =>
        prev.map(tag =>
          tag._id === editingTag._id
            ? { ...tag, ...newTag }
            : tag
        )
      );
    } else {
      // setTags(prev => [
      //   ...prev,
      //   {
      //     id: Math.random().toString(36).substr(2, 9),
      //     name: newTag.name!,
      //     slug: newTag.slug!
      //   }
      // ]);
    }
    setNewTag({ _id: "", name: '', slug: '' });
    setShowForm(false);
    setEditingTag(null);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setNewTag(tag);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${BACKEND_URL}/tags/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        console.log("Response is ", response)
        setTags(prev => prev.filter(tag => tag._id !== id));

      } catch (error) {
        console.log("Error is ", error)
      }
    }
  };

  async function fetchTags() {
    const response = await axios.get(`${BACKEND_URL}/tags`)
    const tagsData: Tag[] = response.data.response
    setTags(tagsData)
    console.log("Tag data is ", tagsData)
  }

  useEffect(() => {
    fetchTags()
  }, [])

  function addNewTagHandler() {
    setShowForm(true);
    setEditingTag(null);
    setNewTag({ _id: "", name: '', slug: '' });
  }

  async function handelUpdateOrCreate() {
    const token = localStorage.getItem('token')
    if (editingTag) {
      const response = await axios.put(`${BACKEND_URL}/tags/${newTag._id}`, {
        name: newTag.name,
        slug: newTag.slug
      }, {
        headers: {
          "application-type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      const data = response.data.response
      console.log("data is ", data)
    } else {
      const response = await axios.post(`${BACKEND_URL}/tags`, {
        name: newTag.name,
        slug: newTag.slug
      }, {
        headers: {
          "content-type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      const data = response.data.response
      setTags(prev => [...prev, data])
    }
  }

  console.log("new tag is ", newTag)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Tags</h1>
        <button
          onClick={addNewTagHandler}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingTag ? 'Edit Tag' : 'New Tag'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTag.name}
                onChange={handleInputChange}
                // onBlur={generateSlug}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
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
                value={newTag.slug || newTag.name?.toLowerCase()}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTag(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handelUpdateOrCreate}
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editingTag ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Blogs
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tags.map((tag) => (
                <tr key={tag._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {tag.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{tag.slug || tag.name?.toLowerCase()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{tag.blogs?.length || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}