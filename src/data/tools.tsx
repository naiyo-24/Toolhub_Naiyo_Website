import React from 'react';
import { 
  Bot, FileText, ImageIcon, QrCode, Calculator, Briefcase, Search, ArrowRight,
  Wifi, Zap, Settings, Shield, User, Globe, Link, Clock, MapPin, CheckCircle, 
  Smile, Activity, Heart, Calendar, Clipboard, Lock, PenTool, Hash, Download,
  Share2, FolderOpen, PieChart, FileCheck, FileSignature, Image, Code, MessageSquare, Unlock,
  Thermometer, Droplets, Target, Headphones, Scissors
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'daily-utility', name: 'Daily Utility', icon: <Settings className="w-12 h-12"/>, color: 'bg-neo-blue', desc: 'Everyday utilities for quick problem solving.' },
  { id: 'internet', name: 'Internet Tools', icon: <Globe className="w-12 h-12"/>, color: 'bg-neo-pink', desc: 'Networking, IP, and web-based utilities.' },
  { id: 'file', name: 'File Tools', icon: <FolderOpen className="w-12 h-12"/>, color: 'bg-neo-green', desc: 'Manage, compress, and organize your files offline.' },
  { id: 'ai', name: 'AI Tools', icon: <Bot className="w-12 h-12"/>, color: 'bg-neo-purple', desc: 'Smart AI assistants for modern workflows.' },
  { id: 'student', name: 'Student Toolkit', icon: <PenTool className="w-12 h-12"/>, color: 'bg-neo-yellow', desc: 'Calculators and planners for academic success.' },
  { id: 'docuforge', name: 'DocuForge', icon: <FileText className="w-12 h-12"/>, color: 'bg-[#9333EA]', desc: 'Advanced document processing and PDF tools.' },
  { id: 'pdf-tools', name: 'PDF Tools', icon: <FileText className="w-12 h-12"/>, color: 'bg-[#ef4444]', desc: 'Scan, convert, merge, and edit PDFs.' },
  { id: 'finance', name: 'Finance Tools', icon: <PieChart className="w-12 h-12"/>, color: 'bg-neo-blue', desc: 'Calculators and trackers for your personal finances.' },
  { id: 'business', name: 'Business Tools', icon: <Briefcase className="w-12 h-12"/>, color: 'bg-neo-yellow', desc: 'Invoices, receipts, and Google-synced business management.' },
  { id: 'social', name: 'Social Tools', icon: <Smile className="w-12 h-12"/>, color: 'bg-neo-pink', desc: 'Text generators and utilities for social media.' },
  { id: 'health', name: 'Health & Lifestyle', icon: <Heart className="w-12 h-12"/>, color: 'bg-neo-green', desc: 'Trackers and calculators for a healthier lifestyle.' },
  { id: 'productivity', name: 'Productivity', icon: <Target className="w-12 h-12"/>, color: 'bg-neo-purple', desc: 'Timers, lists, and tools to keep you focused.' },
  { id: 'travel', name: 'Travel Tools', icon: <MapPin className="w-12 h-12"/>, color: 'bg-[#9333EA]', desc: 'Utilities and planners for your next journey.' },
  { id: 'form', name: 'Form Builder', icon: <Clipboard className="w-12 h-12"/>, color: 'bg-neo-blue', desc: 'Create custom forms and surveys easily.' },
  { id: 'compression', name: 'Conversion Tools', icon: <Scissors className="w-12 h-12"/>, color: 'bg-neo-pink', desc: 'Convert and compress images and documents instantly.' }
];

export interface Tool {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  comingSoon: boolean;
  mobileOnly?: boolean;
  requiresLogin?: boolean;
  customUrl?: string;
}

