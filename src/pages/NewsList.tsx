import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SocialShare from "@/components/SocialShare";
import api from "@/lib/api";
import { Search, Filter, Calendar } from "lucide-react";

interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: string;
  category?: string;
  state?: string;
  language: string;
  publishedAt?: string;
  createdAt: string;
}

export default function NewsList() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterState, setFilterState] = useState("all");

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await api.get("/news");
      setArticles(response.data?.filter((a: NewsArticle) => a.status === "published") || []);
    } catch (error) {
      console.error("Failed to load articles:", error);
      // Mock data for development
      setArticles([
        {
          id: 1,
          title: "Welcome to À toi le micro Naija",
          slug: "welcome-to-atoile-naija",
          excerpt: "Discover our new French language learning platform designed to empower Nigerian students and teachers.",
          content: "Full content here...",
          coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop",
          category: "announcement",
          state: "Lagos",
          language: "en",
          status: "published",
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: "New Podcast Series Launched",
          slug: "new-podcast-series",
          excerpt: "Exciting new podcast series featuring conversations with French language learners and teachers across Nigeria.",
          content: "Full content here...",
          coverImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=400&fit=crop",
          category: "news",
          state: "Abuja",
          language: "en",
          status: "published",
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          title: "Teacher Training Workshop Success",
          slug: "teacher-training-workshop",
          excerpt: "Over 100 teachers participated in our recent workshop on innovative French teaching methodologies.",
          content: "Full content here...",
          coverImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop",
          category: "event",
          state: "Kano",
          language: "en",
          status: "published",
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || article.category === filterCategory;
    const matchesState = filterState === "all" || article.state === filterState;
    return matchesSearch && matchesCategory && matchesState;
  });

  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));
  const states = Array.from(new Set(articles.map(a => a.state).filter(Boolean)));

  return (
    <Layout>
      <SEO
        title="News & Blog"
        description="Stay updated with the latest news, articles, and updates about French language education in Nigeria"
        type="website"
      />

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">{t('news')}</h1>
          <p className="text-xl max-w-3xl">
            Stay updated with the latest news, articles, and updates about French language education in Nigeria
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('searchNews')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">{t('allCategories')}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">{t('allStates')}</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600 text-lg">{t('noNewsFound')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                {article.coverImage && (
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {article.category && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                    )}
                    {article.state && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        {article.state}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>

                  {article.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button className="text-blue-600 hover:text-blue-700 font-semibold mb-3 block">
                      {t('readMore')} →
                    </button>
                    <SocialShare
                      url={`https://atoilenaija.com/news/${article.slug}`}
                      title={article.title}
                      description={article.excerpt}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
