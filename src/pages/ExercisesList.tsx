import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Exercise {
  id: number;
  title: string;
  slug: string;
  description: string;
  exerciseType: string;
  status: string;
  difficulty: string;
  questions: number;
  image: string;
}

export default function ExercisesList() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const response = await api.get("/exercises");
      setExercises(response.data?.filter((a: Exercise) => a.status === "published") || []);
    } catch (error) {
      console.error("Failed to load articles:", error);
      // Mock data for development
        setExercises([
        {
          id: 1,
          title: "French Greetings Quiz",
          slug: "french-greetings-quiz",
          description: "Test your knowledge of French greetings",
          exerciseType: "mcq",
          status: "published",
          difficulty: "Beginner",
          questions: 10,
          image: "https://via.placeholder.com/400x250?text=Greetings",
        },
        {
          id: 2,
          title: "Verb Conjugation Exercise",
          slug: "verb-conjugation",
          description: "Practice present tense verb conjugation",
          exerciseType: "gap_filling",
          status: "published",
          difficulty: "Intermediate",
          questions: 15,
          image: "https://via.placeholder.com/400x250?text=Verbs",
        },
        {
          id: 3,
          title: "Vocabulary Matching",
          slug: "vocabulary-matching",
          description: "Match French words with their English translations",
          exerciseType: "matching",
          status: "published",
          difficulty: "Beginner",
          questions: 20,
          image: "https://via.placeholder.com/400x250?text=Vocabulary",
        },
        ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter((exercise) => {
    return !selectedType || exercise.exerciseType === selectedType;
  });

  const types = [
    { value: "mcq", label: "Multiple Choice" },
    { value: "gap_filling", label: "Gap Filling" },
    { value: "matching", label: "Matching" },
    { value: "sequencing", label: "Sequencing" },
    { value: "true_false", label: "True/False" },
  ];

  const getTypeLabel = (type: string) => {
    return types.find((t) => t.value === type)?.label || type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Interactive Exercises</h1>
          <p className="text-gray-600 mt-2">
            Practice and improve your French language skills
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exercise Type
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedType("")}
              className={`px-4 py-2 rounded-lg transition ${
                !selectedType
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Types
            </button>
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedType === type.value
                    ? "bg-green-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading...</div>
        ) : filteredExercises.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No exercises found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={exercise.image}
                  alt={exercise.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {getTypeLabel(exercise.exerciseType)}
                    </span>
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      {exercise.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {exercise.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{exercise.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {exercise.questions} questions
                    </span>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                      Start
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
