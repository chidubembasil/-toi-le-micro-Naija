import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/AdminLayout";
import api from "@/lib/api";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Save,
  Upload,
  FileText,
  Download,
  X,
} from "lucide-react";
import { isAxiosError } from "axios";

/* ================= TYPES ================= */

type PedagogyStatus = "draft" | "published" | "archived";

interface Pedagogy {
  id: number;
  title: string;
  slug: string;
  description?: string;
  level?: string;
  skillType?: string;
  theme?: string;
  content?: string;
  url?: string;
  pdfViewUrl: string; 
  downloadable: boolean;
  status: PedagogyStatus;
  createdAt: string;
}

interface PedagogyForm {
  title: string;
  slug: string;
  description: string;
  level: string;
  skillType: string;
  theme: string;
  content: string;
  url?: string; 
  pdfViewUrl?: string; 
  downloadable: boolean;
  status: PedagogyStatus;
}

/* ================= COMPONENT ================= */

export default function AdminPedagogies() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pedagogies, setPedagogies] = useState<Pedagogy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const initialFormData: PedagogyForm = {
    title: "",
    slug: "",
    description: "",
    level: "",
    skillType: "",
    theme: "",
    content: "",
    url: undefined,
    pdfViewUrl: "", 
    downloadable: true,
    status: "draft",
  };

  const [formData, setFormData] = useState<PedagogyForm>(initialFormData);

  /* ================= DATA ================= */

  useEffect(() => {
    loadPedagogies();
  }, []);

  const loadPedagogies = async () => {
    try {
      const res = await api.get("https://atoile-micro-naija-backend-production2.up.railway.app/api/pedagogies/admin/all");
      setPedagogies(res.data || []);
    } catch (err) {
      console.error(err);
      setPedagogies([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= FILE UPLOAD ================= */

const handleFileUpload = async (file: File) => {
  setUploading(true);
  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await api.post("https://atoile-micro-naija-backend-production2.up.railway.app/api/pedagogies", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // The backend should return both URLs
    setFormData((p) => ({
      ...p,
      url: res.data.url,
      pdfViewUrl: res.data.pdfViewUrl,
    }));

    alert("PDF uploaded successfully");
  } catch (err) {
    console.error(err);
    alert("PDF upload failed");
  } finally {
    setUploading(false);
  }
};

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // ✅ backend requires url ONLY on create
      if (!editingId && !formData.url) {
        alert("Please upload a PDF");
        return;
      }

      if (editingId) {
        await api.put(`https://atoile-micro-naija-backend-production2.up.railway.app/api/pedagogies/${editingId}`, formData);
      } else {
        await api.post("https://atoile-micro-naija-backend-production2.up.railway.app/api/pedagogies", formData);
      }

      await loadPedagogies();
      resetForm();
      alert("Saved successfully");
    } catch (err) {
      if (isAxiosError(err)) {
        alert(JSON.stringify(err.response?.data?.error));
      } else {
        alert("Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ================= ACTIONS ================= */

  const handleEdit = (p: Pedagogy) => {
  setFormData({
    title: p.title,
    slug: p.slug,
    description: p.description ?? "",
    level: p.level ?? "",
    skillType: p.skillType ?? "",
    theme: p.theme ?? "",
    content: p.content ?? "",
    url: p.url,
    pdfViewUrl: p.pdfViewUrl,
    downloadable: p.downloadable,
    status: p.status,
  });
  setEditingId(p.id);
  setShowForm(true);
};

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this pedagogy?")) return;
    await api.delete(`https://atoile-micro-naija-backend-production2.up.railway.app/api/pedagogies/${id}`);
    loadPedagogies();
  };

  /* ================= FILTER ================= */

  const filteredPedagogies = pedagogies.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const levels = ["Beginner", "Intermediate", "Advanced"];
  const skillTypes = ["Reading", "Writing", "Listening", "Speaking"];
  const themes = ["Culture", "History", "Science", "Daily Life"];

  const statusOptions = [
    { value: "all", label: t('all') },
    { value: "draft", label: t('draft') },
    { value: "published", label: t('published') },
    { value: "archived", label: t('archived') },
  ];

  /* ================= UI (UNCHANGED) ================= */

  return (
   <AdminLayout>
      <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div>
             <h2 className="text-3xl font-bold text-gray-900">{t('managePedagogies') || 'Manage Pedagogies'}</h2>
             <p className="text-gray-600 mt-1">Create, edit, and publish pedagogical resources (PDFs).</p>
           </div>
           <button
             onClick={() => {
               if (showForm) {
                 resetForm();
               } else {
                 setShowForm(true);
               }
             }}
             className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-lg"
           >
             <Plus className="w-5 h-5" />
             {showForm ? t('cancel') : t('createNew') || 'Create New'}
           </button>
         </div>

         {/* Form */}
         {showForm && (
           <div className="bg-white rounded-xl shadow-lg p-6">
             <h3 className="text-xl font-bold text-gray-900 mb-6">
               {editingId ? t('edit') + " Pedagogy" : t('createNew') + " Pedagogy Resource"}
             </h3>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     {t('title')} *
                   </label>
                   <input
                     type="text"
                     value={formData.title}
                     onChange={(e) => {
                       const title = e.target.value;
                       const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                       setFormData({ ...formData, title, slug });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* PDF Upload */}
              <div className="space-y-2 border p-4 rounded-lg bg-gray-50">
                <label className="block text-sm font-bold text-gray-700">
                  PDF File Upload *
                </label>
                {formData.url ? (
                  <div className="flex items-center justify-between p-3 border border-green-400 rounded-lg bg-green-100">
                    <span className="text-sm text-green-800 truncate flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {formData.url.split('/').pop()}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, url: '' }))}
                      className="text-red-600 hover:text-red-800 ml-3"
                      title="Clear URL"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="application/pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      disabled={uploading}
                      required={!editingId}
                    />
                  </div>
                )}
                 {uploading && <p className="text-sm text-purple-600 flex items-center gap-2"><Upload className="w-4 h-4 animate-pulse" /> Uploading PDF...</p>}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Level
                   </label>
                   <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Type
                  </label>
                  <select
                    value={formData.skillType}
                    onChange={(e) => setFormData({ ...formData, skillType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {skillTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {themes.map((theme) => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (Optional Text)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center pt-2">
                  <input
                    id="downloadable"
                    type="checkbox"
                    checked={formData.downloadable}
                    onChange={(e) => setFormData({ ...formData, downloadable: e.target.checked })}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="downloadable" className="ml-2 block text-sm text-gray-900">
                    Allow Download (User can download the PDF file)
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PedagogyStatus })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="draft">{t('draft')}</option>
                    <option value="published">{t('published')}</option>
                    <option value="archived">{t('archived')}</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-lg disabled:bg-gray-400"
                >
                  <Save className="w-5 h-5" />
                  {saving ? t('saving') : editingId ? t('updatePedagogy') : t('createPedagogy')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchPedagogies') || "Search pedagogies..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="relative w-full md:w-1/4">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-600">{t('loading') || 'Loading...'}</div>
          ) : filteredPedagogies.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              {t('noPedagogyResourcesFound') || 'No pedagogy resources found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('title')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PDF URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPedagogies.map((pedagogy) => (
                    <tr key={pedagogy.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{pedagogy.title}</div>
                        <div className="text-xs text-gray-500">{pedagogy.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Level: {pedagogy.level}</div>
                        <div className="text-xs text-gray-500">Skill: {pedagogy.skillType}</div>
                        <div className="text-xs text-gray-500">Theme: {pedagogy.theme}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pedagogy.url ? (
                          <a
                                href={pedagogy.pdfViewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                              >
                            <FileText className="w-4 h-4" />

                            View PDF
                          </a>
                        ) : (
                          <span className="text-red-500 text-sm">Missing PDF</span>
                        )}
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          {pedagogy.downloadable ? <Download className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {pedagogy.downloadable ? 'Downloadable' : 'View Only'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pedagogy.status === "published"
                              ? "bg-green-100 text-green-800"
                              : pedagogy.status === "draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {t(pedagogy.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(pedagogy)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          title={t('edit')}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(pedagogy.id)}
                          className="text-red-600 hover:text-red-900"
                          title={t('delete')}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                 </tbody>
               </table>
             </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
