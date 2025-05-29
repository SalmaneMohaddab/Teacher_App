import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExcelAnalysis } from './excelAnalyzer';
import { amiriFontBase64 } from './amiriFont';
import { getImage } from './imageHandler';

// --- Font Setup ---

//  // Replace with real Base64 of Amiri-Regular.ttf
const FONT_NAME = 'Amiri';

// --- Color Palette ---
const COLOR_PRIMARY = '#0077b6';
const COLOR_HEADER = '#03045e';
const COLOR_LIGHT = '#f8f9fa';
const COLOR_TEXT = '#212529';

export const generatePDF = async (analysis: ExcelAnalysis, fileName: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const rightX = pageWidth - margin;
      console.log('Generating PDF')

      // --- Font Setup ---
      doc.addFileToVFS('Amiri-Regular.ttf', amiriFontBase64);
      doc.addFont('Amiri-Regular.ttf', FONT_NAME, 'normal');
      doc.setFont(FONT_NAME, 'normal');
      doc.setFontSize(12);
      doc.setTextColor(COLOR_TEXT);

      let currentY = 10; // Start position

      // Try to get the image if online
      const imageUrl = await getImage();
      if (imageUrl) {
        try {
          const img = new Image();
          img.src = imageUrl;
          await new Promise((resolve, reject) => {
            img.onload = () => {
              doc.addImage(img, 'JPEG', pageWidth / 2 - 30, currentY, 60, 30);
              currentY = 50; // Adjust position after image
              resolve(null);
            };
            img.onerror = reject;
          });
        } catch (error) {
          console.error('Error loading image:', error);
          currentY = 30; // Smaller gap if no image
        }
      } else {
        currentY = 30; // Smaller gap if no image
      }

      // --- Header ---
      doc.setFontSize(11);
      doc.text(`الأكاديمية: ${analysis.region || 'غير متوفر'}`, rightX, currentY, { align: 'right' });
      currentY += 6;
      doc.text(`المديرية الإقليمية: ${analysis.directorate || 'غير متوفر'}`, rightX, currentY, { align: 'right' });
      currentY += 6;

      currentY += 10;

      // --- School Info ---
      doc.text(`المؤسسة: ${analysis.schoolName || 'غير متوفر'}`, margin, currentY, { align: 'left' });
      doc.text(`المستوى: ${analysis.level || 'غير متوفر'}`, margin, currentY + 7, { align: 'left' });
      doc.text(`الدورة: ${analysis.semester || 'غير متوفر'}`, rightX, currentY, { align: 'right' });
      doc.text(`المادة: ${analysis.subjectName || 'غير متوفر'}`, rightX, currentY + 7, { align: 'right' });

      currentY += 18;

      // --- Title Box ---
      doc.setFillColor(COLOR_PRIMARY);
      doc.setTextColor('#ffffff');
      doc.rect(margin, currentY, pageWidth - margin * 2, 10, 'F');
      doc.setFontSize(13);
      doc.text('تقرير حول الفرض المحروس', pageWidth / 2, currentY + 7, { align: 'center' });

      currentY += 15;

      // --- Exam Metadata Table ---
      autoTable(doc, {
        startY: currentY,
        head: [['تاريخ إنجاز الفرض', 'تاريخ تصحيح الفرض', 'محتوى الفرض']],
        body: [[
          analysis.examDate || 'غير متوفر',
          analysis.correctionDate || 'غير متوفر',
          analysis.subjectName || 'غير متوفر'
        ]],
        styles: {
          font: FONT_NAME,
          fontStyle: 'normal',
          fontSize: 10,
          halign: 'center',
        },
        headStyles: {
          fillColor: COLOR_PRIMARY,
          textColor: '#ffffff'
        },
        theme: 'grid'
      });

      // --- Result Summary Table ---
      const stats = analysis.finalScoreStats;

      autoTable(doc, {
        head: [[
          'عدد تلاميذ القسم',
          'عدد التلاميذ الحاصلين على المعدل',
          'عدد التلاميذ غير الحاصلين على المعدل',
          'أعلى نقطة',
          'أدنى نقطة',
          'معدل القسم'
        ]],
        body: [[
          analysis.studentCount || 'غير متوفر',
          stats.passCount,
          stats.failCount,
          stats.maxScore,
          stats.minScore,
          stats.averageScore.toFixed(2)
        ]],
        styles: {
          font: FONT_NAME,
          fontStyle: 'normal',
          fontSize: 10,
          halign: 'center',
        },
        headStyles: {
          fillColor: COLOR_PRIMARY,
          textColor: '#ffffff'
        },
        theme: 'grid'
      });

      // --- Top 3 Students Table ---
      const topStudents = (analysis.students || [])
        .sort((a, b) => parseFloat(b.firstExamScore || '0') - parseFloat(a.firstExamScore || '0'))
        .slice(0, 3)
        .map((s, i) => [
          (i + 1).toString(),
          s.studentName || '',
          s.firstExamScore || ''
        ]);

      if (topStudents.length) {
        autoTable(doc, {
          head: [['الترتيب', 'إسم التلميذ', 'النقطة']],
          body: topStudents,
          styles: {
            font: FONT_NAME,
            fontStyle: 'normal',
            fontSize: 10,
            halign: 'center',
          },
          headStyles: {
            fillColor: COLOR_LIGHT,
            textColor: COLOR_TEXT
          },
          theme: 'grid'
        });
      }

      // --- Score Breakdown ---
      const breakdown = analysis.scoreBreakdown;

      autoTable(doc, {
        head: [['0<n<5', '5<n<10', '10<n<15', '15<n<=20']],
        body: [[
          breakdown.range0to5,
          breakdown.range5to10,
          breakdown.range10to15,
          breakdown.range15to20
        ]],
        styles: {
          font: FONT_NAME,
          fontStyle: 'normal',
          fontSize: 10,
          halign: 'center',
        },
        headStyles: {
          fillColor: COLOR_PRIMARY,
          textColor: '#ffffff'
        },
        theme: 'grid'
      });

      // --- Success Rate Row ---
      autoTable(doc, {
        head: [['النسبة المئوية غير الحاصلين على المعدل', 'النسبة المئوية للحاصلين على المعدل']],
        body: [[
          stats.failPercentage.toFixed(2) + '%',
          stats.passPercentage.toFixed(2) + '%'
        ]],
        styles: {
          font: FONT_NAME,
          fontStyle: 'normal',
          fontSize: 10,
          halign: 'center',
        },
        headStyles: {
          fillColor: COLOR_PRIMARY,
          textColor: '#ffffff'
        },
        theme: 'grid'
      });

      // --- Footer ---
      const today = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.setTextColor(COLOR_TEXT);
      doc.text('الموسم الدراسي: 2024/2025', margin, 285, { align: 'left' });
      doc.text(`${today}`, rightX, 285, { align: 'right' });

      console.log(`${today}`);

      doc.save(`${fileName.replace(/\.[^/.]+$/, '')}_styled_report.pdf`);
      console.log(doc);
      resolve();
    } catch (error) {
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
};
