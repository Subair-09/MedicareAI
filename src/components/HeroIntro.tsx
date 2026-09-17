import React from 'react';

export const HeroIntro: React.FC = () => {
  return (
    <div className="text-left w-full">
      <h1 className="text-[44px] sm:text-[50px] lg:text-[56px] font-black tracking-tight leading-[1.08] text-[#102A52]">
        Your Health
        <br />
        Assistant,
        <br />
        <span className="text-[#0878F9]">Powered by AI</span>
      </h1>

      <p className="mt-5 text-[15.5px] sm:text-[16.5px] leading-relaxed text-[#5A6F8A] max-w-[420px]">
        Chat with our AI assistant to book, reschedule or cancel your appointment, get answers to your questions and more — all without signing up.
      </p>
    </div>
  );
};
