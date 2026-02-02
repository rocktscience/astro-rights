import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder }) => {
  const [search, setSearch] = useState('');
  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="relative">
      <input
        className="w-full px-3 py-2 rounded border border-zinc-700 bg-zinc-900 text-white text-sm mb-1"
        placeholder={placeholder || 'Search...'}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="absolute z-10 w-full bg-zinc-900 border border-zinc-700 rounded shadow max-h-48 overflow-y-auto">
        {filtered.map(opt => (
          <div
            key={opt.value}
            className={`px-3 py-2 cursor-pointer hover:bg-zinc-800 ${opt.value === value ? 'bg-zinc-800' : ''}`}
            onClick={() => { onChange(opt.value); setSearch(''); }}
          >
            {opt.label}
          </div>
        ))}
        {filtered.length === 0 && <div className="px-3 py-2 text-zinc-500">No results</div>}
      </div>
    </div>
  );
};
