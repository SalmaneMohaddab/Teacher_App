import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExcelAnalysis } from '../utils/excelAnalyzer';
import InsightCard from '../components/InsightCard';
import PDFButton from '../components/PDFButton';
import { ChartBarIcon, FileText, Table } from 'lucide-react';

const Analysis = () => {
  const location = useLocation();
  const analysis = location.state?.analysis as ExcelAnalysis;

  const [rowsToShow, setRowsToShow] = React.useState(10);

  if (!analysis) {
    return <Navigate to="/" replace />;
  }

  const getColumnFrequency = (columnName: string) => {
    const frequency: { [key: string]: number } = {};
    analysis.sampleData.forEach(row => {
      const value = String(row[columnName]);
      frequency[value] = (frequency[value] || 0) + 1;
    });
    return Object.entries(frequency).map(([name, value]) => ({ name, value }));
  };

  const firstColumnData = analysis.columnNames[0] ? getColumnFrequency(analysis.columnNames[0]) : [];

  // ✅ Fixed Arabic labels for score ranges
  const scoreBreakdownData = [
    { name: 'من 0 إلى أقل من 5', value: analysis.scoreBreakdown.range0to5 },
    { name: 'من 5 إلى أقل من 10', value: analysis.scoreBreakdown.range5to10 },
    { name: 'من 10 إلى أقل من 15', value: analysis.scoreBreakdown.range10to15 },
    { name: 'من 15 إلى 20', value: analysis.scoreBreakdown.range15to20 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">تحليل البيانات</h1>

      {/* School Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InsightCard title="الجهة" value={analysis.region || 'غير متوفر'} icon={<Table size={24} />} />
        <InsightCard title="المستوى الدراسي" value={analysis.level || 'غير متوفر'} icon={<FileText size={24} />} />
        <InsightCard title="المؤسسة" value={analysis.schoolName || 'غير متوفر'} icon={<ChartBarIcon size={24} />} />
      </div>

      {/* Basic Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InsightCard title="عدد التلاميذ" value={analysis.studentCount} icon={<Table size={24} />} />
        <InsightCard title="المادة" value={analysis.subjectName || 'غير متوفر'} icon={<FileText size={24} />} />
        <InsightCard title="القسم" value={analysis.className || 'غير متوفر'} icon={<ChartBarIcon size={24} />} />
      </div>

      {/* Score Breakdown Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-right">تحليل النقاط حسب النطاق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Final Score Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-right">التحليل بناءً على النقط</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <InsightCard title="عدد التلاميذ الحاصلين على المعدل" value={analysis.finalScoreStats.passCount} icon={<FileText size={24} />} />
            <InsightCard title="عدد التلاميذ الغير حاصلين على المعدل" value={analysis.finalScoreStats.failCount} icon={<FileText size={24} />} />
            <InsightCard title="أعلى نقطة" value={analysis.finalScoreStats.maxScore} icon={<FileText size={24} />} />
            <InsightCard title="أدنى نقطة" value={analysis.finalScoreStats.minScore} icon={<FileText size={24} />} />
            <InsightCard title="معدل القسم" value={analysis.finalScoreStats.averageScore.toFixed(2)} icon={<FileText size={24} />} />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">النسبة المئوية للحاصلين على المعدل:</h2>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: `${analysis.finalScoreStats.passPercentage}%` }}></div>
              </div>
              <p className="text-right mt-1">{analysis.finalScoreStats.passPercentage.toFixed(2)}%</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">النسبة المئوية لغير الحاصلين على المعدل:</h2>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-red-500 h-4 rounded-full" style={{ width: `${analysis.finalScoreStats.failPercentage}%` }}></div>
              </div>
              <p className="text-right mt-1">{analysis.finalScoreStats.failPercentage.toFixed(2)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      {analysis.students.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-right">بيانات التلاميذ</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="flex justify-end mb-4">
              <label className="mr-2 font-medium">عدد التلاميذ المعروضين:</label>
              <select
                className="border border-gray-300 rounded px-2 py-1"
                value={rowsToShow}
                onChange={(e) => setRowsToShow(Number(e.target.value))}
              >
                {[10, 20, 30, 40, 50].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-sm font-medium text-gray-600">رقم التلميذ</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-600">إسم التلميذ</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-600">تاريخ الإزدياد</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-600">النقطة</th>
                </tr>
              </thead>
              <tbody>
                {analysis.students.slice(0, rowsToShow).map((student, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-800">{student.studentNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{student.studentName}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{student.birthDate}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{student.firstExamScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* PDF Export */}
      <div className="text-center">
        <PDFButton analysisData={analysis} fileName={analysis.fileName} />
      </div>
    </div>
  );
};

export default Analysis;
