import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Edit2,
  Trash2,
  FolderSync,
  Cloud,
  FileText,
  Sparkles,
} from 'lucide-react';
import { KnowledgeBaseDocument, KnowledgeDocumentCategory } from '../../../types';

interface DocumentTableProps {
  documents: KnowledgeBaseDocument[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onOpenUpload: () => void;
  onViewDocument: (doc: KnowledgeBaseDocument) => void;
  onDownloadDocument: (doc: KnowledgeBaseDocument) => void;
  onRenameDocument: (doc: KnowledgeBaseDocument) => void;
  onChangeCategory: (doc: KnowledgeBaseDocument) => void;
  onDeleteDocument: (doc: KnowledgeBaseDocument) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const getCategoryBadgeStyle = (category: KnowledgeDocumentCategory | string) => {
  switch (category) {
    case 'General':
      return 'bg-[#EAF4FF] text-[#0868F5] border border-[#CDE3FC]';
    case 'Cardiology':
      return 'bg-[#FEECEC] text-[#EF4444] border border-[#FCD5D5]';
    case 'Emergency':
      return 'bg-[#FFF4E5] text-[#F59E0B] border border-[#FDE1BF]';
    case 'Pharmacy':
      return 'bg-[#F4EEFF] text-[#8B5CF6] border border-[#E3D4FD]';
    case 'Radiology':
      return 'bg-[#EBF7FC] text-[#0284C7] border border-[#CDEBFA]';
    case 'Dermatology':
      return 'bg-[#F4F0FF] text-[#7C4DFF] border border-[#E3D6FE]';
    case 'Pediatrics':
      return 'bg-[#E6F9F3] text-[#0D9488] border border-[#BFF0E1]';
    case 'Orthopedics':
      return 'bg-[#EAF8F1] text-[#19B879] border border-[#C6EDDA]';
    default:
      return 'bg-[#F0F6FE] text-[#5475A7] border border-[#DCE9F8]';
  }
};

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onOpenUpload,
  onViewDocument,
  onDownloadDocument,
  onRenameDocument,
  onChangeCategory,
  onDeleteDocument,
  currentPage,
  onPageChange,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Pagination calculation: 6 documents per page
  const itemsPerPage = 6;
  const totalItems = documents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocs = documents.slice(startIndex, startIndex + itemsPerPage);

  const isAllSelected =
    paginatedDocs.length > 0 && paginatedDocs.every((d) => selectedIds.includes(d.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedDocs.some((d) => d.id === id))
      );
    } else {
      const pageIds = paginatedDocs.map((d) => d.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categoriesList = [
    'All Categories',
    'General',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics',
    'Radiology',
    'Pharmacy',
    'Emergency',
  ];

  return (
    <div className="bg-white rounded-[18px] border border-[#DCE9F8] shadow-[0_2px_10px_rgba(13,40,87,0.03)] overflow-hidden">
      {/* Table Header Section */}
      <div className="p-5 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EEF4FB]">
        <div>
          <h3 className="text-[17px] font-bold text-[#0B285C] tracking-tight">
            Knowledge Base Documents
          </h3>
        </div>

        {/* Right side controls: Search, Category Filter, Upload PDF */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8AA3C6] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-[38px] pl-9 pr-3 rounded-[8px] border border-[#DCE9F8] text-[13px] text-[#0B285C] placeholder:text-[#8AA3C6] bg-white focus:outline-hidden focus:border-[#0868F5] focus:ring-1 focus:ring-[#0868F5] w-[180px] sm:w-[210px] transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="h-[38px] px-3 rounded-[8px] border border-[#DCE9F8] text-[13px] font-medium text-[#0B285C] bg-white hover:bg-[#F8FBFF] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>{selectedCategory}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#5475A7]" />
            </button>

            {isCategoryDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsCategoryDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-[10px] border border-[#DCE9F8] shadow-lg py-1.5 z-30 text-left">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        onCategoryChange(cat);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-1.5 text-[12.5px] text-left transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#EAF4FF] text-[#0868F5] font-semibold'
                          : 'text-[#0B285C] hover:bg-[#F8FBFF]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Primary Action Button: + Upload PDF */}
          <button
            type="button"
            onClick={onOpenUpload}
            className="h-[38px] px-4 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] active:scale-[0.98] text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(8,104,245,0.2)] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Upload PDF</span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-[#F6FAFE] text-[#5475A7] text-[12px] font-semibold uppercase tracking-wider border-b border-[#EEF4FB]">
              <th className="py-3.5 pl-6 pr-3 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded-xs border-[#C4D9F2] text-[#0868F5] focus:ring-0 cursor-pointer accent-[#0868F5]"
                />
              </th>
              <th className="py-3.5 px-3">Title</th>
              <th className="py-3.5 px-3">Category</th>
              <th className="py-3.5 px-3">Size</th>
              <th className="py-3.5 px-3">Uploaded By</th>
              <th className="py-3.5 px-3">Date Added</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F5FA] text-[13px]">
            {paginatedDocs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 text-center text-[#5475A7]">
                  <div className="w-12 h-12 rounded-full bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-[14px] font-semibold text-[#0B285C]">
                    No knowledge base documents found
                  </p>
                  <p className="text-[12px] text-[#8AA3C6] mt-1 max-w-sm mx-auto">
                    {searchTerm || selectedCategory !== 'All Categories'
                      ? 'Try clearing your search query or category filter.'
                      : 'Upload clinical guidelines or protocols above to index them for the AI Assistant.'}
                  </p>
                  {(searchTerm || selectedCategory !== 'All Categories') && (
                    <button
                      type="button"
                      onClick={() => {
                        onSearchChange('');
                        onCategoryChange('All Categories');
                      }}
                      className="mt-3 text-[12px] font-semibold text-[#0868F5] hover:underline cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedDocs.map((doc) => {
                const isSelected = selectedIds.includes(doc.id);
                return (
                  <tr
                    key={doc.id}
                    className={`hover:bg-[#F9FCFF] transition-colors ${
                      isSelected ? 'bg-[#F2F8FF]' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 pl-6 pr-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(doc.id)}
                        className="w-4 h-4 rounded-xs border-[#C4D9F2] text-[#0868F5] focus:ring-0 cursor-pointer accent-[#0868F5]"
                      />
                    </td>

                    {/* Title with PDF icon */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        {/* Red PDF File Icon */}
                        <div className="w-[28px] h-[32px] rounded-[5px] bg-[#EF4444] text-white flex flex-col items-center justify-center shrink-0 shadow-2xs">
                          <span className="text-[7.5px] font-black tracking-tighter leading-none">
                            PDF
                          </span>
                        </div>
                        <div>
                          <span
                            onClick={() => onViewDocument(doc)}
                            className="font-semibold text-[#0B285C] hover:text-[#0868F5] transition-colors cursor-pointer block leading-snug"
                          >
                            {doc.title}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-[11.5px] text-[#8AA3C6]">
                              {doc.filename}
                            </span>
                            {doc.storageProvider === 'cloudinary' && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-xs text-[10px] font-semibold bg-[#EAF4FF] text-[#0868F5] border border-[#D0E4FA]">
                                <Cloud className="w-2.5 h-2.5" />
                                <span>Cloudinary</span>
                              </span>
                            )}
                            {doc.extractedText && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewDocument(doc);
                                }}
                                title="Click to view full OCR extracted text & AI memory"
                                className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-xs text-[10px] font-semibold bg-[#FAF5FF] text-[#7C4DFF] border border-[#E9D5FF] cursor-pointer hover:bg-[#F3E8FF] transition-colors"
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>OCR Active</span>
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold ${getCategoryBadgeStyle(
                          doc.category
                        )}`}
                      >
                        {doc.category}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-[#5475A7] font-medium">
                      {doc.size}
                    </td>

                    {/* Uploaded By */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {doc.uploadedBy?.avatar ? (
                          <img
                            src={doc.uploadedBy.avatar}
                            alt={doc.uploadedBy.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover border border-[#DCE9F8]"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold text-[11px] flex items-center justify-center border border-[#DCE9F8] shrink-0">
                            {(doc.uploadedBy?.name || 'A').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-[#0B285C] block leading-tight text-[12.5px]">
                            {doc.uploadedBy?.name || 'Admin'}
                          </span>
                          <span className="text-[11px] text-[#8AA3C6] block mt-0.5">
                            {doc.uploadedBy?.role || 'Staff'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date Added */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="text-[#0B285C] font-medium block leading-tight text-[12.5px]">
                        {doc.dateAdded}
                      </span>
                      <span className="text-[11px] text-[#8AA3C6] block mt-0.5">
                        {doc.timeAdded}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-[#EAF8F1] text-[#19B879] border border-[#C6EDDA]">
                        {doc.status}
                      </span>
                    </td>

                    {/* Actions Three-dot Button */}
                    <td className="py-3.5 pr-6 pl-3 text-right whitespace-nowrap">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(activeMenuId === doc.id ? null : doc.id)
                          }
                          className="w-8 h-8 rounded-full hover:bg-[#EEF5FC] text-[#5475A7] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Three-dot dropdown */}
                        {activeMenuId === doc.id && (
                          <>
                            <div
                              className="fixed inset-0 z-20"
                              onClick={() => setActiveMenuId(null)}
                            />
                            <div className="absolute right-0 mt-1 w-44 bg-white rounded-[10px] border border-[#DCE9F8] shadow-lg py-1.5 z-30 text-left">
                              <button
                                type="button"
                                onClick={() => {
                                  onViewDocument(doc);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-1.5 text-[12.5px] text-[#0B285C] hover:bg-[#F8FBFF] flex items-center gap-2 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#0868F5]" />
                                <span>View Document</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onViewDocument(doc);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-1.5 text-[12.5px] text-[#7C4DFF] hover:bg-[#FAF5FF] flex items-center gap-2 cursor-pointer font-medium"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-[#7C4DFF]" />
                                <span>View OCR & AI Memory</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onDownloadDocument(doc);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-1.5 text-[12.5px] text-[#0B285C] hover:bg-[#F8FBFF] flex items-center gap-2 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-[#5475A7]" />
                                <span>Download</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onRenameDocument(doc);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-1.5 text-[12.5px] text-[#0B285C] hover:bg-[#F8FBFF] flex items-center gap-2 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#5475A7]" />
                                <span>Rename</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onChangeCategory(doc);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-1.5 text-[12.5px] text-[#0B285C] hover:bg-[#F8FBFF] flex items-center gap-2 cursor-pointer"
                              >
                                <FolderSync className="w-3.5 h-3.5 text-[#5475A7]" />
                                <span>Change Category</span>
                              </button>

                              <div className="my-1 border-t border-[#EEF4FB]" />

                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteDocument(doc);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-1.5 text-[12.5px] text-[#DC2626] hover:bg-[#FEECEC] flex items-center gap-2 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer: Showing 1 – 6 of 24 documents & Pagination */}
      <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#EEF4FB] text-[13px] text-[#5475A7]">
        <div>
          Showing{' '}
          <span className="font-semibold text-[#0B285C]">
            {totalItems === 0 ? 0 : startIndex + 1}
          </span>{' '}
          –{' '}
          <span className="font-semibold text-[#0B285C]">
            {Math.min(startIndex + itemsPerPage, totalItems)}
          </span>{' '}
          of <span className="font-semibold text-[#0B285C]">{totalItems}</span> documents
        </div>

        {/* Pagination Numbers */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          {/* Previous page */}
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-8 h-8 rounded-[7px] border border-[#DCE9F8] text-[#5475A7] flex items-center justify-center hover:bg-[#F8FBFF] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 1, 2, 3, 4 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-[7px] text-[13px] font-semibold transition-colors cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-[#0868F5] text-white'
                  : 'text-[#5475A7] hover:bg-[#F0F6FE] border border-[#DCE9F8]'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Next page */}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-8 h-8 rounded-[7px] border border-[#DCE9F8] text-[#5475A7] flex items-center justify-center hover:bg-[#F8FBFF] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
