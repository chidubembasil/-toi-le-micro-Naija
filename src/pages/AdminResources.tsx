import { useEffect, useState } from "react";
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
} from "lucide-react";
import { isAxiosError } from "axios";

interface ResourceItem {
  id: number;
  title: string;
  url: string;
  description?: string;
  category?: string;
  status: "draft" | "published";
  createdAt: string;
}

export default function AdminResources() {
  const { t } = useTranslation();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
  });

 const loadResources = async () => {
  try {
    const res = await api.get("https://atoile-micro-naija-backend-production2.up.railway.app/api/resources/admin/all");
    setResources(res.data);
  } catch (error) {
    console.error("Failed to load resources:", error);
  }
};


  useEffect(() => {
    loadResources();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      url: "",
      description: "",
      category: "",
    });
  };

  const openCreate = () => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  const openEdit = (item: ResourceItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      url: item.url,
      description: item.description || "",
      category: item.category || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingId === null) {
        await api.post("https://atoile-micro-naija-backend-production2.up.railway.app/api/resources", form);
      } else {
        await api.put(`https://atoile-micro-naija-backend-production2.up.railway.app/api/resources/${editingId}`, form);
      }

      await loadResources();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save resource:", error);

      if (isAxiosError(error)) {
        alert(error.response?.data?.error || "Failed to save resource");
      } else {
        alert("Error saving resource");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("deleteConfirm") || "Are you sure you want to delete this?"))
      return;

    try {
      await api.delete(`https://atoile-micro-naija-backend-production2.up.railway.app/api/resources/${id}`);
      await loadResources();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete resource");
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await api.post(`https://atoile-micro-naija-backend-production2.up.railway.app/api/resources/${id}/publish`);
      await loadResources();
    } catch (error) {
      console.error("Publish failed:", error);
      alert("Failed to publish resource");
    }
  };

  const filtered = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.category ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || r.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Curated Resources</h1>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} /> Add Resource
        </button>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border rounded pl-8 p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-2 top-2 text-gray-400" size={18} />
          <select
            className="border rounded pl-8 p-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2 capitalize">{item.status}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => openEdit(item)}
                  >
                    <Edit size={18} />
                  </button>

                  {item.status === "draft" && (
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => handlePublish(item.id)}
                    >
                      Publish
                    </button>
                  )}

                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Resource" : "Add Resource"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                className="border p-2 rounded w-full"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="URL"
                className="border p-2 rounded w-full"
                value={form.url}
                onChange={(e) =>
                  setForm({ ...form, url: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className="border p-2 rounded w-full"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                 <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
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

            <div className="flex justify-end mt-4 gap-3">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSave}
              >
                <Save size={18} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
