import React from 'react';
import { BookOpen, HardDrive, Sparkles, BrainCircuit } from 'lucide-react';

interface KnowledgeStatsProps {
  totalDocuments?: number;
  storageUsedText?: string;
  totalStorageText?: string;
  storagePercentage?: number;
  ocrDocumentsCount?: number;
  totalChunksCount?: number;
}

export const KnowledgeStats: React.FC<KnowledgeStatsProps> = ({
  totalDocuments = 0,
  storageUsedText = '0 MB',
  totalStorageText = '5 GB',
  storagePercentage = 0,
  ocrDocumentsCount = 0,
  totalChunksCount = 0,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-4 flex-wrap">
      {/* Card 1: Total Documents */}
      <div className="w-full sm:w-[240px] bg-white rounded-[16px] border border-[#DCE9F8] p-4.5 shadow-[0_2px_8px_rgba(13,40,87,0.03)] flex items-center justify-between text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[14px] bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[12.5px] font-medium text-[#5475A7] block leading-tight">
              Total Documents
            </span>
            <div className="text-[24px] font-bold text-[#0B285C] leading-none mt-1">
              {totalDocuments}
            </div>
            <span className="text-[11px] text-[#8AA3C6] font-normal block mt-1">
              {totalDocuments === 1 ? '1 active protocol' : `${totalDocuments} active protocols`}
            </span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="text-right self-start pt-2">
          <span className="text-[12px] font-bold text-[#19B879] inline-flex items-center gap-0.5">
            {totalDocuments > 0 ? `+${totalDocuments}` : '0'}
          </span>
        </div>
      </div>

      {/* Card 2: AI Memory & OCR Chunks */}
      <div className="w-full sm:w-[260px] bg-white rounded-[16px] border border-[#E9D5FF] p-4.5 shadow-[0_2px_8px_rgba(124,77,255,0.04)] flex items-center justify-between text-left bg-gradient-to-br from-white to-[#FAF5FF]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[14px] bg-[#F3E8FF] text-[#7C4DFF] flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[12.5px] font-medium text-[#7C4DFF] block leading-tight">
              AI Memory & OCR
            </span>
            <div className="text-[24px] font-bold text-[#0B285C] leading-none mt-1">
              {ocrDocumentsCount || totalDocuments}
            </div>
            <span className="text-[11px] text-[#8AA3C6] font-normal block mt-1">
              {totalChunksCount || (totalDocuments * 24)} RAG knowledge chunks
            </span>
          </div>
        </div>

        <div className="text-right self-start pt-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF8F1] text-[#19B879] border border-[#C6EDDA] inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#19B879] animate-pulse" />
            Active
          </span>
        </div>
      </div>

      {/* Card 3: Storage Used */}
      <div className="w-full sm:w-[280px] bg-white rounded-[16px] border border-[#DCE9F8] p-4.5 shadow-[0_2px_8px_rgba(13,40,87,0.03)] text-left">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-[14px] bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center shrink-0">
            <HardDrive className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[12.5px] font-medium text-[#5475A7] block leading-tight">
              Storage Used
            </span>
            <div className="text-[24px] font-bold text-[#0B285C] leading-none mt-1">
              {storageUsedText}
            </div>

            {/* Storage Bar Row */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] text-[#8AA3C6] shrink-0">
                of {totalStorageText}
              </span>
              <div className="flex-1 h-2 rounded-full bg-[#EAF2FB] overflow-hidden">
                <div
                  className="h-full bg-[#0868F5] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                />
              </div>
              <span className="text-[11.5px] font-semibold text-[#5475A7] shrink-0">
                {storagePercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
