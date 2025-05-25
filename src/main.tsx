import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// PWA Registration with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    if (window.confirm('يتوفر تحديث جديد للتطبيق. هل تريد التحديث الآن؟')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('التطبيق جاهز للعمل بدون إنترنت');
    
    // Use the Notification API if available and permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('تحليل نقط التلاميذ', {
        body: 'التطبيق جاهز للعمل بدون إنترنت',
        icon: '/icons/icon-192x192.png'
      });
    }
  }
})

// Check if the app is in standalone mode (installed)
const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
if (isInStandaloneMode) {
  console.log('تم تشغيل التطبيق في وضع مستقل (تم التثبيت على الجهاز)');
}

// Request permission for notifications
if ('Notification' in window && Notification.permission !== 'granted') {
  // Request permission at a user interaction to avoid being blocked
  document.addEventListener('click', () => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, { once: true });
}

// Custom function to cache processed Excel data
window.cacheProcessedData = (key, data) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_PROCESSED_DATA',
      key,
      data
    });
  }
};

// Add the type definition to Window interface
declare global {
  interface Window {
    cacheProcessedData: (key: string, data: any) => void;
  }
}

// Mount the React application
createRoot(document.getElementById("root")!).render(<App />);
