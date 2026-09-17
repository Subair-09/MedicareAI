import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BookOpen, ChevronRight, CheckCircle2, Database, RefreshCw, Cloud } from 'lucide-react';
import { AdminSidebar, NavItemKey } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { KnowledgeStats } from './knowledge/KnowledgeStats';
import { UploadPdfCard } from './knowledge/UploadPdfCard';
import { DocumentTable } from './knowledge/DocumentTable';
import { DocumentCategoriesCard } from './knowledge/DocumentCategoriesCard';
import { RecentUploadsCard } from './knowledge/RecentUploadsCard';
import { NeedHelpCard } from './knowledge/NeedHelpCard';
import { ViewDocumentModal } from './knowledge/ViewDocumentModal';
import { MongoStatusModal } from './knowledge/MongoStatusModal';
import { CloudinaryStatusModal } from './CloudinaryStatusModal';
import {
  RenameDocumentModal,
  ChangeCategoryModal,
  DeleteConfirmModal,
  ContactSupportModal,
} from './knowledge/KnowledgeModals';
import { KnowledgeBaseDocument, KnowledgeDocumentCategory } from '../../types';
import { api, DbStatusResponse, CloudinaryStatusResponse } from '../../services/api';


interface KnowledgeBasePageProps {
  adminUser?: {
    email: string;
    name: string;
    role: string;
  };
  onNavigateNav: (nav: NavItemKey) => void;
  onSignOut: () => void;
  onGoToPatientPortal: () => void;
}

