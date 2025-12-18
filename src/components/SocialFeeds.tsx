import { useEffect } from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

interface SocialFeedsProps {
  facebookPageUrl?: string;
  twitterHandle?: string;
  instagramHandle?: string;
}

// Minimal type for FB SDK
interface FBSDK {
  XFBML: {
    parse: () => void;
  };
}

// Minimal type for Twitter widgets
interface TwitterWidgets {
  widgets: {
    load: () => void;
  };
}

const SocialFeeds = ({
  facebookPageUrl = "https://www.facebook.com/atoilenaija",
  twitterHandle = "atoilenaija",
  instagramHandle = "atoilenaija"
}: SocialFeedsProps) => {
  
  useEffect(() => {
    // Load Facebook SDK
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }

    // Load Twitter widgets
    if (window.twttr) {
      window.twttr.widgets.load();
    } else {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Follow Us on Social Media</h2>
          <p className="text-xl text-gray-600">Stay connected and join our community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Facebook Feed */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Facebook className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Facebook</h3>
            </div>
            <div className="fb-page" 
              data-href={facebookPageUrl}
              data-tabs="timeline"
              data-width="350"
              data-height="500"
              data-small-header="false"
              data-adapt-container-width="true"
              data-hide-cover="false"
              data-show-facepile="true">
              <blockquote cite={facebookPageUrl} className="fb-xfbml-parse-ignore">
                <a href={facebookPageUrl}>Loading Facebook feed...</a>
              </blockquote>
            </div>
          </div>

          {/* Twitter Feed */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-sky-500 rounded-lg">
                <Twitter className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Twitter</h3>
            </div>
            <a 
              className="twitter-timeline" 
              data-height="500"
              data-theme="light"
              href={`https://twitter.com/${twitterHandle}?ref_src=twsrc%5Etfw`}>
              Loading tweets...
            </a>
          </div>

          {/* Instagram Feed */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-lg">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Instagram</h3>
            </div>
            <div className="text-center py-8">
              <a 
                href={`https://www.instagram.com/${instagramHandle}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow font-semibold"
              >
                <Instagram className="w-5 h-5" />
                Follow us on Instagram
              </a>
              <p className="text-sm text-gray-500 mt-4">
                @{instagramHandle}
              </p>
              <div className="mt-6 text-gray-600">
                <p className="text-sm">View our latest posts and stories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">5K+</div>
            <div className="text-gray-600">Facebook Followers</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-sky-500 mb-2">3K+</div>
            <div className="text-gray-600">Twitter Followers</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">4K+</div>
            <div className="text-gray-600">Instagram Followers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    FB?: FBSDK;
    twttr?: TwitterWidgets;
  }
}

export default SocialFeeds;
