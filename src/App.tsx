import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminNews from "@/pages/AdminNews";
import AdminPodcasts from "@/pages/AdminPodcasts";
import AdminExercises from "@/pages/AdminExercises";
import AdminGalleries from "@/pages/AdminGalleries";
import AdminResources from "@/pages/AdminResources";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AdminPedagogies from "./pages/AdminPedagogies";

function App() {
  const { hydrate, isLoading } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        

        {/* Admin Routes */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/news" element={<AdminNews />} />
        <Route path="/podcasts" element={<AdminPodcasts />} />
        <Route path="/exercises" element={<AdminExercises />} />
        <Route path="/galleries" element={<AdminGalleries />} />
        <Route path="/resources" element={<AdminResources />} />
        <Route path="/pedagogies" element={<AdminPedagogies />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
     </BrowserRouter>
  );
}

export default App;
