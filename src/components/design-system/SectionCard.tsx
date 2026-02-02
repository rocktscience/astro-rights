import React from 'react';

export const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 mb-6 ${className || ''}`}>
    <div className="font-semibold text-lg text-white mb-4">{title}</div>
    {children}
  </div>
);
