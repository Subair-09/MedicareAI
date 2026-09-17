import React from 'react';
import { FileText } from 'lucide-react';
import { KnowledgeBaseDocument } from '../../../types';

interface RecentUploadsCardProps {
  documents: KnowledgeBaseDocument[];
  onSelectDocument: (doc: KnowledgeBaseDocument) => void;
  onViewAll: () => void;
}

export const RecentUploadsCard: React.FC<RecentUploadsCardProps> = ({
  documents,
  onSelectDocument,
  onViewAll,
}) => {
  // Use first 5 documents
  const recentDocs = documents.slice(0, 5);

  return (
    <div className="bg-white rounded-[18px] border border-[#DCE9F8] p-5 shadow-[0_2px_10px_rgba(13,40,87,0.03)] text-left">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-bold text-[#0B285C] tracking-tight">
          Recent Uploads
        </h3>
        {recentDocs.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-[12px] font-semibold text-[#0868F5] hover:underline cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      {recentDocs.length === 0 ? (
        <div className="py-7 text-center text-[#5475A7]">
          <div className="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center mx-auto mb-2.5">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-[13px] font-semibold text-[#0B285C]">No recent uploads</p>
          <p className="text-[11.5px] text-[#8AA3C6] mt-0.5">
            Uploaded guidelines and protocols will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#F0F5FA]">
          {recentDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group cursor-pointer hover:bg-[#F9FCFF] rounded-[8px] -mx-1.5 px-1.5 transition-colors"
            >
              {/* Left side: PDF icon and Document Title + size/date */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-[24px] h-[28px] rounded-[4px] bg-[#EF4444] text-white flex flex-col items-center justify-center shrink-0 shadow-2xs">
                  <span className="text-[6.5px] font-black tracking-tighter leading-none">
                    PDF
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-[12.5px] font-semibold text-[#0B285C] group-hover:text-[#0868F5] transition-colors truncate block">
                    {doc.title}
                  </span>
                  <span className="text-[11px] text-[#8AA3C6] block mt-0.5">
                    {doc.size} · {doc.dateAdded}
                  </span>
                </div>
              </div>

              {/* Right side: Uploader avatar and name */}
              <div className="flex items-center gap-1.5 shrink-0">
                {doc.uploadedBy?.avatar ? (
                  <img
                    src={doc.uploadedBy.avatar}
                    alt={doc.uploadedBy.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover border border-[#DCE9F8]"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold text-[10px] flex items-center justify-center border border-[#DCE9F8]">
                    {(doc.uploadedBy?.name || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-[11.5px] font-medium text-[#5475A7] max-w-[90px] truncate">
                  {doc.uploadedBy?.name || 'Admin'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
