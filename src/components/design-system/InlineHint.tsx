import React from 'react';

export const InlineHint: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block ml-2 px-2 py-0.5 rounded bg-zinc-800 text-xs text-zinc-400 align-middle">{children}</span>
);
