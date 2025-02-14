import { Edit, Trash2, Plus, Undo } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {  PostForm } from './NewPost';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../utils';
import toast, { Toaster } from 'react-hot-toast';



export default function PostList() {

  const [posts, setPosts] = useState<PostForm[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const navigator = useNavigate()

  async function fetchAllPosts() {
    try {
      const response = await axios.get(`${BACKEND_URL}/blogs/type/all?page=${pageNo}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = response.data.response.blogs;
      setPosts(data);
      console.log("Fetched blogs", data);
    } catch (err) {
      console.log("Error while fetching blogs", err);
    }
  }


  useEffect(() => {
    fetchAllPosts();
  }, [pageNo])

  function editPostHandler(id: string | undefined) {
    navigator("/admin/posts/" + id);
  }

  async function deletePostHandler(id: string | undefined, shouldDelete: Boolean) {
    if (shouldDelete && confirm("Are you sure you want to delete this blog?")) {
      axios.delete(`${BACKEND_URL}/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((response) => {
          console.log("Blog deleted", response);
          toast.success("Blog deleted successfully");
          // setPosts(posts.filter(post => post._id !== id));
          fetchAllPosts();
        })
        .catch((err) => {
          const message = err?.response?.data?.error;
          console.log("Error while deleting blog", message);
          if (message) {
            toast.error(message);
          } else {
            toast.error("Error while deleting blog");
          }
          console.log("Error while deleting blog", err);
        })
    } else {
      axios.put(`${BACKEND_URL}/blogs/${id}`, {
        isDeleted: false
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then((response) => {
        console.log("Blog undo", response);
        toast.success("Blog undo successfully");
        fetchAllPosts();
      })
        .catch((err) => {
          console.log("Error while undo the  blog", err);
        })
    }
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post: PostForm) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900  ">
                      {post.title.length > 40 ? post.title.slice(0, 40) + "..." : post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {
                      post?.authors.map((author, index) => (
                        <div key={index} className="text-sm text-gray-500">{author.name}</div>
                      ))
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {
                      post?.tags.map((tag, index) => (
                        <div key={index} className="text-sm text-gray-500">{tag.name}</div>
                      ))
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {
                      post.isDeleted ? <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white`}>
                        deleted
                      </span> :
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {post.status}
                        </span>
                    }

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {post.createdAt && new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {/* <button className="text-indigo-600 hover:text-indigo-900">
                        <Eye className="h-4 w-4" />
                      </button> */}
                      <button onClick={() => editPostHandler(post._id)} className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        {
                          post.isDeleted ? <Undo onClick={() => deletePostHandler(post._id, false)} className="h-4 w-4" />
                            :
                            <Trash2 onClick={() => deletePostHandler(post._id, true)} className="h-4 w-4" />
                        }

                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
          <div className='flex mt-2 p-4 gap-3 items-center justify-center w-full'>
            <button onClick={() => setPageNo(pageNo - 1)} className="bg-gray-200 text-gray-800 px-4 py-1 rounded-lg">Previous</button>
            <button onClick={() => setPageNo(pageNo + 1)} className="bg-gray-200 text-gray-800 px-4 py-1 rounded-lg">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}