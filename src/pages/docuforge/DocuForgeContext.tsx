import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface ScannedPage {
  id: string;
  originalImage: string; // Base64 data URL
  croppedImage: string | null; // Base64 data URL
  filter: 'none' | 'grayscale' | 'bw';
}

interface DocuForgeState {
  pages: ScannedPage[];
  addPage: (image: string) => void;
  updatePage: (id: string, updates: Partial<ScannedPage>) => void;
  removePage: (id: string) => void;
  clearPages: () => void;
  reorderPages: (startIndex: number, endIndex: number) => void;
}

const DocuForgeContext = createContext<DocuForgeState | undefined>(undefined);

export function DocuForgeProvider({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<ScannedPage[]>([]);

  const addPage = (image: string) => {
    setPages((prev) => [
      ...prev,
      { id: uuidv4(), originalImage: image, croppedImage: null, filter: 'none' },
    ]);
  };

  const updatePage = (id: string, updates: Partial<ScannedPage>) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const clearPages = () => setPages([]);

  const reorderPages = (startIndex: number, endIndex: number) => {
    setPages((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  return (
    <DocuForgeContext.Provider
      value={{ pages, addPage, updatePage, removePage, clearPages, reorderPages }}
    >
      {children}
    </DocuForgeContext.Provider>
  );
}

export function useDocuForge() {
  const context = useContext(DocuForgeContext);
  if (context === undefined) {
    throw new Error('useDocuForge must be used within a DocuForgeProvider');
  }
  return context;
}
