import React, { useState } from 'react';
import { X, Edit2, FolderSync, Trash2, HelpCircle, CheckCircle2 } from 'lucide-react';
import { KnowledgeBaseDocument, KnowledgeDocumentCategory } from '../../../types';
import { KNOWLEDGE_BASE_CATEGORIES } from '../../../data/knowledgeBaseData';

interface RenameModalProps {
  isOpen: boolean;
  document: KnowledgeBaseDocument | null;
  onClose: () => void;
  onSave: (id: string, newTitle: string, newFilename: string) => void;
}

export const RenameDocumentModal: React.FC<RenameModalProps> = ({
  isOpen,
  document,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(document?.title || '');
  const [filename, setFilename] = useState(document?.filename || '');

  React.useEffect(() => {
    if (document && isOpen) {
      setTitle(document.title);
      setFilename(document.filename);
    }
  }, [document, isOpen]);

  if (!isOpen || !document) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !filename.trim()) return;
    const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    onSave(document.id, title.trim(), finalFilename);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B285C]/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[18px] border border-[#DCE9F8] shadow-2xl w-full max-w-md overflow-hidden text-left animate-scaleUp">
        <div className="p-5 bg-[#F8FAFD] border-b border-[#DCE9F8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-[#0868F5]" />
            <h3 className="text-[16px] font-bold text-[#0B285C]">Rename Document</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#EAF2FB] text-[#5475A7] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#0B285C] mb-1">
              Document Display Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-[8px] border border-[#DCE9F8] text-[13px] text-[#0B285C] focus:outline-hidden focus:border-[#0868F5]"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[#0B285C] mb-1">
              File Name (.pdf)
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-[8px] border border-[#DCE9F8] text-[13px] text-[#0B285C] focus:outline-hidden focus:border-[#0868F5]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[8px] border border-[#DCE9F8] text-[13px] font-semibold text-[#5475A7] hover:bg-[#F8FBFF] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4.5 py-2 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold cursor-pointer shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ChangeCategoryModalProps {
  isOpen: boolean;
  document: KnowledgeBaseDocument | null;
  onClose: () => void;
  onSave: (id: string, newCategory: KnowledgeDocumentCategory) => void;
}

export const ChangeCategoryModal: React.FC<ChangeCategoryModalProps> = ({
  isOpen,
  document,
  onClose,
  onSave,
}) => {
  const [category, setCategory] = useState<KnowledgeDocumentCategory>(
    document?.category || 'General Medicine'
  );

  React.useEffect(() => {
    if (document && isOpen) {
      setCategory(document.category);
    }
  }, [document, isOpen]);

  if (!isOpen || !document) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(document.id, category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B285C]/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[18px] border border-[#DCE9F8] shadow-2xl w-full max-w-md overflow-hidden text-left animate-scaleUp">
        <div className="p-5 bg-[#F8FAFD] border-b border-[#DCE9F8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderSync className="w-5 h-5 text-[#0868F5]" />
            <h3 className="text-[16px] font-bold text-[#0B285C]">Change Category</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#EAF2FB] text-[#5475A7] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-[13px] text-[#5475A7]">
            Select the appropriate hospital medical department for <strong className="text-[#0B285C]">{document.title}</strong>:
          </p>

          <div className="grid grid-cols-2 gap-2">
            {KNOWLEDGE_BASE_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`p-2.5 rounded-[10px] border text-left text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-between ${
                  category === cat.name
                    ? 'border-[#0868F5] bg-[#EAF4FF] text-[#0868F5] font-semibold'
                    : 'border-[#DCE9F8] hover:bg-[#F8FBFF] text-[#0B285C]'
                }`}
              >
                <span>{cat.name}</span>
                {category === cat.name && <CheckCircle2 className="w-4 h-4 text-[#0868F5]" />}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[8px] border border-[#DCE9F8] text-[13px] font-semibold text-[#5475A7] hover:bg-[#F8FBFF] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4.5 py-2 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold cursor-pointer shadow-xs"
            >
              Update Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  document: KnowledgeBaseDocument | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  document,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B285C]/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[18px] border border-[#DCE9F8] shadow-2xl w-full max-w-md p-6 text-left animate-scaleUp">
        <div className="w-12 h-12 rounded-full bg-[#FEECEC] text-[#DC2626] flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 className="text-[17px] font-bold text-[#0B285C] text-center">
          Delete Document?
        </h3>
        <p className="text-[13px] text-[#5475A7] text-center mt-1.5 leading-relaxed">
          Are you sure you want to remove <strong className="text-[#0B285C]">"{document.title}"</strong> from the MediCare Knowledge Base? This will remove indexed citations from the AI Assistant.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4.5 py-2.5 rounded-[10px] border border-[#DCE9F8] text-[13px] font-semibold text-[#5475A7] hover:bg-[#F8FBFF] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(document.id);
              onClose();
            }}
            className="px-5 py-2.5 rounded-[10px] bg-[#DC2626] hover:bg-[#b91c1c] text-white text-[13px] font-semibold cursor-pointer shadow-xs"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
}

export const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  isOpen,
  onClose,
  onSend,
}) => {
  const [subject, setSubject] = useState('Knowledge Base & RAG Ingestion Support');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B285C]/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[18px] border border-[#DCE9F8] shadow-2xl w-full max-w-md overflow-hidden text-left animate-scaleUp">
        <div className="p-5 bg-[#F8FAFD] border-b border-[#DCE9F8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#0868F5]" />
            <h3 className="text-[16px] font-bold text-[#0B285C]">Contact IT Support</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#EAF2FB] text-[#5475A7] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#0B285C] mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-[8px] border border-[#DCE9F8] text-[13px] text-[#0B285C] focus:outline-hidden focus:border-[#0868F5]"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[#0B285C] mb-1">
              Message or Technical Question
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your document ingestion question or request..."
              required
              className="w-full p-3 rounded-[8px] border border-[#DCE9F8] text-[13px] text-[#0B285C] focus:outline-hidden focus:border-[#0868F5] resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[8px] border border-[#DCE9F8] text-[13px] font-semibold text-[#5475A7] hover:bg-[#F8FBFF] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4.5 py-2 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold cursor-pointer shadow-xs"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
