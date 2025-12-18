import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Search, ExternalLink, Filter } from "lucide-react";

interface ResourceItem {
  id: number;
  title: string;
  url: string;
  description?: string;
  category?: string;
  createdAt: string;
}

export default function ResourcesList() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [categories, setCategories] = useState<string[]>([]);

  const loadResources = async () => {
  try {
    const res = await api.get<ResourceItem[]>("/resources");

    setResources(res.data);

    // Extract categories safely
    const cats: string[] = Array.from(
      new Set(
        res.data
          .map((i) => i.category ?? "") // always returns a string
          .filter((c) => c.trim() !== "") // remove empty strings
      )
    );

    setCategories(cats);
  } catch (error) {
    console.error("Failed to load resources:", error);
  }
};

  useEffect(() => {
    loadResources();
  }, []);

  const filtered = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Curated Learning Resources</h1>

      {/* Search + Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">

        {/* Search bar */}
        <div className="relative w-full md:w-1/2">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full border rounded pl-10 p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div className="relative w-full md:w-1/3">
          <Filter size={18} className="absolute left-3 top-3 text-gray-400" />

          <select
            className="w-full border rounded pl-10 p-2"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>

            {item.category && (
              <p className="text-sm text-blue-600 font-medium mt-1">
                {item.category}
              </p>
            )}

            {item.description && (
              <p className="text-gray-600 mt-3 text-sm">
                {item.description.length > 150
                  ? item.description.substring(0, 150) + "..."
                  : item.description}
              </p>
            )}

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Visit Resource <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No resources found.</p>
      )}
    </div>
  );
}
