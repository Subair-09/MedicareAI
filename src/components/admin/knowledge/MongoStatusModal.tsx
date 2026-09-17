import React, { useState } from 'react';
import {
  Database,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { DbStatusResponse } from '../../../services/api';

interface MongoStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: DbStatusResponse | null;
  onRefresh: () => void;
  onReseed: () => Promise<void>;
  isReseeding?: boolean;
}

export const MongoStatusModal: React.FC<MongoStatusModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefresh,
  onReseed,
  isReseeding = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B285C]/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[20px] border border-[#DCE9F8] shadow-2xl w-full max-w-xl overflow-hidden text-left animate-scaleUp">
        {/* Header */}
        <div className="p-5 sm:px-6 bg-[#F8FAFD] border-b border-[#DCE9F8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#10B981]/15 text-[#059669] flex items-center justify-center border border-[#10B981]/30 shadow-2xs">
              <Database className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-[#0B285C]">
                  MongoDB Integration
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                    status?.connected
                      ? 'bg-[#EAF8F1] text-[#10B981] border border-[#A7F3D0]'
                      : 'bg-[#FFF7ED] text-[#D97706] border border-[#FDE68A]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      status?.connected ? 'bg-[#10B981]' : 'bg-[#D97706] animate-pulse'
                    }`}
                  />
                  {status?.connected ? 'Atlas / Live Connected' : 'In-Memory Fallback Active'}
                </span>
              </div>
              <span className="text-[12px] text-[#5475A7]">
                Official MongoDB Node.js Driver (v7.x)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#EAF2FB] text-[#5475A7] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto [scrollbar-width:thin]">
          {/* Connection Status Box */}
          <div
            className={`p-4 rounded-[14px] border ${
              status?.connected
                ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                : 'bg-[#FFFBEB] border-[#FDE68A]'
            }`}
          >
            <div className="flex items-start gap-3">
              {status?.connected ? (
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              )}
              <div className="text-[13px] leading-relaxed">
                <span className="font-bold text-[#0B285C] block">
                  {status?.connected
                    ? `Connected to MongoDB database: "${status.database}"`
                    : 'Running with Embedded In-Memory MongoDB Store'}
                </span>
                <p className="text-[#5475A7] mt-0.5">
                  {status?.connected
                    ? 'All knowledge documents, clinical protocols, appointments, and doctors are stored and retrieved persistently from your MongoDB cluster.'
                    : 'The server is currently using resilient in-memory collections populated with default clinical datasets. To bind an external MongoDB Atlas cluster, set MONGODB_URI in Settings.'}
                </p>
              </div>
            </div>
          </div>

          {/* Database Details */}
          <div className="grid grid-cols-2 gap-3 text-[12.5px]">
            <div className="p-3 bg-[#F8FBFF] border border-[#DCE9F8] rounded-[10px]">
              <span className="text-[11px] text-[#8AA3C6] block font-medium">Database Name</span>
              <span className="font-bold text-[#0B285C] font-mono text-[13px]">{status?.database || 'medicare_db'}</span>
            </div>
            <div className="p-3 bg-[#F8FBFF] border border-[#DCE9F8] rounded-[10px]">
              <span className="text-[11px] text-[#8AA3C6] block font-medium">Provider Engine</span>
              <span className="font-bold text-[#0868F5] text-[13px]">
                {status?.provider === 'mongodb' ? 'MongoDB Driver (Atlas/Local)' : 'In-Memory Engine'}
              </span>
            </div>
          </div>

          {/* Collections Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-bold text-[#0B285C] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0868F5]" />
                <span>MongoDB Collections</span>
              </span>
              <button
                type="button"
                onClick={onRefresh}
                className="text-[11.5px] font-semibold text-[#0868F5] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh Counts</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {status?.collections.map((col) => (
                <div
                  key={col.name}
                  className="p-2.5 rounded-[10px] border border-[#DCE9F8] bg-white flex items-center justify-between"
                >
                  <div>
                    <span className="text-[12px] font-semibold text-[#0B285C] block capitalize">
                      {col.name}
                    </span>
                    <span className="text-[10.5px] text-[#8AA3C6]">Collection</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#EAF4FF] text-[#0868F5] text-[12px] font-bold">
                    {col.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Connection URI info */}
          <div className="bg-[#F8FAFD] border border-[#DCE9F8] rounded-[12px] p-3.5">
            <span className="text-[11px] text-[#8AA3C6] block font-medium mb-1">
              Active Connection URI
            </span>
            <code className="text-[11.5px] font-mono text-[#0B285C] break-all block bg-white px-2.5 py-1.5 rounded-[6px] border border-[#E2EAF4]">
              {status?.connectionUri}
            </code>
          </div>

          {/* How to configure MongoDB Atlas note */}
          <div className="bg-[#F5F9FF] border border-[#D0E2FF] rounded-[12px] p-3.5 text-[12px] text-[#3B5B8C] leading-relaxed">
            <span className="font-bold text-[#0B285C] block mb-1">
              Need to connect your MongoDB Atlas Cluster?
            </span>
            Add your connection string in <code className="bg-[#E6F0FF] px-1 py-0.5 rounded text-[#0868F5] font-semibold">.env.example</code> or the platform Secrets/Settings panel as <code className="bg-[#E6F0FF] px-1 py-0.5 rounded text-[#0868F5] font-semibold">MONGODB_URI</code>:
            <div className="mt-1 font-mono text-[11px] bg-white p-2 rounded border border-[#C5DCFF] text-[#1E3A8A]">
              MONGODB_URI=mongodb+srv://user:pass@cluster0.mongodb.net/?retryWrites=true&w=majority
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-[#F8FAFD] border-t border-[#DCE9F8] flex items-center justify-between">
          <button
            type="button"
            onClick={onReseed}
            disabled={isReseeding}
            className="px-3.5 py-2 rounded-[8px] border border-[#DCE9F8] hover:bg-white text-[12.5px] font-semibold text-[#5475A7] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin' : ''}`} />
            <span>{isReseeding ? 'Resetting Collections...' : 'Reset / Seed Collections'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4.5 py-2 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
