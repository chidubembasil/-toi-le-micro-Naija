import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "À toi le micro Naija",
      description: t('welcomeSubtitle'),
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop",
      cta: t('learnMore'),
      link: "/about",
    },
    {
      id: 2,
      title: "Bilingual and Competitive",
      description: t('bilingualDescription'),
      image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&h=400&fit=crop",
      cta: t('learnMore'),
      link: "/bilingual",
    },
    {
      id: 3,
      title: "French Education Fund (FEF)",
      description: "Supporting French language education across Nigeria",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=400&fit=crop",
      cta: t('learnMore'),
      link: "/about",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Layout>
      {/* Hero Slider */}
      <div className="relative h-[500px] bg-gray-900 overflow-hidden">
        <div className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  <h2 className="text-5xl md:text-6xl font-bold mb-6">{slide.title}</h2>
                  <p className="text-xl md:text-2xl mb-8">{slide.description}</p>
                  <Link
                    to={slide.link}
                    className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('welcome')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('welcomeSubtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          {t('featuredProjects')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link
            to="/news"
            className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-2xl transition-all duration-300 border border-blue-200 transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {t('news')}
            </h3>
            <p className="text-gray-600">
              Stay updated with latest news and articles about French education
            </p>
          </Link>

          <Link
            to="/podcasts"
            className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-2xl transition-all duration-300 border border-purple-200 transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">🎙️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              {t('podcasts')}
            </h3>
            <p className="text-gray-600">
              Listen to engaging French language learning podcasts
            </p>
          </Link>

          <Link
            to="/exercises"
            className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-2xl transition-all duration-300 border border-green-200 transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">✏️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
              {t('exercises')}
            </h3>
            <p className="text-gray-600">
              Practice with interactive exercises and quizzes
            </p>
          </Link>

          <Link
            to="/galleries"
            className="group p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl hover:shadow-2xl transition-all duration-300 border border-yellow-200 transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">🖼️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
              {t('galleries')}
            </h3>
            <p className="text-gray-600">
              View photos and videos from our educational events
            </p>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Learn French?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of students learning French with À toi le micro Naija
          </p>
          <Link
            to="/podcasts"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg"
          >
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">1000+</div>
            <div className="text-gray-600 text-lg">Students</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-bold text-purple-600 mb-2">50+</div>
            <div className="text-gray-600 text-lg">Podcasts</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-bold text-green-600 mb-2">100+</div>
            <div className="text-gray-600 text-lg">Exercises</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
