import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import InstallPWA from './InstallPWA';

const Navigation = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if the device is iOS
    const checkIfIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    
    setIsIOS(checkIfIOS());
  }, []);

  const toggleIOSInstructions = () => {
    setShowIOSInstructions(!showIOSInstructions);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            تحليل نقط التلاميذ
          </Link>
          
          <div className="flex items-center gap-3">
            {/* InstallPWA will automatically hide if not installable */}
            <InstallPWA showTooltip={false} buttonText="تثبيت التطبيق" />

            {isIOS && (
              <div className="relative">
                <button
                  onClick={toggleIOSInstructions}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300"
                >
                  <Info size={18} />
                  <span>كيفية التثبيت</span>
                </button>
                
                {showIOSInstructions && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 p-4 text-right rtl">
                    <h3 className="font-bold mb-2">لتثبيت التطبيق على جهازك:</h3>
                    <ol className="space-y-2 text-sm leading-relaxed">
                      <li>1. اضغط على زر المشاركة <span className="inline-block">📤</span> أسفل المتصفح</li>
                      <li>2. اختر "إضافة إلى الشاشة الرئيسية"</li>
                      <li>3. اضغط "إضافة" للتأكيد</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