const RAW_TOOLS = [
  // DocuForge Flagship Feature
  { id: 'docuforge-workspace', name: 'DocuForge Workspace', category: 'docuforge', icon: <FileText className="w-6 h-6"/>, comingSoon: false, customUrl: '/docuforge' },

  // Daily Utility Tool
  { name: 'QR Generator', category: 'daily-utility', icon: <QrCode className="w-6 h-6"/>, comingSoon: false },
  { name: 'QR Scanner', category: 'daily-utility', icon: <QrCode className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },

  { name: 'Age Calculator', category: 'daily-utility', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'EMI Calculator', category: 'daily-utility', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'GST Calculator', category: 'daily-utility', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'SIP Calculator', category: 'daily-utility', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Loan Calculator', category: 'daily-utility', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'BMI Calculator', category: 'daily-utility', icon: <Activity className="w-6 h-6"/>, comingSoon: false },
  { name: 'Percentage Calculator', category: 'daily-utility', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Discount Calculator', category: 'daily-utility', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Unit Convertor', category: 'daily-utility', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Currency Calculator', category: 'daily-utility', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Scientific Calculator', category: 'daily-utility', icon: <Calculator className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Stopwatch', category: 'daily-utility', icon: <Clock className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Timmer', category: 'daily-utility', icon: <Clock className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'World Clock', category: 'daily-utility', icon: <Globe className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Calender', category: 'daily-utility', icon: <Calendar className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Password Gen', category: 'daily-utility', icon: <Lock className="w-6 h-6"/>, comingSoon: false },
  { name: 'Password Check', category: 'daily-utility', icon: <Shield className="w-6 h-6"/>, comingSoon: false },
  { name: 'Text Counter', category: 'daily-utility', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'Case Convertor', category: 'daily-utility', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'Number Base Convertor', category: 'daily-utility', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },

  // Internet Tool
  { name: 'URL Shortener', category: 'internet', icon: <Link className="w-6 h-6"/>, comingSoon: false },
  { name: 'URL Expander', category: 'internet', icon: <Link className="w-6 h-6"/>, comingSoon: false },
  { name: 'Link Checker', category: 'internet', icon: <CheckCircle className="w-6 h-6"/>, comingSoon: false },
  { name: 'WIFI QR Generator', category: 'internet', icon: <Wifi className="w-6 h-6"/>, comingSoon: false },
  { name: 'UPI QR Generator', category: 'internet', icon: <QrCode className="w-6 h-6"/>, comingSoon: false },
  { name: 'Email Validator', category: 'internet', icon: <CheckCircle className="w-6 h-6"/>, comingSoon: false },
  { name: 'IP Finder', category: 'internet', icon: <Globe className="w-6 h-6"/>, comingSoon: false },
  { name: 'Web Screenshot', category: 'internet', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'Status Checker', category: 'internet', icon: <Activity className="w-6 h-6"/>, comingSoon: false },
  { name: 'DNS Lookup', category: 'internet', icon: <Search className="w-6 h-6"/>, comingSoon: false },
  { name: 'Ping Test', category: 'internet', icon: <Zap className="w-6 h-6"/>, comingSoon: false },
  { name: 'Speed Test', category: 'internet', icon: <Zap className="w-6 h-6"/>, comingSoon: false },
  { name: 'JSON Formator', category: 'internet', icon: <Code className="w-6 h-6"/>, comingSoon: false },
  { name: 'Encoder/Decoder', category: 'internet', icon: <Code className="w-6 h-6"/>, comingSoon: false },

  // File Tools
  { name: 'File Sharing', category: 'file', icon: <Share2 className="w-6 h-6"/>, comingSoon: false },
  { name: 'ZIP Extractor', category: 'file', icon: <FolderOpen className="w-6 h-6"/>, comingSoon: false },
  { name: 'ZIP Creator', category: 'file', icon: <FolderOpen className="w-6 h-6"/>, comingSoon: false },
  { name: 'Rename Files', category: 'file', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'Duplicate Finder', category: 'file', icon: <Search className="w-6 h-6"/>, comingSoon: false },
  { name: 'Storage Analyzer', category: 'file', icon: <PieChart className="w-6 h-6"/>, comingSoon: false },
  { name: 'Compress Image', category: 'file', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'Compress PDF', category: 'file', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'Merge PDF', category: 'file', icon: <FileText className="w-6 h-6"/>, comingSoon: false },

  { name: 'PDF Password', category: 'file', icon: <Lock className="w-6 h-6"/>, comingSoon: false },

  // AI Tools
  { name: 'Meeting Summarizer', category: 'ai', icon: <Bot className="w-6 h-6"/>, comingSoon: true },
  { name: 'Notes Generator', category: 'ai', icon: <Bot className="w-6 h-6"/>, comingSoon: true },
  { name: 'AI Translator', category: 'ai', icon: <Globe className="w-6 h-6"/>, comingSoon: true },
  { name: 'Email Writer', category: 'ai', icon: <MessageSquare className="w-6 h-6"/>, comingSoon: true },
  { name: 'Grammar Checker', category: 'ai', icon: <CheckCircle className="w-6 h-6"/>, comingSoon: true },
  { name: 'Resume Reviewer', category: 'ai', icon: <FileCheck className="w-6 h-6"/>, comingSoon: true },
  { name: 'Interview Prep', category: 'ai', icon: <MessageSquare className="w-6 h-6"/>, comingSoon: true },
  { name: 'Homework Helper', category: 'ai', icon: <Bot className="w-6 h-6"/>, comingSoon: true },
  { name: 'Code Explainer', category: 'ai', icon: <Code className="w-6 h-6"/>, comingSoon: true },
  { name: 'Prompt Generator', category: 'ai', icon: <Bot className="w-6 h-6"/>, comingSoon: true },

  // Student Toolkit
  { name: 'CGPA Calculator', category: 'student', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'SGPA Calculator', category: 'student', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Attendance Calculator', category: 'student', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Study Planner', category: 'student', icon: <Calendar className="w-6 h-6"/>, comingSoon: false },
  { name: 'Notes Maker', category: 'student', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'FlashCards', category: 'student', icon: <Clipboard className="w-6 h-6"/>, comingSoon: false },
  { name: 'AI Note Summarizer', category: 'student', icon: <Bot className="w-6 h-6"/>, comingSoon: true },
  { name: 'Mock Tests', category: 'student', icon: <FileCheck className="w-6 h-6"/>, comingSoon: true },
  { name: 'Quiz Generator', category: 'student', icon: <Bot className="w-6 h-6"/>, comingSoon: true },
  { name: 'Timetable', category: 'student', icon: <Calendar className="w-6 h-6"/>, comingSoon: false },
  { name: 'Assignment Planner', category: 'student', icon: <Clipboard className="w-6 h-6"/>, comingSoon: false },
  { name: 'Exam Countdown', category: 'student', icon: <Clock className="w-6 h-6"/>, comingSoon: false },
  { name: 'Formula Book', category: 'student', icon: <FileText className="w-6 h-6"/>, comingSoon: true },
  { name: 'Student Sci Calc', category: 'student', icon: <Calculator className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Citation Generator', category: 'student', icon: <Bot className="w-6 h-6"/>, comingSoon: true },
  { name: 'Research Summarizer', category: 'student', icon: <Bot className="w-6 h-6"/>, comingSoon: true },

  // DocuForge
  { name: 'Resume Builder', category: 'docuforge', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'ATS Checker', category: 'docuforge', icon: <FileCheck className="w-6 h-6"/>, comingSoon: false },
  { name: 'Cover Letter', category: 'docuforge', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  // PDF Tools Category
  { name: 'Open PDF', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'Merge PDF', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'Split PDF', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'Modify PDF', category: 'pdf-tools', icon: <Settings className="w-6 h-6"/>, comingSoon: false },
  { name: 'PDF Password', category: 'pdf-tools', icon: <Lock className="w-6 h-6"/>, comingSoon: false },
  { name: 'Unlock PDF', category: 'pdf-tools', icon: <Unlock className="w-6 h-6"/>, comingSoon: false },
  { name: 'Document Scan', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false, customUrl: '/docuforge/scan' },
  { name: 'Digital Signature', category: 'pdf-tools', icon: <FileSignature className="w-6 h-6"/>, comingSoon: false },
  { name: 'Image to PDF', category: 'pdf-tools', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'PDF to Image', category: 'pdf-tools', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'Text to PDF', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'PDF to Text', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'OCR Scanner', category: 'pdf-tools', icon: <Search className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Word to PDF', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'PDF to Word', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'Excel to PDF', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'PDF to Excel', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'PPT to PDF', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'PDF to PPT', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'Excel to CSV', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'CSV to Excel', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'CSV to PDF', category: 'pdf-tools', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  
  // Other DocuForge
  { name: 'ID Card Gen', category: 'docuforge', icon: <User className="w-6 h-6"/>, comingSoon: false },

  // Finance Tool
  { name: 'Finance EMI', category: 'finance', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Finance SIP', category: 'finance', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Finance Loan', category: 'finance', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'TAX Calculator', category: 'finance', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Finance GST', category: 'finance', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Finance Currency', category: 'finance', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Savings Planner', category: 'finance', icon: <PieChart className="w-6 h-6"/>, comingSoon: false },
  { name: 'Budget Planner', category: 'finance', icon: <PieChart className="w-6 h-6"/>, comingSoon: false },
  { name: 'Expense Tracker', category: 'finance', icon: <Activity className="w-6 h-6"/>, comingSoon: false },
  { name: 'Investment Calc', category: 'finance', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Compound Interest', category: 'finance', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Salary Calculator', category: 'finance', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },

  // Business Tool
  { name: 'Inventory Manager', category: 'business', icon: <Briefcase className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'POS Billing', category: 'business', icon: <Calculator className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Sales Tracker', category: 'business', icon: <Activity className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Purchase Invoice', category: 'business', icon: <FileText className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Expense Manager', category: 'business', icon: <PieChart className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Profit Calculator', category: 'business', icon: <Calculator className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Invoice Generator', category: 'business', icon: <FileText className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Business Card', category: 'business', icon: <User className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Quotation Gen', category: 'business', icon: <FileText className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Receipt Generator', category: 'business', icon: <FileText className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Business Analytics', category: 'business', icon: <PieChart className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },

  // Social Tools
  { name: 'Emoji Convertor', category: 'social', icon: <Smile className="w-6 h-6"/>, comingSoon: false },
  { name: 'Fancy Text', category: 'social', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'Text to Emoji', category: 'social', icon: <Smile className="w-6 h-6"/>, comingSoon: false },
  { name: 'Character Counter', category: 'social', icon: <Hash className="w-6 h-6"/>, comingSoon: false },
  { name: 'Bio Generator', category: 'social', icon: <Bot className="w-6 h-6"/>, comingSoon: true },
  { name: 'Username Gen', category: 'social', icon: <Bot className="w-6 h-6"/>, comingSoon: true },
  { name: 'Caption Gen', category: 'social', icon: <Bot className="w-6 h-6"/>, comingSoon: true },
  { name: 'Hashtag Gen', category: 'social', icon: <Bot className="w-6 h-6"/>, comingSoon: true },

  // Health & Lifestyle
  { name: 'Health BMI', category: 'health', icon: <Activity className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Water Reminder', category: 'health', icon: <Droplets className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Medicine Alert', category: 'health', icon: <Clock className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Calorie Calculator', category: 'health', icon: <Activity className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Step Counter', category: 'health', icon: <Activity className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Sleep Tracker', category: 'health', icon: <Clock className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Period Tracker', category: 'health', icon: <Calendar className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Habit Tracker', category: 'health', icon: <Target className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },

  // Productivity
  { name: 'To-Do List', category: 'productivity', icon: <CheckCircle className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Notes', category: 'productivity', icon: <FileText className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },

  { name: 'Pomodoro', category: 'productivity', icon: <Clock className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Focus Timer', category: 'productivity', icon: <Clock className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Voice Notes', category: 'productivity', icon: <Headphones className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Clipboard', category: 'productivity', icon: <Clipboard className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Daily Journal', category: 'productivity', icon: <FileText className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Goal Tracker', category: 'productivity', icon: <Target className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Reminder', category: 'productivity', icon: <Clock className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },

  // Travel Tools
  { name: 'Travel Currency', category: 'travel', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Travel World Clock', category: 'travel', icon: <Globe className="w-6 h-6"/>, comingSoon: false, mobileOnly: true },
  { name: 'Translator', category: 'travel', icon: <Bot className="w-6 h-6"/>, comingSoon: true },
  { name: 'Distance Calculator', category: 'travel', icon: <MapPin className="w-6 h-6"/>, comingSoon: false },
  { name: 'Fuel Cost', category: 'travel', icon: <Calculator className="w-6 h-6"/>, comingSoon: false },
  { name: 'Trip Planner', category: 'travel', icon: <Bot className="w-6 h-6"/>, comingSoon: true },
  { name: 'Packing List', category: 'travel', icon: <Bot className="w-6 h-6"/>, comingSoon: true },
  { name: 'Weather', category: 'travel', icon: <Thermometer className="w-6 h-6"/>, comingSoon: false },

  // Form Builder
  { name: 'Custom Form', category: 'form', icon: <Clipboard className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Contact Form', category: 'form', icon: <Clipboard className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Survey Form', category: 'form', icon: <Clipboard className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Feedback Form', category: 'form', icon: <Clipboard className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Registration Form', category: 'form', icon: <Clipboard className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Job App', category: 'form', icon: <Briefcase className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Order Form', category: 'form', icon: <Clipboard className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Quiz Builder', category: 'form', icon: <Clipboard className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },
  { name: 'Poll Form', category: 'form', icon: <Clipboard className="w-6 h-6"/>, comingSoon: false, requiresLogin: true },

  // Compresser / Conversion Tool
  { name: 'JPG → PNG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'PNG → JPG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'JPG → WebP', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'WebP → JPG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'PNG → WebP', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'WebP → PNG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'HEIC → JPG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'HEIC → PNG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'JPG → PDF', category: 'compression', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'PNG → PDF', category: 'compression', icon: <FileText className="w-6 h-6"/>, comingSoon: false },
  { name: 'PDF → JPG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'PDF → PNG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'BMP → JPG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'BMP → PNG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'TIFF → JPG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'TIFF → PNG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'GIF → PNG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'SVG → PNG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'SVG → JPG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false },
  { name: 'AVIF → JPG', category: 'compression', icon: <Image className="w-6 h-6"/>, comingSoon: false }
];

export const ALL_TOOLS: Tool[] = RAW_TOOLS.map(tool => ({
  ...tool,
  id: tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}));

export const getToolColor = (categorySlug: string) => {
  const cat = CATEGORIES.find(c => c.id === categorySlug);
  return cat ? cat.color : 'bg-white';
};

export const getCategoryName = (categorySlug: string) => {
  const cat = CATEGORIES.find(c => c.id === categorySlug);
  return cat ? cat.name : 'Unknown';
};
