import React from 'react';

interface Metric {
  label: string;
  value: string;
  sublabel?: string;
}

interface HeroMetricsProps {
  metrics: Metric[];
}

export const HeroMetrics: React.FC<HeroMetricsProps> = ({ metrics }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
    {metrics.map((m, i) => (
      <div key={i} className="rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 flex flex-col items-center shadow">
        <div className="text-2xl font-bold text-white mb-1">{m.value}</div>
        <div className="text-xs text-zinc-400 uppercase tracking-wider">{m.label}</div>
        {m.sublabel && <div className="text-xs text-zinc-500 mt-1">{m.sublabel}</div>}
      </div>
    ))}
  </div>
);
