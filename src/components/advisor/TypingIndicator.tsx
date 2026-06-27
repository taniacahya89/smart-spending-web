import React from 'react';

export const IndikatorMengetik: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 px-4.5 py-3 bg-surface border border-border rounded-2xl w-fit select-none">
      <span className="text-[11px] text-text-secondary font-semibold mr-1">Smart Spending AI sedang mengetik</span>
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};
