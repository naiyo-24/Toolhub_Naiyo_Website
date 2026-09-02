import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Construction, CheckCircle2 } from 'lucide-react';
import { ALL_TOOLS, getToolColor, getCategoryName } from '../data/tools';

// Import Tool Components
import { QRGenerator, qrGeneratorInstructions } from '../components/tools/QRGenerator';
import { AgeCalculator, ageCalculatorInstructions } from '../components/tools/AgeCalculator';
import { EMICalculator, emiCalculatorInstructions } from '../components/tools/EMICalculator';
import { LoanCalculator, loanCalculatorInstructions } from '../components/tools/LoanCalculator';
import { GSTCalculator, gstCalculatorInstructions } from '../components/tools/GSTCalculator';
import { SIPCalculator, sipCalculatorInstructions } from '../components/tools/SIPCalculator';
import { DiscountCalculator, discountCalculatorInstructions } from '../components/tools/DiscountCalculator';
import { BMICalculator, bmiCalculatorInstructions } from '../components/tools/BMICalculator';
import { PercentageCalculator, percentageCalculatorInstructions } from '../components/tools/PercentageCalculator';
import { UnitConverter, unitConverterInstructions } from '../components/tools/UnitConverter';
import { CurrencyCalculator, currencyCalculatorInstructions } from '../components/tools/CurrencyCalculator';
import { NumberBaseConverter, numberBaseConverterInstructions } from '../components/tools/NumberBaseConverter';

import { ResumeBuilder, resumeBuilderInstructions } from '../components/tools/ResumeBuilder';
import { ATSChecker, atsCheckerInstructions } from '../components/tools/ATSChecker';
import { DocPDFMerge, docPDFMergeInstructions } from '../components/tools/DocPDFMerge';
import { SplitPDF, splitPDFInstructions } from '../components/tools/SplitPDF';
import { DocPDFCompress, docPDFCompressInstructions } from '../components/tools/DocPDFCompress';
import { ImageToPDF, imageToPDFInstructions } from '../components/tools/ImageToPDF';
import { PDFToImage, pdfToImageInstructions } from '../components/tools/PDFToImage';
import { WordToPDF, wordToPDFInstructions } from '../components/tools/WordToPDF';
import { PDFToWord, pdfToWordInstructions } from '../components/tools/PDFToWord';
import { ExcelToPDF, excelToPDFInstructions } from '../components/tools/ExcelToPDF';
import { PPTToPDF, pptToPDFInstructions } from '../components/tools/PPTToPDF';
import { PDFToExcel, pdfToExcelInstructions } from '../components/tools/PDFToExcel';
import { PDFToPPT, pdfToPPTInstructions } from '../components/tools/PDFToPPT';
import { ExcelToCSV, excelToCSVInstructions } from '../components/tools/ExcelToCSV';
import { CSVToExcel, csvToExcelInstructions } from '../components/tools/CSVToExcel';
import { CSVToPDF, csvToPDFInstructions } from '../components/tools/CSVToPDF';
import { WatermarkPDF, watermarkPDFInstructions } from '../components/tools/WatermarkPDF';
import { DigitalSignature, digitalSignatureInstructions } from '../components/tools/DigitalSignature';
import { CoverLetter, coverLetterInstructions } from '../components/tools/CoverLetter';
import { IDCardGen, idCardGenInstructions } from '../components/tools/IDCardGen';
import { DocumentScan, documentScanInstructions } from '../components/tools/DocumentScan';

