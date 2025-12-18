/**
 * Social media integration service
 * Handles sharing and social media embeds
 */

export interface ShareOptions {
  title: string;
  description: string;
  url: string;
  image?: string;
  hashtags?: string[];
}

/**
 * Share content on Facebook
 */
export function shareOnFacebook(options: ShareOptions): void {
  const url = new URL("https://www.facebook.com/sharer/sharer.php");
  url.searchParams.append("u", options.url);
  url.searchParams.append("quote", options.title);

  window.open(url.toString(), "facebook-share", "width=600,height=400");
}

/**
 * Share content on Twitter/X
 */
export function shareOnTwitter(options: ShareOptions): void {
  const text = `${options.title} - ${options.description}`;
  const hashtags = options.hashtags?.join(",") || "AtoileNaija,FrenchLearning";

  const url = new URL("https://twitter.com/intent/tweet");
  url.searchParams.append("text", text);
  url.searchParams.append("url", options.url);
  url.searchParams.append("hashtags", hashtags);

  window.open(url.toString(), "twitter-share", "width=600,height=400");
}

/**
 * Share content on LinkedIn
 */
export function shareOnLinkedIn(options: ShareOptions): void {
  const url = new URL("https://www.linkedin.com/sharing/share-offsite/");
  url.searchParams.append("url", options.url);

  window.open(url.toString(), "linkedin-share", "width=600,height=400");
}

/**
 * Share content on WhatsApp
 */
export function shareOnWhatsApp(options: ShareOptions): void {
  const text = `${options.title}\n${options.description}\n${options.url}`;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;

  window.open(url, "whatsapp-share", "width=600,height=400");
}

/**
 * Copy share link to clipboard
 */
export async function copyToClipboard(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Generate Open Graph meta tags
 */
export function generateOpenGraphTags(options: ShareOptions): string {
  return `
    <meta property="og:title" content="${options.title}" />
    <meta property="og:description" content="${options.description}" />
    <meta property="og:url" content="${options.url}" />
    ${options.image ? `<meta property="og:image" content="${options.image}" />` : ""}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Atoile Naija" />
  `;
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterCardTags(options: ShareOptions): string {
  return `
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${options.title}" />
    <meta name="twitter:description" content="${options.description}" />
    <meta name="twitter:url" content="${options.url}" />
    ${options.image ? `<meta name="twitter:image" content="${options.image}" />` : ""}
    <meta name="twitter:site" content="@AtoileNaija" />
  `;
}

/**
 * Embed Facebook feed
 */
export function embedFacebookFeed(containerId: string, pageUrl: string): void {
  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
  document.body.appendChild(script);

  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="fb-page" 
        data-href="${pageUrl}" 
        data-tabs="timeline" 
        data-width="500" 
        data-height="600" 
        data-small-header="false" 
        data-adapt-container-width="true" 
        data-hide-cover="false" 
        data-show-facepile="true">
      </div>
    `;
  }
}

/**
 * Embed Twitter feed
 */
export function embedTwitterFeed(containerId: string, tweetUrl: string): void {
  const script = document.createElement("script");
  script.src = "https://platform.twitter.com/widgets.js";
  script.async = true;
  document.body.appendChild(script);

  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<blockquote class="twitter-tweet"><a href="${tweetUrl}"></a></blockquote>`;
  }
}

/**
 * Embed Instagram feed
 */
export function embedInstagramFeed(containerId: string, username: string): void {
  const script = document.createElement("script");
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  document.body.appendChild(script);

  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <blockquote class="instagram-media" 
        data-instgrm-permalink="https://www.instagram.com/${username}/" 
        data-instgrm-version="14">
      </blockquote>
    `;
  }
}

/**
 * Get share count for a URL (requires backend API)
 */
export async function getShareCount(url: string): Promise<{
  facebook?: number;
  twitter?: number;
  linkedin?: number;
}> {
  try {
    const response = await fetch("/api/social/share-count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error("Failed to get share count");
    }

    return await response.json();
  } catch (error) {
    console.error("Share count error:", error);
    return {};
  }
}
