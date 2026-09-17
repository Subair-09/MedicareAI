import React from 'react';
import {
  ChevronRight,
  Folder,
  Heart,
  Sparkles,
  Smile,
  Activity,
  Layers,
  Pill,
  AlertTriangle,
} from 'lucide-react';
import { KnowledgeDocumentCategory } from '../../../types';
import { KNOWLEDGE_BASE_CATEGORIES } from '../../../data/knowledgeBaseData';

interface DocumentCategoriesCardProps {
  selectedCategory: string;
  onSelectCategory: (cat: KnowledgeDocumentCategory | 'All Categories') => void;
  categoryCounts?: Record<string, number>;
}

export const DocumentCategoriesCard: React.FC<DocumentCategoriesCardProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const getCategoryIcon = (name: KnowledgeDocumentCategory) => {
    switch (name) {
      case 'General':
        return <Folder className="w-4 h-4" />;
      case 'Cardiology':
        return <Heart className="w-4 h-4" />;
      case 'Dermatology':
        return <Sparkles className="w-4 h-4" />;
      case 'Pediatrics':
        return <Smile className="w-4 h-4" />;
      case 'Orthopedics':
        return <Activity className="w-4 h-4" />;
      case 'Radiology':
        return <Layers className="w-4 h-4" />;
      case 'Pharmacy':
        return <Pill className="w-4 h-4" />;
      case 'Emergency':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Folder className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-[18px] border border-[#DCE9F8] p-5 shadow-[0_2px_10px_rgba(13,40,87,0.03)] text-left">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[16px] font-bold text-[#0B285C] tracking-tight">
          Document Categories
        </h3>
        {selectedCategory !== 'All Categories' && (
          <button
            type="button"
            onClick={() => onSelectCategory('All Categories')}
            className="text-[11.5px] font-semibold text-[#0868F5] hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* 8 Categories list matching reference */}
      <div className="space-y-1">
        {KNOWLEDGE_BASE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const count = categoryCounts ? categoryCounts[cat.name] ?? 0 : (cat.count ?? 0);

          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => onSelectCategory(isSelected ? 'All Categories' : cat.name)}
              className={`w-full flex items-center justify-between p-2 rounded-[10px] transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-[#EAF4FF] text-[#0868F5]'
                  : 'hover:bg-[#F8FBFF] text-[#0B285C]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 ${cat.iconBg} ${cat.iconColor}`}
                >
                  {getCategoryIcon(cat.name)}
                </div>
                <span className="text-[13px] font-semibold">
                  {cat.name}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#8AA3C6] group-hover:text-[#5475A7]">
                <span className="text-[12.5px] font-semibold">
                  {count}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
