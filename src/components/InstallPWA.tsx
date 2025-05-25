import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// Add it to the global WindowEventMap
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

interface InstallPWAProps {
  className?: string;
  buttonText?: string;
  showTooltip?: boolean;
}

const InstallPWA: React.FC<InstallPWAProps> = ({ 
  className = '', 
  buttonText = 'تثبيت التطبيق',
  showTooltip = true
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(showTooltip);
  const [isIOS, setIsIOS] = useState(false);
  const [debugMessage, setDebugMessage] = useState<string>('');

  // Check if the app is running in standalone mode (already installed)
  const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;

  useEffect(() => {
    // Check if running on iOS
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    setIsIOS(iOS);

    // Log a debug message
    console.log('🔍 PWA Debug:', { 
      isInStandaloneMode: window.matchMedia('(display-mode: standalone)').matches,
      isIOS: iOS,
      userAgent: ua
    });

    // Function to handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
      setDebugMessage('📱 Install prompt captured and ready!');
      console.log('📱 beforeinstallprompt event fired and stored');
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for the appinstalled event
    window.addEventListener('appinstalled', (e) => {
      setIsInstallable(false);
      setDebugMessage('✅ App was installed successfully!');
      console.log('✅ appinstalled event fired', e);
    });

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  // Function to handle install button click
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setDebugMessage('❌ Install prompt not available');
      console.log('❌ Install prompt not available');
      return;
    }

    try {
      // Show the prompt
      await deferredPrompt.prompt();
      setDebugMessage('🚀 Install prompt shown to user');
      
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('👍 User accepted the installation');
        setDebugMessage('👍 Installation accepted');
      } else {
        console.log('👎 User dismissed the installation');
        setDebugMessage('👎 Installation dismissed');
      }
    } catch (error) {
      console.error('❌ Error showing install prompt:', error);
      setDebugMessage(`❌ Error: ${error}`);
    }
    
    // Clear the deferredPrompt - it can only be used once
    setDeferredPrompt(null);
  };

  // If the app is already installed or running on iOS Safari where install banners aren't supported
  if (isAppInstalled) {
    return null;
  }

  // For iOS devices, we need to show manual installation instructions
  if (isIOS) {
    return (
      <div className={`relative ${className}`}>
        {showTooltipState && (
          <div 
            className="absolute bottom-full mb-2 right-0 bg-blue-600 text-white p-2 rounded shadow-lg text-sm animate-pulse"
            onClick={() => setShowTooltipState(false)}
          >
            تثبيت التطبيق للاستخدام بدون انترنت على iOS!
            <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-blue-600"></div>
          </div>
        )}
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          onClick={() => alert('للتثبيت على iOS: اضغط على زر المشاركة (📤) في المتصفح ثم اختر "إضافة إلى الشاشة الرئيسية"')}
        >
          <Download size={18} />
          <span>{buttonText}</span>
        </button>
      </div>
    );
  }

  // Show button only if the app is installable
  if (!isInstallable) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {showTooltipState && (
        <div 
          className="absolute bottom-full mb-2 right-0 bg-blue-600 text-white p-2 rounded shadow-lg text-sm animate-pulse"
          onClick={() => setShowTooltipState(false)}
        >
          تثبيت التطبيق للاستخدام بدون انترنت!
          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-blue-600"></div>
        </div>
      )}
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
      >
        <Download size={18} />
        <span>{buttonText}</span>
      </button>
      {process.env.NODE_ENV === 'development' && debugMessage && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800 text-white p-1 rounded text-xs">
          {debugMessage}
        </div>
      )}
    </div>
  );
};

export default InstallPWA; 