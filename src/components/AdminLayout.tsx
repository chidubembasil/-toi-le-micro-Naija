import { ReactNode, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';
import {
  LayoutDashboard,
  Newspaper,
  Mic,
  FileText,
  Image,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
  try {
    // Call the logout API
    await fetch('https://atoile-micro-naija-backend-production2.up.railway.app/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // include cookies if your backend uses them
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Clear auth state locally
    logout();

    // Redirect to login/home page
    navigate('/');
  } catch (err) {
    console.error('Logout failed:', err);
    // Optionally show error to user
  }
};


  if (!user) {
    return null;
  }

  const menuItems = [
    {
      path: '/dashboard',
      label: t('dashboard'),
      icon: LayoutDashboard,
    },
    {
      path: '/news',
      label: t('manageNews'),
      icon: Newspaper,
    },
    {
      path: '/podcasts',
      label: t('managePodcasts'),
      icon: Mic,
    },
    {
      path: '/exercises',
      label: t('manageExercises'),
      icon: FileText,
    },
    {
      path: '/galleries',
      label: t('manageGalleries'),
      icon: Image,
    },
    {
      path: '/resources',
      label: t('manageResources'),
      icon: FileText,
    },
     {
      path: '/pedagogies',
      label: t('managePedagogies'),
      icon: FileText,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/" className="text-xl font-bold text-blue-600">
                À toi le micro Naija
              </Link>
              <span className="hidden sm:inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Admin Panel
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden md:inline-block text-gray-700">
                {user.email}
              </span>
              <LanguageToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out mt-16 lg:mt-0`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
