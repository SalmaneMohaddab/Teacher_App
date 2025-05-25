import React, { useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { analyzeExcelFile } from '../utils/excelAnalyzer';
import { useNavigate } from 'react-router-dom';

interface FileUploadProps {
  onAnalysisComplete: (analysis: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete }) => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setError(null);
    
    if (files.length === 0) return;
    
    const file = files[0];
    
    if (!file.name.endsWith('.xlsx')) {
      setError('يرجى تحميل ملف إكسل (.xlsx) فقط');
      return;
    }
    
    setFileName(file.name);
    setIsLoading(true);
    
    try {
      const analysis = await analyzeExcelFile(file);
      onAnalysisComplete(analysis);
      navigate('/analysis', { state: { analysis } });
    } catch (err) {
      setError('حدث خطأ أثناء تحليل الملف. يرجى المحاولة مرة أخرى.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 max-w-md mx-auto
      ${isDragging ? 'bg-soft-blue border-blue-400' : 'bg-soft-gray border-gray-300'} 
      ${isLoading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isLoading && document.getElementById('file-upload')?.click()}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".xlsx"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      
      <CloudUpload 
        className="mx-auto mb-4 text-blue-500" 
        size={48}
      />
      
      {!fileName ? (
        <>
          <h3 className="text-lg font-medium mb-2">قم بتحميل ملف النقط  لبدء التحليل  </h3>
          <p className="text-text-gray text-sm">
            اسحب وأفلت ملف  أو انقر لاختيار ملف
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-2">
            {isLoading ? 'جاري التحليل...' : 'تم تحميل الملف'}
          </h3>
          <p className="text-text-gray text-sm truncate">{fileName}</p>
        </>
      )}
      
      {error && (
        <div className="mt-3 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <p className="mt-6 text-xs text-text-gray">
      ابدأ برفع ملف نتائج التلاميذ لتحصل على تقرير شامل      </p>
    </div>
  );
};

export default FileUpload;
