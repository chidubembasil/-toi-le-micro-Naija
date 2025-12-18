import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/AdminLayout";
import api from "@/lib/api";
import { Plus, Edit, Trash2, Search, Upload, AlertCircle } from "lucide-react";
import { parseDocxFile, validateQuestions } from "@/lib/docxParser";

type ExerciseStatus = "draft" | "published" | "archived";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Exercise {
  id: number;
  title: string;
  slug: string;
  description?: string;
  type: string;
  difficulty: string;
  podcastId?: number;
  questions: Question[];
  showAnswers: boolean;
  status: ExerciseStatus;
  createdAt: string;
}

export default function AdminExercises() {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [parsedQuestionsPreview, setParsedQuestionsPreview] = useState<Question[] | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    type: "mcq",
    difficulty: "beginner",
    podcastId: 0,
    questions: "[]",
    showAnswers: true,
    status: "draft" as ExerciseStatus,
  });

  const difficultyLevels = ["beginner", "intermediate", "advanced"];
  const exerciseTypes = [
    { value: "mcq", label: "Multiple Choice" },
    { value: "gap_filling", label: "Gap Filling" },
    { value: "matching", label: "Matching" },
    { value: "sequencing", label: "Sequencing" },
    { value: "true_false", label: "True/False" },
  ];

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const res = await api.get("https://atoile-micro-naija-backend-production2.up.railway.app/api/exercises/admin/all");

      const normalized = res.data.map((ex: any) => ({
        id: ex.id,
        title: ex.title,
        slug: ex.slug,
        description: ex.description,
        podcastId: ex.podcastId,
        type: ex.exerciseType,
        difficulty: ex.difficulty || "beginner",
        questions: ex.content ? JSON.parse(ex.content) : [],
        showAnswers: ex.showAnswerKey,
        status: ex.status,
        createdAt: ex.createdAt,
      }));

      setExercises(normalized);
    } catch (err) {
      console.error("Failed to load exercises:", err);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDocxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    try {
      if (!file.name.endsWith(".docx")) {
        throw new Error("Please upload a .docx file");
      }

      const parsedQuestions = await parseDocxFile(file);
      const validation = validateQuestions(parsedQuestions);

      if (!validation.valid) {
        throw new Error(`Validation errors:\n${validation.errors.join("\n")}`);
      }

      setFormData(prev => ({
        ...prev,
        questions: JSON.stringify(parsedQuestions, null, 2),
      }));
      setParsedQuestionsPreview(parsedQuestions);
      setUploadSuccess(`Successfully parsed ${parsedQuestions.length} questions`);
      if (e.target) e.target.value = "";
    } catch (error: any) {
      console.error("DOCX parsing error:", error);
      setUploadError(error.message || "Failed to parse DOCX file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(formData.questions);
      if (!Array.isArray(parsed)) {
        alert("Questions must be a JSON array");
        return;
      }

      const payload: any = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description || undefined,
        podcastId: formData.podcastId || undefined,
        exerciseType: formData.type,
        difficulty: formData.difficulty,
        content: JSON.stringify(parsed),
        showAnswerKey: formData.showAnswers,
        status: formData.status,
      };

      if (formData.showAnswers) {
        payload.answerKey = JSON.stringify(parsed);
      }

      if (editingId) {
        await api.put(`https://atoile-micro-naija-backend-production2.up.railway.app/api/exercises/${editingId}`, payload);
      } else {
        await api.post("https://atoile-micro-naija-backend-production2.up.railway.app/api/exercises", payload);
      }

      await loadExercises();
      resetForm();
    } catch (err: any) {
      console.error("Submit failed:", err?.response?.data || err);
      alert("Submit failed — check console payload");
    }
  };

  const handleEdit = (exercise: Exercise) => {
    setFormData({
      title: exercise.title,
      slug: exercise.slug,
      description: exercise.description || "",
      type: exercise.type,
      difficulty: exercise.difficulty,
      podcastId: exercise.podcastId || 0,
      questions: JSON.stringify(exercise.questions, null, 2),
      showAnswers: exercise.showAnswers,
      status: exercise.status,
    });
    setEditingId(exercise.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      await api.delete(`/exercises/${id}`);
      await loadExercises();
    } catch (error) {
      console.error("Failed to delete exercise:", error);
      alert("Failed to delete exercise. Please try again.");
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await api.post(`https://atoile-micro-naija-backend-production2.up.railway.app/api/exercises/${id}/publish`);
      await loadExercises();
    } catch (error) {
      console.error("Failed to publish exercise:", error);
      alert("Failed to publish exercise");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      type: "mcq",
      difficulty: "beginner",
      podcastId: 0,
      questions: "[]",
      showAnswers: true,
      status: "draft",
    });
    setEditingId(null);
    setShowForm(false);
    setParsedQuestionsPreview(null);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || exercise.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t("manageExercises")}</h2>
            <p className="text-gray-600 mt-1">Manage interactive learning exercises</p>
          </div>
          <button
            onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
            }}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            {showForm ? t("cancel") : t("createNew")}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? t("edit") + " Exercise" : t("createNew") + " Exercise"}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Exercise description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {exerciseTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {difficultyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as ExerciseStatus })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Podcast ID (optional)</label>
                <input
                  type="number"
                  value={formData.podcastId}
                  onChange={(e) =>
                    setFormData({ ...formData, podcastId: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter podcast ID"
                />
              </div>

              {/* DOCX Upload */}
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Upload Questions from DOCX</h4>
                  </div>
                  <input
                    type="file"
                    accept=".docx"
                    onChange={handleDocxUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {uploadError && (
                    <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg flex gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700">{uploadError}</p>
                    </div>
                  )}
                  {uploadSuccess && (
                    <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
                      <p className="text-sm text-green-700">{uploadSuccess}</p>
                    </div>
                  )}

                  {/* Parsed Questions Preview */}
                  {parsedQuestionsPreview && (
                    <div className="mt-4 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-white">
                      <h5 className="font-semibold mb-2">Parsed Questions Preview</h5>
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-800">
                        {parsedQuestionsPreview.map((q, index) => (
                          <li key={index}>
                            <p className="font-medium">{q.question}</p>
                            <ul className="list-disc pl-5 text-gray-600">
                              {q.options.map((opt, i) => (
                                <li key={i} className={i === q.correctAnswer ? "font-bold text-green-700" : ""}>
                                  {opt}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>


              {/* Questions JSON */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Questions JSON *</label>
                <textarea
                  value={formData.questions}
                  onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                  placeholder='[{"question":"...","options":["A","B","C"],"correctAnswer":0}]'
                  rows={6}
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.showAnswers}
                    onChange={(e) =>
                      setFormData({ ...formData, showAnswers: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Show Answer Key</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  {editingId ? "Update Exercise" : "Create Exercise"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Exercises Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Questions</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExercises.map((exercise) => (
                <tr key={exercise.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{exercise.title}</td>
                  <td className="px-6 py-4">{exercise.type}</td>
                  <td className="px-6 py-4">{exercise.questions.length}</td>
                  <td className="px-6 py-4 capitalize">{exercise.status}</td>
                 <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(exercise)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(exercise.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                </tr>
              ))}
              {filteredExercises.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No exercises found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
