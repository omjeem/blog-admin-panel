import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PostList from './pages/posts/PostList';
import NewPost from './pages/posts/NewPost';
import MediaLibrary from './pages/media/MediaLibrary';
import CategoryList from './pages/categories/CategoryList';
import TagList from './pages/tags/TagList';
import UserList from './pages/users/UserList';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="posts">
            <Route index element={<PostList />} />
            <Route path="new" element={<NewPost />} />
            <Route path="categories" element={<CategoryList />} />
          </Route>
          <Route path="media" element={<MediaLibrary />} />
          <Route path="tags" element={<TagList />} />
          <Route path="users" element={<UserList />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;