import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import api from "@/lib/api";
import { Download, Eye } from "lucide-react";

/* ================= TYPES ================= */

interface Pedagogy {
  id: number;
  title: string;
  slug: string;
  description?: string;
  level?: string;
  skillType?: string;
  theme?: string;
  url?: string;
  pdfViewUrl?: string;
  downloadable: boolean;
  status: "draft" | "published" | "archived";
}

/* ================= COMPONENT ================= */

export default function PedagogiesList() {
  const { t } = useTranslation();
  const [pedagogies, setPedagogies] = useState<Pedagogy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPedagogies();
  }, []);

  const loadPedagogies = async () => {
    try {
      // Public endpoint → published only
      const res = await api.get("/pedagogies");
      setPedagogies(res.data || []);
    } catch (err) {
      console.error("Failed to load pedagogies:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAFE DOWNLOAD ================= */
  const handleDownload = async (id: number, title: string) => {
  try {
    const response = await api.get(`/pedagogies/${id}/download`, {
      responseType: "blob",
    });

    const blobUrl = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${title.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download PDF");
  }
};
  
  /* ================= View PDF Only ================= */

 const getInlinePdfUrl = (url: string) => {
  if (!url.includes("cloudinary.com")) return url;

  return url
    .replace("/raw/upload/", "/image/upload/fl_inline/")
    .replace(/\.pdf$/i, ".pdf");
};

  /* ================= UI ================= */

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          {t("loading") || "Loading pedagogy resources..."}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-2">
          {t("pedagogicalResources") || "Pedagogical Resources"}
        </h1>

        {pedagogies.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            {t("noResources") || "No pedagogical resources available."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pedagogies.map((pedagogy) => (
              <div
                key={pedagogy.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    {pedagogy.level && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                        {pedagogy.level}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {pedagogy.skillType}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {pedagogy.title}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {pedagogy.description}
                  </p>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    {/* ===== ACTION ===== */}
                    {pedagogy.url ? (
                      pedagogy.downloadable ? (
                       <button
                          onClick={() => handleDownload(pedagogy.id, pedagogy.title)}
                          className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </button>

                      ) : (
                      <a
                          href={pedagogy.pdfViewUrl ?? getInlinePdfUrl(pedagogy.url!)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          {t("viewPDF") || "View PDF"}
                        </a>
                      )
                    ) : (
                      <span className="text-sm text-red-500">
                        PDF unavailable
                      </span>
                    )}

                    <span className="text-xs text-gray-500">
                      {pedagogy.theme}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
