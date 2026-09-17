import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { FAQS } from '../data/hospitalData';

interface FaqSectionProps {
  onStartChat: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onStartChat }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-16 lg:py-20 bg-[#F8FAFC] border-t border-[#EAF2FC]">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4FF] border border-[#D0E6FC] text-[#0878F9] text-[13px] font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-[30px] sm:text-[36px] font-black text-[#102A52] tracking-tight leading-tight mb-3">
            Common Patient Questions
          </h2>
          <p className="text-[15px] text-[#64748B] leading-relaxed">
            Everything you need to know about booking with our AI assistant and hospital services.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E2EEFC] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 sm:py-5 flex items-center justify-between text-left gap-4 font-bold text-[16px] text-[#102A52] hover:text-[#0878F9] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full bg-[#F5FAFF] flex items-center justify-center text-[#0878F9] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#EAF4FF]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-[14.5px] text-[#64748B] leading-relaxed border-t border-[#F1F5F9]/60">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="mt-10 p-6 rounded-2xl bg-[#EAF4FF] border border-[#D0E6FC] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-[16px] font-bold text-[#102A52]">
              Have a question not listed here?
            </h4>
            <p className="text-[13.5px] text-[#64748B] mt-0.5">
              Ask our AI assistant right now — it has up-to-date hospital information.
            </p>
          </div>
          <button
            onClick={onStartChat}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0878F9] hover:bg-[#0768D6] text-white text-[14px] font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask AI Assistant</span>
          </button>
        </div>

      </div>
    </section>
  );
};
