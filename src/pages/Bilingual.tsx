import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import { ExternalLink, Calendar, Users, Award, MapPin } from 'lucide-react';

export default function Bilingual() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">{t('bilingual')}</h1>
          <p className="text-xl max-w-3xl">
            {t('bilingualDescription')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Evaluation Form Section */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 mb-12">
          <div className="flex items-start gap-4">
            <ExternalLink className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {t('evaluationForm')}
              </h2>
              <p className="text-gray-700 mb-6">
                {t('fillEvaluationForm')}
              </p>
              <a
                href="https://forms.gle/example-evaluation-form"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <ExternalLink className="w-5 h-5" />
                Open Evaluation Form
              </a>
            </div>
          </div>
        </div>

        {/* Project Highlights */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('projectHighlights')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Teacher Training
            </h3>
            <p className="text-gray-600">
              Comprehensive training programs for French language teachers across Nigeria
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Resource Centers
            </h3>
            <p className="text-gray-600">
              Equipped resource centers in various institutions to support learning
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              French Clubs
            </h3>
            <p className="text-gray-600">
              Active French clubs promoting language practice and cultural exchange
            </p>
          </div>
        </div>

        {/* Events Section */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('events')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop"
              alt="Workshop"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">December 2024</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Teacher Training Workshop
              </h3>
              <p className="text-gray-600">
                Intensive workshop on innovative pedagogical methods for French language teaching
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=300&fit=crop"
              alt="Conference"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">November 2024</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                French Language Conference
              </h3>
              <p className="text-gray-600">
                Annual conference bringing together educators, students, and stakeholders
              </p>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('projectActivities')}</h2>
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Capacity Building Sessions
                </h3>
                <p className="text-gray-600">
                  Regular training sessions for teachers on modern teaching methodologies and digital tools
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Resource Center Development
                </h3>
                <p className="text-gray-600">
                  Establishment and equipping of resource centers in schools and universities
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  French Club Activities
                </h3>
                <p className="text-gray-600">
                  Support for French clubs with materials, activities, and networking opportunities
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Cultural Mediation Programs
                </h3>
                <p className="text-gray-600">
                  Programs promoting cultural exchange and understanding through French language
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
