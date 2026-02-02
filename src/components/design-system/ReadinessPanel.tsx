import React from 'react';

interface Issue {
  label: string;
  status: 'ok' | 'warning' | 'error';
  message?: string;
}

interface ReadinessPanelProps {
  title?: string;
  progress: number; // 0-100
  issues: Issue[];
  cta?: React.ReactNode;
  daysUntil?: number;
}

export const ReadinessPanel: React.FC<ReadinessPanelProps> = ({
  title = 'Readiness',
  progress,
  issues,
  cta,
  daysUntil,
}) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 dark:bg-zinc-950/80 p-6 mb-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg text-white">{title}</div>
        {typeof daysUntil === 'number' && (
          <div className="text-xs text-zinc-400">{daysUntil} days until release</div>
        )}
      </div>
      <div className="w-full h-2 bg-zinc-800 rounded-full mb-4">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {issues.map((issue, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/60">
            <span className={
              issue.status === 'ok' ? 'text-green-400' :
              issue.status === 'warning' ? 'text-yellow-400' :
              'text-red-400'
            }>
              {issue.status === 'ok' ? '✔️' : issue.status === 'warning' ? '⚠️' : '❌'}
            </span>
            <div>
              <div className="font-medium text-white text-sm">{issue.label}</div>
              {issue.message && <div className="text-xs text-zinc-400">{issue.message}</div>}
            </div>
          </div>
        ))}
      </div>
      {cta && <div className="flex justify-end">{cta}</div>}
    </div>
  );
};