import { TextCounter, textCounterInstructions } from '../components/tools/TextCounter';
import { CaseConverter, caseConverterInstructions } from '../components/tools/CaseConverter';
import { PasswordGenerator, passwordGeneratorInstructions } from '../components/tools/PasswordGenerator';
import { PasswordCheck, passwordCheckInstructions } from '../components/tools/PasswordCheck';
import { URLShortener, urlShortenerInstructions } from '../components/tools/URLShortener';
import { URLExpander, urlExpanderInstructions } from '../components/tools/URLExpander';
import { LinkChecker, linkCheckerInstructions } from '../components/tools/LinkChecker';
import { EmailValidator, emailValidatorInstructions } from '../components/tools/EmailValidator';
import { IPFinder, ipFinderInstructions } from '../components/tools/IPFinder';
import { StatusChecker, statusCheckerInstructions } from '../components/tools/StatusChecker';
import { DNSLookup, dnsLookupInstructions } from '../components/tools/DNSLookup';
import { PingTest, pingTestInstructions } from '../components/tools/PingTest';
import { SpeedTest, speedTestInstructions } from '../components/tools/SpeedTest';
import { WebScreenshot, webScreenshotInstructions } from '../components/tools/WebScreenshot';
import { WiFiQRGenerator, wifiQrGeneratorInstructions } from '../components/tools/WiFiQRGenerator';
import { UPIQRGenerator, upiQrGeneratorInstructions } from '../components/tools/UPIQRGenerator';
import { JSONFormatter, jsonFormatterInstructions } from '../components/tools/JSONFormatter';
import { EncoderDecoder, encoderDecoderInstructions } from '../components/tools/EncoderDecoder';
import { FileSharing, fileSharingInstructions } from '../components/tools/FileSharing';
import { ZIPExtractor, zipExtractorInstructions } from '../components/tools/ZIPExtractor';
import { ZIPCreator, zipCreatorInstructions } from '../components/tools/ZIPCreator';
import { RenameFiles, renameFilesInstructions } from '../components/tools/RenameFiles';
import { DuplicateFinder, duplicateFinderInstructions } from '../components/tools/DuplicateFinder';
import { StorageAnalyzer, storageAnalyzerInstructions } from '../components/tools/StorageAnalyzer';
import { CompressImage, compressImageInstructions } from '../components/tools/CompressImage';
import { CompressPDF, compressPdfInstructions } from '../components/tools/CompressPDF';
import { MergePDF, mergePdfInstructions } from '../components/tools/MergePDF';
import { PDFPassword, pdfPasswordInstructions } from '../components/tools/PDFPassword';
import { OCRText, ocrTextInstructions } from '../components/tools/OCRText';
import { OpenPDF, openPdfInstructions } from '../components/tools/OpenPDF';
import { ModifyPDF, modifyPdfInstructions } from '../components/tools/ModifyPDF';
import { UnlockPDF, unlockPdfInstructions } from '../components/tools/UnlockPDF';
import { PDFToText, pdfToTextInstructions } from '../components/tools/PDFToText';
import { TextToPDF, textToPdfInstructions } from '../components/tools/TextToPDF';

// Student Toolkit - Batch 1
import { CGPACalculator, cgpaCalculatorInstructions } from '../components/tools/CGPACalculator';
import { SGPACalculator, sgpaCalculatorInstructions } from '../components/tools/SGPACalculator';
import { AttendanceCalculator, attendanceCalculatorInstructions } from '../components/tools/AttendanceCalculator';
import { StudentSciCalc, studentSciCalcInstructions } from '../components/tools/StudentSciCalc';

// Student Toolkit - Batch 2
import { ExamCountdown, examCountdownInstructions } from '../components/tools/ExamCountdown';
import { Timetable, timetableInstructions } from '../components/tools/Timetable';
import { AssignmentPlanner, assignmentPlannerInstructions } from '../components/tools/AssignmentPlanner';
import { StudyPlanner, studyPlannerInstructions } from '../components/tools/StudyPlanner';

// Student Toolkit - Batch 3 (Learning Tools)
import { NotesMaker, notesMakerInstructions } from '../components/tools/NotesMaker';
import { FlashCards, flashCardsInstructions } from '../components/tools/FlashCards';

// Daily Utility Tools
import { ScientificCalculator, scientificCalculatorInstructions } from '../components/tools/ScientificCalculator';

