import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/AdminLayout";
import { Newspaper, Mic, FileText, Image, TrendingUp, Users, Eye } from "lucide-react";
import api from "@/lib/api";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    newsCount: 0,
    podcastsCount: 0,
    exercisesCount: 0,
    galleriesCount: 0,
    pendingSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Fetch real statistics from API
      const [news, podcasts, exercises, galleries] = await Promise.all([
        api.get('https://atoile-micro-naija-backend-production2.up.railway.app/api/news').catch(() => ({ data: [] })),
        api.get('https://atoile-micro-naija-backend-production2.up.railway.app/api/podcasts').catch(() => ({ data: [] })),
        api.get('https://atoile-micro-naija-backend-production2.up.railway.app/api/exercises').catch(() => ({ data: [] })),
        api.get('https://atoile-micro-naija-backend-production2.up.railway.app/api/galleries').catch(() => ({ data: [] })),
      ]);

      setStats({
        newsCount: news.data?.length || 0,
        podcastsCount: podcasts.data?.length || 0,
        exercisesCount: exercises.data?.length || 0,
        galleriesCount: galleries.data?.length || 0,
        pendingSubmissions: 0, // TODO: Implement pending submissions count
      });
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total News",
      value: stats.newsCount,
      icon: Newspaper,
      color: "blue",
      link: "/admin/news",
    },
    {
      title: "Total Podcasts",
      value: stats.podcastsCount,
      icon: Mic,
      color: "purple",
      link: "/admin/podcasts",
    },
    {
      title: "Total Exercises",
      value: stats.exercisesCount,
      icon: FileText,
      color: "green",
      link: "/admin/exercises",
    },
    {
      title: "Total Galleries",
      value: stats.galleriesCount,
      icon: Image,
      color: "yellow",
      link: "/admin/galleries",
    },
  ];

  const quickActions = [
    {
      title: t('manageNews'),
      description: "Create and manage news articles",
      icon: Newspaper,
      color: "blue",
      link: "/admin/news",
    },
    {
      title: t('managePodcasts'),
      description: "Upload and manage podcast episodes",
      icon: Mic,
      color: "purple",
      link: "/admin/podcasts",
    },
    {
      title: t('manageExercises'),
      description: "Create interactive learning exercises",
      icon: FileText,
      color: "green",
      link: "/admin/exercises",
    },
    {
      title: t('manageGalleries'),
      description: "Manage photo and video galleries",
      icon: Image,
      color: "yellow",
      link: "/admin/galleries",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      hover: "hover:bg-blue-100",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      hover: "hover:bg-purple-100",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-600",
      hover: "hover:bg-green-100",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-600",
      hover: "hover:bg-yellow-100",
    },
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('adminDashboard')}</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your content.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            const colors = colorClasses[stat.color as keyof typeof colorClasses];
            return (
              <Link
                key={stat.title}
                to={stat.link}
                className={`${colors.bg} ${colors.border} border rounded-xl p-6 ${colors.hover} transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${colors.text}`} />
                  <TrendingUp className={`w-5 h-5 ${colors.text}`} />
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className={`text-4xl font-bold ${colors.text}`}>
                  {loading ? "..." : stat.value}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const colors = colorClasses[action.color as keyof typeof colorClasses];
              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className={`block p-6 ${colors.bg} ${colors.border} border rounded-lg ${colors.hover} transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md`}
                >
                  <Icon className={`w-8 h-8 ${colors.text} mb-3`} />
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Newspaper className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-grow">
                <p className="text-gray-900 font-medium">New article published</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Mic className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-grow">
                <p className="text-gray-900 font-medium">Podcast episode uploaded</p>
                <p className="text-sm text-gray-600">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-grow">
                <p className="text-gray-900 font-medium">Exercise created</p>
                <p className="text-sm text-gray-600">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Site Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Page Views</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">12,345</p>
            <p className="text-sm text-gray-600 mt-1">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">1,234</p>
            <p className="text-sm text-gray-600 mt-1">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">+23%</p>
            <p className="text-sm text-gray-600 mt-1">vs last month</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
