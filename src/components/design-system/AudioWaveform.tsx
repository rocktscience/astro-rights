import React from 'react';
// Placeholder for waveform preview. Integrate wavesurfer.js or similar for real waveform.

export const AudioWaveform: React.FC<{ duration: number }> = ({ duration }) => (
  <div className="w-full h-12 bg-zinc-800 rounded flex items-center relative overflow-hidden">
    <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center text-zinc-400 text-xs">
      [Waveform preview here] {duration ? `${Math.floor(duration/60)}:${(duration%60).toString().padStart(2,'0')}` : ''}
    </div>
  </div>
);
