import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/AdminLayout";
import api from "@/lib/api";
import { Plus, Edit, Trash2, Search, Filter, Image, Video } from "lucide-react";

type mediaFormat = "image" | "video";
type galleryStatus = "draft" | "published" | "archived";

interface GalleryItem {
  id: number;
  title: string;
  slug: string;
  description?: string;
  mediaType: mediaFormat;
  mediaUrl: string;
  thumbnailUrl?: string;
  category?: string;
  state?: string;
  status: galleryStatus;
  createdAt: string;
}

export default function AdminGalleries() {
  const { t } = useTranslation();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    mediaType: "image" as mediaFormat,
    mediaUrl: "",
    thumbnailUrl: "",
    category: "",
    state: "",
    status: "draft" as galleryStatus,
    mediaFile: null as File | null, // <-- new field for file upload
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get("https://atoile-micro-naija-backend-production2.up.railway.app/api/galleries/admin/all");
      setItems(response.data || []);
    } catch (error) {
      console.error("Failed to load gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("slug", formData.slug);
      payload.append("description", formData.description);
      payload.append("mediaType", formData.mediaType);
      payload.append("category", formData.category);
      payload.append("state", formData.state);
      payload.append("status", formData.status);
      if (formData.mediaFile) payload.append("media", formData.mediaFile);

      if (editingId) {
        await api.put(`https://atoile-micro-naija-backend-production2.up.railway.app/api/galleries/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("https://atoile-micro-naija-backend-production2.up.railway.app/api/galleries", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await loadItems();
      resetForm();
    } catch (error) {
      console.error("Failed to save gallery item:", error);
      alert("Failed to save gallery item. Please try again.");
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title,
      slug: item.slug,
      description: item.description || "",
      mediaType: item.mediaType,
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl || "",
      category: item.category || "",
      state: item.state || "",
      status: item.status,
      mediaFile: null,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      await api.delete(`https://atoile-micro-naija-backend-production2.up.railway.app/api/galleries/${id}`);
      await loadItems();
    } catch (error) {
      console.error("Failed to delete gallery item:", error);
      alert("Failed to delete gallery item. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      mediaType: "image",
      mediaUrl: "",
      thumbnailUrl: "",
      category: "",
      state: "",
      status: "draft",
      mediaFile: null,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const nigerianStates = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
    "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
    "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
    "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
    "Yobe","Zamfara"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t("manageGalleries")}</h2>
            <p className="text-gray-600 mt-1">Manage photos and videos</p>
          </div>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            {showForm ? t("cancel") : t("createNew")}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? t("edit") + " Gallery Item" : t("createNew") + " Gallery Item"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("title")} *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
                      setFormData({ ...formData, title, slug });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("description")}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  rows={3}
                />
              </div>

              {/* Media Type, Category, State */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Media Type *</label>
                  <select
                    value={formData.mediaType}
                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as mediaFormat })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                   <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="training">Training</option>
                    <option value=" resource-center"> Resource Center</option>
                    <option value="french-club">French Club</option>
                    <option value="Association">Association</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("state")}</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Select State</option>
                    {nigerianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Media File */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {editingId ? "Replace Media (optional)" : "Media File *"}
                </label>
                <input
                  type="file"
                  accept={formData.mediaType + "/*"}
                  onChange={(e) => setFormData({ ...formData, mediaFile: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required={!editingId}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("status")}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as galleryStatus })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="draft">{t("draft")}</option>
                  <option value="published">{t("published")}</option>
                  <option value="archived">{t("archived")}</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 font-semibold">
                  {editingId ? t("save") + " Changes" : t("createNew") + " Gallery Item"}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold">
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-4">
           <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex-1 relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
               <input
                type="text"
                placeholder={t('search') + " gallery..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="published">{t('published')}</option>
                <option value="draft">{t('draft')}</option>
                <option value="archived">{t('archived')}</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600">No gallery items found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t('title')}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t('status')}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.mediaType === "image" ? <Image className="w-5 h-5 text-pink-600" /> : <Video className="w-5 h-5 text-pink-600" />}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.state}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{item.mediaType}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.category || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "published" ? "bg-green-100 text-green-800" :
                          item.status === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
