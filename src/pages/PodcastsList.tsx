
import { useEffect, useState, useRef } from "react";
import { Play, Clock, Volume2, Video, Pause } from "lucide-react";
import api from "@/lib/api";

interface Podcast {
  id: number;
  title: string;
  slug: string;
  description?: string;
  mediaType: "audio" | "video"; // Removed "youtube"
  audioUrl?: string;
  videoUrl?: string; // YouTube links now go here
  cefrLevel?: string;
  topic?: string;
  duration?: number;
  coverImage?: string;
  status: string;
  createdAt?: string;
  publishedAt?: string;
}

export default function PodcastsList() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
  try {
    const response = await api.get("/podcasts");
    setPodcasts(response.data?.filter((p: Podcast) => p.status === "published") || []);
  } catch (error) {
    console.error("Failed to load podcasts:", error);
    // Mock data for development
    setPodcasts([
      {
        id: 1,
        title: "French Basics 101",
        slug: "french-basics-101",
        description: "Learn the fundamentals of French language",
        mediaType: "audio",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cefrLevel: "A1",
        topic: "Basics",
        duration: 1800,
        coverImage: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=400",
        status: "published",
      },
      {
        id: 2,
        title: "Conversational French",
        slug: "conversational-french",
        description: "Practice everyday conversations in French",
        mediaType: "video",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        cefrLevel: "A2",
        topic: "Conversation",
        duration: 2400,
        coverImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400",
        status: "published",
      },
      {
        id: 3,
        title: "French Grammar Deep Dive",
        slug: "french-grammar",
        description: "Master French grammar rules and exceptions",
        mediaType: "audio",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cefrLevel: "B1",
        topic: "Grammar",
        duration: 3000,
        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f70674e90?w=400",
        status: "published",
      },
      {
        id: 4,
        title: "French Culture & Traditions",
        slug: "french-culture",
        description: "Explore French culture, traditions, and lifestyle",
        mediaType: "video",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        cefrLevel: "B2",
        topic: "Culture",
        duration: 2800,
        coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
        status: "published",
      },
      {
        id: 5,
        title: "French Pronunciation Guide",
        slug: "french-pronunciation",
        description: "Master French pronunciation with native speaker tips",
        mediaType: "video",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // YouTube link now
        cefrLevel: "A1",
        topic: "Pronunciation",
        duration: 1200,
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        status: "published",
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  // Auto-play video when currentPlaying changes
  useEffect(() => {
    if (!currentPlaying) return;

    const podcast = podcasts.find((p) => p.id === currentPlaying);
    if (podcast?.mediaType === "video") {
      const timer = setTimeout(() => {
        const videoElement = videoRefs.current[podcast.id];
        if (videoElement) videoElement.play().catch((err) => console.error("Video autoplay failed:", err));
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentPlaying, podcasts]);

  const handlePlayPodcast = (podcast: Podcast) => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setAudioElement(null);
    }

    if (currentPlaying === podcast.id) {
      const videoElement = videoRefs.current[podcast.id];
      if (videoElement) videoElement.pause();
      setCurrentPlaying(null);
      return;
    }

    if (podcast.mediaType === "audio" && podcast.audioUrl) {
      const audio = new Audio(podcast.audioUrl);
      audio.play().catch((err) => console.error("Audio play failed:", err));
      audio.onended = () => setCurrentPlaying(null);

      setAudioElement(audio);
      setCurrentPlaying(podcast.id);
    } else if (podcast.mediaType === "video" && podcast.videoUrl) {
      setCurrentPlaying(podcast.id);
    }
  };

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesLevel = !selectedLevel || podcast.cefrLevel === selectedLevel;
    const matchesTopic = !selectedTopic || podcast.topic === selectedTopic;
    return matchesLevel && matchesTopic;
  });

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const topics = ["Basics", "Conversation", "Grammar", "Culture", "Business", "Pronunciation"];

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Podcast Library</h1>
          <p className="text-xl">Listen to engaging French language learning podcasts</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CEFR Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Podcasts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        ) : filteredPodcasts.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <Volume2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>No podcasts found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPodcasts.map((podcast) => {
              const isYouTube = podcast.videoUrl?.includes("youtube.com") || podcast.videoUrl?.includes("youtu.be");
              return (
                <div key={podcast.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {/* Media Container */}
                  <div className="relative h-48 overflow-hidden bg-gray-900">
                    {currentPlaying === podcast.id && podcast.mediaType === "video" ? (
                      isYouTube ? (
                        <iframe
                          src={podcast.videoUrl}
                          title={podcast.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      ) : (
                        <video
                          ref={(el) => { if (el) videoRefs.current[podcast.id] = el; }}
                          src={podcast.videoUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-cover"
                          onError={(e) => console.error("Video error:", e)}
                        />
                      )
                    ) : (
                      <>
                        <img
                          src={podcast.coverImage || "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400"}
                          alt={podcast.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {podcast.mediaType === "audio" && (
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent flex items-center justify-center">
                            <div className="bg-blue-600 rounded-full p-4 shadow-lg">
                              <Volume2 className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Media Type Icon */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-2">
                      {podcast.mediaType === "audio" ? (
                        <Volume2 className="w-5 h-5 text-blue-400" />
                      ) : isYouTube ? (
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      ) : (
                        <Video className="w-5 h-5 text-red-400" />
                      )}
                    </div>

                    {/* Media Type Label */}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 px-3 py-1 rounded-full">
                      <span className={`text-xs font-bold ${
                        isYouTube ? "text-red-500" : podcast.mediaType === "video" ? "text-red-400" : "text-blue-400"
                      }`}>
                        {isYouTube ? "YOUTUBE" : podcast.mediaType === "video" ? "VIDEO" : "AUDIO"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Badges */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                        isYouTube ? "bg-red-100 text-red-800" : podcast.mediaType === "video" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {isYouTube ? "YouTube" : podcast.mediaType === "video" ? "Video" : "Audio"}
                      </span>
                      {podcast.cefrLevel && (
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                          {podcast.cefrLevel}
                        </span>
                      )}
                      {podcast.topic && (
                        <span className="inline-block px-3 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full">
                          {podcast.topic}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {podcast.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {podcast.description || "No description available"}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDuration(podcast.duration)}
                      </div>
                      <button
                        onClick={() => handlePlayPodcast(podcast)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          currentPlaying === podcast.id
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                      >
                        {currentPlaying === podcast.id ? (
                          <>
                            <Pause className="w-4 h-4" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Listen
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
