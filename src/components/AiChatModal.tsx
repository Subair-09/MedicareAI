import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Sparkles,
  ArrowRight,
  Phone,
  Shield,
  RotateCcw
} from 'lucide-react';
import { ChatMessage, AdminDoctor, AdminDepartment } from '../types';
import { api } from '../services/api';

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoctorName?: string;
  initialPrompt?: string;
}

export const AiChatModal: React.FC<AiChatModalProps> = ({
  isOpen,
  onClose,
  initialDoctorName,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [realDoctors, setRealDoctors] = useState<AdminDoctor[]>([]);
  const [realDepartments, setRealDepartments] = useState<AdminDepartment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.getDoctors(), api.getDepartments()])
      .then(([docs, depts]) => {
        if (isMounted) {
          setRealDoctors(docs || []);
          setRealDepartments(depts || []);
        }
      })
      .catch((err) => {
        console.warn('Could not load doctors in modal:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const resetChat = (doctorName?: string) => {
    if (doctorName) {
      setMessages([
        {
          id: '1',
          sender: 'ai',
          text: `Hi! 👋 I see you'd like to consult with ${doctorName}. Which day or time works best for you?`
        }
      ]);
    } else {
      setMessages([
        {
          id: '1',
          sender: 'ai',
          text: 'Hi! 👋 How can I help you today? You can book an appointment, reschedule, or ask any hospital question without creating an account.'
        }
      ]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialPrompt) {
        setMessages([
          {
            id: '1',
            sender: 'ai',
            text: 'Hi! 👋 How can I help you today?'
          },
          {
            id: '2',
            sender: 'patient',
            text: initialPrompt
          }
        ]);
        // Simulate response to initial prompt
        handleSimulatedReply(initialPrompt);
      } else {
        resetChat(initialDoctorName);
      }
    }
  }, [isOpen, initialDoctorName, initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSimulatedReply = (userInput: string) => {
    setIsTyping(true);
    const lower = userInput.toLowerCase();

    setTimeout(() => {
      setIsTyping(false);

      const matchedDoc = realDoctors.find(
        (d) =>
          lower.includes(d.name.toLowerCase()) ||
          lower.includes(d.specialty.toLowerCase()) ||
          lower.includes(d.department.toLowerCase())
      );

      if (matchedDoc) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            sender: 'ai',
            text: `Great! We have ${matchedDoc.name} (${matchedDoc.specialty}) available for consultations this week. Which time works best for you?`
          }
        ]);
      } else if (lower.includes('11:30') || lower.includes('11:00') || lower.includes('10:00') || lower.includes('2:00') || lower.includes('monday') || lower.includes('tuesday') || lower.includes('wednesday')) {
        const id = 'MC-' + Math.floor(10000 + Math.random() * 90000);
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            sender: 'ai',
            isConfirmation: true,
            appointmentId: id,
            text: `Your appointment is confirmed for your selected time slot!\nYour appointment ID is ${id}. An SMS confirmation has also been dispatched.`
          }
        ]);
      } else if (lower.includes('cancel') || lower.includes('reschedule')) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            sender: 'ai',
            text: 'I can certainly help you reschedule or cancel. Please provide your appointment ID or your contact phone number so I can locate your record.'
          }
        ]);
      } else {
        const deptNames = realDepartments.length > 0 
          ? realDepartments.map(d => d.name).slice(0, 5).join(', ')
          : 'Cardiology, Dermatology, Pediatrics, General Medicine, and Surgery';
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            sender: 'ai',
            text: `I can help you schedule an appointment with our specialists in ${deptNames}. Which department would you like to visit?`
          }
        ]);
      }
    }, 600);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'patient',
        text: userText
      }
    ]);

    handleSimulatedReply(userText);
  };

  const selectQuickOption = (optionText: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'patient',
        text: optionText
      }
    ]);
    handleSimulatedReply(optionText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A52]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2EEFC] overflow-hidden flex flex-col h-[640px] max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#102A52] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0878F9] flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold">MediCare AI Assistant</h3>
                <span className="text-[10px] bg-[#20B879]/20 text-[#4ADE80] font-semibold px-2 py-0.5 rounded-full border border-[#20B879]/30">
                  Live
                </span>
              </div>
              <p className="text-[11.5px] text-[#94A3B8]">
                Instant appointment booking • No account required
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => resetChat()}
              title="Reset conversation"
              className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-[#F5FAFF] px-4 py-2 border-b border-[#E2EEFC] flex items-center gap-2 overflow-x-auto text-[12px] no-scrollbar">
          <button
            onClick={() => selectQuickOption("I’d like to book an appointment with a dermatologist.")}
            className="shrink-0 bg-white hover:bg-[#EAF4FF] text-[#0878F9] px-3 py-1 rounded-full border border-[#D0E6FC] font-medium transition-colors cursor-pointer"
          >
            Dermatologist
          </button>
          <button
            onClick={() => selectQuickOption("I need a pediatrician for my child.")}
            className="shrink-0 bg-white hover:bg-[#EAF4FF] text-[#0878F9] px-3 py-1 rounded-full border border-[#D0E6FC] font-medium transition-colors cursor-pointer"
          >
            Pediatrician
          </button>
          <button
            onClick={() => selectQuickOption("Book an appointment with Dr. Michael Brown")}
            className="shrink-0 bg-white hover:bg-[#EAF4FF] text-[#0878F9] px-3 py-1 rounded-full border border-[#D0E6FC] font-medium transition-colors cursor-pointer"
          >
            Cardiologist
          </button>
          <button
            onClick={() => selectQuickOption("I need to reschedule my appointment")}
            className="shrink-0 bg-white hover:bg-[#EAF4FF] text-[#64748B] px-3 py-1 rounded-full border border-[#E2E8F0] font-medium transition-colors cursor-pointer"
          >
            Reschedule
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-gradient-to-b from-[#FAFCFF] to-white text-[13.5px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'patient' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#0878F9] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {msg.isConfirmation ? (
                <div className="max-w-[85%] bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] rounded-2xl rounded-tl-xs p-4 shadow-xs text-left">
                  <div className="flex items-center gap-2 mb-1 text-[14px] font-bold text-[#15803D]">
                    <CheckCircle2 className="w-5 h-5 text-[#20B879]" />
                    <span>Appointment Confirmed!</span>
                  </div>
                  <p className="whitespace-pre-line text-[13px] leading-relaxed mb-3">
                    {msg.text}
                  </p>
                  <div className="bg-white/80 rounded-xl p-2.5 border border-[#DCFCE7] flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-[#166534]">ID: {msg.appointmentId}</span>
                    <span className="text-[#15803D] font-medium">Ready at Reception</span>
                  </div>
                </div>
              ) : (
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed text-left ${
                    msg.sender === 'patient'
                      ? 'bg-[#0878F9] text-white rounded-tr-xs font-medium'
                      : 'bg-[#F1F5F9] text-[#102A52] rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              )}

              {msg.sender === 'patient' && (
                <div className="w-7 h-7 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#0878F9] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#F1F5F9] rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#94A3B8] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#94A3B8] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#94A3B8] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-[#EAF2FC] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message or pick a time slot..."
            className="flex-1 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white text-[14px] text-[#102A52] placeholder-[#94A3B8] px-4 py-2.5 rounded-full border border-[#E2E8F0] focus:border-[#0878F9] focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-[#0878F9] hover:bg-[#0768D6] disabled:bg-[#CBD5E1] text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 -ml-0.5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};
