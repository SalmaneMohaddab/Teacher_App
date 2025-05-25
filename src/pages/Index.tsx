import React, { useState } from 'react';
import Header from '../components/Header';
import FileUpload from '../components/FileUpload';
import InsightCard from '../components/InsightCard';
import PDFButton from '../components/PDFButton';
import InstallPWA from '../components/InstallPWA';
import { ExcelAnalysis } from '../utils/excelAnalyzer';
import { FileImage, FileText, Table } from 'lucide-react';

const Index = () => {
  const [analysis, setAnalysis] = useState<ExcelAnalysis | null>(null);

  const handleAnalysisComplete = (data: ExcelAnalysis) => {
    setAnalysis(data);
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-white to-soft-blue/20 py-16">
      <div className="container mx-auto px-4">
        <Header />
        
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 shadow-md mb-10 animate-fade-in">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold">رفع ملف نقط الطلاب للتحليل</h2>
            <InstallPWA />
          </div>
          <FileUpload onAnalysisComplete={handleAnalysisComplete} />
        </div>
        
        {analysis && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-6">نتائج التحليل</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <InsightCard 
                title="عدد الصفوف" 
                value={analysis.rowCount} 
                icon={<Table size={24} />}
              />
              <InsightCard 
                title="عدد الأعمدة" 
                value={analysis.columnCount} 
                icon={<FileText size={24} />}
              />
              <InsightCard 
                title="عدد الأوراق" 
                value={analysis.sheetNames.length} 
                icon={<FileImage size={24} />}
              />
            </div>
            
            {analysis.columnNames.length > 0 && (
              <div className="mb-10 animate-fade-in">
                <h3 className="text-xl font-semibold mb-4 text-center">أسماء الأعمدة</h3>
                <div className="bg-white rounded-xl p-6 card-shadow">
                  <div className="flex flex-wrap gap-2">
                    {analysis.columnNames.map((column, index) => (
                      <span 
                        key={index} 
                        className="bg-soft-gray py-2 px-4 rounded-full text-sm"
                      >
                        {column}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {analysis.sampleData.length > 0 && (
              <div className="mb-10 animate-fade-in overflow-x-auto">
                <h3 className="text-xl font-semibold mb-4 text-center">عينة من البيانات</h3>
                <div className="bg-white rounded-xl p-6 card-shadow">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {analysis.columnNames.map((column, index) => (
                          <th key={index} className="py-3 px-4 text-sm font-medium text-gray-600">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.sampleData.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-100">
                          {analysis.columnNames.map((column, colIndex) => (
                            <td key={colIndex} className="py-3 px-4 text-sm text-gray-800">
                              {row[column] !== undefined ? String(row[column]) : '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="text-center animate-fade-in">
              <PDFButton 
                analysisData={analysis} 
                fileName={analysis.fileName} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
