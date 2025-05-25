import * as XLSX from 'xlsx';

export interface StudentRecord {
  studentNumber: string;
  studentName: string;
  birthDate: string;
  firstExamScore: string;
}

export interface FinalScoreStats {
  studentCount: number;
  passCount: number;
  failCount: number;
  averageScore: number;
  maxScore: number;
  minScore: number;
  passPercentage: number;
  failPercentage: number;
}

export interface ScoreBreakdown {
  range0to5: number;
  range5to10: number;
  range10to15: number;
  range15to20: number;
}

export interface ExcelAnalysis {
  fileName: string;
  sheetNames: string[];
  studentCount: number;
  subjectName: string;
  className: string;
  sampleData: any[];
  columnNames: string[];
  students: StudentRecord[];
  stats: {
    averageScores: { [key: string]: number };
    maxScores: { [key: string]: number };
    minScores: { [key: string]: number };
  };
  finalScoreStats: FinalScoreStats;
  scoreBreakdown: ScoreBreakdown;
  region?: string;
  level?: string;
  schoolName?: string;
  examDate?: string;
  correctionDate?: string;
  directorate?: string; // مديرية إقليمية
  semester?: string;    // الدورة
}

// Function to generate a unique key for the file
const generateFileKey = (file: File): string => {
  return `excel-${file.name}-${file.lastModified}`;
};

// Function to check if analysis is cached
const getAnalysisFromCache = async (file: File): Promise<ExcelAnalysis | null> => {
  if (!('caches' in window)) {
    return null;
  }
  
  try {
    const cache = await caches.open('processed-excel-data');
    const key = generateFileKey(file);
    const response = await cache.match(`/data/${key}`);
    
    if (response) {
      const data = await response.json();
      return data as ExcelAnalysis;
    }
  } catch (error) {
    console.error('Error retrieving from cache:', error);
  }
  
  return null;
};

export const analyzeExcelFile = async (file: File): Promise<ExcelAnalysis> => {
  // First try to get from cache
  const cachedAnalysis = await getAnalysisFromCache(file);
  if (cachedAnalysis) {
    console.log('Retrieved analysis from cache');
    return cachedAnalysis;
  }
  
  // If not in cache, analyze the file
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const region = worksheet['D7']?.v ?? '';
        const level = worksheet['D9']?.v ?? '';
        const schoolName = worksheet['O7']?.v ?? '';
        const subjectName = worksheet['O11']?.v ?? '';
        const className = worksheet['I9']?.v ?? '';
        const examDate = worksheet['O13']?.v?.toString() ?? 'غير متوفر';
        const correctionDate = worksheet['O14']?.v?.toString() ?? 'غير متوفر';
        const directorate = worksheet['I7']?.v?.toString() ?? 'غير متوفر';
        const semester = worksheet['D11']?.v?.toString() ?? 'غير متوفر';

        let studentCount = 0;
        let currentRow = 18;
        const students: StudentRecord[] = [];
        const scores: number[] = [];

        while (true) {
          const studentNumber = worksheet[`C${currentRow}`]?.v ?? '';
          if (!studentNumber) break;

          const firstScoreStr = worksheet[`G${currentRow}`]?.v?.toString() ?? '0';
          const firstScore = parseFloat(firstScoreStr);
          
          if (!isNaN(firstScore)) {
            scores.push(firstScore);
          }

          students.push({
            studentNumber: studentNumber.toString(),
            studentName: worksheet[`D${currentRow}`]?.v?.toString() ?? '',
            birthDate: worksheet[`F${currentRow}`]?.v?.toString() ?? '',
            firstExamScore: firstScoreStr
          });

          studentCount++;
          currentRow++;
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 4 });
        const columnNames = Object.keys(jsonData[0] || {});

        const scoreColumns = columnNames.filter(col =>
          col.includes('النقطة') || col.includes('الفرض')
        );

        const stats = {
          averageScores: {} as { [key: string]: number },
          maxScores: {} as { [key: string]: number },
          minScores: {} as { [key: string]: number }
        };

        scoreColumns.forEach(column => {
          const scores = jsonData
            .map(row => parseFloat(row[column]))
            .filter(score => !isNaN(score));

          stats.averageScores[column] = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
          stats.maxScores[column] = scores.length ? Math.max(...scores) : 0;
          stats.minScores[column] = scores.length ? Math.min(...scores) : 0;
        });

        const passCount = scores.filter(score => score >= 10).length;
        const failCount = studentCount - passCount;

        const finalScoreStats: FinalScoreStats = {
          studentCount,
          passCount,
          failCount,
          averageScore: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
          maxScore: scores.length ? Math.max(...scores) : 0,
          minScore: scores.length ? Math.min(...scores) : 0,
          passPercentage: studentCount ? (passCount / studentCount) * 100 : 0,
          failPercentage: studentCount ? (failCount / studentCount) * 100 : 0
        };

        const breakdown: ScoreBreakdown = {
          range0to5: 0,
          range5to10: 0,
          range10to15: 0,
          range15to20: 0
        };
        
        scores.forEach(score => {
          if (score > 0 && score < 5) breakdown.range0to5++;
          else if (score >= 5 && score < 10) breakdown.range5to10++;
          else if (score >= 10 && score < 15) breakdown.range10to15++;
          else if (score >= 15 && score <= 20) breakdown.range15to20++;
        });

        const analysis: ExcelAnalysis = {
          fileName: file.name,
          sheetNames: workbook.SheetNames,
          studentCount,
          subjectName,
          className,
          sampleData: jsonData.slice(0, 5),
          columnNames,
          students,
          stats,
          finalScoreStats,
          scoreBreakdown: breakdown,
          region,
          level,
          schoolName,
          examDate,
          correctionDate,
          directorate,
          semester,
        };

        // Cache the analysis for offline use
        const fileKey = generateFileKey(file);
        if (window.cacheProcessedData) {
          window.cacheProcessedData(fileKey, analysis);
        }

        resolve(analysis);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};