// Finance Tools
import { FinanceEMI } from '../components/tools/FinanceEMI';
import { FinanceSIP } from '../components/tools/FinanceSIP';
import { FinanceLoan } from '../components/tools/FinanceLoan';
import { TaxCalculator } from '../components/tools/TaxCalculator';
import { FinanceGST } from '../components/tools/FinanceGST';
import { FinanceCurrency } from '../components/tools/FinanceCurrency';
import { SavingsPlanner } from '../components/tools/SavingsPlanner';
import { BudgetPlanner } from '../components/tools/BudgetPlanner';
import { ExpenseTracker } from '../components/tools/ExpenseTracker';
import { InvestmentCalc } from '../components/tools/InvestmentCalc';
import { CompoundInterest } from '../components/tools/CompoundInterest';
import { SalaryCalculator } from '../components/tools/SalaryCalculator';

import { useAuth } from '../lib/AuthContext';
import { Login } from '../components/auth/Login';

// Social Tools
import { EmojiConverter } from '../components/tools/EmojiConverter';
import { FancyText } from '../components/tools/FancyText';
import { TextToEmoji } from '../components/tools/TextToEmoji';

// Travel Tools
import { TravelCurrency } from '../components/tools/TravelCurrency';
import { DistanceCalculator } from '../components/tools/DistanceCalculator';
import { FuelCost } from '../components/tools/FuelCost';
import { Weather } from '../components/tools/Weather';

// File Tools / Conversion
import { FileConverter } from '../components/tools/FileConverter';

// Form Builder Tools
import { FormBuilder } from '../components/tools/FormBuilder';

// Business Tools
import { BusinessToolkit, businessToolkitInstructions } from '../components/tools/BusinessToolkit';

