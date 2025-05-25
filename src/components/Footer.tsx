import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto text-right">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Logo & Description */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">تحليل النتائج</h3>
            <p className="text-gray-700 leading-relaxed">
              منصة تعليمية ذكية تُمكّنك من تحليل بيانات نتائج التلاميذ داخل ملفات إكسل،
              وتحويلها إلى تقارير PDF منظمة واحترافية تُسهل تتبع الأداء الدراسي
              واتخاذ قرارات مبنية على بيانات دقيقة.
            </p>
          </div>

          {/* Spacer if needed */}
          <div className="hidden md:block" />

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">من نحن</h3>
            <p className="text-gray-700 mb-2">شركة متخصصة في الخدمات المعلوماتية   </p>
            <a
              href="mailto:info@example.com"
              className="text-primary hover:underline font-medium"
            >
              info@example.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-12 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} تحليل النتائج — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
};

export default Footer;
