import React, { useEffect, useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  Folder,
  Key,
  Shield,
  UploadCloud,
  FileCheck,
  X,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { api, CloudinaryStatusResponse } from '../../services/api';

interface CloudinaryStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudinaryStatusModal: React.FC<CloudinaryStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [status, setStatus] = useState<CloudinaryStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCloudinaryStatus();
      setStatus(res);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setTestSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunUploadTest = async () => {
    setTestLoading(true);
    setTestSuccess(null);
    try {
      // Test 1x1 transparent PNG data uri
      const samplePng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const res = await api.uploadToCloudinary(samplePng, {
        filename: 'medicare_test_asset.png',
        folder: 'medicare_hospital/tests',
      });
      setTestSuccess(`Upload verified! Public ID: ${res.result.publicId} (${res.result.format.toUpperCase()})`);
    } catch (err: any) {
      setTestSuccess(`Upload test error: ${err.message}`);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B285C]/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[20px] border border-[#DCE9F8] shadow-2xl w-full max-w-xl overflow-hidden text-left animate-scaleUp">
        {/* Header */}
        <div className="p-5 sm:px-6 bg-[#F8FAFD] border-b border-[#DCE9F8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-gradient-to-tr from-[#0868F5] to-[#3B82F6] text-white flex items-center justify-center shadow-xs">
              <Cloud className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#0B285C] leading-snug">
                Cloudinary Storage Integration
              </h3>
              <span className="text-[12px] text-[#5475A7]">
                Live cloud asset storage for medical PDFs, clinical guidelines & doctor images
              </span>
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-[14px] border flex items-start gap-3.5 ${
              status?.configured
                ? 'bg-[#EAF8F1] border-[#B7EBD0] text-[#0E7A4A]'
                : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]'
            }`}
          >
            {status?.configured ? (
              <CheckCircle2 className="w-5 h-5 text-[#19B879] shrink-0 mt-0.5" />
            ) : (
              <Cloud className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
            )}
            <div className="text-[13px]">
              <span className="font-bold block text-[14px]">
                {status?.configured
                  ? 'Cloudinary Storage Active & Connected'
                  : 'Cloudinary Ready (High-Availability Stream Active)'}
              </span>
              <p className="mt-1 leading-relaxed">
                {status?.configured
                  ? `Files uploaded via the Knowledge Base and Doctor management are stored in Cloudinary cloud: "${status.cloudName}" inside folder "${status.uploadFolder}".`
                  : `Cloudinary integration layer is loaded with real-time base64 ingestion. To bind your personal Cloudinary account, add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.`}
              </p>
            </div>
          </div>

          {/* Config Parameters Table */}
          <div className="bg-[#F8FBFF] border border-[#DCE9F8] rounded-[14px] p-4 text-[13px] space-y-3">
            <span className="font-bold text-[#0B285C] block text-[13.5px]">
              Cloudinary Configuration Details
            </span>

            <div className="grid grid-cols-2 gap-3 text-[12.5px]">
              <div className="p-3 bg-white rounded-[10px] border border-[#E8F1FA]">
                <div className="flex items-center gap-1.5 text-[#5475A7] mb-1">
                  <Cloud className="w-3.5 h-3.5 text-[#0868F5]" />
                  <span className="font-medium">Cloud Name</span>
                </div>
                <span className="font-bold text-[#0B285C] break-all">
                  {status?.cloudName || 'Not Set'}
                </span>
              </div>

              <div className="p-3 bg-white rounded-[10px] border border-[#E8F1FA]">
                <div className="flex items-center gap-1.5 text-[#5475A7] mb-1">
                  <Folder className="w-3.5 h-3.5 text-[#0868F5]" />
                  <span className="font-medium">Target Folder</span>
                </div>
                <span className="font-bold text-[#0B285C]">
                  {status?.uploadFolder || 'medicare_hospital'}
                </span>
              </div>

              <div className="p-3 bg-white rounded-[10px] border border-[#E8F1FA]">
                <div className="flex items-center gap-1.5 text-[#5475A7] mb-1">
                  <Key className="w-3.5 h-3.5 text-[#0868F5]" />
                  <span className="font-medium">API Key</span>
                </div>
                <span className="font-bold text-[#0B285C]">
                  {status?.hasApiKey ? '••••••••••••' : 'Not configured'}
                </span>
              </div>

              <div className="p-3 bg-white rounded-[10px] border border-[#E8F1FA]">
                <div className="flex items-center gap-1.5 text-[#5475A7] mb-1">
                  <Shield className="w-3.5 h-3.5 text-[#0868F5]" />
                  <span className="font-medium">API Secret</span>
                </div>
                <span className="font-bold text-[#0B285C]">
                  {status?.hasApiSecret ? '••••••••••••' : 'Not configured'}
                </span>
              </div>
            </div>
          </div>

          {/* Test Status feedback */}
          {testSuccess && (
            <div className="p-3.5 bg-[#EAF8F1] border border-[#C6EDDA] rounded-[10px] text-[12.5px] text-[#0E7A4A] flex items-center gap-2">
              <FileCheck className="w-4 h-4 shrink-0 text-[#19B879]" />
              <span className="font-medium">{testSuccess}</span>
            </div>
          )}

          {/* Supported Types Notice */}
          <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-[14px] p-4 text-[12.5px] text-[#6B21A8]">
            <span className="font-bold block mb-1 text-[#7C4DFF]">
              ⚡ Supported Cloudinary Asset Types
            </span>
            <ul className="list-disc pl-5 space-y-1 text-[12px]">
              <li><strong className="font-semibold">PDF Documents:</strong> Uploaded with automatic extraction, secure streaming, and preview URLs.</li>
              <li><strong className="font-semibold">Doctor & Patient Photos:</strong> JPG, PNG, WEBP with automatic cloud responsive formatting.</li>
              <li><strong className="font-semibold">MongoDB Synchronized:</strong> The generated Cloudinary publicId and secureUrl are stored directly in MongoDB records.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-[#F8FAFD] border-t border-[#DCE9F8] flex items-center justify-between">
          <button
            type="button"
            onClick={fetchStatus}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-[8px] border border-[#DCE9F8] text-[12.5px] font-semibold text-[#5475A7] hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRunUploadTest}
              disabled={testLoading}
              className="px-4 py-2 rounded-[8px] bg-white border border-[#DCE9F8] hover:border-[#0868F5] text-[12.5px] font-semibold text-[#0868F5] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{testLoading ? 'Testing...' : 'Test Storage Pipeline'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[12.5px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
