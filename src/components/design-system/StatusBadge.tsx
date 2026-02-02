import React from 'react';

export type Status = 'ok' | 'warning' | 'error' | 'info';

const statusColors: Record<Status, string> = {
  ok: 'bg-green-500 text-white',
  warning: 'bg-yellow-400 text-zinc-900',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
};

export const StatusBadge: React.FC<{ status: Status; children: React.ReactNode }> = ({ status, children }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${statusColors[status]}`}>
    {children}
  </span>
);
