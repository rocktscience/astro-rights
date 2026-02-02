import React from 'react';

interface EntityHeaderProps {
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  coverUrl?: string;
  actions?: React.ReactNode;
}

export const EntityHeader: React.FC<EntityHeaderProps> = ({ title, subtitle, meta, coverUrl, actions }) => (
  <div className="flex items-center gap-6 p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 mb-6">
    {coverUrl && (
      <img src={coverUrl} alt="cover" className="w-20 h-20 rounded-lg object-cover border border-zinc-800" />
    )}
    <div className="flex-1">
      <div className="text-2xl font-bold text-white mb-1">{title}</div>
      {subtitle && <div className="text-zinc-400 text-sm mb-1">{subtitle}</div>}
      {meta && <div className="text-xs text-zinc-500">{meta}</div>}
    </div>
    {actions && <div className="flex gap-2">{actions}</div>}
  </div>
);
