import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { InvoiceGenerator } from './InvoiceGenerator';
import { QuotationGenerator } from './QuotationGenerator';
import { ReceiptGenerator } from './ReceiptGenerator';
import { BusinessCardGenerator } from './BusinessCardGenerator';
import { InventoryManager } from './InventoryManager';
import { SalesTracker } from './SalesTracker';
import { ExpenseManager } from './ExpenseManager';
import { ProfitCalculator } from './ProfitCalculator';
import { BusinessAnalytics } from './BusinessAnalytics';
import { 
  Briefcase, Activity, PieChart, Calculator, FileText, User, 
  Plus, Save, Download, Loader2, AlertCircle, ArrowRight
} from 'lucide-react';

export function BusinessToolkit({ toolId }: { toolId?: string }) {
  const { token, user } = useAuth();
  
  // Shared state for tools
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common Company Info state
  const [companyInfo, setCompanyInfo] = useState({
    company_name: user?.full_name ? `${user.full_name}'s Business` : '',
    company_address: '',
    company_phone: '',
    company_gstin: '',
    company_logo_url: ''
  });

  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  };

  const renderTool = () => {
    switch(toolId) {
      case 'invoice-generator':
        return <InvoiceGenerator isGst={false} />;
      case 'gst-billing':
        return <InvoiceGenerator isGst={true} />;
      case 'quotation-gen':
        return <QuotationGenerator />;
      case 'receipt-generator':
        return <ReceiptGenerator />;
      case 'business-card':
        return <BusinessCardGenerator />;
      case 'inventory-manager':
        return <InventoryManager />;
      case 'sales-tracker':
        return <SalesTracker />;
      case 'expense-manager':
        return <ExpenseManager />;
      case 'profit-calculator':
        return <ProfitCalculator />;
      case 'business-analytics':
        return <BusinessAnalytics />;
      default:
        return <div>Please select a valid business tool.</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title block */}
      <div className="bg-neo-yellow border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000] flex items-center gap-4">
        <Briefcase className="w-12 h-12" />
        <div>
          <h2 className="text-3xl font-black uppercase">Business Toolkit</h2>
          <p className="font-bold text-lg">Streamline your operations</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-[#ff4d4d] text-white border-4 border-black p-4 font-bold rounded-xl flex items-center gap-2 shadow-[4px_4px_0px_0px_#000]">
          <AlertCircle className="w-6 h-6 shrink-0" />
          {error}
        </div>
      )}

      {renderTool()}
    </div>
  );
}

export const businessToolkitInstructions = [
  "Fill out your company details.",
  "Enter the required transaction or inventory information.",
  "Generate professional PDFs instantly."
];