const TOOL_REGISTRY: Record<string, { component: React.ComponentType<any>, instructions?: string[] }> = {
  'qr-generator': { component: QRGenerator, instructions: qrGeneratorInstructions },
  'age-calculator': { component: AgeCalculator, instructions: ageCalculatorInstructions },
  'scientific-calculator': { component: ScientificCalculator, instructions: scientificCalculatorInstructions },
  'emi-calculator': { component: EMICalculator, instructions: emiCalculatorInstructions },
  'loan-calculator': { component: LoanCalculator, instructions: loanCalculatorInstructions },
  'gst-calculator': { component: GSTCalculator, instructions: gstCalculatorInstructions },
  'sip-calculator': { component: SIPCalculator, instructions: sipCalculatorInstructions },
  'discount-calculator': { component: DiscountCalculator, instructions: discountCalculatorInstructions },
  'bmi-calculator': { component: BMICalculator, instructions: bmiCalculatorInstructions },
  'percentage-calculator': { component: PercentageCalculator, instructions: percentageCalculatorInstructions },
  'unit-convertor': { component: UnitConverter, instructions: unitConverterInstructions },
  'currency-calculator': { component: CurrencyCalculator, instructions: currencyCalculatorInstructions },
  'number-base-convertor': { component: NumberBaseConverter, instructions: numberBaseConverterInstructions },

  'finance-emi': { component: FinanceEMI },
  'finance-sip': { component: FinanceSIP },
  'finance-loan': { component: FinanceLoan },
  'tax-calculator': { component: TaxCalculator },
  'finance-gst': { component: FinanceGST },
  'finance-currency': { component: FinanceCurrency },
  'savings-planner': { component: SavingsPlanner },
  'budget-planner': { component: BudgetPlanner },
  'expense-tracker': { component: ExpenseTracker },
  'investment-calc': { component: InvestmentCalc },
  'compound-interest': { component: CompoundInterest },
  'salary-calculator': { component: SalaryCalculator },

  'emoji-convertor': { component: EmojiConverter },
  'fancy-text': { component: FancyText },
  'text-to-emoji': { component: TextToEmoji },
  'character-counter': { component: TextCounter, instructions: textCounterInstructions },

  'travel-currency': { component: TravelCurrency },
  'distance-calculator': { component: DistanceCalculator },
  'fuel-cost': { component: FuelCost },
  'weather': { component: Weather },

  // Conversion Tools
  'jpg-png': { component: FileConverter },
  'png-jpg': { component: FileConverter },
  'jpg-webp': { component: FileConverter },
  'webp-jpg': { component: FileConverter },
  'png-webp': { component: FileConverter },
  'webp-png': { component: FileConverter },
  'heic-jpg': { component: FileConverter },
  'heic-png': { component: FileConverter },
  'jpg-pdf': { component: FileConverter },
  'png-pdf': { component: FileConverter },
  'pdf-jpg': { component: FileConverter },
  'pdf-png': { component: FileConverter },
  'bmp-jpg': { component: FileConverter },
  'bmp-png': { component: FileConverter },
  'tiff-jpg': { component: FileConverter },
  'tiff-png': { component: FileConverter },
  'gif-png': { component: FileConverter },
  'svg-png': { component: FileConverter },
  'svg-jpg': { component: FileConverter },
  'avif-jpg': { component: FileConverter },

  // Form Builder
  'custom-form': { component: FormBuilder },
  'contact-form': { component: FormBuilder },
  'survey-form': { component: FormBuilder },
  'feedback-form': { component: FormBuilder },
  'registration-form': { component: FormBuilder },
  'job-app': { component: FormBuilder },
  'order-form': { component: FormBuilder },
  'quiz-builder': { component: FormBuilder },
  'poll-form': { component: FormBuilder },

  // Business Tools
  'inventory-manager': { component: BusinessToolkit, instructions: businessToolkitInstructions },
  'sales-tracker': { component: BusinessToolkit, instructions: businessToolkitInstructions },
  'expense-manager': { component: BusinessToolkit, instructions: businessToolkitInstructions },
  'profit-calculator': { component: BusinessToolkit, instructions: businessToolkitInstructions },
  'invoice-generator': { component: BusinessToolkit, instructions: businessToolkitInstructions },
  'gst-billing': { component: BusinessToolkit, instructions: businessToolkitInstructions },
  'business-card': { component: BusinessToolkit, instructions: businessToolkitInstructions },
  'quotation-gen': { component: BusinessToolkit, instructions: businessToolkitInstructions },
  'receipt-generator': { component: BusinessToolkit, instructions: businessToolkitInstructions },
  'business-analytics': { component: BusinessToolkit, instructions: businessToolkitInstructions },

  'resume-builder': { component: ResumeBuilder, instructions: resumeBuilderInstructions },
  'ats-checker': { component: ATSChecker, instructions: atsCheckerInstructions },
  'doc-pdf-merge': { component: DocPDFMerge, instructions: docPDFMergeInstructions },
  'split-pdf': { component: SplitPDF, instructions: splitPDFInstructions },
  'doc-pdf-compress': { component: DocPDFCompress, instructions: docPDFCompressInstructions },
  'image-to-pdf': { component: ImageToPDF, instructions: imageToPDFInstructions },
  'pdf-to-image': { component: PDFToImage, instructions: pdfToImageInstructions },
  'word-to-pdf': { component: WordToPDF, instructions: wordToPDFInstructions },
  'pdf-to-word': { component: PDFToWord, instructions: pdfToWordInstructions },
  'excel-to-pdf': { component: ExcelToPDF, instructions: excelToPDFInstructions },
  'ppt-to-pdf': { component: PPTToPDF, instructions: pptToPDFInstructions },
  'pdf-to-excel': { component: PDFToExcel, instructions: pdfToExcelInstructions },
  'pdf-to-ppt': { component: PDFToPPT, instructions: pdfToPPTInstructions },
  'excel-to-csv': { component: ExcelToCSV, instructions: excelToCSVInstructions },
  'csv-to-excel': { component: CSVToExcel, instructions: csvToExcelInstructions },
  'csv-to-pdf': { component: CSVToPDF, instructions: csvToPDFInstructions },
  'watermark-pdf': { component: WatermarkPDF, instructions: watermarkPDFInstructions },
  'digital-signature': { component: DigitalSignature, instructions: digitalSignatureInstructions },
  'cover-letter': { component: CoverLetter, instructions: coverLetterInstructions },
  'id-card-gen': { component: IDCardGen, instructions: idCardGenInstructions },
  'document-scan': { component: DocumentScan, instructions: documentScanInstructions },

  'text-counter': { component: TextCounter, instructions: textCounterInstructions },
  'case-convertor': { component: CaseConverter, instructions: caseConverterInstructions },
  'password-gen': { component: PasswordGenerator, instructions: passwordGeneratorInstructions },
  'password-check': { component: PasswordCheck, instructions: passwordCheckInstructions },
  'url-shortener': { component: URLShortener, instructions: urlShortenerInstructions },
  'url-expander': { component: URLExpander, instructions: urlExpanderInstructions },
  'link-checker': { component: LinkChecker, instructions: linkCheckerInstructions },
  'wifi-qr-generator': { component: WiFiQRGenerator, instructions: wifiQrGeneratorInstructions },
  'upi-qr-generator': { component: UPIQRGenerator, instructions: upiQrGeneratorInstructions },
  'email-validator': { component: EmailValidator, instructions: emailValidatorInstructions },
  'ip-finder': { component: IPFinder, instructions: ipFinderInstructions },
  'web-screenshot': { component: WebScreenshot, instructions: webScreenshotInstructions },
  'status-checker': { component: StatusChecker, instructions: statusCheckerInstructions },
  'dns-lookup': { component: DNSLookup, instructions: dnsLookupInstructions },
  'ping-test': { component: PingTest, instructions: pingTestInstructions },
  'speed-test': { component: SpeedTest, instructions: speedTestInstructions },
  'json-formator': { component: JSONFormatter, instructions: jsonFormatterInstructions },
  'encoder-decoder': { component: EncoderDecoder, instructions: encoderDecoderInstructions },
  
  // File Tools
  'file-sharing': { component: FileSharing, instructions: fileSharingInstructions },
  'zip-extractor': { component: ZIPExtractor, instructions: zipExtractorInstructions },
  'zip-creator': { component: ZIPCreator, instructions: zipCreatorInstructions },
  'rename-files': { component: RenameFiles, instructions: renameFilesInstructions },
  'duplicate-finder': { component: DuplicateFinder, instructions: duplicateFinderInstructions },
  'storage-analyzer': { component: StorageAnalyzer, instructions: storageAnalyzerInstructions },
  'compress-image': { component: CompressImage, instructions: compressImageInstructions },
  'compress-pdf': { component: CompressPDF, instructions: compressPdfInstructions },
  'merge-pdf': { component: MergePDF, instructions: mergePdfInstructions },
  'ocr-scanner': { component: OCRText, instructions: ocrTextInstructions },
  'pdf-password': { component: PDFPassword, instructions: pdfPasswordInstructions },
  'open-pdf': { component: OpenPDF, instructions: openPdfInstructions },
  'modify-pdf': { component: ModifyPDF, instructions: modifyPdfInstructions },
  'unlock-pdf': { component: UnlockPDF, instructions: unlockPdfInstructions },
  'pdf-to-text': { component: PDFToText, instructions: pdfToTextInstructions },
  'text-to-pdf': { component: TextToPDF, instructions: textToPdfInstructions },

  // Student Toolkit
  'cgpa-calculator': { component: CGPACalculator, instructions: cgpaCalculatorInstructions },
  'sgpa-calculator': { component: SGPACalculator, instructions: sgpaCalculatorInstructions },
  'attendance-calculator': { component: AttendanceCalculator, instructions: attendanceCalculatorInstructions },
  'student-sci-calc': { component: StudentSciCalc, instructions: studentSciCalcInstructions },
  'exam-countdown': { component: ExamCountdown, instructions: examCountdownInstructions },
  'timetable': { component: Timetable, instructions: timetableInstructions },
  'assignment-planner': { component: AssignmentPlanner, instructions: assignmentPlannerInstructions },
  'study-planner': { component: StudyPlanner, instructions: studyPlannerInstructions },
  'notes-maker': { component: NotesMaker, instructions: notesMakerInstructions },
  'flashcards': { component: FlashCards, instructions: flashCardsInstructions },
};

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = ALL_TOOLS.find((t) => t.id === toolId);

  if (!tool) {
    return (
      <div className="min-h-screen bg-neo-bg flex flex-col items-center justify-center p-4">
        <div className="bg-white border-4 border-black p-12 text-center shadow-[12px_12px_0px_0px_#000]">
          <h1 className="text-6xl font-black uppercase mb-4 text-red-500">404</h1>
          <h2 className="text-3xl font-black uppercase mb-6">Tool Not Found</h2>
          <Link to="/tools" className="inline-block bg-neo-yellow border-4 border-black px-8 py-4 font-black uppercase text-xl shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const categoryColor = getToolColor(tool.category);
  const ToolComponentData = TOOL_REGISTRY[tool.id];

  const { user, isLoading: isAuthLoading } = useAuth();

  if (tool.requiresLogin && !isAuthLoading && !user) {
    return (
      <div className="min-h-screen bg-neo-bg font-sans pt-24 pb-20" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to={`/tools/${tool.category}`} className="inline-flex items-center gap-2 font-black uppercase mb-8 hover:underline decoration-4 underline-offset-4">
            <ArrowLeft className="w-6 h-6" /> Back to {getCategoryName(tool.category)}
          </Link>
          <Login message={`You must be logged in to access the ${tool.name} tool.`} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-bg font-sans selection:bg-neo-yellow pt-24 pb-20" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* BACK BUTTON */}
        <Link to={`/tools/${tool.category}`} className="inline-flex items-center gap-2 font-black uppercase mb-8 hover:underline decoration-4 underline-offset-4">
          <ArrowLeft className="w-6 h-6" /> Back to {getCategoryName(tool.category)}
        </Link>

        {/* HERO HEADER */}
        <div className={`${categoryColor} border-4 border-black p-8 md:p-12 mb-12 shadow-[12px_12px_0px_0px_#000] flex flex-col md:flex-row items-center gap-8 rounded-2xl relative overflow-hidden`}>
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] rounded-2xl shrink-0 z-10">
            {tool.icon}
          </div>
          <div className="text-center md:text-left text-black z-10">
            <span className="inline-block bg-black text-white px-3 py-1 font-black uppercase text-sm mb-4 rounded-xl shadow-[2px_2px_0px_0px_#fff]">
              {getCategoryName(tool.category)}
            </span>
            <h1 className="text-5xl md:text-6xl font-black uppercase leading-tight mb-2 tracking-tight">{tool.name}</h1>
          </div>
          {/* Decorative background element */}
          <div className="absolute -right-20 -bottom-20 opacity-20 transform rotate-12 scale-150 pointer-events-none">
            {tool.icon}
          </div>
        </div>

        {/* TOOL INTERACTIVE AREA */}
        <div className="mb-16">
          {ToolComponentData ? (
            <ToolComponentData.component toolId={tool.id} />
          ) : (
            <div className="bg-white border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_#000] rounded-2xl flex flex-col items-center">
              <h2 className="text-3xl font-black uppercase mb-4">Available on Mobile</h2>
              <p className="font-bold text-xl text-gray-600 max-w-lg mb-8">
                The {tool.name} feature is fully available in our mobile app. Download it now to get started!
              </p>
              <a href="#" className="inline-block hover:scale-105 hover:-translate-y-1 transition-transform">
                <img src="/assets/images/play.png" alt="Get the App" className="h-24 object-contain" />
              </a>
            </div>
          )}
        </div>

        {/* HOW TO USE SECTION */}
        {ToolComponentData && ToolComponentData.instructions && (
          <div className="bg-white border-4 border-black p-8 md:p-12 rounded-2xl shadow-[8px_8px_0px_0px_#000]">
            <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-3">
              <ArrowRight className="w-8 h-8" />
              How to use {tool.name}
            </h2>
            <div className="space-y-4">
              {ToolComponentData.instructions.map((instruction, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="bg-neo-yellow border-2 border-black w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0 mt-1 shadow-[2px_2px_0px_0px_#000]">
                    {idx + 1}
                  </div>
                  <p className="font-bold text-lg leading-relaxed pt-1">{instruction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