export const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({
  adminUser = { email: 'nuddywale@gmail.com', name: 'Adewale', role: 'Super Administrator' },
  onNavigateNav,
  onSignOut,
  onGoToPatientPortal,
}) => {
  // Mobile menu and header state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // MongoDB & Database State
  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  // Cloudinary Storage State
  const [cloudinaryStatus, setCloudinaryStatus] = useState<CloudinaryStatusResponse | null>(null);
  const [isCloudinaryModalOpen, setIsCloudinaryModalOpen] = useState(false);


  // Documents state - initialized to real live documents from MongoDB
  const [documents, setDocuments] = useState<KnowledgeBaseDocument[]>([]);

  // Filters & Search
  const [tableSearch, setTableSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [viewingDoc, setViewingDoc] = useState<KnowledgeBaseDocument | null>(null);
  const [renamingDoc, setRenamingDoc] = useState<KnowledgeBaseDocument | null>(null);
  const [categorizingDoc, setCategorizingDoc] = useState<KnowledgeBaseDocument | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<KnowledgeBaseDocument | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load database status, cloudinary status and documents
  const loadDbStatus = useCallback(async () => {
    try {
      const status = await api.getDbStatus();
      setDbStatus(status);
    } catch (err) {
      console.warn('Failed to load DB status:', err);
    }
  }, []);

  const loadCloudinaryStatus = useCallback(async () => {
    try {
      const status = await api.getCloudinaryStatus();
      setCloudinaryStatus(status);
    } catch (err) {
      console.warn('Failed to load Cloudinary status:', err);
    }
  }, []);

  const loadDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    try {
      const docs = await api.getDocuments();
      setDocuments(docs || []);
    } catch (err) {
      console.warn('Failed to load documents:', err);
      setDocuments([]);
    } finally {
      setIsLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    loadDbStatus();
    loadCloudinaryStatus();
    loadDocuments();
  }, [loadDbStatus, loadCloudinaryStatus, loadDocuments]);


  // Compute dynamic category counts based on current documents
  const dynamicCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, [documents]);

  // Compute dynamic storage stats from documents
  const { storageUsedText, storagePercentage } = useMemo(() => {
    const totalBytes = documents.reduce((acc, doc) => {
      if (typeof doc.sizeBytes === 'number') return acc + doc.sizeBytes;
      if (typeof doc.size === 'string') {
        const match = doc.size.match(/([\d.]+)\s*(MB|KB|GB)/i);
        if (match) {
          const val = parseFloat(match[1]);
          const unit = match[2].toUpperCase();
          if (unit === 'KB') return acc + val * 1024;
          if (unit === 'MB') return acc + val * 1024 * 1024;
          if (unit === 'GB') return acc + val * 1024 * 1024 * 1024;
        }
      }
      return acc;
    }, 0);

    const totalStorageBytes = 5 * 1024 * 1024 * 1024; // 5 GB
    const percentage = Math.min(100, Math.round((totalBytes / totalStorageBytes) * 100));

    let formattedUsed = '0 MB';
    if (totalBytes > 0) {
      if (totalBytes < 1024 * 1024) {
        formattedUsed = `${(totalBytes / 1024).toFixed(1)} KB`;
      } else if (totalBytes < 1024 * 1024 * 1024) {
        formattedUsed = `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
      } else {
        formattedUsed = `${(totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
      }
    }

    return {
      storageUsedText: formattedUsed,
      storagePercentage: percentage,
    };
  }, [documents]);

  // Compute OCR-indexed count & total RAG chunks
  const ocrDocumentsCount = useMemo(() => {
    return documents.filter((d) => d.extractedText && d.extractedText.trim().length > 0).length;
  }, [documents]);

  const totalChunksCount = useMemo(() => {
    return documents.reduce((acc, d) => acc + (d.extractedChunks || 24), 0);
  }, [documents]);

  // Combined search & filter logic
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Category filter
      if (selectedCategory !== 'All Categories' && doc.category !== selectedCategory) {
        return false;
      }

      // Search query (combining tableSearch and globalSearch)
      const query = (tableSearch || globalSearch).trim().toLowerCase();
      if (!query) return true;

      return (
        doc.title.toLowerCase().includes(query) ||
        doc.filename.toLowerCase().includes(query) ||
        doc.category.toLowerCase().includes(query) ||
        doc.uploadedBy.name.toLowerCase().includes(query) ||
        (doc.extractedText && doc.extractedText.toLowerCase().includes(query)) ||
        (doc.summary && doc.summary.toLowerCase().includes(query)) ||
        (doc.extractedKeywords && doc.extractedKeywords.some((k) => k.toLowerCase().includes(query)))
      );
    });
  }, [documents, selectedCategory, tableSearch, globalSearch]);

  // Handlers
  const handleUploadSuccess = async (newDocData: Omit<KnowledgeBaseDocument, 'id'>) => {
    try {
      const created = await api.createDocument(newDocData);
      setDocuments((prev) => [created, ...prev.filter((d) => d.id !== created.id)]);
      setCurrentPage(1);
      showToast(`"${created.title}" saved to MongoDB & indexed for AI!`);
      loadDbStatus();
    } catch (err) {
      const fallbackDoc: KnowledgeBaseDocument = {
        ...newDocData,
        id: `kb-${Date.now()}`,
      };
      setDocuments((prev) => [fallbackDoc, ...prev]);
      setCurrentPage(1);
      showToast(`"${fallbackDoc.title}" uploaded & saved locally!`);
    }
  };

  const handleRenameDocument = async (id: string, newTitle: string, newFilename: string) => {
    try {
      await api.updateDocument(id, { title: newTitle, filename: newFilename });
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, title: newTitle, filename: newFilename } : d))
      );
      showToast('Document renamed and updated in MongoDB.');
    } catch (err) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, title: newTitle, filename: newFilename } : d))
      );
      showToast('Document renamed successfully.');
    }
  };

  const handleChangeCategory = async (id: string, newCategory: KnowledgeDocumentCategory) => {
    try {
      await api.updateDocument(id, { category: newCategory });
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, category: newCategory } : d))
      );
      showToast(`Document category updated in MongoDB to ${newCategory}.`);
      loadDbStatus();
    } catch (err) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, category: newCategory } : d))
      );
      showToast(`Document moved to ${newCategory}.`);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    const docToDelete = documents.find((d) => d.id === id);
    try {
      await api.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      showToast(`"${docToDelete?.title || 'Document'}" removed from MongoDB.`);
      loadDbStatus();
    } catch (err) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      showToast(`"${docToDelete?.title || 'Document'}" removed.`);
    }
  };

  const handleReseedDb = async () => {
    setIsReseeding(true);
    try {
      const res = await api.seedDatabase();
      setDbStatus(res.status);
      await loadDocuments();
      showToast('MongoDB collections re-seeded with initial hospital protocols!');
    } catch (err: any) {
      showToast(err.message || 'Failed to re-seed MongoDB', 'info');
    } finally {
      setIsReseeding(false);
    }
  };

  const handleDownloadDocument = (doc: KnowledgeBaseDocument) => {
    showToast(`Downloading "${doc.filename}"...`, 'info');
    const element = document.createElement('a');
    const file = new Blob([`MediCare Hospital Clinical Knowledge Document: ${doc.title}\nCategory: ${doc.category}\nStatus: ${doc.status}`], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = doc.filename.replace('.pdf', '') + '.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex h-screen bg-[#F7FAFE] overflow-hidden text-[#0B285C]">
      {/* 1. Left Sidebar (Fixed 258px) */}
      <AdminSidebar
        activeItem="knowledge-base"
        onSelectItem={(item) => onNavigateNav(item)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onViewHospitalProfile={onGoToPatientPortal}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* 2. Top Header */}
        <AdminHeader
          adminName={adminUser.name}
          adminRole={adminUser.role}
          adminEmail={adminUser.email}
          searchPlaceholder="Search patients, doctors, appointments..."
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          onSignOut={onSignOut}
          onGoToPatientPortal={onGoToPatientPortal}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        {/* Scrollable Body Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 [scrollbar-width:thin]">
          <div className="max-w-[1680px] mx-auto space-y-6 text-left animate-fadeIn">
            {/* Notification Toast */}
            {toastMessage && (
              <div className="bg-[#E7F9F0] border border-[#A7F3D0] text-[#047857] px-4 py-3 rounded-[12px] flex items-center justify-between shadow-xs animate-fadeIn">
                <div className="flex items-center gap-2 text-[13.5px] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#19B879]" />
                  <span>{toastMessage.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="text-[#047857] hover:opacity-75 text-[12px] font-bold cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* 3. Breadcrumb & Storage/Database Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[13px] text-[#5475A7]">
                <span
                  onClick={() => onNavigateNav('dashboard')}
                  className="hover:text-[#0868F5] cursor-pointer transition-colors"
                >
                  Dashboard
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#8AA3C6]" />
                <span className="text-[#0B285C] font-semibold">Knowledge Base</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Cloudinary Storage Status Pill Button */}
                <button
                  type="button"
                  onClick={() => setIsCloudinaryModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE9F8] hover:border-[#0868F5] transition-all shadow-2xs cursor-pointer text-left hover:shadow-xs"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cloudinaryStatus?.configured ? 'bg-[#10B981]' : 'bg-[#3B82F6]'
                    }`}
                  />
                  <Cloud className="w-3.5 h-3.5 text-[#0868F5]" />
                  <span className="text-[12px] font-semibold text-[#0B285C]">
                    Cloudinary:{' '}
                    <span className="text-[#5475A7] font-medium">
                      {cloudinaryStatus?.configured ? 'Cloud Active' : 'Pipeline Ready'}
                    </span>
                  </span>
                  <span className="text-[11px] bg-[#F0F6FE] text-[#0868F5] px-2 py-0.5 rounded-full font-bold">
                    PDF & Images
                  </span>
                </button>

                {/* MongoDB Status Pill Button */}
                <button
                  type="button"
                  onClick={() => setIsDbModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE9F8] hover:border-[#0868F5] transition-all shadow-2xs cursor-pointer text-left hover:shadow-xs"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      dbStatus?.connected ? 'bg-[#10B981]' : 'bg-[#D97706] animate-pulse'
                    }`}
                  />
                  <Database className="w-3.5 h-3.5 text-[#0868F5]" />
                  <span className="text-[12px] font-semibold text-[#0B285C]">
                    MongoDB:{' '}
                    <span className="text-[#5475A7] font-medium">
                      {dbStatus?.connected ? 'Atlas Connected' : 'Active (Fallback Store)'}
                    </span>
                  </span>
                  <span className="text-[11px] bg-[#EAF4FF] text-[#0868F5] px-2 py-0.5 rounded-full font-bold">
                    {documents.length} Records
                  </span>
                </button>
              </div>
            </div>


            {/* 4 & 5. Page Title + Top Right Statistics */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              {/* Page Title with Book Icon */}
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center shrink-0 shadow-2xs">
                  <BookOpen className="w-7 h-7 stroke-[2.3]" />
                </div>
                <div>
                  <h1 className="text-[26px] sm:text-[28px] font-bold text-[#0B285C] tracking-tight leading-tight">
                    Knowledge Base
                  </h1>
                  <p className="text-[13.5px] text-[#5475A7] mt-0.5">
                    Upload and manage hospital documents, guidelines, and resources.
                  </p>
                </div>
              </div>

              {/* Top Right Statistics (Total Documents & Storage Used & AI OCR) */}
              <KnowledgeStats
                totalDocuments={documents.length}
                storageUsedText={storageUsedText}
                totalStorageText="5 GB"
                storagePercentage={storagePercentage}
                ocrDocumentsCount={ocrDocumentsCount}
                totalChunksCount={totalChunksCount}
              />
            </div>

            {/* 6. Main Two-Column Layout (Content ~71% | Sidebar ~29%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Large Upload PDF Card + Knowledge Base Documents Table */}
              <div className="lg:col-span-8 xl:col-span-8 space-y-6">
                {/* 7. Large PDF Upload Card */}
                <UploadPdfCard
                  onUploadSuccess={handleUploadSuccess}
                  adminName={adminUser.name}
                />

                {/* 8 & 9. Knowledge Base Documents Table & Pagination */}
                <DocumentTable
                  documents={filteredDocuments}
                  searchTerm={tableSearch}
                  onSearchChange={(val) => {
                    setTableSearch(val);
                    setCurrentPage(1);
                  }}
                  selectedCategory={selectedCategory}
                  onCategoryChange={(cat) => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  onOpenUpload={() => {
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                    showToast('Drag and drop your PDF file or click "Choose PDF File" above.', 'info');
                  }}
                  onViewDocument={(doc) => setViewingDoc(doc)}
                  onDownloadDocument={handleDownloadDocument}
                  onRenameDocument={(doc) => setRenamingDoc(doc)}
                  onChangeCategory={(doc) => setCategorizingDoc(doc)}
                  onDeleteDocument={(doc) => setDeletingDoc(doc)}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>

              {/* Right Column: Categories, Recent Uploads, Help Card */}
              <div className="lg:col-span-4 xl:col-span-4 space-y-6">
                {/* 10. Document Categories */}
                <DocumentCategoriesCard
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                    showToast(
                      cat === 'All Categories'
                        ? 'Showing all categories'
                        : `Filtered by ${cat}`,
                      'info'
                    );
                  }}
                  categoryCounts={dynamicCategoryCounts}
                />

                {/* 11. Recent Uploads */}
                <RecentUploadsCard
                  documents={documents}
                  onSelectDocument={(doc) => setViewingDoc(doc)}
                  onViewAll={() => {
                    setSelectedCategory('All Categories');
                    setTableSearch('');
                    setGlobalSearch('');
                    setCurrentPage(1);
                    showToast('Displaying all uploaded hospital documents.', 'info');
                  }}
                />

                {/* 12. Need Help? Card */}
                <NeedHelpCard onContactSupport={() => setIsSupportOpen(true)} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <ViewDocumentModal
        isOpen={!!viewingDoc}
        document={viewingDoc}
        onClose={() => setViewingDoc(null)}
        onDownload={handleDownloadDocument}
        onDocumentUpdated={(updated) => {
          setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
          setViewingDoc(updated);
          showToast(`"${updated.title}" OCR extracted & updated in AI memory!`);
        }}
      />

      <RenameDocumentModal
        isOpen={!!renamingDoc}
        document={renamingDoc}
        onClose={() => setRenamingDoc(null)}
        onSave={handleRenameDocument}
      />

      <ChangeCategoryModal
        isOpen={!!categorizingDoc}
        document={categorizingDoc}
        onClose={() => setCategorizingDoc(null)}
        onSave={handleChangeCategory}
      />

      <DeleteConfirmModal
        isOpen={!!deletingDoc}
        document={deletingDoc}
        onClose={() => setDeletingDoc(null)}
        onConfirm={handleDeleteDocument}
      />

      <ContactSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        onSend={(msg) => {
          showToast('Support inquiry submitted. Our clinical IT team will respond shortly!');
        }}
      />

      <MongoStatusModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        status={dbStatus}
        onRefresh={loadDbStatus}
        onReseed={handleReseedDb}
        isReseeding={isReseeding}
      />

      <CloudinaryStatusModal
        isOpen={isCloudinaryModalOpen}
        onClose={() => {
          setIsCloudinaryModalOpen(false);
          loadCloudinaryStatus();
        }}
      />
    </div>
  );
};

