import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { ALL_TOOLS } from '../../data/tools';
import { useAuth } from '../../lib/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { BusinessOnboardingModal } from '../tools/BusinessOnboardingModal';

import { InventoryManager } from '../tools/InventoryManager';
import { SalesTracker } from '../tools/SalesTracker';
import { ExpenseManager } from '../tools/ExpenseManager';
import { ProfitCalculator } from '../tools/ProfitCalculator';
import { BusinessAnalytics } from '../tools/BusinessAnalytics';
import { InvoiceGenerator } from '../tools/InvoiceGenerator';
import { QuotationGenerator } from '../tools/QuotationGenerator';
import { ReceiptGenerator } from '../tools/ReceiptGenerator';
import { BusinessCardGenerator } from '../tools/BusinessCardGenerator';
import { POSBilling } from '../tools/POSBilling';
import { PurchaseInvoice } from '../tools/PurchaseInvoice';

export default function BusinessToolLayout() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = ALL_TOOLS.find(t => t.id === toolId && t.category === 'business');
  
  const { token, user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (!token) return;
    
    // Check if the user has completed their profile
    fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      // If company_name is null/empty, they haven't finished onboarding
      if (!data.company_name) {
        setShowOnboarding(true);
      }
      setProfileLoaded(true);
    })
    .catch(err => {
      console.error("Failed to load profile", err);
      setProfileLoaded(true); // Don't block forever
    });
  }, [token]);

  if (!tool) {
    return <Navigate to="/business-tools" replace />;
  }

  const renderTool = () => {
    switch (toolId) {
      case 'inventory-manager': return <InventoryManager />;
      case 'pos-billing': return <POSBilling />;
      case 'sales-tracker': return <SalesTracker />;
      case 'purchase-invoice': return <PurchaseInvoice />;
      case 'expense-manager': return <ExpenseManager />;
      case 'profit-calculator': return <ProfitCalculator />;
      case 'business-analytics': return <BusinessAnalytics />;
      case 'invoice-generator': return <InvoiceGenerator defaultIsGst={false} />;
      case 'gst-billing': return <InvoiceGenerator defaultIsGst={true} />;
      case 'quotation-gen': return <QuotationGenerator />;
      case 'receipt-generator': return <ReceiptGenerator />;
      case 'business-card': return <BusinessCardGenerator />;
      default:
        return (
          <div className="bg-white border-4 border-black p-12 text-center rounded-2xl shadow-[8px_8px_0px_0px_#000]">
            <h2 className="text-3xl font-black uppercase mb-4">Under Construction</h2>
            <p className="font-bold text-gray-500">This tool is being upgraded to match the mobile app experience.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg font-sans pt-24 pb-20" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}>
      
      <BusinessOnboardingModal 
        isOpen={showOnboarding} 
        onComplete={() => setShowOnboarding(false)} 
        userEmail={user?.email || ''} 
      />
      
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/tools/business" className="inline-flex items-center gap-2 font-black uppercase mb-8 hover:underline decoration-4 underline-offset-4">
          <ArrowLeft className="w-6 h-6" /> Back to Business Dashboard
        </Link>

        <div className="bg-white border-4 border-black p-6 md:p-8 mb-8 shadow-[8px_8px_0px_0px_#000] flex items-center gap-6 rounded-2xl">
          <div className="bg-neo-blue text-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000]">
            {tool.icon || <Briefcase className="w-8 h-8" />}
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase leading-none tracking-tight">{tool.name}</h1>
            <p className="font-bold text-gray-500 mt-2">Manage your business seamlessly.</p>
          </div>
        </div>

        <div className="mb-16">
          {renderTool()}
        </div>
      </div>
    </div>
  );
}
