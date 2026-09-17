import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Sparkles,
  CheckCircle2,
  Calendar,
  User,
  Layers,
  Cloud,
  ExternalLink,
  Copy,
  Check,
  RotateCw,
  Search,
  BookOpen,
  Tag,
  Cpu,
} from 'lucide-react';
import { KnowledgeBaseDocument } from '../../../types';
import { getCategoryBadgeStyle } from './DocumentTable';
import { api } from '../../../services/api';

interface ViewDocumentModalProps {
  isOpen: boolean;
  document: KnowledgeBaseDocument | null;
  onClose: () => void;
  onDownload: (doc: KnowledgeBaseDocument) => void;
  onDocumentUpdated?: (updatedDoc: KnowledgeBaseDocument) => void;
}

export const ViewDocumentModal: React.FC<ViewDocumentModalProps> = ({
  isOpen,
  document,
  onClose,
  onDownload,
  onDocumentUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ocr'>('ocr');
  const [isCopied, setIsCopied] = useState(false);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [reprocessSuccess, setReprocessSuccess] = useState<string | null>(null);
  const [reprocessError, setReprocessError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !document) return null;

  const handleCopyText = () => {
    if (!document.extractedText) return;
    navigator.clipboard.writeText(document.extractedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleRerunOcr = async () => {
    setIsReprocessing(true);
    setReprocessSuccess(null);
    setReprocessError(null);

    try {
      const res = await api.reprocessDocumentOcr(document.id);
      setReprocessSuccess('OCR extraction completed! AI Knowledge Base has been re-indexed.');
      if (onDocumentUpdated && res.document) {
        onDocumentUpdated(res.document);
      }
    } catch (err: any) {
      console.error('Re-run OCR error:', err);
      setReprocessError(err.message || 'Failed to re-process OCR. Ensure PDF file is reachable.');
    } finally {
      setIsReprocessing(false);
      setTimeout(() => {
        setReprocessSuccess(null);
        setReprocessError(null);
      }, 5000);
    }
  };

  const extractedText = document.extractedText || '';
  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;
  const charCount = extractedText.length;

  // Filter lines if search query is provided
  const highlightedLines = searchQuery.trim()
    ? extractedText
        .split('\n')
        .filter((line) => line.toLowerCase().includes(searchQuery.toLowerCase()))
        .join('\n')
    : extractedText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B285C]/45 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[22px] border border-[#DCE9F8] shadow-2xl w-full max-w-3xl overflow-hidden text-left flex flex-col max-h-[90vh] animate-scaleUp">
        {/* Header */}
        <div className="p-5 sm:px-6 bg-[#F8FAFD] border-b border-[#DCE9F8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[9px] bg-[#EF4444] text-white flex flex-col items-center justify-center shadow-xs">
              <span className="text-[9.5px] font-black tracking-tight leading-none">
                PDF
              </span>
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#0B285C] leading-snug">
                {document.title}
              </h3>
              <div className="flex items-center gap-2 text-[12px] text-[#5475A7] mt-0.5">
                <span>{document.filename}</span>
                <span>•</span>
                <span>{document.size}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-[#19B879] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#19B879] inline-block animate-pulse" />
                  AI Memory Active
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#EAF2FB] text-[#5475A7] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#EEF4FB] bg-white shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('ocr')}
            className={`pb-3 px-3 text-[13.5px] font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ocr'
                ? 'border-[#0868F5] text-[#0868F5]'
                : 'border-transparent text-[#5475A7] hover:text-[#0B285C]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>OCR Extracted Knowledge</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10.5px] font-bold bg-[#EAF4FF] text-[#0868F5]">
              AI Memory
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 text-[13.5px] font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#0868F5] text-[#0868F5]'
                : 'border-transparent text-[#5475A7] hover:text-[#0B285C]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Document Overview</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto [scrollbar-width:thin] grow">
          {activeTab === 'ocr' ? (
            /* =================== OCR KNOWLEDGE TAB =================== */
            <div className="space-y-5">
              {/* Alert Feedback if reprocessing */}
              {reprocessSuccess && (
                <div className="p-3.5 bg-[#EAF8F1] border border-[#C6EDDA] text-[#19B879] rounded-[12px] text-[13px] flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                  <span>{reprocessSuccess}</span>
                </div>
              )}
              {reprocessError && (
                <div className="p-3.5 bg-[#FEECEC] border border-[#FCD5D5] text-[#DC2626] rounded-[12px] text-[13px] flex items-center gap-2.5">
                  <X className="w-4.5 h-4.5 shrink-0" />
                  <span>{reprocessError}</span>
                </div>
              )}

              {/* Status Header Banner */}
              <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-[16px] p-4.5 text-[13px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0868F5] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#0B285C] block text-[14px]">
                      Optical Character Recognition (OCR) Status: {document.ocrStatus ? document.ocrStatus.toUpperCase() : 'COMPLETED'}
                    </span>
                    <p className="text-[12px] text-[#5475A7] mt-0.5 leading-relaxed">
                      All clinical text, departments, guidelines, and tables in this PDF are extracted and actively referenced in the MediCare AI conversational prompt.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRerunOcr}
                    disabled={isReprocessing}
                    className="px-3.5 py-1.5 rounded-[9px] bg-white border border-[#BFDBFE] hover:border-[#0868F5] text-[#0868F5] text-[12.5px] font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isReprocessing ? 'animate-spin' : ''}`} />
                    <span>{isReprocessing ? 'Extracting...' : 'Re-run OCR'}</span>
                  </button>
                </div>
              </div>

              {/* AI Executive Summary Card */}
              <div className="bg-[#FAF8FE] border border-[#E9D5FF] rounded-[14px] p-4 text-[13px]">
                <div className="flex items-center gap-2 text-[#7C4DFF] font-bold mb-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Clinical Summary</span>
                </div>
                <p className="text-[#4C1D95] text-[13px] leading-relaxed">
                  {document.summary || document.description || 'Clinical guidelines extracted for MediCare Hospital Knowledge Base.'}
                </p>

                {/* Key Topics / Tags */}
                {document.extractedKeywords && document.extractedKeywords.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#F3E8FF] flex items-center gap-2 flex-wrap">
                    <span className="text-[11.5px] font-semibold text-[#6B21A8] flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Key Topics:
                    </span>
                    {document.extractedKeywords.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-[#E9D5FF] text-[#7C4DFF]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Extracted Text Viewer */}
              <div className="bg-white border border-[#DCE9F8] rounded-[16px] overflow-hidden shadow-2xs">
                {/* Text Viewer Toolbar */}
                <div className="p-3 px-4 bg-[#F8FAFD] border-b border-[#DCE9F8] flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-[#0B285C] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#0868F5]" />
                      Extracted Text Content
                    </span>
                    <span className="text-[11.5px] text-[#8AA3C6]">
                      {wordCount} words • {charCount} characters • {document.pageCount || 1} {document.pageCount === 1 ? 'page' : 'pages'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Filter / Search within OCR */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#8AA3C6] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search OCR text..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-[30px] pl-7 pr-2 rounded-[6px] border border-[#DCE9F8] text-[12px] text-[#0B285C] bg-white focus:outline-hidden focus:border-[#0868F5] w-[140px] sm:w-[170px]"
                      />
                    </div>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={handleCopyText}
                      className="px-3 py-1.5 rounded-[6px] bg-white border border-[#DCE9F8] hover:border-[#0868F5] text-[#0B285C] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#19B879]" />
                          <span className="text-[#19B879]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#5475A7]" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Preformatted Text Box */}
                <div className="p-4 max-h-[320px] overflow-y-auto bg-[#FCFDFF] font-mono text-[12.5px] leading-relaxed text-[#1E293B] whitespace-pre-wrap select-text [scrollbar-width:thin]">
                  {highlightedLines || (
                    <div className="py-8 text-center text-[#8AA3C6] font-sans">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-[#CBD5E1]" />
                      <p>No text could be extracted or no lines match your search.</p>
                      <button
                        type="button"
                        onClick={handleRerunOcr}
                        className="mt-2 text-[#0868F5] font-semibold text-[12px] hover:underline cursor-pointer"
                      >
                        Click to extract with OCR
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* =================== OVERVIEW TAB =================== */
            <div className="space-y-5">
              {/* Metadata Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold ${getCategoryBadgeStyle(
                    document.category
                  )}`}
                >
                  Category: {document.category}
                </span>
                <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-[#EAF8F1] text-[#19B879] border border-[#C6EDDA] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Status: {document.status}</span>
                </span>
                <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-[#F0F6FE] text-[#0868F5] border border-[#DCE9F8] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RAG Indexed ({document.extractedChunks || 36} Chunks)</span>
                </span>

                {document.storageProvider === 'cloudinary' && (
                  <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-[#EAF4FF] text-[#0868F5] border border-[#BFDBFE] flex items-center gap-1">
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Cloudinary Asset</span>
                  </span>
                )}
              </div>

              {/* Cloudinary Storage Details if present */}
              {document.fileUrl && (
                <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-[14px] p-4 text-[13px] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white text-[#0868F5] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                      <Cloud className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="font-bold text-[#0B285C] block text-[13px]">
                        Hosted in Cloudinary Cloud Storage
                      </span>
                      <span className="text-[11.5px] text-[#5475A7] block truncate max-w-sm">
                        {document.cloudinaryPublicId ? `ID: ${document.cloudinaryPublicId}` : document.fileUrl}
                      </span>
                    </div>
                  </div>
                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-3 py-1.5 rounded-[8px] bg-white border border-[#BFDBFE] hover:border-[#0868F5] text-[#0868F5] text-[12px] font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                  >
                    <span>View Asset</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Description / Summary */}
              <div className="bg-[#F8FBFF] border border-[#DCE9F8] rounded-[14px] p-4 text-[13px]">
                <span className="font-bold text-[#0B285C] block mb-1 text-[13.5px]">
                  Clinical Summary & Protocol Overview
                </span>
                <p className="text-[#5475A7] leading-relaxed">
                  {document.description ||
                    'This hospital document contains approved clinical protocols, standard operating guidelines, and department instructions currently utilized by the hospital care teams and the MediCare AI conversational assistant.'}
                </p>
              </div>

              {/* AI Knowledge Base RAG integration Info */}
              <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-[14px] p-4 text-[13px] text-left">
                <div className="flex items-center gap-2 text-[#7C4DFF] font-bold mb-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>MediCare AI Assistant Knowledge Base Integration</span>
                </div>
                <p className="text-[#6B21A8] leading-relaxed text-[12.5px]">
                  This document is embedded into the hospital vector database. Patients and clinical staff chatting with the MediCare AI Assistant will receive verified citations directly referencing these protocols.
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-[12px] border border-[#E8F1FA] bg-white flex items-center gap-3">
                  <User className="w-5 h-5 text-[#0868F5]" />
                  <div>
                    <span className="text-[11px] text-[#8AA3C6] block">Uploaded By</span>
                    <span className="text-[13px] font-semibold text-[#0B285C]">
                      {document.uploadedBy.name} ({document.uploadedBy.role})
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-[12px] border border-[#E8F1FA] bg-white flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#0868F5]" />
                  <div>
                    <span className="text-[11px] text-[#8AA3C6] block">Date Added</span>
                    <span className="text-[13px] font-semibold text-[#0B285C]">
                      {document.dateAdded} at {document.timeAdded}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-[#F8FAFD] border-t border-[#DCE9F8] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[9px] border border-[#DCE9F8] text-[13px] font-semibold text-[#5475A7] hover:bg-white transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-4 py-2 rounded-[9px] border border-[#DCE9F8] bg-white text-[#0B285C] text-[13px] font-semibold flex items-center gap-1.5 hover:border-[#0868F5] transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4 text-[#19B879]" /> : <Copy className="w-4 h-4 text-[#5475A7]" />}
              <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={() => onDownload(document)}
              className="px-5 py-2 rounded-[9px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold flex items-center gap-2 shadow-[0_2px_8px_rgba(8,104,245,0.2)] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
