import React from 'react';

export const HeroIntro: React.FC = () => {
  return (
    <div className="text-left w-full">
      <h1 className="text-[28px] sm:text-[34px] lg:text-[36px] xl:text-[44px] 2xl:text-[48px] font-extrabold tracking-tight leading-[1.12] text-[#102A52]">
        Your Health
        <br />
        Assistant,
        <br />
        <span className="text-[#0878F9]">Powered by AI</span>
      </h1>

      <p className="mt-2.5 xl:mt-3.5 text-[13px] sm:text-[14px] xl:text-[15px] leading-relaxed text-[#5A6F8A] max-w-[420px]">
        Chat with our AI assistant to book, reschedule or cancel your appointment, get answers to your questions and more — all without signing up.
      </p>
    </div>
  );
};
