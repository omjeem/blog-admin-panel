import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Image,
  Tags,
  Users,
  Settings,
  ChevronDown,
  Bell,
  Menu,
  X,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin',
    },
    {
      title: 'Posts',
      icon: <FileText className="w-5 h-5" />,
      path: '/posts',
      submenu: [
        { title: 'All Posts', path: '/admin/posts' },
        { title: 'Add New', path: '/admin/posts/new' },
      ],
    },
    {
      title: 'Media',
      icon: <Image className="w-5 h-5" />,
      path: '/admin/media',
    },
    {
      title: 'Tags',
      icon: <Tags className="w-5 h-5" />,
      path: '/admin/tags',
    },
    {
      title: 'Users',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/users',
    },
    {
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin/settings',
    },
  ];

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const handleMenuClick = (item: typeof menuItems[0], e: React.MouseEvent) => {
    if (item.submenu) {
      e.preventDefault();
      toggleMenu(item.title);
    } else {
      navigate(item.path);
      if (window.innerWidth < 1024) {
        onClose();
      }
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const sidebarClasses = `fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } lg:translate-x-0`;

  return (
    <aside className={sidebarClasses}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <LayoutDashboard className="w-6 h-6 text-indigo-600" />
          <span className="text-xl font-semibold">Blog Admin</span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.title}>
            <button
              onClick={(e) => handleMenuClick(item, e)}
              className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md ${
                isActive(item.path)
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                <span>{item.title}</span>
              </div>
              {item.submenu && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedMenus.includes(item.title) ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>
            {item.submenu && expandedMenus.includes(item.title) && (
              <div className="ml-6 mt-1 space-y-1">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={`block px-4 py-2 text-sm rounded-md ${
                      location.pathname === subItem.path
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-full px-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex justify-between w-full items-center space-x-4">
          <button className="relative text-gray-500 hover:text-gray-700">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <main className="lg:pl-64 pt-16">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}