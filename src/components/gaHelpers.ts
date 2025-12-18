// Define the GA command types
type GtagEvent = {
  event_category?: string;
  event_label?: string;
  value?: number;
};

declare global {
  interface Window {
    gtag?: (command: 'config' | 'event', targetId: string, params?: GtagEvent | { page_path?: string }) => void;
    dataLayer: unknown[];
  }
}

/**
 * Track a custom event
 */
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};

/**
 * Track page view
 */
export const trackPageView = (url: string, measurementId: string) => {
  window.gtag?.('config', measurementId, { page_path: url });
};

/**
 * Track specific user interactions
 */
export const trackDownload = (fileName: string) => {
  trackEvent('download', 'File', fileName);
};

export const trackShare = (platform: string, contentTitle: string) => {
  trackEvent('share', 'Social', `${platform} - ${contentTitle}`);
};

export const trackPodcastPlay = (podcastTitle: string) => {
  trackEvent('play', 'Podcast', podcastTitle);
};

export const trackExerciseComplete = (exerciseTitle: string, score: number) => {
  trackEvent('complete', 'Exercise', exerciseTitle, score);
};
