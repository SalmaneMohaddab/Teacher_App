import React, { useState } from 'react';
import { FileText, X, Calendar } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

interface PDFButtonProps {
  analysisData: any;
  fileName: string;
}

const PDFButton: React.FC<PDFButtonProps> = ({ analysisData, fileName }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [examDate, setExamDate] = useState('');
  const [correctionDate, setCorrectionDate] = useState('');

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      // Create a copy of the analysis data and update the dates
      const updatedData = {
        ...analysisData,
        examDate,
        correctionDate
      };
      
      await generatePDF(updatedData, fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
      setShowModal(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={openModal}
        disabled={isGenerating}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300 disabled:opacity-70 modal-button"
      >
        <FileText size={20} />
        <span>{isGenerating ? 'جاري التحميل...' : 'تحميل ملف PDF'}</span>
      </button>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-backdrop-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl relative animate-fade-in">
            <button 
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-center mb-8 text-blue-600">معلومات إضافية للتقرير</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="text-right mb-2 font-medium flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  <span>تاريخ إنجاز الفرض</span>
                </label>
                <input 
                  type="date" 
                  value={examDate} 
                  onChange={(e) => setExamDate(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 text-right modal-input focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-right mb-2 font-medium flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  <span>تاريخ تصحيح الفرض</span>
                </label>
                <input 
                  type="date" 
                  value={correctionDate} 
                  onChange={(e) => setCorrectionDate(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 text-right modal-input focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300 disabled:opacity-70 modal-button"
              >
                <FileText size={18} />
                <span>{isGenerating ? 'جاري التحميل...' : 'إنشاء التقرير'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFButton;
