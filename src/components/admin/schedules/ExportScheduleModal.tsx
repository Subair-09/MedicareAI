import React, { useState } from 'react';
import { X, Download, FileText, Check, Printer } from 'lucide-react';

interface ExportScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => void;
}

export const ExportScheduleModal: React.FC<ExportScheduleModalProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [includePatientData, setIncludePatientData] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportedSuccess(true);
      setTimeout(() => {
        setExportedSuccess(false);
        onExport(selectedFormat);
        onClose();
      }, 900);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[20px] border border-[#DCE9F8] shadow-[0_20px_50px_rgba(13,40,87,0.18)] max-w-md w-full overflow-hidden text-left">
        <div className="px-6 py-4.5 border-b border-[#EAF2FB] flex items-center justify-between bg-[#F8FBFF]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center shadow-2xs">
              <Download className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#0D2857]">
                Export Schedule
              </h3>
              <p className="text-[12px] text-[#5273A8]">
                Download current timetable and appointment data
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5273A8] hover:bg-[#EAF4FF] hover:text-[#0D2857] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-2">
              Select Export Format
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'pdf', label: 'PDF Report', ext: '.pdf' },
                { id: 'excel', label: 'Excel Sheet', ext: '.xlsx' },
                { id: 'csv', label: 'CSV File', ext: '.csv' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.id as any)}
                  className={`p-3 rounded-[10px] border text-center transition-all cursor-pointer ${
                    selectedFormat === fmt.id
                      ? 'border-[#0868F5] bg-[#EAF4FF] text-[#0868F5] font-bold shadow-2xs'
                      : 'border-[#DCE9F8] bg-white text-[#5273A8] hover:bg-[#F9FCFF]'
                  }`}
                >
                  <FileText className="w-5 h-5 mx-auto mb-1 opacity-85" />
                  <div className="text-[12px]">{fmt.label}</div>
                  <div className="text-[10px] text-[#8AA3C6]">{fmt.ext}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-[#F8FBFF] rounded-[10px] border border-[#EAF2FB] text-[12.5px] text-[#0D2857]">
            <div className="font-semibold text-[#0D2857]">Current Selection:</div>
            <div className="text-[#5273A8] text-[11.5px] mt-0.5">
              Week of September 15 – September 21, 2025 (42 appointments)
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-[12.5px] text-[#0D2857] cursor-pointer">
            <input
              type="checkbox"
              checked={includePatientData}
              onChange={(e) => setIncludePatientData(e.target.checked)}
              className="rounded text-[#0868F5] focus:ring-[#0868F5]"
            />
            <span>Include patient contact and attending physician room details</span>
          </label>
        </div>

        <div className="px-6 py-4 border-t border-[#EAF2FB] flex items-center justify-between bg-[#F8FBFF]">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-[38px] px-3.5 rounded-[8px] border border-[#DCE9F8] bg-white hover:bg-[#F0F6FE] text-[#5273A8] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-[38px] px-4 rounded-[8px] border border-[#DCE9F8] text-[#5273A8] hover:bg-[#F0F6FE] text-[12.5px] font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownload}
              className="h-[38px] px-5 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-70"
            >
              {exportedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Exported!</span>
                </>
              ) : isExporting ? (
                <span>Generating...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
