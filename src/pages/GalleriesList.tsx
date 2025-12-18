import { useEffect, useState } from "react";
import api from "@/lib/api";

interface GalleryItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  state: string;
  itemCount: number;
  mediaUrl: string;
  mediaType: "image" | "video";
}

export default function GalleriesList() {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
   try {
      const response = await api.get("/galleries");
      setGalleries(response.data?.filter((a: GalleryItem) => a.status === "published") || []);
    } catch (error) {
      console.error("Failed to load galleries:", error);
      // Mock data for development
        setGalleries([
        {
          id: 1,
          title: "Lagos Workshop 2024",
          slug: "lagos-workshop-2024",
          description: "Photos from our French language workshop in Lagos",
          category: "workshop",
          status: "published",
          state: "Lagos",
          itemCount: 24,
          mediaUrl: "https://via.placeholder.com/400x250?text=Lagos+Workshop",
          mediaType: "image",
        },
        {
          id: 2,
          title: "Teacher Training Session",
          slug: "teacher-training",
          description: "Training session for French language teachers",
          category: "training",
          status: "published",
          state: "Abuja",
          itemCount: 18,
          mediaUrl: "https://via.placeholder.com/400x250?text=Training",
          mediaType: "image",
        },
        {
          id: 3,
          title: "Student Testimonials",
          slug: "student-testimonials",
          description: "Video testimonies from our students",
          category: "testimonial",
          status: "published",
          state: "Lagos",
          itemCount: 12,
          mediaUrl: "https://via.placeholder.com/400x250?text=Testimonials",
          mediaType: "image",
        },
       ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredGalleries = galleries.filter((gallery) => {
    const matchesCategory = !selectedCategory || gallery.category === selectedCategory;
    const matchesState = !selectedState || gallery.state === selectedState;
    return matchesCategory && matchesState;
  });

  const categories = ["workshop", "training", "testimonial", "event"];
  const nigerianStates = [
    "Lagos",
    "Abuja",
    "Kano",
    "Ibadan",
    "Enugu",
    "Port Harcourt",
    "Katsina",
    "Kaduna",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Photo & Video Gallery</h1>
          <p className="text-gray-600 mt-2">
            Explore photos and videos from our events and activities
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All States</option>
                {nigerianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Galleries Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading...</div>
        ) : filteredGalleries.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No galleries found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGalleries.map((gallery) => (
              <div
                key={gallery.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {gallery.mediaType === "video" ? (
                <video
                  src={gallery.mediaUrl}
                  controls
                  className="w-full h-48 object-cover"
                />
              ) : (
                <img
                  src={gallery.mediaUrl}
                  alt={gallery.title}
                  className="w-full h-48 object-cover"
                />
              )}

                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full mb-3 capitalize">
                    {gallery.category}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {gallery.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{gallery.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>📍 {gallery.state}</span>
                      <span>•</span>
                      <span>{gallery.itemCount} items</span>
                    </div>
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
