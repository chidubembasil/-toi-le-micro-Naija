import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      news: 'News & Blog',
      podcasts: 'Podcasts',
      exercises: 'Interactive Exercises',
      galleries: 'Galleries',
      activities: 'Pedagogical Activities',
      resources: 'Resources',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      logout: 'Logout',
      dashboard: 'Dashboard',
      
      // Homepage
      welcome: 'Welcome to À toi le micro Naija',
      welcomeSubtitle: 'A digital initiative to strengthen French language learning in Nigeria',
      learnMore: 'Learn More',
      featuredProjects: 'Featured Projects',
      latestNews: 'Latest News',
      featuredPodcasts: 'Featured Podcasts',
      
      // Bilingual and Competitive
      bilingual: 'Bilingual and Competitive',
      bilingualDescription: 'The "Bilingual and Competitive" project aims to strengthen the learning and use of French among young Nigerians, improve the professional relevance of French language training, and support teachers through innovative pedagogical resources.',
      evaluationForm: 'Evaluation Form',
      fillEvaluationForm: 'Technical officers can fill the evaluation form',
      projectHighlights: 'Project Highlights',
      events: 'Events',
      projectActivities: 'Activities',
      
      // News
      readMore: 'Read More',
      publishedOn: 'Published on',
      by: 'by',
      category: 'Category',
      searchNews: 'Search news...',
      filterByCategory: 'Filter by category',
      filterByState: 'Filter by state',
      allCategories: 'All Categories',
      allStates: 'All States',
      noNewsFound: 'No news articles found',
      
      // Podcasts
      duration: 'Duration',
      level: 'Level',
      topic: 'Topic',
      audience: 'Audience',
      transcript: 'Transcript',
      download: 'Download',
      play: 'Play',
      pause: 'Pause',
      searchPodcasts: 'Search podcasts...',
      filterByLevel: 'Filter by level',
      filterByTopic: 'Filter by topic',
      noPodcastsFound: 'No podcasts found',
      submitPodcast: 'Submit Your Podcast',
      
      // Exercises
      startExercise: 'Start Exercise',
      submitAnswers: 'Submit Answers',
      showAnswers: 'Show Answers',
      hideAnswers: 'Hide Answers',
      score: 'Score',
      correct: 'Correct',
      incorrect: 'Incorrect',
      exerciseType: 'Exercise Type',
      mcq: 'Multiple Choice',
      gapFilling: 'Gap Filling',
      matching: 'Matching',
      sequencing: 'Sequencing',
      trueFalse: 'True/False',
      noExercisesFound: 'No exercises found',
      
      // Galleries
      photos: 'Photos',
      videos: 'Videos',
      viewGallery: 'View Gallery',
      noGalleriesFound: 'No galleries found',
      
      // Admin
      adminDashboard: 'Admin Dashboard',
      manageNews: 'Manage News',
      managePodcasts: 'Manage Podcasts',
      manageExercises: 'Manage Exercises',
      manageGalleries: 'Manage Galleries',
      manageActivities: 'Manage Activities',
      manageResources: 'Manage Resources',
      createNew: 'Create New',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      publish: 'Publish',
      unpublish: 'Unpublish',
      draft: 'Draft',
      published: 'Published',
      archived: 'Archived',
      
      // Forms
      title: 'Title',
      description: 'Description',
      content: 'Content',
      excerpt: 'Excerpt',
      coverImage: 'Cover Image',
      audioFile: 'Audio File',
      videoFile: 'Video File',
      uploadFile: 'Upload File',
      selectFile: 'Select File',
      state: 'State',
      status: 'Status',
      language: 'Language',
      
      // Common
      search: 'Search',
      filter: 'Filter',
      clear: 'Clear',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      page: 'Page',
      of: 'of',
      showing: 'Showing',
      results: 'results',
      
      // Footer
      followUs: 'Follow Us',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      copyright: '© 2024 À toi le micro Naija. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      
      // Messages
      loginSuccess: 'Login successful',
      loginError: 'Login failed. Please check your credentials.',
      logoutSuccess: 'Logout successful',
      saveSuccess: 'Saved successfully',
      saveError: 'Failed to save. Please try again.',
      deleteSuccess: 'Deleted successfully',
      deleteError: 'Failed to delete. Please try again.',
      deleteConfirm: 'Are you sure you want to delete this item?',
    },
  },
  fr: {
    translation: {
      // Navigation
      home: 'Accueil',
      news: 'Actualités & Blog',
      podcasts: 'Podcasts',
      exercises: 'Exercices Interactifs',
      galleries: 'Galeries',
      activities: 'Activités Pédagogiques',
      resources: 'Ressources',
      about: 'À propos',
      contact: 'Contact',
      login: 'Connexion',
      logout: 'Déconnexion',
      dashboard: 'Tableau de bord',
      
      // Homepage
      welcome: 'Bienvenue sur À toi le micro Naija',
      welcomeSubtitle: 'Une initiative numérique pour renforcer l\'apprentissage du français au Nigeria',
      learnMore: 'En savoir plus',
      featuredProjects: 'Projets en vedette',
      latestNews: 'Dernières actualités',
      featuredPodcasts: 'Podcasts en vedette',
      
      // Bilingual and Competitive
      bilingual: 'Bilingue et Compétitif',
      bilingualDescription: 'Le projet "Bilingue et Compétitif" vise à renforcer l\'apprentissage et l\'utilisation du français chez les jeunes Nigérians, améliorer la pertinence professionnelle de la formation en langue française et soutenir les enseignants grâce à des ressources pédagogiques innovantes.',
      evaluationForm: 'Formulaire d\'évaluation',
      fillEvaluationForm: 'Les agents techniques peuvent remplir le formulaire d\'évaluation',
      projectHighlights: 'Points forts du projet',
      events: 'Événements',
      projectActivities: 'Activités',
      
      // News
      readMore: 'Lire la suite',
      publishedOn: 'Publié le',
      by: 'par',
      category: 'Catégorie',
      searchNews: 'Rechercher des actualités...',
      filterByCategory: 'Filtrer par catégorie',
      filterByState: 'Filtrer par état',
      allCategories: 'Toutes les catégories',
      allStates: 'Tous les états',
      noNewsFound: 'Aucun article trouvé',
      
      // Podcasts
      duration: 'Durée',
      level: 'Niveau',
      topic: 'Sujet',
      audience: 'Public',
      transcript: 'Transcription',
      download: 'Télécharger',
      play: 'Lire',
      pause: 'Pause',
      searchPodcasts: 'Rechercher des podcasts...',
      filterByLevel: 'Filtrer par niveau',
      filterByTopic: 'Filtrer par sujet',
      noPodcastsFound: 'Aucun podcast trouvé',
      submitPodcast: 'Soumettre votre podcast',
      
      // Exercises
      startExercise: 'Commencer l\'exercice',
      submitAnswers: 'Soumettre les réponses',
      showAnswers: 'Afficher les réponses',
      hideAnswers: 'Masquer les réponses',
      score: 'Score',
      correct: 'Correct',
      incorrect: 'Incorrect',
      exerciseType: 'Type d\'exercice',
      mcq: 'Choix multiples',
      gapFilling: 'Remplissage de blancs',
      matching: 'Appariement',
      sequencing: 'Séquençage',
      trueFalse: 'Vrai/Faux',
      noExercisesFound: 'Aucun exercice trouvé',
      
      // Galleries
      photos: 'Photos',
      videos: 'Vidéos',
      viewGallery: 'Voir la galerie',
      noGalleriesFound: 'Aucune galerie trouvée',
      
      // Admin
      adminDashboard: 'Tableau de bord administrateur',
      manageNews: 'Gérer les actualités',
      managePodcasts: 'Gérer les podcasts',
      manageExercises: 'Gérer les exercices',
      manageGalleries: 'Gérer les galeries',
      manageActivities: 'Gérer les activités',
      manageResources: 'Gérer les ressources',
      createNew: 'Créer nouveau',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      publish: 'Publier',
      unpublish: 'Dépublier',
      draft: 'Brouillon',
      published: 'Publié',
      archived: 'Archivé',
      
      // Forms
      title: 'Titre',
      description: 'Description',
      content: 'Contenu',
      excerpt: 'Extrait',
      coverImage: 'Image de couverture',
      audioFile: 'Fichier audio',
      videoFile: 'Fichier vidéo',
      uploadFile: 'Télécharger un fichier',
      selectFile: 'Sélectionner un fichier',
      state: 'État',
      status: 'Statut',
      language: 'Langue',
      
      // Common
      search: 'Rechercher',
      filter: 'Filtrer',
      clear: 'Effacer',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      confirm: 'Confirmer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      page: 'Page',
      of: 'de',
      showing: 'Affichage',
      results: 'résultats',
      
      // Footer
      followUs: 'Suivez-nous',
      quickLinks: 'Liens rapides',
      contactUs: 'Contactez-nous',
      copyright: '© 2024 À toi le micro Naija. Tous droits réservés.',
      privacyPolicy: 'Politique de confidentialité',
      termsOfService: 'Conditions d\'utilisation',
      
      // Messages
      loginSuccess: 'Connexion réussie',
      loginError: 'Échec de la connexion. Veuillez vérifier vos identifiants.',
      logoutSuccess: 'Déconnexion réussie',
      saveSuccess: 'Enregistré avec succès',
      saveError: 'Échec de l\'enregistrement. Veuillez réessayer.',
      deleteSuccess: 'Supprimé avec succès',
      deleteError: 'Échec de la suppression. Veuillez réessayer.',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
