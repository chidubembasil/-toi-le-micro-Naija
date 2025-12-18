/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GA_MEASUREMENT_ID: string;
  readonly VITE_FACEBOOK_PAGE_URL: string;
  readonly VITE_TWITTER_HANDLE: string;
  readonly VITE_INSTAGRAM_HANDLE: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string;
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
