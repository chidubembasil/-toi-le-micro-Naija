import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/AdminLayout";
import api from "@/lib/api";
import { Plus, Edit, Trash2, Search, Filter, Save, Volume2, Video, Upload, X } from "lucide-react";
import { isAxiosError } from "axios";

// --- INTERFACES ---

type PodcastStatus = "draft" | "published" | "archived";
type MediaType = "audio" | "video";

interface Podcast {
  id: number;
  title: string;
  slug: string;
  description?: string;
  audioUrl?: string;
  videoUrl?: string;
  mediaType: MediaType;
  duration?: number;
  transcript?: string;
  topic?: string;
  cefrLevel?: string;
  state?: string;
  audience?: string;
  downloadable: boolean;
  status: PodcastStatus;
  publishedAt?: string;
  createdAt: string;
}

interface PodcastForm {
  title: string;
  slug: string;
  description: string;
  audioUrl: string;
  videoUrl: string;
  mediaType: MediaType;
  duration: number;
  transcript: string;
  topic: string;
  cefrLevel: string;
  state: string;
  audience: string;
  downloadable: boolean;
  status: PodcastStatus;
}

// --- COMPONENT ---

export default function AdminPodcasts() {
  const { t } = useTranslation();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false); // New state for upload status
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const initialFormData: PodcastForm = {
    title: "",
    slug: "",
    description: "",
    audioUrl: "",
    videoUrl: "",
    mediaType: "audio",
    duration: 0,
    transcript: "",
    topic: "",
    cefrLevel: "",
    state: "",
    audience: "",
    downloadable: true,
    status: "draft",
  };

  const [formData, setFormData] = useState<PodcastForm>(initialFormData);

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
    setLoading(true);
    try {
      const response = await api.get("https://atoile-micro-naija-backend-production2.up.railway.app/api/podcasts/submissions");
      setPodcasts(response.data || []);
    } catch (error) {
      console.error("Failed to load podcasts:", error);
      setPodcasts([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
    if (audioFileInputRef.current) audioFileInputRef.current.value = '';
    if (videoFileInputRef.current) videoFileInputRef.current.value = '';
  };

  // --- CLOUDINARY UPLOAD HANDLER ---

  const handleFileUpload = async (file: File, mediaType: MediaType) => {
    setUploading(true);
    
    // Determine the target folder for the backend route
    const folder = 'podcasts'; 
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      // Call the secure backend upload route
      const response = await api.post(`https://atoile-micro-naija-backend-production2.up.railway.app/api/podcasts/${folder}`, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const secureUrl = response.data.url;

      if (mediaType === 'audio') {
        setFormData(prev => ({ ...prev, audioUrl: secureUrl }));
      } else {
        // Note: For video, we still recommend external URLs (YouTube/Vimeo)
        // but this handles direct video file uploads if needed.
        setFormData(prev => ({ ...prev, videoUrl: secureUrl }));
      }
      alert(`${mediaType === 'audio' ? 'Audio' : 'Video'} uploaded successfully!`);
    } catch (error) {
      console.error("Secure Upload Error:", error);
      let errorMessage = "Failed to upload file. Check backend console for details.";
      if (isAxiosError(error) && error.response?.data?.error) {
        errorMessage = `Upload Error: ${error.response.data.error}`;
      }
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // --- END CLOUDINARY UPLOAD HANDLER ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // CRITICAL FIX: Prepare payload to ensure only one URL is sent
      const payload = {
        ...formData,
        // If mediaType is audio, set videoUrl to undefined (so Zod ignores it)
        videoUrl: formData.mediaType === 'audio' ? undefined : formData.videoUrl,
        // If mediaType is video, set audioUrl to undefined (so Zod ignores it)
        audioUrl: formData.mediaType === 'video' ? undefined : formData.audioUrl,
        // Ensure duration is a number
        duration: Number(formData.duration),
      };

      if (editingId) {
        await api.put(`https://atoile-micro-naija-backend-production2.up.railway.app//api/news/${editingId}`, payload);
      } else {
        await api.post("https://atoile-micro-naija-backend-production2.up.railway.app/api/podcasts", payload);
      }
      
      alert(`Podcast ${editingId ? 'updated' : 'created'} successfully!`);
      await loadPodcasts();
      resetForm();
    } catch (error) {
      console.error("Failed to save podcast:", error);
      let errorMessage = "Failed to save podcast. Please check the form data.";
      
      if (isAxiosError(error) && error.response?.data?.error) {
        errorMessage = `API Error: ${JSON.stringify(error.response.data.error)}`;
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (podcast: Podcast) => {
    setFormData({
      title: podcast.title,
      slug: podcast.slug,
      description: podcast.description || "",
      mediaType: podcast.mediaType,
      audioUrl: podcast.audioUrl || "",
      videoUrl: podcast.videoUrl || "",
      duration: podcast.duration || 0,
      transcript: podcast.transcript || "",
      topic: podcast.topic || "",
      cefrLevel: podcast.cefrLevel || "",
      state: podcast.state || "",
      audience: podcast.audience || "",
      downloadable: podcast.downloadable,
      status: podcast.status,
    });
    setEditingId(podcast.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('deleteConfirm') || 'Are you sure you want to delete this item?')) return;
    
    try {
      await api.delete(`https://atoile-micro-naija-backend-production2.up.railway.app/api/podcasts/${id}`);
      await loadPodcasts();
    } catch (error) {
      console.error("Failed to delete podcast:", error);
      alert("Failed to delete podcast. Please try again.");
    }
  };

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch = podcast.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || podcast.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const nigerianStates = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
    "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
    "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
    "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
    "Yobe","Zamfara"];
  const topics = ["Pronunciation", "Grammar", "Conversation", "Culture", "Basics"];
  const audienceOptions = ["Beginners", "Intermediate", "Advanced", "All"];

  const statusOptions = [
    { value: "all", label: t('all') },
    { value: "draft", label: t('draft') },
    { value: "published", label: t('published') },
    { value: "archived", label: t('archived') },
  ];

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t('managePodcasts') || 'Manage Podcasts'}</h2>
            <p className="text-gray-600 mt-1">Create, edit, and publish audio and video podcasts</p>
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
              {editingId ? t('edit') + " Podcast" : t('createNew') + " Podcast"}
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

              {/* Media Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media Type *
                </label>
                <select
                  value={formData.mediaType}
                  onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as MediaType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="audio">Audio (Podcast)</option>
                  <option value="video">Video (YouTube/Vimeo)</option>
                </select>
              </div>

              {/* Conditional URL Input / File Upload */}
              {formData.mediaType === 'audio' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Audio File Upload or URL *
                  </label>
                  {formData.audioUrl ? (
                    <div className="flex items-center justify-between p-3 border border-green-400 rounded-lg bg-green-50">
                      <span className="text-sm text-green-800 truncate">
                        {formData.audioUrl.split('/').pop()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, audioUrl: '' }))}
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
                        ref={audioFileInputRef}
                        accept="audio/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0], 'audio');
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        disabled={uploading}
                      />
                      <input
                        type="url"
                        value={formData.audioUrl}
                        onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Or paste direct Audio URL"
                        disabled={uploading}
                      />
                    </div>
                  )}
                  {uploading && <p className="text-sm text-purple-600 flex items-center gap-2"><Upload className="w-4 h-4 animate-pulse" /> Uploading audio...</p>}
                </div>
              )}

              {formData.mediaType === 'video' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Video URL (YouTube/Vimeo) *
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., https://www.youtube.com/embed/YOUTUBE-ID"
                    required
                    disabled={uploading}
                  />
                  <p className="text-xs text-gray-500">
                    Note: For video, only external URLs (YouTube/Vimeo ) are supported.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEFR Level
                  </label>
                  <select
                    value={formData.cefrLevel}
                    onChange={(e) => setFormData({ ...formData, cefrLevel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {cefrLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {topics.map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 1800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State (Nigeria)
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select State</option>
                    {nigerianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audience
                  </label>
                  <select
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {audienceOptions.map((audience) => (
                      <option key={audience} value={audience}>{audience}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-8">
                  <input
                    id="downloadable"
                    type="checkbox"
                    checked={formData.downloadable}
                    onChange={(e) => setFormData({ ...formData, downloadable: e.target.checked })}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="downloadable" className="ml-2 block text-sm text-gray-900">
                    Downloadable
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transcript
                </label>
                <textarea
                  value={formData.transcript}
                  onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PodcastStatus })}
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
                  {saving ? t('saving') : editingId ? t('updatePodcast') : t('createPodcast')}
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
                placeholder={t('searchPodcasts') || "Search podcasts..."}
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
          ) : filteredPodcasts.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              {t('noPodcastsFound') || 'No podcasts found.'}
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
                      Type / Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
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
                  {filteredPodcasts.map((podcast) => (
                    <tr key={podcast.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{podcast.title}</div>
                        <div className="text-xs text-gray-500">{podcast.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          {podcast.mediaType === 'audio' ? <Volume2 className="w-4 h-4 text-purple-500" /> : <Video className="w-4 h-4 text-red-500" />}
                          {podcast.mediaType}
                        </div>
                        <div className="text-xs text-gray-500">{podcast.cefrLevel} - {podcast.topic}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDuration(podcast.duration)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            podcast.status === "published"
                              ? "bg-green-100 text-green-800"
                              : podcast.status === "draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {t(podcast.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(podcast)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          title={t('edit')}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(podcast.id)}
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
